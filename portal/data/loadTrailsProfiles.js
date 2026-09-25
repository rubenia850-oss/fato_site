// data/loadTrailsProfiles.js — carga de trilhas do catálogo CNCT, perfis CNCT, blocos do
// Guia e trilhas Atlas.
// Extraído de App.jsx na Etapa 4 da quebra do monólito (D98/D102, 05/07/2026).
import { query } from "../db.js";
import { groupBy, slugify } from "../utils/helpers.js";

// M-04 — trails + trail_steps + trail_step_sources (escopo mantido: D54-DB=Opção C, sem expansão nesta sprint)
// SP-45 (15/07, Tier 1 item 2 do ESTUDO_VIABILIDADE): trail_escola_links + escola_sources —
// "onde estudar" por passo de trilha. Checagem própria (não só a do estudo): 894/894 linhas
// de trail_escola_links resolvem contra trails.id E escola_sources.id (0 órfãos em ambas as
// FKs) — melhor que os 508/894 estimados no estudo, então não há risco de dado quebrado aqui.
export function loadTrails(db) {
  const trailRows = query(db, `SELECT id, icon, name, cnct_label, color, description, descricao_geral FROM trails ORDER BY id`);
  const stepRows = query(db, `SELECT id AS step_id, trail_id, ordem, phase, note FROM trail_steps ORDER BY trail_id, ordem`);
  const stepSourceRows = query(db, `SELECT step_id, source_id FROM trail_step_sources`);
  const idsByStep = groupBy(stepSourceRows, "step_id");
  const stepsByTrail = groupBy(stepRows, "trail_id");

  const escolaLinkRows = query(db, `SELECT trail_id, step_ordem, escola_id, curso_nome, url_curso FROM trail_escola_links`);
  const escolaRows = query(db, `SELECT id, nome, url_referencia, tipo FROM escola_sources`);
  const escolaById = {};
  escolaRows.forEach(e => { escolaById[e.id] = e; });
  const escolasByTrailStep = {};
  escolaLinkRows.forEach(l => {
    const key = `${l.trail_id}|${l.step_ordem}`;
    (escolasByTrailStep[key] = escolasByTrailStep[key] || []).push({
      escola_id: l.escola_id,
      escola_nome: (escolaById[l.escola_id] || {}).nome || null,
      escola_tipo: (escolaById[l.escola_id] || {}).tipo || null, // SP-49
      curso_nome: l.curso_nome,
      url: l.url_curso,
    });
  });
  const profileRows = query(db, `SELECT trail_id, profile_id FROM trail_cnct_profiles`);
  const profilesByTrail = groupBy(profileRows, "trail_id");
  // SP-26: trail_cbos/trail_normas nunca tinham UI — nem toda trilha tem linha nas duas tabelas.
  const cboRows = query(db, `SELECT trail_id, codigo FROM trail_cbos`);
  const cbosByTrail = groupBy(cboRows, "trail_id");
  const normaRows = query(db, `SELECT trail_id, norma FROM trail_normas`);
  const normasByTrail = groupBy(normaRows, "trail_id");

  // SP-53 (item 12 do estudo de viabilidade, decisão de produto confirmada 17/07): trail_dependencies
  // liga um "Módulo Especializado"/"Sub-trilha" (child_id) à trilha-base da qual deriva (parent_id).
  // Só 14 linhas — anexado ao TrailCard nos dois sentidos (pai→filhas, filha→pai), mesmo padrão de
  // "trilhas-irmãs" já usado pro SP-35 (`variantes`).
  const depRows = query(db, `SELECT child_id, parent_id, tipo, temas_chave FROM trail_dependencies`);
  const nameById = {};
  trailRows.forEach(t => { nameById[t.id] = t.name; });
  const paiByChild = {};
  const filhasByParent = {};
  depRows.forEach(d => {
    paiByChild[d.child_id] = { id: d.parent_id, name: nameById[d.parent_id] || d.parent_id, tipo: d.tipo, temas_chave: d.temas_chave };
    (filhasByParent[d.parent_id] = filhasByParent[d.parent_id] || []).push({ id: d.child_id, name: nameById[d.child_id] || d.child_id, tipo: d.tipo, temas_chave: d.temas_chave });
  });

  // SP-35: detecta trilhas-irmãs (mesma trilha em modalidades diferentes, ex: presencial/EAD)
  // por nome-base após remover sufixo de modalidade entre parênteses — genérico, não hardcoded
  // pro par TRL-CNCT-004/030 que motivou o achado, funciona pra qualquer par futuro igual.
  const baseName = (n) => n.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const byBaseName = {};
  trailRows.forEach(t => {
    const b = baseName(t.name);
    (byBaseName[b] = byBaseName[b] || []).push(t);
  });
  const variantesById = {};
  Object.values(byBaseName).forEach(group => {
    if (group.length < 2) return;
    group.forEach(t => {
      variantesById[t.id] = group.filter(o => o.id !== t.id).map(o => ({ id: o.id, name: o.name }));
    });
  });

  return trailRows.map(t => ({
    id: t.id, icon: t.icon, name: t.name, cnct: t.cnct_label, color: t.color, description: t.description,
    nota_curadoria: t.descricao_geral || null, // SP-61
    steps: (stepsByTrail[t.id] || []).map(s => ({
      phase: s.phase, note: s.note, ordem: s.ordem,
      ids: (idsByStep[s.step_id] || []).map(x => x.source_id),
      escolas: escolasByTrailStep[`${t.id}|${s.ordem}`] || [], // SP-45
    })),
    cnct_profiles: (profilesByTrail[t.id] || []).map(p => p.profile_id),
    cbos: (cbosByTrail[t.id] || []).map(c => c.codigo),
    normas: (normasByTrail[t.id] || []).map(n => n.norma),
    variantes: variantesById[t.id] || [],
    derivada_de: paiByChild[t.id] || null, // SP-53
    derivadas: filhasByParent[t.id] || [], // SP-53
  }));
}

