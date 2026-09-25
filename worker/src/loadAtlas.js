// loadAtlas.js — porta de portal/data/loadTrailsProfiles.js: loadGuideBlocks(), loadAtlasTrails(),
// loadElitePerfis(), loadNormasCatalogo() pro Worker (D1). Mesma lógica/queries/comentários do
// original; ver loadTrails.js pro comentário sobre a troca síncrono→async.
import { query, groupBy } from "./helpers.js";

export async function loadGuideBlocks(db) {
  return query(db, `SELECT code, name, bloco, bloco_title, description FROM sector_codes ORDER BY bloco, code`);
}

// M-07 — atlas_trails + profiles + sectors + cbos + normas (D53-DB: Opção A para Atlas II)
// v33: atlas_nucleo (233 UCs) adicionado para os 8 Atlas com PARTE 3 (Atlas II cobre por cbos/normas — D53-DB)
// SP-62: atlas_docs (18 linhas) complementa atlas_trails/atlas_destination_profiles (mesma chave
// `num`/`atlas_num`) com o nome oficial do Atlas, os cursos CNCT de origem com página, e os
// códigos de bloco de competência do documento — não substitui `atlas_trails.atlas_name`, soma o
// que só `atlas_docs` tem.
async function loadAtlasDocsMap(db) {
  const rows = await query(db, `SELECT num, name, cnct_profiles, codigos_guia, versao FROM atlas_docs`);
  const byNum = {};
  rows.forEach((r) => { byNum[r.num] = { name: r.name, fontes_cnct: r.cnct_profiles, codigos_guia: r.codigos_guia, versao: r.versao }; });
  return byNum;
}

