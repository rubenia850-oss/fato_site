# Histórico de Sprints — sessão SITE

> Consolidado em 05/07/2026 (D94/D95) a partir de 10 arquivos `SPRINT*_EXECUCAO.md` separados, sem perder nenhuma linha de conteúdo — só reunidos num só lugar, em ordem cronológica. Sprints 1-5, 7 e 13 não têm arquivo de execução própria neste histórico (cobertos em outros documentos do projeto, ou sem entrega própria de portal registrada).

## Índice

- [Sprint 6](#sprint-6)
- [Sprint 8](#sprint-8)
- [Sprint 9](#sprint-9)
- [Sprint 10](#sprint-10)
- [Sprint 11](#sprint-11)
- [Sprint 12](#sprint-12)
- [Sprint 14](#sprint-14)
- [Sprint 15](#sprint-15)
- [Sprint 16](#sprint-16)
- [Sprint 17](#sprint-17)

---

<a id="sprint-6"></a>
## Sprint 6

# Sprint 6 — Migração Base · Execução

**Data:** 16/06/2026 · **Base:** `fato_v20.db` → patches aplicados nesta execução (registrados como versão 21 e 22 em `db_versions`)

## Decisões tomadas (PRÉ-6E/PRÉ-6G)
- **D53-DB:** Opção A — Atlas II representado via `atlas_trail_cbos` + `atlas_trail_normas` (canônico).
- **D54-DB:** Opção C — `trails` customizadas mantidas como estão; expansão fica para sprint dedicada (fora do roadmap atual). M-04 não foi simplificado nem removido.
- **PRÉ-6F:** Deploy local. `db.js` aponta para `./dados/fato_v20.db`.
- **D55–D61:** registradas em `db_versions` (ver nota da versão 22).

## Ações pré-Sprint 6 aplicadas ao banco
| Ação | Resultado |
|---|---|
| PRÉ-6B | +105 vínculos em `guia_source_profiles` (fichas g0242–g0415). *Nota: o plano estimava ~505; o valor correto via `source_id LIKE 'g%'` é 105 — os demais `source_sector_codes` pertencem à camada `sector` (prefixo `secA-`/`sec-0`), não `guia`.* |
| PRÉ-6C | 4 URLs validadas aplicadas (não 4 estimadas — confirmado). |
| PRÉ-6D | 0 nomes contaminados — já limpos no v20. |

## Sprint 6 — M-00 a M-13
- **M-00:** `db.js` criado (sql.js/WASM via CDN, sem backend — D56).
- **M-01:** `Promise.all` de 8 `fetch(*.json)` substituído por `initDB()` + `loadCore()`.
- **M-02 a M-10:** todas as queries implementadas e validadas linha a linha contra o banco (ver smoke test).
- **M-10/D61:** `TAG_COLORS` (35 entradas) e `FORMAT_META` (3 entradas) hardcoded removidos do `App.jsx`; agora vêm de `tags`+`tag_meta` e `format_meta` via `useData()`.
- **M-11/D58:** camadas `sector` (455) e `guia` (415) carregadas sob demanda — `sector` ao abrir a aba Setores; `guia` ao abrir a aba Guia (ver atualização Sprint 7/EXP-01 abaixo — não foi criada uma `ViewGuia` separada).
- **M-12 — Smoke test:** PASS total.

| Métrica | Esperado | Obtido |
|---|---|---|
| Social | 35 | ✅ 35 |
| Technical | 55 | ✅ 55 |
| Guia | 415 | ✅ 415 |
| Sector | 455 | ✅ 455 |
| Profiles CNCT | 31 | ✅ 31 |
| Atlas Trilhas | 145 | ✅ 145 |

- **M-13/D57:** os 9 JSONs (`social.json`, `technical.json`, `trails.json`, `iedu_profiles.json`, `iedu_guide_blocks.json`, `iedu_atlas_trails.json`, `iedu_complementarity.json`, `iedu_sectors.json`, `vocab.json`) foram movidos para `portal/histórico/` — não excluídos.

## Gaps de dados conhecidos no v20 (não corrigidos nesta sprint — fora de escopo, ver Sprint 9)
- `gaps.tipo_recurso`/`observacao` não têm o texto descritivo (`recurso`, `fonte`) preenchido para os tipos `atlas_sem_guia` e `sobreposicao` — os campos saem `null` no `complementarity` carregado do banco. Pré-existente ao v20, não introduzido por esta migração.
- `sectors[].atlas_trails` permanece `[]`. Confirmado na Sprint 7 (SP-05A): `source_atlas_trails` tem **0 linhas** para a camada `sector` — não é um problema de query, os vínculos simplesmente não existem ainda no banco. Continua bloqueado até essas associações serem geradas (Sprint 11).
- Tipos de `gaps` além dos 4 originais (`guia_sem_atlas`, `atlas_sem_guia`, `sobreposicao`, `recomendacao`) existem no v20 (entradas de auditoria/status) e são carregados, mas não têm aba na UI ainda — inofensivo, não quebram nada.

## Status das próximas sprints
**Sprint 7 (Tier 1) já foi executada** nesta mesma sessão, após este documento ter sido escrito — ver `_DECISIONS.md` (seção "Sprint 7 — Execução") para o detalhamento de SP-02 (FTS5), SP-03 (já antecipado na própria Sprint 6), SP-04A/B (badge de URL), EXP-01 (fichas do Guia) e EXP-02 (Caminhos CBO). Este arquivo cobre apenas a Sprint 6 e não foi retroativamente expandido para evitar duplicar o que já está em `_DECISIONS.md` — consulte os dois documentos juntos.

Próxima sprint pendente: **Sprint 8 (Tier 2)** — EXP-03 a EXP-07.

---

<a id="sprint-8"></a>
## Sprint 8

# Sprint 8 — Tier 2 · Execução

**Data:** 19/06/2026 · **Base:** `fato_v33.db` (33 versões em `db_versions`, vs. 22 do v20 — banco evoluiu substancialmente entre Sprint 6 e esta sessão: perfis CNCT 31→88, technical 55→71→83, sector +3).

## Escopo do `PLANO_MIGRACAO_v4.md` — Sprint 8 (Tier 2)

| Item | Descrição | Status |
|---|---|---|
| EXP-03A | Perfis CNCT relevantes por setor (`sector_fato_profiles`) | ✅ Entregue na sessão anterior |
| EXP-03B | Mapa de cobertura empresas × status (`sector_coverage_matrix`) | ✅ Entregue nesta sessão |
| EXP-03C | Blocos do Guia e Atlas por setor (`sector_fato_blocos`/`atlas`) | ✅ Entregue na sessão anterior |
| EXP-04 | Aba "Empresas" — 615 empresas, filtro setor/UF, status de URL | ✅ Entregue nesta sessão |
| EXP-05A/B/C | Itinerário, verticalização e normas no card de perfil | ✅ Já estava implementado (confirmado nesta sessão — não fazia parte do que faltava) |
| EXP-06A | Núcleo curricular (233 UCs) no drawer de trilha | ✅ Entregue na sessão anterior |
| EXP-06B | Aproveitamento base + nível do perfil por trilha (`atlas_trail_aproveitamento`) | ✅ Entregue nesta sessão |
| EXP-07 | Micro-Atlas em PDF por trilha | ⏳ Bloqueado — coluna `micro_atlas_pdf` não existe ainda em `cnct_courses`; depende de patch de banco (Sprint 9) |
| SP-03 (backlog) | Badge `cnct_hint` clicável (navegação Explore→Perfil) | ✅ Entregue na sessão anterior |

## O que foi feito nesta sessão (EXP-03B + EXP-06B + EXP-04)

### EXP-06B — Aproveitamento por trilha
- Nova query em `loadAtlasTrails()`: `SELECT code, aproveitamento_base, nivel_perfil FROM atlas_trail_aproveitamento` (163 linhas).
- Cada trilha em `atlasTrails[]` ganhou `aproveitamento` (string, ex. `"85%"`) e `nivel_perfil`.
- Renderizado como dois badges no header do drawer de trilha (`ViewProfiles` → painel de detalhe): "✓ 85% aproveitamento" (verde) + nível do perfil (laranja), quando presentes.

### EXP-03B — Cobertura de programas por setor
- `loadSectorFato()` ganhou a chave `coverage`, lida de `sector_coverage_matrix` (112 linhas: `sector_id`, `empresa_avaliada`, `status`).
- Renderizado dentro do painel "📚 Contexto FATO" já existente no detalhe de setor (`ViewSectors`): lista de badges por empresa, coloridos por status (✅ verde / ⚠️ laranja / ❌ vermelho), com contador "N/total mapeadas" e legenda.

### EXP-04 — Aba Empresas (nova)
- Nova função `loadCompanies()`: junta `companies` (615) + `company_url_suggestions` (status/URL validada) + `company_sectors`→`industry_sectors` (setores por empresa) + contagem de `sources` por empresa/camada.
- Carregada eager em `loadCore()` (peso baixo, sem necessidade de lazy-load como `sector`/`guia`).
- Novo componente `ViewEmpresas`: grid de cards por empresa (nome, UF, setores, nº de fontes mapeadas, status do site — "Site verificado" / "Link a revisar" / "Sem sugestão"), com filtro por nome, setor e UF, e toggle "apenas com site verificado".
- Nova aba "Empresas" adicionada ao `Nav`, com contador.

## Por que EXP-05 não precisou de trabalho
Verificado nesta sessão: `loadProfiles()` já carrega `qualifications`, `specializations`, `verticalization_technologist`, `verticalization_bachelor`, `normas`, `perfil_conclusao` e `campo_atuacao` (`cnct_qualificacoes`, `cnct_verticalizacao`, `profile_normas`), e `ViewProfiles` já renderiza todos esses campos no card de perfil. O item havia sido implementado em sessão anterior à desta Sprint 8 e não estava listado como pendente no plano consultado — confirmação feita por leitura direta do código, não por suposição.

## Correções de débito técnico nesta sessão
- Comentários e mensagem de erro do `App.jsx` que ainda citavam `fato_v20.db` foram corrigidos para `fato_v33.db` (o carregamento de dados já usava o banco certo; só o texto estava desatualizado).
- Versão exibida no header do app: `v3.2` → `v3.4`.

## Pendências para Sprint 9
- **EXP-07** (Micro-Atlas PDF): requer que `cnct_courses.micro_atlas_pdf` seja populado no banco antes de qualquer trabalho de portal.
- `sectors[].atlas_trails` continua vazio (gap pré-existente, ver Sprint 6/7 — `source_atlas_trails` sem linhas para camada `sector`).
- Os tipos de `cnct_qualificacoes`/`cnct_verticalizacao` poderiam, no futuro, ganhar filtro próprio na aba Perfis — não pedido nesta sessão, registrado apenas como observação.

---

<a id="sprint-9"></a>
## Sprint 9

# Sprint 9 — Qualidade de Dados · Execução

> **Nota de correção (Sprint 10, 19/06/2026):** este relatório, na seção "Itens do plano original não tocados" e na "Recomendação para Sprint 10" abaixo, afirma que os valores `expected` do smoke test M-12 estavam desatualizados. **Isso foi verificado e estava errado** — os 6 valores rastreados (`social, technical, guia, sector, profiles, trails`) já batiam exatamente com o banco, e `companies` nunca fez parte desse teste. Texto original preservado abaixo sem edição, para manter o registro histórico fiel ao que foi escrito no momento — a correção fica só aqui no topo.

**Data:** 19/06/2026 · **Base:** `fato_v33.db`, 33→40 versões em `db_versions` nesta sessão.

## Importante: esta Sprint 9 não é a "Sprint 9" do `PLANO_MIGRACAO_v4.md` linha por linha

O plano original descreve a Sprint 9 como qualidade de dados rodando em paralelo às Sprints 7/8. Vários itens do escopo original (DB-L01 a DB-L06, DB-M01 a DB-M09) dependem de pesquisa externa ou curadoria editorial que não são reproduzíveis de forma confiável sem essa entrada humana. Esta execução cobriu o que era **mecânico** (seguro de automatizar) e tentou heurística apenas onde havia sinal de dado real no próprio banco — nunca por suposição de conhecimento de mercado.

## O que foi feito

### 1. DB-M03 — Remoção de tabelas redundantes ✅
`profile_atlas_trails_deprecated` (128 linhas) e `cnct_profile_atlas_trails_deprecated` (91 linhas) foram confirmadas como subsumidas por `atlas_trail_profiles` (268 linhas, tabela ativa) e removidas.

**Achado no processo:** 1 registro não tinha cobertura — `profile_id=2` (Técnico em Automação Industrial) tinha um vínculo histórico com a trilha `PE-1` do Atlas I/Petroquímica ("Especialista em Automação Sênior"), mas essa trilha não existe em `atlas_trails`. O código `PE-1` é reaproveitado em 5 outros Atlas (IV, V, VI, VII, IX), nenhum deles Petroquímica. **Isso é um gap de dado real**, registrado em `db_versions` v34 e no `_BACKLOG.md` (ver DB-L01 abaixo) — não inventei a trilha que faltava.

### 2. GR-01 — Colunas de FK em `cnct_courses` ✅
Adicionadas `source_id TEXT` e `atlas_trail_id INTEGER` (vazias). Isso desbloqueia GR-02/GR-03 (mapear os 99 cursos para `sources` e `atlas_trails`) numa sprint futura — não preenchidas agora porque o mapeamento correto depende de cruzar nome de instituição com texto livre, risco de erro alto sem revisão humana.

### 3. DB-01 — `tag_meta` para tags sem cor (parcial, por critério de impacto real) ✅
Das 549 tags sem `tag_meta`, só **69** são de fato usadas em `source_tags` nas camadas `social`/`technical` (as únicas que renderizam badge visível no Explorar — `guia`/`sector` não usam tag como badge). As outras 480 são órfãs ou usadas só em camadas sem renderização de tag.

Populei `tag_meta` para essas 69, usando heurística de **categoria semântica do nome da tag** (regional, modalidade de oferta, automação/instrumentação, normas, mecânica, O&G, dados/gestão, setor, metadado de catálogo), reaproveitando a paleta de cor já estabelecida pelas 38 tags curadas originais. Isso não é curadoria editorial nova — é inferência de categoria a partir do próprio nome da tag, sem inventar significado. As 480 restantes não têm efeito visual hoje (fallback cinza já existe no app) e foram deixadas como estão.

### 4. DB-L03 — Fichas do Guia sem perfil CNCT — heurística avaliada e **descartada** ⛔
Testei se daria para vincular as 155 fichas sem perfil usando match de texto. Não dá: `sources.program` para essas fichas é nome de empresa/instituição (ex: "Festo", "Danfoss", "SGS Industrial"), e `cnct_profiles.name` é título de qualificação técnica (ex: "Técnico em Automação Industrial"). Não existe string em comum entre os dois campos. Qualquer vínculo automático exigiria eu inferir a área de atuação de cada empresa por conhecimento de mercado — isso é classificação editorial, não inferência de dado, e decidi não fazer. Registrado em `db_versions` v37.

### 5. DB-02 — Empresas sem UF — heurística avaliada e **descartada**, mas resolvida parcialmente como efeito colateral da fusão (ver item 6) ⛔→✅ parcial
Testei se `sources.uf` teria o dado para as empresas sem UF em `companies`. Não tinha em nenhum caso. Determinar a UF real de empresas como "Yokogawa" ou "ANP" exigiria pesquisa externa. Não fiz isso. Registrado em `db_versions` v38.

**Mas a fusão de duplicatas (item 6) resolveu boa parte sem precisar de pesquisa**: muitas empresas duplicadas tinham UF preenchida na versão "longa" e vazia na versão "curta" (ou vice-versa). Resultado: **529 → 433 empresas sem UF** (de 615/513 totais), puramente como consequência de eliminar o cadastro duplicado, não de inventar dado novo.

### 6. DB-DUP-01 — Empresas duplicadas (achado fora do escopo original, autorizado pelo usuário) ✅
Durante a investigação do DB-L05, encontrei que **102 de 615 empresas (~17%) eram duplicatas** — mesma empresa cadastrada duas vezes (nome curto + nome longo/com sufixo de divisão, ex: `WEG` / `WEG S.A.`), incluindo um lote marcado manualmente com prefixo 🔴 que parecia já ter sido identificado como "para remover" em sessão anterior não documentada.

Processo, com plano auditável salvo antes de qualquer escrita no banco:
- 96 grupos de duplicata identificados por normalização de nome (removendo sufixos entre parênteses, "S.A.", barras)
- **1 falso-positivo excluído manualmente**: `BRF S.A.` vs `BRF/M. Dias Branco` — são concorrentes, não a mesma empresa
- Critério de sobrevivência por grupo: nunca a entrada com 🔴 → prioriza UF preenchida → nome mais longo/descritivo → menor id
- FKs reatribuídas em `sources`, `gaps`, `company_sectors` (com deduplicação de PK composta), `sector_programs` e `company_url_suggestions` (com deduplicação de PK simples, preservando a sugestão existente do sobrevivente quando havia conflito) — tudo dentro de transação, com checagem de zero referências remanescentes antes do `DELETE`
- 102 registros removidos: `companies` 615 → 513

Validação pós-fusão: `PRAGMA integrity_check` = ok, zero FKs órfãs nas 5 tabelas dependentes.

### 7. DB-FK-01 — Limpeza de FK órfã pré-existente (achado durante validação, não relacionado à fusão) ✅
`PRAGMA foreign_key_check` revelou 2 linhas em `company_url_suggestions` (ids 414, 420) sem `company_id` válido — **confirmado que já existiam no banco antes desta sessão**, não introduzidas pela fusão. A observação no próprio dado já dizia "não é empresa — artefato de extração, reclassificar/remover". Como já estavam marcadas como inválidas e sem URL útil, removi as duas. `PRAGMA foreign_key_check` final: zero problemas.

## Itens do plano original não tocados nesta sessão

| Item | Por que não |
|---|---|
| DB-L04, DB-L05 (URLs faltantes em sector) | Requer pesquisa externa (encontrar/validar URL real de cada programa) |
| DB-L06 (perfis CNCT com campos vazios) | Requer curadoria de conteúdo |
| EXP-07 (Micro-Atlas PDF) | Coluna existe agora? Não — esse item é do plano de portal, ver `SPRINT8_EXECUCAO.md`. Ainda bloqueado, sem PDFs enviados |
| Valores `expected` do smoke test M-12 em `App.jsx` | Defasados desde a Sprint 7/8, não corrigidos ainda — ficam desatualizados também após esta sprint (companies caiu de 615→513, perfis subiu, etc.) |

## Resumo de versões do banco nesta sessão

| Versão | Item |
|---|---|
| 34 | DB-M03 — tabelas deprecated removidas, gap PE-1/Atlas I registrado |
| 35 | GR-01 — colunas `source_id`/`atlas_trail_id` em `cnct_courses` |
| 36 | DB-01 parcial — `tag_meta` para 69 tags com impacto visual real |
| 37 | DB-L03 — heurística avaliada e descartada (documentação da decisão) |
| 38 | DB-02 — heurística avaliada e descartada (documentação da decisão) |
| 39 | DB-DUP-01 — fusão de 102 empresas duplicadas |
| 40 | DB-FK-01 — remoção de 2 FKs órfãs pré-existentes |

## Recomendação para Sprint 10

Atualizar os valores `expected` do smoke test M-12 — agora há uma mudança estrutural real (`companies` 615→513) que vai aparecer como ❌ no console por motivo legítimo, junto com os ❌ já esperados desde a Sprint 7/8 por evolução normal dos dados.

---

<a id="sprint-10"></a>
## Sprint 10

# Sprint 10 — Bloco 2 (Grafo) · Execução

**Data:** 19/06/2026 · **Base:** `fato_v33.db`, 40→42 versões em `db_versions` nesta sessão.
**Escopo:** itens do bloco 2 da especificação (`SPRINT10_ESPECIFICACAO.md`): GR-02, GR-03, GR-07, sincronização de `documents`, correção do smoke test.

## Correção importante antes de começar

A especificação que eu mesmo escrevi para esta sprint estava errada em dois pontos centrais, descobertos só ao tentar executar:

1. **GR-02** assumia que `cnct_courses` teria um campo de empresa para cruzar com `companies`. Não tem — `cnct_courses` é o catálogo nacional de cursos técnicos (CNCT), que descreve um curso-padrão genérico (ex: "Técnico em Automação Industrial"), não o programa de uma empresa específica.
2. **GR-03** assumia uma relação 1-para-1 entre curso e trilha do Atlas, refletida na coluna escalar `atlas_trail_id` criada na Sprint 9. A relação real é muitos-para-muitos: um curso cobre várias trilhas (até 14, no caso de "Técnico em Automação Industrial").

Ambos os erros só apareceram ao testar contra o dado real, não ao ler a descrição do plano. Reportei isso ao usuário antes de prosseguir, em vez de forçar um valor único onde a relação real é múltipla.

## O que foi feito

### GR-07 — Gaps sem trilha do Atlas vinculada ✅
Dos 55 `gaps` sem entrada em `gap_atlas_trails`, apenas **1** (`gap_id=165`, "Técnico em Mecânica de Precisão") tinha o campo `trails_atlas` preenchido com códigos reais (`V/R3`, `II/M3`, no formato `atlas_num/code`) — vinculado corretamente às trilhas `R3` (Atlas V, CNC/CAD-CAM) e `M3` (Atlas II, Metrologia Dimensional).

**Nota de processo, registrada com transparência:** a primeira tentativa usou a coluna errada (`series` em vez de `atlas_num`) e não encontrou nenhuma trilha, gerando um registro inicial incorreto em `db_versions` (v41) que eu mesmo identifiquei e corrigi antes de prosseguir, na mesma sessão.

Os outros 54 gaps (tipos `atlas_sem_guia`/`sobreposicao`/`recomendacao`) têm `trails_atlas` `NULL`, ou contêm texto que não é código de trilha (siglas de área como `AUT`/`INS`/`VLV`, ou nomes de instituição como "MIT OpenCourseWare", "Lúmina UFRGS"). Não há dado para vincular — não é trabalho que ficou faltando, é ausência real de dado na origem.

### GR-02 e GR-03 — Resolvidos via tabelas de junção (correção de schema) ✅

Depois de identificar o problema de cardinalidade e você decidir pela tabela de junção, implementei:

**`cnct_course_atlas_trails`** (course_id, trail_id) — 100 vínculos, cobrindo 16 dos 99 cursos.
- Match feito cruzando `cnct_courses.trilhas_atlas` (lista de códigos separada por `|`) contra `atlas_trails.code`, restrito ao `atlas_name` correto via mapeamento `atlas_referencia → atlas_name` (só os 7 Atlas que já existem estruturados em `atlas_trails`, de 20 valores distintos de `atlas_referencia` no total).
- Os 83 cursos restantes referenciam Atlas ainda não estruturados (Mecânica Industrial, Gestão e Cadeias de Suprimentos, Manutenção Industrial, Agroindústria, etc.) — sem vínculo possível ainda, corretamente.

**`cnct_course_sources`** (course_id, source_id) — 51 vínculos, cobrindo 7 dos 99 cursos.
- Via `cnct_courses.profile_id` → `source_cnct_profiles.profile_id` → `source_id`, trazendo **todas** as fontes associadas (relação muitos-para-muitos correta, sem escolher arbitrariamente uma).
- Mesma limitação de cobertura que já existia em `source_cnct_profiles` desde antes desta sessão (só 53 vínculos totais na tabela).

As colunas escalares `source_id`/`atlas_trail_id` (criadas na Sprint 9, sempre `NULL`, nunca consumidas pelo `App.jsx`) foram removidas — substituídas pelas tabelas de junção acima.

**Achado adicional, documentado e deliberadamente não corrigido:** dos 45 códigos de trilha que não tiveram match dentro do `atlas_name` esperado pelo curso, **todos existem no banco** — só que sob um Atlas diferente do que o curso declara. Exemplo: os códigos `A1`/`A2`/`E1` existem tanto em "Técnico em Petroquímica" quanto em "Técnico em Automação Industrial". Isso é o mesmo padrão de reaproveitamento de código entre Atlas que encontrei na Sprint 9 com `PE-1`. **Não fiz o match cruzado** porque há ambiguidade real — o mesmo código aparece em mais de um Atlas, e escolher qual seria chute editorial, não leitura de dado. Hipótese mais provável (não confirmada): `cnct_courses.trilhas_atlas` foi populado a partir de uma numeração de trilhas anterior à reestruturação registrada em `documents` (`iedu_atlas_trails.json` substituiu a estrutura original de `atlas_trails`).

### `documents` — investigado, sem alteração ✅
A especificação original (minha, da Sprint 10 anterior) pedia "sincronizar" essa tabela com o pacote atual, supondo que fosse um espelho de arquivos presentes. Verificado: `documents` é um **log histórico de ETL** — registra como cada arquivo-fonte foi processado para popular o banco, com notas específicas de cada importação (ex: quantos perfis casaram, quais ficaram pendentes). A entrada de `SPRINT4_PLANO.md` (arquivo já removido do pacote na Sprint 8) tem uma nota legítima ("já usado para definir este schema") — apagá-la destruiria histórico real, mesmo que o arquivo físico não exista mais no ZIP. Os 3 arquivos que o GR-06 original pedia para popular (`iedu_setores_v7_0.md`, `iedu_guia_v6_3.md`, `iedu_cnct_fundamentos_v1_0.md`) já estavam lá. **Nenhuma mudança feita** — a tarefa estava baseada numa premissa errada sobre o que a tabela representa.

### Smoke test M-12 — correção de uma afirmação minha anterior ✅
Os relatórios das Sprints 9 e da especificação da Sprint 10 chegaram a afirmar que os valores `expected` do smoke test estavam desatualizados. **Verificado: isso era falso.** Os 6 valores hardcoded (`social=35, technical=83, guia=415, sector=458, profiles=88, trails=145`) batem exatamente com o banco atual, e `companies` nunca fez parte desse teste — a fusão de duplicatas da Sprint 9 (615→513) não tem nenhum efeito nele. Corrigi essa afirmação em `_CHANGELOG.md`, `portal/README.md` e adicionei nota de correção no topo do `SPRINT9_EXECUCAO.md`, preservando o texto original abaixo da nota.

## Resumo de versões do banco nesta sessão

| Versão | Item |
|---|---|
| 41 | GR-07 — gap 165 vinculado a 2 trilhas (corrigido após erro de coluna na primeira tentativa) |
| 42 | GR-02/GR-03 — tabelas de junção criadas, colunas escalares da Sprint 9 removidas, achado de reaproveitamento de código entre Atlas documentado |

## Validação final

`PRAGMA integrity_check` = ok · `PRAGMA foreign_key_check` = zero problemas · sintaxe do `App.jsx` validada com Babel (sem mudança de UI nesta sprint, código não tocado fora dos comentários já corrigidos na Sprint 9).

## Pendências para Sprint 11

- **EXP-07** (Micro-Atlas PDF) — ainda bloqueado, faltam os arquivos PDF
- **DB-L04/L05** (URLs de setor faltantes) e **DB-L06** (perfis CNCT incompletos) — pesquisa externa
- **SP-09** (155 fichas do Guia sem perfil CNCT) — curadoria manual
- Investigar se `cnct_courses.trilhas_atlas` usa numeração de trilha anterior à reestruturação do `atlas_trails` (achado desta sprint, não confirmado) — se confirmado, poderia desbloquear bem mais que os 16/99 cursos cobertos hoje em `cnct_course_atlas_trails`

---

<a id="sprint-11"></a>
## Sprint 11

# Sprint 11 — Itens 1 a 4 · Execução

**Data:** 19/06/2026 (sessão seguinte à Sprint 10) · **Base:** `fato_v33.db`, 42→45 versões em `db_versions`.
**Escopo:** decisão sobre o par "Técnico em Plásticos", + itens 1 (DB-L06), 3 (hipótese de renumeração de trilhas) e 4 (SP-04) do plano de Sprint 11.

## Decisão do usuário: fusão de perfis duplicados (DB-DUP-02)

Investigando DB-L06, encontrei um segundo caso de duplicata de cadastro (mesmo padrão da Sprint 9, mas em `cnct_profiles` em vez de `companies`): dois perfis "Técnico em Plásticos" — id `31` (CBO `8153-10`) e id `73` (CBO `3114-10`).

O usuário instruiu: decidir pelo CBO mais específico e eliminar o outro. Antes de decidir, pesquisei os dois códigos (não confiei de memória):
- **CBO 3114-10** — confirmado em fonte oficial (Ministério do Trabalho) como exatamente "Técnico em plástico", família 3114 "TÉCNICOS EM FABRICAÇÃO DE PRODUTOS PLÁSTICOS E DE BORRACHA".
- **CBO 8153-10** — não encontrado em nenhuma fonte oficial brasileira como código válido para esta ocupação; aparece apenas em fragmentos de classificações cruzadas com outros países. Provável erro de cadastro na origem.

**Decisão:** perfil `73` sobrevive, perfil `31` eliminado. Achado de apoio: o próprio perfil `31` já listava `311410` (= `3114-10`) como CBO secundário em `cnct_cbos`, antes mesmo da fusão — reforça que era o código correto reconhecido desde a origem.

Processo: 11 tabelas verificadas por referência a `profile_id`. Só 2 tinham dado em `31`: `cnct_cbos` (2 linhas — uma com o código não confirmado, outra duplicada da que `73` já tinha) e `atlas_trail_profiles` (1 linha, trilha A8/Atlas Petroquímica). A linha de `atlas_trail_profiles` foi migrada para `73` (sem conflito de PK). As 2 linhas de `cnct_cbos` foram descartadas, não migradas — uma carregava o código não confirmado, a outra duplicaria a que `73` já possui. `cnct_profiles`: 88 → 87.

## Item 1 — DB-L06

O plano original citava "4 perfis com campos críticos vazios". Verificado: são só **3** — `Biocombustíveis` (id 30) já estava bem preenchido antes desta sessão, o plano estava desatualizado nesse ponto.

Para `Refrigeração e Climatização` (28) e `Sistemas a Gás` (29): preenchi `atlas_ref='Atlas de Petroquímica'`, derivado de vínculo que já existia em `atlas_trail_profiles` (trilhas A3 e A6, ambas do Atlas I) — não inventei, só li uma relação que já estava no banco.

**Não preenchido, e não vou inventar:** `atlas_status` (28/29) e `campo_atuacao` (28/29/73) são campos editoriais — descrever o que um técnico faz ou classificar a maturidade do Atlas para aquele perfil é redação de conteúdo, não leitura de dado. `nivel_cnct` segue vazio para os 3 — na verdade está vazio para os 87 perfis do banco inteiro, não é gap específico destes.

## Item 2 (já coberto acima — fusão DB-DUP-02)

## Item 3 — Hipótese de renumeração de trilhas (carregada da Sprint 10)

Confirmei parte da hipótese: existiu mesmo uma numeração anterior de 163 trilhas (`atlas_trail_aproveitamento`, espelho do `iedu_atlas_trilhas_convertido.tsv`), substituída pela atual de 145 (`atlas_trails`). Dos 35 códigos antigos sem correspondência atual, **todos** seguem o padrão `PE-/PS-/PD-` (perfis de destino de carreira) e foram movidos para uma tabela própria, `atlas_destination_profiles` (55 linhas) — não é perda de dado, é reorganização de schema já documentada em `documents`.

**Isso não destrava os 45 códigos sem match do GR-03 (Sprint 10):** só 1 deles (`PS-6`) segue o padrão de perfil de destino. Os outros 44 são códigos simples (`A1`, `D3`, `AGR1`, `BIO1`, `UC7`...) que pertencem a Atlas ainda não estruturados ou colidem genuinamente com código de outro Atlas já estruturado — mesma ambiguidade já documentada na Sprint 10. Não criei tabela de junção nova só para o caso `PS-6` (1 linha não justifica o esforço). Conclusão: hipótese parcialmente confirmada, mas não amplia a cobertura de `cnct_course_atlas_trails`.

## Item 4 — SP-04, fechamento formal

`sectors[].atlas_trails` continua sempre vazio (`source_atlas_trails` sem linhas para `layer='sector'`). Já investigado nas Sprints 7 e 9 sem solução. Fechado no `_BACKLOG.md` como "sem solução viável com os dados atuais" em vez de manter como "pendente" indefinidamente — mais honesto que repetir a mesma tentativa em toda sprint futura.

## Correção a uma consequência da própria Sprint 11

A fusão de perfis (88→87) tornou o smoke test M-12 do `App.jsx` desatualizado de fato — diferente da Sprint 9/10, em que a afirmação de desatualização estava errada, aqui é uma mudança real causada por esta sessão. Corrigido: `expected.profiles` de 88 para 87.

## Resumo de versões do banco nesta sessão

| Versão | Item |
|---|---|
| 43 | DB-DUP-02 — fusão dos perfis "Técnico em Plásticos" (31→73), `cnct_profiles` 88→87 |
| 44 | DB-L06 parcial — `atlas_ref` preenchido para 28/29, restante documentado como editorial |
| 45 | Investigação da hipótese de renumeração de trilhas — confirmada parcialmente, sem ganho de cobertura |

## Validação final

`PRAGMA integrity_check` = ok · `PRAGMA foreign_key_check` = zero problemas · sintaxe do `App.jsx` validada · `expected.profiles` do smoke test corrigido e confirmado contra o banco real (87=87).

## Pendências para Sprint 12

- **EXP-07** (Micro-Atlas PDF) — ver especificação de arquivos pedida ao usuário nesta mesma conversa
- DB-L04/L05 (URLs de setor) e SP-09 (vínculo Guia↔CNCT) — pesquisa externa/curadoria, sem mudança
- Vale considerar uma varredura geral por outros possíveis pares duplicados em `cnct_profiles` (achei este por acaso investigando DB-L06, não por busca sistemática como fiz com `companies` na Sprint 9) — não feita nesta sessão por não ter sido pedida

---

<a id="sprint-12"></a>
## Sprint 12

# Sprint 12 — EXP-07 (Micro-Atlas PDF) · Execução

**Data:** 19/06/2026 (sessão seguinte à Sprint 11) · **Base:** `fato_v33.db`, 45→47 versões em `db_versions`.
**Entrada:** `sistema_fato_atlas.zip`, enviado pelo usuário em resposta ao pedido de especificação de arquivo feito na Sprint 11.

## O que veio no arquivo

89 arquivos, mas não no formato que eu tinha pedido (1 PDF por trilha do Atlas). Na prática:
- **78 PDFs** em `micro_atlas/`, um por curso do catálogo nacional (CNCT) — não por trilha
- **9 PDFs** de "Atlas previstos" para os Atlas ainda não estruturados no banco (Mecânica Industrial, Design e Moda, etc.)
- **2 PDFs** de notas de cobertura complementar

Só os 78 de `micro_atlas/` foram processados nesta sessão — os outros 11 são documentos de planejamento (prosa), não dados estruturáveis em tabela.

## Descoberta: a numeração dos arquivos não corresponde a nenhum id atual

Tanto o nome do arquivo (`092_técnico_em_plásticos.pdf`) quanto o texto interno do PDF ("ID CNCT #92") usam uma numeração que **não bate** com `cnct_profiles.id` nem com `cnct_courses.id` atuais — confirmado por extração de texto de todos os 78 PDFs e comparação sistemática, não por amostra. É muito provável que essa numeração reflita um snapshot do banco anterior a 14/06/2026, antes de diversas edições que aconteceram antes mesmo da Sprint 6. A única chave de correspondência confiável foi o **nome do curso**, extraído de dentro do PDF (campo "Curso").

## Achado maior: 2 pares de perfis duplicados não detectados antes (DB-DUP-03)

Casar os 78 PDFs por nome contra `cnct_profiles` revelou 2 nomes com mais de 1 `id`:
- **"Técnico em Mecânica de Precisão"** — ids 6 (rico) e 32 (fino)
- **"Técnico em Informática"** — ids 16 (rico) e 33 (fino)

Diferente do par "Técnico em Plásticos" da Sprint 11 (CBOs diferentes, decisão por especificidade), aqui o **CBO é idêntico** dentro de cada par — o critério usado foi completude de dado: a versão "fina" tinha zero vínculos em `guia_source_profiles` (contra 54 e 42 da versão rica) e contagens bem menores em todas as outras tabelas relacionadas. Padrão consistente com stubs gerados pela propagação automática de `cnct_courses` (mencionada nos comentários do `App.jsx`: "49 perfis propagados") que recriou perfis já existentes em vez de reconhecê-los.

Fiz uma varredura sistemática completa de `cnct_profiles` (nome exato + normalização agressiva sem acento/case/pontuação) antes de decidir — **não encontrei nenhum terceiro par**, então não há mais nenhum óbvio por esse critério.

Antes de descartar cada versão fina, comparei item a item: 4 pedaços de conteúdo real existiam só na versão fina (1 especialização e 1 verticalização por par, 1 trilha do Atlas no par Mecânica/Precisão) — migrados para o sobrevivente antes do `DELETE`, sem perda de dado. `cnct_profiles`: 87 → 85.

## EXP-07 propriamente dito

Dos 78 PDFs, todos casaram por nome com `cnct_courses` (99 linhas, sem nenhum nome duplicado lá — verificado). Coluna `micro_atlas_pdf TEXT` adicionada em `cnct_courses`, caminho relativo (`dados/micro_atlas/NNN_nome-slug.pdf`, renomeado com `cnct_courses.id` para um identificador estável e legível, já que a numeração original do arquivo não tinha esse significado).

- **65 cursos** têm `profile_id` preenchido → PDF acessível no portal via novo botão "📄 Ver Micro-Atlas" no cabeçalho do card de perfil (`ViewProfiles`)
- **13 cursos** têm PDF mas `profile_id IS NULL` (cursos administrativos/comerciais — Comércio, Marketing, Vendas, Secretariado etc. — e de design/moda que nunca geraram perfil CNCT) → PDF fica salvo no banco, **sem superfície de UI** nesta sessão. Não criei uma tela nova para expor isso sem ter sido pedido.

**Nota sobre EXP-07C:** o plano original previa o botão em "SourceCard de cursos técnicos" (camada `sources`/Explorar). Os PDFs pertencem ao catálogo nacional (`cnct_courses`/`cnct_profiles`), não a programas de empresa — não há FK direta entre as duas camadas, só um vínculo indireto fraco (`source_cnct_profiles`, 53 linhas). Implementei o botão na página de Perfil CNCT, onde a relação é direta e completa, em vez de forçar um link indireto e parcial no Explorar.

## Correção ao smoke test (consequência real desta sessão, não erro de relatório anterior)

`expected.profiles` corrigido de 87 para 85, refletindo a segunda rodada de fusão (DB-DUP-03).

## Resumo de versões do banco nesta sessão

| Versão | Item |
|---|---|
| 46 | DB-DUP-03 — fusão dos 2 pares (Mecânica de Precisão, Informática), `cnct_profiles` 87→85 |
| 47 | EXP-07 — coluna `micro_atlas_pdf`, 78/99 cursos preenchidos |

## Validação final

`PRAGMA integrity_check` = ok · `PRAGMA foreign_key_check` = zero problemas · sintaxe do `App.jsx` validada · query de junção (`cnct_courses.profile_id`) testada contra o banco real antes de entrar no código.

## Pendências para Sprint 13

- Os 9 PDFs de "Atlas previstos" e 2 notas de cobertura (não processados) — decidir se entram como conteúdo de referência em algum lugar do portal ou ficam só como documento de planejamento fora do banco
- Os 13 cursos com PDF mas sem perfil — decidir se vale criar perfis CNCT para eles ou expor o PDF de outra forma
- EXP-07B (assets) está feito; falta decidir se compacta os 78 PDFs de forma diferente para produção (1,5 MB atual, aceitável)
- Mesma recomendação da Sprint 11 ainda vale: não foi feita varredura de duplicatas em outras tabelas além de `cnct_profiles` (ex: `companies` já foi feita na Sprint 9, mas `atlas_trails`, `sources` nunca foram varridas sistematicamente)

---

<a id="sprint-14"></a>
## Sprint 14

# Sprint 14 — Sincronização com a sessão "auditoria" · Execução

**Data:** 20/06/2026 · **Base:** `fato_v55.db` recebido já com D62-DB/D63-DB aplicados (reconciliação de `micro_atlas_pdf`). 57→60 versões em `db_versions` nesta sessão.
**Contexto:** o usuário trouxe `fato_v55.db` + `sistema_fato_sprint13_FIXED.zip`, avisando que a sessão de auditoria de dados é **independente e contínua** — qualquer correção feita aqui precisa ser comunicada de volta, não só aplicada silenciosamente.

## O que já estava resolvido ao chegar

A sessão anterior (chamada "Sprint 13" nos próprios documentos do projeto — por isso esta sessão se chama **Sprint 14**, para não colidir) já tinha:
- Atualizado `db.js` para `fato_v55.db`
- Restaurado e repopulado `cnct_courses.micro_atlas_pdf` (78/99)
- Confirmado compatibilidade total de schema entre `App.jsx` e `fato_v55.db`
- Documentado tudo em D62-DB e D63-DB

Verificado e confirmado: `App.jsx` deste pacote é **byte-idêntico** ao da Sprint 12 — a auditoria nunca tocou em código, só no banco.

## O que esta sessão encontrou e corrigiu

### Achado 1 — Os 3 pares de perfis CNCT duplicados (Sprints 11/12) voltaram
`fato_v55.db` tinha `cnct_profiles=88`, com os mesmos 3 pares exatos já fundidos antes sobre `fato_v33.db`: Plásticos (31/73), Mecânica de Precisão (6/32), Informática (16/33), com os mesmos ids. Confirma que ambas as linhas (portal e auditoria) herdam o mesmo bug de origem — a propagação `cnct_courses`→`cnct_profiles` nunca verificou se já existia um perfil com aquele nome antes de criar um novo.

Refundidos com a mesma decisão já validada nas Sprints 11/12 (CBO mais específico e confirmado externamente para Plásticos; completude de dado — zero vínculos em `guia_source_profiles` — para os outros 2). `cnct_profiles`: 88 → 85.

### Achado 2 — Erro meu na varredura de FK, corrigido na mesma sessão
Depois do merge, `PRAGMA foreign_key_check` revelou **516 violações** em `dm_matriz_pivotamento` — tabela nova (da linha de auditoria) com nomenclatura em português (`perfil_origem_id`/`perfil_destino_id`) que minha varredura original (só buscando "profile" em inglês) não capturou. Resurvey completo (buscando também "perfil") achou mais 3 tabelas: `dm_rede_centralidade`, `dm_rede_comunidades`, `dm_premio_transferencia` — nenhuma com `FOREIGN KEY` declarada, por isso invisíveis ao `PRAGMA foreign_key_check` até eu corrigir a primeira.

Todas corrigidas, sem perda de dado real:
- `dm_matriz_pivotamento`: confirmado que o sobrevivente já cobria os mesmos 87 destinos que cada duplicado cobria (matriz completa pré-existente) — linhas órfãs removidas.
- `dm_rede_centralidade`/`dm_rede_comunidades`: 1 linha por perfil, sobrevivente já tinha a sua própria métrica de rede — linha do eliminado removida. **Nota:** essas métricas foram calculadas com a topologia de rede ainda incluindo as 3 duplicatas — recálculo completo fica como recomendação para a auditoria, não refeito aqui.
- `dm_premio_transferencia`: lista esparsa (1056 linhas, não matriz completa) — tratamento linha a linha. Resultado muito assimétrico: no par Plásticos, **64 de 64 linhas eram dados reais exclusivos** do perfil eliminado (zero redundância) e foram migradas; nos outros 2 pares, 62 de 64 eram redundantes e descartadas.

### Achado 3 — 72 grupos de empresas duplicadas em `companies` (520 registros)
Mesma metodologia da Sprint 9 (DB-DUP-01). Concentrados nos ids 484-610 — quase certamente de um processo de pesquisa/importação em lote da própria auditoria, sem checar contra a base já existente.

**2 falsos-positivos excluídos após verificação individual** (a heurística de nome não basta sozinha):
- **BRF vs BRF/M.Dias Branco** — concorrentes distintos, já conhecido da Sprint 9.
- **SENAI vs SENAI/SESI EaD (ES)** — verificado que são **2 programas diferentes** (Operador de Utilidades vs Metrologia EaD), cada um com só 1 fonte, que coincidem em citar "SENAI" genericamente — não é a mesma entidade duplicada.

**1 caso verificado por busca externa antes de fundir:** "Air Products / Linde" — as fontes vinculadas a esse nome apontam exclusivamente para `airproducts.com`; Linde e Air Products são concorrentes globais distintos (Linde se fundiu com a Praxair, não com a Air Products) — concluído que é erro de cadastro, não joint venture real. Fundidas as 3 entradas (943/95/492) como uma empresa.

**1 correção manual ao critério automático:** "VW Brasil" preferido sobre "VW Brasil / Fundação" (o critério mecânico teria escolhido o nome mais longo; o nome da empresa-mãe é a melhor identidade canônica, mesmo padrão do precedente Alpargatas/Instituto da Sprint 9).

`companies`: 520 → 447.

### Correção ao smoke test M-12
`expected.social` (35→34) e `expected.sector` (458→444) corrigidos — mudanças reais e legítimas já feitas pela própria auditoria antes desta sessão, nunca propagadas ao `App.jsx`. `expected.profiles` já estava correto em 85 (consistente com o trabalho desta sessão).

## Documentação de sincronização entre sessões

Esta é a parte mais importante deste relatório, por pedido explícito do usuário: a sessão de auditoria **continua em andamento, independente desta**. Escrevi 3 novas entradas em `_DECISIONS.md`:

- **D64-DB** — relato completo dos 3 achados acima, com números e critérios.
- **D65-DB** — lição de processo: nomenclatura mista PT/EN no banco, e a necessidade de checar tabelas sem `FOREIGN KEY` declarada.
- **D66-DB** — **instruções diretas e numeradas para a sessão de auditoria**, incluindo o que fazer antes de rodar a propagação `cnct_courses`→`cnct_profiles` de novo, antes de importar empresas em lote, e como uma cópia mais antiga de `fato_v55.db` pode ser identificada (checar se `cnct_profiles`/`companies` retornam 88/520 em vez de 85/447).

## Validação final

`PRAGMA integrity_check` = ok · `PRAGMA foreign_key_check` = zero violações em **todo** o banco (87 tabelas verificadas, incluindo as sem FK declarada) · queries reais de `loadProfiles`/`loadCompanies`/`loadSectors` testadas contra o banco corrigido · sintaxe do `App.jsx` validada com Babel.

## Resumo de versões do banco nesta sessão

| Versão | Item |
|---|---|
| 58 | Fusão dos 3 pares de `cnct_profiles` (incluindo `dm_sinonimos_perfis`, `cbo_canonical`) |
| 59 | Correção das 4 tabelas com nomenclatura em português que a varredura inicial perdeu |
| 60 | Fusão dos 70 grupos de `companies` (73 registros), com os 2 falsos-positivos e o ajuste manual documentados |

## Pendências para a próxima sessão (qualquer uma das duas linhas)

- Recálculo de `dm_rede_centralidade`/`dm_rede_comunidades` (perfis e empresas) com a topologia atual, sem as duplicatas
- Varredura de duplicatas nunca feita em `atlas_trails` nem `sources` (só `cnct_profiles` e `companies` foram varridas até agora, em sessões diferentes)
- Os 9 PDFs de "Atlas previstos" e 2 notas de cobertura (Sprint 12, nunca processados)
- 13 cursos com PDF mas sem perfil CNCT (Sprint 12, sem superfície de UI)
- DB-L04/L05 (URLs de setor) e SP-09 (vínculo Guia↔CNCT) — pesquisa externa/curadoria

---

<a id="sprint-15"></a>
## Sprint 15

# Sprint 15 — EXP-08: Mercado de Trabalho · Execução

**Data:** 21/06/2026 · **Sessão:** SITE (primeira sob a divisão formal de papéis da Regra 0.1 — nenhuma alteração feita no `.db`, só leitura para validar as queries).

## Contexto

Primeiro item resolvido da pendência SP-12 (35 tabelas `dm_*` sem UI, aberta na Sprint 13): `dm_mercado_trabalho` (dados reais RAIS/PNAD Contínua 2024, 1458 linhas — 64 CBOs × até 18 UFs) foi escolhido como o de maior valor visível ao usuário final, entre as opções levantadas no kit de transição.

## Investigação antes de codar

- Confirmado o formato do CBO: `cnct_profiles.cbo_principal` usa 6 dígitos sem hífen (`300110`), `dm_mercado_trabalho.cbo_6digitos` usa formato com hífen (`3001-10`). Normalizando, **80 dos 85 perfis CNCT (94%)** têm correspondência direta.
- `cbo_canonical` (tabela da linha BANCO, Sprint 13) já fornece nome amigável + `profile_id` para **63 dos 64 CBOs** do mercado de trabalho (98%) — usada como caminho principal de nome/link, em vez de tentar casar por `cbo_principal` diretamente.
- Confirmado: nenhum perfil CNCT tem mais de 1 CBO com dado de mercado (sem ambiguidade na hora de mostrar o painel na página de perfil).
- Achado curioso, não tratado: o CBO `8153-10` (o mesmo que a Sprint 11 tinha marcado como "não confirmado como código brasileiro válido" ao decidir a fusão do par "Técnico em Plásticos") aparece em `dm_mercado_trabalho` com dado real de RAIS (9.320 vínculos). Pode ser um CBO genuíno só sem nome mapeado ainda em `cbo_canonical` — a UI trata isso com um rótulo "(sem nome padronizado)", sem necessidade de ação agora. Registrado aqui para quem investigar `cbo_canonical` no futuro.

## O que foi construído

### `loadMercadoTrabalho(db)` — eager, não lazy
1458 linhas é leve (mesma ordem de grandeza do que já é carregado eager para `technical`/`social`) — carregado dentro de `loadCore()`, sem o padrão de lazy-load usado para `sectors`/`guia`. Isso permite o painel da página de Perfil CNCT aparecer instantaneamente, sem exigir que o usuário visite a aba nova primeiro.

Agregação feita em JS (consistente com o resto do código, que já usa esse padrão para `atlas_trail_aproveitamento` etc.): por CBO, soma de vínculos, salário médio ponderado pelo nº de vínculos por UF, UF com maior mercado, contagem de UFs em tendência de alta.

### Nova aba "Mercado" (`ViewMercadoTrabalho`)
- Lista de ocupações, busca por nome, filtro por setor CNAE (7 setores), ordenação (vínculos/salário/crescimento)
- Card expansível por ocupação: detalhe completo por UF (salário, vínculos, tendência)
- Botão "Ver Perfil CNCT" quando há correspondência (a maioria das 64 ocupações — ver taxa de match na investigação acima)

### Painel na página de Perfil CNCT
Card verde compacto: salário médio nacional, total de vínculos ativos, UF com maior mercado, quantas UFs estão em tendência de alta — com botão para a aba dedicada.

## Correções incidentais (debt cosmético, não afeta dado)
- Mensagem de erro de carregamento do banco ainda citava `fato_v33.db` hardcoded — corrigida para texto genérico (não cita nome de arquivo específico, evita ficar obsoleta de novo).
- Badge de versão no cabeçalho: v3.4 → v3.6.

## Erro de processo cometido e corrigido nesta própria sessão
Duas vezes nesta sessão, uma edição via `str_replace` "engoliu" a linha de declaração da função seguinte (`function loadCore(db) {` e `function ViewAbout(){`) porque o texto de fechamento (`}`) coincidia com o início do bloco que eu pretendia inserir depois. As duas vezes, a validação de sintaxe com Babel (rodada logo após cada edição, antes de seguir adiante) pegou o erro imediatamente — `'return' outside of function` e a ausência de `ViewAbout` no arquivo. Corrigido na mesma sessão, antes de qualquer entrega. Registrado aqui como lembrete de processo: sempre validar sintaxe imediatamente após qualquer edição estrutural, não só no final.

## Validação final
`PRAGMA integrity_check` = ok · `PRAGMA foreign_key_check` = zero (banco não foi alterado nesta sessão, só lido) · sintaxe do `App.jsx` validada com Babel após cada edição estrutural · queries de agregação testadas em paralelo (Python simulando a lógica JS) contra o banco real antes de escrever o código definitivo.

## Pendências

- **SP-12 parcial**: ainda restam ~34 tabelas `dm_*` sem UI (rede de empresas/perfis, concursos técnicos, compras governo, notícias da indústria, etc.) — esta sessão tratou só `dm_mercado_trabalho`.
- O CBO `8153-10` sem nome em `cbo_canonical` (achado acima) — não é tarefa de SITE corrigir (tocar em `cbo_canonical` é domínio de BANCO); se for relevante, registrar como pedido em `_BACKLOG.md` para a sessão BANCO avaliar.
- Mesmas pendências de sempre: 13 cursos com PDF sem perfil, 9 PDFs de Atlas previstos, DB-L04/L05/SP-09 (todas fora do escopo desta sessão).

---

<a id="sprint-16"></a>
## Sprint 16

# Sprint 16 — Recepção de `v65_combinado` + EXP-09 · Execução

**Data:** 23/06/2026 · **Sessão:** SITE. **Entrada:** `sistema_fato_v65_combinado.zip` — primeiro pacote recebido desde a divisão formal de papéis (Regra 0.1) já contendo várias rodadas independentes da sessão BANCO (v61 a v65) mescladas com o `App.jsx` que entreguei na Sprint 15.

## Diagnóstico (Regra 1/6/7 do `_LEIA_PRIMEIRO.md`)

Nada presumido — tudo reconfirmado por execução própria antes de qualquer ação:

- `db.js` aponta para `fato_v55.db` (nome do arquivo não mudou, embora o zip se chame "v65" — exatamente o tipo de pegadinha que a Regra 1 avisa para não confiar de cara).
- 89 tabelas no banco real, schema 100% compatível com o que `App.jsx` consome — checado por `grep` + comparação direta, não por confiança no relato do pacote.
- `companies`: 442 (não 447 — a sessão BANCO fez mais uma rodada de fusão, D70-DB, 5 pares: Anglo American, Khan Academy, Schneider Electric, SEL, GHG Protocol).
- `sources`: 1023 (não 991) — `technical` 83→107 e `guia` 415→438, confirmado por contagem real, não estimativa.
- `trails` (tabela usada pela aba "Trilhas de Carreira" — **não confundir com `atlas_trails`**, que é outra tabela, usada no smoke test e nas páginas de Perfil CNCT): 6→105, via patch SQL da sessão BANCO (D71-DB).

## Lacuna de sincronização encontrada: meu próprio `D68` não chegou ao pacote

A reconciliação da sessão BANCO (v61) partiu de um snapshot anterior à minha entrega da Sprint 15 — meu `App.jsx` com a aba Mercado de Trabalho só foi remesclado de volta na v65 ("v65 combinado"), mas a entrada de `_DECISIONS.md` que eu tinha escrito na mesma sessão (D68, estratégia de junção CBO) não veio junto. Verificado sistematicamente: `_BACKLOG.md`, `_CHANGELOG.md` e `portal/README.md` **tinham** sido mesclados corretamente com meu conteúdo da Sprint 15 — só `_DECISIONS.md` ficou com essa lacuna específica. Recriado como `D73` (número confirmado como o próximo livre no arquivo real, não assumido de memória — a sessão BANCO já tinha avançado até D72-DB nesse meio tempo).

## EXP-09 — Busca e filtro na aba Trilhas

A tabela `trails` cresceu de 6 (curadas manualmente, `trl-01` a `trl-06`) para 105 — as 99 novas (`TRL-*`) vieram de um patch SQL gerado a partir do catálogo CNCT, com conteúdo de qualidade comparável (descrição rica, módulos bem nomeados) mas sem curadoria manual de ícone/cor individual.

Verificado antes de "corrigir" qualquer coisa (Regra 6 — decidir por evidência, não suposição): uma inspeção rápida sugeriu que `color` também estaria vazio nas trilhas novas — **errado**, confirmado por query que `color` está preenchido em todas as 105; só `icon` é `NULL` nas 99 novas. Corrigido só o que de fato precisava: fallback visual (🛠️) para o ícone ausente.

Com 105 trilhas, a lista simples sem filtro (adequada para 6) ficou inviável de navegar. Adicionado:
- Busca por nome da trilha ou rótulo CNCT
- Filtro "só as 6 curadas originalmente"
- Contador de resultados

## Outras correções

- `expected.technical`/`expected.guia` do smoke test M-12 corrigidos para os valores reais confirmados (107/438).
- Comentários de contagem de `companies` no `App.jsx` atualizados (442, com o histórico completo de merges).
- 2 menções residuais a "415 fichas" no texto da aba Guia, corrigidas para 438.

## Higiene de documentação (não é dado, é organização de texto)

- **Ordem de prosa em `_BACKLOG.md`:** os itens SP-15 a SP-22 (achados da sessão BANCO, 20-21/06) estavam posicionados no corpo do texto *antes* de SP-13/SP-14 (achados da sessão SITE, mesma data) — sem perda de conteúdo, só uma ordem não-sequencial que dificulta leitura. Reordenado via script (extração e reinserção precisa, contagem de linhas confirmada idêntica antes/depois: 539=539).
- **Verificação antes de criar, não depois:** ao notar o achado do CBO `8153-10` (que eu mesma tinha registrado na Sprint 15), confirmei que já existia como `SP-22`, corretamente atribuído, com pesquisa parcial já feita pela sessão BANCO — não criei duplicata. Registrei como `SP-23` apenas o achado genuinamente novo desta sessão (`trail_cbos`/`trail_normas` sem UI).

## Validação final

`PRAGMA integrity_check` = ok · `PRAGMA foreign_key_check` = zero (banco não foi alterado nesta sessão — só lido, conforme Regra 0.1) · sintaxe do `App.jsx` validada com Babel após cada edição estrutural · todas as queries (`loadTrails`, `loadCompanies`, `loadMercadoTrabalho`) testadas contra o banco real antes de finalizar.

## Pendências

**Minhas (SITE):**
- SP-12 (~34 tabelas `dm_*` sem UI) — continua, só `dm_mercado_trabalho` foi atendida até agora
- SP-23 (`trail_cbos`/`trail_normas` sem UI) — registrada nesta sessão, não construída
- 13 cursos com PDF sem perfil CNCT, 9 PDFs de "Atlas previstos" — decisão de produto, sem mudança

**Da sessão BANCO (Regra 0.1 — não toquei, só registro aqui para contexto):**
- SP-15 a SP-18, SP-20 a SP-22 — ver `_BACKLOG.md` para detalhe completo de cada um

---

<a id="sprint-17"></a>
## Sprint 17

# Sprint 17 — Investigação e Plano de Eliminação `iedu_*` · Execução

**Data:** 24/06/2026 · **Sessão:** SITE. **Pedido:** usuário enviou screenshot da listagem de arquivos do pacote e pediu um plano para eliminar os 8 arquivos `iedu_*`, por crença de que não tinham conteúdo útil.

## Por que não executei direto

A crença não foi aceita por suposição. Antes de montar qualquer plano, abri amostras reais de cada um dos 6 arquivos não-marcados-como-obsoletos e cruzei contra o banco — exatamente o mesmo padrão de verificação usado em toda esta linha de trabalho (Regra 6). Resultado: a crença era **parcialmente** equivocada — 2 arquivos eram de fato seguros, mas os outros 6 tinham conteúdo real em graus variados, indo de "gap crítico" a "baixo valor".

## Metodologia

Para cada arquivo: amostra de conteúdo em 2-3 pontos do arquivo (início, meio, trecho específico), identificação do padrão estrutural, e busca cruzada no banco pelo conteúdo específico encontrado (não pela existência genérica de uma tabela relacionada — comparação literal sempre que possível).

## Resultado por arquivo

| Arquivo | Veredito | Evidência |
|---|---|---|
| `iedu_integracao_v1.0.md` + `.OBSOLETO.md` | ✅ Seguro, apagado | Já tinha marcador próprio dizendo "migrado, não usar" |
| `iedu_sumario_v2.0.md` + `.OBSOLETO.md` | ✅ Seguro, apagado | Idem |
| `iedu_atlas_v1.0.md` | 🔴 Gap crítico | 55 perfis de destino (PE/PS/PD) com mercado/remuneração/sequência de estudo — busquei os títulos exatos de cursos citados, **nenhum** encontrado no banco; depois descobri que o gap real e maior é nos 55 perfis de destino, não nos cursos individuais |
| `iedu_setores_v7.0.md` | 🟠 Alto valor | Fichas executivas com "Matriz de Acesso por Perfil" e "Gaps Críticos" — não existe estrutura equivalente em nenhuma tabela |
| `iedu_cnct_extracao_v1.0.md` | 🟡 Médio | O próprio arquivo lista os campos que faltavam em 13/06 — comparei contra `cnct_profiles` hoje: 3 de 4 campos já 85/85 preenchidos (trabalho de sprints posteriores). Só "Por que é essencial para I4.0/I5.0" continua único |
| `iedu_cnct_fundamentos_v1.0.md` | 🟢 Quase pronto | Comparação literal de "Técnico em Petroquímica" — texto idêntico, palavra por palavra, em `cnct_profiles.perfil_conclusao` |
| `iedu_guia_v6.3.md` | 🟡 Baixo-médio, volume alto | Comparei o campo "Destaques:" de uma entrada (Emerson MicroTraining) contra `sources.highlight` — bate exatamente. Só o parágrafo narrativo de abertura não está capturado |
| `iedu_indice_v4.1.md` | 🟢 Baixo valor | Estrutura de legenda/cross-reference, sem narrativa por perfil — já reflete o que se tornou schema de tabelas |

## Trabalho de extração feito

Para o achado de maior valor (Atlas), escrevi um parser que:
1. Identificou os 9 limites de Atlas dentro do arquivo único (por header `# Atlas do Técnico em X`)
2. Extraiu todo bloco `## PE-X`/`### PE-X` (e PS-/PD-) do header até o próximo header
3. Mapeou cada bloco ao Atlas correto pela posição no arquivo
4. **Validou contra o banco real**: 55 blocos extraídos, 55 batem exatamente (atlas_num + code) contra `atlas_destination_profiles` — 100% de confiança no mapeamento

Resultado: `extracao_atlas_pe_ps_pd.json`, pronto para a sessão BANCO revisar e carregar.

## Achado incidental, escalado na mesma sessão

Ao comparar `iedu_cnct_fundamentos_v1.0.md` contra `cnct_profiles`, notei que `campo_atuacao` e `infraestrutura_requerida` tinham o **mesmo valor duplicado** para "Técnico em Petroquímica" — parecia ser 1 caso isolado. Continuando a investigação na mesma sessão (não fiquei satisfeita com "1 caso, vou só avisar"), escrevi um parser para os 29 perfis do arquivo e comparei cada um contra o banco:

**Resultado: 18 de 29 perfis (62%) têm o mesmo bug.** Causa raiz identificada com certeza, não suposição: o markdown-fonte usa rótulos em texto puro (sem negrito), com "Infraestrutura mínima requerida" e "Campo de atuação" listados em sequência, seguidos pelos 2 blocos de conteúdo na mesma ordem — fácil de ler certo como humano, fácil de embaralhar num script de extração automática (que aconteceu antes da Sprint 6, não nesta sessão nem nesta linha de trabalho).

Escrevi e validei o parser correto (`extracao_cnct_fundamentos_corrigido.json`), confirmando por amostra que o texto extraído bate exatamente com a leitura manual feita mais cedo na mesma sessão. Isso muda o item de "pedido de investigação" para "correção pronta para aplicar" — atualizei a prioridade em `_BACKLOG.md` de 🟡 para 🔴 nesse item específico, dado o volume de perfis afetados.

Também completei, na mesma sessão, a extração que tinha deixado pendente:
- **22 parágrafos "Por que é essencial para I4.0/I5.0"** (`extracao_cnct_justificativa.json`) — precisou de 3 rodadas de ajuste de regex (o rótulo varia entre "I4.0/I5.0", "I4.0" e "I5.0" sozinhos; o texto às vezes vem na mesma linha do rótulo, às vezes na linha seguinte). Match 26/26 por nome contra `cnct_profiles`; os 4 perfis sem justificativa foram confirmados por inspeção direta como genuinamente sem esse campo no documento original.
- **2 notas de desambiguação de CBO sobreposto** (Seção 9 do Índice) — pequeno o suficiente para incluir direto no `PLANO_ELIMINACAO_IEDU.md`, sem precisar de arquivo JSON separado.

## Limite de papel respeitado (Regra 0.1)

Esta sessão é SITE. Não escrevi nenhum `ALTER TABLE`/`INSERT`/`UPDATE` no `.db` — só li para validar. A migração proposta (Atlas pronto, CNCT pronto incluindo a correção do bug de 18 perfis, Índice pronto, Setores/Guia em decisão de produto) foi formalizada como pedido em `_BACKLOG.md` (SP-24), com todo o payload de dados já extraído e validado entregue junto, para a sessão BANCO não precisar refazer nenhuma investigação.

## O que foi efetivamente apagado nesta sessão

- `iedu_integracao_v1.0.md`
- `iedu_integracao_v1.0.OBSOLETO.md`
- `iedu_sumario_v2.0.md`
- `iedu_sumario_v2.0.OBSOLETO.md`

## O que NÃO foi apagado, e por quê

Os outros 6 `iedu_*` — porque cada um tem conteúdo real confirmado, em graus diferentes, e apagar antes de migrar ou decidir formalmente que não vale migrar seria perda de informação irreversível. Ver `PLANO_ELIMINACAO_IEDU.md` para o plano de execução faseado completo.

## Validação

Nenhuma validação de `.db`/`App.jsx` necessária — esta sessão não tocou em nenhum dos dois (só leu o banco para comparação, conforme Regra 0.1). Arquivos de texto novos/editados verificados por leitura direta, não há sintaxe de código envolvida nesta sessão.

## Pendências

- **Para a sessão BANCO** (SP-24, prioridade 🔴 no item de bug): aplicar as 4 migrações com dado pronto (Atlas, CNCT justificativas, correção do bug de 18 perfis, desambiguação de CBO) e decidir prioridade do item 5 (Setores).
- **Decisão de produto** (usuário, qualquer sessão): formato de destino para o conteúdo de Setores e os parágrafos narrativos do Guia — manter os arquivos até essa decisão, não apagar.

---

