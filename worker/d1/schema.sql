CREATE TABLE trails (
  id TEXT PRIMARY KEY,
  icon TEXT,
  name TEXT,
  cnct_label TEXT,
  color TEXT,
  description TEXT
, [descricao_geral] TEXT);

CREATE TABLE trail_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trail_id TEXT,
  ordem INTEGER,
  phase TEXT,
  note TEXT
, descricao_detalhada TEXT, objetivos_aprendizagem TEXT, nome TEXT, carga_horaria INTEGER);

CREATE TABLE trail_step_sources (
  step_id INTEGER,
  source_id TEXT,
  PRIMARY KEY (step_id, source_id)
);

CREATE TABLE trail_escola_links (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    trail_id        TEXT NOT NULL,
    step_ordem      INTEGER NOT NULL,
    escola_id       INTEGER NOT NULL,
    curso_nome      TEXT,
    url_curso       TEXT,
    UNIQUE(trail_id, step_ordem, escola_id, curso_nome)
);

CREATE TABLE escola_sources (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nome            TEXT NOT NULL UNIQUE,
    url_referencia  TEXT,
    tipo            TEXT   
);

CREATE TABLE trail_cnct_profiles (
  trail_id TEXT,
  profile_id INTEGER,
  PRIMARY KEY (trail_id, profile_id)
);

CREATE TABLE trail_cbos (
  trail_id TEXT,
  codigo TEXT,
  PRIMARY KEY (trail_id, codigo)
);

CREATE TABLE trail_normas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trail_id TEXT,
  norma TEXT
);

CREATE TABLE trail_dependencies (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id        TEXT NOT NULL,
    parent_id       TEXT NOT NULL,
    tipo            TEXT,  
    temas_chave     TEXT,
    UNIQUE(child_id, parent_id)
);

CREATE TABLE cnct_profiles (
  id INTEGER PRIMARY KEY,
  code TEXT,
  name TEXT
, tier TEXT, ch INTEGER, cnct_page INTEGER, cbo_principal TEXT, carga_horaria TEXT, perfil_conclusao TEXT, campo_atuacao TEXT, atlas_ref TEXT, atlas_status TEXT, cbo_outros TEXT, itinerario_intermediario TEXT, nivel_cnct TEXT, infraestrutura_requerida TEXT, justificativa_i4_i5 TEXT);

CREATE TABLE cnct_cbos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER,
  codigo TEXT,
  descricao TEXT
, principal INTEGER DEFAULT 0);

CREATE TABLE cnct_profile_sector_codes (
  profile_id INTEGER,
  sector_code TEXT,
  PRIMARY KEY (profile_id, sector_code)
);

CREATE TABLE atlas_trail_profiles (trail_id INTEGER, profile_id INTEGER, PRIMARY KEY (trail_id, profile_id));

CREATE TABLE atlas_trails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  atlas_num TEXT,
  code TEXT,
  name TEXT,
  series TEXT,
  atlas_name TEXT,
  atlas_slug TEXT,
  description TEXT
);

CREATE TABLE cnct_qualificacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER,
  tipo TEXT, -- 'intermediaria' | 'especializacao'
  nome TEXT
);

CREATE TABLE course_especializacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  nome TEXT,
  principal INTEGER DEFAULT 0
);

CREATE TABLE cnct_courses (
  id INTEGER PRIMARY KEY,           -- ID do CSV (1-99)
  nome TEXT NOT NULL,
  eixo_tecnologico TEXT,
  carga_horaria_min INTEGER,
  carga_dias_uteis INTEGER,
  perfil_profissional TEXT,
  resumo_perfil TEXT,
  infraestrutura TEXT,
  resumo_infraestrutura TEXT,
  pagina_cnct TEXT,
  forcas_armadas INTEGER,
  estagio_obrigatorio TEXT,
  nivel_regulamentacao TEXT,
  classificacao_industrial TEXT,
  categoria_industrial TEXT,
  profile_id INTEGER  -- link Fase 2 (nullable)
, e_ancora                            INTEGER, tier_csv                            TEXT, tier_ecosistema                     TEXT, label_tier_ecosistema               TEXT, cobertura_guia                      TEXT, cobertura_guia_obs                  TEXT, setores_guia                        TEXT, bloco_fundamentos                   TEXT, trilhas_atlas                       TEXT, atlas_referencia                    TEXT, atlas_arquivo                       TEXT, status_atlas                        TEXT, palavras_chave                      TEXT, ofertado_forcas_armadas             TEXT, principais_certificacoes            TEXT, num_certificacoes                   INTEGER, certificacoes_intermediarias        TEXT, principais_especializacoes          TEXT, num_especializacoes                 INTEGER, especializacoes_tecnicas            TEXT, principais_graduacoes               TEXT, num_graduacoes                      INTEGER, verticalizacao_graduacao            TEXT, normas_associadas                   TEXT, micro_atlas_pdf TEXT);

