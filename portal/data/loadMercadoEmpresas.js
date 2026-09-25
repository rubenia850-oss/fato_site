// data/loadMercadoEmpresas.js — carga de empresas, mercado de trabalho (RAIS/PNAD) e sinais
// de mercado regional.
// Extraído de App.jsx na Etapa 4 da quebra do monólito (D98/D102, 05/07/2026).
import { query } from "../db.js";
import { groupBy } from "../utils/helpers.js";

// Carregamento eager (M-01): tudo que as 8 abas precisam de imediato, exceto `sector`/`guia` (M-11)
// EXP-04: companies carregadas eager — 937 linhas totais, 840 tipo_entidade='empresa' (filtro
// SP-64 aplicado na query, ver abaixo), peso baixo. Comentário anterior dizia "442 empresas
// (pós-fusões Sprint 9/14 + D70-DB)" — desatualizado desde antes desta sincronização, corrigido
// aqui (achado por revisão externa, 19/07/2026 — verificado contra o `.db` real antes de corrigir).
export function loadCompanies(db) {
  const rows = query(db, `
    SELECT c.id, c.name, c.uf, c.slug,
           cu.url_sugerida AS url, cu.confianca AS url_confianca
    FROM companies c
    LEFT JOIN company_url_suggestions cu ON cu.company_id = c.id
    WHERE c.tipo_entidade='empresa'
    ORDER BY c.name COLLATE NOCASE
  `);
  // sectors por empresa
  const sectorRows = query(db, `
    SELECT cs.company_id, i.id AS sector_id, i.name AS sector_name, cs.tier
    FROM company_sectors cs JOIN industry_sectors i ON i.id = cs.sector_id
  `);
  const sectorsByCompany = groupBy(sectorRows, "company_id");
  // contagem de sources por empresa
  const sourceRows = query(db, `SELECT company_id, layer, COUNT(*) as cnt FROM sources GROUP BY company_id, layer`);
  const sourcesByCompany = groupBy(sourceRows, "company_id");

  // SP-12 / Grupo C: dm_competicao_talentos — bidirecional (empresa_a/empresa_b), 0 divergências
  // contra companies.id. Só 9 linhas hoje — poucas empresas com overlap de perfil mapeado.
  const compRows = query(db, `SELECT empresa_a, nome_empresa_a, empresa_b, nome_empresa_b, perfis_comuns, overlap_pct_a FROM dm_competicao_talentos`);
  const compByCompany = {};
  compRows.forEach(r => {
    const add = (selfId, otherId, otherName) => {
      if (!compByCompany[selfId]) compByCompany[selfId] = [];
      compByCompany[selfId].push({ outra_id: otherId, outra_nome: otherName, perfis_comuns: r.perfis_comuns });
    };
    add(r.empresa_a, r.empresa_b, r.nome_empresa_b);
    add(r.empresa_b, r.empresa_a, r.nome_empresa_a);
  });

  // SP-58 (item 6 do estudo de viabilidade, decisão de produto confirmada 17/07 — "pode replicar"):
  // Rede de Empresas, mesmo padrão de RedeDeCarreira.jsx (laços fortes/fracos, nunca com o mesmo
  // peso visual). Laços FORTES = dm_competicao_talentos (já carregado acima como
  // `concorrentes_talento`, achado ao investigar este item — só precisava normalizar a escala:
  // `overlap_pct_a` é 0-100, dm_sinonimos_perfis.overlap_percent é 0-1). Laços FRACOS = mesma
  // comunidade em dm_rede_empresas_comunidades (405/936 empresas, 47%). Centralidade
  // (dm_rede_empresas_centralidade, mesma cobertura 405/936) rotula o nó central.
  // SP-59 (achado 17/07, pedido formal ao BANCO): 19 `company_id` apareciam 2x em
  // dm_rede_empresas_comunidades E em dm_rede_empresas_centralidade, com valores conflitantes
  // (ex. company_id=5 classificado como "🟢 GATEKEEPER" numa linha e "⚪ Periférico" noutra).
  // Causa raiz: recálculo dessas 2 tabelas fazia INSERT sem limpar linhas antigas do mesmo
  // company_id quando o nome da empresa mudava entre execuções (rename/merge de duplicata).
  // ✅ RESOLVIDO NA RAIZ pelo BANCO (v188, sincronização 18/07 com fato_v193_MERGED.db) — recálculo
  // agora limpa antes de inserir, 0 duplicatas confirmadas contra o `.db` real. `ORDER BY .. DESC` +
  // dedup "primeiro vence" abaixo já não tem duplicata pra resolver — mantido mesmo assim como rede
  // de segurança inofensiva (não muda nada com 0 duplicatas, protege se a causa raiz voltar).
  const comunidadeRows = query(db, `SELECT company_id, comunidade_id, tamanho_comunidade FROM dm_rede_empresas_comunidades ORDER BY tamanho_comunidade DESC`);
  const comunidadeByCompany = {};
  comunidadeRows.forEach(r => { if (!comunidadeByCompany[r.company_id]) comunidadeByCompany[r.company_id] = { comunidade_id: r.comunidade_id, tamanho_comunidade: r.tamanho_comunidade }; });
  const centralidadeRows = query(db, `SELECT company_id, n_empresas_conectadas, score_gatekeeper, classificacao FROM dm_rede_empresas_centralidade ORDER BY score_gatekeeper DESC`);
  const centralidadeByCompany = {};
  centralidadeRows.forEach(r => { if (!centralidadeByCompany[r.company_id]) centralidadeByCompany[r.company_id] = { n_empresas_conectadas: r.n_empresas_conectadas, score_gatekeeper: r.score_gatekeeper, classificacao: r.classificacao }; });

  // SP-60 (18/07/2026, achado ao sincronizar com v175): 24 `companies` que eram lixo de parsing
  // ("Cursos Gratuitos", "SEI"...) classificadas como `tipo_entidade='empresa'` por engano — SITE
  // mitigou com um filtro de 24 IDs fixos aqui, já que o BANCO ainda não tinha corrigido a raiz.
  // SP-64 (18/07, sincronização com v193): gap 90061 FECHADO do lado BANCO — as 24 originais + mais
  // 70 achadas por heurística ampliada (94 no total) foram reclassificadas `tipo_entidade=
  // 'pagina_agregadora'`. O filtro fixo de IDs foi removido — substituído pelo `WHERE
  // c.tipo_entidade='empresa'` na query acima, que é a correção de verdade (cobre as 94, não só as
  // 24 que eu tinha conseguido identificar do lado SITE, e se ajusta sozinho se o BANCO reclassificar
  // mais no futuro). Ver `_DECISIONS.md` D118 (o critério que previu exatamente essa transição).

  return rows.map(c => ({
    id: c.id, name: c.name, uf: c.uf, slug: c.slug,
    url: c.url || null,
    url_confianca: c.url_confianca || null,
    sectors: (sectorsByCompany[c.id] || []).map(s => ({ id: s.sector_id, name: s.sector_name, tier: s.tier })),
    source_counts: Object.fromEntries((sourcesByCompany[c.id] || []).map(s => [s.layer, s.cnt])),
    total_sources: (sourcesByCompany[c.id] || []).reduce((a, s) => a + s.cnt, 0),
    concorrentes_talento: compByCompany[c.id] || [],
    rede_comunidade: comunidadeByCompany[c.id] || null, // SP-58
    rede_centralidade: centralidadeByCompany[c.id] || null, // SP-58
  }));
}

