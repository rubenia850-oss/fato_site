# Estado atual do banco

**Versão: v193** — gerado em 19/07/2026 **pela sessão SITE**, por query direta contra
`fato_v193.db` (o arquivo efetivamente recebido, não o texto de um `ESTADO_ATUAL.md` anterior).

> Este documento é um retrato, não uma fonte de verdade — em caso de divergência, o banco
> (`db_versions_v2`) manda. Regenerado agora porque a versão anterior descrevia "v194"
> (`company_curso_resolucao`, 55 linhas, 124 tabelas, `sources` com UF 93%) — nenhum desses números
> bateu contra o arquivo `fato_v193_MERGED.db` recebido: a tabela `company_curso_resolucao` **não
> existe** nele, e o total de tabelas é 123, não 124. Ou o patch v194 não chegou a ser persistido no
> arquivo exportado, ou existe um `fato_v194.db` que não foi anexado — sinalizado em `_BACKLOG.md`
> SP-68, não resolvido aqui. Todo número abaixo foi confirmado por query direta nesta sessão contra
> o arquivo real; nada foi copiado do documento anterior sem checar.

---

## Números principais (verificados contra `fato_v193.db`)

| Métrica | Valor | Nota |
|---|---|---|
| Tabelas no banco | 123 | views: 16 |
| `companies` (total) | 937 | |
| `companies` tipo `empresa` | 840 | |
| `companies` tipo `empresa` com UF preenchida | 754 (90%) | documento anterior dizia 782/93% — não confirmado neste arquivo |
| `companies` tipo `pagina_agregadora` | 94 | bate com o documento anterior |
| `companies` tipo `norma_documento` | 3 | |
| `companies` aguardando curadoria (`confirmado_curadoria=0`) | 448 | bate com o documento anterior |
| `sources` (total) | 1.847 | bate com o documento anterior |
| `sources` com UF preenchida | 1.528 (83%) | documento anterior dizia 1.719/93% — não confirmado neste arquivo |
| `cnct_profiles` (total) | 111 | |
| `cnct_profiles` com `cbo_principal` preenchido | 107 (96%) | documento anterior dizia 106/95% — diferença de 1, não investigada |
| `trails` (total) | 107 | bate com o documento anterior |
| `gap_atlas_trails` resolvidos (`atlas_num` preenchido) | 69 / 106 (65%) | bate com o documento anterior |
| `company_curso_resolucao` | **não existe neste arquivo** | documento anterior citava 55 linhas — tabela não encontrada, ver nota acima |

## Gaps (`gaps_v2`)

155 rastreados: **149 resolvido · 4 arquivado_aceito · 1 quase_resolvido · 1 parcialmente_resolvido**
— confirmado por query, bate exato com o documento anterior.

Os 2 não fechados:
- **90041** (`sources.uf` incompleto) — `quase_resolvido`.
- **90048** (CNPJ de divisões/subsidiárias) — `parcialmente_resolvido`.

## Handoff SITE→BANCO (`PEDIDOS_E_BUGS_PARA_BANCO.md`, 18/07) — status verificado nesta sincronização

| # | Item | Status |
|---|---|---|
| 1.1 | 24+ `companies` lixo de parsing | ✅ Resolvido — 94 reclassificadas `pagina_agregadora` (confirmado). SITE removeu o filtro fixo do lado do portal, substituído por `WHERE tipo_entidade='empresa'` |
| 1.2 | `company_id` duplicado em `dm_rede_empresas_*` | ✅ Resolvido — 0 duplicatas confirmadas nas 2 tabelas |
| 1.3 | `gap_atlas_trails` sem desambiguação | 🟡 Parcial — 69/106 (65%), colunas `atlas_num`/`trail_id`/`resolucao_metodo` confirmadas. SITE atualizado pra usar a resolução direta |
| 2.1 | `normas_fato.descricao` corrompida | 🟡 Deduplicada (295→265), conteúdo não tocado (44/265 legível) |
| 2.2 | `cnct_courses.micro_atlas_pdf` órfão | ✅ Resolvido — 0/99 preenchido, confirmado |
| 3.1 | 4 taxonomias de setor concorrentes | 🟡 Diagnosticado (2 eixos + 1 informal), `taxonomia_informal_map` (7 linhas) criada e confirmada. Redesign não aplicado |
| 3.2 | Chaves em texto livre / órfãos silenciosos | ⏳ Não tocado — `dm_oportunidade_estrategica` segue 18 órfãos; `dm_qualidade_preditiva` melhorou 37→39/47 |
| 3.3 | `ESTADO_ATUAL.md` desatualizado | Este documento — mas note a ressalva do cabeçalho: o problema se repetiu (a versão anterior já estava descrevendo um estado à frente do arquivo real) |
| 3.4 | Verticalização/especialização (35% não-superset) | ✅ Resolvido do lado SITE — implementado como união, não substituição (SP-63) |
| §4 | 28 vínculos `empresa_papel` sugeridos + trilha piloto `trl-107` | ⏳ Decisão de curadoria ainda pendente — não verificado nesta sincronização se mudou |

## Achados de dado corrompido (confirmados em `gaps_v2`)

- **Gap 90062** (resolvido): 189 linhas de `sources` (faixa `p7-*`) continham texto de raciocínio de
  IA vazado — removidas, 2 recuperadas via busca externa. Confirmado: 0 linhas `p7-*` corrompidas
  restantes.
- **Gap 90061** (resolvido): `companies` com `tipo_entidade='empresa'` que eram título de
  artigo/sigla de sistema — reclassificadas `pagina_agregadora` (94 confirmadas).

## Achados aditivos sem decisão de aplicar (verificados nesta sessão)

- `id=9016` ("CSTT", `tipo_entidade='empresa'`) e `id=10040` ("CSTT - Movimentação de Cargas",
  `tipo_entidade='norma_documento'`) — nomes muito parecidos, possível duplicata; **classificações
  atuais diferentes** (`empresa` vs `norma_documento`), não mescladas.
- `id=10048` ("Dynamox - IoT Industrial") e `id=10090` ("Inprocess - OTS") — ambas classificadas
  `tipo_entidade='norma_documento'` no arquivo atual (não `pagina_agregadora` como uma nota anterior
  sugeria) — não verificado se essa classificação está correta ou é o mesmo tipo de erro do gap
  90061 na direção oposta (empresa real classificada como não-empresa).

## O que não pôde ser verificado nesta regeneração

- Seção "patches `fila_enriquecimento`" do documento anterior (Grupo A/B, 3.050/3.446/1.020/8/0) —
  **nenhuma tabela com esse nome ou similar (`stg_%`, `%staging%`) existe neste arquivo**. Não é
  possível confirmar nem negar esses números aqui — infraestrutura de tracking não está neste `.db`.
- SP-07 (empresas sem UF): documento anterior dizia "agora 2". **Verificado neste arquivo: 86**
  (`tipo_entidade='empresa'` sem UF preenchida) — bem acima de "2", consistente com o patch v194
  (que traria esse número pra baixo) não estar presente neste arquivo.
