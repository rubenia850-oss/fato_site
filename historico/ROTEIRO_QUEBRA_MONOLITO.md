# Roteiro — Quebra do Monólito `App.jsx`

> ✅ **CONCLUÍDO (05/07/2026).** Todas as 8 etapas executadas e verificadas — ver `_DECISIONS.md`
> D98 a D106 para o histórico completo, achados e correções de cada etapa. `App.jsx`: 2823 → 170
> linhas (94% de redução), distribuído em 23 módulos. 2 bugs reais encontrados e corrigidos pelo
> próprio protocolo de verificação ao longo do processo (D104 — divergência por reconstrução de
> memória; D106 — regressão de performance de 9-16s para ~3s no carregador). Este documento fica
> como registro do planejamento original — o estado real e verificado está em `_DECISIONS.md`.

**Objetivo deste documento:** não é informar o que vou fazer — é o roteiro que eu mesmo sigo, com ordem, critério de parada, e o que fazer se algo der errado em cada etapa. Escrito depois de **provar** o mecanismo mais arriscado (carregador de múltiplos módulos no navegador, sem bundler), não antes.

**Estado no início desta rodada:** `App.jsx`, 2823 linhas, 41 funções/componentes, arquivo único.

---

## 0. O problema técnico que precisava ser resolvido primeiro

Hoje o `index.html` busca `App.jsx` como texto único e roda `Babel.transform` nele inteiro, uma vez. Pra quebrar em módulos, o navegador precisa saber carregar **vários** arquivos `.jsx`/`.js`, na ordem certa, sem bundler.

**Testado agora, isoladamente, antes de tocar no projeto real:** um carregador mínimo de ~50 linhas que (1) busca um arquivo, (2) acha os `import ... from "./X"` por regex, (3) busca e transpila cada dependência primeiro, recursivamente, (4) executa em ordem topológica com `require()`/`module.exports` isolados por arquivo. Testado com 3 arquivos reais (`theme.js` → `Widget.jsx` → `Main.jsx`, import cruzado de named export e default export, componente React usando token de outro arquivo) — **renderizou certo na primeira tentativa correta** (a primeira tentativa teve um bug real: tentava buscar `"react"` como se fosse arquivo, 404, corrigido).

Esse carregador substituirá o trecho de `index.html` que hoje só busca `App.jsx` sozinho. O resto do `index.html` (shim de `exports`/`module`/`require` pra `react`/`react-dom`, splash, montagem) não muda.

---

## 1. Mapa de módulos (baseado no inventário atual, 41 funções)

| Módulo novo | Conteúdo | Linhas hoje | Depende de |
|---|---|---|---|
| `theme/tokens.js` | `C`, `pill`, `card`, `btn`, `SEL`, `LAYER_META`, `URL_STATUS_META`, `TIER_COLOR` | ~80 | nada |
| `utils/helpers.js` | `slugify`, `groupBy` | ~50 | nada |
| `components/badges.jsx` | `UrlStatusBadge`, `Tag`, `FavBtn`, `CopyBtn`, `TierBadge`, `ImpactBadge`, `urlConfMeta` | ~45 | `theme/tokens.js` |
| `components/LoadingScreen.jsx` | `LoadingScreen` | 13 | `theme/tokens.js` |
| `components/Nav.jsx` | `Nav` | 92 | `theme/tokens.js` |
| `components/SourceCard.jsx` | `SourceCard` | 104 | `theme/tokens.js`, `components/badges.jsx` |
| `components/TrailCard.jsx` | `TrailCard` | 93 | `theme/tokens.js` |
| `data/loadSocialTechnical.js` | `loadSocial`, `loadTechnical`, `loadCourseEnrichment`, `loadSourceTags`, `loadTagsAndFormats` | ~114 | `utils/helpers.js` |
| `data/loadTrailsProfiles.js` | `loadTrails`, `loadProfiles`, `loadGuideBlocks`, `loadAtlasTrails` | ~366 | `utils/helpers.js` |
| `data/loadSectorsGuia.js` | `loadSectors`, `loadGuia`, `loadComplementarity`, `loadSectorFato` | ~112 | `utils/helpers.js` |
| `data/loadMercadoEmpresas.js` | `loadCompanies`, `loadMercadoTrabalho`, `loadSinaisMercado` | ~119 | `utils/helpers.js` |
| `data/searchIndex.js` | `buildSearchIndex`, `ftsQueryFromTerm`, `searchFTS` | ~48 | nada (usa `query` de `db.js`) |
| `data/loadCore.js` | `loadCore`, `runSmokeTest` | ~53 | todos os `data/load*.js` acima |
| `views/ViewHome.jsx` | `ViewHome` | 71 | `theme` |
| `views/ViewAbout.jsx` | `ViewAbout` | 29 | `theme` |
| `views/ViewTrails.jsx` | `ViewTrails` | 51 | `theme`, `components/TrailCard.jsx` |
| `views/ViewEmpresas.jsx` | `ViewEmpresas` | 97 | `theme` |
| `views/ViewExplore.jsx` | `ViewExplore` | 163 | `theme`, `components/SourceCard.jsx` |
| `views/ViewGuideBlocks.jsx` | `ViewGuideBlocks` | 124 | `theme` |
| `views/ViewGaps.jsx` | `ViewGaps` (aba "Cobertura Guia × Atlas") | 122 | `theme` |
| `views/ViewMercadoTrabalho.jsx` | `ViewMercadoTrabalho` | 200 | `theme` |
| `views/ViewSectors.jsx` | `ViewSectors` | 278 | `theme` |
| `views/ViewProfiles.jsx` | `ViewProfiles` | 444 | `theme`, `components/*` |
| `App.jsx` | Só o componente raiz: `DataContext`, `useData`, roteamento, orquestração | ~134 (era 2823) | tudo acima |