// EXP-08 (Sprint 15): dados reais de mercado de trabalho (RAIS/PNAD Contínua 2024) por CBO×UF.
// 1458 linhas (64 CBOs × até 18 UFs) — carregado eager (peso baixo, similar a `technical`/`social`).
// Nome amigável e profile_id via cbo_canonical (auditoria, Sprint 13/14) -- 63/64 CBOs com nome,
// 80/85 perfis CNCT com pelo menos 1 CBO coberto.
export function loadMercadoTrabalho(db) {
  const rows = query(db, `
    SELECT cbo_6digitos, uf, setor_cnae, total_vinculos_ativos, salario_medio_bruto,
           salario_minimo, salario_maximo, total_admissoes_ano, total_desligamentos_ano,
           saldo_liquido, percentual_crescimento, tendencia
    FROM dm_mercado_trabalho
  `);
  const nameRows = query(db, `SELECT DISTINCT cbo_padronizado, profile_name, profile_id FROM cbo_canonical`);
  const nameByCbo = {};
  nameRows.forEach(r => { if (!nameByCbo[r.cbo_padronizado]) nameByCbo[r.cbo_padronizado] = r; });

  // SP-12 / Grupo C: dm_oportunidade_estrategica — mesma unidade (cbo_6digitos + uf) de
  // dm_mercado_trabalho, mas com score_oportunidade e taxa_cobertura já calculados.
  // cbo_6digitos aqui bate 98,4% contra cbo_canonical.cbo_padronizado (18/1152 sem nome
  // padronizado) — tratado como enriquecimento opcional, nunca bloqueia exibição da linha.
  const oportRows = query(db, `SELECT cbo_6digitos, uf, score_oportunidade, taxa_cobertura, total_fontes FROM dm_oportunidade_estrategica`);
  const oportByCboUf = {};
  oportRows.forEach(r => { oportByCboUf[`${r.cbo_6digitos}|${r.uf}`] = r; });

  const byCbo = groupBy(rows, "cbo_6digitos");
  const aggregated = Object.entries(byCbo).map(([cbo, ufRows]) => {
    const totalVinculos = ufRows.reduce((a, r) => a + (r.total_vinculos_ativos || 0), 0);
    const salarioPonderado = totalVinculos > 0
      ? ufRows.reduce((a, r) => a + (r.total_vinculos_ativos || 0) * (r.salario_medio_bruto || 0), 0) / totalVinculos
      : null;
    const topUf = [...ufRows].sort((a, b) => (b.total_vinculos_ativos||0) - (a.total_vinculos_ativos||0))[0];
    const nameInfo = nameByCbo[cbo];
    const ufRowsComOportunidade = ufRows.map(r => ({ ...r, oportunidade: oportByCboUf[`${cbo}|${r.uf}`] || null }));
    const scoresOportunidade = ufRowsComOportunidade.map(r => r.oportunidade?.score_oportunidade).filter(v => v != null);
    return {
      cbo,
      nome: nameInfo ? nameInfo.profile_name : null,
      profile_id: nameInfo ? nameInfo.profile_id : null,
      setor_cnae: ufRows[0].setor_cnae,
      total_vinculos: totalVinculos,
      salario_medio: salarioPonderado,
      salario_min: Math.min(...ufRows.map(r => r.salario_minimo).filter(v => v != null)),
      salario_max: Math.max(...ufRows.map(r => r.salario_maximo).filter(v => v != null)),
      admissoes: ufRows.reduce((a, r) => a + (r.total_admissoes_ano || 0), 0),
      desligamentos: ufRows.reduce((a, r) => a + (r.total_desligamentos_ano || 0), 0),
      saldo: ufRows.reduce((a, r) => a + (r.saldo_liquido || 0), 0),
      crescimento_medio: ufRows.reduce((a, r) => a + (r.percentual_crescimento || 0), 0) / ufRows.length,
      ufs_em_alta: ufRows.filter(r => r.tendencia === "Alta").length,
      total_ufs: ufRows.length,
      top_uf: topUf ? topUf.uf : null,
      score_oportunidade_medio: scoresOportunidade.length ? scoresOportunidade.reduce((a,v)=>a+v,0)/scoresOportunidade.length : null,
      detalhe_uf: ufRowsComOportunidade.sort((a, b) => (b.total_vinculos_ativos||0) - (a.total_vinculos_ativos||0)),
    };
  });
  return aggregated.sort((a, b) => b.total_vinculos - a.total_vinculos);
}

