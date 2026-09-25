# Handoff — Sistema FATO: Portal + API Cloudflare (D1 + Worker)

Data: 24/09/2026
Contexto: migração do portal (React + sql.js local, banco `.db` de 8MB baixado inteiro
pelo navegador) para uma API própria (Cloudflare Worker + D1), por decisão explícita de
segurança — "não é nada seguro entregar o banco de dados inteiro pro cliente".

Este pacote é autocontido: tudo que uma sessão nova precisa pra continuar está aqui dentro,
sem depender de eu (Claude) lembrar de nada da conversa anterior.

---

## 1. Estado atual — o que já está FUNCIONANDO em produção

- **Banco D1**: `fato-portal-db-v2` (uuid `12b7604d-ae2e-4718-99c9-5817a78514bb`), na conta
  Cloudflare da usuária. Schema completo (85 tabelas + 4 views) + todos os dados carregados
  (238 statements de `data.sql`, ~4MB).
- **Worker publicado**: `fato-portal-api`, rodando em
  `https://fato-portal-api.rubenia850.workers.dev`
  - **IMPORTANTE**: esse subdomínio (`rubenia850`) tem o nome/e-mail da usuária. Ela pediu
    pra trocar depois — não trocou ainda. Pra trocar: dashboard Cloudflare → Workers & Pages
    → "Your subdomain" → botão **Change**. Depois de trocar, atualizar a URL em
    `portal/apiClient.js` (ver seção 3).
  - 16 endpoints GET, todos só leitura (SELECT), CORS aberto (`*`) — ver
    `worker/src/index.js` pra lista completa. Testado e confirmado funcionando
    (`/api/trilhas` devolvendo JSON completo).
- **Portal (frontend)**: reescrito pra consumir a API em vez de rodar SQL local. Ainda
  **não testado visualmente** (não tenho como rodar React aqui) nem **publicado** no
  GitHub Pages.

## 2. O que falta fazer (próximos passos, em ordem)

1. **Testar o portal localmente** antes de publicar: `npx serve portal/` (ou extensão Live
   Server) e conferir que todas as telas carregam. É a primeira vez rodando desde a
   reescrita — pode ter algum detalhe de shape de dado que eu não peguei revisando o código.
2. **Publicar no GitHub Pages** (a usuária já tem o app do GitHub e um repositório
   configurado — ver `sistema_fato_SITE_v237_worker` no Google Drive/Downloads dela).
3. **Trocar o subdomínio workers.dev** (tira o nome dela da URL pública) e atualizar
   `portal/apiClient.js` com a nova URL.
4. **Opcional / não pedido ainda**: considerar restringir CORS de `*` para o domínio real
   do GitHub Pages antes de considerar isso "produção final" (hoje qualquer site pode
   chamar a API — não é grave, os dados já são públicos e só leitura, mas é boa prática).

## 3. Mapa de arquivos deste pacote

```
worker/                          — código do Worker + banco (fonte da verdade do backend)
├── deploy.py                    — script de deploy (ver seção 5, MUITO relevante)
├── wrangler.toml                — já atualizado com database_id real (12b7604d-...)
├── src/                         — 9 arquivos JS do Worker (index.js + loadX.js por endpoint)
├── d1/
│   ├── schema.sql                — 85 tabelas + 4 views
│   └── data.sql                  — dados completos (~4MB)
└── README.md, HANDOFF_PARA_SITE_SP73.md, PROTOCOLO_BANCO_SITE_MIGRACAO.md
    — docs herdadas de sessões anteriores sobre o banco/site (não escritas por mim,
      mantidas por completude)

portal/                          — frontend React (sem bundler, Babel no navegador)
├── App.jsx                      — orquestrador raiz (MODIFICADO — ver seção 4)
├── apiClient.js                 — NOVO — cliente HTTP pro Worker (URL da API está AQUI)
├── data/
│   ├── loadCore.js               — MODIFICADO — busca os 14 endpoints via Promise.all
│   ├── loadLazy.js               — NOVO — loadSectors/loadGuia via API (lazy, sob demanda)
│   ├── searchIndex.js            — MODIFICADO — busca em memória (antes era FTS5/SQL)
│   ├── loadTrailsProfiles.js, loadSocialTechnical.js, loadSectorsGuia.js,
│   │   loadMercadoEmpresas.js    — LEGADO, não usados mais (loadCore.js não os importa
│   │                                mais), deixados no repo sem remover por segurança
├── db.js                        — LEGADO, não usado mais (initDB/query/scalar mortos,
│                                    nada mais os chama) — pode ser removido no futuro
├── (dados/, vendor/sql-wasm.*)  — REMOVIDOS (banco de 8MB e motor sql.js/wasm, não
│                                    precisam mais existir; portal caiu de 13MB → 3,2MB)
└── components/, views/, theme/, context/, utils/ — INTOCADOS, nenhuma mudança

HANDOFF.md                       — este arquivo
```