export async function loadAtlasTrails(db) {
  const [
    base, profileRows, sectorRows, cboRows, normaRows, nucleoRows, aprovRows,
    roiRows, dificRows, tecRows, softRows, versRows, detailRows, atlasDocsByNum,
  ] = await Promise.all([
    query(db, `SELECT id, code, name, series, atlas_num, atlas_name, atlas_slug, description FROM atlas_trails ORDER BY id`),
    query(db, `SELECT trail_id, profile_id FROM atlas_trail_profiles`),
    query(db, `SELECT trail_id, sector_code FROM atlas_trail_sectors`),
    query(db, `SELECT trail_id, codigo FROM atlas_trail_cbos`),
    query(db, `SELECT trail_id, norma FROM atlas_trail_normas`),
    // EXP-06A (Sprint 8): nucleo curricular por Atlas
    query(db, `SELECT atlas_num, codigo, nome, carga FROM atlas_nucleo ORDER BY id`),
    // EXP-06B (Sprint 8): aproveitamento base e nivel por trilha
    query(db, `SELECT code, aproveitamento_base, nivel_perfil FROM atlas_trail_aproveitamento`),
    // SP-12 / Grupo B: 4 das 6 tabelas dm_* usam atlas_trails.id como chave (confirmado por
    // JOIN direto contra atlas_trails, 0 divergências nas 4). As outras 2 (dm_premio_transferencia,
    // dm_roteiro_carreira) são por perfil CNCT — ver loadProfiles.
    query(db, `SELECT trail_id, carga_horaria_estimada, salario_estimado_destino, roi_por_hora FROM dm_roi_estudo`),
    query(db, `SELECT trail_id, score_dificuldade, nivel, tem_pre_requisito FROM dm_dificuldade_estimada`),
    query(db, `SELECT trail_id, categoria, palavra_chave FROM dm_tecnologias_por_trilha`),
    query(db, `SELECT trail_id, soft_skill, ocorrencias FROM dm_soft_skills_por_trilha ORDER BY ocorrencias DESC`),
    // SP-12 / Grupo C: dm_versatilidade_trilhas, mesma chave (atlas_trails.id, 0 divergências)
    query(db, `SELECT trail_id, qtd_setores, classificacao, setores_list FROM dm_versatilidade_trilhas`),
    // SP-45: atlas_trail_detail — currículo real por trilha × nível (perfil de saída, tópicos,
    // carga estimada, normas do nível). Checagem própria: 74/74 linhas resolvem contra
    // atlas_trails.id, 0 órfãos, 0 nulos em curriculo/perfil_saida.
    query(db, `
      SELECT trail_id, nivel, nivel_num, perfil_saida, curriculo, carga_estimada, normas_ref
      FROM atlas_trail_detail ORDER BY trail_id, nivel_num
    `),
    loadAtlasDocsMap(db), // SP-62
  ]);

  const profilesByTrail = groupBy(profileRows, "trail_id");
  const sectorsByTrail = groupBy(sectorRows, "trail_id");
  const cbosByTrail = groupBy(cboRows, "trail_id");
  const normasByTrail = groupBy(normaRows, "trail_id");
  const nucleoByAtlas = groupBy(nucleoRows, "atlas_num");

  const aprovByCode = {};
  aprovRows.forEach((r) => { aprovByCode[r.code] = { aproveitamento: r.aproveitamento_base, nivel: r.nivel_perfil }; });
  const roiByTrail = {};
  roiRows.forEach((r) => { roiByTrail[r.trail_id] = { carga: r.carga_horaria_estimada, salario: r.salario_estimado_destino, roi_hora: r.roi_por_hora }; });
  const dificByTrail = {};
  dificRows.forEach((r) => { dificByTrail[r.trail_id] = { score: r.score_dificuldade, nivel: r.nivel, tem_pre_requisito: !!r.tem_pre_requisito }; });
  const tecByTrail = groupBy(tecRows, "trail_id");
  const softByTrail = groupBy(softRows, "trail_id");
  const versByTrail = {};
  versRows.forEach((r) => { versByTrail[r.trail_id] = { qtd_setores: r.qtd_setores, classificacao: r.classificacao, setores: r.setores_list ? r.setores_list.split(",") : [] }; });

  const detailByTrail = groupBy(detailRows, "trail_id");
  const parseNormasRef = (raw) => {
    if (!raw) return [];
    try { const v = JSON.parse(raw); return Array.isArray(v) ? v : []; } catch (e) { return []; }
  };

  return base.map((t) => ({
    code: t.code, name: t.name, series: t.series, atlas_num: t.atlas_num,
    atlas_name: t.atlas_name, atlas_slug: t.atlas_slug, description: t.description,
    atlas_doc: atlasDocsByNum[t.atlas_num] || null, // SP-62
    profiles: (profilesByTrail[t.id] || []).map((p) => p.profile_id),
    sectors_guia: (sectorsByTrail[t.id] || []).map((s) => s.sector_code),
    cbos: (cbosByTrail[t.id] || []).map((c) => c.codigo),
    normas: (normasByTrail[t.id] || []).map((n) => n.norma),
    nucleo: (nucleoByAtlas[t.atlas_num] || []).map((u) => ({ codigo: u.codigo, nome: u.nome, carga: u.carga })),
    aproveitamento: (aprovByCode[t.code] || {}).aproveitamento || null,
    nivel_perfil: (aprovByCode[t.code] || {}).nivel || null,
    roi: roiByTrail[t.id] || null,
    dificuldade: dificByTrail[t.id] || null,
    tecnologias: (tecByTrail[t.id] || []).map((x) => ({ categoria: x.categoria, termo: x.palavra_chave })),
    soft_skills: (softByTrail[t.id] || []).map((x) => ({ skill: x.soft_skill, ocorrencias: x.ocorrencias })),
    versatilidade: versByTrail[t.id] || null,
    curriculo_detalhado: (detailByTrail[t.id] || []).map((d) => ({ // SP-45
      nivel: d.nivel, nivel_num: d.nivel_num, perfil_saida: d.perfil_saida,
      topicos: d.curriculo ? d.curriculo.split("·").map((x) => x.trim()).filter(Boolean) : [],
      carga_estimada: d.carga_estimada,
      normas: parseNormasRef(d.normas_ref),
    })),
  }));
}

