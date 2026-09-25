---
tipo: PROTOCOLO DE SESSÃO — obrigatório, não é documentação de projeto
não contém: números de versão como "estado atual" (isso envelhece — ver Regra 0). Os números
que aparecem aqui são exemplos de um caso já resolvido, não o estado presente do banco.
---

# Protocolo BANCO ↔ SITE ↔ MIGRAÇÃO — leia isto antes de tocar no D1 ou no Worker

Este documento é um terceiro papel, complementar a `_LEIA_PRIMEIRO.md` (protocolo BANCO↔SITE)
e `LEIA_PRIMEIRO_v24.md` (protocolo multi-sessão dentro do próprio BANCO, que já vive num
arquivo separado por decisão de quem mantém o lado BANCO — este documento não duplica aquele,
só referencia o que precisa). Se você é uma sessão MIGRAÇÃO, leia os três antes de mexer em
qualquer coisa.

## Regra 0 — Por que este papel existe, e por que ele é perigoso do jeito específico que é

O D1 (Cloudflare) não é uma terceira réplica qualquer do banco — é uma **cópia congelada de um
subconjunto de tabelas, extraída de uma versão específica da produção**, publicada como
`schema.sql` + `data.sql` e importada manualmente por um comando `wrangler d1 execute`. Diferente
do `.db` de produção e do `.db` de staging (que o protocolo BANCO já versiona e reconcilia a
cada sessão via `db_versions_v2`/`stg_versoes`), **o D1 não se atualiza sozinho**. Ele fica
exatamente do jeito que foi exportado até alguém rodar o processo de novo.

Isso é o mesmo tipo de risco que `LEIA_PRIMEIRO_v24.md` já documentou acontecer *dentro* do
próprio BANCO — duas versões divergindo sem uma saber da outra — só que aqui a divergência é
estrutural por design: o BANCO sobe de versão a cada sessão (histórico real: v205 apareceu
duplicada, v222→v227 em poucos dias), enquanto o D1 fica parado até alguém decidir reexportar.
**Sem este protocolo, o D1 vira um fork permanente e silencioso — pior que os forks que o BANCO
já teve, porque aqueles pelo menos eram involuntários e detectáveis por `integrity_check`; este
é estrutural e não aparece em nenhuma checagem do lado BANCO, porque o BANCO não sabe que o D1
existe.**

### Nota — a origem do `.db` é opaca pra este protocolo, de propósito

Hoje, `fato_vNNN.db` é produzido por sessões BANCO (LLM, multi-sessão, com toda a mecânica de
reconciliação de fork que `LEIA_PRIMEIRO_v24.md` documenta). Existe um projeto separado
(`iedu_crawl`) cujo objetivo declarado é eventualmente **substituir** esse trabalho por um
pipeline determinístico (`pipeline.py` → `etl_job.py`, com scripts de recálculo em
`scripts/manutencao/` — inclusive de tabelas que já estão no D1 hoje, como
`dm_matriz_pivotamento` e `dm_versatilidade_trilhas`). Quando/se essa transição acontecer, **nada
neste protocolo muda**: a Regra 1 (`check_drift.py` contra o `.db` mais recente) não pergunta
quem gerou o arquivo, só compara schema e contagem — o contrato entre BANCO e MIGRAÇÃO sempre foi
"aqui está um `fato_vNNN.db`", nunca dependeu do processo por trás dele. Vale reler esta nota
quando a transição acontecer de verdade, só pra confirmar que a suposição continua válida (por
exemplo, se o `iedu_crawl` passar a gerar uma tabela nova que nenhuma sessão LLM gerava, isso
aparece no `check_drift.py` como tabela nova de qualquer forma — não é caso especial).

## Regra 0.1 — Três papéis agora, não dois

A partir deste documento, a divisão de responsabilidade de `_LEIA_PRIMEIRO.md` (Regra 0.1) ganha
um terceiro papel fixo:

- **Sessão BANCO** — como já definido: único papel que edita o `.db` canônico (produção +
  staging). Não muda com este documento. **Não precisa saber que o D1 existe** para fazer seu
  trabalho — mas se souber, e mudar uma tabela que está na lista de migradas (Regra 2 abaixo),
  registra isso no changelog do jeito que já faz para qualquer mudança de schema (§8 de
  `LEIA_PRIMEIRO_v24.md` já cobre isso — nenhuma regra nova exigida do lado BANCO).