// SP-12 / Grupo D: 4 das 8 tabelas restantes são sinal de mercado regional real (compras
// públicas, concursos técnicos, notícias de investimento, e o cruzamento importação×oferta de
// curso que aponta descompasso regional). As outras 4 (dm_curso_cbo_bridge, dm_cbo_pendentes,
// dm_completude_fontes, e dm_importacoes_maquinas bruta) são bridge/auditoria interna ou dado de
// suporte já resumido dentro de dm_colapso_silencioso — não expostas diretamente (mesma decisão
// já tomada pro resto do SP-12/SP-38: infraestrutura interna não vira tela).
// Nota: `categoria`/`setor_importacao`/`setor` aqui são uma 4ª taxonomia de setor informal, que
// não bate com sector_codes nem industry_sectors (reforça o achado do SP-39) — exibidos como
// texto livre, sem tentar forçar join com as taxonomias existentes.
export function loadSinaisMercado(db) {
  const comprasGoverno = query(db, `SELECT orgao, uf, tipo, descricao, valor, data_pub, categoria FROM dm_compras_governo ORDER BY valor DESC`);
  const concursos = query(db, `SELECT cargo, orgao, nivel, vagas, salario, uf, fonte, url FROM dm_concursos_tecnicos ORDER BY vagas DESC`);
  const noticias = query(db, `SELECT titulo, url, data_publicacao, setor_impactado, uf, valor_investido, empregos_prometidos, score_impacto FROM dm_noticias_industria ORDER BY score_impacto DESC`);
  const colapso = query(db, `
    SELECT uf, setor_importacao, importacoes_valor_usd, cursos_na_uf, matriculas_total,
           taxa_evasao_media, padrao_detectado, sinal_oferta_trabalho
    FROM dm_colapso_silencioso ORDER BY importacoes_valor_usd DESC
  `);
  return { comprasGoverno, concursos, noticias, colapso };
}