## 4. O que exatamente mudou no portal (pra quem for revisar/debugar)

O portal antes rodava ~13 funções de SQL direto no navegador (sql.js + banco `.db` local),
espalhadas em vários arquivos `data/load*.js`, todas **síncronas** (`query(db, sql)`
retornava array direto, sem Promise).

O Worker já existia com 16 endpoints que são uma **porta 1:1 exata** dessas mesmas funções
(mesmas queries, mesmos comentários, só trocando sql.js local por D1) — constatação
importante que permitiu uma migração limpa sem reinventar lógica de negócio.

Mudanças:
- `loadCore.js`: em vez de chamar as 13 funções locais com `db` síncrono, agora é `async`
  e busca os 14 endpoints em paralelo (`Promise.all`), remontando o **mesmo formato de
  objeto de sempre** (mesmos nomes de campo: `trails`, `profiles`, `companies`, etc.) —
  então nenhum componente/view precisou mudar.
- `searchIndex.js`: a busca usava uma tabela virtual FTS5 dentro do sql.js local. Sem banco
  local, virou busca simples em JS (substring, case-insensitive, todas as palavras precisam
  bater) sobre os arrays já carregados (`core.social`, `core.technical`, `core.profiles`,
  `core.atlasTrails`). Mesma assinatura pública (`buildSearchIndex`, `searchFTS`), só
  perdeu o parâmetro `db` (não precisa mais).
- `loadLazy.js` (novo): as abas "Setores" e "Guia" carregavam sob demanda
  (`ensureSectorsLoaded`/`ensureGuiaLoaded` em `App.jsx`) — continuam lazy, só que buscando
  `/api/sectors` e `/api/guia` em vez de rodar SQL na hora do clique.
- `App.jsx`: removida a referência a `initDB`/`dbRef`/`db.js`; `useEffect` de carga inicial
  agora só faz `loadCore().then(core => ...)`; `ensureSectorsLoaded`/`ensureGuiaLoaded`
  viraram `async` (fetch em vez de SQL síncrono); `runSmokeTest` perdeu o parâmetro `db`
  (agora roda só sobre o `core` já carregado — ver nota abaixo).

**Nota sobre o smoke test** (`runSmokeTest` em `loadCore.js`): a versão original também
checava contagens de `guia` e `sector` via `GROUP BY` direto na tabela `sources` — esse
acesso cru não existe mais no cliente (fica só no servidor agora). Removi essas duas
checagens do piso; mantive as 4 que dá pra checar com o que a API já devolve (`social`,
`technical`, `profiles`, `trails`/atlasTrails). Se quiser recuperar as duas que faltam, dá
pra criar um endpoint `/api/smoke-counts` no Worker que devolve só os números agregados
(não o dado bruto) — não foi pedido, então não fiz.

## 5. O script `deploy.py` — como funciona e o que aprendemos na marra

Esse script automatiza TODO o processo Cloudflare via API REST direta (sem Wrangler CLI,
sem dashboard manual) — feito assim porque a usuária está no celular (Pydroid 3, Android)
e achou o CLI complicado.

**Como rodar**: preencher `API_TOKEN` e `ACCOUNT_ID` no topo do arquivo, colocar dentro da
pasta `worker/` (mesmo nível de `wrangler.toml`, ao lado de `src/` e `d1/`), rodar. Ele:
1. Cria (ou reaproveita) o banco D1
2. Sobe `d1/schema.sql` via **bulk import da Cloudflare** (`action: init/upload/ingest/poll`)
   — rápido e confiável pra isso, sem limite de tamanho de statement
3. Sobe `d1/data.sql` **linha por linha via INSERT parametrizado** (`?`), em lotes — NÃO usa
   bulk import pra isso (ver "Decisões técnicas" abaixo pra entender por quê)
4. Publica o Worker (`src/*.js`) com binding pro D1
5. Ativa a URL pública (`*.workers.dev`)

### Decisões técnicas (pra não repetir os mesmos erros numa sessão futura)

- **Bulk import da Cloudflare funciona bem pro schema (pequeno), mas falhou
  silenciosamente pro `data.sql` (4MB)** — a resposta do poll dizia `"Not currently
  importing anything."`, que a documentação oficial trata como conclusão bem-sucedida, mas
  na prática (confirmado consultando o banco direto) os dados **não** tinham sido carregados.
  Por isso `data.sql` usa o caminho de INSERT parametrizado, não bulk import. Schema
  continua usando bulk import (esse funcionou 100% das vezes).