CREATE TABLE course_graduacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  nome TEXT,
  principal INTEGER DEFAULT 0
);

CREATE TABLE cnct_verticalizacao (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER,
  tipo TEXT, -- 'Tecnologo' | 'Bacharelado/Engenharia'
  curso TEXT
);

CREATE TABLE profile_normas (id INTEGER PRIMARY KEY AUTOINCREMENT, profile_id INTEGER, norma TEXT);

CREATE TABLE dm_premio_transferencia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    perfil_origem_id INTEGER,
    perfil_destino_id INTEGER,
    perfil_origem_nome TEXT,
    perfil_destino_nome TEXT,
    salario_origem REAL,
    salario_destino REAL,
    diferenca_mensal REAL,
    horas_necessarias REAL,
    tempo_meses REAL,
    ganho_vitalicio REAL,
    breakeven_meses REAL,
    recomendacao TEXT,
    atualizado_em DATE
);

CREATE TABLE dm_roteiro_carreira(
  perfil_id INT,
  perfil_nome TEXT,
  cbo TEXT,
  trail_id TEXT,
  ordem_trilha,
  step_id INT,
  ordem_passo INT,
  passo_nome,
  descricao_detalhada TEXT,
  carga_horaria INT,
  url_passo TEXT,
  carga_horaria_acumulada,
  tipo_passo,
  atualizado_em
);

CREATE TABLE dm_sinonimos_perfis (
    profile_id_1 INTEGER,
    profile_id_2 INTEGER,
    nome_perfil_1 TEXT,
    nome_perfil_2 TEXT,
    total_trilhas_1 INTEGER,
    total_trilhas_2 INTEGER,
    trilhas_compartilhadas INTEGER,
    overlap_percent REAL,
    grau_sinonimo TEXT,
    PRIMARY KEY (profile_id_1, profile_id_2)
);

CREATE TABLE dm_rede_centralidade (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    perfil_id INTEGER,
    perfil_nome TEXT,
    grau_conexoes INTEGER,
    degree_centrality REAL,
    betweenness_centrality REAL,
    eigenvector_centrality REAL,
    score_hub REAL,
    classificacao_hub TEXT,
    atualizado_em DATE
);

CREATE TABLE dm_rede_comunidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comunidade_id INTEGER,
    perfil_id INTEGER,
    perfil_nome TEXT,
    tamanho_comunidade INTEGER,
    atualizado_em DATE
);

CREATE TABLE dm_qualidade_preditiva (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    instituicao TEXT, curso TEXT, selo_emec TEXT, score_confianca_emec REAL,
    taxa_conclusao REAL, taxa_evasao REAL, taxa_ocupacao_egressos REAL,
    score_qualidade_total REAL, confiabilidade TEXT, atualizado_em DATE
, usa_dados_sinteticos INTEGER DEFAULT 0, salario_medio_pnad REAL, fonte_salario TEXT);

CREATE TABLE dm_oferta_real (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    curso TEXT, instituicao TEXT, uf TEXT,
    matriculas INTEGER, concluintes INTEGER, evadidos INTEGER,
    vagas_ofertadas INTEGER, taxa_ocupacao REAL, taxa_conclusao REAL,
    taxa_evasao REAL, ano_referencia INTEGER, atualizado_em DATE
);

CREATE TABLE dm_matriz_pivotamento (
    perfil_origem_id INTEGER,
    perfil_destino_id INTEGER,
    horas_necessarias REAL,
    nivel_dificuldade TEXT
);

