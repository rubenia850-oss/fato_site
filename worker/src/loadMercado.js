// loadMercado.js — porta de portal/data/loadMercadoEmpresas.js: loadMercadoTrabalho(),
// loadSinaisMercado(), loadPanoramaUF() pro Worker (D1). Mesma lógica/queries/comentários do
// original; ver loadTrails.js pro comentário sobre a troca síncrono→async. loadPanoramaUF usa 4
// VIEWs (criadas no schema.sql a partir de dm_compras_governo, dm_importacoes_maquinas,
// dm_concursos_tecnicos, dm_noticias_industria, dm_oferta_real) — ver PROTOCOLO, Regra 4, nota
// sobre VIEWs.
import { query, groupBy } from "./helpers.js";

export async function loadMercadoTrabalho(db) {
  const [rows, nameRows, oportRows] = await Promise.all([
    query(db, `
      SELECT cbo_6digitos, uf, setor_cnae, total_vinculos_ativos, salario_medio_bruto,
             salario_minimo, salario_maximo, total_admissoes_ano, total_desligamentos_ano,
             saldo_liquido, percentual_crescimento, tendencia
      FROM dm_mercado_trabalho
    `),
    query(db, `SELECT DISTINCT cbo_padronizado, profile_name, profile_id FROM cbo_canonical`),
    // SP-12 / Grupo C: dm_oportunidade_estrategica — mesma unidade (cbo_6digitos + uf) de
    // dm_mercado_trabalho, mas com score_oportunidade e taxa_cobertura já calculados.
    // cbo_6digitos bate 98,4% contra cbo_canonical.cbo_padronizado — enriquecimento opcional,
    // nunca bloqueia exibição da linha.
    query(db, `SELECT cbo_6digitos, uf, score_oportunidade, taxa_cobertura, total_fontes FROM dm_oportunidade_estrategica`),
  ]);

  const nameByCbo = {};
  nameRows.forEach((r) => { if (!nameByCbo[r.cbo_padronizado]) nameByCbo[r.cbo_padronizado] = r; });
  const oportByCboUf = {};
  oportRows.forEach((r) => { oportByCboUf[`${r.cbo_6digitos}|${r.uf}`] = r; });

  const byCbo = groupBy(rows, "cbo_6digitos");
  const aggregated = Object.entries(byCbo).map(([cbo, ufRows]) => {
    const totalVinculos = ufRows.reduce((a, r) => a + (r.total_vinculos_ativos || 0), 0);
    const salarioPonderado = totalVinculos > 0
      ? ufRows.reduce((a, r) => a + (r.total_vinculos_ativos || 0) * (r.salario_medio_bruto || 0), 0) / totalVinculos
      : null;
    const topUf = [...ufRows].sort((a, b) => (b.total_vinculos_ativos || 0) - (a.total_vinculos_ativos || 0))[0];
    const nameInfo = nameByCbo[cbo];
    const ufRowsComOportunidade = ufRows.map((r) => ({ ...r, oportunidade: oportByCboUf[`${cbo}|${r.uf}`] || null }));
    const scoresOportunidade = ufRowsComOportunidade.map((r) => r.oportunidade?.score_oportunidade).filter((v) => v != null);
    return {
      cbo,
      nome: nameInfo ? nameInfo.profile_name : null,
      profile_id: nameInfo ? nameInfo.profile_id : null,
      setor_cnae: ufRows[0].setor_cnae,
      total_vinculos: totalVinculos,
      salario_medio: salarioPonderado,
      salario_min: Math.min(...ufRows.map((r) => r.salario_minimo).filter((v) => v != null)),
      salario_max: Math.max(...ufRows.map((r) => r.salario_maximo).filter((v) => v != null)),
      admissoes: ufRows.reduce((a, r) => a + (r.total_admissoes_ano || 0), 0),
      desligamentos: ufRows.reduce((a, r) => a + (r.total_desligamentos_ano || 0), 0),
      saldo: ufRows.reduce((a, r) => a + (r.saldo_liquido || 0), 0),
      crescimento_medio: ufRows.reduce((a, r) => a + (r.percentual_crescimento || 0), 0) / ufRows.length,
      ufs_em_alta: ufRows.filter((r) => r.tendencia === "Alta").length,
      total_ufs: ufRows.length,
      top_uf: topUf ? topUf.uf : null,
      score_oportunidade_medio: scoresOportunidade.length ? scoresOportunidade.reduce((a, v) => a + v, 0) / scoresOportunidade.length : null,
      detalhe_uf: ufRowsComOportunidade.sort((a, b) => (b.total_vinculos_ativos || 0) - (a.total_vinculos_ativos || 0)),
    };
  });
  return aggregated.sort((a, b) => b.total_vinculos - a.total_vinculos);
}