**23 arquivos no total** (era 1). Média de ~120 linhas por arquivo — bem mais gerenciável que um arquivo de 2823.

---

## 2. Ordem de execução — de menor pra maior risco

A regra: **nunca extrair um módulo antes de todos os módulos dos quais ele depende já estarem extraídos e verificados.** Cada etapa é independente — dá pra parar entre uma e outra sem deixar o projeto quebrado.

| # | Etapa | Risco | Por quê nessa posição |
|---|---|---|---|
| 1 | `theme/tokens.js` + `utils/helpers.js` | Muito baixo | Zero dependência, já testamos que a extensão de tokens (D97) não muda nada visual — é literalmente mover o mesmo objeto de lugar |
| 2 | `components/badges.jsx`, `LoadingScreen.jsx`, `Nav.jsx` | Baixo | Componentes pequenos, só dependem do tema |
| 3 | `components/SourceCard.jsx`, `TrailCard.jsx` | Baixo-médio | Um pouco maiores, usados por várias views — testar bem antes de seguir |
| 4 | `data/*.js` (5 arquivos) | Baixo | Funções puras `(db) => dado`, sem JSX, mais fácil de verificar (dá pra comparar o objeto retornado antes/depois, não só pixel) |
| 5 | Views pequenas: `ViewHome`, `ViewAbout`, `ViewTrails`, `ViewEmpresas` | Médio | Primeira vez extraindo uma `View` completa (JSX + hooks de estado local) |
| 6 | Views médias: `ViewGuideBlocks`, `ViewGaps`, `ViewExplore`, `ViewMercadoTrabalho` | Médio | Mais lógica interna, mais chance de referência cruzada esquecida |
| 7 | Views grandes: `ViewSectors`, `ViewProfiles` | Alto | As duas maiores (278 e 444 linhas) — deixadas por último de propósito |
| 8 | `App.jsx` final | Alto | Só depois que tudo acima estiver fora — é a última coisa a mudar, quando já não sobra quase nada nela |

---

## 3. Protocolo de verificação — repetido a cada etapa, sem exceção

Mesmo protocolo de 4 camadas usado no D97 (expansão de tokens), que já provou pegar erro real (o bug do `re.escape`):

1. **Sintaxe válida** — Babel `transformSync` em cada arquivo novo E no `App.jsx` restante.
2. **Console limpo em execução real** — Playwright, `pageerror` zero.
3. **Zero violação de Regra de Hooks** — `eslint-plugin-react-hooks` no conjunto de arquivos.
4. **Comparação pixel a pixel** contra o último estado bom conhecido, nas 8 telas principais (mesmo roteiro do D97) — qualquer diferença além de ruído de anti-aliasing (1-2 unidades RGB, poucos pixels) para o processo e é investigada antes de continuar.

**Critério de parada:** se qualquer uma das 4 camadas falhar numa etapa, reverto só aquela etapa (o arquivo monolítico anterior fica guardado) e não avanço pra próxima até resolver.

---

## 4. Mecanismo de carregamento — o que muda no `index.html`

Troca isto:
```js
fetch("./App.jsx").then(r => r.text()).then(source => {
  const { code } = Babel.transform(source, {...});
  // executa como script único
});
```

Por um carregador que resolve o grafo de módulos (testado nesta sessão, ~50 linhas):
```js
async function loadModule(path) { /* busca + acha imports + recursa nas dependências + transpila */ }
function executeModule(path) { /* executa em ordem, com require()/module.exports isolado por arquivo */ }
await loadModule("./App.jsx");
const AppExports = executeModule("./App.jsx");
```

Isso preserva 100% a filosofia zero-build atual (Babel roda no navegador, nenhum passo de `npm run build`) — só ensina o navegador a montar o quebra-cabeça de vários arquivos em vez de um só.

---

## 5. Rollback e segurança

- O `App.jsx` monolítico atual **não é apagado** até a migração completa passar pelas 4 camadas de verificação em todas as 8 telas.
- Cada etapa gera um pacote testado e versionado (mesmo padrão de sincronização já usado no projeto) — dá pra parar em qualquer etapa e ainda ter um site funcionando, só com o monólito parcialmente reduzido.
- Se a etapa 7 (views grandes) ou 8 (`App.jsx` final) revelar problema estrutural inesperado, as etapas 1-6 já entregaram valor real (18 dos 23 arquivos) mesmo sem terminar as últimas 2.

---

## 6. O que este roteiro **não** resolve, de propósito

- Não introduz bundler (Vite/webpack) — o carregador testado é deliberadamente simples (regex, não parser AST completo) e assume que os imports do projeto seguem o padrão comum (`import X from "./Y"`, `import { A, B } from "./Y"`) sem casos exóticos (import dinâmico, re-export, etc.) — **se algum arquivo do projeto usar uma sintaxe de import que o regex não reconhece, a extração daquele módulo especificamente precisa de ajuste no carregador antes de prosseguir.**
- Não resolve o achado de segurança do `ESTUDO_ARQUITETURA_E_PLANO.md` (banco inteiro baixável) — isso é decisão de arquitetura de dado, não de organização de código.
- Não muda nenhuma lógica de negócio, nenhuma query, nenhum comportamento — é reorganização pura, com o mesmo padrão de prova (pixel-diff) usado no D97 pra garantir isso.

---

*Pronto pra executar a partir da Etapa 1. Cada etapa seguinte só começa depois da anterior passar pelas 4 camadas de verificação.*