CREATE TABLE companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  uf TEXT
, tipo_entidade TEXT DEFAULT 'empresa', cnpj TEXT, razao_social TEXT, situacao_cadastral TEXT, cnae TEXT, capital_social TEXT, confianca_cnpj TEXT, cnpj_verificado_em TEXT, cidade TEXT, tipo_unidade TEXT, endereco_completo TEXT, confirmado_curadoria INTEGER DEFAULT 1);

CREATE TABLE company_url_suggestions (
  company_id INTEGER PRIMARY KEY,
  url_sugerida TEXT,
  confianca TEXT,  -- alta | media | baixa | sem_sugestao
  observacao TEXT
);

CREATE TABLE company_sectors (
  company_id INTEGER,
  sector_id INTEGER,
  tier TEXT, -- 'grande' | 'media' | 'institucional'
  meta TEXT, -- linha "Sede:.../Porte:.../..." crua
  PRIMARY KEY (company_id, sector_id)
);

CREATE TABLE industry_sectors (
  id INTEGER PRIMARY KEY,  -- numero do setor (1-12)
  name TEXT NOT NULL
);

CREATE TABLE sources (
  id TEXT PRIMARY KEY,         -- ids originais: s01, t01, sec-01-001...
  layer TEXT NOT NULL,         -- social | technical | sector
  company_id INTEGER,
  sector_id INTEGER,
  uf TEXT,
  program TEXT,
  format TEXT,
  national INTEGER,
  free INTEGER,
  lang TEXT,
  cadastro INTEGER,
  highlight TEXT,
  audience TEXT,
  url TEXT,
  source_doc TEXT,
  bloco TEXT,
  batch TEXT,
  data_layer TEXT,
  cost_range TEXT,
  cost_note TEXT
, sector_code TEXT, industry_sector_id INTEGER, detail TEXT, gratuito_raw TEXT, ead_flag TEXT, setor_raw TEXT, vagas_ciclo TEXT, link_raw TEXT, url_status TEXT, url_checado_em TEXT, format_raw TEXT, por_que_importa TEXT);

CREATE TABLE dm_competicao_talentos(
  empresa_a INT,
  nome_empresa_a TEXT,
  empresa_b INT,
  nome_empresa_b TEXT,
  perfis_comuns,
  total_perfis_a,
  total_perfis_b,
  overlap_pct_a,
  overlap_pct_b,
  overlap_simetrico,
  atualizado_em
);

CREATE TABLE "dm_rede_empresas_comunidades" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comunidade_id INTEGER,
    company_id INTEGER,
    company_name TEXT,
    tamanho_comunidade INTEGER,
    atualizado_em DATE
);

CREATE TABLE "dm_rede_empresas_centralidade" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER,
    company_name TEXT,
    n_setores INTEGER,
    n_empresas_conectadas INTEGER,
    degree_centrality REAL,
    betweenness_centrality REAL,
    eigenvector_centrality REAL,
    score_gatekeeper REAL,
    classificacao TEXT,
    atualizado_em DATE
);

CREATE TABLE sector_codes (
  code TEXT PRIMARY KEY,
  name TEXT
, bloco TEXT, bloco_title TEXT, description TEXT);

CREATE TABLE atlas_trail_sectors (trail_id INTEGER, sector_code TEXT, PRIMARY KEY (trail_id, sector_code));

CREATE TABLE atlas_trail_cbos (trail_id INTEGER, codigo TEXT, PRIMARY KEY (trail_id, codigo));

CREATE TABLE atlas_trail_normas (id INTEGER PRIMARY KEY AUTOINCREMENT, trail_id INTEGER, norma TEXT);

CREATE TABLE atlas_nucleo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  atlas_num TEXT,
  codigo TEXT,    -- UC N / Modulo CNCT
  nome TEXT,
  carga TEXT,
  bloco_ou_trilhas TEXT
);

CREATE TABLE atlas_trail_aproveitamento (
  atlas_num TEXT,
  code TEXT,
  aproveitamento_base TEXT,
  nivel_perfil TEXT,
  PRIMARY KEY (atlas_num, code)
);

