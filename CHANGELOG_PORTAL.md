---
sistema: FATO
nome_publico: IndústriaEDU
data_criacao: 12/06/2026 23h59
ultima_revisao: 05/07/2026 (quebra do monólito, D88-D106)
---

# Notas de Versão — Sistema FATO
## Histórico completo de todos os produtos

**Última atualização:** 17/07/2026

> **Nota (sessão SITE, atualização de documentação):** as entradas de 27/06 pra trás (v3.11 e anteriores)
> não tinham nenhuma entrada correspondente ao trabalho do lado SITE feito em 03-05/07/2026 (bug crítico
> de Hooks, `index.html` nunca renderizava de fato, estudo de arquitetura, e a quebra completa do monólito
> `App.jsx` em 23 módulos). Adicionadas abaixo, em ordem cronológica reversa, seguindo a mesma convenção
> já usada neste arquivo. Nenhuma entrada anterior foi reescrita ou removida.


---

## PORTAL INDUSTRIA EDU — IndústriaEDU

### v3.37 — 23/07/2026 · *Recebido pacote da sessão MIGRAÇÃO — Worker/Cloudflare D1 completo (SP-73/74) — atual*
- Primeira entrega de um 3º papel além de BANCO/SITE: sessão "MIGRAÇÃO", com protocolo próprio
  (`worker/PROTOCOLO_BANCO_SITE_MIGRACAO.md`), implementando a Opção C do
  `VIABILIDADE_PUBLICACAO_E_TRANSPARENCIA.md` (função serverless + banco hospedado, em vez do
  `.db` inteiro trafegando pro navegador).
- **O que chegou:** Cloudflare Worker + D1 completo — 16 endpoints REST espelhando todos os
  `loadX.js` do portal, base `fato_v226_reconciliado.db`, testado de ponta a ponta pela sessão
  MIGRAÇÃO (reconstrução do banco só a partir do `schema.sql`+`data.sql` exportado + shim que
  imita a API do D1). Pasta `worker/` adicionada como irmã de `portal/`, não misturada.
- **Verificado pela sessão SITE antes de aceitar, não só confiado:** `check_drift.py` (script que
  veio junto) rodado contra `fato_v237.db` real (mais novo que a base v226 deles) — 78/85 tabelas
  idênticas, só crescimento de linha nas outras 7, nada estrutural quebrado. 2 funções
  (`loadPanoramaUF`, `loadAtlasTrails`) comparadas linha a linha contra `portal/data/*.js` —
  fidelidade confirmada, comentários de achados anteriores preservados (SP-57/D116, SP-62).
- **Colisão de numeração, mesmo padrão do D114**: o pacote trazia `SP-72`/`SP-73` pré-numerados,
  ambos já ocupados em `_BACKLOG.md` (SP-72 já era o gap 90063). Renumerados pra SP-73 (decisão da
  sessão SITE sobre adotar o worker, opcional, sem pressa) e SP-74 (achado técnico real —
  `dm_importacoes_maquinas` é base de 2 VIEWs que `loadPanoramaUF` usa mas nenhum `.js` cita
  nominalmente — pedido formal pra sessão BANCO considerar antes de qualquer enxugamento futuro).
- **Nenhuma mudança em `portal/`** — nenhum `loadX(db)` local foi trocado por `fetch()`. O worker
  nem está publicado ainda (exige conta Cloudflare do usuário). Decisão de adotar, quando, e quais
  endpoints continua explicitamente do lado SITE, endpoint por endpoint — sem obrigação.
- Critério de merge (verificar com as próprias ferramentas do pacote antes de aceitar, nunca só
  confiar no relatório) registrado em `_DECISIONS.md` D123.
- Ver SP-73/SP-74 em `_BACKLOG.md`, `worker/README.md` pro passo a passo de publicação se/quando
  decidir seguir com a Opção C.

### v3.36 — 23/07/2026 · *Sincronização SITE×BANCO #10 — v193→v237 (SP-72, SP-46/39/51 fechados/quase)*
- `DB_PATH` atualizado pra `fato_v237.db` (recebido como `fato_v237_reconciliado_db.txt` — extensão
  errada, confirmado cabeçalho binário SQLite antes de tratar como banco real). 44 versões de
  trabalho entre v194 e v237. Regra 1 completa: schema drift 0 faltando, `foreign_key_check`/
  `integrity_check` limpos.
- **SP-46 (normas_fato) FECHADO** — 80/265 com descrição real, 185 marcadas explicitamente
  "conteúdo pago, sem descrição gratuita disponível" por decisão do usuário de não adquirir as
  normas. Fila zerada — não é mais uma pendência, é um estado final aceito.
- **SP-39 (taxonomias de setor) — redesign N:N implementado**, usando uma tabela que já existia
  (`sector_to_sector_codes`, criada em v76) — 0 tabela nova necessária. `vw_industry_sector_codes`
  criada. Ainda sem consumidor no portal (oportunidade barata registrada, não implementada).
- **SP-51 (gap_atlas_trails) quase fechado** — 108/113 (95,6%), tabela cresceu 106→113 com mais
  casos identificados no processo. Restam só 5, 1 deles com decisão explícita do usuário de parar
  de rastrear (sem fonte pública achável).
- **SP-72 (novo, achado e resolvido pelo próprio BANCO, não pedido pelo SITE)**: gap 90063 — 32
  linhas órfãs em `dm_rede_empresas_centralidade`/`_comunidades` (mesma família do gap 90061),
  removidas, FK real adicionada. `RedeDeEmpresas.jsx`/`loadMercadoEmpresas.js` (SP-58) não
  precisaram de nenhuma mudança — schema de colunas idêntico.
- **`guia` caiu 397→393** (floor rebaixado) — confirmado por diff direto de IDs entre v193 e v237:
  as 4 fontes que sumiram pertencem a 4 das empresas-lixo do gap 90061, cascata da limpeza do SP-60
  alcançando essa camada também. Mesma disciplina do D120 (investigar antes de rebaixar).
- **SP-07 piorou proporcionalmente** (10,2%→21,5% empresas sem UF) — não é regressão de qualidade,
  é ~186 empresas novas promovidas de staging (v205-v236) mais rápido do que a pesquisa de UF deu
  conta. Documentado sem maquiar o número.
- **Validação do D118**: 2 empresas que eu tinha filtrado antes como lixo (`id=330`/`332`) foram
  restauradas pelo BANCO como entidades reais (nomes corretos identificados) — meu filtro por
  `tipo_entidade` real (não lista fixa de IDs) capturou a correção **automaticamente**, sem precisar
  de nenhuma mudança de código nesta sincronização. O critério do D118 se provou certo na prática.
- **SP-70 reconfirmado ainda aberto** — `_LEIA_PRIMEIRO.md` não foi atualizado, `db_versions`/`gaps`
  legadas continuam sendo o que as Regras 1/7 referenciam. Sem mudança, pedido continua de pé.
- `ESTADO_ATUAL.md` ficou defasado de novo (ainda diz v193) — não regenerado desta vez sem pedido
  explícito (a regeneração anterior foi tratada como exceção pontual, não rotina).
- Testado (Regra 3.1): todas as verificações rodadas contra o `.db` real antes de fechar. `db.js`/
  `loadCore.js` validados com Babel.
- Ver SP-46/39/51/72 (atualizados/novo) em `_BACKLOG.md`.

### v3.35 — 19/07/2026 · *Organização — índice de itens abertos no `_BACKLOG.md`, sem apagar nada*
- Pedido do usuário: preocupação de que a quantidade de documentos/entradas acumuladas estivesse
  difícil de navegar. Rechecado documento a documento antes de mexer em qualquer coisa:
- **Nenhum dos 3 documentos "vivos" da raiz pôde ir pro `historico/`** — cada um trava por 1 item
  real: `PLANO_ENXUGAMENTO_ESTRUTURA.md` (reconstrução completa do `SCHEMA.md`, ainda TODO),
  `ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md` (item 4/SP-46, conteúdo de `normas_fato` ainda ruim),
  `VIABILIDADE_PUBLICACAO_E_TRANSPARENCIA.md` (decisão de hospedagem do usuário, não tomada ainda).
- **`_BACKLOG.md` não pode ser podado** (histórico vivo, por protocolo) — mas ganhou um índice curto
  no topo, só com os itens genuinamente abertos agora (16 itens, a maioria "esperando BANCO"), sem
  remover nenhuma das 60+ entradas existentes. Não é um documento novo, é um atalho pro mesmo.
- **2 menções desatualizadas corrigidas** em `PLANO_ENXUGAMENTO_ESTRUTURA.md`: SP-52 marcado como
  pendente (já resolvido pelo BANCO em 18/07) e a nota sobre divergência de nome de arquivo
  (atualizada pra refletir que o padrão já se repetiu de forma diferente desde então, ver SP-68).
- Nenhuma entrada de `_BACKLOG.md`/`_DECISIONS.md`/histórico foi apagada ou reescrita — só
  reorganização de navegação e correção de 2 status desatualizados.

### v3.34 — 19/07/2026 · *Resposta a revisão externa (RELATORIO_REVISAO_v193.md) — SP-70/71*
- Revisão externa auditou o pacote v193 (schema, 89 queries executadas contra o `.db` real, imports,
  4 alegações numéricas, checagem cruzada gaps×backlog, escopo ausente). Cada ponto foi verificado
  de novo pela sessão SITE antes de aceitar — não copiado sem checar.
- **Confirmado e corrigido:** comentário desatualizado em `loadMercadoEmpresas.js` ("442 empresas",
  na verdade 840 hoje) — SP-71.
- **Verificado e mantido (a revisão estava errada nesse ponto):** SP-51 é 69/106, não 70 — a linha
  `PE-1` tem `atlas_num=NULL` por ter sido corretamente revertida (nota `"REVERTIDO v191"`), não
  deve contar como resolvida.
- **Achado crítico, confirmado:** `_LEIA_PRIMEIRO.md` (o protocolo em si) tem as Regras 1 e 7
  apontando pra tabelas legadas/congeladas — `db_versions` (MAX=80, viva é `db_versions_v2`,
  MAX=193) e `gaps` (33 linhas "abertas", viva é `gaps_v2`, só 2 reais — ambas já rastreadas).
  As "33 linhas abertas sem confirmação" que a revisão apontou como pendência são, na verdade, um
  artefato de consultar a tabela errada — resolvido ao trocar pra `gaps_v2` (2 itens, já conhecidos).
  Registrado como pedido formal de alta prioridade (SP-70) — SITE não editou `_LEIA_PRIMEIRO.md`
  (documento do BANCO, Regra 9) mesmo confirmando o bug.
- **Esclarecido, não era bug:** ausência dos scripts de pipeline da Regra 8 neste zip — são
  ferramenta do fluxo interno da sessão BANCO, não pertencem ao pacote do portal.
- Critério (protocolo anti-obsolescência também pode ficar obsoleto; revisão externa/literal acha o
  que uso por hábito não acha) registrado em `_DECISIONS.md` D122.
- Ver SP-70/SP-71 em `_BACKLOG.md`, `PEDIDOS_E_BUGS_PARA_BANCO.md` atualizado com o achado crítico.

### v3.33 — 19/07/2026 · *Auto-hospedagem de React/Babel/fonte/sql.js — SP-69, prints de validação*
- Pedido do usuário: trocar a fonte (CDN) por algo que não impeça testar o portal localmente, e
  enviar prints do site completo pra revisão visual.
- **Achado ao investigar:** não era só a fonte. `unpkg.com` (React/ReactDOM/Babel Standalone) e
  `cdn.jsdelivr.net` (sql.js-fts5, o motor SQLite/WASM) também eram CDNs externas, e as 3 eram
  inacessíveis no ambiente desta sessão de IA — o que impedia inclusive tirar print de tela.
- **As 4 dependências vendorizadas** (`portal/vendor/`): React 18.3.1, ReactDOM 18.3.1, Babel
  Standalone 8.0.3, sql.js-fts5 1.4.0, IBM Plex Sans/Mono (pesos 400-700, subsets latin+latin-ext —
  cobre acentuação em PT). Baixadas via npm (registro acessível, ao contrário das 3 CDNs). Hashes
  SRI (SHA-384) de React/Babel conferidos byte a byte contra o `integrity=` já documentado no
  `index.html` — idênticos, zero mudança de comportamento, só de origem.
- **Testado de ponta a ponta pela primeira vez nesta janela de sessões:** servidor local
  (`python3 -m http.server`) + Chromium headless (Playwright) — 0 erros de console/página nas 12
  telas principais (Início, Explorar, Trilhas, Perfis CNCT, Perfis de Elite, Guia, Cobertura
  Guia×Atlas, Setores, Empresas, Mercado, Rede de Carreira, Sobre). Prints gerados e entregues pro
  usuário revisar o visual completo.
- Critério de quando vendorizar uma dependência de CDN (só quando dá pra confirmar conteúdo
  idêntico, não só "mesma versão") registrado em `_DECISIONS.md` D121.
- Ver SP-69 em `_BACKLOG.md`.

### v3.32 — 19/07/2026 · *Regeneração do `ESTADO_ATUAL.md`, a pedido explícito do usuário*
- Exceção pontual: `ESTADO_ATUAL.md` normalmente é responsabilidade da sessão BANCO
  (`_LEIA_PRIMEIRO.md`) — regenerado aqui só porque o usuário pediu explicitamente e o SITE já tinha
  acabado de sincronizar com o `.db` real na mesma janela.
- O documento recebido junto com `fato_v193_MERGED.db` descrevia "v194" (`company_curso_resolucao`,
  55 linhas, 124 tabelas, `sources` com UF 93%) — nenhum desses números específicos de v194 bateu
  contra o arquivo real. Regenerado com **todo número verificado por query direta** contra
  `fato_v193.db`, não copiado do documento anterior. 2 divergências achadas e registradas em vez de
  silenciadas: `companies` com UF (754 real vs. 782 citado), `sources` com UF (1.528 real vs. 1.719
  citado) — diferenças consistentes com o patch v194 (que traria esses números pra cima) não estar
  de fato presente neste arquivo.
- **SP-07 corrigido**: era "122" na minha última sincronização, o documento recebido dizia "agora 2"
  — **verificado nesta sessão: 86**, o número real do arquivo. Nem o meu registro anterior nem o do
  documento recebido estava certo pro estado real deste `.db`.
- Seção "patches `fila_enriquecimento`" do documento anterior (Grupo A/B) não pôde ser confirmada
  nem negada — nenhuma tabela com esse nome existe neste arquivo. Omitida do documento regenerado
  em vez de repetida sem verificação.