- **Sessão SITE** — como já definido: único papel que edita `App.jsx`/`db.js`/`portal/*` fora de
  `portal/dados/`. Ganha uma responsabilidade nova: para qualquer endpoint que a MIGRAÇÃO já
  portou pro D1 (Regra 2), a sessão SITE decide *se* e *quando* trocar a chamada de `sql.js`
  local pela chamada `fetch()` ao endpoint — isso é mudança de `portal/*`, continua sendo
  território exclusivo do SITE, a MIGRAÇÃO não deve fazer essa troca sozinha (ver Regra 1.3).
- **Sessão MIGRAÇÃO** (novo) — único papel autorizado a editar `worker/` (schema.sql, data.sql,
  código dos endpoints, `wrangler.toml`, `manifest.json`). **Nunca** edita o `.db` de produção/
  staging (só lê, pra exportar) e **nunca** edita `App.jsx`/`db.js` diretamente (só sugere a
  troca pra sessão SITE executar — ver Regra 1.3). Se uma sessão MIGRAÇÃO encontrar um problema
  de dado enquanto exporta (duplicata, FK órfã, valor fora do domínio), o procedimento é o mesmo
  da Regra 4 de `_LEIA_PRIMEIRO.md`: registrar pedido pra sessão BANCO, não corrigir na exportação.

## Regra 1 — Início de sessão MIGRAÇÃO: nunca confie que o D1 está atualizado

Antes de portar qualquer endpoint novo ou de mexer no que já existe, nesta ordem:

**1.1 — Rode a checagem de drift** contra o `.db` de produção mais recente que você recebeu:

```bash
python3 worker/d1/check_drift.py /caminho/pro/fato_vNNN_mais_recente.db
```

Isso compara o `manifest.json` (schema + contagem de linhas na última exportação) contra o `.db`
atual, tabela por tabela, para as 85 que o site inteiro usa — não só as que já estão no D1.
Três resultados possíveis por tabela, e o que fazer em cada um:

- **Schema idêntico, contagem igual** → nada a fazer, D1 continua correto pra essa tabela.
- **Schema idêntico, contagem diferente** → D1 tem dado desatualizado (staleness), mas as
  queries do Worker continuam funcionando sem erro. Reexportar é uma decisão de produto (o
  site precisa refletir o dado novo agora?), não uma correção de bug.
- **Schema diferente** → **pare**. A query correspondente em `loadTrails.js`/`loadProfiles.js`
  (ou no módulo que você for portar) pode estar quebrada contra o schema novo. Não reexporte
  sem antes checar se a query ainda faz sentido (Regra 3).

**1.2 — Se o `manifest.json` não existir ou for de uma sessão MIGRAÇÃO anterior que você não
reconhece**, trate como suspeita de fork (mesmo critério da Regra 2 de `_LEIA_PRIMEIRO.md`): leia
o `README.md` do worker por inteiro antes de continuar, não assuma que está partindo do estado
que você lembra.

**1.3 — Antes de sugerir a troca de `sql.js` por `fetch()` no lado SITE**, confirme que o
endpoint que você portou já foi testado de ponta a ponta (ver Regra 2.3) — não é sua decisão
*quando* o SITE troca, mas é sua responsabilidade não sugerir a troca antes de o endpoint estar
pronto de verdade.

## Regra 2 — Antes de fechar uma sessão MIGRAÇÃO

**2.1 — Atualizar `manifest.json`** com a versão de origem nova, a data, e o schema_hash +
contagem de cada tabela que você tocou (exportou pela primeira vez ou reexportou). Não é
opcional — é o que permite a próxima sessão (MIGRAÇÃO, ou até uma sessão BANCO curiosa) rodar
`check_drift.py` e confiar no resultado.

**2.2 — Mover a tabela da lista "pendentes de portar" pra "no worker hoje"** dentro do
`manifest.json`, se você acabou de portar algo novo — mantendo as duas listas precisas é o que
faz a Regra 1.1 da próxima sessão funcionar sem regenerar tudo do zero.

**2.3 — Testar de ponta a ponta antes de considerar uma tabela "portada"**: recriar um banco
só a partir do `schema.sql`+`data.sql` exportados (não confiar no `.db` original pra esse
teste — o objetivo é confirmar que o *export* está correto, não que o original está) e rodar a
função `loadX` correspondente contra ele via o shim de teste (`worker/test/d1-shim.mjs`) antes
de dizer que terminou. Isso já pegou um bug real nesta sessão (FKs pra tabelas fora do
subconjunto quebravam o `CREATE TABLE` no D1 — ver histórico do worker) — não pular esse passo.

