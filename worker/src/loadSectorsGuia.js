// loadSectorsGuia.js — porta de portal/data/loadSectorsGuia.js pro Worker (D1). Mesma
// lógica/queries/comentários do original; ver loadTrails.js pro comentário sobre a troca
// síncrono→async.
import { query, groupBy } from "./helpers.js";

// M-08 — gaps + gap_atlas_trails
// Nota de qualidade de dados: os campos `recurso` (atlas_sem_guia) e `fonte` (sobreposicao) não
// têm texto preenchido na tabela `gaps` — gap de dados pré-existente. Ficam null até curadoria.
export async function loadComplementarity(db) {
  const [rows, trailRows] = await Promise.all([
    // Filtra explicitamente aos 3 tipos que são conteúdo de produto (comparação Guia×Atlas). A
    // tabela `gaps` também guarda log de manutenção interna do banco — nunca deve aparecer aqui.
    query(db, `
      SELECT id, type, bloco_guia, company_raw, impacto, observacao, ext_id, impacto_detail,
             setor, codigo, presente_atlas, presente_guia, tipo_recurso, prioridade
      FROM gaps
      WHERE type IN ('guia_sem_atlas','atlas_sem_guia','sobreposicao')
      ORDER BY id
    `),
    query(db, `SELECT gap_id, atlas_code, atlas_num FROM gap_atlas_trails`),
  ]);
  const trailsByGap = groupBy(trailRows, "gap_id");

  return rows.map((g) => ({
    id: g.ext_id || `gap-${g.id}`,
    type: g.type,
    bloco_guia: g.bloco_guia,
    empresa: g.company_raw,
    trails_atlas: (trailsByGap[g.id] || []).map((t) => t.atlas_code),
    // SP-66: BANCO resolveu atlas_num pra 69/106 (65%) linhas de gap_atlas_trails (SP-51 —
    // cruzamento por empresa/fonte, sem chute). Par completo exposto pra desambiguar quando
    // existir, caindo pra lista de candidatas só pros restantes ainda sem atlas_num.
    trails_atlas_detail: (trailsByGap[g.id] || []).map((t) => ({ code: t.atlas_code, atlas_num: t.atlas_num })),
    impacto: g.impacto,
    impacto_detail: g.impacto_detail,
    recurso: g.tipo_recurso || null,
    bloco_sugerido: [],
    prioridade: g.prioridade,
    fonte: null,
    presente_atlas: g.presente_atlas,
    presente_guia: g.presente_guia,
    observacao: g.observacao,
    codigo: g.codigo,
    setor: g.setor,
  }));
}

// M-09 — sources layer=sector + industry_sectors (lazy — M-11 no SITE; endpoint normal aqui)
export async function loadSectors(db) {
  const rows = await query(db, `
    SELECT s.id AS id, s.industry_sector_id AS sector_id, isec.name AS sector_name, c.name AS company,
           s.url AS url, s.data_layer AS data_layer, s.batch AS batch, s.source_doc AS source_doc,
           s.program AS program, s.format AS format, s.audience AS audience, s.free AS free,
           s.cost_range AS cost_range, s.cost_note AS cost_note, s.detail AS detail,
           s.url_status AS url_status, s.url_checado_em AS url_checado_em
    FROM sources s
    LEFT JOIN companies c ON c.id = s.company_id
    LEFT JOIN industry_sectors isec ON isec.id = s.industry_sector_id
    WHERE s.layer='sector'
    ORDER BY s.industry_sector_id, s.id
  `);
  return rows.map((r) => ({ ...r, free: r.free === null ? null : !!r.free, atlas_trails: [] }));
}

// Camada `guia` (fichas) — lazy no SITE (M-11), endpoint normal aqui
export async function loadGuia(db) {
  const rows = await query(db, `
    SELECT s.id AS id, s.layer AS layer, c.name AS company, s.sector_code AS sector_code, s.bloco AS bloco,
           s.program AS program, s.free AS free, s.lang AS lang, s.cadastro AS cadastro,
           s.highlight AS highlight, s.url AS url, s.source_doc AS source_doc
    FROM sources s LEFT JOIN companies c ON c.id = s.company_id
    WHERE s.layer='guia'
    ORDER BY s.id
  `);
  return rows.map((r) => ({ ...r, free: !!r.free, cadastro: !!r.cadastro }));
}

// sector_fato_* — cruzamento setor industrial com perfis/blocos/Atlas
// EXP-03B: sector_coverage_matrix — mapa empresa x status de mapeamento por setor
export async function loadSectorFato(db) {
  const [profiles, blocos, atlas, coverage, monoRows, sectorNameRows, densRows] = await Promise.all([
    query(db, `SELECT sector_id, perfil_cnct, cbo, trilhas_atlas, setores_guia FROM sector_fato_profiles ORDER BY sector_id, id`),
    query(db, `SELECT * FROM sector_fato_blocos ORDER BY sector_id, id`),
    query(db, `SELECT * FROM sector_fato_atlas ORDER BY sector_id, id`),
    query(db, `SELECT sector_id, empresa_avaliada, status FROM sector_coverage_matrix ORDER BY sector_id, id`),
    // SP-12 / Grupo C: dm_monopolio_oferta_arquivado.sector_name aponta pro mesmo namespace de
    // industry_sectors que sector_id aqui (confirmado por JOIN direto, 0 divergências).
    // Sincronização v168 (SITE): tabela renomeada pra dm_monopolio_oferta_arquivado em algum
    // ponto entre v135 e v167 do banco, sem registro em db_versions_v2 — achado ao rodar a
    // checagem de schema da Regra 1 do protocolo. Dado preservado intacto, só o nome mudou.
    query(db, `SELECT sector_name, company_name, pct_do_setor, eh_dominante FROM dm_monopolio_oferta_arquivado`),
    query(db, `SELECT id, name FROM industry_sectors`),
    query(db, `SELECT sector_id, n_empresas, n_programas, score_densidade, classificacao FROM dm_densidade_setorial`),
  ]);

  const bySetor = {};
  const addTo = (rows, key) => rows.forEach((r) => {
    const s = r.sector_id;
    if (!bySetor[s]) bySetor[s] = { profiles: [], blocos: [], atlas: [], coverage: [] };
    bySetor[s][key].push(r);
  });
  addTo(profiles, "profiles");
  addTo(blocos, "blocos");
  addTo(atlas, "atlas");
  addTo(coverage, "coverage");

  const nameToId = {};
  sectorNameRows.forEach((r) => { nameToId[r.name] = r.id; });
  monoRows.forEach((r) => {
    const sid = nameToId[r.sector_name];
    if (sid == null) return;
    if (!bySetor[sid]) bySetor[sid] = { profiles: [], blocos: [], atlas: [], coverage: [] };
    if (!bySetor[sid].monopolio) bySetor[sid].monopolio = [];
    bySetor[sid].monopolio.push({ empresa: r.company_name, pct: r.pct_do_setor, dominante: r.eh_dominante });
  });
  densRows.forEach((r) => {
    if (!bySetor[r.sector_id]) bySetor[r.sector_id] = { profiles: [], blocos: [], atlas: [], coverage: [] };
    bySetor[r.sector_id].densidade = { n_empresas: r.n_empresas, n_programas: r.n_programas, score: r.score_densidade, classificacao: r.classificacao };
  });

  return bySetor;
}