- Ver `_BACKLOG.md` SP-07/SP-68 atualizados, `ESTADO_ATUAL.md` (raiz do repositório) substituído.

### v3.31 — 18/07/2026 · *Sincronização SITE×BANCO #9 — v175→v193 (SP-64 a SP-68)*
- `DB_PATH` atualizado pra `fato_v193.db`. **Discrepância achada antes de tocar em qualquer coisa**:
  o `ESTADO_ATUAL.md` recebido junto descreve "v194" (`company_curso_resolucao`, 55 linhas, 124
  tabelas) — o `.db` real entregue é v193 (123 tabelas, essa tabela não existe, confirmado por
  query). Documento descreve um estado à frente do arquivo — sinalizado (SP-68), tratado o `.db`
  como o que ele realmente é.
- **Resolvidos na raiz pelo BANCO, código atualizado pra parar de mitigar e usar a correção real:**
  - **SP-59** (duplicatas em `dm_rede_empresas_*`) — causa raiz corrigida (recálculo agora limpa
    antes de inserir), 0 duplicatas confirmadas. Critério de desempate do SITE virou rede de
    segurança inofensiva.
  - **SP-51** (`gap_atlas_trails` ambíguo) — 69/106 (65%) desambiguado por cruzamento real
    (empresa↔fonte). `loadSectorsGuia.js`/`ViewGaps.jsx` (SP-66) usam a resolução direta quando
    existe, caem pra lista de candidatas só nos 37 restantes.
  - **SP-52** (`micro_atlas_pdf` órfã) — nulificada, confirmado 0/99.
  - **SP-60/SP-64** (94 empresas-lixo) — reclassificadas `tipo_entidade='pagina_agregadora'`. Filtro
    fixo de 24 IDs no SITE removido, substituído por `WHERE tipo_entidade='empresa'` real —
    critério do D118 se confirmou na prática.
- **Melhorados, não fechados:** SP-46 (`normas_fato` deduplicada 295→265, conteúdo/`descricao`
  continua ruim) — comentários do catálogo de normas atualizados pra nova contagem, sem quebra.
  SP-40 (`dm_qualidade_preditiva` 37→39/47, `dm_oportunidade_estrategica` sem mudança).
- **Diagnosticado, aguardando aprovação:** SP-39 — não são 4 taxonomias de setor concorrentes, são
  2 eixos + 1 informal. Tabela nova `taxonomia_informal_map` (7 linhas) criada, ainda sem consumidor
  no portal (oportunidade barata registrada, não implementada).
- **SP-65 (floor check falhou de verdade, investigado antes de rebaixar):** `technical` 572→396
  (gap 90062, achado do próprio BANCO — 189 `sources` com texto de raciocínio de IA vazado,
  removidas) e `sector` 497→477 (cascata do SP-60/64). Confirmado legítimo por query cruzada antes
  de rebaixar o floor (`technical: 390`, `sector: 470`, com margem). Critério registrado em
  `_DECISIONS.md` D120 — floor check que falha é convite pra investigar, não pra silenciar.
- Testado (Regra 3.1): schema drift 0 tabelas/views faltando, floor check passa nas 6 métricas pós-
  ajuste. Todos os arquivos alterados (`db.js`, `loadCore.js`, `loadMercadoEmpresas.js`,
  `loadSectorsGuia.js`, `loadTrailsProfiles.js`, `ViewGaps.jsx`) validados com Babel.
- Ver SP-64 a SP-68 em `_BACKLOG.md`; SP-07 (empresas sem UF) não pôde ser reverificado — o número
  "2" mencionado no `ESTADO_ATUAL.md` é do estado v194 não confirmado no `.db` recebido.

### v3.30 — 18/07/2026 · *Sessão SITE — item 11 do estudo de viabilidade, com correção de premissa (SP-63)*
- Decisão de produto confirmada: "junto com Tecnólogo/Bacharelado" (não 3ª coluna separada).
- **Achado que muda a implementação:** o estudo original afirmava que `course_graduacoes`/
  `course_especializacoes` eram "estritamente mais completas" que as fontes já em uso
  (`cnct_verticalizacao`/`cnct_qualificacoes`) — verificação perfil a perfil (não só amostra) mostrou
  que **não são**: em 30/85 perfis de sobreposição (35%), a fonte "nova" tem menos itens que a
  antiga (perde nomes reais, ex. "Soldagem", "Segurança do Trabalho"). Implementado como **união**
  em vez de substituição — 98 perfis cobertos em cada campo (era 85), 0 perda confirmada.
- Verticalização (`ViewProfiles.jsx`) virou 1 card único ("Graduação") em vez do grid de 2 colunas
  (Tecnólogo | Bacharel) — `course_graduacoes` não distingue os 2 níveis. A distinção "especialização
  técnica" que a decisão original cogitava como 3ª coluna já tinha lugar: a seção "Especializações"
  (pills, já existente), que só ganhou mais itens (união das 2 fontes também).
- Critério (nunca confiar em "fonte mais completa" de um estudo por contagem agregada ou amostra —
  verificar perfil a perfil antes de substituir uma seção em produção) registrado em `_DECISIONS.md`
  D119. É a mesma classe de cuidado do D117, um passo além: ali o número não se aplicava ao ponto
  exato do código; aqui a afirmação do estudo em si estava incorreta.
- Testado: as 2 uniões (especializações, graduações) validadas perfil a perfil contra o `.db` real
  antes de fechar — 0 regressão nos 2 casos. `loadTrailsProfiles.js`/`ViewProfiles.jsx` validados
  com Babel.
- Ver SP-63 em `_BACKLOG.md`, item 11 corrigido em `ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md`.

### v3.29 — 18/07/2026 · *Sessão SITE — item 13 do estudo de viabilidade (SP-62)*
- Último item pendente entre os 8 do Tier 2 que não dependia do BANCO: decisão de produto
  confirmada ("pode implementar agora, itens 1/3 já decididos").
- **SP-62:** `atlas_docs` (18 linhas — nome oficial do Atlas, cursos CNCT de origem com página,
  códigos de bloco de competência) anexado via `loadAtlasDocsMap()` tanto em `atlasTrails` quanto em
  `eliteProfiles`. Aparece como citação (📖 fonte + blocos) no painel de trilha (`ViewProfiles.jsx`)
  e no painel de Perfil de Elite (`ViewElitePerfis.jsx`). Cobertura 18/18, 0 `atlas_num` de
  `atlas_trails` sem doc correspondente.
- Com isso, dos 8 itens Tier 2 do estudo original: 7 implementados (SP-53 a SP-59, SP-62), 1
  aguardando confirmação do usuário (item 11, "espera o banco" sem dependência real identificada).
- Testado: `atlas_docs` × `atlas_trails` (join completo, 0 órfãos) rodado contra o `.db` real antes
  de fechar. `loadTrailsProfiles.js`, `ViewProfiles.jsx`, `ViewElitePerfis.jsx` validados com Babel.
- Ver SP-62 em `_BACKLOG.md`, item 13 atualizado em `ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md`.

### v3.28 — 18/07/2026 · *Sincronização SITE×BANCO #8 — v168→v175 (SP-60, SP-61)*
- `DB_PATH` atualizado pra `fato_v175.db` (recebido como `fato_v175_MERGED.db`, reconciliação de 5
  branches v169→v170→v172→v173→v174→v175 do lado BANCO). Regra 1 completa antes de tocar em
  qualquer coisa: schema drift 0 tabelas/views faltando, floor check (Regra de segurança contra
  perda de dado) passou nas 6 métricas (social 35, technical 572, guia 398, sector 497, profiles
  111, atlas_trails 187).
- **Pedidos formais verificados:** SP-43 item (3) resolvido (`nivel_cnct`/`justificativa_i4_i5` dos
  13 perfis novos, 0/111 nulo agora). SP-07 melhorou bastante (433→122 empresas sem UF), não
  fechado. SP-46, SP-51, SP-52, SP-59 seguem sem mudança do lado BANCO.
- **Duas entregas desta sincronização vieram marcadas pelo próprio BANCO como "NÃO REVISADA POR
  CURADORIA"** (regra 29 `meta_protocolo` — sessão de chat sem o pipeline de auditoria normal).
  Tratadas com cautela, não wireadas cegamente:
  - 3 tabelas novas (`papeis_organizacionais`, `empresa_papel` — todos os 28 vínculos marcados
    `sugerido_pendente_validacao`/inferido, `demanda_certificacao` vazia) — **nenhuma UI construída
    em cima**, ainda não são dado validado.
  - Trilha piloto `trl-107` — cobertura deliberadamente parcial (4/354 fontes do perfil), com nota
    explícita pedindo decisão de curadoria. **SP-61**: `trails.descricao_geral` (onde essa nota
    mora) nunca era lida por nenhum loader — exposta agora como badge de aviso em `TrailCard.jsx`,
    genérico (não hardcoded pra essa trilha), não decide se a trilha deve existir ou não.
