// loadCompanies.js — porta de portal/data/loadMercadoEmpresas.js:loadCompanies() pro Worker (D1).
// Mesma lógica/queries do original; ver loadTrails.js pro comentário sobre a troca síncrono→async.
import { query, groupBy } from "./helpers.js";

export async function loadCompanies(db) {
  const [
    rows,
    sectorRows,
    sourceRows,
    compRows,
    comunidadeRows,
    centralidadeRows,
  ] = await Promise.all([
    query(db, `
      SELECT c.id, c.name, c.uf, c.slug,
             cu.url_sugerida AS url, cu.confianca AS url_confianca
      FROM companies c
      LEFT JOIN company_url_suggestions cu ON cu.company_id = c.id
      WHERE c.tipo_entidade='empresa'
      ORDER BY c.name COLLATE NOCASE
    `),
    query(db, `
      SELECT cs.company_id, i.id AS sector_id, i.name AS sector_name, cs.tier
      FROM company_sectors cs JOIN industry_sectors i ON i.id = cs.sector_id
    `),
    query(db, `SELECT company_id, layer, COUNT(*) as cnt FROM sources GROUP BY company_id, layer`),
    query(db, `SELECT empresa_a, nome_empresa_a, empresa_b, nome_empresa_b, perfis_comuns, overlap_pct_a FROM dm_competicao_talentos`),
    query(db, `SELECT company_id, comunidade_id, tamanho_comunidade FROM dm_rede_empresas_comunidades ORDER BY tamanho_comunidade DESC`),
    query(db, `SELECT company_id, n_empresas_conectadas, score_gatekeeper, classificacao FROM dm_rede_empresas_centralidade ORDER BY score_gatekeeper DESC`),
  ]);

  const sectorsByCompany = groupBy(sectorRows, "company_id");
  const sourcesByCompany = groupBy(sourceRows, "company_id");

  const compByCompany = {};
  compRows.forEach((r) => {
    const add = (selfId, otherId, otherName) => {
      if (!compByCompany[selfId]) compByCompany[selfId] = [];
      compByCompany[selfId].push({ outra_id: otherId, outra_nome: otherName, perfis_comuns: r.perfis_comuns });
    };
    add(r.empresa_a, r.empresa_b, r.nome_empresa_b);
    add(r.empresa_b, r.empresa_a, r.nome_empresa_a);
  });

  // dedup "primeiro vence" — mesma rede de segurança do original (SP-59 já resolvido na origem
  // desde v188, mas mantido inofensivo caso a causa raiz volte, igual ao comentário original).
  const comunidadeByCompany = {};
  comunidadeRows.forEach((r) => {
    if (!comunidadeByCompany[r.company_id]) comunidadeByCompany[r.company_id] = { comunidade_id: r.comunidade_id, tamanho_comunidade: r.tamanho_comunidade };
  });
  const centralidadeByCompany = {};
  centralidadeRows.forEach((r) => {
    if (!centralidadeByCompany[r.company_id]) centralidadeByCompany[r.company_id] = { n_empresas_conectadas: r.n_empresas_conectadas, score_gatekeeper: r.score_gatekeeper, classificacao: r.classificacao };
  });

  return rows.map((c) => ({
    id: c.id, name: c.name, uf: c.uf, slug: c.slug,
    url: c.url || null,
    url_confianca: c.url_confianca || null,
    sectors: (sectorsByCompany[c.id] || []).map((s) => ({ id: s.sector_id, name: s.sector_name, tier: s.tier })),
    source_counts: Object.fromEntries((sourcesByCompany[c.id] || []).map((s) => [s.layer, s.cnt])),
    total_sources: (sourcesByCompany[c.id] || []).reduce((a, s) => a + s.cnt, 0),
    concorrentes_talento: compByCompany[c.id] || [],
    rede_comunidade: comunidadeByCompany[c.id] || null,
    rede_centralidade: centralidadeByCompany[c.id] || null,
  }));
}