// SP-45 (Tier 1 item 1 do ESTUDO_VIABILIDADE): atlas_destination_profiles — "Perfis de Elite",
// conteúdo editorial pronto (combinação de 2-4 trilhas Atlas). O vínculo com as trilhas
// componentes é textual (não uma FK declarada) — extraído aqui por regex, uma vez, para não
// repetir o parse em cada render.
// ACHADO (verificação própria, não estava no estudo): o texto NÃO segue um único formato.
// Checando as 55 linhas reais, existem pelo menos 3 templates: (1) "**Trilhas**: A2 + A3 + D3 +
// D5" em linha própria (perfis "Elite" quádrupla); (2) "**Trilhas:** N1+N2 + M1 ·
// **Aproveitamento...**: 85%" na mesma linha que outros campos (perfis "Saídas Sequenciais");
// (3) 8 perfis "consolidados" (ex. PE-SEG) que descrevem o pré-requisito em prosa livre, sem
// campo estruturado — parse por regex arriscaria extrair errado, então esses ficam com
// trilhas=[] (o texto completo continua visível na descrição). O regex abaixo cobre (1) e (2) —
// 47/55 com trilhas extraídas, 0 código extraído que não bata contra atlas_trails.code.
export async function loadElitePerfis(db) {
  const [rows, atlasDocsByNum] = await Promise.all([
    query(db, `
      SELECT atlas_num, code, name, categoria, nivel, nivel_perfil, descricao_completa
      FROM atlas_destination_profiles ORDER BY atlas_num, code
    `),
    loadAtlasDocsMap(db), // SP-62
  ]);
  const trailsRe = /\*\*Trilhas:?\*\*:?\s*([^\n·]+)/;
  return rows.map((r) => {
    const m = r.descricao_completa && r.descricao_completa.match(trailsRe);
    const trilhas = m ? m[1].split("+").map((s) => s.trim()).filter(Boolean) : [];
    return {
      atlas_num: r.atlas_num, code: r.code, name: r.name, categoria: r.categoria,
      nivel: r.nivel, nivel_perfil: r.nivel_perfil, trilhas,
      descricao: r.descricao_completa || "",
      atlas_doc: atlasDocsByNum[r.atlas_num] || null, // SP-62
    };
  });
}

// SP-47 (achado no SP-45 § A do ESTUDO_VIABILIDADE): catálogo de normas via reverse-index de
// atlas_trail_detail.normas_ref, alternativa ao item bloqueado no SP-46 (normas_fato.descricao só
// preenchida em 44/265, boa parte corrompida — não usamos esse campo como texto principal).
// SP-46 dedup pelo BANCO (295→265 linhas, duplicatas tipo "Lei nº X" vs "Lei nº nº X" removidas)
// — a parte de conteúdo (descricao corrompida) segue sem correção, só a duplicata. Checagem
// própria: 166/265 (63%) dos códigos de normas_fato aparecem em pelo menos 1 normas_ref de
// atlas_trail_detail. tipo_norma, ao contrário de descricao, está 295/295 preenchido — usado
// aqui mesmo sem descricao.
export async function loadNormasCatalogo(db) {
  const [metaRows, detailRows] = await Promise.all([
    query(db, `SELECT codigo, descricao, tipo_norma FROM normas_fato`),
    query(db, `
      SELECT atd.trail_id, atd.nivel, atd.normas_ref, at.code AS trail_code, at.atlas_num
      FROM atlas_trail_detail atd JOIN atlas_trails at ON at.id = atd.trail_id
      WHERE atd.normas_ref IS NOT NULL
    `),
  ]);

  const metaByCodigo = {};
  metaRows.forEach((r) => { metaByCodigo[r.codigo] = { descricao: r.descricao || null, tipo_norma: r.tipo_norma || null }; });

  const trilhasByNorma = {};
  detailRows.forEach((r) => {
    let codigos = [];
    try { const v = JSON.parse(r.normas_ref); if (Array.isArray(v)) codigos = v; } catch (e) { /* linha sem JSON válido, ignorada */ }
    codigos.forEach((cod) => {
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
  todosCodigos.forEach((codigo) => {
    catalogo[codigo] = {
      codigo,
      descricao: (metaByCodigo[codigo] || {}).descricao || null,
      tipo_norma: (metaByCodigo[codigo] || {}).tipo_norma || null,
      trilhas: trilhasByNorma[codigo] || [],
    };
  });
  return catalogo;
}
