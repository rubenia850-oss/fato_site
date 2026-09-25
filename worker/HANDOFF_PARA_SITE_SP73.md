# Handoff MIGRAÇÃO → SITE — SP-73 (worker D1/Cloudflare completo)

> Documento de apoio ao pedido formal registrado em `_BACKLOG.md` como **SP-73**, seguindo o
> modelo da Regra 4 de `_LEIA_PRIMEIRO.md` ("banco ganhou algo novo que o site não usa ainda →
> não é bug, é item de backlog, decisão de produto"). Este documento é a evidência — pra sessão
> SITE não precisar reabrir a investigação do zero, mesmo padrão que `KIT_AUDITORIA_BANCO_DADOS.md`
> já estabeleceu como referência de "como um pedido formal entre sessões deve ser escrito".

## O que existe agora, que não existia antes

Um Cloudflare Worker com banco D1, completo e testado, que espelha os 16 loaders/bundles que
`portal/data/load*.js` já produz hoje — mas servidos por API em vez de calculados no navegador
via `sql.js`. Está em `worker/` (pacote separado, não mistura com `portal/`), com protocolo
próprio (`worker/PROTOCOLO_BANCO_SITE_MIGRACAO.md`) e papel de sessão próprio (MIGRAÇÃO), regido
pela mesma separação de responsabilidade que já existe entre BANCO e SITE.

**Nenhum arquivo dentro de `portal/` foi tocado.** Isso é deliberado — Regra 0.1 do protocolo da
MIGRAÇÃO: esse papel nunca edita `App.jsx`/`db.js` diretamente, só sugere. A decisão de trocar
(se, quando, e quais endpoints) é sua.

## Mapa completo: loader atual → endpoint novo

| Endpoint | Substitui (síncrono, `sql.js`) | Formato de saída |
|---|---|---|
| `GET /api/trilhas` | `loadTrails(db)` | Idêntico — mesmo array, mesmos campos |
| `GET /api/perfis` | `loadProfiles(db)` | Idêntico |
| `GET /api/companies` | `loadCompanies(db)` | Idêntico |
| `GET /api/guide-blocks` | `loadGuideBlocks(db)` | Idêntico |
| `GET /api/atlas-trilhas` | `loadAtlasTrails(db)` | Idêntico |
| `GET /api/elite-perfis` | `loadElitePerfis(db)` | Idêntico |
| `GET /api/normas` | `loadNormasCatalogo(db)` | Idêntico (objeto por código) |
| `GET /api/social` | `loadTagsAndFormats`+`loadSourceTags`+`loadSocial` | `{ tagColors, formatMeta, social }` |
| `GET /api/technical` | `loadSourceTags`+`loadCourseEnrichment`+`loadTechnical` | `{ technical }` |
| `GET /api/gaps` | `loadComplementarity(db)` | Idêntico |
| `GET /api/sectors` | `loadSectors(db)` | Idêntico |
| `GET /api/guia` | `loadGuia(db)` | Idêntico |
| `GET /api/sector-fato` | `loadSectorFato(db)` | Idêntico (objeto por `sector_id`) |
| `GET /api/mercado-trabalho` | `loadMercadoTrabalho(db)` | Idêntico |
| `GET /api/sinais-mercado` | `loadSinaisMercado(db)` | Idêntico (`{ comprasGoverno, concursos, noticias, colapso }`) |
| `GET /api/panorama-uf` | `loadPanoramaUF(db)` | Idêntico |

"Idêntico" quer dizer: testei reconstruindo um banco só a partir do `schema.sql`+`data.sql`
exportados (o que o D1 de fato recebe) e rodando os 16 loaders originais contra ele via um shim
que imita a API do D1 — resultado byte a byte igual ao teste contra o `.db` real. Não é a mesma
coisa que testar contra o front-end de verdade (isso eu não tenho como fazer daqui), mas é a
mesma garantia que qualquer sessão BANCO/SITE já aceita como suficiente pra "achado confirmado".

## O que isso muda, se você decidir adotar (endpoint por endpoint, no seu ritmo)

- **Banco para de viajar inteiro até o navegador** — hoje o `.db` cru (que só cresce a cada
  versão) é baixado por completo por qualquer visitante, campo interno incluso (notas de
  confiança, achados de auditoria, etc. — ver Parte 1.2 do `VIABILIDADE_PUBLICACAO_E_TRANSPARENCIA.md`).
  Com os endpoints, só o que cada `loadX()` já decide expor sai do servidor.
- **`sql.js`/WASM deixa de ser carregado no cliente** pros endpoints que forem trocados — menos
  peso de página, sem mudar a lógica de negócio (é a mesma função, só rodando no edge em vez do
  navegador).
- **Nada muda pro usuário final** além de performance/payload — os componentes React continuam
  recebendo exatamente a mesma forma de dado, só trocando a origem (`fetch('/api/trilhas')` em
  vez de `query(db, sql)` local).

## O que isso NÃO resolve e não é necessário decidir agora

- **Não há obrigação de adotar.** A Opção A (site 100% estático, banco público por design) segue
  aceita explicitamente na Parte 1.4 do documento de viabilidade, dado o perfil de baixa ambição
  do projeto. Isto é uma opção pronta, não uma pendência.
- **Não precisa ser tudo de uma vez.** Cada endpoint pode ser trocado independente dos outros —
  `db.js` pode continuar servindo o que ainda não foi migrado.
- **O worker ainda não está publicado** — os 4 comandos de deploy (`wrangler login` → `d1 create`
  → carregar schema/dados → `deploy`) exigem a conta Cloudflare de quem mantém o projeto, não
  foram executados por mim. Enquanto isso não acontecer, os endpoints não respondem de verdade —
  isso é sobre ter o código pronto e testado, não sobre já estar no ar.

## Se decidir adotar algum endpoint

1. Confirmar que o worker foi publicado (`worker/README.md` tem o passo a passo) e anotar a URL
   real (`https://SEU-WORKER.SEU-SUBDOMINIO.workers.dev`).
2. Trocar a chamada correspondente em `App.jsx`/`db.js` de `query(db, sql)`/`loadX(db)` local
   para `fetch(URL + '/api/...')`. Como o formato de saída é idêntico, o componente React que
   consome o resultado não deveria precisar mudar nada além da forma de buscar o dado.
3. Se algo no formato divergir na prática (não deveria, mas é código novo em produção pela
   primeira vez), isso vira um pedido formal de volta pra sessão MIGRAÇÃO — mesmo protocolo,
   invertido (Regra 3 de `worker/PROTOCOLO_BANCO_SITE_MIGRACAO.md` já cobre "schema mudou",
   o caso "formato de saída divergiu" seria a mesma lógica).

## Referências

- `worker/PROTOCOLO_BANCO_SITE_MIGRACAO.md` — protocolo completo do papel MIGRAÇÃO
- `worker/README.md` — passo a passo de deploy
- `VIABILIDADE_PUBLICACAO_E_TRANSPARENCIA.md` — Parte 1, a decisão original que motivou tudo isso
- `worker/d1/manifest.json` — as 85 tabelas, schema_hash + contagem, origem `fato_v226_reconciliado.db`
