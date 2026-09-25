// loadSocialTechnical.js — porta de portal/data/loadSocialTechnical.js pro Worker (D1). Mesma
// lógica/queries/comentários do original; ver loadTrails.js pro comentário sobre a troca
// síncrono→async. Composição idêntica à de loadCore.js: tagsAndFormats/sourceTags/
// courseEnrichment calculados uma vez, social e technical os consomem.
import { query, groupBy } from "./helpers.js";

// M-10 — tags + tag_meta + format_meta (elimina TAG_COLORS/FORMAT_META hardcoded — D61)
export async function loadTagsAndFormats(db) {
  const [tagRows, formatRows] = await Promise.all([
    query(db, `SELECT t.name AS name, tm.color AS color FROM tags t JOIN tag_meta tm ON tm.tag_id=t.id`),
    query(db, `SELECT code, label, color, bg FROM format_meta`),
  ]);
  const tagColors = {};
  tagRows.forEach((r) => { tagColors[r.name] = r.color; });
  const formatMeta = {};
  formatRows.forEach((r) => { formatMeta[r.code] = { label: r.label, color: r.color, bg: r.bg }; });
  return { tagColors, formatMeta };
}

// Tags por source_id (compartilhado entre M-02 e M-03)
export async function loadSourceTags(db) {
  const rows = await query(db, `SELECT st.source_id AS source_id, t.name AS name FROM source_tags st JOIN tags t ON t.id=st.tag_id`);
  const byId = groupBy(rows, "source_id");
  const out = {};
  for (const id in byId) out[id] = byId[id].map((r) => r.name);
  return out;
}

// M-02 — sources layer=social + companies + source_tags/tag_meta
export async function loadSocial(db, tagsBySource) {
  const [rows, cnctRows, programRowsRaw] = await Promise.all([
    query(db, `
      SELECT s.id AS id, s.layer AS layer, c.name AS company, sec.name AS sector, s.uf AS uf,
             s.program AS program, s.format AS format, s.national AS national, s.free AS free,
             s.lang AS lang, s.cadastro AS cadastro, s.highlight AS highlight, s.audience AS audience,
             s.url AS url, s.batch AS batch, s.data_layer AS data_layer,
             s.cost_range AS cost_range, s.cost_note AS cost_note, s.source_doc AS source_doc
      FROM sources s
      LEFT JOIN companies c ON c.id = s.company_id
      LEFT JOIN sectors sec ON sec.id = s.sector_id AND sec.type='social'
      WHERE s.layer='social'
      ORDER BY s.id
    `),
    // SP-55 (item 9 do estudo de viabilidade, decisão de produto confirmada 17/07): loadSocial()
    // nunca lia `source_cnct_profiles` — 699 vínculos fonte↔perfil existentes pra layer=social, 0
    // expostos até então. `guia_source_profiles` (a 2ª tabela do item 9) tem 0 linhas pra
    // layer=social — a "soma" pedida não muda nada aqui especificamente, mas o achado de
    // loadSocial nunca ter lido nem a 1ª tabela é o ganho real desta correção.
    query(db, `
      SELECT scp.source_id AS source_id, cp.id AS profile_id, cp.code AS code, cp.name AS name, cp.tier AS tier
      FROM source_cnct_profiles scp JOIN cnct_profiles cp ON cp.id = scp.profile_id
    `),
    // SP-56 (item 7 do estudo de viabilidade, decisão de produto confirmada 17/07 — "mesclar"):
    // sector_programs (174 linhas, 94 empresas) é uma 2ª fonte de programas sociais/formação por
    // empresa que loadSocial nunca lia. Mesclado na mesma lista, id prefixado `sp-N`.
    // sector_programs não tem `url` — link "Acessar portal" do SourceCard é condicional no SITE.
    query(db, `
      SELECT sp.id AS id, c.name AS company, sp.programa AS program, sp.formato AS format,
             sp.publico AS audience, sp.custo AS custo, sp.detalhe AS highlight, sp.industry_sector_id
      FROM sector_programs sp JOIN companies c ON c.id = sp.company_id
    `),
  ]);

  const cnctBySource = groupBy(cnctRows, "source_id");
  const programRows = programRowsRaw.map((p) => ({
    id: `sp-${p.id}`, layer: "social", company: p.company, sector: null, uf: null,
    program: p.program, format: p.format, national: false, free: null, lang: null, cadastro: false,
    highlight: p.highlight, audience: p.audience, url: null, batch: null, data_layer: "sector_programs",
    cost_range: p.custo, cost_note: null, source_doc: null,
    tags: [], cnct: [], cnct_hint: null, verified: true,
  }));

  return rows.map((r) => {
    const cncts = cnctBySource[r.id] || [];
    return {
      ...r,
      national: !!r.national, free: !!r.free, cadastro: !!r.cadastro,
      tags: tagsBySource[r.id] || [],
      cnct: cncts.map((c) => `${c.code} ${c.name}`), // SP-55
      cnct_hint: cncts.length ? `${cncts[0].tier}-${String(cncts[0].profile_id).padStart(2, "0")}` : null, // SP-55
      verified: true,
    };
  }).concat(programRows); // SP-56
}