**2.4 — Atualizar este documento** se algo relevante mudou no processo (novo tipo de problema
de export encontrado, mudança na lista de tabelas migradas, mudança na divisão SITE/MIGRAÇÃO) —
mesmo critério de obrigatoriedade da §8 de `LEIA_PRIMEIRO_v24.md`: ler este documento já cria a
responsabilidade de mantê-lo, mesmo que o pedido do usuário não tenha mencionado isso.

## Regra 3 — Schema mudou numa tabela já portada: o que fazer

Isso *vai* acontecer — o BANCO já documentou renomear tabela sem avisar ninguém (`LEIA_PRIMEIRO_v24.md`,
nota sobre `dm_monopolio_oferta_arquivado`, renomeada em algum ponto entre v135 e v167 sem
registro em `db_versions_v2`). Quando `check_drift.py` apontar schema diferente numa tabela já
portada:

1. **Não reexporte automaticamente.** Um schema novo pode significar coluna renomeada (a query
   quebra com erro claro), coluna removida (idem), ou coluna adicionada (a query continua
   funcionando, só não usa o campo novo — inofensivo, mas vale registrar como oportunidade).
2. **Comparar o `CREATE TABLE` antigo vs novo** (o `schema_hash` no manifest não diz *o que*
   mudou, só *que* mudou — rodar `sqlite3 novo.db ".schema nome_da_tabela"` e comparar
   manualmente, ou contra o `schema.sql` já exportado).
3. **Se a mudança quebra uma query existente**: corrigir a query no lado MIGRAÇÃO (`worker/src/*.js`)
   é permitido — isso é código do Worker, território da MIGRAÇÃO, diferente de editar o `.db` em
   si. Não é uma exceção à Regra 0.1, é a mesma regra: cada papel edita só o que é seu.
4. **Se a mudança for structural o suficiente pra sugerir que foi sem querer** (ex.: tabela
   sumiu, não só renomeada) — registrar pedido pra sessão BANCO confirmar antes de reexportar
   com um schema que pode estar incompleto (mesmo critério da Regra 4 de `_LEIA_PRIMEIRO.md`).

## Regra 4 — Tabela de tabelas migradas (mantida junto com `manifest.json`, este é só o resumo legível)

Ver `worker/d1/manifest.json` para a lista completa com schema_hash e contagem — aqui só o
resumo de progresso, atualizado a cada sessão MIGRAÇÃO que fechar algo (Regra 2.2):

**Status: MIGRAÇÃO COMPLETA — 85/85 tabelas do site no worker (v5, origem v226).**

| Endpoint | Loader original | Tabelas |
|---|---|---|
| `/api/trilhas` | `loadTrails` | 9 |
| `/api/perfis` | `loadProfiles` | 19 |
| `/api/companies` | `loadCompanies` | 7 |
| `/api/guide-blocks` | `loadGuideBlocks` | 1 |
| `/api/atlas-trilhas` | `loadAtlasTrails` | 12 |
| `/api/elite-perfis` | `loadElitePerfis` | 2 |
| `/api/normas` | `loadNormasCatalogo` | 2 |
| `/api/social` | `loadTagsAndFormats`+`loadSourceTags`+`loadSocial` | 6 |
| `/api/technical` | `loadSourceTags`+`loadCourseEnrichment`+`loadTechnical` | 8 (4 já contadas em `/api/social`) |
| `/api/gaps` | `loadComplementarity` | 2 |
| `/api/sectors` | `loadSectors` | 0 novas (reusa `sources`/`companies`/`industry_sectors`) |
| `/api/guia` | `loadGuia` | 0 novas (reusa `sources`/`companies`) |
| `/api/sector-fato` | `loadSectorFato` | 6 |
| `/api/mercado-trabalho` | `loadMercadoTrabalho` | 3 |
| `/api/sinais-mercado` | `loadSinaisMercado` | 4 |
| `/api/panorama-uf` | `loadPanoramaUF` | 4 views (+ `dm_importacoes_maquinas`, achado, só usada dentro delas) |

**O que isso NÃO significa**: o site (`portal/`) continua rodando 100% em `sql.js` local — nenhum
`loadX.js` foi trocado por `fetch()` ainda. Essa troca é decisão da sessão SITE (Regra 0.1), endpoint
por endpoint, no ritmo que fizer sentido — o worker só está pronto e testado pra quando isso acontecer.

