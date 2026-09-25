# SCHEMA — Dicionário de Dados — snapshot histórico (fato_v94.db, base v91, 29/06/2026)

> **Nota (16/07/2026):** movido para `historico/` na regeneração da sessão SITE. Contagem de
> 108 tabelas + 14 views reflete apenas a v91 — banco atual (`fato_v168.db`) tem 118 tabelas +
> 16 views. Ver `SCHEMA.md` na raiz para o estado atual (aponta o delta; dicionário completo
> coluna-a-coluna ainda pendente de regeneração integral — ver pendência registrada lá).

> Gerado em 2026-06-29 por consulta direta ao banco (`PRAGMA table_info`/`foreign_key_list`,
> `sqlite_master`, `SELECT COUNT(*)`) — não por memória de versões anteriores.
> 108 tabelas + 14 views. Contagens de linha verificadas nesta versão (v91).
> Para o estado de gaps/pendências, ver `ESTADO_ATUAL.md`. Para histórico de criação de cada
> objeto, ver `CHANGELOG_BANCO_v81-v97.md` (ou o changelog mais recente, se já houver um cobrindo versão mais alta) e `HISTORICO_SESSOES.md`.

---

## 📌 PROTOCOLO — COMO MANTER ESTE ARQUIVO

1. **Toda tabela ou view nova criada num patch precisa de uma entrada aqui**, no grupo
   temático correto — esse é o problema raiz que gerou as 8 views órfãs documentadas em
   `ESTADO_ATUAL.md` §2.6 (existiam no banco, nunca entraram em changelog nem schema).
2. Ao adicionar: nome, propósito em 1 linha, colunas-chave, FKs, contagem de linhas
   verificada por query — não copiar de log ou de patch SQL sem confirmar no banco.
3. Se uma tabela for removida (`DROP`), mova a entrada para uma seção "Removidas" no fim
   deste arquivo, não apague — mantém rastreabilidade.
4. Re-gere as contagens a cada versão nova. Elas ficam desatualizadas rápido e um número
   errado aqui é pior que não ter número.

---

## Índice de grupos