// EXP-02 — Caminhos CBO: cnct_courses (1:1 com cnct_profiles.id) + course_cbos/certificacoes/normas
export async function loadCourseEnrichment(db) {
  const [courses, cboRows, certRows, normaRows] = await Promise.all([
    query(db, `SELECT id AS course_id, profile_id, nome FROM cnct_courses WHERE profile_id IS NOT NULL`),
    query(db, `SELECT course_id, codigo, descricao, principal FROM course_cbos`),
    query(db, `SELECT course_id, nome, principal FROM course_certificacoes`),
    query(db, `SELECT course_id, norma FROM course_normas`),
  ]);

  const courseByProfile = {};
  courses.forEach((c) => { courseByProfile[c.profile_id] = c; });
  const cboByCourse = groupBy(cboRows, "course_id");
  const certByCourse = groupBy(certRows, "course_id");
  const normaByCourse = groupBy(normaRows, "course_id");

  const byProfile = {};
  for (const profileId in courseByProfile) {
    const c = courseByProfile[profileId];
    byProfile[profileId] = {
      course_name: c.nome,
      cbos: (cboByCourse[c.course_id] || []).map((x) => ({ codigo: x.codigo, descricao: x.descricao, principal: !!x.principal })),
      certificacoes: (certByCourse[c.course_id] || []).map((x) => ({ nome: x.nome, principal: !!x.principal })),
      normas: (normaByCourse[c.course_id] || []).map((x) => x.norma),
    };
  }
  return byProfile;
}