CREATE TABLE dm_roi_estudo (
    trail_id INTEGER,
    trail_name TEXT,
    carga_horaria_estimada INTEGER,
    salario_estimado_destino REAL,
    roi_por_hora REAL
);

CREATE TABLE dm_dificuldade_estimada (
    trail_id INTEGER PRIMARY KEY, score_dificuldade REAL, nivel TEXT, tem_pre_requisito BOOLEAN
);

CREATE TABLE dm_tecnologias_por_trilha (
    trail_id INTEGER, categoria TEXT, palavra_chave TEXT, PRIMARY KEY (trail_id, categoria, palavra_chave)
);

CREATE TABLE dm_soft_skills_por_trilha (
    trail_id INTEGER, soft_skill TEXT, ocorrencias INTEGER, PRIMARY KEY (trail_id, soft_skill)
);

CREATE TABLE dm_versatilidade_trilhas (
    trail_id INTEGER PRIMARY KEY,
    trail_name TEXT,
    qtd_setores INTEGER,
    classificacao TEXT,
    setores_list TEXT
);

CREATE TABLE atlas_trail_detail (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  trail_id        INTEGER NOT NULL,
  nivel           TEXT,
  nivel_num       INTEGER,
  perfil_saida    TEXT,
  curriculo       TEXT,
  carga_estimada  TEXT,
  normas_ref      TEXT,
  fontes_abertas  TEXT,
  criado_em       TEXT DEFAULT (datetime('now'))
);

CREATE TABLE atlas_docs (
  num TEXT PRIMARY KEY,   -- 'I'..'IX'
  name TEXT,
  cnct_profiles TEXT,
  codigos_guia TEXT,
  versao TEXT
, slug TEXT);

CREATE TABLE atlas_destination_profiles(
  atlas_num TEXT,
  code TEXT,
  name TEXT,
  categoria TEXT,
  nivel TEXT,
  nivel_perfil TEXT
, descricao_completa TEXT);

CREATE TABLE normas_fato (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT,
    descricao TEXT,
    tipo_norma TEXT,
    frequencia_trilhas INTEGER DEFAULT 0,
    frequencia_cursos INTEGER DEFAULT 0,
    frequencia_perfis INTEGER DEFAULT 0,
    frequencia_total INTEGER,
    trilhas_relacionadas TEXT,
    cursos_relacionados TEXT,
    perfis_afetados TEXT,
    atualizado_em DATE
);

CREATE TABLE tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE tag_meta (
  tag_id INTEGER PRIMARY KEY,
  color TEXT,
  bg TEXT,
  label TEXT
);

CREATE TABLE format_meta (
  code TEXT PRIMARY KEY, -- EAD, HYBRID, PRESENTIAL
  label TEXT,
  color TEXT,
  bg TEXT
);

CREATE TABLE source_tags (
  source_id TEXT,
  tag_id INTEGER,
  PRIMARY KEY (source_id, tag_id)
);

CREATE TABLE sectors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL,          -- ex: AUT, INS... (sector_codes da Parte 5)
  UNIQUE(name, type)
);

CREATE TABLE source_cnct_profiles (
  source_id TEXT,
  profile_id INTEGER,
  PRIMARY KEY (source_id, profile_id)
);

CREATE TABLE sector_programs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER,
  sector_id INTEGER,
  programa TEXT,
  formato TEXT,
  publico TEXT,
  custo TEXT,
  detalhe TEXT
, industry_sector_id INTEGER);

CREATE TABLE course_cbos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  codigo TEXT,
  descricao TEXT,
  principal INTEGER DEFAULT 0
);

CREATE TABLE course_certificacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  nome TEXT,
  principal INTEGER DEFAULT 0
);

CREATE TABLE course_normas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  norma TEXT
);

CREATE TABLE guia_source_profiles (
        source_id  TEXT,
        profile_id INTEGER, provenance TEXT,
        PRIMARY KEY (source_id, profile_id)
    );

CREATE TABLE source_atlas_trails (
  source_id TEXT,
  atlas_code TEXT, atlas_num TEXT, resolucao_metodo TEXT, resolucao_confianca REAL,
  PRIMARY KEY (source_id, atlas_code)
);