// M-05 — cnct_profiles + qualificações + verticalização + normas + sectores + trilhas Atlas
export function loadProfiles(db) {
  const base = query(db, `
    SELECT id, code, name, tier, ch, cnct_page, cbo_principal, carga_horaria, perfil_conclusao, campo_atuacao
    FROM cnct_profiles ORDER BY id
  `);
  const cboRows = query(db, `SELECT DISTINCT profile_id, codigo FROM cnct_cbos ORDER BY profile_id`);
  const cboByProfile = groupBy(cboRows, "profile_id");

  const sectorRows = query(db, `SELECT profile_id, sector_code FROM cnct_profile_sector_codes`);
  const sectorsByProfile = groupBy(sectorRows, "profile_id");

  // SP-48 (15/07): code sozinho não identifica a trilha de forma única — 28 códigos se repetem
  // entre 2 e 6 atlas_num diferentes (ex. C1 em I/II/III/V/VII). atlas_num vem junto aqui (via
  // at.id, sem ambiguidade) para permitir desambiguar no consumo (ViewProfiles.jsx).
  const trailRows = query(db, `
    SELECT DISTINCT atp.profile_id AS profile_id, at.code AS code, at.atlas_num AS atlas_num
    FROM atlas_trail_profiles atp JOIN atlas_trails at ON at.id = atp.trail_id
  `);
  const trailsByProfile = groupBy(trailRows, "profile_id");

  // v33: tipo='qualificacao' foi adicionado como alias/extensão de 'intermediaria' (ambos = qualificações)
  const qualRows = query(db, `SELECT profile_id, nome FROM cnct_qualificacoes WHERE tipo IN ('intermediaria','qualificacao')`);
  const qualByProfile = groupBy(qualRows, "profile_id");

  // SP-63 (item 11 do estudo de viabilidade, decisão de produto confirmada 18/07 — "junto com
  // Tecnólogo/Bacharelado"). Achado ao implementar, que MUDA a premissa do estudo original: o
  // estudo dizia que `course_graduacoes`/`course_especializacoes` são "estritamente mais completas"
  // que `cnct_verticalizacao`/`cnct_qualificacoes` — checagem perfil a perfil mostra que **não são**:
  // cobrem mais perfis no total (98 vs 85), mas em 30/85 perfis onde as duas fontes se sobrepõem, a
  // fonte "nova" tem MENOS itens que a antiga (perde nomes reais e específicos, ex. "Soldagem",
  // "Segurança do Trabalho", não lixo). São duas listagens parcialmente distintas, nenhuma um
  // superset da outra — juntar (união, deduplicada por nome) em vez de substituir é o único jeito
  // de não perder informação que já estava na tela. `course_graduacoes` não distingue Tecnólogo de
  // Bacharelado (por isso a Verticalização virou 1 coluna só, não 2) — a distinção que a decisão do
  // usuário perguntava ("3ª coluna ou junto") acabou resolvida pela seção "Especializações" (pills,
  // já existente) simplesmente ganhar mais itens, sem trocar de identidade visual.
  const specRows = query(db, `
    SELECT profile_id, nome FROM cnct_qualificacoes WHERE tipo='especializacao'
    UNION
    SELECT cc.profile_id AS profile_id, ce.nome AS nome
    FROM course_especializacoes ce JOIN cnct_courses cc ON cc.id = ce.course_id
  `);
  const specByProfile = groupBy(specRows, "profile_id");

  const graduacaoRows = query(db, `
    SELECT profile_id, curso AS nome FROM cnct_verticalizacao WHERE tipo IN ('Tecnólogo','Bacharelado/Engenharia')
    UNION
    SELECT cc.profile_id AS profile_id, cg.nome AS nome
    FROM course_graduacoes cg JOIN cnct_courses cc ON cc.id = cg.course_id
  `);
  const graduacaoByProfile = groupBy(graduacaoRows, "profile_id");

  const normaRows = query(db, `SELECT profile_id, norma FROM profile_normas`);
  const normaByProfile = groupBy(normaRows, "profile_id");

  // EXP-07 (Sprint 12): micro_atlas vem de cnct_courses, vinculado via profile_id.
  // Quando >1 curso aponta para o mesmo perfil (caso raro), prefere o de nome exatamente igual ao perfil.
  // [ATUALIZADO 16-17/07 — sessão de enxugamento de estrutura, ver PLANO_ENXUGAMENTO_ESTRUTURA.md]
  // 16/07: trocado de "só micro_atlas_pdf" (link pro PDF estático) pro registro completo de
  // cnct_courses, pra renderização dinâmica via MicroAtlasView (components/MicroAtlasView.jsx).
  // 17/07: os 78 PDFs físicos foram removidos do repositório (ver _DECISIONS.md D115) — a coluna
  // `micro_atlas_pdf` deixou de ser selecionada aqui, já que não há mais nenhum consumidor dela
  // no portal (o único uso, o botão "Baixar PDF", foi removido do componente na mesma sessão).
  // A coluna em si continua existindo em cnct_courses com paths agora inválidos — não é dado
  // que o SITE edita (Regra 0.1, _LEIA_PRIMEIRO.md); pedido formal registrado em _BACKLOG.md SP-52
  // para a sessão BANCO nulificar/remover a coluna do lado do banco.
  const courseRows = query(db, `
    SELECT profile_id, nome, status_atlas, atlas_referencia,
           carga_horaria_min, carga_dias_uteis, pagina_cnct, normas_associadas,
           perfil_profissional, infraestrutura, palavras_chave,
           principais_certificacoes, num_certificacoes,
           principais_especializacoes, num_especializacoes,
           principais_graduacoes, num_graduacoes
    FROM cnct_courses WHERE profile_id IS NOT NULL
  `);
  const courseByProfile = {};
  courseRows.forEach(r => {
    if (!courseByProfile[r.profile_id]) courseByProfile[r.profile_id] = r;
  });

  // SP-12 / Grupo B: dm_premio_transferencia (ganho ao migrar pra outro perfil) e
  // dm_roteiro_carreira (passo-a-passo com carga acumulada), ambas por cnct_profiles.id
  // (confirmado por JOIN direto, 0 divergências).
  const premioRows = query(db, `
    SELECT perfil_origem_id, perfil_destino_id, perfil_destino_nome, diferenca_mensal,
           horas_necessarias, tempo_meses, ganho_vitalicio, breakeven_meses, recomendacao
    FROM dm_premio_transferencia ORDER BY perfil_origem_id, ganho_vitalicio DESC
  `);
  const premioByProfile = groupBy(premioRows, "perfil_origem_id");
  const roteiroRows = query(db, `
    SELECT perfil_id, trail_id, ordem_trilha, ordem_passo, passo_nome, carga_horaria,
           carga_horaria_acumulada, tipo_passo, url_passo
    FROM dm_roteiro_carreira ORDER BY perfil_id, ordem_trilha, ordem_passo
  `);
  const roteiroByProfile = groupBy(roteiroRows, "perfil_id");

  // SP-12 / Grupo C: dm_sinonimos_perfis (é bidirecional: profile_id_1/2 — precisa checar os 2
  // lados), dm_rede_centralidade e dm_rede_comunidades (ambas por perfil_id, 0 divergências).
  const sinRows = query(db, `SELECT profile_id_1, profile_id_2, nome_perfil_1, nome_perfil_2, overlap_percent, grau_sinonimo FROM dm_sinonimos_perfis`);
  const sinByProfile = {};
  sinRows.forEach(r => {
    const add = (selfId, otherId, otherName) => {
      if (!sinByProfile[selfId]) sinByProfile[selfId] = [];
      sinByProfile[selfId].push({ outro_id: otherId, outro_nome: otherName, overlap: r.overlap_percent, grau: r.grau_sinonimo });
    };
    add(r.profile_id_1, r.profile_id_2, r.nome_perfil_2);
    add(r.profile_id_2, r.profile_id_1, r.nome_perfil_1);
  });
  const centRows = query(db, `SELECT perfil_id, grau_conexoes, score_hub, classificacao_hub FROM dm_rede_centralidade`);
  const centByProfile = {};
  centRows.forEach(r => { centByProfile[r.perfil_id] = { grau: r.grau_conexoes, score: r.score_hub, classificacao: r.classificacao_hub }; });
  const comRows = query(db, `SELECT perfil_id, comunidade_id, tamanho_comunidade FROM dm_rede_comunidades`);
  const comByProfile = {};
  comRows.forEach(r => { comByProfile[r.perfil_id] = { comunidade_id: r.comunidade_id, tamanho: r.tamanho_comunidade }; });

  // SP-12 / Grupo C: dm_qualidade_preditiva + dm_oferta_real, pareadas 1:1 por (instituicao,curso)
  // (confirmado por JOIN, 47/47). `curso` bate com cnct_profiles.name em 37/47 (78%) — os outros
  // 10 ficam órfãos de perfil (provavelmente curso técnico sem perfil CNCT exato correspondente)
  // e simplesmente não aparecem em nenhum perfil; não é erro, é cobertura parcial esperada.
  const qualidadeCursoRows = query(db, `
    SELECT q.curso, q.instituicao, q.selo_emec, q.score_qualidade_total, q.confiabilidade,
           q.taxa_conclusao, q.taxa_evasao, q.taxa_ocupacao_egressos, q.salario_medio_pnad,
           o.uf, o.matriculas, o.vagas_ofertadas
    FROM dm_qualidade_preditiva q
    LEFT JOIN dm_oferta_real o ON o.instituicao = q.instituicao AND o.curso = q.curso
  `);
  const qualByProfileName = groupBy(qualidadeCursoRows, "curso");

  // SP-45 (15/07, Tier 1 item 5 do ESTUDO_VIABILIDADE): dm_matriz_pivotamento — todo par
  // (origem,destino) com custo em horas + nível de dificuldade. Complementar (não substitui)
  // dm_premio_transferencia acima: aquela é qualitativa/financeira (vale a pena?), esta é
  // quantitativa (quanto custa em horas ir de X pra Y). Checagem própria: 0 órfãos contra
  // cnct_profiles.id nos dois lados (perfil_origem_id e perfil_destino_id), 0 pares (X,X).
  const pivotRows = query(db, `
    SELECT m.perfil_origem_id, m.perfil_destino_id, m.horas_necessarias, m.nivel_dificuldade,
           p.name AS destino_nome
    FROM dm_matriz_pivotamento m JOIN cnct_profiles p ON p.id = m.perfil_destino_id
    ORDER BY m.perfil_origem_id, m.horas_necessarias
  `);
  const pivotByOrigem = groupBy(pivotRows, "perfil_origem_id");

  return base.map(p => {
    const trailsAtlas = (trailsByProfile[p.id] || []).map(t => t.code);
    // SP-48: par (code, atlas_num) sem ambiguidade — usar este em vez de trails_atlas quando
    // for preciso resolver/comparar contra atlasTrails (code sozinho pode achar a trilha errada).
    const trailsAtlasDetail = (trailsByProfile[p.id] || []).map(t => ({ code: t.code, atlas_num: t.atlas_num }));
    const sectorsGuia = (sectorsByProfile[p.id] || []).map(s => s.sector_code);
    // Mesma lógica de antes (preferir nome exatamente igual ao perfil quando há mais de 1 curso
    // pro mesmo profile_id), agora sobre o registro completo de cnct_courses, não só o PDF.
    const candidatesForProfile = courseRows.filter(r => r.profile_id === p.id);
    const exactNameMatch = candidatesForProfile.find(r => r.nome === p.name);
    const courseRow = exactNameMatch || candidatesForProfile[0] || null;
    return {
      id: p.id, name: p.name, tier: p.tier, ch: p.ch,
      cbo_principal: p.cbo_principal,
      cbo_list: (cboByProfile[p.id] || []).map(c => c.codigo),
      sectors_guia: sectorsGuia,
      trails_atlas: trailsAtlas,
      trails_atlas_detail: trailsAtlasDetail, // SP-48
      qualifications: (qualByProfile[p.id] || []).map(q => q.nome),
      specializations: (specByProfile[p.id] || []).map(s => s.nome),
      graduacoes: (graduacaoByProfile[p.id] || []).map(g => g.nome), // SP-63
      normas: (normaByProfile[p.id] || []).map(n => n.norma),
      cnct_page: p.cnct_page,
      cnct_code: `${p.tier}-${String(p.id).padStart(2, "0")}`,
      trail_count: trailsAtlas.length,
      sector_count: sectorsGuia.length,
      cnct_slug: slugify(p.name),
      perfil_conclusao: p.perfil_conclusao,
      campo_atuacao: p.campo_atuacao,
      carga_horaria: p.carga_horaria,
      // [NOVO 16/07] campos completos de cnct_courses para renderização dinâmica via
      // MicroAtlasView — substituem a dependência do PDF estático como fonte de conteúdo.
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
      premio_transferencia: (premioByProfile[p.id] || []).map(r => ({
        destino_id: r.perfil_destino_id, destino_nome: r.perfil_destino_nome,
        diferenca_mensal: r.diferenca_mensal, horas_necessarias: r.horas_necessarias,
        tempo_meses: r.tempo_meses, ganho_vitalicio: r.ganho_vitalicio,
        breakeven_meses: r.breakeven_meses, recomendacao: r.recomendacao,
      })),
      roteiro_carreira: (roteiroByProfile[p.id] || []).map(r => ({
        trail_id: r.trail_id, ordem_trilha: r.ordem_trilha, ordem_passo: r.ordem_passo,
        passo_nome: r.passo_nome, carga_horaria: r.carga_horaria,
        carga_acumulada: r.carga_horaria_acumulada, tipo_passo: r.tipo_passo, url: r.url_passo,
      })),
      sinonimos: sinByProfile[p.id] || [],
      rede_centralidade: centByProfile[p.id] || null,
      rede_comunidade: comByProfile[p.id] || null,
      onde_estudar: (qualByProfileName[p.name] || []).map(r => ({
        instituicao: r.instituicao, selo_emec: r.selo_emec, score_qualidade: r.score_qualidade_total,
        confiabilidade: r.confiabilidade, taxa_conclusao: r.taxa_conclusao, taxa_ocupacao: r.taxa_ocupacao_egressos,
        salario_medio: r.salario_medio_pnad, uf: r.uf, vagas: r.vagas_ofertadas,
      })).sort((a,b)=>(b.score_qualidade||0)-(a.score_qualidade||0)),
      matriz_pivotamento: (pivotByOrigem[p.id] || []).map(r => ({ // SP-45
        destino_id: r.perfil_destino_id, destino_nome: r.destino_nome,
        horas: r.horas_necessarias, nivel: r.nivel_dificuldade,
      })),
    };
  });
}

