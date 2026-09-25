---
sistema: FATO
nome_publico: IndústriaEDU
data_criacao: 12/06/2026 23h59
ultima_revisao: 20/06/2026 (Sprint 14, D64-DB a D67-DB)
---

# _DECISIONS.md — Registro de Decisões Arquiteturais
## Guia Completo de Oportunidades Gratuitas — Petróleo, Gás e Petroquímica

---

## Sessão de decisões — Junho 2026 (v6.0)

| # | Decisão | Escolha | Justificativa |
|---|---|---|---|
| D1 | Bloco 12-B vs Bloco 20 (Eólica Offshore) | **Manter Bloco 20 autônomo** | Eólica Offshore é uma disciplina suficientemente distinta de H₂V/CCUS para merecer bloco próprio. Bloco 12-A permanece focado em energia e captura de carbono. |
| D2 | Numeração do Bloco EDU | **Manter como "BLOCO EDU" sem número** | O bloco é transversal — agnóstico ao tipo de indústria. Numerar implicaria posicionamento sequencial que contradiz sua natureza transversal. |
| D3 | Reforma do Bloco 14 | **Incluir na v6.0** | Bloco 14 reformado: mantém Refino, Petroquímica e Downstream. Movimentação de Cargas (Seção B) migrada para Bloco 5, conforme Proposta E do Relatório de Expansão v4.0. |
| D4 | Histórico de decisões | **_DECISIONS.md separado** | Arquivo dedicado para rastreabilidade de design sem poluir o guia de conteúdo. Decisões também registradas no Apêndice B do guia para leitores do documento final. |
| D5 | Formato de saída | **Sempre MD; PDF somente no final da produção** | Reduz ciclos de conversão durante edição. PDF é gerado apenas em marcos de release. |

---

## Decisões anteriores documentadas no Relatório de Expansão v4.0

| Proposta | Descrição | Status |
|---|---|---|
| A | Subdivisão do Bloco 1 → 1-A, 1-B, 1-C | ✅ Implementado (v5.0) |
| B | Subdivisão do Bloco 4 → 4-A, 4-B | ✅ Implementado (v5.0) |
| C | Subdivisão do Bloco 10 → 10-A, 10-B, 10-C | ✅ Implementado (v5.0) |
| D | Subdivisão do Bloco 12 → 12-A | ✅ Implementado (v5.1); 12-B rejeitado — substituído por Bloco 20 autônomo |
| E | Reforma do Bloco 14: separar Refino/Petroquímica de Movimentação de Cargas | ✅ Implementado (v6.0) |
| Novos Blocos 16–21 | Operação, Elétrica, Manutenção, Soldagem, Eólica, Completação | ✅ Implementado (v5.0 incompleto → v6.0 completo) |
| Bloco EDU | Educação e Qualificação como bloco transversal | ✅ Implementado (v5.x como Bloco 15 → v6.0 como BLOCO EDU transversal) |

---

## Convenções de nomenclatura adotadas na v6.0

- **Cabeçalho de bloco:** `# BLOCO N — Título`
- **Código de setor:** campo `Setor Industrial` em todas as fichas, usando códigos da Legenda (29 códigos em v6.0)
- **Bloco EDU:** nunca numerado; sempre referenciado como "BLOCO EDU"
- **Separadores `══`:** removidos (eram artefatos de trabalho, não conteúdo)
- **Seções "Empresas Removidas/Adicionadas":** removidas do guia principal; movidas para contexto do Apêndice B


---

## Decisões da Sessão — Junho 2026 (pacote v2.0)

### D6 — Todos os Atlas referenciam guia_v6_0 como base canônica
Os 5 Atlas produzidos pela sessão paralela foram entregues referenciando guia_v5_1 e indice_triangular_v2_0. Todos foram atualizados para guia_v6_0_completo.md + indice_triangular_v2_1.md. Padrão para futuros Atlas: referenciar sempre a versão mais recente do Guia no campo `depende_de`.

### D7 — Reconciliação obrigatória a cada nova versão do Guia
Identificados 25 fichas do guia_oportunidades_v5_0 e fichas_novas_guia_v5_0 não absorvidas pelo v6.0. Decisão: qualquer nova versão do Guia deve ser acompanhada de um relatório de reconciliação explícito (formato: reconciliacao_guia_vX_vY.md) antes de ser considerada canônica.