CREATE TABLE material_types (
  code        TEXT PRIMARY KEY,  -- ex: 'norma_tecnica', 'software_tecnico'
  label_pt    TEXT NOT NULL,     -- ex: 'Norma Técnica', 'Software Técnico'
  description TEXT,
  created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE source_material_types (
  source_id    TEXT NOT NULL,
  type_code    TEXT NOT NULL,
  confidence   TEXT NOT NULL DEFAULT 'inferido',
  -- 'curado': verificado manualmente
  -- 'inferido': classificado por URL/domínio automaticamente
  created_at   TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (source_id, type_code)
);

CREATE TABLE gaps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL, -- guia_sem_atlas | atlas_sem_guia | sobreposicao | recomendacao
  bloco_guia TEXT,
  company_raw TEXT,
  company_id INTEGER,
  trails_atlas TEXT,   -- ex "A2, A3, D3, PE-1"
  impacto TEXT,
  observacao TEXT
, ext_id TEXT, impacto_detail TEXT, setor TEXT, codigo TEXT, presente_atlas TEXT, presente_guia TEXT, tipo_recurso TEXT, prioridade TEXT);

CREATE TABLE gap_atlas_trails (gap_id INTEGER, atlas_code TEXT, atlas_num TEXT, trail_id INTEGER, resolucao_metodo TEXT, PRIMARY KEY (gap_id, atlas_code));

CREATE TABLE sector_fato_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sector_id INTEGER,
  perfil_cnct TEXT,
  cbo TEXT,
  trilhas_atlas TEXT,
  setores_guia TEXT
);

CREATE TABLE sector_fato_blocos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sector_id INTEGER,
  bloco TEXT,
  relevancia TEXT
);

CREATE TABLE sector_fato_atlas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sector_id INTEGER,
  atlas_name TEXT,
  nota TEXT
);

CREATE TABLE sector_coverage_matrix (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sector_id INTEGER,
  empresa_avaliada TEXT,
  status TEXT
, company_id INTEGER);

CREATE TABLE "dm_monopolio_oferta_arquivado" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sector_name TEXT,
    company_name TEXT,
    n_sources INTEGER,
    pct_do_setor REAL,
    eh_dominante TEXT,
    atualizado_em DATE
, company_id INTEGER);

CREATE TABLE dm_densidade_setorial (
    sector_id INTEGER PRIMARY KEY,
    sector_name TEXT,
    n_empresas INTEGER,
    n_programas INTEGER,
    n_sources_validas INTEGER,
    n_trilhas_atlas INTEGER,
    pct_url_valida REAL,
    score_densidade REAL,
    classificacao TEXT,
    atualizado_em DATE
);

CREATE TABLE dm_mercado_trabalho (
        id INTEGER PRIMARY KEY, cbo_6digitos TEXT, uf TEXT, setor_cnae TEXT,
        ano_referencia INTEGER, total_vinculos_ativos INTEGER, salario_medio_bruto REAL,
        salario_minimo REAL, salario_maximo REAL, total_admissoes_ano INTEGER,
        total_desligamentos_ano INTEGER, saldo_liquido INTEGER, percentual_crescimento REAL,
        tendencia TEXT, fonte_original TEXT DEFAULT 'RAIS', updated_at DATE DEFAULT CURRENT_DATE
    );

CREATE TABLE cbo_canonical (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER,
    profile_name TEXT,
    cbo_original TEXT,
    cbo_padronizado TEXT,
    cbo_limpo INTEGER,
    fonte TEXT,
    confidence INTEGER,
    atualizado_em DATE
);

CREATE TABLE dm_oportunidade_estrategica(
  cbo_6digitos TEXT,
  uf TEXT,
  total_empregos,
  salario_medio,
  crescimento_medio,
  total_fontes,
  taxa_cobertura,
  score_oportunidade,
  atualizado_em
);

CREATE TABLE dm_compras_governo (
    id INTEGER PRIMARY KEY, orgao TEXT, uf TEXT, tipo TEXT, descricao TEXT,
    valor REAL, data_pub DATE, categoria TEXT, atualizado_em DATE
);

