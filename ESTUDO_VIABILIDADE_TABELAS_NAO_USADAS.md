---
tipo: Estudo de viabilidade (sessão SITE, 15/07/2026) — atualizado 15/07/2026 com status de implementação (SP-45/SP-46) e novas possibilidades achadas no caminho
escopo: as 68 tabelas/views de fato_v168.db que hoje NENHUMA query do portal referencia
não substitui: _BACKLOG.md (onde os itens aprovados viram SP-NN) nem SCHEMA.md (dicionário completo)
---

# Tabelas e views não usadas pelo portal — estudo de viabilidade

## Método

Comparei a lista de `FROM`/`JOIN` de todo `portal/data/*.js` + `App.jsx` + `components/` + `views/`
contra as 116 tabelas + 16 views de `fato_v168.db`. 68 objetos (52 tabelas, 16 views) não aparecem
em nenhuma query real — confirmado por `grep` bruto do nome em todo o código, não só nas cláusulas
`FROM`/`JOIN` (para pegar qualquer uso indireto que a regex tivesse perdido).

Para cada um dos candidatos com valor aparente, testei: contagem de linhas, integridade referencial
contra as tabelas que o portal já carrega (FKs órfãs = risco), e se o conteúdo já está coberto —
total ou parcialmente — por alguma tela existente (pra não recomendar reconstruir o que já existe).

Classificação: **🟢 Implementar** (dado rico, FK íntegra, encaixa numa tela existente ou justifica
uma nova) · **🟡 Viável com decisão de produto** (dado bom, mas overlap parcial com algo existente,
ou exige uma escolha de UX antes de codar) · **⚪ Não recomendado** (infraestrutura interna, dado
morto/vazio, ou já coberto de forma equivalente ou melhor por outra tela).

---

## Status de implementação (atualizado 15/07/2026, sessão SITE — SP-45/SP-46)

| # | Item | Status |
|---|---|---|
| 1 | Perfis de Elite | ✅ **Implementado** — nova aba `ViewElitePerfis.jsx` |
| 2 | Onde estudar por passo | ✅ **Implementado** — `TrailCard.jsx` |
| 3 | Currículo detalhado por trilha | ✅ **Implementado** — painel de trilha em `ViewProfiles.jsx` |
| 4 | Catálogo de normas técnicas | 🔴 **Bloqueado** (dado ruim, ver achado abaixo) — **mas achei um caminho alternativo de baixo esforço, não bloqueado, ver "Novas possibilidades" § A |
| 5 | Matriz de pivotamento | ✅ **Implementado** — seção em `ViewProfiles.jsx` |

Detalhe completo de cada implementação: `_BACKLOG.md` SP-45. Detalhe do bloqueio do item 4: `_BACKLOG.md`
SP-46. As seções de 1 a 5 abaixo foram **atualizadas in-line** (não reescritas do zero) para refletir
o que foi encontrado ao implementar — o texto original da recomendação continua ali, com uma nota de
"IMPLEMENTADO" ou "ACHADO" logo abaixo de cada um.

Uma seção nova, **"Novas possibilidades encontradas durante a implementação"**, foi adicionada depois
do Tier 3, com itens que não existiam nesta versão original do estudo — descobertos só ao mexer de
fato no código e no dado, não visíveis numa varredura de schema por fora.

---

## 🟢 Tier 1 — Implementar (dado rico, pronto, sem redundância)

### 1. `atlas_destination_profiles` (55 linhas) — Perfis de Elite (combinação de trilhas)
Conteúdo editorial **completo e pronto**, em Markdown: cada linha é um "perfil de elite" formado pela
combinação de 2 a 4 trilhas Atlas (ex.: *PE-1 — Especialista em Sistemas de Controle e Segurança
Industrial* = trilhas A2+A3+D3+D5), com mercado de atuação, faixa salarial de referência, e uma
escada completa de "saídas intermediárias" (o que o profissional já consegue fazer após cada trilha
concluída, com empregabilidade e mercado por etapa) — 3 níveis: Especialista (dupla), Sênior
(tripla), Elite (quádrupla). Hoje **não existe nenhuma tela que mostre isso** — é conteúdo
100% autoral, não uma agregação de outra tabela.
**Por que agora:** é o tipo de "peça de assinatura visual" que o projeto já buscou antes (ver D111,
rede de carreira) — aqui o conteúdo já vem pronto, só falta uma tela.
**Encaixe:** nova aba "Perfis de Elite" ou seção dentro de `ViewTrails`/`ViewProfiles` (trilha →
"esta trilha compõe os perfis de elite X, Y" via o campo `Trilhas` do markdown, hoje texto livre —
precisaria parsear `A2 + A3 + D3 + D5` pra virar link, ou renderizar como está).
**Esforço:** baixo — é essencially renderizar Markdown já existente + 1 índice por trilha componente.
**Risco:** nenhum problema de FK (chave é `atlas_num`, que casa com `atlas_docs.num` — mas o vínculo
é textual dentro do markdown, não uma FK declarada; não bloqueia exibir o conteúdo como está).

