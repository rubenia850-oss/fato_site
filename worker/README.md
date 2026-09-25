# Worker — endpoints do site via Cloudflare D1

> **Nota de sincronização (23/07/2026, sessão SITE):** este pacote chegou com os pedidos formais
> numerados `SP-72`/`SP-73` — colidiam com números já usados em `_BACKLOG.md` (a sessão MIGRAÇÃO
> partiu de um estado anterior, sem saber do SP-72 já registrado aqui). Renumerados pra **SP-73**
> (worker completo, decisão da sessão SITE) e **SP-74** (risco `dm_importacoes_maquinas`, pedido
> pra sessão BANCO) ao mesclar — os 2 `BACKLOG_ENTRY_*.md` originais foram removidos deste pacote
> (conteúdo já está em `_BACKLOG.md` com os números corretos); `HANDOFF_PARA_SITE_SP72.md` virou
> `HANDOFF_PARA_SITE_SP73.md`. Mesmo padrão já usado antes pra colisão de `D114` — ver `_DECISIONS.md`.
> Nenhum outro conteúdo deste pacote foi alterado — código, protocolo e testes são exatamente como
> a sessão MIGRAÇÃO entregou, verificados (não só copiados) pela sessão SITE antes de mesclar:
> `check_drift.py` rodado contra `fato_v237.db` real (78/85 tabelas idênticas, só crescimento de
> linha nas outras 7, nada estrutural) e 2 funções (`loadPanoramaUF`, `loadAtlasTrails`) comparadas
> linha a linha contra `portal/data/*.js` — fidelidade confirmada, inclusive comentários de achado
> preservados (SP-57/D116, SP-62).

Referente à Parte 1 do `VIABILIDADE_PUBLICACAO_E_TRANSPARENCIA.md` (Opção C — servidor decide o
que devolver, o navegador nunca baixa o banco cru).

**v5 (esta versão) — MIGRAÇÃO COMPLETA.** Base v226. As 85 tabelas que o site inteiro usa estão
no worker, todos os 16 loaders/bundles originais portados, 16 endpoints. `sql.js`/`db.js` no
lado SITE **não foram removidos** — essa troca continua sendo decisão da sessão SITE, endpoint
por endpoint (ver Regra 0.1 do protocolo). Este pacote só garante que, quando/se essa troca
acontecer, o servidor já está pronto e testado.

Endpoints: `/api/trilhas`, `/api/perfis`, `/api/companies`, `/api/guide-blocks`,
`/api/atlas-trilhas`, `/api/elite-perfis`, `/api/normas`, `/api/social`, `/api/technical`,
`/api/gaps`, `/api/sectors`, `/api/guia`, `/api/sector-fato`, `/api/mercado-trabalho`,
`/api/sinais-mercado`, `/api/panorama-uf`.

**Antes de mexer aqui**, leia `PROTOCOLO_BANCO_SITE_MIGRACAO.md` — define o papel MIGRAÇÃO em
relação às sessões BANCO e SITE, e como evitar que o D1 vire um fork silencioso do `.db` canônico
(rode `d1/check_drift.py` no início de qualquer sessão nova, mesmo com a migração completa — o
`.db` de produção continua mudando, e o D1 fica parado até alguém decidir reexportar).

**Pedido formal registrado para a sessão SITE**: `BACKLOG_ENTRY_SP72.md` (cole na tabela de
`_BACKLOG.md`) e `HANDOFF_PARA_SITE_SP72.md` (documento de apoio, mapa completo dos 16 endpoints
e o que muda se algum for adotado) — modelo de pedido formal da Regra 4 de `_LEIA_PRIMEIRO.md`.
## O que já foi feito e validado aqui (sem precisar da sua conta Cloudflare)

- Todos os 16 loaders/bundles em `src/` são a lógica **exata** dos originais em `portal/data/`
  (mesmas queries, mesmos comentários de achado/decisão, mesmo formato de saída) — só trocando
  `query(db, sql)` síncrono (sql.js) por `await query(db, sql)` assíncrono (D1), com queries
  independentes paralelizadas via `Promise.all` (D1 é rede, sequencial custaria round-trips à
  toa). Ver `src/helpers.js` pro `query()`/`groupBy()`/`slugify()` compartilhados.
- `d1/schema.sql` — as 85 tabelas do site inteiro, extraídas do `fato_v226_reconciliado.db`,
  mais as 4 VIEWs (`vw_indicador_demanda`, `vw_mapa_calor_preditivo`, `vw_mapa_competencias_predito`,
  `dm_pnp_indicadores`) recriadas com `CREATE VIEW` normal (D1 é SQLite por baixo). Foreign keys
  que apontavam pra fora do subconjunto de cada versão foram removidas ao longo do processo —
  não fazem falta pra leitura.