// M-06 — sector_codes (Blocos do Guia)
export function loadGuideBlocks(db) {
  return query(db, `SELECT code, name, bloco, bloco_title, description FROM sector_codes ORDER BY bloco, code`);
}

// M-07 — atlas_trails + profiles + sectors + cbos + normas (D53-DB: Opção A para Atlas II)
// v33: atlas_nucleo (233 UCs) adicionado para os 8 Atlas com PARTE 3 (Atlas II cobre por cbos/normas — D53-DB)
// SP-62 (item 13 do estudo de viabilidade, decisão de produto confirmada 18/07 — "pode implementar
// agora, itens 1/3 já decididos"): atlas_docs (18 linhas) complementa atlas_trails/
// atlas_destination_profiles (mesma chave `num`/`atlas_num`) com o nome oficial do Atlas, os cursos
// CNCT de origem com página, e os códigos de bloco de competência do documento — cabeçalho/contexto
// ("este perfil vem do Atlas de Petroquímica, p. 218"), não substitui `atlas_trails.atlas_name`
// (que já existia, forma curta) — soma o que só `atlas_docs` tem.
function loadAtlasDocsMap(db) {
  const rows = query(db, `SELECT num, name, cnct_profiles, codigos_guia, versao FROM atlas_docs`);
  const byNum = {};
  rows.forEach(r => { byNum[r.num] = { name: r.name, fontes_cnct: r.cnct_profiles, codigos_guia: r.codigos_guia, versao: r.versao }; });
  return byNum;
}