CREATE TABLE dm_concursos_tecnicos (
    id INTEGER PRIMARY KEY, cargo TEXT, orgao TEXT, nivel TEXT, vagas INTEGER,
    salario REAL, uf TEXT, fonte TEXT, url TEXT, atualizado_em DATE
);

CREATE TABLE dm_noticias_industria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT, url TEXT, data_publicacao DATE, fonte TEXT,
    setor_impactado TEXT, uf TEXT, valor_investido REAL,
    empregos_prometidos INTEGER, data_prevista_inicio DATE,
    palavras_chave TEXT, score_impacto INTEGER, processado_em DATE
);

CREATE TABLE dm_colapso_silencioso (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uf TEXT,
    setor_importacao TEXT,
    importacoes_valor_usd REAL,
    importacoes_qtd_registros INTEGER,
    cursos_na_uf INTEGER,
    matriculas_total INTEGER,
    taxa_evasao_media REAL,
    padrao_detectado TEXT,
    sinal_oferta_trabalho TEXT,
    atualizado_em DATE
);

CREATE TABLE dm_importacoes_maquinas (
    id INTEGER PRIMARY KEY, ncm TEXT, uf TEXT, ano INTEGER, mes INTEGER,
    valor_usd REAL, quantidade INTEGER, setor TEXT, atualizado_em DATE
);

CREATE VIEW vw_indicador_demanda AS
SELECT COALESCE(c.uf, i.uf, cn.uf) AS uf,
    COALESCE(c.categoria, i.setor, 'tecnico') AS setor,
    COUNT(DISTINCT c.id) AS compras_qtd,
    ROUND(SUM(COALESCE(c.valor,0))/1e6, 1) AS compras_milhoes,
    COUNT(DISTINCT i.id) AS importacoes_qtd,
    ROUND(SUM(COALESCE(i.valor_usd,0))/1e6, 1) AS import_milhoes_usd,
    SUM(COALESCE(cn.vagas,0)) AS vagas_concursos,
    ROUND(SUM(COALESCE(c.valor,0))/1e6*0.3 +
          COUNT(DISTINCT i.id)*2 +
          SUM(COALESCE(cn.vagas,0))*0.1, 1) AS score_demanda
FROM dm_compras_governo c
LEFT JOIN dm_importacoes_maquinas i ON c.uf = i.uf
LEFT JOIN dm_concursos_tecnicos cn ON c.uf = cn.uf
GROUP BY COALESCE(c.uf,i.uf,cn.uf), COALESCE(c.categoria,i.setor,'tecnico')
ORDER BY score_demanda DESC;

CREATE VIEW vw_mapa_calor_preditivo AS
SELECT uf, setor_impactado, COUNT(*) AS qtd_noticias,
    SUM(score_impacto) AS score, SUM(empregos_prometidos) AS empregos,
    ROUND(SUM(COALESCE(valor_investido,0))/1e9, 2) AS investimento_bilhoes
FROM dm_noticias_industria
WHERE data_publicacao >= date('now','-365 days')
GROUP BY uf, setor_impactado ORDER BY score DESC;

CREATE VIEW vw_mapa_competencias_predito AS
SELECT uf, setor, COUNT(*) AS intensidade FROM (
    SELECT uf, setor FROM dm_importacoes_maquinas
    UNION ALL SELECT uf, categoria FROM dm_compras_governo
    UNION ALL SELECT uf, 'tecnico' FROM dm_concursos_tecnicos)
GROUP BY uf, setor ORDER BY intensidade DESC;

CREATE VIEW dm_pnp_indicadores AS
SELECT uf, COUNT(*) AS n_cursos,
    ROUND(AVG(taxa_ocupacao),1) AS taxa_ocupacao_media,
    ROUND(AVG(taxa_conclusao),1) AS taxa_conclusao_media,
    ROUND(AVG(taxa_evasao),1) AS taxa_evasao_media,
    SUM(matriculas) AS total_matriculas,
    SUM(vagas_ofertadas - matriculas) AS vagas_fantasmas
FROM dm_oferta_real GROUP BY uf ORDER BY taxa_evasao_media DESC;