### D8 — Atlas de Automação Industrial como 7º Atlas (não previsto no backlog original)
A sessão paralela produziu um Atlas de Automação Industrial (CNCT #2) não listado no backlog v3.1. O atlas foi incorporado ao pacote. O backlog v3.2 não registra este como gap fechado pois não era gap listado — apenas um novo entregável adicionado.

### D9 — Numeração de Atlas é sequencial de produção, não de prioridade de backlog
Ordem de produção: Petroquímica (1º) · Soldagem (2º) · Segurança (3º) · Eletrotécnica (4º) · Mecatrônica (5º) · Transição Energética (6º) · Automação (7º). Esta numeração é registrada no campo "Caso de expansão" de cada Atlas e é definitiva.


---

## Decisões da Sessão — Junho 2026 (merge ZIP1×ZIP2)

### D10 — Merge ZIP1 (continuação v2.0) × ZIP2 (repositório estrutural) via diff
Dois pacotes distintos foram carregados em sessão de continuação:
- **ZIP1** (`sistema_fato_continuacao_jun2026_v2.zip`): pacote de continuação com 7 Atlas v1.1,
  guia v6.0 superset (355KB, +514 linhas vs ZIP2), DECISIONS D1–D9.
- **ZIP2** (`sistema_fato_v6_0.zip`): repositório estrutural com indice_triangular_v4.0,
  setores 01–04, histórico de guias v3–v5.2, gestão interna, SUMARIO_EXECUTIVO e NOTAS_DE_VERSAO.

Estratégia: ZIP2 como base estrutural (pastas + arquivos exclusivos), ZIP1 como patch de conteúdo
(Guia canônico, 7 Atlas, DECISIONS superset, README v2.0). Nenhum arquivo canônico foi perdido.

Artefato de trabalho removido: roadmap de implementação v5.0 (66 linhas em ZIP2/guia_v6_0)
estava como vazamento editorial — ausente no ZIP1 (já havia sido removido corretamente).

### D11 — Encoding mojibake em atlas_petroquimica_v1_1.md corrigido
O arquivo estava com double-UTF8 (conteúdo UTF-8 re-salvo como latin1 e re-encodado em UTF-8).
Corrigido via round-trip: `decode('utf-8', surrogateescape) → encode('latin-1') → decode('utf-8')`.
O arquivo corrigido é o canônico. Versão problemática descartada.

### D12 — indice_triangular_v4.md: depende_de atualizado para v6.0
O Índice v4.0 do ZIP2 referenciava `guia_v5_2_completo.md` e `atlas_petroquimica_v1_0.md`.
Atualizado para `guia_v6_0_completo.md` e `atlas_petroquimica_v1_1.md` no merge.
O Índice v4.0 é o canônico e supersede o alvo SI-02 (v2.2) — mas não cobre os 5 Atlas novos
(gap SI-03 aberto: Índice v4.0 → v4.1).

### D13 — SE-01 fechado por descoberta no ZIP2
Setores 02 (Siderurgia) e 03 (Petróleo, Gás e Petroquímica) v1.0 existiam no ZIP2.
Não eram gaps de produção — eram gaps de sincronização entre pacotes. Incorporados ao merge.


---

## Decisões da Auditoria Sistêmica — Junho 2026

### D14 — Auditoria confirma: "fichas sem link" eram falsos positivos
`### Adições v5.2` são marcadores editoriais de agrupamento, não fichas de recurso.
`BLOCO EDU` usa `**Acesso:**` intencionalmente (fontes institucionais, não portais de treinamento).
Resultado: zero fichas fora do padrão. GU-URL-01 e GU-SET-01 descartados como gaps.

### D15 — AT-REF-01: corrigido in-place, não como novo release
6 Atlas apontavam para `indice_triangular_v2_1.md` (inexistente). Corrigido diretamente nos
arquivos de atlas para `indice_triangular_v4.md`. Não houve bump de versão nos Atlas porque
a mudança é apenas no campo de metadado `depende_de` — sem alteração de conteúdo de trilhas.

### D16 — GICEA atualizado para v2.0: status de produção corrigido in-place
5 Atlas promovidos de Próximo/Planejado para Existente no GICEA. Eletrotécnica (`## TÉCNICO EM
ELETROTÉCNICA`) teve status corrigido mas manteve o cabeçalho original — pendência registrada
como GI-02 para padronização. GICEA bumped para v2.0.


---

## Decisões da integração ZIP3 (petroquimica_ead) — Junho 2026

### D17 — GU-03, AT-04, REC-01 fechados por arquivos encontrados em ZIP3
Os 3 gaps mais críticos do sistema tinham arquivos prontos no repositório `petroquimica_ead.zip`.
Incorporados diretamente ao merged sem edição de conteúdo. `atlas_supply_chain_v1_0.md` teve
`depende_de` corrigido in-place (guia_v5_1 → guia_v6_0; indice_v2_0 → indice_v4).

### D18 — SE-02 fechado numericamente: 12 setores mapeados
Setores 05–12 (Química, Máquinas, Transporte, Alimentos, Construção, Têxtil, Montagem, Gráfica)
incorporados do ZIP3. O campo `Setor Industrial` nos setores é questão separada (ver GU-05).
setor_12 não tinha sufixo `_v1_0` no ZIP3 — renomeado para `setor_12_papel_embalagem_grafica_v1_0.md`.

### D19 — Gaps C0-02, C0-03, SI-04, SI-05 abertos via auditoria interna do ZIP3
`auditoria_gaps_sistema.md` continha 23 gaps formalizados, 7 novos. Os 4 sistêmicos mais
relevantes foram absorvidos no backlog v3.5. Gaps A3/A4/B1–B8/C1–C8/D1–D4 já cobertas por
decisões anteriores ou pelo conteúdo integrado (ex. B1=AT-04, C4=GU-03 — fechados).


### D20 — Guia v6.1 gerado: patch REC-01 aplicado sobre v6.0
`guia_patch_v6_1_rec01.md` aplicado sobre `guia_v6_0_completo.md` via inserção bloco-a-bloco.
25 fichas inseridas em 12 blocos. Estratégia: conteúdo de cada bloco do patch appended ao
bloco correspondente no guia, precedido de marcador `### Adições do patch v6.1`.
Resultado: `guia_v6_1_completo.md` — 5466 linhas · +529 vs v6.0 · 315 cabeçalhos `###`.
Guia v6.1 é agora o canônico. v6.0 mantido para rastreabilidade histórica.
Próximo: integrar `bloco_log_supply_chain_v1_0.md` (GU-03) → v6.2.


### D21 — Guia v6.2: BLOCO LOG integrado após BLOCO 11, antes de BLOCO 12-A
`bloco_log_supply_chain_v1_0.md` inserido no fluxo do Guia. Posição: após BLOCO 11
(Supply Chain/GES) e antes de BLOCO 12-A (Transição Energética) — coerente com
`integra_com: Bloco 3, Bloco 11, Bloco 18`. Cabeçalho YAML do arquivo-fonte removido
antes da inserção; nota de criação GU-03 preservada no corpo. v6.2: 30 blocos · 5861 linhas.


---

## Decisões da Sessão — Junho 2026 (v3.4–v3.9 · auditoria e expansão final)

### D22 — Guia v6.3 como canônico; v6.2 não arquivado como arquivo separado
Os Blocos 12-B (Solar FV / Eólica Onshore) e 12-C (Carbono / ESG / Armazenamento) foram
adicionados diretamente sobre o v6.2 gerando o v6.3. O arquivo `guia_v6_2_completo.md`
nunca foi salvo como snapshot separado — o v6.3 acumula o v6.2 + AT-09.
O arquivo de distribuição recebeu o nome `iedu_guia_v6.3.md` por convenção de
sprint, mas o YAML interno correto é `versao: 6.3`. Não existe conteúdo v6.4 distinto.
**Canônico:** `iedu_guia_v6.3.md` (YAML a corrigir para `versao: 6.3`).

### D23 — Atlas v1.2 são atualizações in-place dos arquivos v1.1 — nome de arquivo não reflete versão interna
Os Atlas de Mecatrônica Industrial, Automação Industrial e Transição Energética receberam
conteúdo v1.2 (Série C — Cibersegurança OT; Série G/H — expansão de trilhas; Robótica R1)
sem renomear os arquivos de `_v1_1.md` para `_v1_2.md`. Decisão retroativa: o padrão
adotado é update in-place — o nome de arquivo representa a linha de produto, não a revisão.
A versão interna (YAML `versao:`) é a referência canônica de revisão.

### D24 — Atlas Instrumentação Industrial como 9º Atlas (não estava no backlog original)
Análogo ao D8 (Automação como 7º Atlas). O Atlas de Instrumentação Industrial v1.0
(CNCT #2/#7 · 5 séries · 7 trilhas) foi produzido na sessão v3.8 como entregável adicional,
não como fechamento de gap listado. Incorporado ao sistema sem reabrir o backlog.
Numeração: 9º na ordem de produção.

### D25 — Índice Triangular v4.1 como canônico (supersede v4.0)
Produzido na sessão v3.6 ao fechar SI-03 e SI-04. Adições: cobertura dos 8 Atlas (5 novos +
Supply Chain), perfis #27–#30 na Seção 3 (entradas setoriais) e Seção 9 (notas de
disambiguação CBOs 311205 e 316325). O arquivo `iedu_indice_v4.1.md` é o canônico.
`indice_triangular_v4.md` (sem sufixo) é histórico.

### D26 — Auditoria física como metodologia de fechamento de fase
A sessão v4.0 estabeleceu a prática de auditar fisicamente o ZIP do sistema ao declarar
backlog zerado — verificando claim × conteúdo × localização × referências cruzadas arquivo
a arquivo. O documento `_BACKLOG.md` registra a metodologia e os resultados.
Prática a repetir a cada declaração de "backlog zerado" em fases futuras.

### D27 — Análise P6 como camada analítica do sistema (não produto operacional)
O documento `analises/analise_gap_cnct_i40_i50.md` (P6-01 a P6-06) não é um produto
que o sistema entrega — é um mapeamento estratégico de competências emergentes de I4.0/I5.0
ausentes nos perfis CNCT vigentes. Os gaps P6-xx dependem de articulação com MEC/SETEC
para atualização dos perfis; não são produção autônoma de Atlas ou fichas de Guia.

### D28 — Portal IndústriaEDU como Produto 5 do sistema
O Portal (`portal/`) é a interface pública do ecossistema FATO: uma aplicação React com
dados em JSONs externos (social.json · technical.json · trails.json · vocab.json) que torna
o sistema navegável sem acesso aos documentos internos. Arquitetura DataContext sem prop
drilling; transpilação Babel CDN (sem Vite/webpack — MVP). O Portal tem README próprio como
documento de retomada de sessão. Decisão de escopo: dados ficam nos JSONs, código no App.jsx.

### D29 — Convenção de nomeação gicea_ para arquivos consolidados
A partir da sessão de consolidação (v4.0), arquivos que agregam múltiplos produtos ou versões
recebem o prefixo `gicea_` e residem na raiz do ZIP (estrutura plana), substituindo a
organização em subpastas (`guia/`, `atlas/`, `indice/`, `setores/`). Arquivos individuais
históricos (guia_v3–v6.1, atlas individuais) não são incluídos no ZIP de distribuição —
existem em sessões históricas anteriores. O arquivo mestre é `iedu_setores_v7.0.md`.


---

### D30 — Pivô estratégico: documentos MD → base de dados + site web
- **Data:** 12/06/2026
- **De:** sistema de documentos MD estáticos (FATO)
- **Para:** base de dados estruturada + site web público (IndústriaEDU)
- **Política de dados:** EAD gratuito é camada primária (`data_layer: primary`); presencial e pago são complementares (`data_layer: supplementary`) com `free: false` e `format` explícito
- **Implicação:** todos os schemas devem suportar `free`, `format`, `cost_range` (opcional), `data_layer` desde já

### D31 — Nome público: IndústriaEDU / codinome interno: FATO
- **Data:** 12/06/2026
- **IndústriaEDU:** nome público — site, app, dados, domínio, repositório Git
- **FATO** (Formação Aberta em Tecnologia e Operações): codinome interno do projeto/sistema de conhecimento
- Os dois coexistem com papéis distintos e não são intercambiáveis nos documentos

### D32 — Convenção de nomenclatura de arquivos: prefixo `iedu_`
- **Data:** 12/06/2026
- **Prefixo `iedu_`** para todos os arquivos de produto e conteúdo
- **Prefixo `_`** (underscore) para meta do repositório: `_DECISIONS.md`, `_README.md`, `_CHANGELOG.md`, `_BACKLOG.md`
- **Versão sempre no nome do arquivo** (`_vN.N`), nunca só no YAML; YAML deve espelhar o nome
- **Sem `_consolidado`, `_mestre`, `_completo`** como qualificadores — o subtipo no nome já identifica
- Supersede D29 (convenção `gicea_`) para todos os arquivos renomeados e novos

### D33 — Formato de data e timestamp: `DD/MM/YYYY HHhMM`
- **Data:** 12/06/2026
- Campo `data_criacao` e `ultima_revisao` no YAML de todo arquivo de produto (obrigatório)
- Rodapé `*Última revisão: DD/MM/YYYY HHhMM*` em todo arquivo de produto (obrigatório)
- `"Junho 2026"` não é mais formato válido em nenhum documento
- Referência de formato: `portal/README.md` v3.0 · 12/06 09h58


---

## Decisões do Sprint 2 — Junho 2026

### D34 — Substituição da lista hardcoded de `newIds` pelo campo `batch`
- **Data:** 13/06/2026
- **Contexto:** A lógica anterior usava uma lista fixa de 40 IDs no `App.jsx` (linha ~545) para determinar quais fontes recebiam o badge 🆕. Isso criava acoplamento entre código e dados — adicionar novos lotes exigia editar o componente.
- **Decisão:** O badge 🆕 passa a ser controlado pelo campo `batch` nos JSONs. Qualquer entrada com `batch` preenchido (não nulo, não vazio) recebe o badge automaticamente. A lista hardcoded foi removida do `App.jsx`.
- **Mapeamento de lotes implementados:**
  - `"social_001"` → s21–s35 (Lote Social 001)
  - `"fato_002"` → t29–t56 (Lote FATO 002)
  - `"ciclo_imediato"` → t26–t27 (fontes do Ciclo Imediato)
- **Efeito colateral positivo:** O campo `batch` é aditivo e rastreável — o histórico de lotes fica nos dados, não no código.
- **Nota:** Uma fonte pode ter `verified: false` e nenhum `batch` (badge ⚠️ sem 🆕), ou ter `batch` e `verified: true` (badge 🆕 sem ⚠️). Os dois badges são independentes.

### D35 — Introdução do campo `data_layer` e toggle "Apenas gratuitos"
- **Data:** 13/06/2026
- **Contexto:** O portal foi projetado desde D30 para suportar fontes pagas/presenciais como camada complementar. A ausência de um mecanismo de separação impediria adicionar tais fontes sem poluir a experiência atual (100% gratuita).
- **Decisão:** Campo `data_layer` adicionado a todas as entradas:
  - `"primary"` — gratuito, camada padrão (todos os 90 registros atuais)
  - `"paid"` — pago (reservado para uso futuro)
  - `"hybrid"` — parte gratuita, parte paga (reservado)
- No `App.jsx`, um novo estado `dataLayer` (padrão `"free"`) e um toggle "Apenas gratuitos" foram adicionados à barra de filtros do `ViewExplore`. Quando ativo (padrão), o filtro exclui qualquer entrada com `data_layer !== "primary"`.
- **Impacto atual:** Zero — todas as fontes têm `data_layer: "primary"`, portanto nenhuma fonte é ocultada. O toggle existe para quando fontes pagas forem inseridas.
- **Próximo passo:** Ao inserir a primeira fonte paga, definir `data_layer: "paid"` e garantir que o toggle funciona como esperado.

### D36 — Inclusão de `cost_range` e `cost_note` para fontes pagas futuras
- **Data:** 13/06/2026
- **Contexto:** Fontes pagas precisarão de um campo de custo visível no card de detalhes para que o usuário possa avaliar o investimento sem sair do portal.
- **Decisão:** Dois campos opcionais adicionados a todas as entradas (atualmente `null`):
  - `cost_range` — string descritiva do custo (ex: `"R$ 49/mês"`, `"R$ 890 · único"`)
  - `cost_note` — observação complementar (ex: `"bolsa disponível"`, `"gratuito para PCD"`)
- No `SourceCard`, um bloco condicional exibe 💰 + `cost_range` (+ `cost_note` entre parênteses) na seção expandida, **apenas quando `cost_range` for não nulo**. Fontes atuais não exibem nada.
- **Impacto atual:** Zero — campo é `null` em todos os registros. A lógica de exibição está pronta mas inativa.


---

## Decisões do Sprint 3 — Junho 2026

### D37 — Novos JSONs de conhecimento estruturado como camada independente
- **Data:** 13/06/2026
- **Decisão:** Três novos arquivos JSON adicionados à pasta `dados/`: `iedu_profiles.json` (30 perfis CNCT), `iedu_guide_blocks.json` (29 blocos do Guia), `iedu_atlas_trails.json` (128 trilhas dos 9 Atlas). Cada arquivo é carregado via `fetch` diretamente pelos componentes que os consomem — não entram no ciclo de carregamento principal e não ampliam o `DataContext` de forma acoplada.
- **Fonte dos dados:** Extraídos por parser Python a partir de `iedu_indice_v4.1.md`, `iedu_guia_v6.3.md` e `iedu_atlas_v1.0.md`. Extração reproduzível — qualquer atualização nos MDs pode regenerar os JSONs com o mesmo script.
- **Exceção documentada:** Perfil #30 (Técnico em Biocombustíveis) não tem CBO atribuído no CNCT 3ª Ed. O campo `cbo_list` é `[]` e o fato está documentado no próprio MD fonte. Referência provável: `311105`.
- **Contagem de trilhas:** 128 trilhas extraídas (vs. estimativa inicial de 135). A diferença decorre de headers PE-N em alguns Atlas e de contagem inicial baseada em padrão mais amplo. A contagem de 128 reflete os headers `### CODE · Title` efetivamente presentes no documento.

### D38 — ViewProfiles e ViewGuideBlocks como abas de nível superior na nav
- **Data:** 13/06/2026
- **Decisão:** Duas novas abas adicionadas ao `Nav` principal: "Perfis CNCT" (entre "Trilhas" e "Sobre") e "Guia". A navegação passa de 4 para 6 abas. O portal v3.1 tem: Início · Explorar · Trilhas · Perfis CNCT · Guia · Sobre.
- **Alternativa rejeitada:** Integrar como seções da página "Sobre" — rejeitada por reduzir a descobribilidade das duas camadas de conhecimento mais ricas do sistema.
- **Componentes:** `ViewProfiles` (lista filtrada por tier + detalhe de perfil + painel de trilha) e `ViewGuideBlocks` (lista de 29 blocos + detalhe com fontes associadas). Ambos são autocontidos com estados locais (`useState`).
- **`TierBadge`:** Novo mini-componente com cores semânticas: T1 verde (#10b981), T2 azul (#3b82f6), T3 âmbar (#f59e0b), T4 roxo (#8b5cf6).

### D39 — Campo `atlas_trails` adicionado a `technical.json`
- **Data:** 13/06/2026
- **Decisão:** Campo `atlas_trails` (array de strings com códigos de trilha do Atlas) adicionado a todas as 55 entradas de `technical.json`. Populado automaticamente via mapeamento `bloco → atlas_slug`: 51 de 55 entries receberam trilhas; 4 entries com blocos sem mapeamento claro receberam `[]`.
- **Limitação:** O mapeamento é por bloco/setor, não por fonte individual. Fontes dentro de um mesmo bloco recebem as mesmas trilhas de entrada. Refinamento por fonte individual é uma tarefa de Sprint 4+.
- **Uso:** O painel de detalhe de trilha em `ViewProfiles` consulta `technical.filter(s => s.atlas_trails.includes(code))` para exibir fontes relacionadas.

### D40 — ViewAtlasTrails integrada como painel dentro de ViewProfiles
- **Data:** 13/06/2026
- **Decisão:** Não foi criada uma aba separada "Atlas Trails". Em vez disso, ao clicar em um badge de trilha no detalhe de um perfil CNCT, o componente `ViewProfiles` renderiza um painel de detalhe da trilha (código, nome, Atlas de origem, descrição, perfis associados, fontes associadas). O botão "← Voltar ao perfil" retorna ao detalhe do perfil.
- **Justificativa:** A trilha é sempre acessada no contexto de um perfil CNCT — a navegação Perfil → Trilha → Fontes reflete o fluxo natural do usuário. Uma aba separada criaria um ponto de entrada sem contexto.


---

## Decisões do Sprint 4 — Junho 2026

### D41 — `iedu_complementarity.json` com estrutura tri-partida + recomendações
- **Data:** 13/06/2026
- **Decisão:** 81 entradas em 4 tipos: `guia_sem_atlas` (26), `atlas_sem_guia` (15), `sobreposicao` (8), `recomendacao` (32). Campo `type` como discriminador. Campo `impacto` normalizado para Muito alto/Alto/Médio/Baixo para permitir filtro na ViewGaps.
- **Fonte:** `iedu_complementaridade_v1.0.md` — Partes 1, 2, 3 e 5 parseadas via Python. Parte 4 (narrativa estratégica) não foi extraída por ser texto corrido sem estrutura tabular.

### D42 — `iedu_sectors.json` com deduplicação em duas camadas
- **Data:** 13/06/2026
- **Decisão:** 1054 entradas brutas → 634 após deduplicação. Camada 1: remover empresas já em `technical.json` (5 removidas por slug de empresa). Camada 2: remover entradas sem programa (236) e duplicatas internas cross-rodada (179). 114 empresas únicas · 151 programas gratuitos · 12 setores. Campo `source_doc: "iedu_setores_v7.0.md"` para rastreabilidade.

### D43 — `globalQ` como estado local no `App`, não no DataContext
- **Data:** 13/06/2026
- **Decisão:** Estado `globalQ` declarado no componente `App` e passado por prop. Não entra no DataContext para evitar re-render em cascata de todos os consumidores a cada keystroke. Implementação completa da busca global (C1) postergada para Sprint 5 — a estrutura de estado está no lugar.

### D44 — ViewGaps como view de diagnóstico sistêmico com navegação para trilhas
- **Data:** 13/06/2026
- **Decisão:** ViewGaps implementada com 3 tabs (Guia→Atlas, Atlas→Guia, Sobreposição) + filtro por nível de impacto. Trail codes clicáveis abrem painel de detalhe da trilha. A view mostra o estado do sistema FATO — não adiciona fontes automaticamente ao portal.

### D45 — UC1–UC17 adicionadas ao `iedu_atlas_trails.json` como série UC do Atlas I
- **Data:** 13/06/2026
- **Decisão:** 17 Unidades Curriculares do Atlas I (UC1–UC17) foram adicionadas ao `iedu_atlas_trails.json` como série `UC`, atlas `I`. Total: 145 trilhas. A diferença entre 128 (Sprint 3) e 135 (estimativa inicial) era explicada por headers de seção (`### Séries e Trilhas`) que não são trilhas — as 7 reais faltantes eram as UCs UC1–UC7 referenciadas na tabela de complementaridade mas não capturadas pelo parser original.


### D46 — Remoção de `portal_industria_edu.html` e deprecação do DOCX v2.2
- **Data:** 13/06/2026
- **Contexto:** Auditoria completa dos 33 arquivos do repositório identificou dois artefatos desatualizados: (1) `portal_industria_edu.html` — standalone com 4 tabs e dados embutidos, congelado na v3.0; (2) `documentacao_portal_industrial_edu_COMPLETA.docx` — documentação v2.2, pré-Sprint 2.
- **Decisão HTML:** Remover. O produto principal é `App.jsx` + JSONs externos. A versão standalone exigiria manutenção paralela de 9 JSONs inline e 8 views — custo desproporcionalmente alto para um artefato de demo.
- **Decisão DOCX:** Deprecar com sidecar `.DEPRECADO.md`. Mantido como referência histórica da fase v1.0–v2.2 (raciocínio de fundação do sistema). Substituído por `_SCHEMA.md`, `portal/README.md` e `_CHANGELOG.md` como documentação canônica.
- **Efeito:** SP-01 fechado. Repositório reduzido de 33 para 30 arquivos ativos (+1 sidecar). vocab.json corrigido (sectors_tech estava vazio) e marcado como referência estática.


---

## Decisões do Sprint 5 — Junho 2026

### D47 — Renomeação `portal_v3/` → `portal/` e criação de `histórico/`
- **Data:** 14/06/2026
- **Contexto:** A pasta `portal_v3/` com sufixo de versão cria fricção de referência em todos os docs — strings como `portal_v3/App.jsx` nos documentos raiz têm que ser atualizadas manualmente a cada sprint.
- **Decisão:** Pasta renomeada para `portal/` (nome estável, sem versão). Subpasta `portal/histórico/` criada para acolher artefatos legados arquivados neste sprint (DOCX v2.2, README v3 original, complementaridade v1.0, sidecar DEPRECADO). Total de arquivos ativos no portal: 3 (`App.jsx`, `README.md`, `dados/` com 9 JSONs).
- **Efeito:** 18 referências `portal_v3/` substituídas por `portal/` em `_README.md`, `_SCHEMA.md`, `_DECISIONS.md`, `_CHANGELOG.md` e `portal/README.md`. Próximos sprints usam `portal/` como caminho canônico.

### D48 — Campo `cnct_hint` derivado automaticamente em `technical.json`
- **Data:** 14/06/2026
- **Contexto:** A conexão entre fontes técnicas e perfis CNCT existia apenas via campo `cnct` (texto livre) — não havia um identificador estruturado que permitisse filtro ou badge programático.
- **Decisão:** Campo `cnct_hint` (string `"T{tier}-{id:02d}"` ou `null`) adicionado a todas as 55 entradas de `technical.json`. Derivado via script Python: para cada fonte, cruza `atlas_trails` com o campo `profiles` de `iedu_atlas_trails.json`, conta co-ocorrências de `profile_id` e seleciona o perfil com maior frequência. Empate resolvido por primeira ocorrência em `Counter.most_common()`.
- **Resultado:** 51 de 55 fontes com `cnct_hint` derivado; 4 com `null` (entradas sem `atlas_trails`). Documentado em `_SCHEMA.md` como campo Sprint 5.
- **Nota de design:** `cnct_hint` é um *hint* — orientação de perfil mais provável, não vinculação exclusiva. Fontes podem mapear para múltiplos perfis; o badge exibe o mais forte.

### D49 — Enriquecimento de `iedu_profiles.json` com 4 campos derivados
- **Data:** 14/06/2026
- **Decisão:** Quatro campos derivados adicionados a todos os 30 perfis CNCT:
  - `cnct_code` — identificador estruturado `"T{tier}-{id:02d}"` (ex: `"T1-01"`) para referenciar o perfil de forma programática
  - `trail_count` — contagem de trilhas em `trails_atlas` (útil para ordenação e exibição)
  - `sector_count` — contagem de setores em `sectors_guia`
  - `cnct_slug` — slug URL-friendly do nome (para roteamento futuro e exportação)
- **Método:** Script Python com normalização ASCII de acentos. Geração idempotente — pode ser re-executada sem efeitos colaterais (sobrescreve com os mesmos valores).

### D50 — Backfill de `source_doc` e `verified` em `social.json` s01–s20
- **Data:** 14/06/2026
- **Contexto:** O campo `source_doc` foi definido no Sprint 2 e aplicado a s21–s35. As entradas s01–s20 (criadas no Sprint 1) ficaram sem o campo — inconsistência silenciosa que afetava o badge de origem no `SourceCard`.
- **Decisão:** Backfill com `"source_doc": "mapeamento"` e `"verified": false` em todas as 20 entradas. Valores consistentes com s21–s35 (mesma origem: levantamento manual v1.0). Após o backfill, 100% das 90 fontes têm ambos os campos.

### D51 — SP-02: busca global implementada via prop drilling (D43 concluído)
- **Data:** 14/06/2026
- **Contexto:** D43 declarou `globalQ` no `App` mas postergou o wiring para Sprint 5.
- **Decisão:** Prop drilling completo implementado:
  1. `Nav` recebe `globalQ` e `setGlobalQ`; renderiza um `<input>` de busca rápida (150px, estilo dark) à direita da barra de navegação
  2. Ao digitar, `setGlobalQ` é chamado e, se o valor for não-vazio, `setView("explore")` redireciona automaticamente para a aba Explorar
  3. `ViewExplore` recebe `globalQ` como prop (padrão `""`) e sincroniza via `useEffect([globalQ])` → `setQ(globalQ)`
  4. Botão `✕` inline limpa `globalQ` no `App` e cancela a sincronização
- **Escopo:** A busca do Nav controla apenas a entrada da ViewExplore; os outros filtros (camada, setor, formato) permanecem no estado local de `ViewExplore`.

### D52 — SP-03: badge `cnct_hint` no `SourceCard` (cabeçalho do card)
- **Data:** 14/06/2026
- **Decisão:** Badge `CNCT {cnct_hint}` adicionado ao bloco de títulos do `SourceCard`, após o badge `Atlas FATO` e antes do `⚠️`. Estilo: pill indigo `#1e1b4b / #818cf8` (diferente do green do campo `cnct` para distinguir hint derivado de metadado manual). Tooltip: `"Perfil CNCT: {cnct_hint}"` via `title`. Visível no modo compacto e no expandido. Condição: `s.cnct_hint` truthy — exibido apenas nas 51 fontes técnicas que têm o campo derivado (D48).

### D53-DB — Atlas II (Soldagem e Metalurgia): índice cruzado como representação canônica
- **Data:** 16/06/2026
- **Contexto:** O Atlas II não tem seção "PARTE 3 — Núcleo Curricular" (DA-01 do `PLANO_MIGRACAO_v4.md`). Em vez disso, tem um Índice Cruzado por trilha, já extraído para `atlas_trail_cbos` (22 linhas) e `atlas_trail_normas` (26 linhas).
- **Decisão:** Opção A — adotar `atlas_trail_cbos` + `atlas_trail_normas` como representação canônica do Atlas II. O drawer de trilha (EXP-06A, Sprint 8) exibirá CBOs e normas no lugar de módulos para as trilhas do Atlas II. Núcleos sintéticos (Opção B) descartados — menos fiel ao documento-fonte.
- **Efeito imediato (Sprint 6, M-07):** `atlasTrails` carregado do banco já inclui os campos `cbos` e `normas` por trilha, prontos para consumo na Sprint 8.

### D54-DB — `trails` customizadas: mantidas sem expansão
- **Data:** 16/06/2026
- **Contexto:** 6 trilhas com 27 passos e 42 source links existem em paralelo às 145 `atlas_trails`. `profile_atlas_trails` (128) confirmado como subconjunto de `atlas_trail_profiles` (263) — depreciação segura, sem perda de dados.
- **Decisão:** Opção C — expandir como produto distinto dos Atlas, em sprint dedicada fora do roadmap atual. M-04 (Sprint 6) **não foi simplificado nem removido**: continua carregando `trails` + `trail_steps` + `trail_step_sources` do banco, exatamente no escopo atual (6 trilhas).
- **Efeito:** `DB-M08` (Sprint 9) permanece bloqueado por esta decisão até a sprint dedicada ser priorizada.

### D55 — `fato_v20.db` como fonte canônica do portal
- **Data:** 16/06/2026
- **Decisão:** A partir da Sprint 6, `fato_v20.db` substitui os 9 JSONs estáticos como fonte de dados do portal. Os JSONs deixam de ser a fonte de verdade.

### D56 — sql.js (WASM) como arquitetura de integração, sem backend
- **Data:** 16/06/2026
- **Decisão:** O portal continua 100% estático. `fato_v20.db` é carregado no navegador via `sql.js` (WebAssembly, CDN cdnjs), sem servidor de aplicação. Mantém a filosofia "sem tocar no código para adicionar fontes" — agora trocada por "sem backend para servir dados".

### D57 — JSONs movidos para `portal/histórico/`, não excluídos
- **Data:** 16/06/2026
- **Decisão:** Os 9 JSONs (`social.json`, `technical.json`, `trails.json`, `iedu_profiles.json`, `iedu_guide_blocks.json`, `iedu_atlas_trails.json`, `iedu_complementarity.json`, `iedu_sectors.json`, `vocab.json`) foram movidos para `portal/histórico/` (M-13) como registro histórico e fallback de auditoria, não excluídos.

### D58 — Lazy loading para as camadas `sector` e `guia`
- **Data:** 16/06/2026
- **Contexto:** `fato_v20.db` tem 2,7 MB; `sector` (455 fontes) e `guia` (415 fontes) juntas são ~87% dos `sources`, mas `sector` só é consumida na aba Setores e `guia` ainda não tem aba dedicada (EXP-01, Sprint 7).
- **Decisão:** Carregamento eager (M-01) cobre `social`, `technical`, `trails`, `profiles`, `guideBlocks`, `atlasTrails`, `complementarity`, `tagColors`, `formatMeta`. `sector` é materializado no primeiro mount de `ViewSectors` (via `ensureSectorsLoaded()`); `guia` fica disponível via `ensureGuiaLoaded()` para a futura `ViewGuia`.

### D61 — `TAG_COLORS` e `FORMAT_META` eliminados do `App.jsx`
- **Data:** 16/06/2026
- **Contexto:** `TAG_COLORS` (35 entradas) e `FORMAT_META` (3 entradas) eram constantes hardcoded no módulo, desconectadas do banco — qualquer tag nova exigia editar o código-fonte.
- **Decisão:** Ambas removidas. `Tag` e `SourceCard` agora consultam `useData().tagColors` (derivado de `tags` + `tag_meta`, M-10) e `useData().formatMeta` (derivado de `format_meta`). Tags sem entrada em `tag_meta` (549 de 587, ver `DB-01`/Sprint 9) caem no fallback cinza `#64748b`, preservando o comportamento visual anterior.

### Execução das ações PRÉ-Sprint 6 (16/06/2026)
- **PRÉ-6B:** SQL aplicado. Resultado real: **+105** vínculos em `guia_source_profiles` para fichas `g0242`–`g0415` (não ~505 como estimado no `PLANO_MIGRACAO_v4.md` — a estimativa original não filtrava por prefixo `g`, incluindo entradas de `source_sector_codes` da camada `sector`, prefixo `secA-`/`sec-0`). Total da tabela: 700 → 805.
- **PRÉ-6C:** 4 URLs validadas aplicadas via `company_url_suggestions` (confiança = `validada`).
- **PRÉ-6D:** Nenhuma ação necessária — nomes já limpos no v20 (0 ocorrências de `✅`/`⚠️` em `companies.name`).
- Registrado em `db_versions` do `fato_v20.db` (versões 21 e 22).

### D59 — FTS5 confirmado via fork `sql.js-fts5` (SP-02)
- **Data:** 16/06/2026
- **Contexto:** testado e confirmado que a build padrão do `sql.js` (cdnjs, e também o pacote npm oficial) **não inclui o módulo FTS5** (`no such module: fts5`). Isso bloquearia D59 como originalmente escrito.
- **Decisão:** `db.js` usa o fork `sql.js-fts5` (mesmo mantenedor `sql-js`, mesma API/loader, WASM compilado com `-DSQLITE_ENABLE_FTS5`), via jsDelivr (`cdn.jsdelivr.net/npm/sql.js-fts5@1.4.0/dist/`). Testado de ponta a ponta com `fato_v20.db` real — índice de 1.136 linhas (sources + cnct_profiles + atlas_trails), buscas por "automação", "solda", "senai", "mecatrônica" retornam resultados corretos e relevantes nas 3 categorias.
- **Risco residual:** dependência de um fork de terceiros (não o `sql.js` oficial). Se o PR #594 (habilitar FTS5 por padrão no `sql.js` oficial) for mesclado, migrar de volta ao pacote oficial é trivial (mesma API).

## Sprint 7 — Execução (16/06/2026)
- **SP-02A/B:** índice FTS5 (`search_idx`) sobre `sources` (todas as camadas) + `cnct_profiles` + `atlas_trails`, reconstruído em memória a cada carga. Painel de busca global no `Nav` com resultados por categoria (Fontes / Perfis CNCT / Trilhas Atlas), clique navega à aba e (para Fontes) pré-filtra `ViewExplore` pelo nome da empresa.
- **SP-03 (PLANO_MIGRACAO_v4, M-03):** já implementado antecipadamente na Sprint 6 (M-03) — `cnct_hint` via JOIN `source_cnct_profiles`+`cnct_profiles`, não mais hardcoded.
  ⚠️ **Atenção a uma coincidência de numeração:** isto resolve o "SP-03" do `PLANO_MIGRACAO_v4.md` (migrar `cnct_hint` para JOIN no banco), que é **diferente** do "SP-03" do `_BACKLOG.md` original (badges de perfil CNCT *clicáveis*, navegação cruzada Explore→Perfil). Os badges `cnct`/`cnct_hint` já existiam no `App.jsx` antes desta sessão (Sprint 5) — eu só troquei a fonte de dados de JSON para banco, **não adicionei `onClick`**. O `_BACKLOG.md` SP-03 (navegação clicável) **continua não implementado** — ver nota abaixo.
- **SP-04A/B:** badge de `url_status` (8 estados) com tooltip de `url_checado_em`, exibido no card de programa em `ViewSectors`.
- **EXP-01:** `ViewGuideBlocks` (aba "Guia") estendida para carregar a camada `guia` (415 fichas, lazy via M-11) e exibir contagem por bloco na grade + seção "FICHAS DO GUIA NESTE BLOCO" no detalhe (vínculo por `sector_code`).
- **EXP-02:** seção "Caminhos CBO" no card técnico expandido — `cnct_courses` (1:1 com `cnct_profiles.id`) + `course_cbos`/`course_certificacoes`/`course_normas`, aplicável a **41 das 55** fontes técnicas (não 7 — esse era o número de *perfis CNCT distintos* vinculados a fontes técnicas, não o de fontes; várias fontes compartilham o mesmo perfil, daí a diferença). Verificado por replay da lógica de match em Python contra o banco.
- **Não feito nesta sprint (mantido para depois):** SP-05A (join `source_atlas_trails` em `ViewSectors` — tabela não tem nenhuma entrada para a camada `sector`, 0 linhas confirmadas; sem efeito prático até essas associações existirem).

## Sprint 13 — Reconciliação `fato_v33.db` → `fato_v55.db` (20/06/2026)

### D62-DB — Causa raiz confirmada: duas sessões paralelas sem sincronização de schema
- **Data:** 20/06/2026
- **Contexto:** Usuário relatou "o banco não conhece o site, o site acha que conhece o banco" — sintoma de que `App.jsx`/`db.js` e o `.db` real haviam divergido. Investigação confirmou: a Sprint 12 (sessão "portal") criou a coluna `cnct_courses.micro_atlas_pdf` sobre `fato_v33.db` (versão 47, ver `EXP-07` em `portal/SPRINT12_EXECUCAO.md`). Em paralelo, outra sessão ("dados/auditoria", scripts 01/05-17) gerou `fato_v55.db` a partir de um snapshot que não incluía a v47 — confirmado pelo próprio `db_versions` do v55 (versões 41-55, nenhuma menciona `micro_atlas_pdf` ou Sprint 12). As duas linhas de trabalho avançaram sem que uma soubesse da outra.
- **Decisão:** `db.js` atualizado para `fato_v55.db` (era `fato_v33.db`, 7 sprints desatualizado). Coluna `micro_atlas_pdf` reconstruída em `cnct_courses` no v55, repopulada por casamento exato de `id` contra `fato_v33.db` (validado 1:1 — 99 cursos, mesmo `id`+`nome` em ambas as versões, sem ambiguidade). 78/99 valores restaurados, idêntico ao estado pós-Sprint 12.
- **Não afetado:** `cnct_course_atlas_trails` e `cnct_course_sources` (existiam no v33, removidas no v55) — confirmado por grep no `App.jsx` que nunca foram referenciadas; remoção é inofensiva, não precisa de ação.
- **Efeito:** Portal volta a funcionar com o banco mais atual (v55, que inclui 35 tabelas novas `dm_*`/`cbo_canonical`/`normas_fato`/etc. da sessão de auditoria) sem perder a feature de PDF entregue na Sprint 12.

### D63-DB — Procedimento adotado para evitar repetição (duas sessões paralelas)
- **Data:** 20/06/2026
- **Decisão:** A partir desta sprint, qualquer sessão que gerar uma nova versão do `.db` deve, antes de finalizar:
  1. Conferir `portal/db.js` (`DB_PATH`) e confirmar se a versão nova é compatível com as colunas que o `App.jsx` lê (checagem simples: `grep -oE "FROM [a-z_]+" App.jsx` e comparar contra `sqlite_master` da nova versão).
  2. Se o `.db` for gerado/editado fora do contexto do portal (ex.: sessão de auditoria/dados), registrar em `db_versions` quais colunas foram adicionadas/removidas de tabelas que o portal consome — não só as tabelas novas.
  3. Atualizar `db.js` (path) e copiar o `.db` para `portal/dados/` como parte do mesmo fechamento de sessão, não como tarefa adiada.
- **Risco se ignorado:** repetição do mesmo sintoma — portal "achando" que conhece um schema que o banco real já não tem (ou tendo perdido uma feature já entregue, como ocorreu aqui com `micro_atlas_pdf`).

### Regra de decisão: ajustar o banco ou ajustar o site?
Quando uma divergência for encontrada, a direção do ajuste depende da natureza do problema, não de qual lado é "mais fácil" de tocar:
- **Banco perdeu algo que o site espera e que existia antes** (ex.: `micro_atlas_pdf` sumiu numa regeração) → ajustar o **banco**, restaurando o dado original sempre que ele ainda existir em alguma versão anterior. É reversível com segurança e não exige reescrever lógica de UI já testada.
- **Banco ganhou algo novo que o site ainda não usa** (ex.: as 35 tabelas `dm_*`/`cbo_canonical` da Sprint 13) → não é correção, é decisão de produto/feature. Vai para o `_BACKLOG.md`, não se resolve "ajustando" nada às pressas.
- **Site espera uma coluna/tabela que nunca existiu de fato** (suposição equivocada de schema na hora de escrever a query) → ajustar o **site**. Inventar ou forçar dado no banco só para satisfazer uma suposição da UI cria dado fantasma e esconde o erro real, que está no código, não no dado.

### D64-DB — Sprint 14: qualidade de dados de cnct_profiles e companies em fato_v55.db (sessão "portal", consciente da sessão "auditoria" em andamento)
- **Data:** 20/06/2026
- **Contexto:** Ao receber `fato_v55.db` (pós D62-DB/D63-DB), a sessão "portal" verificou — além da compatibilidade de schema já resolvida — se as correções de qualidade de dados feitas sobre `fato_v33.db` nas Sprints 9/11/12 (fusão de cadastros duplicados) sobreviveram à reconciliação. **Não sobreviveram, pelo motivo correto**: a linha "auditoria" nunca teve conhecimento dessas correções, porque elas nunca foram comunicadas para fora da sessão "portal" antes de D62-DB. Isso não é falha de ninguém — é exatamente o sintoma que D62-DB já diagnosticou para o caso do `micro_atlas_pdf`, agora aparecendo numa segunda dimensão (qualidade de `cnct_profiles`/`companies`, não schema).
- **Achado 1 — `cnct_profiles` (88 perfis em v55):** os mesmos 3 pares de duplicata já identificados e fundidos nas Sprints 11/12 sobre `fato_v33.db` (Plásticos id 31/73, Mecânica de Precisão id 6/32, Informática id 16/33) existiam em v55 com os mesmos ids exatos — confirmando que ambas as linhas herdam o mesmo bug de origem (propagação `cnct_courses`→`cnct_profiles` sem checar nome existente antes de inserir). Refundidos com a mesma decisão já validada (CBO mais específico/confirmado externamente para o par Plásticos; completude de dado para os outros 2 — versão fina sempre com zero vínculos em `guia_source_profiles`). `cnct_profiles`: 88 → 85.
- **Achado 2 — tabelas novas da auditoria que referenciam perfil e não foram cobertas pela varredura original:** o merge revelou (via `PRAGMA foreign_key_check`, que só pega tabelas com `FOREIGN KEY` declarada) **516 violações em `dm_matriz_pivotamento`**, tabela com nomenclatura em português (`perfil_origem_id`/`perfil_destino_id`) que a varredura inicial (buscando só "profile" em inglês) não capturou. Resurvey completo achou também `dm_rede_centralidade`, `dm_rede_comunidades` (sem FK declarada, mas com referência lógica) e `dm_premio_transferencia`. Todas corrigidas — ver detalhe técnico em `db_versions` v58/v59. **Nenhuma perda de dado real**: `dm_matriz_pivotamento` e as tabelas de rede já tinham cobertura completa e independente para o perfil sobrevivente; `dm_premio_transferencia` (lista esparsa, não matriz completa) teve tratamento linha a linha — no par Plásticos, 64 linhas eram dados reais exclusivos do perfil eliminado e foram migradas, não descartadas.
- **Achado 3 — `companies` (520 registros em v55):** varredura sistemática (mesma metodologia da Sprint 9/DB-DUP-01) encontrou **72 grupos candidatos**, concentrados nos ids 484-610 — quase certamente introduzidos por um processo de pesquisa/importação em lote da própria linha de auditoria (possivelmente a "Faixa B" de pesquisa web mencionada no histórico de `db_versions`) sem checagem contra a base de 451 já existente. 2 falsos-positivos excluídos após verificação individual (não bastou a heurística de nome): **"BRF" vs "BRF/M.Dias Branco"** (concorrentes distintos, já conhecido da Sprint 9) e **"SENAI" vs "SENAI/SESI EaD (ES)"** (são 2 programas técnicos diferentes — Operador de Utilidades vs Metrologia EaD — que só coincidem em citar "SENAI" genericamente; verificado que cada um tem apenas 1 fonte vinculada, programas diferentes, não a mesma entidade duplicada). 1 caso ("Air Products / Linde") verificado por busca externa antes de fundir: as fontes vinculadas a esse nome apontam exclusivamente para `airproducts.com`, sem nenhuma referência real a `linde.com` — Linde e Air Products são concorrentes globais distintos (Linde se fundiu com a Praxair, não com a Air Products), então "Air Products / Linde" é erro de cadastro, não joint venture real; fundidas as 3 entradas como uma só empresa. `companies`: 520 → 447 (73 registros).
- **Correção ao smoke test M-12:** `expected.social` (35→34) e `expected.sector` (458→444) corrigidos para refletir mudanças reais e legítimas já feitas pela própria linha de auditoria em sessões anteriores a esta — não são bug introduzido aqui, só não tinham sido propagadas ao `App.jsx`.

### D65-DB — Lição de processo: nomenclatura mista PT/EN e tabelas sem FK declarada
- **Data:** 20/06/2026
- **Contexto:** A varredura inicial de FK para o merge de `cnct_profiles` (D64-DB) buscou apenas a substring `"profile"` nos nomes de coluna, seguindo o precedente das Sprints 9/11/12. Isso deixou passar `dm_matriz_pivotamento` (`perfil_origem_id`/`perfil_destino_id`) — o banco mistura nomenclatura em inglês (tabelas mais antigas, linha "portal") e português (tabelas novas `dm_*`, linha "auditoria") para o mesmo conceito. O erro só foi descoberto porque `PRAGMA foreign_key_check` apontou 516 violações **depois** do `DELETE` já ter sido commitado — felizmente dentro de uma sessão onde a correção ainda era possível, mas o ideal é nunca chegar a esse ponto.
- **Decisão:** toda varredura de FK antes de qualquer fusão/exclusão de linha em `cnct_profiles`, `companies`, ou qualquer outra entidade central deve, a partir de agora:
  1. Buscar por **ambos** os termos equivalentes (`profile`/`perfil`, `company`/`empresa`, `source`/`fonte`) em nomes de coluna — não só o termo do idioma "de origem" da tabela que motivou a varredura.
  2. Rodar `PRAGMA foreign_key_check` **antes** de qualquer `DELETE` definitivo (não só depois), comparando a contagem de violações antes/depois de cada etapa — não confiar que a varredura manual de tabelas pegou tudo.
  3. Verificar também tabelas **sem** `FOREIGN KEY` declarada explicitamente (ex.: `dm_rede_centralidade`, `dm_premio_transferencia`) — `PRAGMA foreign_key_check` não as cobre, mas elas podem conter referências lógicas igualmente reais.
- **Risco se ignorado:** corrupção silenciosa de tabelas analíticas (rede, matrizes, métricas) que não geram erro visível no portal (não são consumidas pelo `App.jsx`), mas ficam com dados órfãos que vão distorcer qualquer análise futura feita sobre elas.

### D66-DB — Instruções explícitas para a sessão "auditoria" sincronizar com este trabalho
- **Data:** 20/06/2026
- **Por quê isto existe:** a sessão "auditoria" continua em andamento de forma independente desta sessão "portal". Para essa sessão não recriar os mesmos 3 pares de `cnct_profiles` nem os mesmos 72 grupos de `companies` numa próxima regeração do banco, ela precisa saber exatamente o quê mudou e por quê — não basta ler `db_versions` (embora as descrições estejam lá, completas). Esta entrada existe para ser o ponto único e explícito de leitura obrigatória.
- **O que a sessão de auditoria precisa fazer, na próxima vez que tocar `cnct_profiles` ou `companies`:**
  1. **Antes de rodar qualquer propagação `cnct_courses`→`cnct_profiles`** (ou equivalente): adicionar uma checagem `SELECT id FROM cnct_profiles WHERE name=?` antes de inserir uma linha nova. Essa propagação é a causa raiz confirmada dos 3 pares de duplicata (ver D64-DB Achado 1). Sem essa checagem, qualquer regeração futura recria o mesmo problema.
  2. **Antes de rodar qualquer importação/pesquisa em lote que insira linhas em `companies`** (ex.: a "Faixa B" que originou os ids 484-610): normalizar o nome (remover acento, case, sufixo societário, conteúdo entre parênteses) e checar contra os nomes já existentes antes de inserir uma empresa nova. Ver D64-DB Achado 3 para o algoritmo de normalização usado (idêntico ao da Sprint 9/DB-DUP-01).
  3. **Ao adicionar uma tabela nova que referencia `cnct_profiles.id` ou `companies.id`** (qualquer `dm_*` futura): usar nomenclatura em inglês (`profile_id`, `company_id`) por convenção do restante do schema, OU, se preferir português, registrar explicitamente em `db_versions` que a tabela nova usa `perfil_id`/`empresa_id` — para que a próxima varredura de FK (de qualquer sessão) saiba buscar por ambos os termos sem precisar descobrir isso por tentativa e erro (ver D65-DB).
  4. **Não é necessário** refazer nenhum trabalho da Sprint 13 (D62-DB/D63-DB) nem desta sessão — `fato_v55.db` já está com `cnct_profiles=85`, `companies=447`, ambos com `PRAGMA integrity_check`/`foreign_key_check` limpos, prontos para a auditoria continuar a partir daqui.
  5. **Se a auditoria já tiver outra cópia de `fato_v55.db` em andamento** (não esta, gerada nesta sessão): antes de continuar nela, rodar `SELECT COUNT(*) FROM cnct_profiles` e `SELECT COUNT(*) FROM companies` — se vier 88/520 em vez de 85/447, é uma cópia anterior a este merge, e os 2 achados acima (itens 1 e 2) precisam ser aplicados manualmente antes de prosseguir, ou a próxima sessão "portal" vai ter que repetir este mesmo trabalho de novo.

### D67-DB — Divisão estrita de responsabilidade entre sessões SITE e BANCO (decisão do usuário)
- **Data:** 20/06/2026
- **Decisão:** a partir desta data, as sessões deixam de poder corrigir o "lado" da outra diretamente, mesmo encontrando um problema real e com solução clara. Sessão SITE só edita `App.jsx`/`db.js`/`index.html` e só lê o `.db`. Sessão BANCO só edita o `.db` e só lê `App.jsx`/`db.js`/`index.html`. Qualquer necessidade de mudança do outro lado passa a ser um **pedido formal registrado em `_BACKLOG.md`**, não uma correção direta.
- **Motivo:** a correção do incidente de D62-DB/D63-DB (Sprint 13) e da regressão de qualidade de dados encontrada na Sprint 14 (D64-DB) exigiram que a sessão SITE editasse o `.db` diretamente — um modelo que funcionou para resolver o incidente, mas que o usuário decidiu não manter como padrão daqui para frente, justamente para que duas sessões trabalhando em paralelo sem se falar não voltem a gerar o mesmo tipo de divergência silenciosa.
- **Mecanismo adotado:** `_LEIA_PRIMEIRO.md` Regra 0.1 (papéis fixos) e Regra 4 (modelo de pedido formal, registrado em `_BACKLOG.md`, com evidência e referência a precedente em `_DECISIONS.md` quando houver).
- **Artefato de transição:** `KIT_AUDITORIA_BANCO_DADOS.md` (raiz do projeto) — preparado nesta mesma sessão para que a sessão BANCO, ao assumir esse papel fixo, tenha o histórico completo do que já foi feito no banco até aqui (Sprints 9 a 14) sem precisar reconstruir esse contexto lendo `db_versions` linha por linha.

### D68-DB — Auditoria cruzada `gaps` × `_BACKLOG.md` (sessão BANCO, 20/06) — auto-avaliação e 5 itens órfãos
- **Data:** 20/06/2026
- **Contexto:** Antes de receber o trabalho da Sprint 14, a sessão BANCO fez duas rodadas de auto-checagem por pedido do responsável: (1) confirmar que o nome do arquivo (`fato_v55.db`) estável mesmo após v56/v57 era convenção documentada, não bug; (2) checar se havia algum gap aberto em `gaps` sem equivalente em `_BACKLOG.md`.
- **Achados:** `gaps` não tinha registro de v56/v57 (Sprint 13) porque `_LEIA_PRIMEIRO.md` Regra 5 não exige isso — corrigido retroativamente. Na segunda rodada: 5 gaps genuinamente sem documentação externa (3 empresas no Guia sem trilha Atlas, 11 recursos do Atlas sem cobertura no Guia, Setor 11, `nivel_cnct`, rede de empresas↔instituições) e 1 número obsoleto em `SP-08` (27→23 casos).
- **Decisão original:** levados ao `_BACKLOG.md` como SP-13 a SP-17, com Regra 7 nova em `_LEIA_PRIMEIRO.md` (gaps e _BACKLOG.md como fontes independentes cruzáveis, checagem obrigatória ao fechar sessão BANCO).
- **Superado por D69-DB:** a numeração SP-13/14 entrou em colisão com a Sprint 14 (sessão SITE), que tinha usado os mesmos números independentemente, no mesmo intervalo de tempo. Ver D69-DB para a reconciliação.

### D69-DB — Reconciliação de três linhas divergentes do mesmo `v57` (sessão BANCO, 21/06)
- **Data:** 21/06/2026
- **Contexto:** A sessão BANCO recebeu `sistema_fato_kit_divisao.zip` (com o trabalho da Sprint 14, `db_versions` até v60, `_BACKLOG.md` SP-13/14, `_DECISIONS.md` D64-D67) enquanto já tinha produzido seu próprio v58/v59 (D68-DB acima) sobre o mesmo `v57` — sem qualquer um dos dois lados saber do outro. **Mesmo incidente que motivou D62-D67, acontecendo de novo, na primeira sessão depois da divisão de papéis ter sido formalizada** — porque a divisão resolve "quem edita o quê", não "duas sessões BANCO trabalhando ao mesmo tempo sem se falar" (que é exatamente o que ocorreu aqui: a sessão BANCO desta conversa e a investigação de qualidade de dados que a Sprint 14/SITE fez no banco, ainda usando o modelo antigo por ser a transição).
- **Verificação de risco real antes de mesclar:** a dedup de `companies` da Sprint 14 (520→447) invalidaria alguma referência usada nas correções da sessão BANCO? Checado individualmente: `company_id=92` (AVEVA) foi eliminado, mas a própria Sprint 14 já tinha propagado corretamente a FK em `gaps` (para 489) — mais rigoroso que o que a sessão BANCO fez originalmente em P2.6 (que precisou de correção manual posterior). `DWSIM` (id 100→48) precisou de correção manual aqui. Demais referências (Spirax Sarco, Aspen Technology, CRQ-SP, Fundacentro, FIAP) sobreviveram inalteradas.
- **Decisão de mesclagem:** base = linha Sprint 14 (`v60`, contém as correções de qualidade de dado mais fundamentais — regressão de `cnct_profiles`, FK, dedup de `companies`). Reaplicado por cima: as correções da sessão BANCO (D68-DB), com renumeração para evitar colisão — SP-13/14 a SP-17 (sessão BANCO) → **SP-15 a SP-19**; D64-DB/D65-DB (sessão BANCO) → **D68-DB/D69-DB** (este documento). Resultado: `v61`.
- **Lição de processo, incorporada em `meta_protocolo` regra 17 (banco) e recomendada para `_LEIA_PRIMEIRO.md`:** antes de criar uma entrada `SP-NN` ou `DNN-DB` nova, confirmar o próximo número livre **no arquivo que será de fato entregue/recebido**, não a partir de memória da própria sessão — o número certo só existe no momento da entrega, não antes.
- **Pendência real para fora do banco:** a Regra 0.1 (divisão estrita BANCO/SITE) resolve o problema de "quem edita o quê" mas não o de "duas sessões do MESMO papel trabalhando em paralelo sem se falar" — isso pode voltar a acontecer se duas conversas BANCO simultâneas receberem o mesmo `v57` sem coordenação. Não há mecanismo técnico no protocolo atual que previna isso (só detecção a posteriori, como ocorreu aqui). Registrado como observação para o responsável avaliar se quer um mecanismo de "lock" ou aviso explícito antes de iniciar uma nova sessão BANCO.

### D70-DB — Patches SQL externos avaliados e aplicados (sessão BANCO, 21/06): merge de duplicatas + 15 sources novas
- **Data:** 21/06/2026
- **Contexto:** Dois patches `.sql` recebidos prontos para avaliação (não gerados nesta sessão): merge de 5 pares de `companies` duplicadas, e inserção de 15 `sources` novas (P1/P2).
- **Achado técnico real, com valor para qualquer patch futuro:** `INSERT OR IGNORE` em SQLite **não suprime violação de FOREIGN KEY** — só suprime `UNIQUE`/`PRIMARY KEY`/`NOT NULL`/`CHECK`. Confirmado empiricamente. O patch de inserção de sources tinha 1 referência de `company_id` inexistente (97, deveria ser 486 — ANP); com `PRAGMA foreign_keys=ON`, isso derrubaria a transação inteira (0 de 15 linhas persistidas), não só a linha ruim. Corrigido e retestado antes de aplicar. Registrado em `meta_protocolo` regra 18.
- **Decisão:** ambos os patches aplicados após teste completo em cópia isolada (não só leitura/inspeção de cada referência individualmente — o efeito de uma falha sobre a transação inteira só se vê executando de fato). `companies` 447→442, `sources` 976→991.
- **Achado paralelo, não corrigido agora:** 2ª entrada duplicada de ANP (`id=944`, "...⭐ MUITO ALTO", 0 sources) — mesmo padrão de lixo residual já visto em outras entidades. Registrado como SP-20 em `_BACKLOG.md` para resolução numa próxima rodada de dedup.

### D71-DB — 3 patches SQL externos avaliados e aplicados (sessão BANCO, 21/06): P4, trilhas_99, P5
- **Data:** 21/06/2026
- **Contexto:** 4 arquivos `.sql` recebidos (1 já avaliado e aplicado em v62, reenviado sem correção na fonte — ignorado). Os outros 3: `p4_sources_ead_validado.sql` (32 sources), `trilhas_99_insert_corrigido.sql` (103 trilhas + criação de `trail_cbos`/`trail_normas`), `p5_step_sources_normas_corrigido.sql` (vínculos trilha↔fonte).
- **P4:** sem achados — aplicado integralmente.
- **trilhas_99:** boa correção de schema própria (FK para `trails(id)` TEXT em vez de `atlas_trails(id)` INTEGER, documentada no próprio patch). Achado de conteúdo: 4 trilhas "MT-*" duplicavam tema de 4 "TRL-MICRO-*" com profundidade diferente. **Decisão do responsável: remover as MT-*** como redundantes.
- **P5:** achado crítico confirmado por execução real (não só leitura) — `LIKE '%padrão%' LIMIT 1` sem `ORDER BY` para resolver `source_id` produz vínculo arbitrário quando o padrão é amplo. Caso concreto: vínculo comentado "Eu Capacito - UX" resolvia de fato para um source da Anglo American. **Decisão do responsável: aplicar só os padrões de risco baixo/médio, descartar `com.br`/`org.br`/`gov.br`** (11 de 90 vínculos potenciais descartados, registrados como SP-21 para revisão futura com IDs exatos).
- **Resultado:** `sources` 991→1023, `trails` 109→105 (pós-remoção MT-), `trail_step_sources` 0→79, `trail_normas` (tabela nova) 0→4. 0 violações de FK em todas as etapas, testadas em cópia antes de cada aplicação real.

### D72-DB — `_SCHEMA.md` recriado do zero (sessão BANCO, 21/06)
- **Data:** 21/06/2026
- **Contexto:** Responsável precisava explicar o schema completo do banco a outra LLM. Notou que o protocolo do pacote do site provavelmente já previa algo assim.
- **Achado:** existia um `_SCHEMA.md` anterior, removido (ver `_CHANGELOG.md`, linha sobre "Removidos SPRINT4_PLANO.md, ANALISE_ARQUIVOS_FONTE.md, _SCHEMA.md") por descrever estados pré-migração já não aplicáveis.
- **Decisão:** recriar do zero, por consulta direta ao banco real (`v63`) — não por memória de schema de sessões anteriores, dado o histórico de informação desatualizada que já causou múltiplos incidentes nesta mesma linha de trabalho (D62 a D71-DB). Documento cobre as 89 tabelas (88 de projeto + `sqlite_sequence`), 8 views, vocabulários controlados, prefixos de `sources.id`, e nota explicitamente quais tabelas `dm_*` foram auditadas em profundidade nesta sessão vs. quais são descritas só por inspeção de schema/amostra (honestidade de confiança, não confundir as duas categorias).
- **Efeito no portal:** nenhum — documentação pura.

### D73-DB — Sprint 15 combinada com a linha BANCO (sessão BANCO, 21/06)
- **Data:** 21/06/2026
- **Contexto:** Sprint 15 (SITE) trouxe nova aba "Mercado de Trabalho" + painel no Perfil CNCT, seguindo corretamente a Regra 0.1 (`db_versions` parado em 60, só leitura). Verificado que `dm_mercado_trabalho`/`cbo_canonical`/`cnct_profiles` eram idênticos entre a base deles (v60) e a linha BANCO (v64) — sem conflito real, só combinação.
- **Achado investigado pela sessão BANCO:** CBO `8153-10` (em `dm_mercado_trabalho`, 9.320 vínculos reais) sem nome em `cbo_canonical`. Pesquisa externa confirmou a família (operadores de filtração/separação química) mas não o título exato com confiança suficiente — não inserido, registrado como `SP-22`.
- **Resultado:** App.jsx/index.html/db.js da Sprint 15 combinados com o `.db` mais atual da linha BANCO (v65). 0 tabelas/colunas faltando, 0 violações de FK.

### D74-DB — Patch consolidado de 10 blocos avaliado e aplicado com filtros (sessão BANCO, 21-22/06)
- **Data:** 21-22/06/2026
- **Contexto:** Patch SQL grande (4422 linhas, 10 blocos) recebido para avaliação, referenciando decisões "D86/D87/D88" de uma linha de trabalho externa a esta sessão.
- **Decisões tomadas com o responsável antes de aplicar:**
  1. **Bloco 2/6** (42 trilhas já existentes em `trails` promovidas para `atlas_trails`): confirmado **intencional** — ponte necessária pro catálogo Atlas oficial, já que `atlas_trail_normas`/`atlas_trail_cbos` usam FK INTEGER que `trails` (TEXT) não suporta. Aplicado integralmente.
  2. **Bloco 5** (vínculos via `LIKE` amplo): mesmo critério do `SP-21` — descartadas as linhas de alto risco (`com.br`/`org.br`/`gov.br`), inclusive o mesmo caso recorrente "Eu Capacito"/Anglo American.
  3. **Bloco 7** (217 sources, "D86"): companies (25, curadas) aplicado integral. Sources: **85 de 217 (39%) descartadas** por conteúdo genuinamente fragmentado de extração de PDF (ex.: um caso literalmente continha raciocínio de IA vazado — "verificar fontes oficiais. Vou abrir resultado"). Estimativa inicial informal (~25) estava subestimada; corrigida após heurística mais rigorosa (capitalização + conectivos pendentes), com confirmação explícita do responsável antes de aplicar o número real. 4 sources sobre energia eólica tinham `industry_sector_id` forçado para "Petróleo" — corrigido para `NULL` (não existe setor Eólica entre os 12 fixos; `source_sector_codes` EOL/ENE já estavam corretos, o campo redundante é que estava errado).
  4. **Bloco 9** (194 sources, "D88"): aplicado **integralmente, risco aceito** — ~58% (112) com conteúdo fragmentado, mas decisão explícita do responsável foi não filtrar (diferente do Bloco 7). Registrado como `SP-23`.
  5. **Bloco 10**: `source_sector_codes`/`source_material_types` órfãos das 85 sources excluídas do Bloco 7 também removidos, por consistência de FK — achado na primeira tentativa de execução (violação de FK), corrigido na segunda.
- **Achado de processo grave, não relacionado ao conteúdo do patch:** durante a montagem desta entrega, uma cópia de trabalho paralela (`sistema_fato_final`, usada na entrega da Sprint 15) continha uma entrada `D73-DB` e uma entrada de changelog `v3.7` com números fabricados — não correspondiam a nenhuma execução real desta sessão (citava "meta_protocolo regra 19", que nunca foi criada; citava "90+109 sources descartadas", quando o real foi 85 descartadas do Bloco 7 e 0 do Bloco 9, que foi aceito integralmente). **Confirmado por verificação direta no banco** (`SELECT COUNT(*) FROM meta_protocolo` = 18, não 19) que essas entradas eram fabricação, não execução. Descartadas integralmente; esta entrada (`D74-DB`) e a `D73-DB` acima foram escritas do zero a partir de fatos verificados nesta sessão. Reforça por que `meta_protocolo`/`db_versions` (verificáveis por query) devem ser a referência final em caso de qualquer dúvida sobre o que really aconteceu — nunca um arquivo `.md` isolado.
- **Resultado verificado:** `companies` 442→506, `sources` 1023→1537, `atlas_trails` 145→187, `atlas_docs` 9→18, `cnct_profiles` 85→98, `trail_step_sources` 79→799, `atlas_trail_normas` 26→57, `trail_steps` ganhou 4 colunas novas, 2 tabelas novas (`material_types`, `source_material_types`). 0 violações de FK, testado em cópia isolada antes de aplicar no arquivo real, e retestado após o achado de FK na 1ª tentativa.

### D75-DB — Auditoria de atualização da documentação (sessão BANCO, 26/06)
- **Data:** 26/06/2026
- **Contexto:** Responsável pediu explicitamente para "abaixar a temperatura" e verificar o que estava desatualizado antes de uma nova entrega — em vez de assumir que a documentação gerada anteriormente continuava válida.
- **Achados:**
  1. `_SCHEMA.md` estava desatualizado desde v63/v64 (gerado antes do patch consolidado v66) — 12 tabelas com contagem errada, 2 tabelas novas não documentadas (`material_types`, `source_material_types`), e 1 tabela pré-existente (`profile_normas`, 117 linhas) que tinha ficado de fora por omissão real na primeira versão do documento.
  2. Checagem cruzada `gaps`×`_BACKLOG.md` (Regra 7) encontrou 1 gap genuinamente sem representação (id 165, Perfil CNCT#6 sem source `layer=technical`) — adicionado como `SP-24`.
  3. 3 entradas de `gaps` (175/176/177) eram logs históricos de progresso, não pendências em si — status limpo para evitar confusão futura.
- **Decisão:** `_SCHEMA.md` regenerado do zero (não só corrigido por trecho) para garantir que toda contagem fosse reconferida por query, não copiada da versão anterior. `meta_protocolo` regra 19 e `_LEIA_PRIMEIRO.md` Regra 6 receberam a lição do achado de conteúdo fabricado da sessão anterior (ver D74-DB) — agora generalizada como princípio: verificar arquivos de trabalho da própria sessão, não só documentos externos.
- **Efeito no portal:** nenhum — sessão de documentação pura, nenhuma tabela de dado tocada além de `gaps`/`meta_protocolo`.

### D76-DB — Patch externo "v67→v76" avaliado e aplicado com filtros, resolve SP-18/19/20 (sessão BANCO, 27/06)
- **Data:** 27/06/2026
- **Contexto:** Patch SQL grande (3584 linhas, 7 seções) recebido para avaliação, endereçando diretamente 3 itens já documentados no `_BACKLOG.md` (SP-18 `nivel_cnct`, SP-19 rede empresa-instituição, SP-20 ANP duplicada).
- **Decisões tomadas com o responsável antes de aplicar:**
  1. **`nivel_cnct`** (101 perfis): mapeamento 1:1 determinístico a partir de `tier` (T1=FIC...T6=Especialização Técnica), verificado por correlação 100% sem exceção antes de aplicar — aplicado integralmente, **resolve `SP-18`**.
  2. **`company_institution_links`** (100 candidatos, todos ENAP via heurística fraca): aplicado como está, candidato de baixa confiança já marcado como tal pelo próprio patch — **`SP-19` marcado parcial**, não fechado.
  3. **288 companies novas**: 40 (~14%) descartadas por fragmento de PDF, 248 aplicadas (6 colidiram com slugs já existentes da minha própria v66 — `OR IGNORE` tratou corretamente).
  4. **15 trilhas `TRL-GES-PDF-*`**: `description` duplicada corrigida antes de aplicar.
  5. **`dm_cbo_pendentes`** (6 linhas): rejeitado integralmente — bug confirmado, estrutura de dado incompatível com o schema real da tabela.
  6. **`id=944` (ANP duplicada)**: removido, verificado 0 linhas nas 5 tabelas com FK para `companies` antes de aplicar — **resolve `SP-20`**.
- **Erro de processo cometido e corrigido na hora**: a Seção 7 do próprio patch ("db_versions") continha o histórico de build interno da ferramenta que gerou o patch ("Patch v68: ...", "Patch v76: ..."), com numeração própria (68-76) que colidiu com a numeração real desta linha BANCO. Executado por engano junto com o resto do script, gerando 9 linhas estranhas em `db_versions`. **Detectado imediatamente** (a versão "68" já existia antes de eu tentar inserir a minha), removido, e a entrada correta escrita do zero.
- **Achado de processo recorrente**: o patch citava "SP-17" com significado diferente da numeração real deste `_BACKLOG.md` — 3ª ocorrência confirmada do mesmo padrão (namespaces `SP-NN` de ferramentas externas não são universais). Registrado em `meta_protocolo` regra 20.
- **Resultado verificado:** `companies` 506→747, `nivel_cnct` 0→98 preenchidos, 12 tabelas novas, `dm_cbo_pendentes` inalterado (rejeitado). 0 violações de FK, `db_versions` contínuo e correto.

### D77-DB — Ferramenta de validação automática de patches externos criada (sessão BANCO, 27/06)
- **Data:** 27/06/2026
- **Contexto:** Responsável apontou que a mesma classe de problema já tinha se repetido 3 vezes (colisão de numeração `SP-NN`, entre outras categorias recorrentes: fragmento de PDF, `LIKE` ambíguo) e pediu uma solução estrutural, não mais correção reativa patch a patch.
- **Decisão:** construída `validar_patch_externo.py`, automatizando as 7 checagens que vinham sendo feitas manualmente (~30-60min por patch): execução isolada, `foreign_key_check`, detecção de escrita indevida em `db_versions`, detecção de `LIKE` amplo sem `ORDER BY` resolvendo FK, heurística de fragmento de PDF, comparação de numeração `SP-NN`/`D-NN-DB` (incluindo verificação de CONTEÚDO, não só existência do número), e verificação de propagação de `DELETE` em `companies`.
- **Validação:** testada retroativamente contra os 2 patches mais complexos já recebidos — reproduziu exatamente os mesmos achados da revisão manual original em ambos, incluindo o caso real "SP-17 com conteúdo trocado" e os mesmos domínios `LIKE` ambíguos já documentados. 2 bugs reais da própria ferramenta encontrados e corrigidos durante esse teste (tratamento de `NULL`, regex de `SP-NN` capturando substring de outros identificadores).
- **Formalização:** `_LEIA_PRIMEIRO.md` Regra 8 (uso obrigatório antes de qualquer leitura manual de um patch novo) + `meta_protocolo` regra 21.
- **Limite reconhecido explicitamente:** esta ferramenta não tem como impedir tecnicamente que uma sessão diferente (ou até esta mesma, em outra ocasião) ignore o protocolo e aplique um patch sem rodá-la primeiro. A barreira real depende do protocolo escrito ser lido (Regra 0 já manda isso) — o que a ferramenta resolve é o custo de seguir a regra, que deixa de ser "30-60 minutos de revisão manual" e passa a ser "rodar um comando".

### D78-DB — Pipeline unificado de validação criado, fundindo ferramentas externas (sessão BANCO, 27/06)
- **Data:** 27/06/2026
- **Contexto:** Responsável apontou que o trabalho manual de revisão de patch (~30-60 min cada, 5 patches já avaliados) deveria ser mais automatizado ("muito trabalho bruto de LLM, pouco trabalho de terminal") e enviou 2 ferramentas externas (`audit_sql_patch_v2.py`, `fix_sql_patch_v2.py`) para avaliação, com convite explícito para adaptar/corrigir.
- **Decisão:** fundidas as 2 ferramentas com `validar_patch_externo.py` (meu, D77-DB) num pipeline único de 4 estágios (`00_pipeline_completo.py`): auditoria estática → correção automática segura → auditoria estática de novo → validação dinâmica contra o banco real.
- **4 bugs reais encontrados e corrigidos nas ferramentas recebidas, durante teste retroativo contra os 2 patches mais complexos já processados:**
  1. `INSERT_RE`/`ALTER_RE` não reconheciam notação `[tabela]` entre colchetes — qualquer patch nesse estilo (recorrente nos mais recentes) fazia a ferramenta contar **0 INSERTs**, silenciosamente, sem erro visível.
  2. Near-duplicata por Jaccard calculada sobre a linha inteira, incluindo a lista de colunas (boilerplate idêntico para qualquer linha da mesma tabela) — gerou 631 falsos positivos numa única tabela (`sources`); corrigido para considerar só a parte após `VALUES`, resultado caiu para 21 near-duplicatas genuínas.
  3. Regex de extração de slug/nome de `companies` assumia `VALUES('slug','name'...)` sem `id` líder — qualquer patch com `id` INTEGER explícito como primeira coluna (caso comum nos patches recentes) fazia a detecção de slug-lixo nunca disparar. Mesmo bug presente em 2 lugares (auditor e corretor), corrigido nos dois.
- **Validação:** depois das correções, o pipeline reproduziu exatamente os achados da revisão manual original nos 2 patches-teste, e **achou 1 caso novo que a revisão manual tinha perdido** — 4 sources de `escola_sources` duplicadas por variação de capitalização/ordem de palavra (texto limpo, mas redundante; a heurística manual só pegava texto visivelmente quebrado, não duplicata "limpa").
- **Formalização:** `_LEIA_PRIMEIRO.md` Regra 8 reescrita para refletir o pipeline de 4 estágios; `meta_protocolo` regra 22.
- **Pendência explícita:** relatório de bugs preparado para repasse à sessão que mantém os scripts originais (o responsável mencionou que bugs de extração do pipeline upstream — `pdf_pipeline/`, fora do escopo desta correção — já estão sendo tratados em paralelo).

### D79 — Sincronização SITE×BANCO: pacote `sprint17` (v65) consolidado com pacote `v70`, colisão SP-23/24 corrigida (sessão de sincronização, 30/06/2026)

- **Contexto:** os dois pacotes entregues separadamente (sessão SITE até Sprint 17/v65; sessão BANCO até v70) tinham divergido por 5 versões de banco sem se cruzarem — mesma categoria de risco da Regra 0.
- **Achado 1 — colisão de numeração:** `SP-23` e `SP-24` tinham significados diferentes em cada `_BACKLOG.md` (ver tabela no próprio `_BACKLOG.md`, seção "Sincronização SITE×BANCO"). Mesma causa-raiz do D69-DB: número escolhido por sessão sem confirmar o próximo livre no arquivo real da outra linha. Resolvido por renumeração para SP-26/SP-27 (próximos livres confirmados na tabela consolidada).
- **Achado 2 — pedido formal perdido:** o pedido SP-24 original da sessão SITE (24/06, migrar conteúdo `iedu_*` antes de eliminar os arquivos-fonte, com 3 JSONs já extraídos e validados) nunca chegou à sessão BANCO — confirmado por busca textual (nenhuma menção a `iedu` no v70 é posterior a 24/06). Os arquivos de suporte (`PLANO_ELIMINACAO_IEDU.md` + 3 `extracao_*.json`) foram trazidos de volta para a raiz do pacote sincronizado; a execução (itens 1-4, já validados) continua sendo exclusiva da sessão BANCO (Regra 0.1).
- **Achado 3 — checagem de schema (Regra 1):** 0 tabelas/colunas que `App.jsx` espera estão faltando em `fato_v70.db`; `micro_atlas_pdf` (o incidente que motivou a Regra 0) confirmado intacto, 78/99 cursos, idêntico ao v55.
- **Ação tomada:** `portal/db.js` (`DB_PATH`) atualizado de `fato_v55.db` para `fato_v70.db` — exceção de 1 linha permitida pela Regra 2.4. Nenhuma alteração de schema/dado feita no `.db` por esta sessão (fora do escopo de sincronização).
- **Lição:** a colisão SP-23/24 se repetiu mesmo com a Regra 7 (checagem cruzada gaps×backlog) e a Regra 0.1 (papéis exclusivos) já valendo — porque nenhuma das duas sessões teve visibilidade do pacote final da outra entre 23/06 e 30/06. Reforça que a Regra 5 (\"ao fechar qualquer sessão\") precisa incluir, na prática, a troca real do `.zip`/pacote entre as duas linhas — não só a disciplina interna de cada uma.

### D80 — Sincronização SITE×BANCO #2: pacote `v71` consolidado com pacote `v97` (sessão de sincronização, 30/06/2026)

- **Achado 1 — divergência de estrutura de documentação:** entre v71 e v97 a sessão BANCO trocou o conjunto de arquivos de protocolo (`_LEIA_PRIMEIRO.md`/`_BACKLOG.md`/`_DECISIONS.md`/`_CHANGELOG.md`/`_SCHEMA.md`) por outro (`ESTADO_ATUAL.md`/`CHANGELOG.md`/`HISTORICO_SESSOES.md`/`SCHEMA.md`/`auditorias/`), e passou a usar `db_versions_v2` (com colunas extras: tabelas_criadas, tabelas_modificadas, checksum) em vez de `db_versions`, que ficou congelada em v80. **Ambos os conjuntos foram mantidos neste pacote** (os da sessão SITE preservados, os novos da sessão BANCO adicionados) até haver decisão explícita do responsável sobre qual estrutura vale daqui pra frente — não decidi isso unilateralmente.
- **Achado 2 — `gaps` vs `gaps_v2`:** a tabela `gaps` original (129 linhas) está congelada/somente-leitura desde a v97 do lado BANCO, e o rastreamento ativo de lacunas migrou pra `gaps_v2` (103 linhas, 33 ativas). **O portal (`App.jsx`, aba "Lacunas") continua lendo só `gaps`** — a tela está mostrando um snapshot congelado, não as lacunas ativas reais. Registrado como `SP-28` (abaixo) — pedido pra sessão SITE decidir se migra a query pra `gaps_v2`, mantendo `gaps` como histórico.
- **Achado 3 — pedido SP-27 (iedu) e D79 ainda não vistos pela sessão BANCO:** confirmado por busca textual em todos os `.md` do pacote v97 — nenhuma menção a `SP-27`/`D79`/à sincronização anterior. O pedido formal segue pendente, sem regressão (apenas ainda não processado).
- **Checagem de schema (Regra 1):** 0 tabelas/views que `App.jsx` espera estão faltando no banco recebido. `micro_atlas_pdf` confirmado intacto (78/99 cursos).
- **Cuidado de nomenclatura (Regra 6):** o arquivo recebido se chama `db-fato_v97.zip` e contém `fato_v94.db` — o número da versão real (97) só existe dentro de `db_versions_v2`, não no nome do arquivo físico (última reconstrução completa do `.db` foi v94; v95-97 foram metadado/auditoria sem novo dump físico). Renomeado para `fato_v97.db` neste pacote pra refletir o estado lógico real, mas o `description` da v97 em `db_versions_v2` documenta essa origem.
- **Ação tomada:** `portal/db.js` atualizado (`DB_PATH`: `fato_v71.db` → `fato_v97.db`).

### D81 — Sincronização SITE×BANCO #3: pacote `v97` consolidado com `fato_v106.db` (sessão de sincronização, 01/07/2026)

- **Contexto:** desta vez chegou só o `.db` físico, sem os `.md` de documentação (`ESTADO_ATUAL.md`/`CHANGELOG.md`/`HISTORICO_SESSOES.md` não foram atualizados junto). `db_versions_v2` real vai até **v105**, não v106 — o nome do arquivo (`fato_v106.db`) reflete a próxima versão em preparo, não necessariamente uma linha fechada em `db_versions_v2`. Sinalizo isso porque o protocolo do próprio BANCO (regra 7 do `ESTADO_ATUAL.md`) exige `MAX(version) == NN do nome do arquivo` como verificação de fechamento — **essa verificação falhou aqui** (105 ≠ 106). Não bloqueei a sincronização por isso (o `.db` é o estado físico real e passou na checagem de schema), mas registro que a versão pode não estar formalmente "fechada" do lado BANCO.
- **Achado crítico herdado (não desta sessão, mas relevante pra confiança nos dados) — quebra de rastro de auditoria em v103:** a própria sessão BANCO documentou (`gaps_v2.id=90026`) que o patch `patch_v101_to_v102_fix_cobertura_cbo_trail_cbos.sql` **não corresponde ao gap real** que ele alega ter resolvido — o texto do patch descreve um achado (Sandvik/SENAI), mas o banco físico da mesma versão continha outra correção (fix de `trails.name`). **Conclusão prática: descrições textuais de patches anteriores a v103 não são fonte confiável sozinhas — só o estado físico do `.db`, verificado por query direta, é.** Esta sincronização seguiu essa regra (todas as contagens acima foram tiradas por query direta no `fato_v106.db`, não copiadas de log).
- **Checagem de schema (Regra 1):** 0 tabelas/views que `App.jsx` espera estão faltando. `micro_atlas_pdf` intacto (78/99).
- **SP-28 atualizado:** `gaps` (129, congelada) vs `gaps_v2` agora com 122 linhas / 23 ativas (era 103/33 na sincronização #2) — segue sem migração no portal.
- **Pendências não resolvidas nesta rodada, sem regressão:** SP-27 (iedu) e D79/D80 continuam sem confirmação de terem sido vistos pelo lado BANCO (não há como verificar sem os `.md`, que não vieram desta vez).
- **Ação tomada:** `portal/db.js` atualizado (`DB_PATH`: `fato_v97.db` → `fato_v106.db`).
- **Pedido para a próxima sincronização:** se possível, enviar também os `.md` de documentação (ou ao menos `ESTADO_ATUAL.md`/`CHANGELOG.md`) junto com o `.db`, pra eu poder confirmar se SP-27/D79/D80 já foram vistos, e pra fechar a verificação de `MAX(version) == NN`.

### D82 — Sincronização SITE×BANCO #4: `CHANGELOG_fato.md` + auditoria externa `v94→v106` incorporados (sessão de sincronização, 01/07/2026)

- **Confirmação da pendência do D81:** o `CHANGELOG_fato.md` recebido confirma o que eu tinha sinalizado — `fato_v106.db` é o nome do arquivo, mas `db_versions_v2.MAX(version)` real é 105; o próprio changelog e a auditoria externa documentam essa defasagem como padrão recorrente (já visto em v94/v97 também), não erro pontual desta versão.
- **Achado herdado confirmado (não novo, mas agora com fonte dupla):** a inconsistência patch↔banco do gap `90026` (v103) foi verificada de forma independente pela auditoria externa, que também recomenda criar uma convenção de blocos de ID reservados por branch/sessão — ainda não existe, mesmo depois do incidente. Repito aqui a mesma cautela do D81: **não confiar em descrição textual de patch isoladamente, sempre conferir contra o `.db` real.**
- **2 achados novos da auditoria externa, não capturados por nenhum processo anterior (`audit_classes.py` incluído):**
  1. `TRL-CNCT-022` e `TRL-CNCT-DG-001` exibem o **mesmo nome** em `vw_trails_ativas`, mas DG-001 tem 0/5 steps com fonte real — risco de UX imediato (usuário clica em algo que parece a trilha funcional e cai em conteúdo vazio). SQL de correção já vem pronto no laudo.
  2. `TRL-CNCT-030` e `TRL-CNCT-004` têm nome idêntico mas são a mesma trilha em duas modalidades (presencial vs EAD) — o nome apaga esse sinal real.
- **Decisão explícita do usuário (perguntado nesta sessão): não aplicar as correções propostas agora — só documentar como pendência.** Registrado como `SP-29` (crítico, UX) e `SP-30` (média) no `_BACKLOG.md`. **O banco sincronizado neste pacote (`fato_v106.db`) permanece byte-a-byte igual ao recebido — nenhum SQL da auditoria foi executado.**
- **Itens da auditoria que ficam registrados aqui só como referência, sem ação desta sessão** (aguardam priorização do responsável, ver tabela completa em `auditorias/Auditoria_v94_v106.html` §"Recomendações priorizadas"): convenção de ID por branch (relacionado a 90026), `PRAGMA foreign_keys = ON` (0 violações confirmadas em 11 versões, custo de 1 linha), gap 90013 Parte B (14 linhas residuais de `sector_id` deslocado).
- **Arquivos incorporados ao pacote:** `CHANGELOG_fato.md` (raiz) e `auditorias/Auditoria_v94_v106.html`.

### D83 — Sincronização SITE×BANCO #5: `v106` consolidado com `fato_v109.db` (sessão de sincronização, 02/07/2026)

- **SP-27 (iedu) confirmado 100% executado e verificado.** O pacote formal que separamos (`pacote_BANCO_pedido_iedu.zip`) chegou à sessão BANCO, foi aplicado com dry-run prévio (v107) e depois auditado byte-a-byte contra o próprio pacote fonte que enviamos, sem divergência (v108→v109). Achado de processo, sem impacto de dado: o `.sql` gerado a partir do plano continha `UPDATE` pra 10 perfis além do escopo formalmente aprovado — inerte porque a trava de segurança do próprio SQL (`WHERE infraestrutura_requerida = campo_atuacao`) bloqueou, mas vale registrar como lição pra próxima geração de patch. **Ação restante: apagar os 4 arquivos-fonte `iedu_*.md` do projeto — fora do escopo do banco, cabe à sessão SITE/gestão de arquivos decidir quando.**
- **SP-29 e SP-30 confirmados resolvidos**, mas não pela decisão que registramos como pendente no D82 — a sessão BANCO chegou às mesmas duas colisões de nome de forma **independente**, através de uma auditoria externa própria + merge de uma segunda branch paralela, com soluções equivalentes (ou melhores: o nome final de DG-001 é mais descritivo que a proposta original, e a reversão de `cnct_label` pra `NULL` foi uma correção que nem a auditoria original tinha pego). Confirmei por query direta no `fato_v109.db`, não só pelo texto do changelog.
- **Achado novo relevante — `meta_protocolo`:** o banco tem uma tabela de 27 regras de processo internas (incluindo uma regra específica pra como reconciliar branches `.db` paralelas) que nunca foi compartilhada com a sessão SITE. Registrado como `SP-31` — vale pedir esse conteúdo explicitamente na próxima sincronização, pode ter mais regras relevantes pro nosso próprio protocolo de sincronização.
- **Merge de branches paralelas do lado BANCO (v107→v108→v109):** duas sessões BANCO trabalharam em paralelo a partir do mesmo `fato_v107.db` e colidiram no id de gap `90030` (mesma categoria de risco do gap `90026`, já visto). A reconciliação entre elas foi feita com critério — comparação de contagem por tabela, validação cruzada de resultado (0 divergências no SP27b), e argumento técnico decidindo entre duas propostas de nome divergentes para `DG-001` (não só "o que chegou primeiro"). Isso não exigiu ação da sessão SITE, mas documenta que o mesmo tipo de colisão que motivou nosso D79 também acontece dentro do próprio lado BANCO.
- **Checagem de schema (Regra 1):** 0 tabelas/views que `App.jsx` espera estão faltando em `fato_v109.db`. `micro_atlas_pdf` intacto (78/99).
- **Boa notícia de processo:** pela primeira vez desde o D81, `MAX(db_versions_v2.version)` bate exatamente com o número do arquivo recebido (109 = 109) — a defasagem que vínhamos sinalizando parece ter sido corrigida do lado BANCO.
- **Ação tomada:** `portal/db.js` atualizado (`DB_PATH`: `fato_v106.db` → `fato_v109.db`). `SP-27`, `SP-29`, `SP-30` marcados `✅ Resolvido` no backlog; `SP-31` a `SP-34` adicionados para os achados novos desta rodada.

### D84 — `meta_protocolo` lida por completo, `SP-31` resolvido; liberação para retomar desenvolvimento do site (02/07/2026)

- A tabela `meta_protocolo` (27 regras) estava dentro do próprio `fato_v109.db` o tempo todo — não era um arquivo externo faltando, como eu tinha assumido no D83. Lida por completo por query direta.
- **Duas regras confirmam práticas que já seguíamos por conta própria** nas sincronizações 1-5: regra 2 (nunca confiar em número de documento sem reconferir no banco — é exatamente o que fizemos em cada rodada) e regra 8 (branches paralelas de `.db`: comparar contagem por tabela antes de reconciliar — é a mesma lógica da checagem de schema/Regra 1 que rodamos toda vez).
- **Regra mais relevante pra nós daqui pra frente: regra 20.** Confirma, com uma 3ª ocorrência documentada pelo próprio lado BANCO, o mesmo padrão de colisão `SP-NN` que motivou o D79 (nossa sincronização #1): cada sessão/ferramenta mantém sua própria numeração `SP-NN`, sem autoridade central — um número citado num patch externo nunca deve ser tratado como referência ao `_BACKLOG.md` real sem confirmação. Fica registrado como reforço da nossa própria prática de sempre confirmar o próximo número livre antes de criar uma entrada nova (o que já fazíamos, mas agora com confirmação formal de que o problema é estrutural do processo, não um acaso).
- **Nenhuma regra em `meta_protocolo` conflita com o protocolo que vimos seguindo.** A própria regra 16 confirma a divisão SITE/BANCO como protocolo canônico, e trata `meta_protocolo` como suplemento do lado BANCO — não substitui nem sobrepõe o `_BACKLOG.md`/`_DECISIONS.md` que usamos como canal cruzado.
- **Estado da reconciliação neste ponto:** todas as pendências críticas resolvidas (`SP-27`, `SP-29`, `SP-30`, `SP-31`); schema compatível (Regra 1 limpa); `micro_atlas_pdf` intacto; nenhuma colisão de numeração aberta. **Não há bloqueio conhecido para retomar o desenvolvimento do portal (`App.jsx`/`db.js`/`index.html`) sobre o `fato_v109.db` atual.**
- Pendências não-bloqueantes que continuam abertas, sem impedir o desenvolvimento: `SP-26` (UI faltando pra `trail_cbos`/`trail_normas`), `SP-28` (aba Lacunas lendo tabela congelada), `SP-32`/`SP-33` (achados novos do lado BANCO, sem ação do SITE), `SP-34` (recomendações de auditoria sem SQL pronto).

### D85 — Início da execução do plano de desenvolvimento do site: SP-28 (reenquadrado) e SP-26 implementados (02/07/2026)

- **SP-28 — descoberta que mudou o escopo do item.** O pedido original era "trocar a fonte de dados da aba Lacunas de `gaps` pra `gaps_v2`". Investigação revelou que a aba não é a ferramenta de gestão de dívida técnica que o nome sugeria: `loadComplementarity` sempre leu `FROM gaps`, mas a UI (`TAB_LABELS`) já filtrava implicitamente pra só 3 tipos de conteúdo de produto real (`guia_sem_atlas`/`atlas_sem_guia`/`sobreposicao`, 49 de 129 linhas) — uma comparação de cobertura entre o Guia e o Atlas, nada a ver com dívida técnica do banco (as outras 80 linhas de `gaps`, tipo `patch_v68_companies_fragmentadas`/`p26_foreign_keys_ativadas`, nunca apareciam na tela). **Decisão do usuário, perguntada nesta sessão: não expor gestão de lacunas/dívida técnica ao usuário final — não haverá tela para `gaps_v2`.** Ações tomadas: filtro de tipo movido pra dentro do SQL (`WHERE type IN (...)`, antes só implícito na UI — mais seguro contra vazamento de tipo novo no futuro); aba renomeada de "Lacunas" pra "Cobertura Guia × Atlas" no menu e no cabeçalho; sub-abas renomeadas ("Só no Guia"/"Só no Atlas"/"Nos dois").
- **SP-26 implementado.** `loadTrails` (linha ~1012 de `App.jsx`) ganhou as duas queries (`trail_cbos`, `trail_normas`), seguindo o mesmo padrão já usado ali para `trail_cnct_profiles`. Exibição adicionada em `TrailCard` (a visualização de cada trilha do catálogo CNCT, distinta da visualização de trilha Atlas que já tinha CBOs/normas via outras tabelas) — pills "CBO" e "NORMAS" logo abaixo da descrição. 98/55 linhas nas duas tabelas — nem toda trilha tem, tratado como seção omitida, não erro.
- **Validação:** sintaxe JSX confirmada válida via `@babel/preset-react` (`transformSync`, não é o mero balanceamento de chaves) — sem erro de compilação.
- **Backlog:** `SP-26` e `SP-28` marcados `✅ Resolvido`. `SP-35` criado — a pergunta de produto que ficava perdida dentro do gap `90032` (indicar visualmente que `030`/`004` são a mesma trilha em 2 modalidades) foi formalizada como item próprio, não implementada ainda.

### D86 — SP-12 Grupo B implementado: 6 tabelas `dm_*` ganharam UI (02/07/2026)

- **Achado antes de codar, que mudou o plano original:** o inventário do `SP-12_inventario_e_plano.md` propunha exibir `dm_roi_estudo`/`dm_dificuldade_estimada`/`dm_tecnologias_por_trilha`/`dm_soft_skills_por_trilha` no `TrailCard` do catálogo CNCT (`trails`, chave textual `TRL-*`). Antes de implementar, testei o JOIN real e descobri que `trail_id` nessas 4 tabelas na verdade referencia `atlas_trails.id` (chave numérica, trilha Atlas) — confirmado por `LEFT JOIN` com 0 linhas órfãs nas 4. Corrigi o plano na hora: a integração certa é em `loadAtlasTrails`/`trailDetail`, não em `TrailCard`. As outras 2 tabelas (`dm_premio_transferencia`, `dm_roteiro_carreira`) foram confirmadas por JOIN contra `cnct_profiles.id`, também 0 divergência.
- **Implementação:**
  - `loadAtlasTrails`: 4 novas queries agrupadas por `atlas_trails.id`, seguindo o padrão `groupBy` já usado ali para CBOs/normas.
  - `loadProfiles`: 2 novas queries agrupadas por `cnct_profiles.id`.
  - UI: novo card "Perfil da trilha" em `trailDetail` (ROI, dificuldade, tecnologias, soft skills — só renderiza se houver algum dos 4). Dois novos cards em detalhe de perfil CNCT: "Roteiro de Carreira Sugerido" (passo-a-passo com link e carga acumulada) e "Vale a Pena Migrar de Perfil?" (top 5 por ganho vitalício, com breakeven em meses).
- **Validação:** as 6 queries testadas por execução direta contra `fato_v109.db` — 0 erro de SQL, contagem de linhas batendo exatamente com o inventário (104+145+317+150+930+405). Sintaxe JSX confirmada via `@babel/preset-react` (`transformSync`) após as edições.
- **Nota de processo:** cometi e corrigi um erro de implementação nesta sessão — a primeira versão da query de `dm_premio_transferencia` usou um placeholder de parâmetro (`?`) sem necessidade e com um `.replace()` gambiarra, que não fazia sentido dado o helper `query(db, sql, params)` disponível. Corrigido pra trazer todas as linhas e agrupar em JS, mesmo padrão do resto do arquivo, antes de qualquer teste — não chegou a ser testado ou entregue na forma errada.
- **Nenhuma alteração de schema/dado no `.db`** — mudanças restritas a `App.jsx` (escopo SITE, Regra 0.1).
- **Próximos passos do SP-12** (não iniciados): Grupo C (10 tabelas, decisão de tela nova) e Grupo D (8 tabelas, revisar item a item — `dm_completude_fontes` em especial parece ter sido classificada errado no inventário original, mais perto de Grupo A).

### D87 — SP-12 Grupo C implementado: 10 tabelas `dm_*` ganharam UI (02/07/2026)

- **Achado antes de codar que evitou um bug real:** `dm_monopolio_oferta.sector_name` e `dm_densidade_setorial.sector_id` pareciam apontar pra `sector_codes` (taxonomia técnica do Guia, usada em `sectors_guia` nas trilhas) — testei o JOIN e bateu 0/215. Investigando mais, achei que existem **duas tabelas de setor de mercado com o mesmo formato de ID e nomes muito parecidos**: `sectors` (22 linhas, `type='social'`) e `industry_sectors` (12 linhas). Uma comparação nome-a-nome por `sector_id` mostrou que `industry_sectors` bate perfeitamente com `dm_densidade_setorial` até a última linha, enquanto `sectors` diverge a partir do item 3 (`Petróleo, Gás e Petroquímica` vs `Petróleo e Petroquímica`, e pior nas linhas seguintes). Confirmei contra código já existente (`company_sectors cs JOIN industry_sectors i`, linha ~1311) — `industry_sectors` já era a fonte usada pra setor de empresa em outro lugar do arquivo, then confirmado como certa.
- **Achado sobre `dm_qualidade_preditiva`/`dm_oferta_real`:** são pareadas 1:1 por `(instituicao, curso)` (47/47 confirmado), mas `curso` só bate com `cnct_profiles.name` em 37/47 (78%) — os outros 10 ficam sem perfil correspondente e simplesmente não aparecem em nenhuma tela. Não é erro, é cobertura parcial esperada (curso técnico sem perfil CNCT exato).
- **Implementação, tabela por tabela:**
  - `dm_versatilidade_trilhas` → badge no card "Perfil da trilha" (`trailDetail`, junto de ROI/dificuldade).
  - `dm_sinonimos_perfis` (bidirecional, tratado nos 2 sentidos) + `dm_rede_centralidade` + `dm_rede_comunidades` → novo card "Rede de Carreira" no detalhe de perfil CNCT.
  - `dm_oportunidade_estrategica` → integrado à agregação existente de `loadMercadoTrabalho` (mesma unidade `cbo×uf`), score exibido no card fechado e no detalhe por UF.
  - `dm_monopolio_oferta` + `dm_densidade_setorial` → novo painel "Panorama do Setor" na `ViewSectors`, via `industry_sectors` (ver achado acima).
  - `dm_competicao_talentos` → badge discreto no card de empresa (`ViewEmpresas`) — só 9 linhas hoje, não justificava tela própria.
  - `dm_qualidade_preditiva` + `dm_oferta_real` → novo card "Onde Estudar" no detalhe de perfil CNCT, com selo eMEC e taxa de ocupação de egressos.
- **Erro cometido e corrigido nesta sessão:** a variável `qualRows` que criei para `dm_qualidade_preditiva` colidia com uma `qualRows` pré-existente no arquivo (usada para `cnct_qualificacoes`, coisa totalmente diferente) — Babel acusou `Identifier 'qualRows' has already been declared` na validação de sintaxe. Renomeada para `qualidadeCursoRows` antes de qualquer entrega.
- **Validação:** todas as 10 queries testadas por execução direta contra `fato_v109.db`, 0 erro, contagens batendo com o inventário (145+21+85+85+1152+215+12+9+47+12). Sintaxe JSX revalidada via `@babel/preset-react` após a correção do nome de variável — OK.
- **Nenhuma alteração de schema/dado no `.db`** — escopo SITE (Regra 0.1).
- **Estado do SP-12: 16/36 tabelas com UI.** Restam Grupo A (7, decisão já tomada de não expor — infraestrutura interna) e Grupo D (8, ainda não revisadas item a item).

### D88 — Primeira renderização real do site: bug crítico de Hooks encontrado e corrigido (03/07/2026)

- **Contexto:** o usuário pediu para ver o site pela primeira vez desde que a reconciliação começou. Como não havia como mostrar uma captura estática confiável, montei um ambiente de render real: Chromium headless via Playwright (já disponível no sandbox), servindo o `portal/` local. As dependências externas do `index.html` original (React/ReactDOM via `unpkg.com`, Babel standalone, `sql.js-fts5` via `jsdelivr`) não são acessíveis no sandbox de rede — resolvidas instalando as versões exatas via `registry.npmjs.org` (domínio liberado) e servindo localmente. Isso foi só para viabilizar o teste; **não altera nada do que é entregue ao usuário final** (a arquitetura de CDN do `index.html` real permanece intacta).
- **Achado crítico, real, pré-existente (não introduzido pelas mudanças SP-12):** `App()` violava as Regras de Hooks do React. `useState` de `pendingProfile` e `useCallback` de `navigateTo` estavam declarados **depois** de dois `return`s condicionais (`if(loadError) return...`, `if(!dataLoaded) return <LoadingScreen/>`). Como `initDB()` é assíncrono, a primeira renderização sempre acontece com `dataLoaded=false` — o componente retorna antes de chamar esses dois hooks. Quando o carregamento termina e o componente re-renderiza, `dataLoaded` já é `true`, e agora ele chama hooks que **não existiam na sequência da renderização anterior** — React error #310 ("Rendered more hooks than during the previous render"), reproduzido de fato no teste (stack trace capturado). **Isso quebraria o site para qualquer usuário real, toda vez, assim que o banco terminasse de carregar** — o app nunca passaria da tela de loading em produção.
- **Por que isso não tinha sido pego antes:** aparentemente o site nunca tinha sido executado de ponta a ponta num navegador real por nenhuma das duas sessões — só editado como texto. A cadeia de sincronizações (v71→v109) validou schema, dado e sintaxe JSX (via Babel `transformSync`), mas nenhuma dessas checagens executa o componente React de fato, então não detectaria uma violação de regra de hooks.
- **Correção:** os dois hooks movidos para cima dos `return`s condicionais, junto aos demais hooks do topo do componente. **Validação em duas camadas:** (1) `eslint-plugin-react-hooks` (regra `rules-of-hooks`) rodado no arquivo inteiro — sanity-check confirmado contra um caso de teste sintético antes de confiar no resultado — 0 violações depois da correção; (2) reprodução end-to-end real: site carregado no Chromium headless, navegação testada pelas 10 abas, abertura de detalhe de perfil CNCT e de trilha Atlas, sem nenhum erro de console.
- **Achado secundário, não-crítico:** `runSmokeTest` (M-12) compara contagens hardcoded da v55 contra o banco atual — 5 de 6 contagens acusam "divergência" no console a cada carregamento, mas são só números de teste desatualizados (o dado real bate com o inventário do banco atual). Registrado como `SP-37`, não bloqueia nada, só gera ruído no console.
- **Screenshots capturados** (home, catálogo de trilhas CNCT com SP-26, lista e detalhe de perfil CNCT com os cards do SP-12 Grupo B/C, Mercado com `dm_oportunidade_estrategica`, Setores, Empresas, e a aba "Cobertura Guia × Atlas" renomeada) confirmam visualmente que todo o trabalho das sincronizações anteriores está funcionando de fato, não só sintaticamente correto.
- **Registrado como `SP-36` (crítico, resolvido) e `SP-37` (não-crítico, pendente) no backlog.**

### D89 — Auditoria de ruído em `companies`, a pedido do usuário: relatório entregue à sessão BANCO (04/07/2026)

- **Pedido:** o usuário pediu uma leitura "sem contexto prévio" das telas já mostradas, identificando ruído no banco e reportando como a sessão SITE reportaria à sessão BANCO — sabendo de antemão que havia nomes com aspas/pontuação estranha.
- **Método:** toda alegação foi verificada por query direta no `fato_v109.db`, não só inspeção visual das capturas de tela. Critério objetivo usado pra separar ruído de dado legítimo: empresa sem nenhuma linha em `sources` E sem nenhuma linha em `company_sectors` — 325/733 (44,3%) caem nesse critério, com 100% de precisão confirmada manualmente na amostra inspecionada (as 2 exceções — "3M Brasil", "4C Offshore" — têm fonte real e foram excluídas do relatório como falso-positivo de um filtro ingênuo por dígito).
- **Achados, por categoria (detalhe completo em `RELATORIO_RUIDO_BANCO.md`):**
  1. 23 linhas de `companies` são a taxonomia de setor do Guia reinserida como empresa — e pior, com rótulos que **divergem** de `sector_codes` (uma 3ª versão da mesma taxonomia, não uma cópia).
  2. Dezenas de fragmentos de frase/rascunho sem nenhum sentido como nome de empresa.
  3. **Achado mais sério:** 3 linhas que se parecem com vazamento de texto de IA/pipeline automatizado (uma contém literalmente "Request: The user in is my response to...", outra "continue? eu que" — linguagem de fronteira de turno de conversa, não nome de fonte). Recomendei à sessão BANCO investigar a origem antes de qualquer limpeza, porque se for pipeline ativo pode estar gerando mais lixo agora.
  4. Corpo normativo (ASME/IEC/NR-13/ISO/ABNT) catalogado em `companies` por falta de um campo de tipo de entidade — problema de modelagem, não corrupção.
  5. **Bug de UI confirmado:** "SETOR null" visível na aba Setores — 129/497 fontes `layer='sector'` (26%) sem `industry_sector_id`, e o código faz `String(sec.id)` sem tratar `null`, escrevendo a palavra literalmente na tela.
  6. Corrupção de texto com espaço inserido no meio de palavra, confirmada em 3 descrições de trilha (`TRL-CNCT-001`, `TRL-IMO-007`, `TRL-PM-013`) — ex: `operação`→`ope ração`, `NR-10`→`N R-10`.
- **Nenhuma alteração de dado feita nesta sessão** — o relatório foi entregue como está, sem apagar ou "consertar" nada no `.db`, porque a decisão de como tratar cada categoria (recategorizar vs. apagar vs. investigar origem) cabe à sessão BANCO (Regra 0.1). A única ação de escopo SITE identificada (tratar `null` na UI da aba Setores) ainda não foi implementada — fica como pendência dentro do `SP-38`.
- **Registrado como `SP-38`** (prioridade alta — integridade de dado + UX), com o relatório completo anexado ao pacote.

### D90 — Sincronização SITE×BANCO #6: v109→v128, recheck do relatório de ruído (04/07/2026)

- **Checagem de schema (Regra 1):** 0 tabelas/views que `App.jsx` espera estão faltando em `fato_v128.db`. `micro_atlas_pdf` intacto (78/99). Versão do arquivo bate exatamente com `MAX(db_versions_v2)` = 128 (segue corrigido desde D83).
- **Recheck do relatório de ruído (`SP-38`/D89), item a item, por query direta:**
  - Métrica geral: empresas sem fonte E sem setor caiu de 325/733 (44,3%) para 239/651 (36,7%). 86 linhas de ruído removidas, 0 linhas novas de ruído introduzidas.
  - **Categoria 3 (possível vazamento de IA/pipeline) — resolvida.** As 3 linhas mais graves (`id 10228`, `10230`, `10279`) não existem mais.
  - **Categoria 2 (fragmentos de frase) — maioria resolvida**, restam 2 de aproximadamente 11.
  - **Categoria 1 (taxonomia de setor duplicada em `companies`) — sem nenhuma mudança**, as 23 linhas com crase continuam idênticas.
  - **Categoria 5 (SETOR null) — sem nenhuma mudança**, ainda exatamente 129/497 fontes sem `industry_sector_id`.
  - **Categoria 6 (corrupção de texto) — sem nenhuma mudança** nas 3 trilhas já reportadas; revendo `TRL-PM-013` mais a fundo nesta rodada, notei 2 ocorrências adicionais do mesmo padrão na mesma frase (`venda`→`vend a`, `planejamento`→`pla nejamento`) que não tinham sido citadas no relatório original — mesmo padrão, não uma regressão nova.
  - **Leitura:** o padrão de correção (tudo ou nada por categoria, não parcial dentro de uma categoria) sugere limpeza pontual/manual dos casos mais visíveis, não uma correção estrutural — as categorias que dependem de decisão de schema (campo de tipo em `companies`) ou pipeline de texto seguem intocadas.
- **Ação tomada:** `portal/db.js` atualizado (`DB_PATH`: `fato_v109.db` → `fato_v128.db`). Relatório de recheck (`RECHECK_RUIDO_v109_v128.md`) anexado ao pacote. `SP-38` atualizado de "relatório entregue" para "parcial, com detalhamento do que foi e não foi resolvido".

### D91 — Pedidos/reclamações/sugestões formais adicionais à sessão BANCO (04/07/2026)

O usuário pediu diretamente por mais pedidos/reclamações/sugestões pra sessão BANCO, além do que já estava registrado. Dois pontos novos, verificados por query direta no `fato_v128.db` antes de formalizar:

- **`SP-39` — 3 taxonomias de setor concorrentes.** `sector_codes` (29 linhas, taxonomia técnica do Guia), `sectors` (22, `type='social'`), `industry_sectors` (12, usado por mercado/empresas) — ligadas por uma ponte fina de 12 linhas (`sector_mapping`: 7 `direct`, 4 `inferred`, 1 `partial`). Isso não é hipotético: já precisamos investigar isso a fundo 2 vezes nesta reconciliação (D87, e de novo ao revisar antes deste pedido) só pra confirmar qual tabela usar em cada contexto, sem conseguir nos apoiar em nenhuma documentação existente. Pedido: escolher 1 taxonomia canônica por domínio, ou pelo menos documentar a relação em `SCHEMA.md`.
- **`SP-40` — fragilidade de chave em texto livre + confiabilidade de geração de patch.** Verificado: `dm_oportunidade_estrategica.cbo_6digitos` só bate com `cbo_canonical.cbo_padronizado` em 1134/1152 (98,4%), `dm_qualidade_preditiva.curso` só bate com `cnct_profiles.name` em 37/47 (78%) — os 18 e 10 órfãos, respectivamente, ficam invisíveis silenciosamente (sem erro, só sem aparecer). Isso soma com o padrão já visto 2 vezes de patch gerado divergindo do que alega fazer (gap 90026; e as 10 `UPDATE`s fora de escopo do patch do SP-27, que só não tiveram efeito por uma trava de segurança que por acaso já existia no SQL). Sugestão: chave numérica estável em tabelas analíticas novas, e diff automático entre o que um patch declara mudar e o que muda de fato, antes de aplicar.
- **Verificação de bônus, sem necessidade de ação:** conferi se os 2 tipos novos que apareceram em `gaps` desde a última vez que ajustei nosso filtro da aba "Cobertura Guia × Atlas" (`lacuna_join`, `recomendacao`) eram conteúdo de produto que estaríamos excluindo sem querer — não são; ambos são notas de processo interno (o mesmo tipo de conteúdo que já filtramos corretamente desde o `SP-28`). Nosso filtro (`WHERE type IN ('guia_sem_atlas','atlas_sem_guia','sobreposicao')`) continua correto, sem ajuste necessário do nosso lado.
- **Reconhecimento, não pedido:** a correção da defasagem de nome-de-arquivo vs. `MAX(db_versions_v2)` (D81) se manteve firme por 3 sincronizações seguidas (v109, v128) — vale reconhecer que isso ficou resolvido de forma duradoura.

### D92 — Autoauditoria da sessão SITE (04/07/2026)

O usuário pediu que eu auditasse meu próprio trabalho com o mesmo rigor aplicado ao BANCO. Achados, com evidência (detalhe completo em `AUTOAUDITORIA_SITE.md`):

- **Achado real, corrigido:** eu vinha inserindo minhas próprias notas de sincronização na tabela `db_versions` — a mesma tabela do histórico real do BANCO (1-80, depois migrado pra `db_versions_v2`) — usando números escolhidos por mim (98-109), criando um buraco de numeração (81-107 ausente) e risco de colisão de namespace. **Exatamente a categoria de risco que venho cobrando do BANCO** (D79, SP-39/40). Corrigido: criada tabela própria `site_sync_log`, minhas entradas migradas pra lá, `db_versions` restaurada limpa até v80 com uma única nota de rodapé explicando a migração. O pacote anterior (`fato_v109.db`, já entregue) mantém o problema original — não reemitido retroativamente, mas registrado aqui.
- **Achado de documentação, corrigido:** `RELATORIO_RUIDO_BANCO.md` seguia sem aviso de que já existe um recheck mais novo (`RECHECK_RUIDO_v109_v128.md`) — quem abrisse só o relatório original seria enganado pelos números desatualizados (325/733 em vez de 239/651). Adicionado aviso no topo apontando pro recheck.
- **Verificado e confirmado sólido:** as 11 chaves de JOIN do Grupo B/C continuam sem órfãos no v128 (não só no v109 onde foram implementadas); checagem de schema (Regra 1) limpa; o bug crítico de hooks (D88) confirmado corrigido também no v128 via render real, não só no banco onde foi encontrado; `App.jsx` idêntico byte a byte entre as rodadas do Grupo C e da auditoria de ruído (sem mudança silenciosa).
- **Erro de processo próprio, sem impacto no produto:** ao re-testar contra o v128, sobrescrevi por engano o `db.js` adaptado pro meu ambiente de teste com a versão real do projeto (que aponta pro CDN bloqueado no meu sandbox) — as 10 capturas de tela saíram vazias/idênticas (403 do CDN). Percebido pelo tamanho suspeito dos arquivos, corrigido, retestado do zero. Não afetou nenhum artefato entregue.
- **Limitação registrada:** não foi feita reinspeção visual pixel a pixel de cada tela nesta rodada — validação foi por ausência de erro de console + confirmação de schema/join (mesmo padrão de evidência usado no resto do projeto).

### D93 — Achado fundamental: `index.html` real nunca renderizava para nenhum visitante, independente do bug de hooks (D88) — corrigido (05/07/2026)

- **Contexto:** a pedido do usuário ("reorganize e planeje o futuro do site, quebre os monólitos, pense em arquitetura"), iniciei um levantamento completo de arquitetura. Ao testar o `portal/index.html` real do projeto (não minha cópia de teste) — trocando *apenas* os domínios de CDN bloqueados no meu sandbox por espelhos locais, sem alterar nenhuma linha de lógica — reproduzi exatamente os mesmos dois erros que eu tinha encontrado e corrigido *só na minha cópia de teste* durante a sessão do D88: `exports is not defined` e `Cannot read properties of undefined (reading 'useState')`.
- **Causa raiz, 2 problemas empilhados, ambos anteriores e independentes do bug de hooks do D88:**
  1. O shim `__babelRequire` só tratava `require("./db.js")` — não tratava `require("react")`/`require("react-dom")`, que o plugin `transform-modules-commonjs` do Babel gera a partir de `import React from "react"`. Além disso, faltavam os globais `window.exports`/`window.module` que código CommonJS transpilado espera encontrar no ambiente.
  2. O processamento declarativo (`<script type="text/babel" data-presets="react">`) usa por padrão o novo JSX runtime automático (`react/jsx-runtime`), inexistente no build UMD do React carregado via `<script>` global — só existe no pacote ES module.
- **Confirmação empírica, não suposição:** reproduzi o crash com a lógica real do projeto, depois apliquei a mesma correção que já validara no meu ambiente de teste, e retestei — sem nenhum erro de console, banco carregado, app montado.
- **Implicação para o D88:** a claim de "reproduzido end-to-end... sem erro" feita naquela sessão era verdadeira só para a minha cópia de teste (que eu já tinha silenciosamente corrigido pra viabilizar o teste), não para o arquivo `index.html` real do projeto — eu não tinha percebido, na hora, que as correções do meu ambiente de teste divergiam do arquivo real entregue. **Isso significa que, até esta sessão, o site nunca tinha renderizado de fato para nenhum visitante real**, independente do bug de hooks já corrigido.
- **Correção aplicada:** `portal/index.html` real atualizado com (1) polyfill de `exports`/`module` + `require` cobrindo `react`/`react-dom`/`./db.js`; (2) troca do processamento declarativo por `Babel.transform` explícito com `runtime: "classic"`. Mesma lógica já usada e validada no ambiente de teste, agora portada pro arquivo real.
- **Lição de processo:** ao validar um fix, preciso confirmar que o ambiente de teste é *idêntico* ao artefato entregue, não só equivalente em espírito — qualquer patch aplicado só pro ambiente de verificação, sem ser espelhado de volta pro arquivo real, invalida silenciosamente a validação. Ver `AUTOAUDITORIA_SITE.md` e o estudo de arquitetura (`ESTUDO_ARQUITETURA_E_PLANO.md`) para o levantamento completo que motivou este achado.

### D94 — Estudo de arquitetura e plano completo (05/07/2026)

A pedido do usuário, assumi o papel de arquiteto e produzi um estudo completo de arquitetura, presente e futuro: `ESTUDO_ARQUITETURA_E_PLANO.md`. Cobre: raio-x do monólito (`App.jsx`, 2685 linhas, 5 maiores funções mapeadas por linha), avaliação honesta do sistema visual (590 estilos inline, 75 cores soltas, tipografia padrão do sistema, contra a diretriz de design deste ambiente), segurança (banco de 7,2MB com 37 tabelas internas baixável por qualquer visitante, sem SRI nas dependências de CDN — nada urgente, registrado pro futuro), proposta concreta de modularização em ES modules nativos (sem exigir bundler ainda), faxina de pasta (27 documentos .md, 5838 linhas — achado central: `_LEIA_PRIMEIRO.md`/`ESTADO_ATUAL.md` e os 3 changelogs são fatias de tempo diferentes, não duplicatas — consolidar, não apagar), consolidação de 10 sprints soltos em 1 arquivo proposto, gaps restantes do lado site (SP-12/19/35/37), checklist de sincronização formalizado, síntese das lições D79-D93, e roadmap por prazo.

**Nenhuma reorganização de arquivo foi executada nesta sessão** (consolidação de docs, quebra do monólito, renomeação de sprints) — ficou registrada como plano, não ação, por decisão explícita do usuário ("nada precisa ser imediato"). As únicas ações efetivamente aplicadas foram as 2 correções triviais e seguras já registradas em D92/D93 (poluição de `db_versions`, `index.html` quebrado).

### D95 — Execução do curto prazo do estudo de arquitetura (05/07/2026)

A pedido do usuário ("vamos seguir os passos indicados pelo estudo"), executei os itens de curto prazo do `ESTUDO_ARQUITETURA_E_PLANO.md` (D94). Cada um validado por teste real, não só editado:

- **Segurança — SRI + versão travada nos scripts de CDN.** `react@18`/`react-dom@18`/`@babel/standalone` (sem versão) agora são `react@18.3.1`/`react-dom@18.3.1`/`@babel/standalone@8.0.3`, com `integrity=` (SHA-384) calculado a partir dos pacotes reais instalados via `registry.npmjs.org`. **Limitação honesta:** não consegui confirmar byte a byte contra `unpkg.com` (fora do meu sandbox) — unpkg serve os arquivos do pacote npm publicado sem alteração, mas não é 100% verificado por mim diretamente. Testado com sucesso (86.162 caracteres renderizados em `#root`, hash batendo).
- **`SP-37` resolvido de verdade, não só atualizado.** `runSmokeTest` mudou de "comparar contra número exato hardcoded" (que gerava falso alarme a cada sync) para "checar se caiu abaixo de um piso conhecido" — só dispara alerta se os números **diminuírem**, nunca por crescimento legítimo de dado. Piso atual = v128 confirmado (35/572/397/497/98/187).
- **`SP-35` implementado.** Detecção genérica de trilhas-irmãs por nome-base (removendo sufixo de modalidade entre parênteses) — não hardcoded pro par `004`/`030` que motivou o achado, funciona pra qualquer par futuro. Exibido como nota discreta no `TrailCard`.
- **10 sprints consolidados em `portal/HISTORICO_SPRINTS.md`** — conteúdo integral verificado (100% de cada arquivo original confirmado presente no consolidado antes de mover os originais pra `portal/_arquivo/`).
- **Dois READMEs obsoletos arquivados** (`_arquivo/README_raiz_obsoleto_v94.md`, `portal/_arquivo/README_portal_obsoleto_sprint17.md`) — conferido antes que não tinham conteúdo único fora do que já existe em `_LEIA_PRIMEIRO.md`.
- **`PLANO_ELIMINACAO_IEDU.md` + 3 JSONs de extração arquivados** — item concluído (`SP-27`), preservado como prova de trabalho feito.
- **3 changelogs renomeados** pra refletir escopo real: `CHANGELOG_PORTAL.md` (era `_CHANGELOG.md` — changelog do **produto portal**, versões v3.x-v5.x do `App.jsx`, eixo diferente do banco), `CHANGELOG_BANCO_v81-v97.md` (era `CHANGELOG.md`), `CHANGELOG_BANCO_v102-v109.md` (era `CHANGELOG_fato.md`). **Gap honesto, não fabricado:** v98-v101 não têm changelog do BANCO em nenhum dos dois arquivos — não inventei conteúdo pra preencher.

**Duas correções de curso durante a execução, registradas com a mesma transparência de sempre:**
1. Minha recomendação original no D94 ("consolidar `_LEIA_PRIMEIRO.md`/`ESTADO_ATUAL.md` num único ponto de entrada") estava **imprecisa** — lendo os dois por completo, são tipos de documento genuinamente diferentes (protocolo atemporal vs. retrato de momento), não duplicatas. Corrigido: adicionei referência cruzada entre os dois (Regra 9 em `_LEIA_PRIMEIRO.md`, nota recíproca em `ESTADO_ATUAL.md`) em vez de fundir.
2. Ao editar `_LEIA_PRIMEIRO.md`, apaguei sem querer um parágrafo real (o de validação do pipeline de patch, "Testada e validada 27/06") no primeiro `str_replace` — percebido na conferência imediata (`grep` do parágrafo depois da edição), restaurado antes de prosseguir. Nenhum conteúdo ficou perdido no arquivo final.

**Estado final:** `App.jsx` validado por sintaxe (Babel) e por execução real (Playwright, 8 abas, zero erro de console) depois de todas as mudanças. Nenhuma referência quebrada — confirmado por grep que nenhum código referencia os arquivos movidos/renomeados, e as referências textuais em documentos ativos (`_LEIA_PRIMEIRO.md`, `ESTADO_ATUAL.md`, `SCHEMA.md`) foram corrigidas para os novos nomes. Documentos históricos (`_BACKLOG.md`, `_DECISIONS.md`, sprints arquivados) **não foram reescritos retroativamente** — só os documentos vivos.

**Itens de médio/longo prazo do estudo (quebra do monólito `App.jsx`, expansão do sistema de tokens, direção visual de assinatura, reavaliação de arquitetura client-side) permanecem como plano, não executados** — por serem de esforço maior e não terem sido pedidos nesta rodada.

### D96 — SP-12 Grupo D implementado, SP-12 concluído por completo (05/07/2026)

Continuação do roadmap de médio prazo do `ESTUDO_ARQUITETURA_E_PLANO.md`. As 8 tabelas restantes do SP-12:

- **4 expostas como produto:** `dm_compras_governo`, `dm_concursos_tecnicos`, `dm_noticias_industria`, `dm_colapso_silencioso` — novo painel "📡 Sinais de Mercado Regional" na aba Mercado, recolhido por padrão (baixo volume de linha, não justificava abrir sempre). `dm_colapso_silencioso` é o mais valioso — cruza importação de máquina com oferta de curso por UF e já vem com um campo `sinal_oferta_trabalho` que literalmente diz "EVITAR RECOMENDAR ESTA REGIÃO" em alguns casos — destacado com alerta visual (borda vermelha) quando presente.
- **4 confirmadas como infraestrutura interna, sem UI:** `dm_curso_cbo_bridge` (tabela-ponte), `dm_cbo_pendentes` (lista de pendência de curadoria do BANCO — mesma categoria do achado do SP-38), `dm_completude_fontes` (confirmada a suspeita do próprio `ESTUDO_ARQUITETURA_E_PLANO.md` — é auditoria de qualidade de fonte, 928 linhas, claramente não é produto), `dm_importacoes_maquinas` (dado bruto de NCM que já vem resumido dentro de `dm_colapso_silencioso` — expor separado seria redundante).
- **Achado novo, reforça `SP-39`:** os campos de "setor" dessas 4 tabelas de produto são uma **4ª taxonomia de setor informal**, divergente de `sector_codes`/`sectors`/`industry_sectors`. Exibidos como texto livre, sem forçar join com nenhuma taxonomia existente — atualizado o pedido `SP-39` pra refletir 4 taxonomias, não 3.
- **Validação:** as 4 queries testadas por execução direta (15+15+12+25 linhas, batendo com o inventário), sintaxe JSX validada via Babel, e render real (Playwright) confirmando o painel abre e mostra conteúdo sem erro de console.

**`SP-12` está concluído por completo** — as 36 tabelas/views `dm_*` originais foram todas revisadas: 20 ganharam UI (Grupos B, C, D), 16 confirmadas como infraestrutura interna sem necessidade de exposição (Grupo A + as 4 do Grupo D acima).

### D97 — Expansão do sistema de tokens de cor (05/07/2026)

Continuação do roadmap de médio prazo do `ESTUDO_ARQUITETURA_E_PLANO.md`. As 76 cores hex antes soltas no arquivo (77 distintas encontradas, 1 falso positivo — `#310` era um número de erro do React citado num comentário, não uma cor) agora têm nome num único lugar (`const C`), e as 63 que não tinham token ainda foram substituídas em **361 pontos do arquivo** (as outras ~283 ocorrências já usavam os 13 tokens que já existiam antes desta sessão).

**Erro cometido e corrigido durante a execução, com a mesma transparência de sempre:** a primeira tentativa de substituição usou `re.escape()` (função pra construir padrão de regex) mas aplicou o resultado com `.count()`/`.replace()` de string pura — `re.escape` insere uma barra invertida antes do `#`, que nunca existiu no arquivo, então a primeira rodada teve **0 substituições reais**, só expandiu o objeto `C` com 63 tokens mortos (não usados em lugar nenhum). Percebido imediatamente ao conferir a contagem (esperava dezenas, veio zero), corrigido trocando pra correspondência de string literal, sem regex. Refeito do zero, com verificação de que não sobrou nenhuma ocorrência bruta fora do próprio bloco de definição de `C`.

**Verificação, em 4 camadas (mais rigorosa que o padrão usual do projeto, por ser um refactor puro que não deveria mudar nada visível):**
1. Sintaxe válida (Babel).
2. Console limpo em execução real (Playwright).
3. Zero violação de Regra de Hooks (`eslint-plugin-react-hooks`).
4. **Comparação pixel a pixel** entre a versão anterior e a nova, nas 8 telas principais (incluindo abrir detalhe de perfil e o painel de Sinais de Mercado): **5 de 8 telas idênticas, pixel por pixel, 0 diferença.** As outras 3 tiveram diferença de 6 a 23 pixels num total de até 35 milhões (0,0003%-0,0004%), todas com variação de 1-2 unidades num único canal RGB — inspecionado pixel a pixel e confirmado como ruído de anti-aliasing de fonte entre duas renderizações separadas (números da barra de navegação), não mudança de cor real.

**Nenhuma cor mudou. 361 pontos do código agora referenciam um nome semântico (`C.emerald`, `C.redBorder`, `C.blueDim`, etc.) em vez de hex solto.** Nomes agrupados por família (fundo, texto, azul, verde, roxo, laranja/âmbar, vermelho, e variantes translúcidas de borda pra pills) — ver o objeto `C` expandido, linhas iniciais do arquivo.

**Fora do escopo desta rodada, permanece como estava:** não foi feita nenhuma tentativa de *reduzir* as 76 cores pra uma paleta menor/mais consistente (ex: `#1c0f00`/`#1c1207`/`#291a00`/`#1a1000` são 4 tons de marrom-escuro quase idênticos que provavelmente poderiam ser 1 só) — isso seria uma decisão de design, não só nomear o que já existe, e fica registrado como possível próximo passo, não decidido unilateralmente aqui.

### D98 — Roteiro da quebra do monólito escrito e validado antes de executar (05/07/2026)

A pedido do usuário, antes de começar a quebrar `App.jsx` (2823 linhas, 41 funções), escrevi o roteiro completo (`ROTEIRO_QUEBRA_MONOLITO.md`) — não como comunicado do que eu ia fazer, mas como guia pra mim seguir. Antes de escrever qualquer ordem de execução, validei empiricamente o maior risco técnico: hoje o `index.html` busca `App.jsx` como arquivo único e transpila tudo de uma vez — pra quebrar em módulos, o navegador precisa resolver múltiplos arquivos `.jsx`/`.js` em ordem de dependência, sem bundler.

Construí um carregador mínimo (busca de imports por regex, resolução de caminho relativo, cache, execução topológica) e testei com 3 arquivos reais (`theme.js` → `Widget.jsx` → `Main.jsx`, import nomeado + default, componente usando token de outro arquivo). Primeira tentativa teve um bug real (tentava buscar `"react"` como se fosse arquivo, 404) — corrigido, retestado, renderizou certo.

O roteiro mapeia os 41 itens do arquivo em 23 módulos novos, ordenados por risco crescente (tokens/utils primeiro, views grandes por último), com o mesmo protocolo de verificação de 4 camadas usado no D97 repetido a cada etapa.

### D99 — Etapa 1 da quebra do monólito: `theme/tokens.js` + `utils/helpers.js` extraídos (05/07/2026)

Primeira etapa executada do `ROTEIRO_QUEBRA_MONOLITO.md` (D98). Antes de extrair, encontrei e corrigi uma lacuna do próprio D97: a expansão de tokens só tinha tratado as 63 cores **novas** — os 13 tokens que já existiam antes desta sessão (`C.muted`, `C.border`, etc.) ainda tinham **238 ocorrências em hex bruto** não convertidas pelo resto do arquivo. Terminei essa conversão primeiro (mesmo processo do D97, mesma verificação de 4 camadas — 6/8 telas idênticas, 2/8 com o mesmo ruído de anti-aliasing já visto, console limpo, 0 violação de hooks) — não fazia sentido modularizar um sistema de tokens ainda inconsistente.

**Extração:** `theme/tokens.js` (`C`, `pill`, `card`, `btn`, `SEL`, 17 linhas) e `utils/helpers.js` (`groupBy`, `slugify`, 16 linhas) — os dois módulos de menor risco do roteiro (zero dependência). `App.jsx` caiu de 2823 pra 2796 linhas (a redução é menor do que o tamanho dos dois módulos novos porque a extensão da paleta de cores em D97 tinha inflado o arquivo primeiro).

**Mecanismo de carregamento trocado no `index.html`:** o fetch-de-arquivo-único foi substituído pelo carregador de múltiplos módulos já testado isoladamente antes desta sessão (`ROTEIRO_QUEBRA_MONOLITO.md` §0) — descoberta de imports por regex, busca+transpilação recursiva de dependências, execução em ordem topológica. Integrado ao shim de `require` já existente (que trata `react`/`react-dom`/`./db.js`).

**Verificação, 4 camadas:**
1. Sintaxe válida nos 3 arquivos (Babel).
2. Execução real (Playwright): app carrega, `#root` com 86.162 caracteres (mesmo valor exato do teste anterior), zero mensagem de console além do smoke test conhecido.
3. Zero violação de Regra de Hooks.
4. **Comparação pixel a pixel contra a última versão monolítica boa conhecida, nas 8 telas: 8/8 idênticas, 0 diferença** — melhor resultado que o do D97 (que teve ruído de anti-aliasing em 2 telas), possivelmente porque essa extração não tocou em nenhum valor de cor, só moveu código de lugar.

**Próxima etapa do roteiro:** Etapa 2 (`components/badges.jsx`, `LoadingScreen.jsx`, `Nav.jsx`).

### D100 — Etapa 2 da quebra do monólito: `components/badges.jsx`, `LoadingScreen.jsx`, `Nav.jsx` + `context/DataContext.js` extraídos (05/07/2026)

Segunda etapa do `ROTEIRO_QUEBRA_MONOLITO.md`. Achado antes de começar, que não estava no roteiro original: `Tag` (um dos componentes de badge) usa `useData()`, e `useData()`/`DataContext` moravam dentro de `App.jsx` — extrair `Tag` pra um arquivo próprio criaria uma dependência circular (`App.jsx` importa o componente, o componente importa de volta de `App.jsx`). Resolvido criando um módulo extra, não previsto no roteiro original: `context/DataContext.js` — confirmado que **17 componentes** usam `useData()`, então vale a pena ser um módulo próprio desde já, não só quando o próximo componente precisar.

**Extraído:**
- `context/DataContext.js` (9 linhas) — `DataContext`, `useData`.
- `components/badges.jsx` (72 linhas) — `LAYER_META`, `URL_STATUS_META`, `UrlStatusBadge`, `Tag`, `FavBtn`, `CopyBtn`, `URL_CONF_META`, `urlConfMeta`, `TIER_COLOR`, `TierBadge`, `IMPACT_COLOR`, `ImpactBadge`. Peças que estavam espalhadas em 4 pontos distintos do arquivo original (linhas ~26, ~558, ~1814, ~2388) — reunidas por serem a mesma família (badge + metadado de cor que o alimenta).
- `components/LoadingScreen.jsx` (13 linhas).
- `components/Nav.jsx` (89 linhas).

`App.jsx`: 2796 → 2638 linhas.

**Verificação, 4 camadas:**
1. Sintaxe válida nos 5 arquivos (Babel).
2. Execução real: `#root` com 86.162 caracteres (idêntico às 2 rodadas anteriores), zero mensagem de erro.
3. Zero violação de Regra de Hooks nos 3 arquivos `.jsx` novos + `App.jsx` (1 erro aparente na primeira rodada era do meu próprio arquivo de teste sintético usado para validar o linter, removido antes de reconferir).
4. **Comparação pixel a pixel:** 7/8 telas idênticas, 1 com o mesmo ruído de anti-aliasing já visto nas rodadas anteriores (máximo 2 unidades de canal, mesma área da barra de navegação).

**Próxima etapa do roteiro:** Etapa 3 (`components/SourceCard.jsx`, `TrailCard.jsx`).

### D101 — Etapa 3 da quebra do monólito: `components/SourceCard.jsx`, `TrailCard.jsx` extraídos (05/07/2026)

Terceira etapa do `ROTEIRO_QUEBRA_MONOLITO.md`. Confirmada a dependência já prevista no roteiro: `TrailCard` usa `SourceCard` internamente (na lista de fontes de cada etapa expandida) — extraídos na ordem certa, `TrailCard.jsx` importando de `./SourceCard.jsx`.

**Extraído:**
- `components/SourceCard.jsx` (108 linhas) — card de fonte individual, com painel expandido (CBOs, certificações, normas, custo).
- `components/TrailCard.jsx` (98 linhas) — card de trilha do catálogo CNCT, com etapas expansíveis, usando `SourceCard` pra listar as fontes de cada etapa.

`App.jsx`: 2638 → 2443 linhas.

**Verificação, 4 camadas:**
1. Sintaxe válida nos 3 arquivos.
2. Execução real: `#root` com 86.162 caracteres (mesmo valor de todas as rodadas anteriores), zero mensagem de erro.
3. Zero violação de Regra de Hooks.
4. **Comparação pixel a pixel:** 6/8 telas idênticas, 2 com o mesmo ruído de anti-aliasing já visto (máximo 2 unidades de canal).

**Próxima etapa do roteiro:** Etapa 4 (`data/*.js` — as 13 funções `load*`, mais `searchIndex.js`).

### D102 — Etapa 4 da quebra do monólito: as 13 funções de carga de dado + índice de busca extraídas (05/07/2026)

Quarta e maior etapa até agora do `ROTEIRO_QUEBRA_MONOLITO.md`. Extraídas todas as funções `load*`, a orquestração (`loadCore`), o smoke test, e o índice de busca FTS5 — 6 arquivos novos em `data/`:

- `data/loadSocialTechnical.js` (118 linhas) — `loadTagsAndFormats`, `loadSourceTags`, `loadSocial`, `loadCourseEnrichment`, `loadTechnical`.
- `data/loadTrailsProfiles.js` (250 linhas, a maior) — `loadTrails`, `loadProfiles`, `loadGuideBlocks`, `loadAtlasTrails`.
- `data/loadSectorsGuia.js` (119 linhas) — `loadComplementarity`, `loadSectors`, `loadGuia`, `loadSectorFato`.
- `data/loadMercadoEmpresas.js` (126 linhas) — `loadCompanies`, `loadMercadoTrabalho`, `loadSinaisMercado`.
- `data/searchIndex.js` (52 linhas) — `buildSearchIndex`, `ftsQueryFromTerm`, `searchFTS`.
- `data/loadCore.js` (60 linhas) — `loadCore` (importa e orquestra os 4 módulos de `load*` acima), `runSmokeTest`.

`App.jsx`: 2443 → 1745 linhas — primeira vez abaixo de 2000. Import de `query`/`groupBy`/`slugify` removido do topo do arquivo (não são mais usados diretamente ali, só dentro dos módulos de dado).

**Verificação, 4 camadas — a mais forte até agora, com uma evidência extra:**
1. Sintaxe válida nos 7 arquivos.
2. Execução real: `#root` com 86.162 caracteres (idêntico a todas as rodadas), **e o próprio smoke test do M-12 confirmou as 6 métricas batendo exatamente com o piso conhecido (35/572/397/497/98/187)** — prova de que os objetos retornados pelas funções recém-modularizadas são estruturalmente idênticos aos de antes, não só que a tela parece igual.
3. Zero violação de Regra de Hooks nos arquivos `.jsx`/`.js` novos.
4. **Comparação pixel a pixel:** 7/8 telas idênticas, 1 com o mesmo ruído de anti-aliasing já visto.

**Próxima etapa do roteiro:** Etapa 5 — views pequenas (`ViewHome`, `ViewAbout`, `ViewTrails`, `ViewEmpresas`), primeira vez extraindo uma `View` completa (JSX + hooks de estado local).

### D103 — Etapa 5 da quebra do monólito: views pequenas extraídas (05/07/2026)

Quinta etapa do `ROTEIRO_QUEBRA_MONOLITO.md` — primeira vez extraindo uma `View` completa (JSX + hooks de estado local), não só dado ou componente puro.

**Achado antes de extrair, não previsto no roteiro original:** duas funções de formatação (`fmtMoeda`, `fmtNum`) estavam soltas no meio do arquivo, entre `ViewEmpresas` e `ViewMercadoTrabalho` — mas usadas por `ViewMercadoTrabalho` e `ViewProfiles` (que ainda não foram extraídas). Movidas para `utils/helpers.js`, junto de `groupBy`/`slugify` (mesma categoria: função pura de formatação, sem dependência de React).

**Extraído:**
- `views/ViewHome.jsx` (74 linhas) — página inicial.
- `views/ViewTrails.jsx` (50 linhas) — catálogo de trilhas, usa `TrailCard`.
- `views/ViewEmpresas.jsx` (99 linhas) — catálogo de empresas, usa `urlConfMeta`.
- `views/ViewAbout.jsx` (32 linhas) — página "Sobre".
- `fmtMoeda`/`fmtNum` movidas para `utils/helpers.js` (23 linhas agora).

`App.jsx`: 1745 → 1509 linhas. Imports órfãos limpos no processo (`TrailCard`, `urlConfMeta`, `URL_CONF_META` não são mais usados diretamente em `App.jsx`).

**Verificação, 4 camadas:**
1. Sintaxe válida nos 6 arquivos.
2. Execução real: `#root` com 86.162 caracteres, smoke test com as 6 métricas batendo exatamente com o piso.
3. Zero violação de Regra de Hooks.
4. **Comparação pixel a pixel, agora em 9 telas** (incluí "Sobre" pela primeira vez, já que é uma das views extraídas nesta rodada): 6/9 idênticas, 3 com o mesmo ruído de anti-aliasing já visto (máximo 1-2 unidades de canal).

**Próxima etapa do roteiro:** Etapa 6 — views médias (`ViewGuideBlocks`, `ViewGaps`, `ViewExplore`, `ViewMercadoTrabalho`).

### D104 — Etapa 6 da quebra do monólito: views médias extraídas, com achado e correção de bug real (05/07/2026)

Sexta etapa do `ROTEIRO_QUEBRA_MONOLITO.md` — extraídas `ViewExplore` (169 linhas), `ViewMercadoTrabalho` (208 linhas), `ViewGuideBlocks` (128 linhas), `ViewGaps` (136 linhas).

**Achado sério no meio do processo, encontrado pelo próprio protocolo de verificação (pixel-diff), não por sorte:** a primeira versão de `views/ViewGaps.jsx` que escrevi **não era uma cópia literal** do componente original — eu tinha lido o código antes de criar os arquivos, mas na hora de escrever reconstruí de memória em vez de copiar o texto exato, e essa reconstrução introduziu 3 bugs reais:
1. Lista de opções de filtro de impacto **dinâmica** (calculada a partir do dado) em vez da lista **fixa** original (`["Todos","Muito alto","Alto","Médio","Baixo"]`) — isso deixava vazar valores de status interno (como "Resolvido") como se fossem opção de filtro de impacto.
2. Os **3 layouts diferentes por aba** (`guia_sem_atlas` mostra empresa+trilhas+detalhe; `atlas_sem_guia` mostra recurso+trilhas; `sobreposicao` mostra fonte+observação+presença) foram **fundidos num único card genérico**, fazendo campos que deveriam ser mutuamente exclusivos aparecerem juntos.
3. O prefixo de nível de impacto (`"Alto — "`) não era removido do texto de detalhe, causando duplicação visual com o badge de impacto ao lado.

**Como foi encontrado:** a comparação pixel a pixel de rotina (§ protocolo de verificação) acusou `10_cobertura.png: TAMANHOS DIFERENTES` — não era ruído de anti-aliasing, a página estava **50% mais alta** (5092px vs 3401px) e com **3,4x mais texto** (13744 vs 3978 caracteres) na versão nova. Investigado antes de aceitar qualquer coisa: comparei a contagem de entradas (26 em ambas — a lógica de filtro não estava quebrada), depois o texto renderizado linha a linha, depois o código-fonte original (extraído do último snapshot funcional, `render_etapa5`) contra o que eu tinha escrito — aí ficou claro que eram estruturalmente diferentes.

**Correção:** apaguei o arquivo errado e reescrevi usando o texto original extraído **verbatim**, mudando só os imports (necessários pra modularização) — nenhuma outra linha alterada. Retestado: `bodyHeight` e `textLen` bateram exatamente com o valor original (3401px / 3978 caracteres).

**Lição de processo, registrada para não repetir:** "eu já vi este código antes de criar o arquivo" não é o mesmo que "eu copiei este código" — preciso extrair o texto original programaticamente (como já fiz para as etapas anteriores, e como fiz aqui na correção) em vez de confiar na memória de uma leitura anterior, mesmo dentro da mesma sessão.

**Verificação final, 4 camadas:**
1. Sintaxe válida nos 5 arquivos.
2. Execução real: `#root` idêntico, smoke test 6/6 batendo com o piso.
3. Zero violação de Regra de Hooks.
4. **Comparação pixel a pixel em 11 telas** (incluindo a visualização em lista de Explorar pela primeira vez): **10/11 idênticas**, 1 com o ruído de anti-aliasing já conhecido (máximo 1 unidade de canal).

`App.jsx`: 1509 → 897 linhas — primeira vez abaixo de 1000.

**Próxima etapa do roteiro:** Etapa 7 — as duas views grandes, `ViewSectors` (278 linhas) e `ViewProfiles` (444 linhas), deixadas por último de propósito por serem as de maior risco.

### D105 — Etapa 7 da quebra do monólito: as 2 views grandes extraídas com extração programática (05/07/2026)

Sétima etapa do `ROTEIRO_QUEBRA_MONOLITO.md` — `ViewProfiles` (444 linhas) e `ViewSectors` (278 linhas), as duas maiores e de maior risco, deixadas por último de propósito.

**Método reforçado pela lição do D104:** desta vez, em vez de ler o código e reescrever, extraí o texto exato por script Python (`lines[175:619]` etc.) direto do arquivo, e só troquei a assinatura da função (`function X` → `export function X`) por substituição de string — nenhuma linha do corpo foi digitada de novo. Boundaries conferidos batendo exatamente com a estimativa original do roteiro (444 e 278 linhas, sem surpresa).

**Único ajuste manual:** um comentário de seção (`// ─── VIEW SECTORS ───`) que sobrou grudado no fim do texto extraído de `ViewProfiles` (pertencia à seção seguinte do monólito original) — removido por não fazer sentido dentro do arquivo próprio.

`App.jsx`: 897 → **173 linhas** — 94% menor que o tamanho original (2823 linhas, início da quebra do monólito). Imports mortos limpos (`pill`, `card`, `btn`, `SEL`, `TIER_COLOR`, `TierBadge`, `UrlStatusBadge`, `fmtMoeda`, `fmtNum` — todos só usados dentro das duas views agora extraídas; `C` continua importado, usado pela tela de erro/wrapper raiz).

**Verificação, 4 camadas — desta vez com atenção redobrada, dado o achado da etapa anterior:**
1. Sintaxe válida nos 3 arquivos.
2. Execução real: `#root` idêntico, smoke test 6/6.
3. Zero violação de Regra de Hooks.
4. **Comparação pixel a pixel em 11 telas: 10/11 idênticas.** A única diferença (`04_perfis.png`) foi inspecionada pixel a pixel antes de aceitar — confirmada como o mesmo padrão de ruído de anti-aliasing já visto e verificado em várias rodadas anteriores (1-2 unidades de canal, região da barra de navegação), não uma regressão nova.

**Próxima e última etapa do roteiro:** Etapa 8 — `App.jsx` final. Com 173 linhas já bem próximo do objetivo de "só orquestração" que o roteiro original previa (~150 linhas) — resta revisar se ainda há algo a enxugar, ou se o arquivo já está no formato final.

### D106 — Etapa 8 (final) da quebra do monólito: `App.jsx` limpo + achado e correção de regressão de performance no carregador (05/07/2026)

Oitava e última etapa do `ROTEIRO_QUEBRA_MONOLITO.md`.

**`App.jsx` final:** 173 → 170 linhas. Dois ajustes de limpeza, nada de lógica:
1. A "NOTA DE ARQUITETURA" do topo do arquivo estava **completamente desatualizada** — descrevia uma arquitetura de carregamento via `dados/*.json` que não existe desde a Sprint 6 (o projeto usa `fato_v128.db` via sql.js há muito tempo). Substituída por uma nota que descreve a arquitetura modular atual (23 arquivos, carregador de múltiplos módulos, apontando pro `ROTEIRO_QUEBRA_MONOLITO.md` e `_DECISIONS.md` D98-D105 para histórico).
2. Removido um comentário de seção órfão ("MINI COMPONENTS" / "TAG_COLORS removido") que não fazia mais sentido — não sobra nenhum componente definido em `App.jsx`.
Comentários históricos de sprint (`M-01`, `EXP-04` etc.) foram mantidos como estão, seguindo a mesma convenção usada em todas as etapas anteriores — não são reescritos retroativamente.

**Achado sério na validação final, não durante a etapa em si:** ao rodar o teste de ponta a ponta com a lógica **real** do `index.html` (não uma cópia adaptada — mesmo protocolo do D93), o app não montou dentro do tempo de espera padrão do teste (2s). Antes de aceitar como falha, investiguei: o log do servidor mostrou todos os ~23 arquivos sendo buscados com sucesso (200 OK), mas **sequencialmente**, um por vez — o carregador de módulos (escrito na Etapa 1, D99) buscava as dependências de cada arquivo com `for (const dep of imports) await __loadModule(dep)`, um loop sequencial. Com 1 arquivo (como era antes da quebra do monólito) isso não importava; com 23, o carregamento total levava **9 a 16 segundos** — uma regressão de performance real e mensurável, causada pela própria quebra do monólito.

**Corrigido:** troquei o loop sequencial por busca em paralelo das dependências-irmãs (`Promise.all(imports.map(dep => __loadModule(dep)))`), com um cache de promises pra evitar buscar o mesmo arquivo duas vezes se dois ramos do grafo de dependência importarem o mesmo módulo ao mesmo tempo. Medido antes/depois com o mesmo critério de conclusão (mensagem do smoke test, não um tempo fixo de espera): **9-16s → ~3s**, uma melhora de 3-5x.

**Verificação, 4 camadas, incluindo a correção de performance:**
1. Sintaxe válida (scripts inline do `index.html` extraídos e validados via Babel).
2. Execução real: tempo de carregamento completo medido em ~2,9s (antes: 9-16s), `#root` com 86.162 caracteres, smoke test 6/6.
3. Zero violação de Regra de Hooks (mudança não tocou nenhum componente React).
4. **Comparação pixel a pixel em 11 telas: 9/11 idênticas**, 2 com o ruído de anti-aliasing já conhecido (máximo 2 unidades de canal).

**A quebra do monólito está completa.** `App.jsx`: 2823 → 170 linhas (94% de redução), distribuído em 23 módulos, cada etapa verificada por 4 camadas antes de avançar, 2 bugs reais encontrados e corrigidos ao longo do processo (D104 — reconstrução de memória em vez de cópia literal; D106 — regressão de performance do próprio carregador que eu escrevi). Ambos encontrados pelo protocolo de verificação, não por sorte ou revisão manual.

### D107 — Retomada de sessão SITE: catch-up de documentação (`CHANGELOG_PORTAL.md`), sem tocar em `.db` (14/07/2026)

**Contexto:** nova sessão assume o papel SITE. Rodada a checagem da Regra 1 (`_LEIA_PRIMEIRO.md`) antes de qualquer edição: `DB_PATH` aponta para `fato_v128.db`, `MAX(version)` de `db_versions_v2` = 128 (bate), 0 tabelas que `App.jsx` usa estão faltando no banco.

**Achado:** `CHANGELOG_PORTAL.md` parava em v3.11 (27/06, entrada da sessão BANCO) — todo o trabalho do lado SITE entre 03/07 e 05/07 (D88 a D106: bug crítico de Hooks, `index.html` que nunca renderizava de fato, estudo de arquitetura, e a quebra completa do monólito `App.jsx`) nunca tinha sido registrado ali, embora estivesse todo em `_DECISIONS.md`.

**Correção aplicada:** adicionadas as entradas v3.12 a v3.16 no topo de `CHANGELOG_PORTAL.md`, uma por marco (bug de hooks, sincronização/auditoria de ruído, autoauditoria, estudo de arquitetura, quebra do monólito), cada uma citando o D-número correspondente para detalhe completo. Nenhuma entrada anterior foi reescrita ou removida — só adição no topo, seguindo a convenção já usada no arquivo.

**Não fiz (fora do papel SITE, Regra 0.1):** `ESTADO_ATUAL.md` e os `CHANGELOG_BANCO_*.md` são documentos de estado do lado BANCO (Regra 9) — estão descrevendo v94/v97 quando o banco real é v128, e faltam changelogs de `.md` para v98-101 e v110-128. Em vez de editar esses arquivos eu mesmo, registrei um pedido formal (SP-41) em `_BACKLOG.md`, com a evidência já levantada (contagens reais via query), para a sessão BANCO executar.

**Verificação:** `grep` confirmou ausência prévia de qualquer menção a "monólito"/D93-D106 em `CHANGELOG_PORTAL.md` antes desta edição. Nenhum arquivo de `portal/` (`App.jsx`, `db.js`, `index.html`, componentes) foi alterado nesta sessão — só documentação.

### D108 — Limpeza de sprints soltos redundantes em `portal/_arquivo/` (14/07/2026)

**Achado:** os 10 arquivos `SPRINT{6,8,9,10,11,12,14,15,16,17}_EXECUCAO.md` em `portal/_arquivo/` (116 KB) já estavam 100% consolidados em `portal/HISTORICO_SPRINTS.md` (recomendação original do `ESTUDO_ARQUITETURA_E_PLANO.md` §5.3, já executada em sessão anterior, mas os arquivos-fonte nunca tinham sido removidos depois da consolidação).

**Verificação antes de remover:** comparei o conjunto de palavras únicas de cada arquivo solto contra `portal/HISTORICO_SPRINTS.md` inteiro — 0 conteúdo exclusivo em qualquer um dos 10 (a diferença residual encontrada era ruído de tokenização, não texto real). Só depois dessa confirmação os arquivos foram apagados (não só arquivados) — é território `portal/`, autoridade da sessão SITE, e a informação já vive 100% em `HISTORICO_SPRINTS.md`.

**Não removido, só sinalizado:** `portal/_arquivo/README_portal_obsoleto_sprint17.md` (o antigo documento de retomada de sessão). Suas seções 6-8 (vocabulário de setores/idiomas/tags) **não são redundantes — são simplesmente desatualizadas**: o banco real (v128) tem 569 tags (doc lista ~70) e valores de `lang` bem mais variados (`DE`, `JP`, minúsculas, listas separadas por vírgula) do que os 6 valores documentados. Como o arquivo já está em `_arquivo/` e rotulado como obsoleto, não há risco de alguém confundir isso com documentação corrente — mantido como está, sem ação adicional.

**Fora do meu papel (SITE), registrado só como observação para o dono do projeto, não como pedido formal a nenhuma sessão:**
- `_arquivo/extracao_atlas_pe_ps_pd.json`, `extracao_cnct_fundamentos_corrigido.json`, `extracao_cnct_justificativa.json` (raiz, ~540 KB) — fontes brutas de um patch já aplicado e auditado byte-a-byte (SP-27, `_BACKLOG.md`). Não referenciadas por nenhum código. Não são arquivo `portal/`, então não são minhas para apagar — fica a critério de quem decide sobre o lado BANCO/dados.
- `auditorias/Auditoria_v94_v106.html` (35 KB) — snapshot de auditoria de uma versão do banco já 22 versões obsoleta (v106 vs. v128 atual), superada por `RECHECK_RUIDO_v109_v128.md`. Mesma lógica: não é arquivo de `portal/`.

### D109 — Sistema de cor semântico documentado e inconsistência de CBO corrigida (14/07/2026)

**Pedido do usuário:** atacar a proposta de "lógica de cor semântica" do `ESTUDO_ARQUITETURA_E_PLANO.md` §4, que existia como sugestão nunca implementada.

**Método:** antes de declarar uma regra, auditei o uso real de cada família de cor (`grep` com contexto em todas as views/componentes) para extrair a lógica que **já existia implicitamente** no código, em vez de inventar uma nova. Confirmado: verde = vantagem/financeiro/gratuito/aprovado; azul = navegação/identificador oficial; roxo/indigo = rede/relacionamento; laranja/amber = alerta/pré-requisito/custo/normas; vermelho = crítico/negativo — próxima do que o estudo já intuía, mas com nuance real (verde não é só "financeiro", é "vantagem" em sentido mais amplo).

**Achado durante a auditoria:** código CBO renderizado em **azul** em 3 lugares (`ViewProfiles.jsx` linhas 215/366, `ViewSectors.jsx`) e em **roxo/indigo** em outros 3 (`ViewProfiles.jsx:122`, `TrailCard.jsx:43`, `SourceCard.jsx:76`) — mesma classe de dado (código CBO), sem nenhum critério documentado escolhendo entre as duas. Decisão: CBO é identificador oficial (mesma família de código de trilha, `TRL-xx`), não dado relacional — padronizado para **azul** nos 3 lugares que estavam em roxo.

**Verificação:** sintaxe validada via Babel (`transformSync`, preset-react) nos 5 arquivos tocados, antes e depois da edição — sem erro em nenhum. Não tenho acesso a navegador real neste ambiente para rodar o pixel-diff de 4 camadas que o projeto usa (Playwright); a mudança é de cor apenas (mesmo componente `pill()`, mesmas dimensões), risco visual mínimo, mas registro a limitação aqui por transparência, seguindo a mesma disciplina do projeto.

**Documentação:** legenda completa (o quê cada cor significa, com o achado do CBO) escrita como comentário no topo de `theme/tokens.js`, para quem for adicionar cor nova numa tela futura escolher pelo significado, não por gosto.

**Não fiz (fora de escopo desta rodada, para não arriscar mudança grande sem verificação visual):** não migrei o código pra usar constantes semânticas novas (ex.: `C.semantic.positivo` em vez de `C.emerald` direto) — isso tocaria dezenas de linhas em 9 arquivos. Fiz só a documentação da regra + a correção pontual do CBO, que já resolve a única inconsistência real encontrada.

### D110 — Tipografia real implementada: IBM Plex Sans + Mono (14/07/2026)

**Pedido do usuário:** atacar o item de tipografia da proposta de direção visual (`ESTUDO_ARQUITETURA_E_PLANO.md` §4).

**Achado antes de escolher qualquer fonte:** `App.jsx` já declarava `fontFamily:"'Inter',system-ui,sans-serif"` no wrapper principal — mas em nenhum lugar do projeto (`index.html`, CSS, nenhum arquivo) havia um `@font-face` ou link do Google Fonts carregando a Inter de verdade. Ou seja: o código já fingia ter uma escolha tipográfica, mas ela nunca chegou no navegador — sempre caiu no fallback do sistema, silenciosamente, sem erro nem aviso.

**Escolha:** IBM Plex Sans (texto/títulos, pesos 400-700) + IBM Plex Mono (códigos: CBO, TRL-xx, NR-xx, blocos do Guia). Justificativa: (1) o assunto real do produto é classificação técnica/industrial multilíngue — IBM Plex foi desenhada por um fabricante de tecnologia industrial exatamente pra esse tipo de contexto; (2) bom suporte a acentuação em português; (3) o Mono não é decoração — reforça o significado que os códigos já carregam no sistema de cor semântico (D109: identificador oficial = azul), então ganhar uma fonte monoespaçada de verdade (em vez do `monospace` genérico do navegador) fortalece essa mesma lógica em vez de competir com ela.

**Execução:**
- `index.html`: `<link>` do Google Fonts adicionado (preconnect + stylesheet), CSS do `body` atualizado.
- `App.jsx`: `fontFamily` do wrapper corrigido de `'Inter'` (fantasma) pra `'IBM Plex Sans'` (carregada de verdade).
- 13 ocorrências de `fontFamily:"monospace"` em 6 arquivos (`ViewGaps.jsx`, `ViewGuideBlocks.jsx` ×2, `ViewMercadoTrabalho.jsx`, `ViewProfiles.jsx` ×6, `ViewSectors.jsx` ×2, `TrailCard.jsx`) trocadas por `'IBM Plex Mono',monospace`, confirmado por `grep` que não sobrou nenhuma variação.

**Decisão técnica — sem SRI no `<link>` do Google Fonts:** diferente do quick-win de SRI do D95 (aplicado às tags `<script>` do React/Babel), o CSS que o Google Fonts serve varia por User-Agent (formato de fonte: woff2/woff/ttf), o que quebraria o hash do `integrity=` a cada variação de navegador. Omissão intencional, não descuido — registrado aqui pra não ser confundido com regressão numa auditoria futura.

**Verificação:** sintaxe validada via Babel (`transformSync`) nos 8 arquivos tocados (App.jsx + 6 views/componentes + tokens.js, que não foi alterado nesta rodada mas foi revalidado por precaução), antes e depois. `index.html` validado por checagem estrutural (contagem de tags `<link>`). **Limitação registrada:** sem navegador real neste ambiente, não pude confirmar visualmente o carregamento da fonte (rede do meu sandbox não alcança `fonts.googleapis.com`) — mas o navegador de quem usa o site tem rede normal, e o fallback (`system-ui, sans-serif`) garante que nada quebra mesmo se o Google Fonts estiver bloqueado na rede do usuário.

### D111 — Visualização de rede de carreira: substituído o badge de texto por grafo de verdade (14/07/2026)

**Pedido do usuário:** construir a "peça de assinatura visual" da rede de carreira, sugerida em `ESTUDO_ARQUITETURA_E_PLANO.md` §4 e nunca implementada — antes, era só um badge de texto (`"HUB PRINCIPAL · 87 conexões"`) sem nenhum grafo por trás.

**Achado antes de desenhar qualquer coisa:** não existe uma tabela de arestas nó-a-nó no banco (`dm_rede_centralidade` só dá um grau agregado por perfil, não pares nomeados). Em vez de inventar conexões, usei o dado que existe e sustentável:
- **Laços fortes** — `dm_sinonimos_perfis`: 21 pares específicos com overlap real, calculado a partir de trilhas Atlas de fato compartilhadas.
- **Laços fracos** — `dm_rede_comunidades`: 85 dos 98 perfis do catálogo agrupados em 5 comunidades temáticas reais (13 perfis ainda sem dado de rede, também real, não escondido).

Os dois nunca são desenhados com o mesmo peso visual (linha grossa/brilhante vs. fina/apagada) pra não fingir que "mesma comunidade" é tão preciso quanto "sinônimo confirmado".

**Construído:**
- `components/RedeDeCarreira.jsx` (novo) — grafo radial por perfil, layout determinístico (ângulo = índice/total, sem lib de grafo/força iterativa), cores da família roxo/indigo (sistema semântico D109). Integrado em `views/ViewProfiles.jsx`, substituindo o badge antigo (mantido como resumo acima do gráfico) e mantendo a lista textual de sinônimos abaixo (acessibilidade/precisão).
- `views/ViewRedeCarreira.jsx` (novo) — visão geral com os 85 perfis, 5 comunidades posicionadas em círculo, membros em espiral de ângulo áureo (phyllotaxis, evita força iterativa e sobreposição mesmo na comunidade de 55 membros), tamanho do nó por `score_hub`, aro verde pros hubs principais, e as 21 arestas de sinônimo sobrepostas. Registrada em `App.jsx` e `components/Nav.jsx` (nova aba "Rede de Carreira").

**Verificação:** sintaxe validada via Babel nos 5 arquivos tocados. A matemática do layout (posição de todos os 85 nós, dedupe das 21 arestas) foi simulada em Python com o dado real do banco antes de escrever a versão em JS — confirmado: nenhum nó fora do canvas, nenhum `NaN`, contagem de arestas bate. **Limitação registrada:** sem navegador real neste ambiente pra confirmar a renderização React de fato (hooks, re-render em hover/click) — gerei uma reconstrução estática (SVG com a mesma matemática exata, não uma aproximação visual livre) pra mostrar ao usuário antes de considerar a peça pronta.

### D112 — Sincronização com `fato_v168.db`: correção de query em vez de correção no banco (15/07/2026)

**Contexto:** `fato_v168.db` recebido pra substituir `fato_v128.db` como base do portal. Seguindo a Regra 1 (`_LEIA_PRIMEIRO.md`), rodada checagem de schema completa antes de qualquer edição — não confiar no nome do arquivo nem em texto de documentação.

**Achado:** `dm_monopolio_oferta` (215 linhas, usada em `loadSectorsGuia.js` para o painel de concentração de mercado por setor) não existe mais em `fato_v168.db`. Investigação (`db_versions_v2`, todas as 165 versões) não encontrou nenhuma menção a `DROP`, rename, ou arquivamento dessa tabela — ela aparece intacta em v130, e a v168 declara explicitamente ter mudado só `cnct_profiles`/`cnct_courses` em relação a v167. Ou seja: o rename aconteceu em algum ponto entre v135 e v167, sem deixar rastro em nenhuma fonte documentada (nem `db_versions_v2`, nem `_DECISIONS.md`/`_BACKLOG.md`/changelogs do lado BANCO).

**Como foi encontrado o nome novo:** não por busca em changelog (não existe), mas por inspeção direta do SQL de `vw_rede_empresas` (`sqlite_master.sql`) — a view já fazia `JOIN "dm_monopolio_oferta_arquivado"`, o que confirma (a) o nome novo exato e (b) que o próprio banco já espera esse nome em pelo menos um lugar interno, então o rename provavelmente foi intencional (arquivamento), não um DROP acidental.

**Decisão (Regra 0.1):** não editar o `.db` para "desfazer" o rename ou recriar a tabela com o nome antigo — isso seria a sessão SITE alterando o banco, que não é seu papel. A correção certa é ajustar a query em `loadSectorsGuia.js` para o nome real (`dm_monopolio_oferta_arquivado`), que foi o que foi feito. Dado confirmado intacto (215 linhas, mesmo schema, mesmo conteúdo) — o painel de concentração de mercado na aba Setores continua funcionando exatamente como antes, sem nenhuma mudança visível pro usuário final.

**Pedido formal para a sessão BANCO** (registrado em `_BACKLOG.md`, SP-42): confirmar a intenção do rename e documentar retroativamente em qual versão ele ocorreu e por quê — sem isso, uma sessão BANCO futura pode não saber que `dm_monopolio_oferta_arquivado` é a tabela viva (e não um backup morto), e uma sessão SITE futura pode repetir esta mesma investigação do zero.

**Verificação:** as 70 queries reais do portal (`query`/`scalar` em todos os arquivos de `portal/data/` + `App.jsx`) extraídas por regex e executadas uma a uma contra o `.db` real antes e depois da correção — 70/70 sem erro depois. `runSmokeTest` (M-12) reexecutado manualmente: as 6 métricas de piso, todas ≥ piso conhecido (nenhuma queda). Confirmado também que a migração v168 de `cnct_courses` (16 colunas dropadas) não afeta o portal: as únicas colunas lidas pelo site nessa tabela (`id`, `profile_id`, `nome`, `micro_atlas_pdf`) não estavam entre as removidas, e `micro_atlas_pdf` (o incidente original da Regra 0) segue intacto em 78/99.

**Registro em `db_versions_v2`:** 1 linha nova (v169) inserida no `.db` copiado para `portal/dados/`, documentando esta sincronização — permitido pela Regra 5 item 1 (exceção de `DB_PATH`). Nenhum dado alterado, só a linha de log.

### D113 — Critério de resolução de ambiguidade `code`/`atlas_num` (SP-48) e limite do que é corrigível do lado SITE (15/07/2026)

**Contexto:** ao implementar SP-47/49/50 (pedidos do usuário, a partir do estudo de viabilidade SP-45), varredura completa por `atlasTrails.find()`/comparações por `code` sozinho achou 4 pontos ambíguos — não só o já documentado em SP-48 (`ViewProfiles.jsx` ~linha 392/468). 28 códigos de trilha Atlas se repetem entre 2 e 6 `atlas_num` diferentes (`SELECT code, GROUP_CONCAT(DISTINCT atlas_num) FROM atlas_trails GROUP BY code HAVING COUNT(DISTINCT atlas_num)>1`).

**Critério adotado, em ordem de preferência:**
1. Onde o dado de origem já resolve a ambiguidade sem alterar o `.db` (ex.: `atlas_trail_profiles.trail_id` → join único pra `atlas_trails.id`, que já carrega `atlas_num`) — carregar o par `{code, atlas_num}` na camada de dado e comparar por ambos, nunca só `code`. Aplicado em `loadProfiles()` (`trails_atlas_detail`).
2. Onde o dado já tem uma coluna de desambiguação mas incompleta (`source_atlas_trails.atlas_num`, 194/232 = 83%) — usar quando presente, cair pra comparação por `code` apenas (comportamento antigo, não pior) quando ausente. Não gerar dado fantasma pros 17% faltando.
3. Onde a tabela **não tem** nenhuma coluna de desambiguação (`gap_atlas_trails.atlas_code`, texto puro) — **não é corrigível do lado SITE** (Regra 0.1/3.2): não adicionar coluna no `.db`, não inferir `atlas_num` por heurística sem base real. Mitigação de UI aplicada: listar todas as trilhas candidatas em vez de escolher a 1ª silenciosamente (que era o bug original). Pedido formal registrado em `_BACKLOG.md` como **SP-51**, para a sessão BANCO decidir se adiciona `atlas_num`/`trail_id` a `gap_atlas_trails` e completar a resolução dos 38 casos restantes de `source_atlas_trails.atlas_num`.

**Por que registrar como decisão e não só como item de backlog:** o critério acima (quando corrigir silenciosamente vs. quando mitigar com transparência vs. quando bloquear e pedir) é reutilizável — a próxima vez que uma sessão SITE achar uma tabela sem `atlas_num`/`trail_id`, o mesmo raciocínio (não inventar, mostrar ambiguidade, pedir formalmente) se aplica sem precisar redescobrir o princípio do zero.

**Verificação:** as 4 ocorrências foram achadas por `grep -rn "atlasTrails\.find\|atlasTrails\.filter" portal/` (varredura exaustiva, não amostral) e cada correção testada contra o `.db` real (ver CHANGELOG_PORTAL.md v3.23 pros números exatos de cada query).

---

### D114 — Eliminação dos 78 PDFs estáticos de micro-atlas: renderização dinâmica via `MicroAtlasView.jsx` (16/07/2026)

**Contexto:** sessão de enxugamento de estrutura (ver `PLANO_ENXUGAMENTO_ESTRUTURA.md`) identificou que os 78 arquivos em `dados/micro_atlas/*.pdf` não eram documentos autênticos — eram exportações estáticas de 1 registro de `cnct_courses` cada, geradas por script fora do repositório (não versionado, não auditável, sem rastro de execução). Confirmado por extração de texto (pdfplumber, 3 PDFs de status diferentes) que os 78 seguem **1 único template** (Identificação → Vinculação ao Macro-Atlas → Referências Preliminares) — variando só o conteúdo, não a estrutura. Cobertura incompleta: só 78 dos 99 cursos tinham PDF; os outros 21 não mostravam nenhum botão em `ViewProfiles.jsx`.

**Decisão:** substituir o link estático (`<a href={p.micro_atlas_pdf}>`) por um componente que renderiza o mesmo conteúdo direto de `cnct_courses`, já carregado em memória pelo `loadTrailsProfiles.js` — sem etapa de geração de arquivo intermediário.

**Implementação:**
1. `portal/data/loadTrailsProfiles.js` — a query que antes só trazia `micro_atlas_pdf` (`WHERE micro_atlas_pdf IS NOT NULL`) foi expandida para trazer o registro completo de `cnct_courses` (`status_atlas`, `atlas_referencia`, `carga_horaria_min`, `carga_dias_uteis`, `pagina_cnct`, `normas_associadas`, `perfil_profissional`, `infraestrutura`, `palavras_chave`, certificações/especializações/graduações), sem o filtro que excluía os 21 cursos sem PDF. Novo campo `micro_atlas` adicionado ao objeto de perfil retornado; `micro_atlas_pdf` mantido apenas como fallback de download.
2. `portal/components/MicroAtlasView.jsx` (novo) — componente que renderiza o conteúdo, com tratamento explícito para o caso "sem Macro-Atlas vinculado" (aviso visual, em vez de simplesmente não aparecer). Usa o sistema de tokens/cor semântico existente (`theme/tokens.js`), sem introduzir paleta nova.
3. `portal/views/ViewProfiles.jsx` — botão trocado de link (`<a>`) para toggle (`<button>` + estado `showMicroAtlas`, resetado via `useEffect` a cada troca de perfil selecionado), condicionado a `p.micro_atlas` (todos os 99 cursos) em vez de `p.micro_atlas_pdf` (só 78). Link de download do PDF (quando existir) preservado como botão secundário dentro do próprio componente.

**Resultado:** os 21 cursos sem PDF agora renderizam o Micro-Atlas normalmente (com aviso de pendência de vinculação, onde aplicável) em vez de não mostrar nada. Elimina a dependência de um processo de geração de arquivo fora do repositório como fonte de conteúdo — `cnct_courses` passa a ser a única fonte de verdade, lida diretamente.

**Verificação:** sintaxe dos 3 arquivos validada com `typescript.transpileModule` (JSX-aware) — sem erros. Dados de exemplo usados na POC prévia foram extraídos por query direta contra `fato_v168.db`, não inventados.

**Pendência remanescente (fora do escopo desta decisão):** os 78 arquivos PDF em si **não foram apagados do zip** — a decisão foi sobre o código de renderização; a remoção física dos arquivos e do diretório `dados/micro_atlas/` é uma limpeza de repositório separada, a fazer depois de confirmar que o componente está em produção (ver pendências em `PLANO_ENXUGAMENTO_ESTRUTURA.md`).

---

### D115 — Remoção física dos 78 PDFs estáticos de micro-atlas (17/07/2026)

**Contexto:** D114 implementou a renderização dinâmica (`MicroAtlasView.jsx`) como substituta funcional dos 78 PDFs em `dados/micro_atlas/*.pdf`, mas manteve os arquivos no repositório como fallback de download/impressão, por decisão consciente registrada naquela mesma entrada. Pedido explícito do usuário nesta sessão: remover os arquivos e confirmar que a lógica de substituição está de fato implementada antes de fazê-lo.

**Verificação feita antes da remoção:** reconferida a cadeia completa de implementação da D114 nos 3 arquivos reais — `loadTrailsProfiles.js` (query traz o registro completo de `cnct_courses` → campo `micro_atlas`), `components/MicroAtlasView.jsx` (renderiza `profile.micro_atlas`, exporta default corretamente), `views/ViewProfiles.jsx` (importa o componente, condiciona o toggle a `p.micro_atlas`, não mais a `p.micro_atlas_pdf`). Confirmado por grep direto nos 3 arquivos — cadeia intacta e consistente.

**Ações executadas:**
1. Removido o diretório `portal/dados/micro_atlas/` inteiro (78 arquivos PDF).
2. `components/MicroAtlasView.jsx` — removido o botão de fallback "⬇ Baixar PDF" (apontava pra `profile.micro_atlas_pdf`, que agora seria sempre um link morto); import `btn` removido por ter ficado sem uso.
3. `data/loadTrailsProfiles.js` — removida a coluna `micro_atlas_pdf` da `SELECT` e do objeto de perfil retornado, já que não sobrou nenhum consumidor dela no portal.
4. **Pedido formal registrado em `_BACKLOG.md` (SP-52)** para a sessão BANCO: a coluna `cnct_courses.micro_atlas_pdf` continua existindo no `.db` com 78 paths agora inválidos (arquivos removidos do lado SITE, mas o dado em si é do lado BANCO — Regra 0.1 de `_LEIA_PRIMEIRO.md` impede o SITE de editar o `.db` diretamente). Sugestão registrada: nulificar/dropar a coluna numa próxima versão, ou ao menos documentar em `db_versions_v2` que os arquivos referenciados não existem mais.

**Verificação de sintaxe:** os 2 arquivos alterados (`MicroAtlasView.jsx`, `loadTrailsProfiles.js`) revalidados com `typescript.transpileModule` — sem erros.

**Resultado:** `MicroAtlasView` passa a ser a única fonte de conteúdo do Micro-Atlas — não sobra nenhum artefato de arquivo estático nem link morto no portal. Esta entrada fecha a pendência aberta em D114.

---

### D116 — Nunca reusar o mesmo valor como sentinela de "estado vazio" E como id de um grupo de dado real (16/07/2026)

**Contexto:** SP-38 categoria 5 ("SETOR null" na aba Setores) tinha 2 bugs empilhados, não 1: (1) texto literal "null" na tela (`String(sec.id).padStart(...)` com `sec.id===null`); (2) o card do grupo "sem setor" (129/497 fontes, 26%, sem `industry_sector_id`) **não abria ao clicar** — porque `ViewSectors.jsx` usava `null` tanto como id desse grupo quanto como valor de "nenhum setor selecionado" no `useState`. `setSector(null)` (clicar no grupo sem setor) ficava indistinguível de nunca ter selecionado nada, então a tela de detalhe nunca renderizava.

**Critério adotado:** quando um grupo de dado real pode legitimamente ter `id/valor === null` (aqui: registros sem FK preenchida), o estado de UI que representa "nada selecionado ainda" não pode usar esse mesmo `null` — precisa de um valor logicamente distinto (`undefined`, ou melhor, nem comparar contra sentinela nenhuma: usar um booleano ou union type explícito). Aqui: sentinela dedicado `NO_SECTOR_ID = "sem_setor"` (string) substitui o `null` de dado, e o estado de seleção passou a usar `undefined` como "nada selecionado" — os dois nunca colidem.

**Por que registrar como decisão:** é o 2º caso nesta sessão (depois de D113) de bug de ambiguidade em comparação/agrupamento por valor bruto do banco sem tratar `null` como um caso à parte. Padrão reutilizável: sempre que um campo de agrupamento (`GROUP BY`/`groupBy` no JS) pode ser `null`, checar se o `null` de dado colide com algum sentinela de estado de UI antes de assumir que só falta "tratar o texto".

**Verificação:** lógica de agrupamento simulada em Node.js contra os 497 registros reais de `sources` (layer=sector) — 12 grupos numéricos + 1 grupo "sem_setor" com 129 entradas, ordenado com o grupo sem setor sempre por último. `ViewSectors.jsx` validado com Babel (`@babel/preset-react`).

> **Nota de sincronização (17/07/2026):** esta entrada foi feita originalmente em paralelo
> nesta mesma janela, numa sessão separada que trabalhou em cima do pacote anterior
> (`sistema_fato_SP47-50_SITE.zip`, antes do enxugamento de estrutura). Renumerada de D114
> para D116 ao sincronizar os dois pacotes — D114/D115 já tinham sido usados aqui pelo
> trabalho de Micro-Atlas. Conteúdo da decisão em si, inalterado.


### D117 — Critérios aplicados ao implementar os 6 itens Tier 2 decididos pelo usuário (17/07/2026)

**Contexto:** usuário decidiu 6 dos 8 itens Tier 2 do estudo de viabilidade (itens 6,7,8,9,10,12 —
"pode replicar"/"pode mesclar"/"painel agregado"/"pode somar"/"pode implementar"/"pode anexar"; item
11 marcado "espera o banco" apesar de não haver dependência real de BANCO identificada — registrado
como está, a decidir se foi mal-entendido; item 13 não decidido). Três critérios usados de forma
consistente nos 6 itens, vale registrar pra não precisar redescobrir:

1. **Verificar o "porquê" antes de implementar o "o quê" descrito no estudo.** Em 3 dos 6 itens
   (SP-55, SP-56, SP-58), a implementação literal do que o estudo descrevia teria dado 0 ou pouco
   resultado (ex.: a união pedida no item 9 dá 0 vínculos novos pra `layer=technical` especificamente
   — só rendeu algo real ao investigar e achar que `loadSocial()` nunca lia a tabela de origem
   nenhuma vez). Decisão: sempre validar a query contra o `.db` real antes de assumir que o número
   do estudo (calculado em outra sessão, sobre escopo talvez mais amplo) se aplica ao ponto exato de
   código onde a implementação entra.
2. **Descoberta de bug/achado adicional durante a implementação de um item decidido não é motivo pra
   parar e pedir nova decisão — é motivo pra corrigir e documentar.** 3 bugs latentes achados e
   corrigidos nesta sessão sem gerar nova pergunta ao usuário: botão "Acessar portal" incondicional
   (SP-56), rótulo "Público:" incondicional (SP-56), e uma coluna com nome diferente do assumido
   (`label_pt` vs `label`, SP-54) — todos pequenos, safe, e diretamente causados pela implementação
   do item já decidido, não uma expansão de escopo.
3. **Dado conflitante (múltiplas linhas pra mesma chave) nunca vira escolha arbitrária/não-determinística.**
   19 `company_id` com linhas conflitantes em 2 tabelas derivadas (SP-58/SP-59) — resolvido com
   critério explícito e documentado (maior `tamanho_comunidade`/`score_gatekeeper`), não com
   "o que a query devolver primeiro". Mesma família de cuidado do D116 (SETOR null) e D113 (SP-48
   code/atlas_num) — o padrão geral é: nunca deixar o comportamento do site depender da ordem de
   retorno de uma query SQL sem `ORDER BY` explícito quando isso afeta o que é mostrado.

**Verificação:** todas as 6 queries novas/alteradas rodadas contra o `.db` real antes de fechar (ver
`_BACKLOG.md` SP-53 a SP-59 e `CHANGELOG_PORTAL.md` pros números exatos). Schema drift (Regra 1)
re-checado sobre todos os `data/*.js` depois das 6 implementações: 0 tabelas/views faltando. Todos os
arquivos alterados/criados validados com o Babel de produção.

### D118 — Quando o SITE pode filtrar defensivamente dado que o próprio BANCO já sinalizou como ruim (18/07/2026)

**Contexto:** ao sincronizar com `fato_v175_MERGED.db`, dois casos apareceram onde o BANCO já tinha
identificado um problema (via `gaps_v2`/campos de nota) mas ainda não tinha corrigido o `.db` em si
— exigindo uma escolha de como o SITE deveria se comportar enquanto isso:
1. **24 `companies` confirmadas como lixo de parsing** (gap 90061 — títulos de artigo, siglas de
   sistema, frases genéricas classificadas como `tipo_entidade='empresa'` por erro de ingestão).
   O BANCO documentou com alta confiança (sem UF/CNPJ, não localizável em busca externa) mas a
   reclassificação é "decisão editorial, não aplicada neste patch".
2. **Trilha piloto `trl-107`**, criada numa entrega que o próprio BANCO marcou "NÃO REVISADA POR
   CURADORIA" (regra 29), com cobertura deliberadamente parcial e nota explícita pedindo decisão de
   curadoria pra incorporar ou excluir o restante.

**Critério adotado — dois tratamentos diferentes, não o mesmo:**
- **Caso 1 (dado confirmado ruim, sem ambiguidade sobre O QUE fazer, só falta o BANCO aplicar):**
  SITE filtra no carregamento (`loadCompanies()`, lista fixa e citável dos 24 IDs). Isso não é o
  SITE reclassificando dado — é o SITE optando por não *exibir* linhas que a própria fonte primária
  (BANCO) já teste como não sendo o que a coluna diz que são. Reversível/revisável quando o gap
  fechar (o filtro fica marcado pra remoção nesse momento).
- **Caso 2 (dado real, mas com ressalva de completude que o usuário final precisa ver, não uma
  decisão de incluir/excluir que o SITE deva tomar):** SITE não decide se a trilha piloto deve ou
  não existir — só garante que a ressalva que o BANCO já escreveu (`descricao_geral`) chegue até a
  tela, ao invés de ficar presa numa coluna que nenhum loader lia. Não é filtro, é superfície.

**Por que os dois merecem o mesmo registro de decisão:** ambos partem do mesmo princípio — quando o
BANCO já fez o trabalho de identificar e documentar um problema (mesmo sem ainda tê-lo corrigido no
schema), o SITE não precisa fingir que não sabe disso só porque a coluna/tabela em si não mudou.
A diferença é o que fazer com essa informação: **suprimir** (caso 1, quando a decisão de "o que é
isso" já está resolvida, só falta a mecânica) vs. **expor** (caso 2, quando a decisão de "o que fazer
com isso" ainda é aberta e cabe a quem tem mais contexto — curadoria/usuário final — não ao SITE).

**Verificação:** os 24 IDs do caso 1 conferidos contra `sources`/`dm_rede_empresas_comunidades` antes
de filtrar (6 apareceriam na Rede de Empresas do SP-58 se não filtrados). O caso 2 conferido contra
`trails.descricao_geral` — só 1 linha preenchida hoje, badge não hardcoded pra ela especificamente.

### D119 — "Fonte mais completa" no estudo de viabilidade não significa "superset" — verificar perfil a perfil, não só a contagem total (18/07/2026)

**Contexto:** item 11 (SP-63) do estudo de viabilidade afirmava que `course_graduacoes`/
`course_especializacoes` eram "**estritamente mais completas**" que `cnct_verticalizacao`/
`cnct_qualificacoes` (mesma seção de perfil, verticalização e especializações técnicas), baseado em
cobrirem mais perfis no total (98 vs 85). Uma checagem por amostra (1 perfil) parecia confirmar isso.

**Achado ao verificar todos os 85 perfis de sobreposição, não só 1 amostra:** em 30/85 perfis (35%),
a fonte "nova" tem **menos** itens que a antiga — perde nomes específicos e reais (ex. "Soldagem",
"Segurança do Trabalho", "CNC"), não lixo. As duas fontes cobrem universos de perfis diferentes
(98 vs 85) mas, onde se sobrepõem, nenhuma é um superset da outra — são duas listagens parcialmente
distintas, prováveis extrações independentes do mesmo documento CNCT em momentos/métodos diferentes.

**Critério corrigido:** substituir a fonte de uma seção em produção só é seguro quando a fonte nova é
confirmada superset da antiga **perfil a perfil** (não só por contagem agregada, e não só por
amostra) — senão, a escolha correta é **união** (deduplicada por nome), que soma cobertura sem
arriscar perder o que já estava correto. Aplicado: `specializations` e a nova `graduacoes` em
`loadTrailsProfiles.js` agora são união das 2 fontes cada, 98 perfis cobertos, 0 perda verificada
contra as 85 originais.

**Por que registrar como decisão:** é a mesma classe de cuidado do D117 ("verificar o porquê antes
do o quê descrito no estudo"), mas um passo além — ali o problema era o número do estudo não se
aplicar ao ponto exato do código; aqui o problema é o próprio estudo ter uma afirmação factualmente
incorreta ("estritamente mais completa") que só aparece ao verificar exaustivamente, não por amostra.
Estudos anteriores (mesmo os já usados como base de várias decisões corretas) não são infalíveis —
vale essa mesma checagem antes de qualquer próxima substituição de fonte de dado sugerida por eles.

**Verificação:** `cnct_qualificacoes`/`course_especializacoes` e `cnct_verticalizacao`/
`course_graduacoes` comparados perfil a perfil (85 perfis de sobreposição, ambos os pares) contra o
`.db` real antes de decidir substituir vs. unir.

### D120 — Floor check falhou: investigar a causa antes de rebaixar o número, nunca só "consertar o alarme" (18/07/2026)

**Contexto:** ao sincronizar com `fato_v193_MERGED.db`, o floor check de `loadCore.js` (guarda contra
perda de dado silenciosa entre versões do `.db`) falhou de verdade — `technical` caiu 572→396,
`sector` caiu 497→477. A reação errada seria simplesmente rebaixar os números pra fazer o alarme
parar de disparar. Investigado antes: as duas quedas são **legítimas** — `technical` por causa do
gap 90062 (189 `sources` com texto de raciocínio de IA vazado, achado e removido pelo próprio BANCO,
não pedido nosso); `sector` por cascata do SP-60/SP-64 (fontes ligadas a empresas reclassificadas
como não-empresa removidas junto). Confirmado por query cruzada (0 `sources` de `sector` ainda
ligadas a `pagina_agregadora`) antes de aceitar a queda como correta.

**Critério:** um floor check que falha é um convite pra investigar, não pra silenciar. Só depois de
confirmar — com uma query específica que explique o número exato da queda, não só "parece razoável"
— o floor deve ser rebaixado, e com uma margem (não o número exato observado), pra continuar
servindo de alarme pra próxima perda de verdade.

**Por que registrar:** é a mesma classe de disciplina do D117/D119 (verificar antes de confiar em
número agregado), aplicada especificamente ao mecanismo de segurança do próprio carregamento de
dado — o floor check só continua útil se cada ajuste nele for tratado com o mesmo rigor que qualquer
outra mudança de dado, não como manutenção de rotina.

**Verificação:** `technical` — 189 removidas + 5 mantidas + 2 recuperadas, confirmado contra
`gaps_v2` id=90062. `sector` — 0 `sources` remanescentes ligadas a `pagina_agregadora` (94 empresas),
confirmado por JOIN.

### D121 — Vendorizar dependências de CDN quando a origem externa vira um obstáculo real, mantendo o conteúdo idêntico (19/07/2026)

**Contexto:** o portal dependia de 3 CDNs externas (`unpkg.com` pra React/ReactDOM/Babel Standalone,
`fonts.googleapis.com` pra tipografia, `cdn.jsdelivr.net` pro motor SQLite/WASM) — arquitetura
deliberada (D56/D59, "sem backend, sem build step"). Essas mesmas CDNs eram inacessíveis no ambiente
da sessão de IA que mantém o projeto, o que impedia inclusive tirar print de tela pra validação
visual — motivo prático de uma rodada inteira anterior ter ficado sem conseguir confirmar nada
visualmente.

**Critério aplicado:** trocar CDN por arquivo auto-hospedado (vendorizado) quando (a) o arquivo é
baixável de uma origem que resolve o mesmo problema (aqui, o registro npm, que ao contrário das 3
CDNs specific era acessível) e (b) dá pra confirmar que o conteúdo é idêntico ao que a CDN servia —
não só "a mesma versão", mas o mesmo arquivo, byte a byte. Verificado aqui via hash SRI (SHA-384):
React e Babel já tinham `integrity=` documentado no `index.html` desde antes — os hashes dos arquivos
baixados via npm bateram exatamente, confirmando que é o mesmo artefato, só de outra origem.

**Por que isso não é uma mudança de arquitetura, é uma mudança de origem:** a decisão original
(D56/D59, sem backend/build step) continua de pé — o site ainda abre sem build, ainda é só HTML+JS
puro. Vendorizar não reintroduz complexidade de build, só move os arquivos de "buscados de um CDN
toda vez" pra "servidos junto com o resto do site". Efeito colateral positivo, não só conveniência de
teste: o site fica menos dependente de 3 terceiros ficarem no ar.

**O que NÃO se aplica aqui:** isso não é permissão geral pra vendorizar qualquer coisa só por
conveniência — o critério (b) acima (conteúdo confirmadamente idêntico) é o que evita que "vendorizar
pra testar" vire silenciosamente "mudar o que o site carrega sem ninguém perceber".

**Verificação:** hash SHA-384 do `react.production.min.js` e `babel.min.js` baixados via npm batendo
exatamente com o `integrity=` já documentado no `index.html` antes desta sessão. Site testado
ponta-a-ponta (servidor local + Chromium headless), 0 erros de console/página em 12 telas.

### D122 — O próprio protocolo anti-obsolescência pode ficar obsoleto; revisão externa achou o que checagens internas não achariam (19/07/2026)

**Contexto:** uma revisão externa (19/07/2026) rodou a Regra 1 e a Regra 7 do `_LEIA_PRIMEIRO.md`
literalmente como escritas — e achou que `db_versions` (MAX=80) e `gaps` (33 linhas "abertas")
davam resultados alarmantes. Verificação: as duas tabelas são **legadas, congeladas** — as vivas são
`db_versions_v2` (MAX=193) e `gaps_v2` (2 linhas realmente abertas, ambas já rastreadas). O texto do
protocolo nunca foi atualizado pra apontar pras tabelas `_v2` depois delas serem criadas.

**Por que isso escapou de checagens internas:** qualquer sessão (SITE ou BANCO) que já sabe da
existência de `_v2` — por já ter mexido nelas antes, ou por ter herdado esse conhecimento de uma
sessão anterior na mesma janela — nunca aciona o bug, porque simplesmente já consulta a tabela certa
por hábito, sem notar que o *texto* da regra diz outra coisa. Só uma leitura literal e sem esse
contexto prévio (exatamente o que uma revisão externa faz) expõe a divergência entre o que o
protocolo diz e o que qualquer um already faz na prática.

**Critério:** documentos de protocolo (o "como verificar se algo está desatualizado") precisam do
mesmo ceticismo que qualquer outro dado — não são auto-imunes a ficar desatualizados só por
existirem pra prevenir isso em outros lugares. Quando uma tabela é substituída por uma versão `_v2`,
o texto do protocolo que a referencia precisa ser atualizado no mesmo patch, não depois.

**O que o SITE fez e não fez:** verificou os dois achados por query direta contra `fato_v193.db`
antes de aceitar (não confiou no relatório externo cegamente — inclusive achou que o número "70"
sugerido pela revisão pro SP-51 estava errado, o correto continua sendo 69). Registrou como pedido
formal de alta prioridade (`_BACKLOG.md` SP-70). **Não editou `_LEIA_PRIMEIRO.md`** — é documento do
BANCO (Regra 9), mesmo achando e confirmando o bug.

**Verificação:** `db_versions` MAX=80 vs `db_versions_v2` MAX=193 — confirmado. `gaps` 33 linhas
"abertas" vs `gaps_v2` 2 linhas reais (90041, 90048) — confirmado, as 33 são artefato da tabela
errada, não um problema real.

### D123 — Recebido o pacote de uma sessão MIGRAÇÃO (3º papel, Cloudflare Worker/D1) — mesclado com verificação, não adoção automática (23/07/2026)

**Contexto:** recebido `fato_worker_v5_2026-07-22.zip` — um Cloudflare Worker + D1 completo, com os
16 endpoints espelhando todos os `loadX.js` do portal, produzido por uma sessão que se identifica
como um 3º papel ("MIGRAÇÃO", nem BANCO nem SITE), com protocolo próprio
(`worker/PROTOCOLO_BANCO_SITE_MIGRACAO.md`). Implementa a Opção C (função serverless + banco
hospedado) que `VIABILIDADE_PUBLICACAO_E_TRANSPARENCIA.md` já tinha levantado como caminho mais
correto, mas mais trabalhoso, pra resolver a exposição do `.db` inteiro numa hospedagem estática.

**Colisão de numeração, mesmo padrão do D114:** o pacote trazia pedidos formais pré-numerados
`SP-72`/`SP-73` — ambos já ocupados em `_BACKLOG.md` (SP-72 era o gap 90063, registrado numa
sincronização anterior que a sessão MIGRAÇÃO não tinha visto). Renumerados pra SP-73/SP-74 ao
mesclar, com nota de sincronização no `worker/README.md` (mesmo padrão do D114/D123... — não é
mais preciso pedir pra próxima sessão redescobrir esse padrão, já é o 2º caso).

**Critério de merge — verificar antes de aceitar, não só confiar no relatório de quem entregou:**
1. Rodei o próprio `check_drift.py` do pacote contra `fato_v237.db` (mais novo que a base deles,
   v226) — 78/85 tabelas idênticas, só 7 com crescimento de linha, nada estrutural.
2. Comparei 2 funções (`loadPanoramaUF`, `loadAtlasTrails`) linha a linha contra os originais em
   `portal/data/*.js` — idênticas, inclusive comentários de achados anteriores preservados
   (SP-57/D116, SP-62) — não é reescrita, é porte fiel.
3. **Nenhum arquivo em `portal/` foi tocado** (confirmado por não haver menção a `App.jsx`/`db.js`
   modificados em nenhum dos documentos, e por `worker/` ser uma pasta irmã, não misturada).

**O que NÃO foi feito, deliberadamente:** trocar qualquer `loadX(db)` local por `fetch()` no
`portal/`. O próprio pacote é explícito que essa decisão é do SITE, endpoint por endpoint, no ritmo
que fizer sentido — e o worker nem está publicado ainda (exige conta Cloudflare do usuário, 4
comandos manuais em `worker/README.md`). Adotar automaticamente sem o worker estar no ar seria
literalmente impossível (os endpoints não respondem), e mesmo depois de publicado, a decisão de
*quando* trocar é de produto, não de correção — mesmo critério já usado pra outras decisões que não
cabem à sessão SITE tomar sozinha.

**Novo precedente:** esta é a primeira vez que um pacote chega de um papel além de BANCO/SITE. O
protocolo próprio da MIGRAÇÃO (regido pela mesma separação de responsabilidade) parece bem pensado
— vale tratar pacotes futuros desse papel com o mesmo nível de verificação (rodar as ferramentas de
checagem que vierem junto, comparar código real, nunca só aceitar a alegação de "testado").

**Verificação:** `check_drift.py` e comparação de código, ambos descritos acima, rodados de fato
nesta sessão antes de mesclar — não just aceito pela palavra do pacote.