export function loadAtlasTrails(db) {
  const base = query(db, `SELECT id, code, name, series, atlas_num, atlas_name, atlas_slug, description FROM atlas_trails ORDER BY id`);
  const profileRows = query(db, `SELECT trail_id, profile_id FROM atlas_trail_profiles`);
  const profilesByTrail = groupBy(profileRows, "trail_id");
  const sectorRows = query(db, `SELECT trail_id, sector_code FROM atlas_trail_sectors`);
  const sectorsByTrail = groupBy(sectorRows, "trail_id");
  const cboRows = query(db, `SELECT trail_id, codigo FROM atlas_trail_cbos`);
  const cbosByTrail = groupBy(cboRows, "trail_id");
  const normaRows = query(db, `SELECT trail_id, norma FROM atlas_trail_normas`);
  const normasByTrail = groupBy(normaRows, "trail_id");

  // EXP-06A (Sprint 8): nucleo curricular por Atlas
  const nucleoRows = query(db, `SELECT atlas_num, codigo, nome, carga FROM atlas_nucleo ORDER BY id`);
  const nucleoByAtlas = groupBy(nucleoRows, "atlas_num");

  // EXP-06B (Sprint 8): aproveitamento base e nivel por trilha
  const aprovRows = query(db, `SELECT code, aproveitamento_base, nivel_perfil FROM atlas_trail_aproveitamento`);
  const aprovByCode = {};
  aprovRows.forEach(r => { aprovByCode[r.code] = { aproveitamento: r.aproveitamento_base, nivel: r.nivel_perfil }; });

  // SP-12 / Grupo B: 4 das 6 tabelas dm_* usam atlas_trails.id como chave (confirmado por
  // JOIN direto contra atlas_trails, 0 divergências nas 4). As outras 2 (dm_premio_transferencia,
  // dm_roteiro_carreira) são por perfil CNCT — ver loadProfiles.
  const roiRows = query(db, `SELECT trail_id, carga_horaria_estimada, salario_estimado_destino, roi_por_hora FROM dm_roi_estudo`);
  const roiByTrail = {};
  roiRows.forEach(r => { roiByTrail[r.trail_id] = { carga: r.carga_horaria_estimada, salario: r.salario_estimado_destino, roi_hora: r.roi_por_hora }; });
  const dificRows = query(db, `SELECT trail_id, score_dificuldade, nivel, tem_pre_requisito FROM dm_dificuldade_estimada`);
  const dificByTrail = {};
  dificRows.forEach(r => { dificByTrail[r.trail_id] = { score: r.score_dificuldade, nivel: r.nivel, tem_pre_requisito: !!r.tem_pre_requisito }; });
  const tecRows = query(db, `SELECT trail_id, categoria, palavra_chave FROM dm_tecnologias_por_trilha`);
  const tecByTrail = groupBy(tecRows, "trail_id");
  const softRows = query(db, `SELECT trail_id, soft_skill, ocorrencias FROM dm_soft_skills_por_trilha ORDER BY ocorrencias DESC`);
  const softByTrail = groupBy(softRows, "trail_id");
  // SP-12 / Grupo C: dm_versatilidade_trilhas, mesma chave (atlas_trails.id, 0 divergências)
  const versRows = query(db, `SELECT trail_id, qtd_setores, classificacao, setores_list FROM dm_versatilidade_trilhas`);
  const versByTrail = {};
  versRows.forEach(r => { versByTrail[r.trail_id] = { qtd_setores: r.qtd_setores, classificacao: r.classificacao, setores: r.setores_list ? r.setores_list.split(",") : [] }; });

  // SP-45 (15/07, Tier 1 item 3 do ESTUDO_VIABILIDADE): atlas_trail_detail — currículo real
  // por trilha × nível (perfil de saída, tópicos, carga estimada, normas do nível). Checagem
  // própria: 74/74 linhas resolvem contra atlas_trails.id, 0 órfãos, 0 nulos em curriculo/perfil_saida.
  const detailRows = query(db, `
    SELECT trail_id, nivel, nivel_num, perfil_saida, curriculo, carga_estimada, normas_ref
    FROM atlas_trail_detail ORDER BY trail_id, nivel_num
  `);
  const detailByTrail = groupBy(detailRows, "trail_id");
  const parseNormasRef = (raw) => {
    if (!raw) return [];
    try { const v = JSON.parse(raw); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  };

  const atlasDocsByNum = loadAtlasDocsMap(db); // SP-62

  return base.map(t => ({
    code: t.code, name: t.name, series: t.series, atlas_num: t.atlas_num,
    atlas_name: t.atlas_name, atlas_slug: t.atlas_slug, description: t.description,
    atlas_doc: atlasDocsByNum[t.atlas_num] || null, // SP-62
    profiles: (profilesByTrail[t.id] || []).map(p => p.profile_id),
    sectors_guia: (sectorsByTrail[t.id] || []).map(s => s.sector_code),
    cbos: (cbosByTrail[t.id] || []).map(c => c.codigo),
    normas: (normasByTrail[t.id] || []).map(n => n.norma),
    nucleo: (nucleoByAtlas[t.atlas_num] || []).map(u => ({ codigo: u.codigo, nome: u.nome, carga: u.carga })),
    aproveitamento: (aprovByCode[t.code] || {}).aproveitamento || null,
    nivel_perfil: (aprovByCode[t.code] || {}).nivel || null,
    roi: roiByTrail[t.id] || null,
    dificuldade: dificByTrail[t.id] || null,
    tecnologias: (tecByTrail[t.id] || []).map(x => ({ categoria: x.categoria, termo: x.palavra_chave })),
    soft_skills: (softByTrail[t.id] || []).map(x => ({ skill: x.soft_skill, ocorrencias: x.ocorrencias })),
    versatilidade: versByTrail[t.id] || null,
    curriculo_detalhado: (detailByTrail[t.id] || []).map(d => ({ // SP-45
      nivel: d.nivel, nivel_num: d.nivel_num, perfil_saida: d.perfil_saida,
      topicos: d.curriculo ? d.curriculo.split("·").map(x => x.trim()).filter(Boolean) : [],
      carga_estimada: d.carga_estimada,
      normas: parseNormasRef(d.normas_ref),
    })),
  }));
}

// SP-45 (15/07, Tier 1 item 1 do ESTUDO_VIABILIDADE): atlas_destination_profiles — "Perfis de
// Elite", conteúdo editorial pronto (combinação de 2-4 trilhas Atlas). O vínculo com as trilhas
// componentes é textual (não uma FK declarada) — extraído aqui por regex, uma vez, para não
// repetir o parse em cada render.
// ACHADO (verificação própria, não estava no estudo): o texto NÃO segue um único formato.
// Checando as 55 linhas reais, existem pelo menos 3 templates: (1) "**Trilhas**: A2 + A3 + D3 +
// D5" em linha própria (perfis "Elite" quádrupla) — o que o estudo mostrou na amostra; (2)
// "**Trilhas:** N1+N2 + M1 · **Aproveitamento...**: 85%" na mesma linha que outros campos
// (perfis "Saídas Sequenciais"); (3) 8 perfis "consolidados" (ex. PE-SEG) que descrevem o
// pré-requisito em prosa livre ("Série N completa (N1+N2+N3+N4) + pelo menos duas trilhas da
// Série C..."), sem um campo estruturado — parse por regex arriscaria extrair errado, então
// esses ficam com trilhas=[] (o texto completo continua visível na descrição, só não vira pill
// clicável). O regex abaixo cobre (1) e (2) — 47/55 com trilhas extraídas, 0 código extraído
// que não bata contra atlas_trails.code (checado par a par).
export function loadElitePerfis(db) {
  const rows = query(db, `
    SELECT atlas_num, code, name, categoria, nivel, nivel_perfil, descricao_completa
    FROM atlas_destination_profiles ORDER BY atlas_num, code
  `);
  const atlasDocsByNum = loadAtlasDocsMap(db); // SP-62
  const trailsRe = /\*\*Trilhas:?\*\*:?\s*([^\n·]+)/;
  return rows.map(r => {
    const m = r.descricao_completa && r.descricao_completa.match(trailsRe);
    const trilhas = m ? m[1].split("+").map(s => s.trim()).filter(Boolean) : [];
    return {
      atlas_num: r.atlas_num, code: r.code, name: r.name, categoria: r.categoria,
      nivel: r.nivel, nivel_perfil: r.nivel_perfil, trilhas,
      descricao: r.descricao_completa || "",
      atlas_doc: atlasDocsByNum[r.atlas_num] || null, // SP-62
    };
  });
}

// SP-47 (15/07, achado no SP-45 § A do ESTUDO_VIABILIDADE): catálogo de normas via reverse-index
// de atlas_trail_detail.normas_ref, alternativa ao item bloqueado no SP-46 (normas_fato.descricao
// só preenchida em 44/265, boa parte corrompida — não usamos esse campo como texto principal).
// SP-46 dedup pelo BANCO em 18/07 (295→265 linhas, duplicatas tipo "Lei nº X" vs "Lei nº nº X"
// removidas) — a parte de conteúdo (descricao corrompida) segue sem correção, só a duplicata.
// Checagem própria: 166/265 (63%) dos códigos de normas_fato aparecem em pelo menos 1 normas_ref
// de atlas_trail_detail (json.loads de cada linha vs. normas_fato.codigo, set comparison).
// tipo_norma, ao contrário de descricao, está 295/295 preenchido — usado aqui mesmo sem descricao.
export function loadNormasCatalogo(db) {
  const metaRows = query(db, `SELECT codigo, descricao, tipo_norma FROM normas_fato`);
  const metaByCodigo = {};
  metaRows.forEach(r => { metaByCodigo[r.codigo] = { descricao: r.descricao || null, tipo_norma: r.tipo_norma || null }; });

  const detailRows = query(db, `
    SELECT atd.trail_id, atd.nivel, atd.normas_ref, at.code AS trail_code, at.atlas_num
    FROM atlas_trail_detail atd JOIN atlas_trails at ON at.id = atd.trail_id
    WHERE atd.normas_ref IS NOT NULL
  `);
  const trilhasByNorma = {};
  detailRows.forEach(r => {
    let codigos = [];
    try { const v = JSON.parse(r.normas_ref); if (Array.isArray(v)) codigos = v; } catch (e) { /* linha sem JSON válido, ignorada */ }
    codigos.forEach(cod => {
      (trilhasByNorma[cod] = trilhasByNorma[cod] || []).push({
        trail_code: r.trail_code, atlas_num: r.atlas_num, nivel: r.nivel,
      });
    });
  });

  // União dos códigos conhecidos por normas_fato E dos citados em normas_ref (podem existir
  // códigos citados em normas_ref sem linha correspondente em normas_fato — 0 casos checados
  // nesta versão do dado, mas a União evita perder algum caso futuro silenciosamente).
  const todosCodigos = new Set([...Object.keys(metaByCodigo), ...Object.keys(trilhasByNorma)]);

  const catalogo = {};
  todosCodigos.forEach(codigo => {
    catalogo[codigo] = {
      codigo,
      descricao: (metaByCodigo[codigo] || {}).descricao || null,
      tipo_norma: (metaByCodigo[codigo] || {}).tipo_norma || null,
      trilhas: trilhasByNorma[codigo] || [],
    };
  });
  return catalogo;
}