// M-03 — sources layer=technical + mesmo JOIN + cnct_hint via source_cnct_profiles
export async function loadTechnical(db, tagsBySource, courseEnrichment) {
  const [rows, cnctRowsRaw, profileMetaRows, atlasRows, matTypeRows, matSourceRows] = await Promise.all([
    query(db, `
      SELECT s.id AS id, s.layer AS layer, c.name AS company, sec.name AS sector, s.uf AS uf,
             s.program AS program, s.format AS format, s.national AS national, s.free AS free,
             s.lang AS lang, s.cadastro AS cadastro, s.highlight AS highlight, s.audience AS audience,
             s.url AS url, s.batch AS batch, s.data_layer AS data_layer,
             s.cost_range AS cost_range, s.cost_note AS cost_note, s.source_doc AS source_doc, s.bloco AS bloco
      FROM sources s
      LEFT JOIN companies c ON c.id = s.company_id
      LEFT JOIN sectors sec ON sec.id = s.sector_id AND sec.type='tech'
      WHERE s.layer='technical'
      ORDER BY s.id
    `),
    // SP-55: união pedida no estudo (source_cnct_profiles + guia_source_profiles). Verificado
    // contra o .db real: pra layer=technical, guia_source_profiles contribui 0 pares novos hoje —
    // aplicada mesmo assim por completude e caso o BANCO popule mais linhas no futuro.
    query(db, `
      SELECT source_id, profile_id FROM source_cnct_profiles
      UNION
      SELECT source_id, profile_id FROM guia_source_profiles
    `),
    query(db, `SELECT id, code, name, tier FROM cnct_profiles`),
    // SP-48: atlas_code sozinho não desambigua (20 códigos citados aqui se repetem entre atlas
    // diferentes). source_atlas_trails já tem atlas_num resolvido pra 194/232 (83%) linhas — os
    // 38 restantes ficam sem atlas_num (null), pedido formal em _BACKLOG.md (SP-48) pro BANCO.
    query(db, `SELECT source_id AS source_id, atlas_code AS atlas_code, atlas_num AS atlas_num FROM source_atlas_trails`),
    // SP-54: material_types (16 tipos) via source_material_types. Cobertura real pra
    // layer=technical: 101/572 (17,7%) — maior que a estimativa de 6,5% do estudo original
    // (que era sobre TODAS as camadas de sources, 132/2.045), mas ainda baixa.
    query(db, `SELECT code, label_pt, description FROM material_types`),
    query(db, `SELECT source_id, type_code, confidence FROM source_material_types`),
  ]);

  const profileMeta = {};
  profileMetaRows.forEach((p) => { profileMeta[p.id] = p; });
  const cnctRows = cnctRowsRaw
    .map((r) => ({ source_id: r.source_id, profile_id: r.profile_id, ...profileMeta[r.profile_id] }))
    .filter((r) => r.code);
  const cnctBySource = groupBy(cnctRows, "source_id");

  const atlasBySource = groupBy(atlasRows, "source_id");

  const matTypeMeta = {};
  matTypeRows.forEach((m) => { matTypeMeta[m.code] = m; });
  const matBySource = {};
  matSourceRows.forEach((r) => {
    matBySource[r.source_id] = { code: r.type_code, label: (matTypeMeta[r.type_code] || {}).label_pt || r.type_code, confidence: r.confidence };
  });

  return rows.map((r) => {
    const cncts = cnctBySource[r.id] || [];
    // EXP-02: caminhos_cbo a partir do primeiro perfil CNCT vinculado que tenha curso correspondente
    let caminhosCbo = null;
    for (const c of cncts) {
      if (courseEnrichment[c.profile_id]) { caminhosCbo = courseEnrichment[c.profile_id]; break; }
    }
    return {
      ...r,
      national: !!r.national, free: !!r.free, cadastro: !!r.cadastro,
      tags: tagsBySource[r.id] || [],
      cnct: cncts.map((c) => `${c.code} ${c.name}`),
      cnct_hint: cncts.length ? `${cncts[0].tier}-${String(cncts[0].profile_id).padStart(2, "0")}` : null,
      atlas_trails: (atlasBySource[r.id] || []).map((a) => a.atlas_code),
      atlas_trails_detail: (atlasBySource[r.id] || []).map((a) => ({ code: a.atlas_code, atlas_num: a.atlas_num })), // SP-48
      verified: true,
      material_type: matBySource[r.id] || null, // SP-54
      caminhos_cbo: caminhosCbo, // EXP-02
    };
  });
}

// Composição pros 2 endpoints — mesma ordem de loadCore.js: tagsAndFormats/sourceTags/
// courseEnrichment primeiro (independentes), social e technical os consomem depois.
export async function loadSocialBundle(db) {
  const [{ tagColors, formatMeta }, tagsBySource] = await Promise.all([
    loadTagsAndFormats(db),
    loadSourceTags(db),
  ]);
  const social = await loadSocial(db, tagsBySource);
  return { tagColors, formatMeta, social };
}

export async function loadTechnicalBundle(db) {
  const [tagsBySource, courseEnrichment] = await Promise.all([
    loadSourceTags(db),
    loadCourseEnrichment(db),
  ]);
  const technical = await loadTechnical(db, tagsBySource, courseEnrichment);
  return { technical };
}