> ✅ **IMPLEMENTADO (15/07, SP-45)** — nova aba "Perfis de Elite" (`views/ViewElitePerfis.jsx`),
> parser Markdown próprio (sem lib — projeto não tem bundler, ver `index.html`). **Achado ao
> implementar, não visível nesta análise original:** o campo `Trilhas` **não segue um formato
> único** — existem 3 templates de texto distintos nas 55 linhas (perfis "Elite" quádrupla vs.
> "Saídas Sequenciais" vs. 8 perfis "consolidados" que descrevem pré-requisito em prosa livre, sem
> campo estruturado). O parser final cobre 47/55 com extração de código de trilha (0 código
> extraído que não bata contra `atlas_trails.code`); os 8 restantes mostram o texto completo, só
> sem virar *pill* clicável — risco de extrair errado por regex maior que o benefício, pra esses 8.

### 2. `trail_escola_links` (894 linhas) + `escola_sources` (253 linhas) — "Onde estudar" por passo de trilha
Vínculo **direto e concreto**: para 508 dos 894 registros (trilhas específicas, `trail_id` = `trails.id`,
100% de integridade referencial confirmada), cada passo de uma trilha aponta pra uma escola/instituição
real com nome do curso e URL. É exatamente o tipo de informação acionável ("onde eu me matriculo pra
fazer este passo") que falta hoje — `TrailCard` mostra os passos, mas não onde cursá-los.
**Encaixe:** `TrailCard`/`ViewTrails`, um link "🎓 Onde estudar" por passo, abrindo a URL real.
**Esforço:** baixo-médio — 1 query nova em `loadTrailsProfiles.js` (`groupBy` por `trail_id`+`step_ordem`),
1 elemento novo em `TrailCard.jsx`.
**Risco:** nenhum — `escola_id` 100% resolvido contra `escola_sources`, `trail_id` 100% resolvido contra
`trails.id`.

> ✅ **IMPLEMENTADO (15/07, SP-45)** — `TrailCard.jsx`, seção "🎓 Onde estudar este passo" por
> etapa. **Achado ao testar contra o `.db` real (Regra 3.1), melhor que a estimativa acima:**
> não é 508/894 — é **894/894 (100%)** resolvendo contra `trails.id` **e** contra `escola_sources.id`
> simultaneamente, 0 órfãos em qualquer uma das duas FKs. O número de 508 desta versão do estudo
> parece ter medido outra coisa (talvez uma contagem de "trilhas específicas" vs. "categorias
> genéricas" dentro dos próprios dados, não integridade de FK) — vale investigar de onde veio esse
> número se este estudo for revisado, mas não bloqueou a implementação.

### 3. `atlas_trail_detail` (74 linhas) — Currículo detalhado por trilha/nível
Hoje `ViewTrails`/`TrailCard` mostram só a descrição geral da trilha Atlas. Esta tabela tem, por
trilha × nível (Iniciante/Intermediário/Avançado etc.), o `perfil_saida` (o que o aluno sabe fazer
ao concluir aquele nível), o `curriculo` (lista de tópicos reais, ex. "Processo MIG/MAG — fundamentos
e parâmetros"), carga horária estimada e as normas técnicas do nível (`normas_ref`, JSON). **100% de
integridade** (`trail_id` → `atlas_trails.id`, 0 órfãos).
**Encaixe:** expansível dentro do `TrailCard` (hoje só mostra passos genéricos) — "ver currículo
detalhado por nível".
**Esforço:** médio — currículo é uma string de tópicos separados por `·`, precisa virar lista; `normas_ref`
já vem como JSON array, fácil de parsear e cruzar com `normas_fato` (item 4 abaixo) se ele também
for implementado.

> ✅ **IMPLEMENTADO (15/07, SP-45)** — painel de detalhe de trilha Atlas em `ViewProfiles.jsx`,
> seção "Currículo Detalhado por Nível". 74/74 linhas resolvendo contra `atlas_trails.id`, 0 órfãos,
> `normas_ref` parseado como JSON e renderizado como *pills*. **Achado que abriu uma possibilidade
> nova (não prevista aqui):** o cruzamento de `normas_ref` com `normas_fato.codigo` (item 4) tem
> **166/295 (56%) de overlap** — ver "Novas possibilidades" § A, isso muda a recomendação do item 4.

### 4. `normas_fato` (295 linhas) + `vw_normas_fato_completa` — Catálogo de normas técnicas
Hoje normas aparecem como *pills* de código (`NR-12`, `ISO 2553`) em `ViewProfiles`, `TrailCard`,
`SourceCard` — sem explicação nenhuma do que a norma é. `normas_fato` tem `descricao` e `tipo_norma`
pra cada uma das 295, mais frequência de uso (quantas trilhas/cursos/perfis citam aquela norma) —
dá pra virar um catálogo pesquisável e, mais importante, dá pra transformar as *pills* já existentes
em links reais pra um detalhe da norma, em vez de texto solto sem contexto.
**Encaixe:** nova aba "Normas Técnicas" (lista + busca) e as *pills* já existentes viram `<a>`/`onClick`
pra abrir o detalhe.
**Esforço:** médio — 1 view nova, 1 query, e trocar 3 componentes que já renderizam normas como texto
plano por um componente clicável compartilhado.

> 🔴 **BLOQUEADO como escrito (15/07, SP-46) — achado de qualidade de dado, não implementado.**
> Checagem própria antes de codar (Regra 3.3) contradiz a premissa acima ("tem `descricao` ... pra
> cada uma das 295"): só **55/295 (18,6%)** têm `descricao` preenchida, e boa parte dessas 55 parece
> texto corrompido/fora de ordem — ex. `"API Fonte: acesso — de e loja mycommittees.api.org via"`,
> `"DNV 3. Padrões — (Det A DNV Norske Estruturas Unidades e para Veritas) classificação em global
> referência é"` — leitura como extração OCR/scraping malsucedida, não frase real. Também há
> duplicata em `frequencia_total` (`"Lei nº 5.524/1968"` vs `"Lei nº nº 5.524/1968"`). Publicar a
> UI como desenhada mostraria texto ilegível pra ~87% das normas. Pedido formal registrado pra
> sessão BANCO (`_BACKLOG.md` SP-46) — não é o lado SITE que corrige dado (Regra 0.1).
>
> **Mas — ver "Novas possibilidades" § A abaixo:** existe um caminho alternativo de baixo esforço,
> **não bloqueado por essa correção**, usando dado que já está carregado (item 3, implementado).

### 5. `dm_matriz_pivotamento` (7.140 linhas) — Matriz de pivotamento de carreira
Todo par `(perfil_origem_id, perfil_destino_id)` com `horas_necessarias` e `nivel_dificuldade`
("📚 Curso complementar", "⏳ Mudança de Carreira (recomeço)" etc.) — 85 perfis de origem cobertos.
Isso é **diferente e complementar** ao que `RedeDeCarreira.jsx` já mostra (sinônimo/comunidade,
vínculo qualitativo): aqui é quantitativo — "quanto custa, em horas, ir do perfil X pro perfil Y".
**Encaixe:** dentro da tela de perfil, um seletor "quero pivotar para..." que mostra o custo estimado
pros outros 84 perfis, ordenado por esforço. Complementa (não substitui) o grafo de rede já existente.
**Esforço:** médio — 7.140 linhas é tranquilo pro sql.js em memória (o banco inteiro já carrega),
mas a UI (seletor + ranking) é trabalho novo, não só encanar uma query.
**Risco:** nenhum problema de FK aparente contra `cnct_profiles.id` (não testado par a par, mas o
padrão de `profile_id` já é usado em outras tabelas do mesmo lote sem órfãos).

> ✅ **IMPLEMENTADO (15/07, SP-45)** — seção "Pivotar para Outro Perfil" em `ViewProfiles.jsx`
> (busca + lista expansível). **Testado par a par contra `cnct_profiles.id` (não estava testado
> nesta versão do estudo):** 7.140/7.140 resolvendo dos dois lados (`perfil_origem_id` e
> `perfil_destino_id`), 0 pares `(X,X)`. Complementa (não substitui) o `dm_premio_transferencia`
> (SP-12) que já existia — aquele é qualitativo/top-5, este é quantitativo/todos os 84 destinos.

---

## 🟡 Tier 2 — Viável, mas com decisão de produto antes de codar

### 6. `dm_rede_empresas_centralidade`/`_comunidades` + `dm_monopolio_oferta_arquivado` (via `vw_rede_empresas`, 470 linhas)
É o **exato equivalente**, pro lado empresas, do que `RedeDeCarreira.jsx`/`ViewRedeCarreira.jsx` já
fazem pro lado perfis (D111) — centralidade, comunidades, e aqui também setor dominante por empresa.
A view `vw_rede_empresas` já faz o JOIN pronto (e já foi corrigida pra apontar pro nome novo da tabela,
ver D112). **Por que Tier 2 e não Tier 1:** não é "encaixar numa tela existente", é literalmente
replicar a peça de rede de carreira pro lado empresas — decisão de produto (vale um "Rede de
Empresas" espelhando a aba já construída?), não só esforço técnico.
**Encaixe:** `ViewEmpresas.jsx` ganha uma sub-visão de grafo, reaproveitando o layout radial/comunidades
já validado em `RedeDeCarreira.jsx` (mesma matemática, dado trocado).
**Esforço:** médio — a peça visual já existe como referência de implementação, é adaptação, não
design do zero.

### 7. `sector_programs` (174 linhas, 94 empresas) — Programas de treinamento de empresa
`loadSocial` hoje só lê `sources WHERE layer='social'`. `sector_programs` é uma segunda fonte de
programas sociais/formação por empresa (formato, público-alvo, custo, detalhe) que **não entra**
nessa query — `v_all_social_sources` (view não usada) já faz o `UNION ALL` correto entre as duas
fontes. **Achado relevante:** isso significa que a aba Social hoje mostra menos programas de empresa
do que existem no banco.
**Encaixe:** trocar a query de `loadSocial` pra usar a união (via `v_all_social_sources` ou replicando
o `UNION` direto), ou adicionar `sector_programs` como uma seção própria dentro do perfil de empresa
em `ViewEmpresas`.
**Esforço:** baixo-médio — decisão de produto é só "mesclar na lista existente ou seção separada?";
tecnicamente é 1 query a mais.

### 8. `vw_indicador_demanda` + `vw_mapa_calor_preditivo` + `vw_mapa_competencias_predito` + `dm_pnp_indicadores` — Painel por UF
Hoje `ViewMercadoTrabalho` mostra compras públicas, concursos, notícias e o "colapso silencioso"
como **listas item a item**, cada uma com sua própria tag de UF solta no meio do texto. Essas 4
views agregam exatamente esses mesmos dados (mais `dm_oferta_real`, já usada por curso) **por UF**,
com um `score_demanda`/`score` de ranking — dá pra um painel "Panorama por Estado" que hoje não
existe em nenhuma forma, nem lista nem agregado.
**Por que Tier 2:** as 3 primeiras views somam tabelas que **já são usadas** noutro lugar (não é
dado novo, é uma segunda lente sobre o mesmo dado) — decisão de produto se vale a pena um painel
agregado adicional ou se football-listas já bastam.
**Encaixe:** nova sub-aba "Panorama por Estado" em `ViewMercadoTrabalho`, um mapa de calor ou ranking
de UF por `score_demanda`.
**Esforço:** baixo — as 4 views já fazem toda a agregação em SQL, é só consumir e desenhar.

### 9. `guia_source_profiles` (1.654 linhas) — Vínculos fonte↔perfil adicionais
`source_cnct_profiles` (já usada) tem 8.711 vínculos fonte↔perfil exclusivos dela; `guia_source_profiles`
tem **914 vínculos que não existem em `source_cnct_profiles`** (740 se sobrepõem, 914 são só dela).
Ou seja: a tela de perfil hoje pode estar **sub-representando** quantas fontes existem pra um perfil
específico, porque só um dos dois mecanismos de vínculo é consultado.
**Por que Tier 2 e não Tier 1:** juntar as duas fontes muda uma contagem que já está em produção
(risco de "quebra" percebida se o número de fontes por perfil mudar sem aviso) — vale confirmar com
quem decide produto antes de simplesmente somar, e checar se os 914 exclusivos são vínculo curado
(`provenance='curado'`, como a amostra sugeriu) ou heurístico antes de tratar com o mesmo peso.
**Encaixe:** `loadProfiles`/`ViewProfiles`, união com `source_cnct_profiles` (mesmo padrão que
`vw_buscador_v2` já usa internamente).
**Esforço:** baixo tecnicamente; a parte de "decisão" é o que empurra pra Tier 2.

### 10. `material_types` (16 tipos) + `source_material_types` (132 de 2.045 fontes, ~6,5%)
Taxonomia pronta de tipo de fonte (norma técnica, portal regulatório, software técnico, instituto
federal etc.) que poderia virar um badge extra no `SourceCard`, complementando os badges de tag/formato
já existentes.
**Por que Tier 2:** cobertura muito baixa hoje (132/2.045, 6,5%) — um badge que aparece em 1 a cada
15 fontes é mais inconsistência visual do que recurso. Viável, mas só depois de aumentar a cobertura
(pedido pra sessão BANCO) ou tratando ausência como "não classificado" de forma discreta.
**Esforço:** baixo — é só mais um campo no `SourceCard`, condicionado a existir.

### 11. `course_graduacoes` (630, 98 perfis) + `course_especializacoes` (348, 98 perfis) + `course_tags` (668, 99/99 cursos)
Versão **mais completa** do que `cnct_verticalizacao` (já usada) mostra hoje: `cnct_verticalizacao`
cobre 85 perfis com só o nível "Tecnólogo"/"Bacharelado" resumido (às vezes 1 item onde `course_graduacoes`
tem 5); `course_graduacoes`+`course_especializacoes` cobrem **98 perfis** (13 a mais) e adicionam um
nível inteiro que não existe hoje na tela — "especializações técnicas intermediárias" (nem curso
técnico nem graduação, o degrau entre os dois).
**Por que Tier 2:** não é dado novo isolado, é **melhoria/substituição** de uma seção já existente
(verticalização em `ViewProfiles`) — trocar a fonte de uma seção em produção é decisão de produto,
mesmo quando a fonte nova é estritamente mais completa.
**Esforço:** médio — trocar a query de verticalização por esta (mais rica), e decidir se especialização
técnica vira uma 3ª coluna ou fica junto de Tecnólogo/Bacharelado.

### 12. `trail_dependencies` (14 linhas) — Trilhas relacionadas / pré-requisito
Pequena mas específica: liga um "Módulo Especializado" (`child_id`) à trilha-base da qual ele deriva
(`parent_id`), com os temas-chave que motivam a dependência. Só 14 linhas — não justifica uma tela
própria, mas é barato de anexar.
**Encaixe:** dentro de `TrailCard`, se `child_id` bater com a trilha aberta, mostrar "trilha derivada
de X" ou "trilhas derivadas desta" — mesmo padrão de "trilhas-irmãs" já implementado em SP-35.
**Esforço:** baixo.

### 13. `atlas_docs` (18 linhas) — Metadados dos PDFs Atlas
Nome oficial do Atlas, os cursos CNCT de origem (com página), e os códigos de bloco de competência
(`AUT`, `SEG`, `SOL` etc.) por documento. Complementa `atlas_destination_profiles`/`atlas_trail_detail`
(mesmo `num`/`atlas_num`) — se qualquer um dos itens 1 ou 3 for implementado, vale trazer este junto
como cabeçalho/contexto ("este perfil de elite vem do Atlas de Petroquímica, p. 218").
**Esforço:** baixo, mas só faz sentido *depois* de decidir sobre os itens 1/3.

---

## ⚪ Tier 3 — Não recomendado

**Infraestrutura de processo/auditoria (decisão já documentada antes, ver `SP-12`/`SP-38`/Regra 0.1
em `_LEIA_PRIMEIRO.md` — decisão de produto de sessões anteriores foi explicitamente não expor gestão
interna ao usuário final):**
`db_versions`, `db_versions_v2`, `meta_protocolo`, `gaps_v2`, `schema_metric_docs`, `documents`,
`dm_proveniencia_dados`, `dm_truncamento_corrigido`, `dm_url_validation`, `dm_emec_validation`,
`dm_rais_match_quality`, `dm_completude_fontes`, `dm_cbo_pendentes`, `dm_curso_cbo_bridge`,
`dm_empresas_duplicatas_log`, `company_name_variants`.

**Backups/arquivo — por definição não são estado atual, existem só para rastreabilidade:**
`companies_removidas_backup` (321), `cnct_courses_backup_pre_migracao` (99, ver v168),
`trails_arquivadas` (15), `trail_steps_arquivados` (75), `dm_rede_empresas_centralidade_arquivado`
(366), `dm_rede_empresas_comunidades_arquivado` (15).

**Dado morto, vazio, ou tamanho residual que não sustenta uma tela própria:**
`company_institution_links` (**0 linhas**), `cnct_coverage_gaps` (1 linha, já `status='resolvido'`),
`cnct_cbo_disambiguacao` (2 linhas — critério editorial de desambiguação, no máximo uma nota de
rodapé se algum dia a ambiguidade de CBO virar tela, o que hoje não é o caso).

**Tabelas-ponte de taxonomia — uso interno de JOIN, não conteúdo de produto (risco já sinalizado em
`SP-39`: 4 taxonomias de setor concorrentes; expor mais uma tela por cima delas aumentaria a confusão,
não reduziria):**
`industry_to_sector_map`, `sector_industry_map`, `sector_mapping`, `sector_to_sector_codes`,
`source_sector_codes` (1.381, já é insumo interno de `loadSectorsGuia.js` via outras tabelas),
`source_guia_blocks` (504, idem).

**Views redundantes — o dado já é consumido, de forma equivalente ou melhor, por outra tela:**
- `vw_trilha_enhanced` — versão simplificada (3 faixas fixas) do que `dm_versatilidade_trilhas`
  já alimenta em `ViewProfiles` com o dado completo (`qtd_setores`, `classificacao`, `setores_list`).
- `vw_rede_carreiras` — mesmas 2 tabelas-fonte (`dm_rede_centralidade`+`dm_rede_comunidades`) que
  `ViewRedeCarreira.jsx`/`RedeDeCarreira.jsx` já consomem diretamente, com mais detalhe (D111).
- `vw_buscador_completo` (12.415 linhas) / `vw_buscador_v2` (11.606 linhas) — pré-agregações
  denormalizadas que fazem sentido pra busca **server-side**; a arquitetura do portal é client-only
  (sql.js) com índice FTS5 construído em memória a cada carga (`searchIndex.js`) — reconstruir a
  busca em cima dessas views seria trocar uma solução que já funciona por outra sem ganho líquido.
- `vw_guia_companies_clean` — view de reconciliação de gap de sourcing (uso interno do lado BANCO
  pra rastrear ambiguidade de vínculo `source→atlas_trail`), não é conteúdo pra usuário final.
- `vw_trail_index` — índice interno que `loadTrails`/`loadAtlasTrails` já cobrem com joins mais
  explícitos e específicos pro que cada tela precisa.
- `vw_trails_ativas` — filtro auxiliar (trilha tem pelo menos 1 step/escola/cbo) que não muda o que
  já é exibido, já que trilhas sem esses vínculos também não apareceriam por outras queries.
- `vw_cnct_catalogo` — consolidação de `cnct_profiles`+`cnct_courses`+`cnct_cbos` que `loadProfiles`
  já monta manualmente, com mais controle sobre o formato de saída; adotar a view substituiria código
  já funcionando sem ganho.
- `vw_cnct_cobertura` — cruza `cnct_profiles` com `cnct_coverage_gaps` (que tem 1 linha só, já
  resolvida) — visão de gap interno, não conteúdo de produto.
- `v_all_social_sources` — não é uma feature nova, é a *solução técnica* pro item 7 (Tier 2) acima,
  não um item à parte.

---

## Novas possibilidades encontradas durante a implementação (15/07/2026, SP-45)

Nenhum destes 4 itens estava nesta versão original do estudo — só ficaram visíveis ao mexer de fato
no código e no dado real, não numa varredura de schema por fora.

> **Status (15/07/2026, sessão SITE seguinte):** os 4 itens abaixo foram implementados —
> ver `_BACKLOG.md` SP-47 a SP-50 e `CHANGELOG_PORTAL.md` v3.23 pros detalhes exatos de cada um
> (inclusive o que ficou parcial/bloqueado no item B). O texto original de cada item abaixo foi
> mantido como estava escrito na sessão que os achou — só a linha "Status" foi acrescentada.

### A. Catálogo de normas técnicas via `atlas_trail_detail.normas_ref` — alternativa ao item 4, não bloqueada
> **Status: ✅ implementado (SP-47).** `SourceCard` ficou fora do escopo (ver `_BACKLOG.md`/D113) —
> normas lá são resumo de texto truncado, não pills individuais.
O item 4 (`normas_fato`) está bloqueado por qualidade de `descricao` (§ SP-46). Mas ao implementar o
item 3 (`atlas_trail_detail`), o campo `normas_ref` de cada nível de trilha é um JSON array de códigos
de norma — e **166 das 295 normas de `normas_fato` (56%) aparecem em pelo menos um `normas_ref`**
(checado par a par, `json.loads` de cada linha, `set` de códigos citados vs. `normas_fato.codigo`).
Isso permite montar contexto pra norma **sem depender do campo `descricao` quebrado**: em vez de "o
que é a NR-12" (texto ruim/ausente), mostrar "em quais trilhas e níveis a NR-12 aparece" (dado 100%
funcional, já carregado pelo item 3). Menos ambicioso que o catálogo original (não é uma definição
editorial da norma), mas é **real, funcional, e não depende de nenhuma correção do lado BANCO**.
**Encaixe sugerido:** as *pills* de norma que já existem em 3 componentes (`ViewProfiles`, `TrailCard`,
`SourceCard`) ganham `onClick` abrindo um popover/painel pequeno: nome da norma (se `descricao_completa`
existir; senão só o código), tipo (se `tipo_norma` existir), e a lista de trilhas/níveis que a citam
(reverse-index de `atlas_trail_detail.normas_ref`, já calculável a partir do dado que o item 3 carrega).
**Esforço:** baixo — o reverse-index é um `groupBy` sobre dado que já está em memória (item 3), não
uma query nova.

### B. Bug pré-existente: `atlasTrails.find(x=>x.code===code)` não desambigua por Atlas — achado, não corrigido nesta sessão
> **Status: 🟡 varredura completa feita, 3 de 4 pontos corrigidos (SP-48).** O 4º ponto
> (`ViewGaps.jsx`, via `gap_atlas_trails`) não é corrigível do lado SITE — schema sem `atlas_num`/
> `trail_id` — virou pedido formal SP-51 pra sessão BANCO. Critério completo em `_DECISIONS.md` D113.
`ViewProfiles.jsx` (linha ~392, código de antes desta sessão, não tocado no SP-45) resolve o nome de
uma trilha Atlas a partir só do `code` (ex. `"C1"`), sem filtrar por `atlas_num`. **28 códigos de
trilha se repetem entre 2 e 6 Atlas diferentes** (ex. `C1` existe nos Atlas I, II, III, V e VII —
5 trilhas diferentes com o mesmo código; `F1` existe em 6). `Array.find()` sempre pega a primeira
ocorrência (ordem de `atlas_trails.id`), então o nome exibido pra esses 28 códigos pode estar **errado**
dependendo de qual perfil os referencia — não é hipotético, é um bug de exibição real, só não tinha
sido notado porque nenhuma tela anterior cruzava tantos Atlas ao mesmo tempo quanto Perfis de Elite
(item 1) agora cruza. **Correção sugerida:** trocar para `atlasTrails.find(x=>x.code===code&&x.atlas_num===contexto)`
nos ~2 lugares que fazem esse lookup — precisa do `atlas_num` do perfil/contexto disponível no
escopo (já é o padrão usado dentro de `ViewElitePerfis.jsx`, que eu escrevi corretamente desde o
início por já saber deste risco).
**Esforço:** baixo — é uma correção de 2 linhas, mas exige achar todos os lugares que fazem esse
lookup ambíguo antes de fechar (não fiz essa varredura completa nesta sessão, só documentei o achado).

### C. `escola_sources.tipo` — badge de tipo de instituição nos links "onde estudar" (item 2)
> **Status: ✅ implementado (SP-49).**
Ao implementar o item 2, notei que `escola_sources` tem um campo `tipo` não usado:
`senai` (67), `governo` (41), `privada` (8), `federal` (4) — 120/253 (47%) preenchido, cobertura bem
melhor que o item 10 do Tier 2 (`material_types`, 6,5%). Dá pra virar um badge pequeno ao lado de
cada link "🎓 Onde estudar" (ex. "SENAI", "Rede Federal") sem esforço extra de query — o dado já é
carregado pela mesma tabela que o item 2 já usa.
**Esforço:** baixo — 1 campo a mais na mesma query já existente, 1 `<span>` a mais no `TrailCard.jsx`.

### D. Índice reverso "esta trilha compõe os Perfis de Elite X, Y" — mencionado como possibilidade no item 1 original, ainda não feito
> **Status: ✅ implementado (SP-50).**
O item 1 original já cogitava isso ("trilha → 'esta trilha compõe os perfis de elite X, Y'") mas
marcou como esforço adicional não incluído no escopo mínimo. Com o item 1 implementado e o parser de
trilhas funcionando pra 47/55 perfis (§ atualização do item 1 acima), o índice reverso agora é
barato: `eliteProfiles` já carrega `trilhas: string[]` por perfil — um `groupBy` simples por código
de trilha entrega, pra cada trilha Atlas, quais Perfis de Elite a usam. Ainda não conectado à tela
de detalhe de trilha (`ViewProfiles.jsx`, painel `trailDetail`) — ficaria natural ao lado da seção
"Currículo Detalhado por Nível" (item 3) que já existe ali.
**Esforço:** baixo — dado já carregado pelos itens 1 e 3, é `groupBy` + 1 seção de UI.

---

---

## Resumo executivo

| # | Item | Linhas | Tier | Esforço | Status (15/07) |
|---|---|---|---|---|---|
| 1 | Perfis de Elite (`atlas_destination_profiles`) | 55 | 🟢 | Baixo | ✅ Implementado (SP-45) |
| 2 | Onde estudar por passo (`trail_escola_links`+`escola_sources`) | 894+253 | 🟢 | Baixo-médio | ✅ Implementado (SP-45) |
| 3 | Currículo detalhado por trilha (`atlas_trail_detail`) | 74 | 🟢 | Médio | ✅ Implementado (SP-45) |
| 4 | Catálogo de normas técnicas (`normas_fato`) | 295 | 🟢→🔴 | Médio | 🔴 Bloqueado (SP-46) — ver alternativa § A |
| 5 | Matriz de pivotamento de carreira (`dm_matriz_pivotamento`) | 7.140 | 🟢 | Médio | ✅ Implementado (SP-45) |
| 6 | Rede de Empresas (`vw_rede_empresas`) | 470 | 🟡 | Médio | ✅ Implementado (SP-58) — "pode replicar" |
| 7 | Programas de treinamento de empresa (`sector_programs`) | 174 | 🟡 | Baixo-médio | ✅ Implementado (SP-56) — "pode mesclar" |
| 8 | Panorama por Estado (4 views agregadas) | — | 🟡 | Baixo | ✅ Implementado (SP-57) — "painel agregado" |
| 9 | Vínculos fonte↔perfil adicionais (`guia_source_profiles`) | 1.654 | 🟡 | Baixo* | ✅ Implementado (SP-55) — "pode somar" (ganho real foi outro, ver SP-55) |
| 10 | Badge de tipo de fonte (`material_types`) | 16 tipos/132 fontes | 🟡 | Baixo | ✅ Implementado (SP-54) — "pode implementar" |
| 11 | Verticalização mais completa (`course_graduacoes`+`especializacoes`) | 978 | 🟡 | Médio | ✅ Implementado (SP-63, 18/07) — "junto com Tecnólogo/Bacharelado". **Correção da premissa deste item**: a fonte nova NÃO é superset da antiga (30/85 perfis perderiam item real) — implementado como união, não substituição. Ver `_DECISIONS.md` D119 |
| 12 | Trilhas relacionadas (`trail_dependencies`) | 14 | 🟡 | Baixo | ✅ Implementado (SP-53) — "pode anexar" |
| 13 | Metadados do Atlas (`atlas_docs`) | 18 | 🟡 | Baixo** | ✅ Implementado (SP-62, 18/07) — "pode implementar agora" |
| A | **Novo:** catálogo de normas via reverse-index (`atlas_trail_detail.normas_ref`) | 166/295 normas cobertas | 🟢 | Baixo | ✅ Implementado (SP-47) — ver § A |
| B | **Novo:** corrigir `atlasTrails.find()` ambíguo (28 códigos duplicados entre Atlas) | — | 🟢 bug | Baixo | 🟡 Corrigido onde possível (SP-48) — 1 ponto bloqueado por schema (`gap_atlas_trails`), pedido formal SP-51. Ver § B |
| C | **Novo:** badge de tipo de instituição em "onde estudar" (`escola_sources.tipo`) | 120/253 (47%) | 🟢 | Baixo | ✅ Implementado (SP-49) — ver § C |
| D | **Novo:** índice reverso trilha → Perfis de Elite | — | 🟢 | Baixo | ✅ Implementado (SP-50) — ver § D |

\* Esforço técnico baixo; a barreira é decisão de produto (mudar contagem já em produção).
\** Só faz sentido combinado com os itens 1 ou 3.

**Todos os itens Tier 1 e 2 têm 0 problema de integridade referencial encontrado** contra as tabelas
já carregadas pelo portal — o risco em todos eles é de produto/UX, não de dado quebrado (exceção:
item 4, dado de conteúdo — não de FK — comprovadamente incompleto/corrompido, ver SP-46).

---

## Próximos passos — para a próxima sessão continuar sem retrabalho

> **Atualização (17/07/2026):** os 4 itens abaixo marcados "prontos pra codar" foram implementados
> (SP-47 a SP-50, ver `_BACKLOG.md`/`CHANGELOG_PORTAL.md` v3.23). Texto original mantido, com o
> status real anotado em cada um — só os dois blocos finais (bloqueado / decisão de produto) seguem
> genuinamente em aberto.

**Prontos pra codar direto (dado já carregado, sem depender de decisão de produto nem da sessão BANCO):**
1. **§ A — Catálogo de normas via `atlas_trail_detail.normas_ref`.** ✅ Implementado (SP-47). Reverse-index sobre dado que os
   itens 2/3 já carregam. Não precisa esperar a correção de `normas_fato.descricao` pedida no SP-46.
2. **§ B — Corrigir `atlasTrails.find()` ambíguo.** 🟡 Corrigido onde possível (SP-48). Bug de exibição real, achado documentado com os
   28 códigos afetados (`SELECT code, GROUP_CONCAT(DISTINCT atlas_num) FROM atlas_trails GROUP BY
   code HAVING COUNT(DISTINCT atlas_num)>1` reproduz a lista). A varredura completa foi feita — achou
   4 pontos no total (não só o 1º documentado aqui), 3 corrigidos, 1 bloqueado por falta de coluna de
   desambiguação em `gap_atlas_trails` (pedido formal SP-51, ver `_DECISIONS.md` D113/D116).
3. **§ C — Badge de tipo de instituição.** ✅ Implementado (SP-49). 1 campo a mais numa query já existente (`loadTrails`,
   item 2), 1 elemento de UI em `TrailCard.jsx`.
4. **§ D — Índice reverso trilha → Perfis de Elite.** ✅ Implementado (SP-50). `groupBy` sobre `eliteProfiles` (já carregado),
   1 seção nova no painel de trilha (`ViewProfiles.jsx`, ao lado do currículo detalhado do item 3).

**Bloqueado, esperando a sessão BANCO (SP-46) — ainda em aberto:**
- Catálogo de normas *como desenhado originalmente* (com `descricao` própria de cada norma) — só
  depois que `normas_fato.descricao` for corrigida/completada do lado BANCO. Reavaliar Tier depois.

**Ainda precisa de decisão de produto antes de codar (Tier 2, itens 6-13) — ainda em aberto, nenhuma
sessão desde a original tocou nisso:**
- Nenhum destes foi tocado ainda. Continuam com a mesma recomendação da versão anterior do
  estudo — ver cada seção acima para o encaixe/esforço já levantado. **Este é o motivo de o documento
  inteiro continuar ativo e não ir pro `historico/`** — ainda tem trabalho real pendente aqui.

**Arquivos tocados nesta sessão (referência rápida pra quem for continuar):**
`portal/data/loadTrailsProfiles.js` (todas as 5 queries novas + `loadElitePerfis`), `portal/data/loadCore.js`
(wiring), `portal/App.jsx` (state + rota `elite`), `portal/components/Nav.jsx` (item de nav),
`portal/components/TrailCard.jsx` (item 2), `portal/views/ViewProfiles.jsx` (itens 3 e 5),
`portal/views/ViewElitePerfis.jsx` (novo, item 1). Todos validados com o Babel de produção antes de
fechar — ver `_BACKLOG.md` SP-45 para o resultado completo dos testes.