- `d1/data.sql` — os dados reais dessas 85 tabelas (~38 mil linhas).
- **Testado de ponta a ponta em cada uma das 5 versões**: recriei um banco do zero só a partir de
  `schema.sql`+`data.sql` (simulando exatamente o que o D1 recebe) e rodei todos os 16
  loaders/bundles contra ele via um shim que imita a API do D1 (`test/d1-shim.mjs`,
  `test/run_v5.mjs`). Resultado: 107 trilhas, 111 perfis, 970 empresas, as 4 VIEWs devolvendo
  dado plausível — tudo idêntico ao teste contra o `.db` real. `node --check` confirma a sintaxe
  de todos os arquivos.
- 3 bugs reais encontrados e corrigidos ao longo do processo (2 no script de limpeza de FK, 1 no
  `check_drift.py`) — todos registrados na Regra 5 do `PROTOCOLO_BANCO_SITE_MIGRACAO.md`.

O que eu **não** posso fazer daqui: autenticar na sua conta Cloudflare, criar o banco D1 de
verdade, nem publicar o Worker. Essas 4 etapas abaixo você roda localmente.

## Passo a passo

```bash
cd worker
npm install          # instala o wrangler como devDependency

# 1. Login na Cloudflare (abre o navegador)
npx wrangler login

# 2. Cria o banco D1 (grátis)
npx wrangler d1 create fato-portal-db
# ↑ o comando devolve um database_id — cole ele em wrangler.toml,
#   substituindo "COLE_AQUI_O_ID_DEVOLVIDO_PELO_WRANGLER_D1_CREATE"

# 3. Carrega schema e dados no banco remoto
npm run db:schema
npm run db:data

# 4. Publica o Worker
npm run deploy
```

O `wrangler deploy` vai devolver uma URL tipo `https://fato-worker.SEU-SUBDOMINIO.workers.dev`.
Teste com qualquer um dos 16 endpoints, por exemplo:

```bash
curl https://fato-worker.SEU-SUBDOMINIO.workers.dev/api/trilhas
curl https://fato-worker.SEU-SUBDOMINIO.workers.dev/api/panorama-uf
```

Se quiser testar local antes de publicar (sem gastar deploy), `npm run dev` sobe o Worker
localmente com `wrangler dev` — mas aí use `db:schema:local` / `db:data:local` primeiro (grava
num D1 local simulado, não no remoto).

## Depois de medir o esforço — decisões que ficam pra você

1. **Quando trocar `sql.js` por `fetch()` no SITE?** — o worker está pronto pros 16 endpoints,
   mas a troca em `App.jsx`/`db.js` é território exclusivo da sessão SITE (Regra 0.1 do
   protocolo), endpoint por endpoint, no ritmo que fizer sentido. Não precisa ser tudo de uma vez.
2. **Trocar `access-control-allow-origin: "*"` em `src/index.js`** pelo domínio real do site
   antes de qualquer uso em produção — hoje está aberto pra qualquer origem, aceitável só em teste.
3. **Renomear o Worker** (`fato-portal-api-teste` em `wrangler.toml`) pra algo definitivo antes do
   primeiro deploy real — o nome vira parte da URL pública e é chato de trocar depois.

## Estrutura

```
worker/
├── wrangler.toml           ← configuração + binding D1 (cole o database_id aqui)
├── package.json
├── src/
│   ├── index.js                ← roteamento dos 16 endpoints
│   ├── helpers.js               ← query/groupBy/slugify (equivalentes a db.js + utils/helpers.js)
│   ├── loadTrails.js            ← porta de loadTrails()
│   ├── loadProfiles.js          ← porta de loadProfiles()
│   ├── loadCompanies.js         ← porta de loadCompanies()
│   ├── loadAtlas.js             ← porta de loadGuideBlocks/loadAtlasTrails/loadElitePerfis/loadNormasCatalogo
│   ├── loadSocialTechnical.js   ← porta de loadSocialTechnical.js inteiro
│   ├── loadSectorsGuia.js       ← porta de loadSectorsGuia.js inteiro (novo em v5)
│   └── loadMercado.js           ← porta de loadMercadoTrabalho/loadSinaisMercado/loadPanoramaUF (novo em v5)
├── d1/
│   ├── schema.sql                ← 85 tabelas + 4 views (origem v226) — MIGRAÇÃO COMPLETA
│   ├── data.sql                   ← dados reais dessas 85 tabelas
│   ├── manifest.json               ← schema_hash + contagem das 85 tabelas, pra check_drift.py
│   └── check_drift.py               ← ver PROTOCOLO_BANCO_SITE_MIGRACAO.md, Regra 1
└── test/
    ├── d1-shim.mjs                ← simula a API do D1 em cima do node:sqlite local
    └── run_v5.mjs                  ← testa os 16 loaders/bundles de ponta a ponta
```