1. [Núcleo — empresas, fontes, setores](#1-núcleo--empresas-fontes-setores)
2. [Governança — versões, gaps, protocolo](#2-governança--versões-gaps-protocolo)
3. [CBO e perfis CNCT](#3-cbo-e-perfis-cnct)
4. [Cursos CNCT (detalhe)](#4-cursos-cnct-detalhe)
5. [Trilhas (Trails) — modelo legado](#5-trilhas-trails--modelo-legado)
6. [Atlas — modelo de trilhas atual](#6-atlas--modelo-de-trilhas-atual)
7. [Setores — múltiplos espaços de ID](#7-setores--múltiplos-espaços-de-id)
8. [Vínculos source↔perfil/setor/atlas](#8-vínculos-sourceperfilsetoratlas)
9. [Tags e metadados de exibição](#9-tags-e-metadados-de-exibição)
10. [`dm_*` — Camada analítica (data marts)](#10-dm_--camada-analítica-data-marts)
11. [Diversos](#11-diversos)
12. [Views](#12-views)

---

## 1. Núcleo — empresas, fontes, setores

### `companies` (733 linhas — 2 fantasmas removidas em v94)
Empresas e instituições do ecossistema. Sem FK — é tabela-raiz.
**Colunas-chave:** `id` (PK), `slug`, `name`, `uf`.

### `sources` (1.492 linhas)
**Tabela central do banco.** Cada linha é uma fonte de formação/capacitação (curso, programa,
trilha externa) ligada a uma empresa e/ou setor. Layer controla o tipo de fonte
(`technical`|`sector`|`guia`|`social`).
**Colunas-chave:** `id` (PK), `layer`, `company_id`, `sector_id`, `program`, `url`,
`url_status`, `format`, `sector_code`, `industry_sector_id`.
**FKs:** `company_id→companies.id`, `sector_id→sectors.id`, `sector_code→sector_codes.code`,
`industry_sector_id→industry_sectors.id`, `format→format_meta.code`.

### `company_sectors` (97 linhas)
Vínculo empresa↔setor industrial, com `tier` (porte/relevância).
**Colunas-chave:** `company_id`, `sector_id`, `tier`.
**FKs:** `company_id→companies.id`, `sector_id→industry_sectors.id`.

### `company_name_variants` (51 linhas) — criada v86
Variantes de nome de empresa apontando para o ID canônico — resolve grafias diferentes do
mesmo `company_raw` para o merge correto. Ver `ESTADO_ATUAL.md` §2.2 sobre divergência de
contagem no log de versão.
**Colunas-chave:** `variant`, `canonical_id`. **FKs:** `canonical_id→companies.id`.

### `company_url_suggestions` (86 linhas)
URLs candidatas para empresas sem URL confirmada, com nível de confiança.
**Colunas-chave:** `company_id`, `url_sugerida`, `confianca`. **FKs:** `company_id→companies.id`.

### `company_institution_links` (99 linhas)
Vínculo empresa↔instituição de ensino (ex: empresa patrocina curso em escola X), com
evidência e confiança.
**Colunas-chave:** `company_id`, `institution_id`, `link_type`, `confianca`.
**FKs:** `company_id→companies.id`, `institution_id→companies.id`, `source_id→sources.id`.

### `dm_empresas_duplicatas_log` (18 linhas)
Log de fusões de empresa: qual ID foi mantido e quais foram removidos. Ver `CHANGELOG_BANCO_v81-v97.md` (ou o changelog mais recente, se já houver um cobrindo versão mais alta)
v86.1 §7 para as 12 fusões mais recentes (registro histórico — não reverificado em v91).
**Colunas-chave:** `nome`, `id_manter`, `ids_remover`, `executado_em`.

---

## 2. Governança — versões, gaps, protocolo

### `db_versions` (80 linhas) — legado, somente leitura
Histórico de versões v1–v80, anterior à criação de `db_versions_v2` (v81). Não editar.
**Colunas:** `version`, `created_at`, `description`.

### `db_versions_v2` (94 linhas) — criada v81
Governança estruturada atual: checksum do patch, tabelas afetadas, linhas inseridas.
**Atenção:** os campos `tabelas_criadas`/`linhas_inseridas` são preenchidos manualmente no
script do patch e já apresentaram erros de contagem (ver `ESTADO_ATUAL.md` §2.2, §2.5) —
sempre confira por query antes de confiar neles.
**Colunas-chave:** `version` (PK), `applied_at`, `tabelas_criadas`, `linhas_inseridas`, `checksum`.

### `gaps` (129 linhas) — original, intacto, somente leitura
Tabela legada de gaps de dado e notas de processo misturadas (campo `type` fora de
taxonomia). Preservada por auditoria; não editar diretamente.
**Colunas-chave:** `id` (PK), `type`, `company_raw`, `impacto`, `prioridade`.
**FKs:** `company_id→companies.id`.

### `gaps_v2` (98 linhas) — criada v81
Gaps de dado reais, consolidados em 6 categorias oficiais: `lacuna_join`,
`conteudo_faltante`, `url_quebrada`, `duplicidade`, `mapeamento_incompleto`, `recomendacao`.
Campo `type_original` preserva o tipo legado. Esta é a tabela a consultar para o estado de
gaps — ver `ESTADO_ATUAL.md` §3.
**Colunas-chave:** `id` (PK), `type`, `type_original`, `status`, `impacto`.
**FKs:** `company_id→companies.id`.

### `gap_atlas_trails` (106 linhas)
Vínculo gap↔trilha Atlas afetada.
**Colunas:** `gap_id`, `atlas_code`. **FKs:** `gap_id→gaps.id`.

### `meta_protocolo` (22 linhas — regra 22 `foreign_keys_enforcement` adicionada em v87)
Regras de processo/protocolo do projeto (ex: convenções de nomenclatura, regras de
idempotência). Consultada antes de aplicar patches externos.
**Colunas-chave:** `id` (PK), `topico`, `instrucao`, `exemplo`.

### `documents` (22 linhas)
Inventário de arquivos de documentação do projeto (changelogs, READMEs) com versão e status.
**Colunas:** `filename`, `versao`, `status`, `linhas`, `notas`.

### `schema_metric_docs` (3 linhas) — criada v40
Definição textual + query SQL executável para métricas ambíguas (ex: 3 variações de
"% de URL válida"). Resolve confusão entre números divergentes em relatórios.
**Colunas:** `metric_name`, `table_name`, `definition`, `sql_example`.

---

## 3. CBO e perfis CNCT

### `cnct_profiles` (98 linhas)
Perfis profissionais do Catálogo Nacional de Cursos Técnicos. Entidade central do
vocabulário ocupacional do projeto.
**Colunas-chave:** `id` (PK), `code`, `name`, `cbo_principal`, `tier`, `nivel_cnct`.

### `cbo_canonical` (98 linhas)
Mapeamento perfil→código CBO padronizado, com proveniência (`fonte`) e confiança.
**Atenção:** `cbo_padronizado` não é UNIQUE — colisões existem (ver `ESTADO_ATUAL.md` §2.3).
**Colunas-chave:** `profile_id`, `cbo_padronizado`, `fonte`, `confidence`.

### `cnct_cbos` (272 linhas)
Todos os códigos CBO associados a um perfil (um perfil pode ter múltiplos, `principal`
marca o primário). Mais granular que `cbo_canonical`.
**Colunas:** `profile_id`, `codigo`, `descricao`, `principal`. **FKs:** `profile_id→cnct_profiles.id`.

### `cnct_profile_detail` (30 linhas)
Detalhe estendido de perfil: eixo CNCT, carga horária, página de origem, normas.
**FKs:** `profile_id→cnct_profiles.id`.

### `cnct_profile_sector_codes` (104 linhas)
Vínculo perfil↔código de setor.
**FKs:** `profile_id→cnct_profiles.id`, `sector_code→sector_codes.code`.

### `cnct_qualificacoes` (588 linhas) / `cnct_verticalizacao` (547 linhas)
Qualificações intermediárias e trilhas de verticalização (cursos seguintes) por perfil.
**FKs:** `profile_id→cnct_profiles.id`.

### `cnct_coverage_gaps` (1 linha)
Lacunas de cobertura do catálogo CNCT identificadas mas não resolvidas em trilha.

### `profile_normas` (117 linhas)
Normas técnicas associadas a um perfil. **FKs:** `profile_id→cnct_profiles.id`.

### `dm_cbo_pendentes` (35 linhas)
Perfis sem CBO padronizado ainda, com motivo e sugestão — fila de trabalho para
`cbo_canonical`.

### `dm_curso_cbo_bridge` (16 linhas)
Ponte entre cursos PNP (fora do CNCT) e perfis/CBO do CNCT via fuzzy match, com score de
confiança.

### `dm_sinonimos_perfis` (21 linhas)
Pares de perfis com alta sobreposição de trilhas — candidatos a sinônimo/duplicata
conceitual (não fusão automática).

### `dm_matriz_pivotamento` (7.140 linhas)
Matriz de transição entre perfis: horas necessárias e dificuldade para migrar de um perfil
a outro. Base para recomendação de "próximo passo de carreira".
**FKs:** `perfil_origem_id→cnct_profiles.id`, `perfil_destino_id→cnct_profiles.id`.

### `dm_premio_transferencia` (930 linhas)
Ganho salarial estimado ao migrar de um perfil a outro (usa `dm_matriz_pivotamento` +
salários de `dm_mercado_trabalho`). Inclui ROI (breakeven em meses).

### `dm_roteiro_carreira` (405 linhas)
Roteiro passo-a-passo (trilha + steps) recomendado para alcançar um perfil-destino.

### `trail_cbo_validation` (49 linhas)
Log de correções manuais de CBO em trilhas legadas, com justificativa e fonte.

---

## 4. Cursos CNCT (detalhe)

### `cnct_courses` (99 linhas)
**Tabela mais larga do banco (57 colunas).** Um registro por curso técnico do CNCT, com
dados consolidados de CBO, certificações, especializações, graduações relacionadas — em boa
parte denormalizado/redundante com as tabelas `course_*` abaixo (mantido por ser a fonte de
extração original em PDF).
**Colunas-chave:** `id` (PK), `nome`, `eixo_tecnologico`, `profile_id`, `micro_atlas_pdf`.
**FKs:** `profile_id→cnct_profiles.id`.

### `course_cbos` (250) / `course_certificacoes` (456) / `course_especializacoes` (348) /
### `course_graduacoes` (630) / `course_normas` (183)
Tabelas normalizadas 1-para-muitos derivadas das colunas agregadas de `cnct_courses`
(ex: `cnct_courses.principais_cbo` vira linhas em `course_cbos`). Todas com
`course_id→cnct_courses.id`.

### `course_tags` (668 linhas)
Vínculo curso↔tag livre. **FKs:** `course_id→cnct_courses.id`, `tag_id→tags.id`.

---

## 5. Trilhas (Trails) — modelo legado

> `trails` é o modelo original de trilha de aprendizado. `atlas_trails` (seção 6) é o modelo
> atual/em uso — os dois coexistem intencionalmente (ver `HISTORICO_SESSOES.md`, nota sobre
> arquitetura `atlas_trails` vs duplicação real).

### `trails` (122 linhas)
Trilha de aprendizado: nome, eixo, descrição. Use `vw_trails_ativas` para a lista filtrada
de trilhas em uso (85 de 122 — exclui `TRL-GES-PDF-*` e trilhas sem steps).
**Colunas-chave:** `id` (PK), `name`, `cnct_label`, `description`.

### `trail_steps` (497 linhas)
Passos ordenados de uma trilha, com carga horária e descrição.
**Colunas-chave:** `id` (PK), `trail_id`, `ordem`, `nome`, `carga_horaria`.
**FKs:** `trail_id→trails.id`.

### `trail_step_sources` (799 linhas)
Vínculo passo↔fonte (curso real que cobre aquele passo).
**FKs:** `step_id→trail_steps.id`, `source_id→sources.id`.

### `trail_cbos` (99) / `trail_cnct_profiles` (6) / `trail_normas` (55)
Vínculos trilha↔CBO, trilha↔perfil CNCT, trilha↔norma técnica.
**FKs:** todas `trail_id→trails.id` (+ `profile_id→cnct_profiles.id` em `trail_cnct_profiles`).

### `trail_dependencies` (14 linhas)
Pré-requisito entre trilhas (trilha-filha depende de trilha-pai).
**Colunas:** `child_id`, `parent_id`, `tipo`. **FKs:** ambas `→trails.id`.

### `trail_escola_links` (896 linhas)
Vínculo passo de trilha↔escola/curso externo real que o implementa.
**FKs:** `trail_id→trails.id`, `escola_id→escola_sources.id`.

### `escola_sources` (256 linhas)
Catálogo de escolas/instituições de ensino referenciadas em `trail_escola_links`.

---

## 6. Atlas — modelo de trilhas atual

### `atlas_docs` (18 linhas)
Documentos-fonte do Atlas (um por edição/área), com versão.
**Colunas:** `num` (PK), `name`, `versao`, `slug`.

### `atlas_trails` (187 linhas)
Trilha do modelo Atlas — o modelo de trilha atualmente em uso para novo conteúdo.
**Colunas-chave:** `id` (PK), `atlas_num`, `code`, `name`, `series`.
**FKs:** `atlas_num→atlas_docs.num`.

### `atlas_nucleo` (233 linhas)
Núcleo curricular obrigatório por documento Atlas (carga horária + bloco/trilhas).
**FKs:** `atlas_num→atlas_docs.num`.

### `atlas_trail_detail` (74 linhas)
Detalhe por nível de uma trilha Atlas: perfil de saída, currículo, normas de referência.
**FKs:** `trail_id→atlas_trails.id`.

### `atlas_trail_cbos` (64) / `atlas_trail_normas` (292) / `atlas_trail_profiles` (265) /
### `atlas_trail_sectors` (519)
Vínculos trilha Atlas↔CBO, ↔norma, ↔perfil CNCT, ↔código de setor.
**FKs:** todas `trail_id→atlas_trails.id` (+ FK adicional ao alvo do vínculo).

### `atlas_trail_aproveitamento` (163 linhas)
Regras de aproveitamento de carga horária entre níveis de uma trilha Atlas.

### `atlas_destination_profiles` (55 linhas)
Perfis de destino (saída profissional) por trilha Atlas, com nível.

### `dm_roi_estudo` (104) / `dm_dificuldade_estimada` (145) / `dm_versatilidade_trilhas` (145) /
### `dm_soft_skills_por_trilha` (150) / `dm_tecnologias_por_trilha` (317)
Camada analítica derivada sobre trilhas Atlas: ROI por hora estudada, dificuldade estimada,
versatilidade (quantos setores aproveitam a trilha), soft skills e tecnologias mencionadas.
**FKs:** todas `trail_id→atlas_trails.id`.

---

## 7. Setores — múltiplos espaços de ID

> ⚠️ **Ponto de maior risco de erro no schema.** Existem **3 espaços de ID de setor
> diferentes e não intercambiáveis** — confundi-los foi a causa raiz do bug corrigido em
> v85 (ver `CHANGELOG_BANCO_v81-v97.md` (ou o changelog mais recente, se já houver um cobrindo versão mais alta) v85). Sempre confirmar qual espaço uma FK usa antes de fazer JOIN.

### `industry_sectors` (12 linhas) — espaço A
Taxonomia industrial do projeto, IDs 1–12. Referenciada por `companies`/`sources` via
`industry_sector_id`.

### `sectors` (22 linhas) — espaço B
Vocabulário de setores para perfis CNCT, IDs 1–22 (não correspondem 1:1 a `industry_sectors`
a partir do ID 4). Referenciada por `sources.sector_id` e `sector_to_sector_codes`.
**Colunas:** `id`, `name`, `type` (`code` foi removida em v82, 100% NULL).

### `sector_codes` (29 linhas) — espaço C
Códigos de setor em formato string (`code` como PK, não inteiro) usados por
`source_sector_codes`/`cnct_profile_sector_codes`/`atlas_trail_sectors`.
**Colunas:** `code` (PK), `name`, `bloco`, `bloco_title`.

### `industry_to_sector_map` (14 linhas) — criada v85
**Tabela-ponte entre espaço A e espaço B.** Use esta tabela para qualquer JOIN que precise
relacionar `industry_sectors` com `sectors` — nunca faça join direto por ID.
**FKs:** `industry_sector_id→industry_sectors.id`, `sector_id→sectors.id`.

### `sector_industry_map` (29 linhas) / `sector_mapping` (12 linhas)
Tabelas-ponte adicionais, cobrindo combinações entre os 3 espaços + `sector_code` (espaço C)
com `mapeamento_tipo`/`confidence`. Sobreposição parcial com `industry_to_sector_map` —
não auditada se há redundância completa (candidato a investigação futura).

### `sector_to_sector_codes` (71 linhas)
Ponte espaço B (`sectors`) ↔ espaço C (`sector_codes`), com nível de `confianca`.

### `sector_fato_atlas` (16) / `sector_fato_blocos` (53) / `sector_fato_profiles` (66)
Conteúdo por setor industrial (espaço A): trilha Atlas relevante, blocos do Guia, perfis CNCT
aplicáveis. `sector_fato_profiles` inclui os 6 perfis do Setor 12 que são **conteúdo
inferido, não extraído de documento-fonte** (ver `HISTORICO_SESSOES.md`, v39).

### `sector_coverage_matrix` (112 linhas)
Matriz "empresa avaliada × setor × status de cobertura" — extraída de um padrão de
contaminação de dados (ver `HISTORICO_SESSOES.md`, "Format C leakage"). 1 linha por setor.

### `sector_programs` (174 linhas)
Programas de capacitação por empresa+setor que não vieram da extração padrão de `sources`.
**FKs:** `company_id→companies.id`, `sector_id→industry_sectors.id`.

---

## 8. Vínculos source↔perfil/setor/atlas

Tabelas puramente associativas (sem coluna própria de conteúdo, só chaves + metadado de
proveniência), todas com `source_id→sources.id`:

| Tabela | Linhas | Liga `sources` a... | Nota |
|---|---|---|---|
| `source_cnct_profiles` | 9.451 | `cnct_profiles.id` | Maior tabela de vínculo do banco — rebuild completo em v88+v89 (gap 90006) |
| `guia_source_profiles` | 1.657 | `cnct_profiles.id` | Mecanismo alternativo de vínculo (ver `vw_buscador_v2`, que une os dois e remove overlap) |
| `source_sector_codes` | 1.380 | `sector_codes.code` | Tem `provenance`/`provenance_confidence` — +154 em v90 (gap 90007) |
| `source_guia_blocks` | 476 | bloco do Guia | |
| `source_tags` | 495 | `tags.id` | |
| `source_atlas_trails` | 220 | `atlas_trails.code` | |
| `source_material_types` | 132 | `material_types.code` | |

> **`scp_backup_v87`** (3.702 linhas, criada v88): tabela de backup dos vínculos
> `source_cnct_profiles` removidos no rebuild do gap 90006. Não é uma tabela operacional —
> mantida apenas como log de auditoria/rollback. Sem FK declarada (snapshot estático).
> Pode ser removida com segurança após confirmação de que o rebuild está correto.

### `material_types` (16 linhas)
Vocabulário de tipos de material (ex: PDF, vídeo, curso EAD).

---

## 9. Tags e metadados de exibição

### `tags` (587 linhas)
Vocabulário livre de tags aplicáveis a sources/courses. **Colunas:** `id` (PK), `name`.

### `tag_meta` (38 linhas)
Estilo de exibição (cor, label) para um subconjunto de tags relevantes na UI.
**FKs:** `tag_id→tags.id`.

### `format_meta` (3 linhas)
Estilo de exibição para os 3 valores possíveis de `sources.format`.

---

## 10. `dm_*` — Camada analítica (data marts)

> Tabelas pré-calculadas para consumo direto (dashboards, buscador), não fontes primárias.
> Prefixo `dm_` é reservado para tabelas — **exceto** `dm_pnp_indicadores`, que é VIEW por
> engano histórico (ver seção 12, Views, e `HISTORICO_SESSOES.md` v43).

### Mercado de trabalho e oportunidade
- **`dm_mercado_trabalho`** (1.152) — salários e vínculos por CBO×UF×setor (fonte RAIS/PNAD).
- **`dm_oportunidade_estrategica`** (1.152) — `score_oportunidade` e `taxa_cobertura` por
  CBO×UF (fórmula de `score_oportunidade` não documentada — gap 90002 aberto).
- **`dm_qualidade_preditiva`** (47) — score de qualidade de curso combinando EMEC + evasão +
  ocupação de egressos.
- **`dm_rais_match_quality`** (3) — métricas de qualidade do match trilha↔CBO via RAIS.
- **`dm_oferta_real`** (47) — matrículas/concluintes/evadidos por curso real (fonte PNP).
- **`dm_emec_validation`** (15) — validação de selo EMEC por instituição.

### Rede e centralidade
- **`dm_rede_centralidade`** (85) / **`dm_rede_comunidades`** (85) — grafo de perfis CNCT
  (hubs e comunidades), por trilhas compartilhadas.
- **`dm_rede_empresas_centralidade`** (801) / **`dm_rede_empresas_comunidades`** (447) —
  mesma análise para o grafo de empresas (gatekeepers de setor).
- **`dm_monopolio_oferta`** (215) — concentração de oferta de capacitação por empresa
  dominante num setor.
- **`dm_competicao_talentos`** (9) — pares de empresas que competem pelos mesmos perfis.

### Sinais de demanda externos
- **`dm_compras_governo`** (15) — compras públicas relevantes ao setor.
- **`dm_concursos_tecnicos`** (15) — concursos públicos com vagas técnicas.
- **`dm_importacoes_maquinas`** (36) — importação de máquinas por UF/setor (proxy de demanda).
- **`dm_noticias_industria`** (12) — notícias de investimento industrial com score de impacto.
- **`dm_colapso_silencioso`** (25) — UFs com sinal de oferta de trabalho sem cursos
  correspondentes (ou vice-versa).

### Qualidade e proveniência de dado
- **`dm_completude_fontes`** (929) — score de completude por `source_id` (tem URL? tem
  company? tem sector_code?).
- **`dm_proveniencia_dados`** (16) — selo de proveniência por tabela (real/sintético/inferido).
- **`dm_url_validation`** (20) — log de validação HTTP de URL (status code, ok/not ok).

---

## 11. Diversos

### `cnct_coverage_gaps` — ver seção 3.
### `dm_empresas_duplicatas_log` — ver seção 1.

Nenhuma outra tabela fora dos grupos acima identificada nesta auditoria.

---

## 12. Views (14 total)

### Views documentadas em changelog anterior

| View | Linhas | Propósito |
|---|---|---|
| **`vw_buscador_v2`** | 11.055 | View principal de busca: 1 linha = 1 Fonte + 1 Perfil CNCT, sem fanout. Une `source_cnct_profiles`+`guia_source_profiles`, salário com fallback UF→nacional→indisponível. Criada v81. Contagem reflete rebuild de v88–v90. |
| **`vw_trails_ativas`** | 85 | Filtra `trails` para excluir `TRL-GES-PDF-*` e trilhas sem steps. Criada v82. |

### Views órfãs — investigadas nesta sessão (sem entrada em changelog anterior)

> Estas 8 views estavam presentes no banco sem documentação (ver `ESTADO_ATUAL.md` §2.6).
> Propósito abaixo inferido a partir da definição SQL real (`sqlite_master.sql`).

| View | Linhas | Propósito inferido |
|---|---|---|
| **`vw_buscador_completo`** | 11.869 | View ATIVA, em uso confirmado pelo portal (30/06) — não é legada. Join largo com fanout: source→trilha→perfil→CBO→salário→oportunidade→roteiro de carreira numa única linha. Coexiste intencionalmente com `vw_buscador_v2`: esta entrega as colunas adicionais (trilha/CBO/roteiro) que `vw_buscador_v2` (sem fanout, focada em busca/listagem) não carrega. |
| **`vw_guia_companies_clean`** | 213 | Por empresa, lista quais trilhas Atlas ela já cobre via suas sources, marcando `gap_status='coberto'`. Parece suporte a uma página "cobertura por empresa" do Guia. |
| **`vw_mapa_calor_preditivo`** | 6 | Agrega `dm_noticias_industria` dos últimos 365 dias por UF×setor: nº de notícias, score de impacto, empregos prometidos, investimento em bilhões. Alimenta um mapa de calor preditivo de investimento industrial. |
| **`vw_normas_fato_completa`** | 295 | Para cada norma técnica (`normas_fato`), lista trilhas/cursos/perfis relacionados via `GROUP_CONCAT`, unindo `trail_normas` e `atlas_trail_normas`. Visão consolidada de impacto de uma norma. |
| **`vw_rede_carreiras`** | 85 | Junta `dm_rede_centralidade` com `dm_rede_comunidades` — view de conveniência para não precisar do JOIN manual ao consultar hubs de perfil. |
| **`vw_rede_empresas`** | 862 | Junta `dm_rede_empresas_centralidade` + comunidades + `dm_monopolio_oferta` — view de conveniência equivalente para o grafo de empresas, já trazendo o setor dominante. |
| **`vw_trail_index`** | 309 | Índice unificado de trilhas Atlas + trilhas legadas (`trails`) lado a lado, com perfil/CBO/carga horária resolvidos via subquery. Provável fonte de um índice de navegação único cobrindo os dois modelos de trilha coexistentes. |
| **`v_all_social_sources`** | 208 | Une `sources` (layer=social) com `sector_programs` num único formato — convenção de nome (`v_` em vez de `vw_`) destoa do padrão do projeto. |

### Outras views, já com propósito claro pelo nome/uso

| View | Linhas | Propósito |
|---|---|---|
| `vw_indicador_demanda` | 10 | Combina `dm_compras_governo` + `dm_importacoes_maquinas` + `dm_concursos_tecnicos` por UF×setor num score de demanda ponderado. |
| `vw_mapa_competencias_predito` | 40 | Conta intensidade de sinal (importação+compra+concurso) por UF×setor — insumo para mapa de competências previstas. |
| `vw_trilha_enhanced` | 187 | Enriquece `atlas_trails` com classificação de versatilidade (`dm_versatilidade_trilhas`) e ícone/recomendação textual. |
| `dm_pnp_indicadores` ⚠️ | 10 | É **VIEW**, não tabela, apesar do prefixo `dm_`. Agrega `dm_oferta_real` por UF (taxa de ocupação/conclusão/evasão médias, vagas "fantasmas"). Auditorias por `type='table' AND name LIKE 'dm_%'` não a capturam — ver `HISTORICO_SESSOES.md` v43. |

---

## Removidas

*(nenhuma tabela removida registrada até v91 — `sectors.code` foi removida como coluna em
v82, não como tabela; ver seção 7)*

---

## 📌 FIM DO ARQUIVO

Nova tabela ou view criada numa versão futura? Adicione a entrada no grupo temático certo
(ou crie um grupo novo se necessário) e atualize o índice no topo. Não deixe nenhum objeto
novo "órfão" — é exatamente o problema que este arquivo resolve.