// SP-57 (item 8 do estudo de viabilidade, decisão de produto confirmada 17/07 — "painel agregado"):
// Panorama por Estado. As 4 fontes já agregam por UF em SQL (nenhuma tem mais que 40 linhas) —
// aqui só une as 4 num objeto por UF, sem duplicar a agregação em JS.
export function loadPanoramaUF(db) {
  const demanda = query(db, `SELECT uf, setor, compras_qtd, compras_milhoes, importacoes_qtd, import_milhoes_usd, vagas_concursos, score_demanda FROM vw_indicador_demanda`);
  // 2/10 linhas de vw_mapa_calor_preditivo têm uf=NULL (setores energia/mineração sem escopo
  // estadual claro no dado de origem) — filtradas aqui: "Panorama por Estado" é por definição
  // por UF, então essas 2 linhas não pertencem a nenhum card. Lição do D116 (nunca deixar um NULL
  // real de dado colidir com um "nada selecionado"/agrupamento) aplicada aqui como filtro, já que
  // diferente do caso do D116 não existe um "grupo sem UF" que faça sentido mostrar nesta tela.
  const calor = query(db, `SELECT uf, setor_impactado, qtd_noticias, score, empregos, investimento_bilhoes FROM vw_mapa_calor_preditivo WHERE uf IS NOT NULL`);
  const competencias = query(db, `SELECT uf, setor, intensidade FROM vw_mapa_competencias_predito`);
  const pnp = query(db, `SELECT uf, n_cursos, taxa_ocupacao_media, taxa_conclusao_media, taxa_evasao_media, total_matriculas, vagas_fantasmas FROM dm_pnp_indicadores`);

  const demandaByUF = groupBy(demanda, "uf");
  const calorByUF = groupBy(calor, "uf");
  const competByUF = groupBy(competencias, "uf");
  const pnpByUF = {};
  pnp.forEach(p => { pnpByUF[p.uf] = p; });

  const todasUFs = new Set([...Object.keys(demandaByUF), ...Object.keys(calorByUF), ...Object.keys(competByUF), ...Object.keys(pnpByUF)]);

  const out = [...todasUFs].map(uf => {
    const setoresDemanda = (demandaByUF[uf] || []).sort((a, b) => b.score_demanda - a.score_demanda);
    return {
      uf,
      score_demanda_total: setoresDemanda.reduce((s, d) => s + (d.score_demanda || 0), 0),
      top_setor_demanda: setoresDemanda[0] || null,
      setores_demanda: setoresDemanda,
      calor: (calorByUF[uf] || []).sort((a, b) => b.score - a.score),
      competencias: (competByUF[uf] || []).sort((a, b) => b.intensidade - a.intensidade),
      pnp: pnpByUF[uf] || null,
    };
  });
  return out.sort((a, b) => b.score_demanda_total - a.score_demanda_total);
}