// SP-12 / Grupo D: 4 das 8 tabelas restantes são sinal de mercado regional real (compras
// públicas, concursos técnicos, notícias de investimento, e o cruzamento importação×oferta de
// curso que aponta descompasso regional). As outras 4 (dm_curso_cbo_bridge, dm_cbo_pendentes,
// dm_completude_fontes, e dm_importacoes_maquinas bruta) são bridge/auditoria interna ou dado de
// suporte já resumido dentro de dm_colapso_silencioso — não expostas diretamente aqui (mesma
// decisão do resto do SP-12/SP-38: infraestrutura interna não vira tela). `dm_importacoes_maquinas`
// entra no worker só como base das VIEWs de loadPanoramaUF, não é consultada nesta função.
// Nota: `categoria`/`setor_importacao`/`setor` aqui são uma 4ª taxonomia de setor informal, que
// não bate com sector_codes nem industry_sectors — exibidos como texto livre, sem forçar join.
export async function loadSinaisMercado(db) {
  const [comprasGoverno, concursos, noticias, colapso] = await Promise.all([
    query(db, `SELECT orgao, uf, tipo, descricao, valor, data_pub, categoria FROM dm_compras_governo ORDER BY valor DESC`),
    query(db, `SELECT cargo, orgao, nivel, vagas, salario, uf, fonte, url FROM dm_concursos_tecnicos ORDER BY vagas DESC`),
    query(db, `SELECT titulo, url, data_publicacao, setor_impactado, uf, valor_investido, empregos_prometidos, score_impacto FROM dm_noticias_industria ORDER BY score_impacto DESC`),
    query(db, `
      SELECT uf, setor_importacao, importacoes_valor_usd, cursos_na_uf, matriculas_total,
             taxa_evasao_media, padrao_detectado, sinal_oferta_trabalho
      FROM dm_colapso_silencioso ORDER BY importacoes_valor_usd DESC
    `),
  ]);
  return { comprasGoverno, concursos, noticias, colapso };
}

// SP-57 (item 8 do estudo de viabilidade, "painel agregado"): Panorama por Estado. As 4 fontes já
// agregam por UF em SQL — aqui só une as 4 num objeto por UF, sem duplicar a agregação em JS.
export async function loadPanoramaUF(db) {
  const [demanda, calor, competencias, pnp] = await Promise.all([
    query(db, `SELECT uf, setor, compras_qtd, compras_milhoes, importacoes_qtd, import_milhoes_usd, vagas_concursos, score_demanda FROM vw_indicador_demanda`),
    // 2/10 linhas de vw_mapa_calor_preditivo têm uf=NULL (setores sem escopo estadual claro no
    // dado de origem) — filtradas aqui: "Panorama por Estado" é por definição por UF, e diferente
    // do caso do D116 não existe um "grupo sem UF" que faça sentido mostrar nesta tela.
    query(db, `SELECT uf, setor_impactado, qtd_noticias, score, empregos, investimento_bilhoes FROM vw_mapa_calor_preditivo WHERE uf IS NOT NULL`),
    query(db, `SELECT uf, setor, intensidade FROM vw_mapa_competencias_predito`),
    query(db, `SELECT uf, n_cursos, taxa_ocupacao_media, taxa_conclusao_media, taxa_evasao_media, total_matriculas, vagas_fantasmas FROM dm_pnp_indicadores`),
  ]);

  const demandaByUF = groupBy(demanda, "uf");
  const calorByUF = groupBy(calor, "uf");
  const competByUF = groupBy(competencias, "uf");
  const pnpByUF = {};
  pnp.forEach((p) => { pnpByUF[p.uf] = p; });

  const todasUFs = new Set([...Object.keys(demandaByUF), ...Object.keys(calorByUF), ...Object.keys(competByUF), ...Object.keys(pnpByUF)]);

  const out = [...todasUFs].map((uf) => {
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