- **D1 tem limite de ~100KB por statement E de bound parameters por query** (na prática,
  bem menos que os 999 do SQLite puro). Por isso os INSERTs são quebrados em lotes pequenos
  (`max_params_per_batch=80`) E os valores vão como parâmetros (`?`), nunca como texto SQL
  literal — isso também resolve o problema de campos de texto muito longos (um campo de
  descrição tinha 121 mil caracteres sozinho, que nenhum tamanho de lote "cru" aguentava).
- **`CREATE TABLE`/`CREATE VIEW` do schema são reescritos com `IF NOT EXISTS`** antes de
  subir — torna o script seguro pra rodar de novo em cima do mesmo banco sem quebrar.
- **`INSERT` dos dados vira `INSERT OR IGNORE`** — mesma lógica: rodar de novo não duplica
  nem quebra em linha já inserida.
- **Checkpoint local** (`deploy_checkpoint.json`, criado do lado do script): tentativa de
  permitir retomar de onde parou sem refazer tudo — na prática, não sobreviveu de forma
  confiável entre execuções no Pydroid (aparentemente por como o Android/Pydroid lida com
  arquivos na pasta Downloads). Os dois pontos acima (`IF NOT EXISTS` + `OR IGNORE`) são a
  proteção real; o checkpoint é só uma otimização de velocidade quando funciona, não uma
  dependência de correção.
- **O carregamento completo do `data.sql` (238 statements, ~4MB) levou ~27 minutos**
  (1640s) rodando no celular via Pydroid — é normal demorar, não é sinal de erro.

## 6. Credenciais e IDs (não sensíveis — nenhum aqui é secreto de verdade)

- Conta Cloudflare: e-mail com prefixo `rubenia850`
- Account ID: `ea9f1c4539c435623c7b8906058e08ed`
- Banco D1 ativo: `fato-portal-db-v2` / `12b7604d-ae2e-4718-99c9-5817a78514bb`
- Worker ativo: `fato-portal-api`
- URL pública: `https://fato-portal-api.rubenia850.workers.dev`
- **Bancos D1 órfãos** (criados durante debug, com dados incompletos, não usados por nada
  em produção — dá pra deletar quando quiser limpar a conta):
  `fato-portal-db` (só schema), `fato-portal-db-v3` (schema + dados parciais),
  `fato-portal-db-v4` (schema + dados parciais)
- O **API_TOKEN real não está em lugar nenhum deste pacote** (nunca foi compartilhado comigo
  em texto) — a usuária precisa colar o dela de novo em `deploy.py` se for rodar de novo.

## 7. Documentos herdados incluídos neste pacote (histórico do projeto, não escritos por mim)

A pedido da usuária, este pacote também inclui os documentos de planejamento e o histórico
completo do projeto FATO (site/banco), que vieram no zip original
`sistema_fato_SITE_v237_worker` e não fazem parte do trabalho desta sessão (API + migração
do portal). Ficam na raiz do pacote e na pasta `historico/`:

- `_LEIA_PRIMEIRO.md`, `_BACKLOG.md`, `_DECISIONS.md` — protocolo BANCO+SITE e backlog
  numerado (SP-NN) do projeto
- `ESTADO_ATUAL.md`, `SCHEMA.md`, `CHANGELOG_PORTAL.md`, `ESTUDO_ARQUITETURA_E_PLANO.md`,
  `ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md`, `VIABILIDADE_PUBLICACAO_E_TRANSPARENCIA.md`,
  `PLANO_ENXUGAMENTO_ESTRUTURA.md` — documentação de estado/arquitetura de sessões
  anteriores (é aqui, no `VIABILIDADE_PUBLICACAO_E_TRANSPARENCIA.md`, que está a "Opção C"
  que motivou construir o Worker em vez de expor o `.db` cru)
- `historico/` — changelogs de versão do banco, auditorias, snapshots de schema antigos,
  sessões passadas

Eu não li esses documentos a fundo nesta sessão além do necessário pra entender a "Opção
C" — trate-os como contexto histórico, não como uma checklist ativa. Se algo neles
conflitar com a seção 1-2 deste HANDOFF (que descreve o estado real, confirmado em
produção, em 24/09/2026), **o estado real descrito aqui em cima é o que vale**.

## 8. Coisas que a usuária pediu e ainda não foram feitas

- Trocar o subdomínio `workers.dev` pra tirar o nome dela da URL (ela decidiu adiar).
