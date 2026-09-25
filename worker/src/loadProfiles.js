// loadProfiles.js — porta de portal/data/loadTrailsProfiles.js:loadProfiles() pro Worker (D1).
// Mesma lógica/queries do original; ver loadTrails.js pro comentário sobre a troca síncrono→async.
import { query, groupBy, slugify } from "./helpers.js";

export async function loadProfiles(db) {
  const [
    base,
    cboRows,
    sectorRows,
    trailRows,
    qualRows,
    specRows,
    graduacaoRows,
    normaRows,
    courseRows,
    premioRows,
    roteiroRows,
    sinRows,
    centRows,
    comRows,
    qualidadeCursoRows,
    pivotRows,
  ] = await Promise.all([
    query(db, `
      SELECT id, code, name, tier, ch, cnct_page, cbo_principal, carga_horaria, perfil_conclusao, campo_atuacao
      FROM cnct_profiles ORDER BY id
    `),
    query(db, `SELECT DISTINCT profile_id, codigo FROM cnct_cbos ORDER BY profile_id`),
    query(db, `SELECT profile_id, sector_code FROM cnct_profile_sector_codes`),
    query(db, `
      SELECT DISTINCT atp.profile_id AS profile_id, at.code AS code, at.atlas_num AS atlas_num
      FROM atlas_trail_profiles atp JOIN atlas_trails at ON at.id = atp.trail_id
    `),
    query(db, `SELECT profile_id, nome FROM cnct_qualificacoes WHERE tipo IN ('intermediaria','qualificacao')`),
    query(db, `
      SELECT profile_id, nome FROM cnct_qualificacoes WHERE tipo='especializacao'
      UNION
      SELECT cc.profile_id AS profile_id, ce.nome AS nome
      FROM course_especializacoes ce JOIN cnct_courses cc ON cc.id = ce.course_id
    `),
    query(db, `
      SELECT profile_id, curso AS nome FROM cnct_verticalizacao WHERE tipo IN ('Tecnólogo','Bacharelado/Engenharia')
      UNION
      SELECT cc.profile_id AS profile_id, cg.nome AS nome
      FROM course_graduacoes cg JOIN cnct_courses cc ON cc.id = cg.course_id
    `),
    query(db, `SELECT profile_id, norma FROM profile_normas`),
    query(db, `
      SELECT profile_id, nome, status_atlas, atlas_referencia,
             carga_horaria_min, carga_dias_uteis, pagina_cnct, normas_associadas,
             perfil_profissional, infraestrutura, palavras_chave,
             principais_certificacoes, num_certificacoes,
             principais_especializacoes, num_especializacoes,
             principais_graduacoes, num_graduacoes
      FROM cnct_courses WHERE profile_id IS NOT NULL
    `),
    query(db, `
      SELECT perfil_origem_id, perfil_destino_id, perfil_destino_nome, diferenca_mensal,
             horas_necessarias, tempo_meses, ganho_vitalicio, breakeven_meses, recomendacao
      FROM dm_premio_transferencia ORDER BY perfil_origem_id, ganho_vitalicio DESC
    `),
    query(db, `
      SELECT perfil_id, trail_id, ordem_trilha, ordem_passo, passo_nome, carga_horaria,
             carga_horaria_acumulada, tipo_passo, url_passo
      FROM dm_roteiro_carreira ORDER BY perfil_id, ordem_trilha, ordem_passo
    `),
    query(db, `SELECT profile_id_1, profile_id_2, nome_perfil_1, nome_perfil_2, overlap_percent, grau_sinonimo FROM dm_sinonimos_perfis`),
    query(db, `SELECT perfil_id, grau_conexoes, score_hub, classificacao_hub FROM dm_rede_centralidade`),
    query(db, `SELECT perfil_id, comunidade_id, tamanho_comunidade FROM dm_rede_comunidades`),
    query(db, `
      SELECT q.curso, q.instituicao, q.selo_emec, q.score_qualidade_total, q.confiabilidade,
             q.taxa_conclusao, q.taxa_evasao, q.taxa_ocupacao_egressos, q.salario_medio_pnad,
             o.uf, o.matriculas, o.vagas_ofertadas
      FROM dm_qualidade_preditiva q
      LEFT JOIN dm_oferta_real o ON o.instituicao = q.instituicao AND o.curso = q.curso
    `),
    query(db, `
      SELECT m.perfil_origem_id, m.perfil_destino_id, m.horas_necessarias, m.nivel_dificuldade,
             p.name AS destino_nome
      FROM dm_matriz_pivotamento m JOIN cnct_profiles p ON p.id = m.perfil_destino_id
      ORDER BY m.perfil_origem_id, m.horas_necessarias
    `),
  ]);

  const cboByProfile = groupBy(cboRows, "profile_id");
  const sectorsByProfile = groupBy(sectorRows, "profile_id");
  const trailsByProfile = groupBy(trailRows, "profile_id");
  const qualByProfile = groupBy(qualRows, "profile_id");
  const specByProfile = groupBy(specRows, "profile_id");
  const graduacaoByProfile = groupBy(graduacaoRows, "profile_id");
  const normaByProfile = groupBy(normaRows, "profile_id");

  const courseByProfile = {};
  courseRows.forEach((r) => {
    if (!courseByProfile[r.profile_id]) courseByProfile[r.profile_id] = r;
  });

  const premioByProfile = groupBy(premioRows, "perfil_origem_id");
  const roteiroByProfile = groupBy(roteiroRows, "perfil_id");

  const sinByProfile = {};
  sinRows.forEach((r) => {
    const add = (selfId, otherId, otherName) => {
      if (!sinByProfile[selfId]) sinByProfile[selfId] = [];
      sinByProfile[selfId].push({ outro_id: otherId, outro_nome: otherName, overlap: r.overlap_percent, grau: r.grau_sinonimo });
    };
    add(r.profile_id_1, r.profile_id_2, r.nome_perfil_2);
    add(r.profile_id_2, r.profile_id_1, r.nome_perfil_1);
  });
  const centByProfile = {};
  centRows.forEach((r) => { centByProfile[r.perfil_id] = { grau: r.grau_conexoes, score: r.score_hub, classificacao: r.classificacao_hub }; });
  const comByProfile = {};
  comRows.forEach((r) => { comByProfile[r.perfil_id] = { comunidade_id: r.comunidade_id, tamanho: r.tamanho_comunidade }; });

  const qualByProfileName = groupBy(qualidadeCursoRows, "curso");
  const pivotByOrigem = groupBy(pivotRows, "perfil_origem_id");

  return base.map((p) => {
    const trailsAtlas = (trailsByProfile[p.id] || []).map((t) => t.code);
    const trailsAtlasDetail = (trailsByProfile[p.id] || []).map((t) => ({ code: t.code, atlas_num: t.atlas_num }));
    const sectorsGuia = (sectorsByProfile[p.id] || []).map((s) => s.sector_code);
    const candidatesForProfile = courseRows.filter((r) => r.profile_id === p.id);
    const exactNameMatch = candidatesForProfile.find((r) => r.nome === p.name);
    const courseRow = exactNameMatch || candidatesForProfile[0] || null;
    return {
      id: p.id, name: p.name, tier: p.tier, ch: p.ch,
      cbo_principal: p.cbo_principal,
      cbo_list: (cboByProfile[p.id] || []).map((c) => c.codigo),
      sectors_guia: sectorsGuia,
      trails_atlas: trailsAtlas,
      trails_atlas_detail: trailsAtlasDetail,
      qualifications: (qualByProfile[p.id] || []).map((q) => q.nome),
      specializations: (specByProfile[p.id] || []).map((s) => s.nome),
      graduacoes: (graduacaoByProfile[p.id] || []).map((g) => g.nome),
      normas: (normaByProfile[p.id] || []).map((n) => n.norma),
      cnct_page: p.cnct_page,
      cnct_code: `${p.tier}-${String(p.id).padStart(2, "0")}`,
      trail_count: trailsAtlas.length,
      sector_count: sectorsGuia.length,
      cnct_slug: slugify(p.name),
      perfil_conclusao: p.perfil_conclusao,
      campo_atuacao: p.campo_atuacao,
      carga_horaria: p.carga_horaria,
      micro_atlas: courseRow ? {
        status_atlas: courseRow.status_atlas,
        atlas_referencia: courseRow.atlas_referencia,
        carga_horaria_min: courseRow.carga_horaria_min,
        carga_dias_uteis: courseRow.carga_dias_uteis,
        pagina_cnct: courseRow.pagina_cnct,
        normas_associadas: courseRow.normas_associadas,
        perfil_profissional: courseRow.perfil_profissional,
        infraestrutura: courseRow.infraestrutura,
        palavras_chave: courseRow.palavras_chave,
        principais_certificacoes: courseRow.principais_certificacoes,
        num_certificacoes: courseRow.num_certificacoes,
        principais_especializacoes: courseRow.principais_especializacoes,
        num_especializacoes: courseRow.num_especializacoes,
        principais_graduacoes: courseRow.principais_graduacoes,
        num_graduacoes: courseRow.num_graduacoes,
      } : null,
      premio_transferencia: (premioByProfile[p.id] || []).map((r) => ({
        destino_id: r.perfil_destino_id, destino_nome: r.perfil_destino_nome,
        diferenca_mensal: r.diferenca_mensal, horas_necessarias: r.horas_necessarias,
        tempo_meses: r.tempo_meses, ganho_vitalicio: r.ganho_vitalicio,
        breakeven_meses: r.breakeven_meses, recomendacao: r.recomendacao,
      })),
      roteiro_carreira: (roteiroByProfile[p.id] || []).map((r) => ({
        trail_id: r.trail_id, ordem_trilha: r.ordem_trilha, ordem_passo: r.ordem_passo,
        passo_nome: r.passo_nome, carga_horaria: r.carga_horaria,
        carga_acumulada: r.carga_horaria_acumulada, tipo_passo: r.tipo_passo, url: r.url_passo,
      })),
      sinonimos: sinByProfile[p.id] || [],
      rede_centralidade: centByProfile[p.id] || null,
      rede_comunidade: comByProfile[p.id] || null,
      onde_estudar: (qualByProfileName[p.name] || []).map((r) => ({
        instituicao: r.instituicao, selo_emec: r.selo_emec, score_qualidade: r.score_qualidade_total,
        confiabilidade: r.confiabilidade, taxa_conclusao: r.taxa_conclusao, taxa_ocupacao: r.taxa_ocupacao_egressos,
        salario_medio: r.salario_medio_pnad, uf: r.uf, vagas: r.vagas_ofertadas,
      })).sort((a, b) => (b.score_qualidade || 0) - (a.score_qualidade || 0)),
      matriz_pivotamento: (pivotByOrigem[p.id] || []).map((r) => ({
        destino_id: r.perfil_destino_id, destino_nome: r.destino_nome,
        horas: r.horas_necessarias, nivel: r.nivel_dificuldade,
      })),
    };
  });
}