- **SP-60 (achado novo do lado SITE, não pedido pelo usuário):** o BANCO documentou (gap 90061) 24
  `companies` que são lixo de parsing (títulos de artigo, siglas, frases genéricas como "Cursos
  Gratuitos", "SEI") classificadas como `tipo_entidade='empresa'` por erro de ingestão — confirmadas
  sem UF/CNPJ, não localizáveis externamente. Todas as 24 têm fonte vinculada (apareceriam como card
  normal em `ViewEmpresas`) e 6 já apareceriam na Rede de Empresas (SP-58) como se fossem reais.
  Filtradas em `loadCompanies()` — não é correção de dado (o `.db` não muda), é uma escolha de não
  exibir linhas que o próprio BANCO já confirmou não serem o que dizem ser. Reversível quando o gap
  90061 fechar do lado BANCO.
- Critério de quando o SITE filtra defensivamente vs. quando só expõe a ressalva já escrita pelo
  BANCO (dois casos diferentes, tratamento diferente) registrado em `_DECISIONS.md` D118.
- Testado (Regra 3.1): todas as queries de verificação rodadas contra o `.db` real antes de fechar.
  Todos os arquivos alterados (`loadMercadoEmpresas.js`, `loadTrailsProfiles.js`, `TrailCard.jsx`,
  `db.js`) validados com o Babel de produção.
- Ver SP-60/SP-61 (novos) e SP-07/SP-43 (atualizados) em `_BACKLOG.md`.

### v3.27 — 17/07/2026 · *Sessão SITE — 6 dos 8 itens Tier 2 do estudo de viabilidade (SP-53 a SP-59)*
- Pedido do usuário: 8 decisões de produto levantadas do Tier 2 (`ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md`).
  Decididos: 6,7,8,9,10,12 → implementar; 11 → "espera o banco" (sem dependência real de BANCO
  identificada, registrado como o usuário definiu); 13 → não decidido.
- **SP-53 (item 12, trilhas relacionadas):** `loadTrails()` anexa `derivada_de`/`derivadas` via
  `trail_dependencies` (14/14, 0 órfãos). `TrailCard.jsx` mostra a relação, mesmo padrão visual do
  SP-35 (`variantes`).
- **SP-54 (item 10, badge de tipo de fonte):** `material_types`/`source_material_types` em
  `loadTechnical()`. Achado ao validar: a coluna real é `label_pt`, não `label` — corrigido antes de
  fechar. Cobertura real 101/572 (17,7%) pra `layer=technical` — maior que a estimativa do estudo
  (6,5%, que era sobre todas as camadas), mas ainda baixa.
- **SP-55 (item 9, união de vínculos fonte↔perfil):** a união pedida (`source_cnct_profiles` ∪
  `guia_source_profiles`) dá **0 vínculos novos** pra `layer=technical` especificamente — a 2ª tabela
  não cobre essa camada. Aplicada mesmo assim, por completude. **O ganho real** veio de achar que
  `loadSocial()` nunca lia nem a 1ª tabela: 699 vínculos existentes, 0 expostos até agora — corrigido,
  34/35 fontes sociais agora mostram vínculo (era 0/35).
- **SP-56 (item 7, mesclar `sector_programs`):** 174 linhas (94 empresas) mescladas em `loadSocial()`.
  `sector_programs` não tem `url` nem sempre tem `publico` — 2 bugs latentes achados e corrigidos em
  `SourceCard.jsx` (botão "Acessar portal" e rótulo "Público:" agora condicionais; antes renderizavam
  incondicionalmente, só ficou visível ao introduzir uma fonte com esses campos ausentes).
- **SP-57 (item 8, Panorama por Estado):** `loadPanoramaUF()` une 4 fontes por UF (`vw_indicador_demanda`,
  `vw_mapa_calor_preditivo`, `vw_mapa_competencias_predito`, `dm_pnp_indicadores`), painel colapsável
  em `ViewMercadoTrabalho.jsx`. 2/10 linhas de `vw_mapa_calor_preditivo` com `uf=NULL` filtradas
  (lição do D116 — não deixar um NULL real virar um card errado). 12 UFs cobertas.
- **SP-58 (item 6, Rede de Empresas):** novo componente `RedeDeEmpresas.jsx`, espelhando
  `RedeDeCarreira.jsx` (D111) — laços fortes = `dm_competicao_talentos` (achado: já existia um
  equivalente de `dm_sinonimos_perfis` pro lado empresas), laços fracos = `dm_rede_empresas_comunidades`.
  Painel de detalhe novo em `ViewEmpresas.jsx` (não tinha estado de seleção antes) + navegação cruzada
  (`pendingCompany`, mesmo mecanismo do SP-03). **Achado de qualidade de dado**: 19 `company_id` com
  linhas conflitantes nas 2 tabelas de rede (provável resíduo da fusão de duplicatas D70-DB) — resolvido
  com critério determinístico (maior `tamanho_comunidade`/`score_gatekeeper`), pedido formal SP-59
  pra sessão BANCO recalcular essas tabelas.
- Critérios de julgamento usados nos 6 itens (verificar o dado real antes de confiar no número do
  estudo; corrigir bug latente achado durante a implementação sem parar pra perguntar; nunca deixar
  dado conflitante virar escolha não-determinística) registrados em `_DECISIONS.md` D117.
- Testado (Regra 3.1): as 6 queries novas/alteradas rodadas contra o `.db` real antes de fechar (números
  exatos: 14 trail_dependencies, 16 material_types/132 vínculos, 10.365 pares na união cnct, 174
  sector_programs, 10/4/40/10 linhas nas 4 fontes do panorama, 405/936 empresas com comunidade/centralidade
  após deduplicar). Schema drift (Regra 1) re-checado: 0 tabelas/views faltando. Todos os arquivos
  (`loadTrailsProfiles.js`, `loadSocialTechnical.js`, `loadMercadoEmpresas.js`, `loadCore.js`, `App.jsx`,
  `TrailCard.jsx`, `SourceCard.jsx`, `ViewMercadoTrabalho.jsx`, `ViewEmpresas.jsx`, `RedeDeEmpresas.jsx`
  novo) validados com o Babel de produção.
- Ver SP-53 a SP-59 em `_BACKLOG.md`. Itens 11 (aguardando confirmação do usuário) e 13 (não decidido)
  seguem em aberto — ver tabela-resumo atualizada em `ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md`.

### v3.26 — 17/07/2026 · *Sincronização com sessão paralela de enxugamento de estrutura + SP-38 categoria 5 ("SETOR null")*
- Esta sessão (SP-38 cat. 5, "SETOR null" na aba Setores) tinha rodado em paralelo, a partir do
  mesmo pacote-base (`sistema_fato_SP47-50_SITE.zip`), com a sessão de enxugamento de estrutura
  registrada em v3.24/v3.25. Nesta entrada: sincronização dos dois pacotes, trazendo o trabalho do
  SP-38 pra dentro do pacote já enxuto (`historico/`, Micro-Atlas dinâmico, PDFs removidos).
- **Bug era duplo, não só o texto.** `ViewSectors.jsx` agrupava fontes sem `industry_sector_id`
  (129/497 = 26%, confirmado de novo contra o `.db` real) sob um grupo com `id=null` — mas o estado
  de seleção (`useState(null)`) usava esse mesmo `null` como "nada selecionado". Resultado: além do
  texto literal `"SETOR null"` (de `String(null).padStart(2,'0')`), o card desse grupo **não abria
  ao clicar** — `setSector(null)` era indistinguível de nunca ter selecionado nada, então a tela de
  detalhe nunca renderizava. As 129 fontes desse grupo ficavam efetivamente inacessíveis na prática,
  não só malformatadas.
- **Correção:** sentinela dedicado `NO_SECTOR_ID = "sem_setor"` (string) pro grupo, estado de seleção
  passou a usar `undefined` como "nada selecionado" — os dois nunca colidem mais. Grupo aparece como
  "Sem setor classificado", sempre por último na lista (não é um 13º setor), com nota explicando o
  motivo. Card do grid principal, cabeçalho do detalhe e o filtro de empresa (`selectedCompany`) — os
  3 pontos que usavam `sec.id`/`selectedSector` — ajustados juntos.
- Critério (quando um `null` de dado real pode colidir com um sentinela de estado de UI) registrado
  em `_DECISIONS.md` **D116** (renumerada de D114 pra D116 ao sincronizar — D114/D115 já tinham sido
  usados nesta janela pelo trabalho de Micro-Atlas, ver v3.24/v3.25). É reutilizável, 2º caso da
  mesma classe nesta janela de sessões (depois de D113/SP-48, ambiguidade `code`/`atlas_num`).
- Testado (Regra 3.1): lógica de agrupamento simulada em Node.js contra os 497 registros reais de
  `sources` (layer=sector) — 12 grupos numéricos em ordem + grupo "sem_setor" com as 129 entradas,
  sempre por último. `ViewSectors.jsx` validado com Babel (`@babel/preset-react`).
- Verificação adicional de enxugamento pedida junto com a sincronização: varredura automatizada por
  arquivo/export órfão em todo `portal/` (cross-reference de cada `.jsx`/`.js` e cada `export`
  contra todos os imports do projeto) — nenhum arquivo morto ou export órfão novo encontrado além do
  que a sessão paralela já tinha resolvido. Estrutura já enxuta; nenhum corte adicional de arquivo
  foi seguro/justificável sem tocar documentos vivos protegidos por protocolo (`_BACKLOG.md`/
  `_DECISIONS.md` preservam histórico por design, `_LEIA_PRIMEIRO.md` Regra 9).
- Ver SP-38 em `_BACKLOG.md` (categoria 5 fechada; categorias 1 e 6 seguem sem solução, dependem
  da sessão BANCO).

### v3.25 — 17/07/2026 · *Sessão SITE — remoção física dos 78 PDFs estáticos de micro-atlas*
- Pedido do usuário: remover os 78 PDFs e confirmar que a lógica de substituição (v3.24/D114)
  estava de fato implementada antes de remover.
- Reconferida a cadeia completa (query → campo `micro_atlas` → componente → toggle) nos 3
  arquivos reais antes de apagar qualquer coisa — íntegra e consistente.
- Removido `portal/dados/micro_atlas/` (78 PDFs).
- `MicroAtlasView.jsx` — removido o botão de fallback "Baixar PDF" (viraria link morto).
- `loadTrailsProfiles.js` — removida a coluna `micro_atlas_pdf` da query e do objeto de perfil
  (sem consumidor restante).
- Pedido formal registrado em `_BACKLOG.md` SP-52 para a sessão BANCO: a coluna
  `cnct_courses.micro_atlas_pdf` continua no `.db` com paths agora inválidos — fora do escopo
  do SITE editar o banco diretamente (Regra 0.1). Detalhe completo em `_DECISIONS.md` D115.

### v3.24 — 16/07/2026 · *Sessão SITE — enxugamento de estrutura: eliminação dos 78 PDFs estáticos de micro-atlas*
- Pedido do usuário: diagnóstico de viabilidade + implementação da renderização dinâmica do Micro-Atlas
  do curso, substituindo os 78 arquivos estáticos em `dados/micro_atlas/*.pdf` (gerados por script
  fora do repositório, cobertura incompleta — só 78/99 cursos). Decisão completa em `_DECISIONS.md` D114.
- `loadTrailsProfiles.js` — query que alimentava `micro_atlas_pdf` expandida pra trazer o registro
  completo de `cnct_courses` (perfil profissional, infraestrutura, normas, certificações,
  especializações, graduações, status/referência do atlas). Removido o filtro que excluía os 21 cursos
  sem PDF gerado — agora todos os 99 têm o campo `micro_atlas` populado.
- Novo componente `components/MicroAtlasView.jsx` — renderiza o mesmo conteúdo que os PDFs continham,
  direto da memória, incluindo aviso visual explícito para os cursos sem Macro-Atlas vinculado (antes
  esses 21 cursos simplesmente não mostravam nenhum botão). Reaproveita o sistema de tokens/cor
  semântico existente (`theme/tokens.js`), sem paleta nova.
- `ViewProfiles.jsx` — botão trocado de link estático (`<a href={p.micro_atlas_pdf}>`) para toggle
  inline (condicionado a `p.micro_atlas`, não mais a `p.micro_atlas_pdf`); link de download do PDF
  original preservado como ação secundária dentro do próprio componente, quando o arquivo existir.
- Os 78 arquivos PDF em si não foram removidos do repositório nesta versão — a remoção física fica
  pendente pra depois de confirmar o componente em produção (ver `PLANO_ENXUGAMENTO_ESTRUTURA.md`).

### v3.23 — 15/07/2026 · *Sessão SITE — os 4 itens "prontos pra codar" do estudo de viabilidade (SP-47 a SP-50)*
- Pedido do usuário: ler `ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md` (seção "Próximos passos") e `_BACKLOG.md`
  SP-47 a SP-50, implementar os 4 itens que não dependem da sessão BANCO nem de decisão de produto.
- **SP-47 — Catálogo de normas via reverse-index (`atlas_trail_detail.normas_ref`):** nova função
  `loadNormasCatalogo()` (`loadTrailsProfiles.js`) monta, por código de norma, `tipo_norma` (295/295
  preenchido em `normas_fato`), `descricao` (só 55/295, ver SP-46 — mostrada quando existe, omitida
  quando não) e a lista de trilhas/níveis que citam a norma (166/295 códigos com pelo menos 1 citação
  em `normas_ref`, confirmado por `json.loads` par a par). Novo componente `NormaBadge` (`badges.jsx`):
  pill clicável com popover inline — usado nos 3 pontos que já tinham pill de norma em `ViewProfiles.jsx`
  (Atlas II, currículo detalhado por nível, lista de normas do perfil) e em `TrailCard.jsx`. `SourceCard.jsx`
  não alterado — lá as normas aparecem como resumo de texto truncado (`caminhos_cbo.normas`), não como
  pills individuais; converter mudaria a UX daquele resumo além do escopo "baixo esforço" do item.
- **SP-48 — Bug de ambiguidade `atlasTrails.find()` por `code` sem `atlas_num` — varredura completa
  feita, não só o caso já documentado.** Critério de quando corrigir/mitigar/bloquear registrado em
  `_DECISIONS.md` D113. 28 códigos de trilha Atlas se repetem entre 2 e 6 `atlas_num`
  diferentes (`C1` em I/II/III/V/VII; `F1` em 6). Achados e resultado de cada um:
  - `ViewProfiles.jsx` linha ~468 (o caso já documentado) — **corrigido.** Precisou de mudança também
    no dado: `loadProfiles()` agora carrega `trails_atlas_detail: [{code,atlas_num}]` junto com
    `trails_atlas` (que continua existindo, sem quebrar quem já consumia só a lista de códigos) — sem
    isso o `code` sozinho nunca teria como se desambiguar. `relProfiles`/`relSources` (painel de trilha)
    também comparavam só por `code` — mesma classe de bug, corrigidos junto.
  - `technical`/fontes técnicas (`atlas_trails` vindo de `source_atlas_trails.atlas_code`) — a tabela
    **já tem** `atlas_num` (resolvido em 194/232 = 83% das linhas, via `resolucao_metodo`). Adicionado
    `atlas_trails_detail` em `loadSocialTechnical.js` e usado em `relSources`; os 38 casos ainda sem
    `atlas_num` (17%) caem de volta pra comparação só por `code` — mesmo comportamento de antes pra
    esses casos específicos, não finge estar corrigido onde o dado não permite.
  - `ViewGaps.jsx` linha 33 (`gap_atlas_trails.atlas_code`, 13 códigos ambíguos usados aqui) — **não
    fixável do lado SITE**: a tabela não tem `atlas_num` nem `trail_id`, não há como saber qual das
    várias trilhas com o mesmo código o dado de origem (`gaps`) queria dizer, sem inventar informação
    (Regra 0.1/3.2). Mitigação aplicada: em vez de silenciosamente escolher a 1ª ocorrência (o bug
    original), a tela agora lista todas as trilhas candidatas quando há mais de uma. Pedido formal
    registrado em `_BACKLOG.md` (SP-48) pra sessão BANCO adicionar `atlas_num`/`trail_id` a
    `gap_atlas_trails`.
- **SP-49 — Badge de tipo de instituição (`escola_sources.tipo`) em "onde estudar":** campo já lido
  desde o SP-45 mas não exposto — agora incluído em cada link de escola por passo de trilha
  (`loadTrails()`) e renderizado como badge (`TrailCard.jsx`) ao lado de cada curso: SENAI (67),
  Governo (41), Rede Federal (4), Privada (8) — 120/253 (47%) com tipo conhecido, os demais sem badge.
- **SP-50 — Índice reverso trilha → Perfis de Elite:** nova seção no painel de detalhe de trilha
  (`ViewProfiles.jsx`, ao lado de "Currículo Detalhado por Nível") — lista os Perfis de Elite que citam
  a trilha aberta. `groupBy` sobre `eliteProfiles` (já carregado inteiro pelo SP-45), sem query nova.
  Comparação por `code`+`atlas_num` do próprio perfil de elite (não repete a ambiguidade do SP-48) —
  checagem própria confirmou que toda trilha citada num Perfil de Elite pertence ao mesmo `atlas_num`
  do perfil (0 mismatches, 55/55 perfis verificados par a par).
- Todas as queries novas/alteradas rodadas contra o `.db` real antes de fechar (Regra 3.1):
  `atlas_trail_detail` JOIN `atlas_trails` (74/74, 0 erro de parse em `normas_ref`), `normas_fato` ×
  reverse-index (166/295 overlap confirmado, 1 código extra `"DNV standards "` citado em `normas_ref`
  sem linha correspondente — tratado como caso sem `tipo_norma`/`descricao`, não quebra), `atlas_trail_profiles`
  JOIN `atlas_trails` com `atlas_num` (265 linhas, 0 órfãos), `source_atlas_trails` (232 linhas, 194
  com `atlas_num`). Checagem de schema drift (Regra 1) rodada de novo sobre todos os `data/*.js`: 0
  tabelas faltando. 8 arquivos alterados/criados (`loadTrailsProfiles.js`, `loadSocialTechnical.js`,
  `loadCore.js`, `App.jsx`, `badges.jsx`, `TrailCard.jsx`, `ViewProfiles.jsx`, `ViewGaps.jsx`) validados
  sintaticamente com o mesmo Babel (`@babel/preset-react`) usado em produção.
- Ver SP-47 a SP-50 em `_BACKLOG.md` (fechados/atualizados nesta sessão).

---

### v3.22 — 15/07/2026 · *Sessão SITE — 4 dos 5 itens Tier 1 do estudo de viabilidade (SP-45)*
- Pedido do usuário: analisar `ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md` (SP-44) e implementar. Dos 5 itens Tier 1, 4 implementados nesta sessão:
  - **Nova aba "Perfis de Elite"** (`ViewElitePerfis.jsx`) — `atlas_destination_profiles` (55 combinações de 2-4 trilhas Atlas), renderizadas por um parser Markdown pequeno e específico ao conteúdo real (sem lib externa — projeto não tem bundler).
  - **"Onde estudar" por passo de trilha** (`TrailCard.jsx`) — `trail_escola_links`+`escola_sources` (894 linhas) anexado a cada etapa em `loadTrails()`.
  - **Currículo detalhado por nível** (painel de trilha Atlas em `ViewProfiles.jsx`) — `atlas_trail_detail` (74 linhas) anexado a cada trilha Atlas em `loadAtlasTrails()`.
  - **Matriz de pivotamento entre perfis** (`ViewProfiles.jsx`) — `dm_matriz_pivotamento` (7140 pares) anexada a cada perfil em `loadProfiles()`, seletor com busca, complementar ao `dm_premio_transferencia` (SP-12) já existente.
- **5º item (catálogo de normas técnicas, `normas_fato`) não implementado** — checagem própria antes de codar (Regra 3.3) achou que só 55/295 normas têm `descricao`, e boa parte parece texto corrompido/OCR malsucedido. Pedido formal registrado em `_BACKLOG.md` (SP-46) para a sessão BANCO, em vez de publicar texto ilegível.
- Todas as 5 queries novas rodadas contra o `.db` real antes de codar: `trail_escola_links` 894/894 sem órfãos em nenhuma das duas FKs (melhor que os 508/894 estimados no estudo original), `atlas_trail_detail` 74/74, `dm_matriz_pivotamento` 7140/7140. Os 7 arquivos alterados/criados validados sintaticamente com o mesmo Babel (`@babel/preset-react`) usado em produção.
- Ver SP-45/SP-46 em `_BACKLOG.md`.
- **Atualização de documentação (mesmo dia, a pedido do usuário):** `ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md` atualizado in-line com status real de cada item (✅/🔴) e 4 novas possibilidades achadas só ao implementar, não visíveis na varredura de schema original — registradas como SP-47 (catálogo de normas via `atlas_trail_detail.normas_ref`, alternativa não bloqueada ao SP-46), SP-48 (bug pré-existente: `atlasTrails.find()` não desambigua por `atlas_num`, 28 códigos afetados), SP-49 (badge de tipo de instituição em "onde estudar", `escola_sources.tipo`) e SP-50 (índice reverso trilha→Perfis de Elite). Seção "Próximos passos" adicionada ao final do estudo com o que está pronto pra codar direto vs. o que ainda depende da sessão BANCO ou de decisão de produto.

---

### v3.21 — 15/07/2026 · *Sessão SITE — sincronização com `fato_v168.db`*
- `DB_PATH` (`portal/db.js`): `fato_v128.db` → `fato_v168.db` (exceção de 1 linha permitida pela Regra 2.4, sem pedido formal).
- Checagem de schema da Regra 1 rodada por completo: 0 tabelas que o portal espera estão faltando; as 70 queries reais do código (`query`/`scalar`) testadas uma a uma contra o `.db` real.
- **1 quebra encontrada e corrigida:** `dm_monopolio_oferta` foi renomeada para `dm_monopolio_oferta_arquivado` em algum ponto entre v135 e v167, sem registro em `db_versions_v2`. `loadSectorsGuia.js` ajustado para o nome novo — dado (215 linhas) intacto, comportamento da aba Setores inalterado. Pedido formal registrado em `_BACKLOG.md` (SP-42) para a sessão BANCO confirmar a intenção e documentar retroativamente.
- Migração de `cnct_courses`/`cnct_profiles` da v168 (16 colunas dropadas de `cnct_courses`, 13 perfis novos em `cnct_profiles`) confirmada **sem impacto** no portal: as únicas colunas de `cnct_courses` lidas pelo site (`id`, `profile_id`, `nome`, `micro_atlas_pdf`) não estavam entre as removidas. `micro_atlas_pdf` reconferido intacto (78/99, idêntico ao histórico desde a regressão original da Regra 0).
- Enriquecimento de CNPJ em `companies` (11 colunas novas) e as 2 views novas (`vw_cnct_catalogo`, `vw_cnct_cobertura`) da migração ainda não têm consumidor no portal — registrado como oportunidade de produto, não bug (SP-43).
- `runSmokeTest` (M-12) reexecutado manualmente contra o `.db` real: todas as 6 métricas acima do piso (nenhuma queda).

### v3.20 — 14/07/2026 · *Sessão SITE — visualização de rede de carreira (grafo radial + visão geral) — atual*
- Badge de texto ("HUB PRINCIPAL · 87 conexões") substituído por grafo de verdade em 2 lugares:
  - `components/RedeDeCarreira.jsx` (novo): grafo radial dentro da tela de perfil — sinônimos reais (`dm_sinonimos_perfis`) em laço forte/brilhante, mesma comunidade (`dm_rede_comunidades`) em laço fraco/apagado. Os dois nunca desenhados com o mesmo peso.
  - `views/ViewRedeCarreira.jsx` (nova aba "Rede de Carreira"): visão geral dos 85 perfis (de 98 no catálogo) agrupados em 5 comunidades reais, tamanho por `score_hub`, 21 arestas de sinônimo sobrepostas.
- Layout determinístico (radial + espiral de ângulo áureo), sem lib de grafo nova — mesma filosofia de "sem bundler" do projeto.
- Sintaxe validada via Babel; matemática do layout simulada em Python com dado real antes de escrever em JS (85 nós dentro do canvas, 21 arestas deduplicadas, sem `NaN`). Sem navegador real neste ambiente pra confirmar a renderização React final — reconstrução estática com a mesma matemática exata usada pra mostrar ao usuário antes de fechar.
- Ver D111 em `_DECISIONS.md`.

---

### v3.19 — 14/07/2026 · *Sessão SITE — tipografia real (IBM Plex Sans + Mono)*
- **Achado:** `App.jsx` declarava `fontFamily:"'Inter',system-ui,sans-serif"` mas a fonte Inter nunca foi carregada em lugar nenhum (nenhum `@font-face`/link do Google Fonts) — sempre caiu no fallback do sistema, silenciosamente.
- Par tipográfico escolhido com intenção, não o padrão: **IBM Plex Sans** (texto/títulos) + **IBM Plex Mono** (códigos: CBO, TRL-xx, NR-xx, blocos do Guia) — família desenhada pra contexto técnico/industrial multilíngue, com bom suporte a acentuação em PT. O Mono reforça o significado que os códigos já carregam no sistema de cor semântico (v3.18), em vez de só decorar.
- Carregada via `<link>` do Google Fonts em `index.html` (sem `integrity=`/SRI de propósito — o CSS do Google Fonts varia por User-Agent, o que quebraria o hash a cada variação de navegador).
- Os 13 usos improvisados de `fontFamily:"monospace"` (6 arquivos) trocados por `'IBM Plex Mono',monospace`. `App.jsx` corrigido pra `'IBM Plex Sans'`.
- Sintaxe validada via Babel em todos os 8 arquivos tocados, antes/depois. Sem navegador real neste ambiente pra confirmar visualmente o carregamento da fonte — risco baixo (troca de `font-family` com fallback ao padrão do sistema caso a rede do usuário bloqueie o Google Fonts), mas registrado por transparência.
- Ver D110 em `_DECISIONS.md`.

---

### v3.18 — 14/07/2026 · *Sessão SITE — sistema de cor semântico documentado, inconsistência de CBO corrigida*
- `ESTUDO_ARQUITETURA_E_PLANO.md` §4 propunha uma "lógica de cor semântica" nunca implementada. Auditado o uso real de cada família de cor em todas as views/componentes antes de declarar a regra (não inventada do zero): 🟢 verde = vantagem/financeiro/gratuito/aprovado · 🔵 azul = navegação/identificador oficial · 🟣 roxo/indigo = rede/relacionamento · 🟠 laranja/amber = alerta/pré-requisito/custo/normas · 🔴 vermelho = crítico/negativo. Legenda documentada como comentário no topo de `theme/tokens.js`.
- **Achado durante a auditoria:** código CBO aparecia em azul em 3 lugares e em roxo em outros 3, sem critério. Padronizado para azul (é identificador oficial, mesma família do código de trilha — não é dado relacional).
- Sintaxe validada via Babel nos 5 arquivos tocados (antes/depois). Sem acesso a navegador real neste ambiente para o pixel-diff de 4 camadas do protocolo do projeto — risco visual mínimo (mudança de cor só, mesmo componente `pill()`), mas registrado por transparência.
- Ver D109 em `_DECISIONS.md`.

---

### v3.17 — 14/07/2026 · *Sessão SITE — limpeza de sprints soltos redundantes*
- Removidos os 10 arquivos `SPRINT{6,8,9,10,11,12,14,15,16,17}_EXECUCAO.md` de `portal/_arquivo/` (116 KB) — 100% consolidados em `portal/HISTORICO_SPRINTS.md` desde uma sessão anterior, confirmado por comparação de conteúdo antes da remoção (0 texto exclusivo perdido).
- `portal/_arquivo/README_portal_obsoleto_sprint17.md` mantido como está — não é redundante, mas suas seções de vocabulário (setores/idiomas/tags) estão desatualizadas frente ao v128; já rotulado como obsoleto, sem risco de confusão.
- Ver D108 em `_DECISIONS.md`.

---

### v3.16 — 05/07/2026 · *Sessão SITE — quebra do monólito `App.jsx` completa (2823 → 170 linhas)*
**Maior mudança de código do projeto até hoje. Nenhuma lógica de negócio, query ou comportamento alterado — reorganização pura, verificada em 4 camadas a cada etapa (sintaxe, execução real, regra de hooks, pixel-diff em 11 telas).**

- `App.jsx` quebrado em **23 módulos** (`theme/`, `utils/`, `components/`, `data/`, `views/`, `context/`), executado em 8 etapas de risco crescente conforme planejado em `ROTEIRO_QUEBRA_MONOLITO.md`.
- **2 bugs reais encontrados e corrigidos pelo próprio protocolo de verificação, não por sorte:**
  - Etapa 6 (`ViewGaps`): reconstrução de memória em vez de cópia literal introduziu 3 bugs (filtro de impacto dinâmico em vez de fixo, 3 layouts distintos fundidos num card genérico, prefixo de texto duplicado) — pego pelo pixel-diff (página 50% mais alta, 3,4x mais texto). Corrigido reescrevendo a partir do texto original extraído programaticamente.
  - Etapa 8 (final): o carregador de múltiplos módulos (escrito na Etapa 1) buscava dependências sequencialmente — com 23 arquivos isso levava 9-16s para carregar. Trocado por busca em paralelo (`Promise.all` + cache de promises) — **9-16s → ~3s**.
- Nota de arquitetura no topo do `App.jsx` (desatualizada desde a Sprint 6, ainda descrevia carga via JSON) corrigida para refletir a arquitetura modular atual.
- Ver D98 a D106 em `_DECISIONS.md` para o histórico completo de cada etapa.

---

### v3.15 — 05/07/2026 · *Sessão SITE — estudo de arquitetura, quick wins de segurança e SP-12 Grupo D*
- **Achado corrigido:** `index.html` real nunca renderizava o site para nenhum visitante (`exports is not defined`, depois crash de `useState`) — independente do bug de Hooks do D88. Encontrado testando a lógica real (não uma cópia adaptada). Ver D93.
- `ESTUDO_ARQUITETURA_E_PLANO.md` produzido: raio-x do monólito, avaliação honesta do sistema visual, achados de segurança (banco inteiro baixável, CDN sem SRI/versão travada — sem urgência hoje, registrado para quando o produto ganhar dado não-público) e roteiro de quebra do monólito.
- Quick wins de curto prazo já aplicados: `integrity=`/SRI nos scripts de CDN.
- **SP-12 concluído por completo**: as 8 tabelas `dm_*` restantes (Grupo D) classificadas — 4 viraram o painel "📡 Sinais de Mercado Regional" na aba Mercado (recolhido por padrão), 4 confirmadas como infraestrutura interna sem necessidade de UI. Achado: essas 4 tabelas usam uma **4ª taxonomia de setor informal**, sem correspondência com as outras 3 já conhecidas (registrado como pedido formal SP-39 à sessão BANCO).
- Expansão do sistema de tokens de cor (`theme/tokens.js`), preparando terreno para a quebra do monólito.
- Ver D93 a D97 em `_DECISIONS.md`.

---

### v3.14 — 04/07/2026 · *Sessão SITE — autoauditoria: correção de poluição em `db_versions` e changelog desatualizado*
- **Achado e corrigido nesta própria sessão:** entradas de sincronização do SITE (números 108-109) estavam sendo inseridas na tabela `db_versions` — o mesmo namespace de versão real do BANCO (1-80), criando a falsa impressão de que 27 versões (81-107) tinham desaparecido. Migradas para uma tabela nova e própria, `site_sync_log`; `db_versions` restaurada ao histórico real do BANCO (1-80).
- `RELATORIO_RUIDO_BANCO.md` estava desatualizado sem aviso (números de v109 apresentados como atuais) — adicionado aviso no topo apontando para `RECHECK_RUIDO_v109_v128.md`.
- Ver D92 em `_DECISIONS.md`.

---

### v3.13 — 04/07/2026 · *Sessão SITE — sincronização #6 (v109→v128) e auditoria de ruído em `companies`, a pedido do usuário*
- Sincronização de rotina: schema conferido (0 tabelas faltando), 11 chaves de JOIN dos grupos B/C reconfirmadas sem órfãos, render real (Playwright) sem erro nas 10 abas.
- Auditoria de ruído entregue à sessão BANCO: 325/733 (44,3%) empresas sem fonte nem setor — 6 categorias distintas identificadas (taxonomia vazada, fragmentos de rascunho, possível vazamento de IA/pipeline, corpo normativo mal categorizado, setor nulo em 26% das fontes, corrupção de texto em 3 trilhas). Recheck em v128 (`RECHECK_RUIDO_v109_v128.md`): 86/325 corrigidas, 239 seguem pendentes — pedido formal renovado à sessão BANCO.
- Ver D89, D90, D91 em `_DECISIONS.md`.

---

### v3.12 — 03/07/2026 · *Sessão SITE — bug crítico de Hooks corrigido (React error #310)*
**Primeira vez que o portal foi testado num render real de navegador (Playwright + Chromium headless) em vez de só leitura de código.**
- `App()` violava as Regras de Hooks: `useState`/`useCallback` declarados depois de `return`s condicionais — na 1ª renderização (dados carregando) o componente retornava antes de chamar esses hooks; ao terminar de carregar, chamava hooks que não existiam na renderização anterior → crash garantido em qualquer navegador real assim que o banco terminasse de carregar.
- Corrigido, validado com `eslint-plugin-react-hooks` (0 violações), reproduzido end-to-end (10 abas + detalhe de perfil/trilha, sem erro).
- Ver D88 em `_DECISIONS.md`.

---

### v3.11 — 27/06/2026 · *Sessão BANCO — pipeline unificado fundindo ferramentas externas (v69→v70)*
**Sem alterações em `App.jsx`/portal nem em dados de produto. Entrega: pipeline de ferramentas.**

- **`00_pipeline_completo.py`** — funde 2 ferramentas externas recebidas (`audit_sql_patch_v2.py`, `fix_sql_patch_v2.py`) com meu `validar_patch_externo.py` em 4 estágios: auditoria estática → correção automática segura → auditoria estática de novo → validação dinâmica contra o banco real.
- **4 bugs reais corrigidos nas ferramentas recebidas**: notação `[tabela]` não reconhecida (0 INSERTs detectados, silenciosamente), Jaccard de near-duplicata inflado por boilerplate (631→21 near-duplicatas, removendo falso positivo), regex de slug não pulando `id` numérico líder (bad-slug-removal nunca disparava).
- **Testado retroativamente** contra os 2 patches mais complexos já recebidos — reproduz os achados originais e **encontrou 1 caso novo** que a revisão manual tinha perdido (4 `escola_sources` duplicadas por capitalização/ordem de palavra).
- `_LEIA_PRIMEIRO.md` Regra 8 reescrita; `meta_protocolo` regra 22.
- Ver D78-DB em `_DECISIONS.md`, incluindo o relatório de bugs para repasse à sessão que mantém os scripts originais.

---

### v3.10 — 27/06/2026 · *Sessão BANCO — ferramenta de validação automática de patches (v68→v69)*
**Sem alterações em `App.jsx`/portal nem em dados de produto. Entrega principal: ferramenta nova, não dado.**

- **`validar_patch_externo.py` criada** — automatiza as 7 checagens manuais que vinham sendo feitas em cada um dos 5 patches externos avaliados desde 20/06 (execução isolada, FK check, escrita indevida em `db_versions`, `LIKE` ambíguo, fragmento de PDF, numeração `SP-NN`/`D-NN-DB` estranha — inclusive por CONTEÚDO, não só número —, propagação de `DELETE`).
- **Testada retroativamente** contra os 2 patches mais complexos já recebidos — reproduziu exatamente os achados da revisão manual original em ambos.
- **Uso obrigatório formalizado**: `_LEIA_PRIMEIRO.md` Regra 8 + `meta_protocolo` regra 21.
- Ver D77-DB em `_DECISIONS.md` para o limite honesto desta solução.

---

### v3.9 — 27/06/2026 · *Sessão BANCO — patch externo resolve SP-18/19/20 (v67→v68)*
**Sem alterações em `App.jsx`/portal.**

- **`nivel_cnct` populado para 98/98 perfis CNCT** — mapeamento 1:1 a partir de `tier`, verificado antes de aplicar. **`SP-18` resolvido.**
- **`company_institution_links` criada** (100 candidatos empresa↔ENAP, baixa confiança, marcado como tal). **`SP-19` parcial.**
- **ANP duplicada (`id=944`) removida**, verificado 0 dependências em todas as 5 tabelas relevantes. **`SP-20` resolvido.**
- 12 tabelas novas: `escola_sources`, `trail_escola_links`, `trail_cbo_validation` (30 correções de CBO com fonte real citada), `sector_industry_map`, entre outras.
- 248 de 288 `companies` novas aplicadas (40 fragmentadas descartadas); 15 trilhas com descrição duplicada corrigida; `dm_cbo_pendentes` (6 linhas, bug de estrutura) rejeitado.
- **Erro de processo corrigido na hora:** o patch trouxe seu próprio histórico de build interno dentro de uma seção `db_versions` — removido antes de fechar a versão, para não poluir a numeração real desta linha.
- Ver D76-DB em `_DECISIONS.md`.

---

### v3.8 — 26/06/2026 · *Sessão BANCO — auditoria de atualização da documentação (v66→v67)*
**Sem alterações em `App.jsx`/portal nem em dados de produto — só documentação + 2 entradas de `gaps`.**

- `_SCHEMA.md` **regenerado do zero** — estava desatualizado desde antes do patch consolidado v66. 12 contagens corrigidas, 2 tabelas novas documentadas, 1 tabela pré-existente (`profile_normas`) que tinha sido esquecida na primeira versão agora incluída.
- `_BACKLOG.md`: `SP-24` adicionado (Perfil CNCT#6 sem source técnica direta — gap antigo, nunca tinha entrada própria).
- `meta_protocolo` regra 19 + `_LEIA_PRIMEIRO.md` Regra 6 estendida: lição sobre verificar arquivos de trabalho da própria sessão, não só externos, antes de reutilizá-los — motivada pelo achado de conteúdo fabricado da sessão anterior.
- Ver D75-DB em `_DECISIONS.md`.

---

### v3.7 — 22/06/2026 · *Sessão BANCO — patch consolidado de 10 blocos avaliado e aplicado com filtros (v65→v66)*
**Sem alterações em `App.jsx`/portal.**

- 42 trilhas (já existentes em `trails`) promovidas para `atlas_trails` — ponte intencional pro catálogo Atlas oficial, confirmada com o responsável.
- 4 sources sobre energia eólica com `industry_sector_id` corrigido de "Petróleo" (errado) para `NULL`.
- **85 de 217 sources** de um bloco descartadas por conteúdo fragmentado de extração de PDF; **194 sources de outro bloco aplicadas integralmente, risco aceito** (~58% também fragmentado, decisão explícita do responsável — ver `SP-23`).
- 2 tabelas novas: `material_types`, `source_material_types`. `trail_steps` ganhou 4 colunas (`nome`, `carga_horaria`, `descricao_detalhada`, `objetivos_aprendizagem`).
- `companies` 442→506, `sources` 1023→1537, `atlas_trails` 145→187, `trail_step_sources` 79→799.
- **Achado de processo:** uma cópia de trabalho paralela continha entradas fabricadas (números e uma regra de `meta_protocolo` inexistente) — descartadas, confirmado por query direta no banco antes de escrever esta entrada. Ver D74-DB em `_DECISIONS.md`.

---

### v3.6 — 21/06/2026 · *Sprint 15 (EXP-08: Mercado de Trabalho)*
**Primeira sessão sob a divisão formal de papéis (Regra 0.1) — nenhuma alteração no `.db`, só leitura.**

- Nova aba **Mercado de Trabalho**: dados reais RAIS/PNAD Contínua 2024 (`dm_mercado_trabalho`), 1458 linhas. Busca, filtro por setor CNAE, ordenação, detalhe por estado.
- Painel novo na página de cada Perfil CNCT: salário médio, vínculos ativos, maior mercado por UF, tendência — para 80 dos 85 perfis (94%), via `cbo_canonical`.
- Achado incidental (fora do escopo SITE): CBO `8153-10` com dado real mas sem nome em `cbo_canonical` — investigado pela sessão BANCO, ver `SP-22`.
- Badge de versão: v3.4 → v3.6.

Relatório detalhado: `portal/SPRINT15_EXECUCAO.md`.

---

### v3.5.6 — 21/06/2026 · *Sessão BANCO — `_SCHEMA.md` recriado (v63→v64)*
**Sem alterações em `App.jsx`/portal nem em dados — só documentação.**

- `_SCHEMA.md` recriado do zero, por consulta direta ao banco real (não por memória) — cobre as 89 tabelas, 8 views, vocabulários controlados, prefixos de ID, e nota honestamente quais tabelas `dm_*` foram auditadas em profundidade vs. só inspecionadas por schema/amostra.
- Motivado por pedido do responsável para explicar o banco a outra LLM — o protocolo do site já previa este documento (existia antes, foi removido por estar obsoleto).
- Ver D72-DB em `_DECISIONS.md`.

---

### v3.5.5 — 21/06/2026 · *Sessão BANCO — 3 patches externos (P4, trilhas_99, P5) avaliados e aplicados com correções editoriais (v62→v63)*
**Sem alterações em `App.jsx`/portal.**

- **32 sources novas** (plataformas gov, CREAs, saúde, IFs, software livre) — `p4_sources_ead_validado.sql`, sem achados, aplicado integralmente.
- **103 trilhas + 471 steps + 103 CBOs** — `trilhas_99_insert_corrigido.sql`. 2 tabelas novas (`trail_cbos`, `trail_normas`) com correção de FK própria do patch. **4 trilhas "MT-*" removidas** por decisão do responsável (duplicavam tema de 4 "TRL-MICRO-*").
- **79 vínculos trilha↔fonte** — `p5_step_sources_normas_corrigido.sql`, parcial. Achado crítico confirmado por execução: `LIKE` amplo sem `ORDER BY` produzia vínculo errado (caso real: "Eu Capacito" resolvia para Anglo American). 11 vínculos de alto risco descartados por decisão do responsável (registrados como SP-21).
- `trail_normas` (tabela nova): 0→4. `sources`: 991→1023. `trails`: 109→105 (pós-remoção).
- Ver D71-DB em `_DECISIONS.md`.

---

### v3.5.4 — 21/06/2026 · *Sessão BANCO — patches externos avaliados e aplicados (v61→v62)*
**Sem alterações em `App.jsx`/portal.**

- **Merge de 5 pares de companies duplicadas** (Anglo American, Khan Academy, Schneider Electric, SEL/Schweitzer, GHG Protocol) — patch externo, avaliado e testado em cópia antes de aplicar. `companies`: 447→442.
- **15 sources novas** (P1+P2, programas de capacitação técnica em CIP/RBI/LOG/INS/PER/SIM/REG/MET/SOL) + vínculos `source_sector_codes`. `sources`: 976→991.
- **Bug encontrado e corrigido antes de aplicar:** 1 referência a `company_id` inexistente (ANP) no patch de sources — corrigida (97→486) e retestada antes de aplicar no banco real.
- **Achado técnico novo:** `INSERT OR IGNORE` não suprime violação de `FOREIGN KEY` em SQLite — registrado em `meta_protocolo` regra 18.
- **Achado paralelo:** 2ª entrada duplicada de ANP (id=944) — registrada como SP-20, não corrigida ainda.
- Ver D70-DB em `_DECISIONS.md`.

---

### v3.5.3 — 21/06/2026 · *Sessão BANCO — reconciliação de três linhas divergentes (v57→v61)*
**Sem alterações em `App.jsx`/portal. Sessão BANCO recebeu trabalho independente da Sprint 14/SITE sobre o mesmo `v57` que já tinha sua própria continuação (v58/v59) — mesmo padrão do incidente original (D62-D67), descoberto e corrigido antes de causar perda de dado.**

- **Verificado e preservado** todo o trabalho da Sprint 14 (regressão de `cnct_profiles` corrigida de novo, 516 violações de FK, `companies` 520→447) como base (`v60`).
- **Reaplicado por cima**, com renumeração: 5 itens da sessão BANCO (`gaps`×`_BACKLOG.md`, antes SP-13 a SP-17) → **SP-15 a SP-19**; 2 decisões (antes D64-DB/D65-DB) → **D68-DB/D69-DB**.
- **Risco real verificado antes de mesclar:** referências de `company_id` da sessão BANCO contra a dedup de `companies` da Sprint 14 — 1 referência (DWSIM) precisou de correção manual; 1 (AVEVA) já estava corretamente propagada pela própria Sprint 14.
- **Protocolo:** `_LEIA_PRIMEIRO.md` Regra 7 (gaps×backlog cruzáveis) reintroduzida, com adendo sobre confirmar numeração `SP-NN`/`D-NN-DB` no arquivo real antes de usar — causa direta desta colisão.
- Resultado: `fato_v55.db` interno agora em `v61`. Ver D69-DB em `_DECISIONS.md` para o relato completo.

---

### v3.5.2 — 20/06/2026 · *Sprint 14 (sincronização com sessão de auditoria)*
**Sem features novas de UI. Foco em sincronizar qualidade de dados entre as duas linhas de trabalho independentes (portal e auditoria) sobre `fato_v55.db`.**

- **Confirmado: a reconciliação da Sprint 13 cobriu só schema/coluna, não qualidade de dados.** Os 3 pares de perfis CNCT duplicados já fundidos nas Sprints 11/12 sobre `fato_v33.db` (Plásticos, Mecânica de Precisão, Informática) existiam de volta em `fato_v55.db`, com os mesmos ids exatos — porque a linha de auditoria partiu de um snapshot anterior a essas correções. Refundidos com a mesma decisão já validada. `cnct_profiles`: 88 → 85.
- Esse merge revelou 516 violações de FK em 4 tabelas novas (`dm_matriz_pivotamento`, `dm_rede_centralidade`, `dm_rede_comunidades`, `dm_premio_transferencia`) que usam nomenclatura em português (`perfil_origem_id` etc.) — a varredura original (só "profile" em inglês) não tinha capturado. Corrigidas sem perda de dado real; no caso de `dm_premio_transferencia`, 64 linhas do par Plásticos eram dados reais exclusivos e foram migradas, não descartadas.
- **Novo achado, fora do escopo original:** varredura sistemática de `companies` (520 registros em v55, mesma metodologia da Sprint 9) encontrou 72 grupos candidatos a duplicata, concentrados nos ids 484-610 — provável importação em lote da própria auditoria sem checar contra a base existente. 2 falsos-positivos excluídos após verificação individual (BRF/M.Dias Branco, já conhecido; SENAI — 2 programas técnicos diferentes que só coincidem em citar "SENAI" genericamente). 1 caso ("Air Products / Linde") verificado por busca externa — confirmado erro de cadastro, não joint venture real (Linde se fundiu com a Praxair, não com a Air Products). `companies`: 520 → 447.
- `expected.social` (35→34) e `expected.sector` (458→444) do smoke test M-12 corrigidos — mudanças reais já feitas pela própria auditoria antes desta sessão, nunca propagadas ao `App.jsx`.
- **3 novas entradas em `_DECISIONS.md`** (D64-DB, D65-DB, D66-DB) com instruções explícitas e numeradas para a sessão de auditoria — que continua em andamento, independente desta — não recriar os mesmos problemas numa próxima regeração do banco.
- Corrigido bug de formatação neste próprio arquivo: a entrada da Sprint 13 tinha sido escrita com `\n` literal em vez de quebra de linha real, deixando o arquivo ilegível em qualquer editor de texto normal (ainda que `grep` funcionasse).

Relatório detalhado: `portal/SPRINT14_EXECUCAO.md`.

**Pendências conhecidas após esta versão:** recálculo de `dm_rede_centralidade`/`dm_rede_comunidades` (perfis e empresas) com a topologia sem duplicatas; varredura de duplicatas nunca feita em `atlas_trails`/`sources`; mesmas pendências de EXP-07 desde a Sprint 12 (9 PDFs de Atlas previstos, 13 cursos sem perfil); DB-L04/L05 e SP-09; SP-12 (35 tabelas `dm_*` sem UI).

---

### v3.5.1 — 20/06/2026 · *Sprint 13 (infraestrutura: index.html + marcação de obsoletos)*
**Sprint de infraestrutura pura — sem alterações no banco ou no App.jsx.**

- **`portal/index.html` criado** — arquivo de entrada que estava ausente do projeto desde a remoção de `portal_industria_edu.html` (D46, Sprint 4). Sem ele, o portal não carregava no browser. O arquivo carrega React + Babel via CDN, expõe `initDB`/`query`/`scalar` como globais para compatibilidade com a transpilação Babel no browser, e monta `<App />` via `ReactDOM.createRoot`. Para rodar: `cd portal/ && python3 -m http.server 8080`.
- **Auditoria de obsolescência:** identificados 2 documentos congelados em 12/06/2026 e sem atualização desde as Sprints 6–12 — `iedu_sumario_v2.0.md` (status `meta` na tabela `documents`, nunca gerou dado estruturado) e `iedu_integracao_v1.0.md` (registrado no banco como \"duplicado/superado por complementaridade\"). Ambos receberam sidecar `.OBSOLETO.md` explicando o motivo e o substituto correto. Os arquivos originais foram mantidos como registro histórico.
- **Documentação sincronizada:** `_LEIA_PRIMEIRO.md`, `portal/README.md`, `_README.md` e este arquivo atualizados para refletir Sprint 13, `index.html` e os dois obsoletos marcados.

**Pendências conhecidas após esta versão:** as mesmas da Sprint 12 — 9 PDFs de \"Atlas previstos\" e 2 notas de cobertura não processados; 13 cursos com PDF mas sem perfil CNCT; DB-L04/L05 (URLs de setor); varredura de duplicatas em `atlas_trails`/`sources` nunca feita. 8 gaps ativos no `_BACKLOG.md`.

---

### v3.5 — 19/06/2026 · *Sprint 12 (EXP-07: Micro-Atlas PDF)*
**Primeira feature nova de UI desde a Sprint 8: botão de Micro-Atlas no card de Perfil CNCT.**

- Processados os 78 PDFs de Micro-Atlas enviados pelo usuário (`sistema_fato_atlas.zip`) — formato real era 1 PDF por curso do catálogo CNCT, não por trilha do Atlas como inicialmente especificado.
- Descoberta: a numeração interna dos arquivos ("ID CNCT #N") não corresponde a nenhum id atual do banco — reflete um snapshot anterior a 14/06/2026. Match feito por nome de curso (única chave confiável), extraído programaticamente do texto de cada PDF.
- **Terceiro achado de duplicata em `cnct_profiles`** (DB-DUP-03): casar os PDFs por nome revelou 2 pares adicionais — "Técnico em Mecânica de Precisão" (ids 6/32) e "Técnico em Informática" (ids 16/33). Critério de decisão (CBO idêntico nos dois, diferente do caso da Sprint 11): completude de dado — versão fina tinha zero vínculos em `guia_source_profiles`. 4 itens de conteúdo real, exclusivos da versão fina, migrados antes do `DELETE`. Varredura sistemática completa (nome exato + normalização) não encontrou mais pares. `cnct_profiles`: 87 → 85.
- Coluna `micro_atlas_pdf` adicionada em `cnct_courses`, 78 de 99 cursos preenchidos. Botão "📄 Ver Micro-Atlas" no cabeçalho do card de Perfil CNCT — cobre 65 dos 85 perfis (a relação curso↔perfil nem sempre é 1:1 por nome).
- **Ajuste ao plano original:** EXP-07C previa o botão no SourceCard (camada `sources`/Explorar). Implementado na página de Perfil CNCT em vez disso — não existe FK direta entre `sources` e o catálogo CNCT, só um vínculo indireto fraco (53 linhas), que tornaria o recurso parcial e indireto sem necessidade.

Relatório detalhado: `portal/SPRINT12_EXECUCAO.md`.

**Pendências conhecidas após esta versão:** 9 PDFs de "Atlas previstos" e 2 notas de cobertura complementar (enviados, não processados — são documentos de planejamento em prosa, não dados estruturáveis). 13 cursos com PDF mas sem perfil CNCT associado (administrativos/comerciais e design/moda) ficam sem superfície de UI. DB-L04/L05 e SP-09 seguem precisando de pesquisa externa/curadoria.

---

### v3.4.3 — 19/06/2026 · *Sprint 11 (fusão de perfis + DB-L06 + fechamentos)*
**Sem features novas de UI. Segundo caso de duplicata de cadastro encontrado e corrigido, mais limpeza de pendências antigas.**

- **DB-DUP-02:** dois perfis "Técnico em Plásticos" em `cnct_profiles` (ids 31 e 73) — mesmo padrão da duplicata de empresas da Sprint 9, agora em perfis CNCT. Decisão por especificidade de CBO, com pesquisa externa feita antes de executar: CBO `3114-10` confirmado oficial (Ministério do Trabalho, família "Técnicos em fabricação de produtos plásticos e de borracha"), CBO `8153-10` não encontrado em nenhuma fonte oficial brasileira. Perfil `73` sobrevive, `31` eliminado, FK reatribuída sem perda de dado real. `cnct_profiles`: 88 → 87.
- **DB-L06 (parcial):** plano original citava 4 perfis com campos vazios — verificado que são só 3 (1 já estava preenchido, número desatualizado). `atlas_ref` preenchido para 2 deles, derivado de vínculo que já existia no banco (`atlas_trail_profiles`), não inventado. Campos editoriais (descrição de atuação, status do Atlas) deixados pendentes — não é dado para inferir, é redação de conteúdo.
- **Hipótese de renumeração de trilhas (Sprint 10), investigada e fechada:** confirmado que existiu uma numeração anterior de 163 trilhas, com 35 códigos migrados para uma tabela própria de "perfis de destino de carreira" (`atlas_destination_profiles`) — não é perda de dado. Não amplia, porém, a cobertura de `cnct_course_atlas_trails` da Sprint 10: dos 45 códigos sem match, só 1 seguia esse padrão.
- **SP-04 fechado formalmente** no backlog após 3 investigações sem solução (Sprint 7, 9, 11) — `source_atlas_trails` nunca teve linhas para a camada `sector`.
- **Correção real ao smoke test M-12** (diferente das Sprints 9/10, em que a alegação de desatualização estava errada): a fusão de perfis desta sprint tornou `expected.profiles` genuinamente desatualizado (era 88, banco real agora é 87) — corrigido.

Relatório detalhado: `portal/SPRINT11_EXECUCAO.md`.

**Pendências conhecidas após esta versão:** EXP-07 (especificação de arquivo solicitada ao usuário nesta sessão), DB-L04/L05 (URLs de setor) e SP-09 (vínculo Guia↔CNCT) seguem precisando de pesquisa externa/curadoria. Não foi feita varredura sistemática de `cnct_profiles` por outros pares duplicados — o de Plásticos foi achado por acaso durante outra investigação.

---

### v3.4.2 — 19/06/2026 · *Sprint 10 (bloco 2: grafo + correções)*
**Sem features novas de UI. Conecta dados que já existiam mas estavam isolados, e corrige um desenho de schema da Sprint 9.**

- **GR-07:** dos 55 `gaps` sem trilha do Atlas vinculada, só 1 tinha dado de fato disponível (`trails_atlas` preenchido) — vinculado corretamente. Os outros 54 não têm o dado na origem (não é trabalho pendente, é ausência real de dado, confirmado e documentado).
- **GR-02/GR-03, com correção de schema:** a Sprint 9 (GR-01) tinha adicionado duas colunas escalares (`source_id`, `atlas_trail_id`) em `cnct_courses` assumindo relação 1-para-1 entre curso e fonte/trilha. Investigação nesta sprint mostrou que a relação real é muitos-para-muitos — um curso técnico cobre várias trilhas de um Atlas inteiro, não uma só. As colunas escalares (sempre vazias, nunca usadas pela UI) foram substituídas por duas tabelas de junção: `cnct_course_atlas_trails` (100 vínculos, 16/99 cursos cobertos — só para os 7 Atlas já estruturados em `atlas_trails`) e `cnct_course_sources` (51 vínculos, 7/99 cursos cobertos via `profile_id`→`source_cnct_profiles`).
- **Achado de qualidade de dados, documentado e não corrigido automaticamente:** dos códigos de trilha não encontrados durante o GR-03, todos existem no banco — só que sob um Atlas diferente do que o curso declara (mesmo padrão de reaproveitamento de código entre Atlas já visto na Sprint 9 com `PE-1`). Não corrigido por ambiguidade real (o mesmo código existe em mais de um Atlas) — decidir qual seria chute editorial.
- **Investigado e descartado (`documents`):** a tarefa GR-06 original pedia "sincronizar" a tabela `documents` com o pacote atual. Verificado que `documents` é um log histórico de ETL (como cada arquivo-fonte foi processado), não um espelho do pacote — apagar entradas de arquivos removidos do ZIP destruiria histórico legítimo. Nenhuma mudança feita, por estar correto como está.
- **Correção a uma afirmação incorreta das Sprints 8/9:** os relatórros anteriores chegaram a afirmar que os valores `expected` do smoke test M-12 estavam desatualizados. Isso era falso — os 6 valores rastreados já estavam corretos, e `companies` nunca fez parte desse teste. Corrigido em todos os documentos que repetiam essa afirmação.

Relatório detalhado: `portal/SPRINT10_EXECUCAO.md`.

**Itens do plano original avaliados e pausados, pendentes de decisão/dado externo:** EXP-07 (Micro-Atlas PDF — faltam os arquivos), DB-L04/L05 (URLs de setor), DB-L06 (perfis CNCT incompletos), SP-09 (vínculo Guia↔CNCT) — nenhum tentado por heurística nesta sprint, mesma razão das Sprints anteriores.

---

### v3.4.1 — 19/06/2026 · *Sprint 9 (qualidade de dados)*
**Sem features novas de UI. Foco em integridade e limpeza estrutural do banco.**

- Removidas 2 tabelas redundantes (`*_atlas_trails_deprecated`) já subsumidas pela tabela ativa (DB-M03) — achado no processo: 1 vínculo histórico de perfil apontava para uma trilha que não existe em `atlas_trails` (código `PE-1` dentro do Atlas I/Petroquímica), registrado como gap de dado real, não corrigido por suposição
- Colunas `source_id`/`atlas_trail_id` adicionadas em `cnct_courses`, vazias — prepara terreno para mapear os 99 cursos a fontes/trilhas numa sprint futura (GR-01)
- `tag_meta` populada para as 69 tags efetivamente renderizadas como badge no Explorar (de 549 sem metadado no total) — heurística por categoria semântica do nome da tag, reaproveitando paleta já existente (DB-01 parcial)
- **Achado fora do escopo original, autorizado e executado nesta sessão:** 102 de 615 empresas em `companies` eram cadastros duplicados (mesma empresa com nome curto e nome longo, ex: `WEG`/`WEG S.A.`). Fundidas com segurança — FKs reatribuídas em todas as 5 tabelas dependentes antes de qualquer remoção, plano de fusão auditável, 1 falso-positivo identificado e excluído manualmente (`BRF S.A.` ≠ `BRF/M. Dias Branco`, são concorrentes). `companies`: 615 → 513 (DB-DUP-01)
- 2 linhas órfãs pré-existentes em `company_url_suggestions` (sem `company_id` válido, já documentadas no próprio dado como "artefato de extração, reclassificar/remover") finalmente removidas (DB-FK-01)
- `PRAGMA integrity_check` e `PRAGMA foreign_key_check` limpos ao final — zero problemas de integridade em todo o banco
- Duas heurísticas de recuperação automática foram **avaliadas e deliberadamente descartadas** por falta de sinal confiável no banco (não por falta de tentativa): vincular fichas do Guia sem perfil CNCT (DB-L03, 155 casos — exigiria inferir área de atuação de empresa por conhecimento de mercado) e preencher UF de empresas (DB-02 — exigiria pesquisa externa). Ambas as decisões documentadas em `db_versions` (v37, v38), não escondidas

Relatório detalhado: `portal/SPRINT9_EXECUCAO.md`.

**Pendências conhecidas após esta versão:** EXP-07 ainda bloqueado (sem mudança nesta sprint — é item de portal, não de dados). DB-L04/L05 (URLs de sector) e DB-L06 (perfis CNCT incompletos) seguem pendentes — exigem pesquisa externa ou curadoria, fora do que é seguro automatizar. **Nota de correção (Sprint 10):** a afirmação abaixo sobre o smoke test M-12 estar desatualizado por causa da queda de `companies` estava errada — `companies` nunca foi rastreado pelo smoke test M-12, e os valores que ele rastreia (social/technical/guia/sector/profiles/trails) continuavam corretos. Ver entrada v3.4.2.

---

### v3.4 — 19/06/2026 · *Sprint 8 (Tier 2)*
**Contexto setorial, núcleo curricular por trilha e aba de Empresas**

- Badge `cnct_hint` no card de fonte técnica agora é clicável — navegação cruzada Explore→Perfil via novo helper `navigateTo` no `DataContext` (SP-03, fecha pendência aberta desde a Sprint 4)
- Painel "Contexto FATO" no detalhe de cada setor: perfis CNCT relevantes, blocos do Guia e Atlas que cobrem o setor (EXP-03A/C), mais mapa de cobertura de programas por empresa avaliada com 3 níveis de status (EXP-03B, `sector_coverage_matrix`)
- Drawer de trilha (aba Perfis CNCT) ganhou núcleo curricular com Unidades Curriculares e carga horária — Atlas II continua representado por CBOs/normas (D53-DB) — e badge de aproveitamento base + nível do perfil de saída (EXP-06A/B)
- Nova aba **Empresas**: 615 registros com setor(es), UF, contagem de fontes mapeadas e status de URL institucional verificada (EXP-04)
- Confirmado que EXP-05 (itinerário/verticalização/normas no card de perfil) já estava implementado em sessão anterior — sem trabalho necessário
- EXP-07 (Micro-Atlas em PDF por trilha) **não entregue** — bloqueado: `cnct_courses.micro_atlas_pdf` não existe no banco ainda

Limpeza de pacote (mesma sessão, não é mudança de produto):
- Removidos do pacote de trabalho: `fato_v20.db` (substituído por `fato_v33.db` desde a Sprint 6, nunca mais lido) e `portal/histórico/` (9 JSONs + 3 docs, fallback nunca lido pelo app desde a Sprint 6, D57)
- Removidos `SPRINT4_PLANO.md`, `ANALISE_ARQUIVOS_FONTE.md`, `_SCHEMA.md` (descreviam estados pré-migração já não aplicáveis)
- `PLANO_MIGRACAO_v4.md` incorporado à raiz do pacote (antes só citado, não incluído)

Relatório detalhado: `portal/SPRINT8_EXECUCAO.md`. Decisões: ver `_BACKLOG.md` (entrada SP-03 atualizada).

**Pendências conhecidas após esta versão:** EXP-07 bloqueado por dados (ver acima). **Nota de correção (Sprint 10):** este texto chegou a afirmar que os valores `expected` do smoke test M-12 ainda refletiam contagens da Sprint 6/7 — isso foi verificado e estava errado, os valores já estavam corretos desde então. Ver entrada v3.4.2.

---

### v3.3 — 16/06/2026 · *Sprint 6 + Sprint 7*
**Migração da fonte de dados de JSON para banco SQLite + Tier 1 de expansão**

Sprint 6 — Migração Base:
- Fonte de dados trocada de 9 JSONs estáticos para `fato_v20.db` (SQLite), carregado no browser via sql.js/WASM, sem backend (D55/D56)
- `db.js` criado (M-00, 47 linhas) — único arquivo novo desta sprint
- `App.jsx`: ~25 queries SQL substituem os 8 `fetch(*.json)` (M-01 a M-09)
- `TAG_COLORS` e `FORMAT_META` hardcoded (38 entradas no total) removidos — derivados de `tags`+`tag_meta`/`format_meta` (M-10/D61)
- Lazy loading para as camadas `sector` (455) e `guia` (415) — ~87% das fontes só carregam quando a aba é aberta (M-11/D58)
- Smoke test de paridade de contagens roda no console a cada carga (M-12) — PASS total
- 9 JSONs movidos para `histórico/` nesta sprint — **removidos do pacote na Sprint 8** (ver entrada v3.4)
- Patches de dados pré-sprint aplicados ao banco: +105 vínculos `guia_source_profiles` (PRÉ-6B), 4 URLs validadas (PRÉ-6C)

Sprint 7 — Tier 1:
- Busca global por FTS5 com painel de resultados por categoria (Fontes/Perfis/Trilhas) no header — descoberto durante a implementação que a build padrão do sql.js não inclui FTS5; trocado para o fork `sql.js-fts5` (SP-02, D59)
- Badge de status de URL (8 estados) com tooltip de data de checagem, na aba Setores (SP-04A/B)
- Fichas da camada `guia` (415, antes invisíveis na UI) integradas à aba Guia, agrupadas por bloco (EXP-01)
- Seção "Caminhos CBO" (CBOs/certificações/normas) no card técnico expandido, via `cnct_courses` — presente em 41 das 55 fontes técnicas (EXP-02)

Decisões: D53-DB a D61 + execução completa em `_DECISIONS.md`. Relatório detalhado em `portal/SPRINT6_EXECUCAO.md`.

**Pendências conhecidas após esta versão:** `_BACKLOG.md` SP-03 original (badges de perfil CNCT clicáveis) — **resolvido na Sprint 8, ver entrada v3.4 acima.** `sectors[].atlas_trails` continua vazio (gap de dados, não de código — `source_atlas_trails` não tem linhas para a camada `sector`).

---

### v3.2 — 14/06/2026 · *Sprint 5*
**Bugs críticos, documentação, dados e features SP-02/SP-03**

Correções (Sprint 5):
- Bug Nav: `const {all,trails}` → +4 variáveis (`profiles, guideBlocks, complementarity, sectors`) — resolve crash em 4 abas
- Bug noReg: condição `if(noReg&&s.cadastro!==false)` adicionada ao useMemo — filtro agora funcional
- 8 strings de versão atualizadas: `v6.0→v6.3` (Guia) · `v1.1→v1.2` (Protocolo/Atlas) · `v3.1→v3.2` (Nav)
- Estrutura: `portal_v3/` renomeado para `portal/` · `histórico/` criado com 4 legados
- Documentação: `portal_v3/` → `portal/` em 4 docs raiz · histórico de versões S2/S3 desambiguado

Decisões: D46–D52 (pendentes de registro)

> Nota (16/06): o título desta entrada menciona "features SP-02/SP-03", mas o corpo acima só lista correções de bug — SP-02 (busca global unificada) e SP-03 (badges clicáveis) **não foram implementados na Sprint 5**, apenas planejados. Ambos permaneceram no `_BACKLOG.md` até a Sprint 7 (SP-02 resolvido; SP-03 original ainda pendente — ver entrada v3.3 acima).

---

### v3.2 — 13/06/2026 · *Sprint 4*
**Mapa de lacunas, catálogo de setores e busca cruzada**

Novos dados:
- `iedu_complementarity.json` — 81 entradas em 4 tipos (`guia_sem_atlas`, `atlas_sem_guia`, `sobreposicao`, `recomendacao`) extraídas de `iedu_complementaridade_v1.0.md`
- `iedu_sectors.json` — 634 programas educacionais de 114 empresas em 12 setores industriais (1054 brutos → dedup por empresa+programa)
- `iedu_atlas_trails.json` expandido: 128 → 145 trilhas (+17 Unidades Curriculares UC1–UC17 do Atlas I)
- `trails.json` enriquecido: campo `cnct_profiles` adicionado a todas as 6 trilhas

Novas views (App.jsx v3.2 · 1114 linhas):
- `ViewGaps` — mapa interativo Atlas×Guia com 3 tabs e filtro por impacto
- `ViewSectors` — navegação por 12 setores → empresas → programas com filtro gratuito

Decisões: D41–D45

---

### v3.1-S3 — 13/06/2026 · *Sprint 3*
**Conhecimento estruturado: perfis CNCT, blocos do Guia, trilhas do Atlas**

Novos dados:
- `iedu_profiles.json` — 30 perfis CNCT (T1–T4) com tier, CH, CBOs, setores, trilhas, qualificações e verticalização. Extraídos de `iedu_indice_v4.1.md` via parser Python
- `iedu_guide_blocks.json` — 29 blocos do Guia Industrial v6.3 com código setorial, bloco_id e descrição
- `iedu_atlas_trails.json` — 128 trilhas dos 9 Atlas (PE/UC incluídas) com perfis e setores cruzados. Extraídas de `iedu_atlas_v1.0.md`
- `technical.json` enriquecido: campo `atlas_trails` adicionado (55 entradas, 51 com trilhas mapeadas)

Novas views (App.jsx v3.1 · 848 linhas):
- `ViewProfiles` — lista de 30 perfis filtrada por tier + detalhe + painel de trilha clicável
- `ViewGuideBlocks` — 29 blocos com fontes associadas

Decisões: D37–D40

---

### v3.1-S2 — 13/06/2026 · *Sprint 2*
**Campos de controle de dados e toggle de filtro**

Alterações em dados:
- `social.json`: campo `batch` para s21–s35 (`"social_001"`); todos os 35 com `data_layer`, `cost_range`, `cost_note`
- `technical.json`: campo `batch` para t26–t27 (`"ciclo_imediato"`) e t29–t56 (`"fato_002"`); todos os 55 com novos campos; `verified: true` confirmado em t26, t27, t51

Alterações em App.jsx:
- `newIds` passa a ser derivado do campo `batch` (lista hardcoded de 40 IDs removida)
- Toggle "Apenas gratuitos" adicionado à barra de filtros (`dataLayer` state)
- Bloco de custo `💰 cost_range (cost_note)` no card expandido

Decisões: D34–D36

---

### v3.0 — 12/06/2026
**Migração para arquitetura com JSONs externos**

- Dados migrados de `window.PORTAL_DATA` embutido no HTML para 4 arquivos JSON externos (`social.json`, `technical.json`, `trails.json`, `vocab.json`)
- Arquitetura `DataContext` + hook `useData()` — sem prop drilling
- 6 trilhas curadas implementadas em `trails.json`
- Carregamento via `Promise.all + fetch` no `useEffect` do componente `App`
- Versão standalone `portal_industria_edu.html` mantida para demo

---

### v2.2 — 12/06/2026
- +15 entradas sociais (s21–s35): Lote Social 001
- Ciclo Imediato: t26 (WEG CTC) e t27 (Portal IDEA) adicionados
- 3 URLs verificadas: t26, t27, t51

---

### v2.1 — 12/06/2026
- Export CSV, ordenação por coluna, modo lista, contagem por setor, badge ⚠️ de URL não verificada

---

### v2.0 — 12/06/2026
- +28 fontes técnicas (Atlas FATO): t01–t25
- Filtro por idioma, campo CNCT, 2 novos setores técnicos

---

### v1.0 — 12/06/2026
- 45 fontes fundação (Mapeamento + Guia v6.0)
- Camadas social e técnica separadas

---
## GUIA DE OPORTUNIDADES GRATUITAS — Petróleo, Gás e Petroquímica

### v6.0 — Junho 2026 · *versão atual*
**Consolidação total da arquitetura v5.x**

Mudanças estruturais:
- **Bloco 14 reformado (D3):** separação definitiva entre Refino/Petroquímica e Movimentação de Cargas. MOV migra para Bloco 5 (Engenharia Offshore e Construção), conforme Proposta E do Relatório de Expansão v4.0.
- **Bloco EDU transversal (D2):** promovido de "Bloco 15" para "BLOCO EDU" sem numeração sequencial, refletindo sua natureza agnóstica ao setor industrial.
- **Formato narrativo:** fichas reescritas com contexto técnico expandido — de listas para parágrafos que explicam por que cada fonte importa para o profissional.
- **Apêndices integrados:** Apêndice A (análise estratégica da expansão v4→v5) e Apêndice B (histórico de decisões de design) embutidos no documento final.
- **_DECISIONS.md criado (D4):** registro arquitetural separado do conteúdo do guia, para rastreabilidade de design.
- **Artefatos de trabalho removidos:** separadores `══` e seções "Empresas Removidas/Adicionadas" removidos do corpo principal.
- **Preamble GICEA:** texto de abertura do sistema vinculado ao documento `iedu_cnct_fundamentos_v1.0.md`.

Blocos com fichas adicionadas ou reformuladas:
- Bloco 1-A: Emerson MicroTraining, Siemens TIA Portal Trial, Honeywell Knowledge Base, Yokogawa Education Center, ABB 800xA
- Bloco 1-B: Endress+Hauser Process Training, Rosemount/Emerson, VEGA Academy, KROHNE Academy, INMETRO, ABB Measurement
- Bloco 1-C: AVEVA PI Square, OPC Foundation, Profibus International, Moxa, HMS/Anybus Academy
- Blocos 16–21: fichas completadas e integradas ao corpo principal
- Bloco 14: reformatado e enxugado

---

### v5.2 — Junho 2026
**Completação dos Blocos 17–21 e consolidação do Bloco 1-A**

- Blocos 17 (Elétrica), 18 (Manutenção), 19 (Soldagem), 20 (Eólica), 21 (Completação) com fichas completas
- Bloco 1-A segregado do Bloco 1 original com fichas próprias
- Bloco 12-A nomeado formalmente (separado do antigo Bloco 12)
- 272 fichas · 26 blocos · 29 códigos setoriais

---

### v5.1 — Junho 2026
**Expansão de fichas e formalização do Bloco 12-A**

- Bloco 12-A: Hidrogênio Verde, Amônia e CCUS isolado do Bloco 12 original
- Fichas adicionadas: GHG Protocol Brasil, IFPR/Itaipu Parquetec, Serasa Experian/Transforme-se
- Expansão ficha WEG: NR-10, inversores CFW, soft-starters SSW
- Formato do campo Setor Industrial: `código` + texto descritivo

---

### v5.0 — Junho 2026
**Expansão arquitetural — 6 novos blocos, 5 subdivisões, 57 novas fichas**

Blocos novos:
- **Bloco 16** — Operação de Produção e Processo (`OPR`)
- **Bloco 17** — Elétrica Industrial, Acionamentos e Proteção (`ELE`)
- **Bloco 18** — Gestão de Ativos, Confiabilidade e Manutenção (`GCM`)
- **Bloco 19** — Soldagem Industrial e Qualificação de Procedimentos (`SOL` — bloco próprio)
- **Bloco 20** — Eólica Offshore e Energias Marinhas (`EOL`)
- **Bloco 21** — Completação e Intervenção de Poços (`CIP`)

Subdivisões:
- Bloco 1 → 1-A (Automação/DCS) · 1-B (Instrumentação/Metrologia) · 1-C (Redes IIoT)
- Bloco 4 → 4-A (END) · 4-B (Integridade/RBI)
- Bloco 10 → 10-A (Simulação) · 10-B (Digitalização) · 10-C (Cibersegurança OT)
- Bloco 12 → 12-A (H₂V/CCUS); Eólica → Bloco 20 autônomo

Novos códigos setoriais: `OPR` · `ELE` · `GCM` · `EOL` · `CIP` · `SIM` · `RBI` · `MET`
Total: 29 códigos setoriais

---

### v4.0 — 2025/2026
**Consolidação com metadados e Bloco EDU**

- Campo `Setor Industrial` adicionado a todas as 135 fichas (script de atualização)
- Bloco 15 — EDU: 10 fichas novas (Fundacentro, CRQ-SP, DWSIM, ENAP, IFs, Lúmina UFRGS, MIT OCW, Escola 4.0, FIAP, Khan Academy)
- Fichas de prioridade alta adicionadas: Parker Academy, Vaportec, IBP, Portal IDEA
- Texto de "Prova de Conceito" no cabeçalho do guia
- Legenda de 21 códigos de setor introduzida
- 149 fichas · 15 blocos

---

### v3.0 — 2025
**Estrutura de fichas e metadados**

- Introdução do formato de ficha padronizado (URL, Tipo, Formato, Idioma, Cadastro, Destaques)
- Campo `Setor Industrial` proposto como padrão
- Revisão crítica: empresas sem conteúdo EAD relevante removidas com justificativa
- Substituições por alternativas superiores documentadas

---

### v2.5 — Junho 2026 (PDF histórico)
**Consolidação inicial**

- 145+ empresas e organizações deduplicadas
- 13 categorias temáticas
- Primeiro formato de distribuição em PDF
- Base para toda a estrutura subsequente

---

## ATLAS DE TRILHAS

### Atlas de Petroquímica v1.0
**Status:** Existente — caso de referência do sistema

- 33 trilhas de especialização
- 18 perfis profissionais (do técnico iniciante ao especialista sênior)
- 8 séries: A (Processo), B (Transição Energética), C (Integridade), D (Digital), UC (Competências), PE/PS (Especialistas)
- Perfis CNCT de referência: Técnico em Petroquímica (p. 218) · Técnico em Petróleo e Gás (p. 217)
- Fontes: exclusivamente abertas e gratuitas; integra fontes do Guia v4.0+

**Próxima versão planejada — v1.1:**
- Integração explícita dos perfis CNCT em cada trilha
- Referências diretas às fichas do Guia v6.0 por código de bloco

---

### Atlas de Soldagem e Metalurgia v1.0
**Status:** Existente — 2º Atlas do sistema

- 11 trilhas em 4 séries: F (Fundamentos), M (Metalurgia), P (Processos Avançados), C (Corrosão/Normas)
- Perfis CNCT de referência: Técnico em Soldagem (p. 66) · Técnico em Metalurgia (p. 60)
- Integra com Bloco 19 (SOL) e Bloco 4-A (END) do Guia

---

## ÍNDICE CRUZADO TRIANGULAR

### v4.0 — Junho 2026 · *versão atual*
**Mesclagem final — 30 perfis · campo Especializações adicionado**

- Campo **Especializações técnicas no itinerário** incorporado em todos os 30 perfis (ausente no v3.0)
- Qualificações intermediárias expandidas em perfis #1, #6, #11, #22
- CBO `911205` adicionado ao perfil #28 (Refrigeração e Climatização)
- Blocos contextualizadores I4.0/I5.0 incorporados nos perfis #27–#30
- Tabela comparativa #21 (Petróleo e Gás) vs #27 (Petroquímica) restaurada
- Base: Guia v5.2 + Atlas Petroquímica v1.0 + Atlas Soldagem v1.0

---

### v3.0 — Junho 2026
**Consolidação canônica — 30 perfis**

- Une v2.0 + v2.1 + Addendum (perfis #27–#30)
- Perfis adicionados: #27 Técnico em Petroquímica · #28 Refrigeração · #29 Sistemas a Gás · #30 Biocombustíveis
- 29 códigos setoriais (Guia v5.2)
- Duas séries de Atlas (petroquímica + soldagem) mapeadas

---

### v2.1 — Junho 2026 (paralelo)
**Atualização para Guia v5.0**

- 29 códigos setoriais adicionados
- Cobertura revisada para todos os 26 perfis
- Seção 7 (análise de lacunas) atualizada

---

### v2.0 — Junho 2026
**Expansão dos eixos**

- Verticalização para graduação adicionada em todos os 26 perfis
- Normas e regulamentações associadas
- Qualificações intermediárias por perfil
- Base: 26 perfis, 3 eixos originais + 3 novos

---

### v1.0 — Junho 2026
**Versão original**

- 26 perfis CNCT · Indústria 4.0 e 5.0
- 3 eixos: CBO · Setor Guia · Trilha Atlas
- Tabela mestre + índice por perfil
- Derivado da extração detalhada do CNCT 3ª Ed.

---

## GICEA — GUIA INDUSTRIAL DE CURSOS EAD — ATLAS

### v1.0 — Junho 2026 · *versão atual*
**Documento de fundamento do sistema — novo**

- Define o mapa completo de perfis CNCT → Atlas
- 11 especialidades cobertas com perfil oficial, CBOs, itinerário e status de produção
- Status por Atlas: 2 Existentes · 1 Próximo · 8 Planejados
- Serve como guia de construção para novos Atlases — não como justificativa ou certificação

---

## SETORES — MAPA CORPORATIVO

### v1.0 — Junho 2026 · *versão atual para todos os 4 setores*

- **Setor 01 — Mineração:** Vale, Anglogold, Kinross, CSN Mineração e outros
- **Setor 02 — Siderurgia e Metalurgia:** Gerdau, ArcelorMittal, CSN, Usiminas, Ternium e outros
- **Setor 03 — Petróleo, Gás e Petroquímica:** Petrobras, Braskem, Vibra, Copersucar e outros
- **Setor 04 — Papel, Celulose e Embalagens:** Suzano, Klabin, Eldorado, CMPC e outros

Metodologia: pesquisa em camadas — site institucional, releases, parceiros SENAI/IFs, LinkedIn.
Foco em programas abertos à comunidade, gratuitos ou de baixo custo.

---

## DOCUMENTOS DE INTEGRAÇÃO

### Tabela de Complementaridade Atlas × Guia v1.0 — Junho 2026 · *novo*

- Parte 1: fontes presentes no Guia ausentes no Atlas (26 fontes mapeadas com impacto)
- Parte 2: recursos do Atlas ausentes no Guia (15 sugestões de fichas a desenvolver)
- Parte 3: sobreposições consistentes (validação cruzada)
- Parte 4: análise estratégica da interdependência dos dois documentos
- Parte 5: recomendações operacionais — formato de fichas, Bloco EDU, texto de prova de conceito

### Integração do Sistema v1.0 — Junho 2026

- Diagrama de camadas do sistema (CNCT → Atlas → Guia)
- Mapa de expansão: como o sistema escala para outras especializações
- Argumentário completo para uso institucional

---

---


## PORTAL INDÚSTRIAEDU

### v3.0 — 12 Jun 2026 09h58 · *versão atual*
**Migração para JSONs externos + 6 trilhas implementadas**

- Dados migrados de objetos JS inline para `social.json`, `technical.json`, `trails.json`, `vocab.json`
- Arquitetura DataContext + hook `useData()` — sem prop drilling
- 6 trilhas de formação conectando camada social e técnica
- 90 fontes (35 social · 55 técnica; t28 descartado — Hytron sem EAD)
- `portal/_README.md` como documento de retomada de sessão autossuficiente

### v2.2 — 12 Jun 2026
- +15 entradas sociais (s21–s35) · Ciclo Imediato t26+t27 · 3 URLs verificadas · 90 fontes

### v2.0 — 12 Jun 2026
- +28 entradas técnicas via Atlas FATO · filtro CNCT · 73 fontes

### v1.0 — 12 Jun 2026 · *versão fundação*
- 45 fontes · mapeamento manual + Guia v6.0 · interface React com filtros básicos

---

## SESSÃO DE MERGE — Junho 2026 (sistema v3.0)

### Merge ZIP1 × ZIP2 — Junho 2026

**Consolidação dos dois repositórios paralelos via diff sistemático**

- ZIP1 (continuação v2.0): 7 Atlas v1.1 · Guia v6.0 superset · DECISIONS D1–D9 · gaps v3.2
- ZIP2 (repositório estrutural): Índice v4.0 · 4 setores · histórico guias v3–v5.2 · SUMARIO_EXECUTIVO

Decisões de merge:
- Guia v6.0 canônico: ZIP1 (+514 linhas vs ZIP2; roadmap de trabalho v5.0 corretamente ausente)
- Atlas: todos do ZIP1 (7 × v1.1); encoding mojibake em atlas_petroquimica_v1_1 corrigido (D11)
- Índice: ZIP2 v4.0, atualizado `depende_de` → guia_v6_0 + atlas_petroquimica_v1_1 (D12)
- Setores: ZIP2 — todos os 4 presentes; SE-01 fechado (D13)
- _DECISIONS.md: ZIP1 superset D1–D9, acrescido D10–D13

---

## ATLAS DE TRILHAS — Sessão paralela (Junho 2026)

### Atlas de Segurança Industrial v1.1
- 4 séries · 11 trilhas · 1 PE · âncora CNCT #25

### Atlas de Eletrotécnica Industrial v1.1
- 4 séries · 10 trilhas · 1 PE · âncora CNCT #7

### Atlas de Mecatrônica Industrial v1.1
- 4 séries · 10 trilhas · 1 PE · âncora CNCT #1

### Atlas de Transição Energética v1.1
- 4 séries · 9 trilhas · 1 PE · âncora CNCT #17

### Atlas de Automação Industrial v1.1
- 4 séries · 9 trilhas · 1 PE · âncora CNCT #2 (não previsto no backlog — D8)

### Atlas de Petroquímica v1.0 → v1.1
- Atualização de referências: `depende_de` → guia_v6_0 + gicea_fundamentos_cnct
- Encoding mojibake corrigido nesta sessão (D11)

---

*Notas de Versão — Sistema FATO — Junho 2026*

---

## v3.9 — Junho 2026 — Fechamento Total do Backlog

**11 gaps fechados. Backlog zerado. 0 gaps ativos.**

### Fechamentos desta versão

| Gap | Artefato produzido/modificado |
|-----|------------------------------|
| C0-03 + SI-05 | `analises/analise_gap_cnct_i40_i50.md` (Análise P6, 9 seções) |
| C0-04 | `indice/iedu_cnct_fundamentos_v1.0.md` — 4 novos grupos (TI/Telecom, Qualidade, Biotecnologia) |
| C0-05 | `indice/indice_triangular_v4_1.md` — Seção 9: notas CBOs 311205 e 316325 |
| C0-06 | `indice/indice_triangular_v4_1.md` — `(inferidas)` nos perfis #4, #5, #16 |
| GI-02 | `indice/iedu_cnct_fundamentos_v1.0.md` — `## ELETROTÉCNICA INDUSTRIAL` padronizada |
| AT-05 | `atlas/atlas_mecatronica_industrial_v1_1.md` → v1.2 |
| AT-06 | `atlas/atlas_automacao_industrial_v1_1.md` → v1.2 (Série C: C1+C2) |
| AT-08 | `atlas/atlas_instrumentacao_industrial_v1_0.md` (novo) |
| AT-09 | `guia/guia_v6_3_completo.md` (Blocos 12-B + 12-C) + `atlas_transicao_energetica_v1_1.md` → v1.2 |
| SE-02 | `setores/*.md` (12 arquivos) — `codigos_guia` alinhado com 29 códigos Guia |

### Estado do sistema após v3.9

- **Atlas:** 9 publicados (Petroquímica, Soldagem, Segurança, Eletrotécnica, Mecatrônica, Transição Energética, Automação, Supply Chain, **Instrumentação**)
- **Guia:** v6.3 (33 blocos ativos, 29 códigos setoriais)
- **GICEA:** v3.9 (12 grupos, 32 perfis extraídos)
- **Índice Triangular:** v4.1 (c/ Seção 9 — notas de sobreposição CBO)
- **Análises:** 1 documento (Análise P6 — Gap CNCT × I4.0/I5.0)
- **Setores:** 12 arquivos (codigos_guia em todos)
- **Lacunas mapeadas (não críticas):** P6-01 a P6-06 (edge computing, digital twin, IA industrial, cobótica avançada, supply chain digital, 5G industrial)

---

## v4.0 — Junho 2026 — Auditoria de Infraestrutura e Portal IndústriaEDU

**Auditoria física do ZIP v3.9 · 10 novos gaps de infraestrutura · Portal v3.0 incorporado**

### Auditoria física (método: claim × conteúdo × localização × referências cruzadas)

- Conteúdo técnico (Atlas, Guia, Índice, GICEA, Setores) verificado e confirmado íntegro
- 10 novos gaps identificados — todos de infraestrutura e documentação, nenhum de conteúdo
- Backlog v4.0: 10 ativos (IN-03 a IN-11 + GU-14); 51 resolvidos acumulados

### Fechamentos desta versão

| Gap | Artefato produzido/modificado |
|-----|------------------------------|
| IN-03 | `_README.md` reescrito como v4.0 — estrutura plana, 9 Atlas, Portal, changelog completo |
| IN-08 | `_CHANGELOG.md` — GICEA corrigido de "10 grupos" para "12 grupos, 32 perfis" |
| IN-09 | `iedu_sumario_v2.0.md` reescrito como v2.0 — todos os números atualizados |
| IN-05 | `_DECISIONS.md` — D22 a D29 registradas (v6.3 canônico, in-place v1.2, convenção gicea_) |

### Portal IndústriaEDU incorporado como Produto 5

- **v1.0 (12/06):** 45 fontes · fundação com mapeamento + Guia v6.0
- **v2.0 (12/06):** 73 fontes · +28 técnicas via Atlas FATO · filtro CNCT · 2 setores novos
- **v2.2 (12/06):** 90 fontes · +15 social (s21–s35) · 3 URLs verificadas
- **v3.0 (12/06 09h58):** 90 fontes · dados migrados para JSONs externos · 6 trilhas · DataContext
- Próximos IDs: s36 (social) · t57 (técnica) · trilha_007
- Fases planejadas: Fase 2 (~115 fontes · 24 técnicas mapeadas) · Fase 3 (4 setores novos)

### Reestruturação do repositório

- Estrutura plana com prefixo `gicea_` substitui subpastas (`guia/`, `atlas/`, `indice/`, `setores/`)
- Arquivo mestre: `iedu_setores_v7.0.md` (12 setores · 112 empresas · 6 rodadas)
- Atlas consolidado: `iedu_atlas_v1.0.md` (9 Atlas em arquivo único)
- Guia consolidado: `iedu_guia_v6.3.md` (conteúdo v6.3 · YAML a corrigir — D22)
- DECISIONS D22–D29 registradas (ver _DECISIONS.md)

---

## v5.5 (portal) — Sprint 13 — Reconciliação `fato_v33.db` → `fato_v55.db` (20/06/2026)

**Diagnóstico: duas sessões paralelas (portal/Sprint 12 vs. dados/auditoria) geraram versões de banco incompatíveis sem se comunicarem — ver D62-DB/D63-DB em `_DECISIONS.md`.**

### Fechamentos desta sessão

| Item | Ação |
|---|---|
| `db.js` apontava para `fato_v33.db` (7 sprints desatualizado) | `DB_PATH` atualizado para `./dados/fato_v55.db` |
| `cnct_courses.micro_atlas_pdf` ausente no v55 (regressão da Sprint 12/EXP-07) | Coluna recriada e repopulada (78/99 cursos), casamento exato por `id` validado contra `fato_v33.db` |
| `cnct_course_atlas_trails` / `cnct_course_sources` removidas no v55 | Confirmado sem uso no `App.jsx` — nenhuma ação necessária |
| `search_idx` | Falso alarme de varredura inicial — é tabela virtual FTS5 criada em runtime pelo `App.jsx`, não depende do `.db` |

### Estado após esta sessão

- Portal roda sobre `fato_v55.db` (87 tabelas, incluindo as 35 novas `dm_*`/`cbo_canonical`/`normas_fato`/`sector_mapping`/`meta_protocolo`/`schema_metric_docs` da sessão de auditoria paralela)
- Feature EXP-07 (Micro-Atlas PDF) restaurada ao estado pós-Sprint 12: 65 cursos com link ativo no portal, 13 com PDF mas sem `profile_id` (pendência já registrada em `EXP-07` no `_BACKLOG.md`, inalterada)
- **Pendente, não feito nesta sessão:** as 35 tabelas novas do v55 não têm UI no `App.jsx` — ver item novo `SP-12` em `_BACKLOG.md`