**Nota sobre as 4 VIEWs — confirmado funcionando (v5)**: D1 é SQLite por baixo, `CREATE VIEW`
funciona igual, incluindo `date('now', ...)` (usada em `vw_mapa_calor_preditivo`, resultado varia
pela data real de consulta, comportamento esperado). As tabelas-base (inclusive
`dm_importacoes_maquinas`, que nenhuma query de `loadX.js` cita diretamente) precisam existir com
dado *antes* de criar a view no `schema.sql` — ordem importa: tabelas primeiro, views por último.
Testado de ponta a ponta: as 4 views devolveram dado plausível na primeira tentativa (10/12 UFs
com `pnp`, 7/12 com `demanda`, 3/12 com `calor` — a diferença de cobertura entre as 3 é esperada,
cada view agrega uma fonte diferente com cobertura geográfica diferente, não é bug).

## Regra 5 — Bugs reais encontrados neste protocolo (registro, não changelog do worker)

- **v2, ao trocar a origem de v193 pra v226**: `check_drift.py` tinha o nome do campo de
  contagem hardcoded como `linhas_no_banco_v193` (número de versão dentro do nome da chave).
  Ao gerar o `manifest.json` v2 com `linhas_no_banco_v226`, o script não achava o campo antigo
  e reportava todas as 49 tabelas pendentes como `None → N` (falso positivo de "tabela nova").
  Causa raiz: nome de campo carregando estado (a versão) que deveria estar só no valor
  `banco_version_origem` do topo do manifest, não espalhado pelo nome de cada chave. Corrigido
  padronizando o campo pra `linhas_na_exportacao` nas duas seções do manifest, e removendo o
  fallback hardcoded do script. Fica registrado aqui porque é exatamente o tipo de bug que só
  aparece na segunda vez que o processo roda — a primeira exportação (v193) não tinha como
  expor isso.

- **v4, ao portar `loadSocialTechnical.js`**: o script de limpeza de FK (usado só na geração de
  `schema.sql`, não no `check_drift.py` — que lê o schema bruto direto, sem essa limpeza, e por
  isso não foi afetado) tinha dois bugs de ordem/cobertura de regex: (1) `REFERENCES tbl(col) ON
  DELETE CASCADE` deixava o `ON DELETE CASCADE` órfão depois de remover só o `REFERENCES`, porque
  a regex não cobria a cláusula `ON DELETE`/`ON UPDATE` que pode vir depois; (2) quando a regex
  genérica de `REFERENCES` inline rodava antes da regra de `FOREIGN KEY (col) REFERENCES...`
  nomeada, ela consumia o `REFERENCES` sozinha e deixava `FOREIGN KEY (col),` órfão pra trás —
  ordem de aplicação importa quando as duas regras podem casar parte do mesmo trecho. Os dois só
  apareceram ao tentar recriar o banco só a partir do `schema.sql` (Regra 2.3) — testar contra o
  `.db` original não pega esse tipo de erro, porque o `.db` original nunca passa pela limpeza.

## Regra 6 — O que este protocolo explicitamente NÃO resolve (registrado, não decidido aqui)

- **Frequência de resync**: nada aqui define de quanto em quanto tempo o D1 deve ser
  reexportado. Isso é decisão de produto (Parte 1 do `VIABILIDADE_PUBLICACAO_E_TRANSPARENCIA.md`
  já tratou isso como "esforço vs. benefício", não como regra técnica fixa).
- **Automação do resync**: hoje o processo é manual (`check_drift.py` + reexportar +
  `wrangler d1 execute` na mão). Automatizar isso (ex.: GitHub Action que roda o drift check a
  cada push do `.db`) é um passo futuro possível, não coberto aqui.
- **O que fazer se o site migrar 100% pra Opção C**: se um dia todos os `loadX.js` forem
  portados e o `sql.js` local for removido de vez, este protocolo provavelmente precisa virar
  parte do fluxo normal de toda sessão BANCO (não mais um papel à parte) — mas essa decisão só
  faz sentido tomar quando/se a migração completa acontecer de fato.
- **Estrutura de repositório**: a árvore proposta em `VIABILIDADE_PUBLICACAO_E_TRANSPARENCIA.md`
  (Parte 3) não incluía este `worker/` — ele entra como irmão de `portal/` na raiz do repositório
  público, não dentro dele (mesmo motivo de `portal/` ser a única pasta publicada no Pages: o
  worker é publicado separado, no Cloudflare, e misturar as duas árvores não ajuda nenhuma das
  duas). Se `iedu_crawl` também for pro GitHub, é outra decisão em aberto se entra como repo
  separado (mais provável — é uma ferramenta de produção de dado, não parte do produto público) ou
  como pasta irmã aqui — não decidido neste documento.

Esta seção fica sempre por último no arquivo, mesma convenção da seção 8 de
`LEIA_PRIMEIRO_v24.md` — se uma sessão futura adicionar regra nova, ela entra antes desta seção.
