# Estudo de Arquitetura e Plano — Portal IndústriaEDU

**Papel assumido nesta sessão:** arquiteto do lado SITE — presente e futuro, não só o próximo sprint.
**Data:** 05/07/2026 · **Base:** `fato_v128.db`, `App.jsx` (2685 linhas), pasta completa do projeto.
**Princípio deste documento:** nada aqui foi escrito por impressão. Todo número vem de comando rodado contra o código ou o banco reais. Onde a ação é urgente, digo por quê. Onde pode esperar, digo isso também — sem inflar prioridade pra parecer mais produtivo.

---

## 0. Achado desta sessão que não podia esperar — já corrigido

Antes de qualquer plano de futuro, uma verificação de presente: **o `index.html` real do projeto nunca renderizava o site pra nenhum visitante**, por dois motivos que não têm nada a ver com o bug de hooks já corrigido no D88. Testei a lógica real (não uma cópia adaptada) trocando só os domínios de CDN bloqueados no meu sandbox por espelhos locais — sem mudar uma linha de código — e reproduzi o crash: `exports is not defined`, depois `Cannot read properties of undefined (reading 'useState')`. Corrigido, retestado, confirmado funcionando. Detalhe completo em D93 (`_DECISIONS.md`).

**Por que isso importa pra este documento:** o D88 tinha afirmado "reproduzido end-to-end, sem erro" — mas isso só era verdade pro meu ambiente de teste, que eu já tinha adaptado sem perceber que divergia do arquivo real entregue. Isso é a lição mais cara desta sessão, e ela molda o tom do resto do documento: **daqui pra frente, nenhuma validação conta como validação se não foi feita contra o artefato exato que será entregue.**

---

## 1. Raio-x do presente

### 1.1 Como o site funciona hoje

Zero build step. `index.html` carrega React 18 e Babel Standalone via CDN (`unpkg.com`), `App.jsx` é buscado como texto e transpilado **no navegador, a cada carregamento**, pro dialeto clássico do React (`React.createElement`). O banco inteiro (`fato_v128.db`, **7,2 MB**) é baixado pelo navegador e aberto com `sql.js` (SQLite compilado pra WASM) — não existe servidor, não existe API, não existe camada de acesso a dado nenhuma. Toda consulta que o app faz é uma query SQL rodando dentro da aba do navegador do visitante.

Isso foi uma escolha de MVP razoável pra sair do zero rápido. Mas o projeto passou de protótipo pra produto real (733→651 empresas, 106 trilhas, 98 perfis, 128 versões de banco) sem que a arquitetura acompanhasse.

### 1.2 O monólito, com números

`App.jsx` tem **2685 linhas**, um único arquivo, misturando 4 responsabilidades que não deveriam morar juntas: acesso a dado (`loadX(db)`), componentes de apresentação (`ViewX`), lógica de busca (FTS5) e o componente raiz de orquestração. As 5 maiores funções:

| Linhas | Função | Problema |
|---|---|---|
| 444 | `ViewProfiles` | Uma função só renderiza lista + detalhe + roteiro de carreira + rede + onde estudar + premio de transferência — 6 preocupações diferentes |
| 278 | `ViewSectors` | Mesma coisa: lista + detalhe + panorama do setor |
| 163 | `ViewExplore` | Filtro + busca + listagem + cards, tudo junto |
| 137 | `loadProfiles` | Uma função de carga que já faz 9 JOINs diferentes — cresce a cada tabela nova |
| 131 | `App` (raiz) | Orquestra roteamento, estado global, carga de dado e efeitos — deveria só orquestrar |

Nenhuma dessas é "código ruim" isoladamente — o problema é **acoplamento por arquivo único**: qualquer mudança, por menor que seja, precisa entender o arquivo inteiro pra não quebrar nada (foi exatamente por isso que o bug de hooks do D88 ficou 3 sprints sem ser visto — ninguém rodou o arquivo de ponta a ponta, só editou trechos).

### 1.3 Sistema visual: avaliação honesta

- **590 blocos `style={{...}}` inline**, a maioria hardcoding cor em vez de usar o objeto de tokens que já existe (`const C = {...}`, linha 39) — **75 cores hex distintas** espalhadas pelo arquivo, sendo que muitas são a mesma cor escrita do zero em vez de referenciada (`#64748b` aparece 81 vezes como string literal).
- **Tipografia:** `font-family: system-ui, -apple-system, sans-serif` — pilha padrão do sistema operacional, nenhum par de fontes intencional. Zero `@font-face` carregado.
- **Movimento:** 11 usos de `transition`/`:hover` em 2685 linhas — praticamente estático.
- **A home page** segue exatamente o padrão que a diretriz de design deste ambiente identifica como resposta-padrão-de-IA: "um número grande com um rótulo pequeno, estatísticas de apoio" (6 cards de contagem lado a lado). Não é errado, mas é o piloto automático, não uma escolha.
- **Paleta:** fundo quase-preto (`#060810`/`#0f172a`) com múltiplos acentos (verde, azul, roxo, laranja) — melhor que "um acento só", mas ainda dentro da família visual mais genérica de IA (fundo escuro + acento vibrante), sem nenhum elemento de assinatura que remeta ao *assunto* real (educação técnica industrial brasileira).

**Não é feio. É genérico.** Funciona, mas não tem uma escolha visual que só faria sentido pra este produto específico.

---

## 2. Segurança — registrado para o futuro, nada aqui é incêndio hoje

Nenhum destes é urgente pro estado atual do produto (dado público, sem informação sensível de usuário). Registro porque **decisões de arquitetura ficam mais caras de mudar quanto mais o produto cresce** — melhor decidir agora com calma do que descobrir sob pressão depois.

| # | Achado | Risco real hoje | Por que registrar agora |
|---|---|---|---|
| 1 | **O banco inteiro é um arquivo baixável.** Qualquer visitante pode ir direto em `/portal/dados/fato_v128.db` e baixar as 7,2 MB, incluindo as **37 tabelas de uso interno** (`dm_completude_fontes`, `dm_proveniencia_dados`, `meta_protocolo` — as regras de processo do BANCO —, meu próprio `site_sync_log`) que a UI nunca mostra. Não tem controle de acesso porque não tem servidor. | Baixo (dado já é público por natureza do produto) | Se o projeto algum dia guardar qualquer coisa não-pública (parcerias em negociação, notas internas, dado de usuário cadastrado), essa arquitetura vaza tudo por padrão, sem exceção possível |
| 2 | **Dependências de CDN sem verificação de integridade** (sem atributo `integrity=`/SRI) e **sem versão travada** (`@babel/standalone` sem número de versão — sempre pega "o mais recente") | Baixo-médio | Ataque de cadeia de suprimentos (a CDN ou o pacote serem comprometidos) executaria JS arbitrário na página, sem nenhuma trava |
| 3 | **Sem Content-Security-Policy** | Baixo | Composto com o item 2 — nada limita de onde scripts podem vir |
| 4 | Busca FTS5: entrada do usuário **é bem tratada** (parametrizada via `?`, com `try/catch`) — ponto positivo, registrado aqui só pra constar que já verifiquei | — | Nenhuma ação necessária |
| 5 | `dangerouslySetInnerHTML`: **não é usado em nenhum lugar** do arquivo — sem vetor de XSS óbvio hoje | — | Nenhuma ação necessária, mas vale manter essa disciplina ao adicionar código novo |

**Recomendação, sem prazo:** se algum dia este produto ganhar autenticação, dado de usuário, ou parceria com informação não-pública, a arquitetura "banco inteiro no cliente" precisa ser repensada primeiro — não dá pra remendar depois.

---

## 3. Proposta: quebrar o monólito

Não é um pedido pra fazer agora — é o desenho de como fatiar quando alguém for mexer a fundo no portal. Proposta de módulos, mantendo zero-build (compatível com o `index.html` atual) via ES modules nativos do navegador, que já são usados por `db.js`:

```
portal/
  index.html
  db.js                      (já modular, sem mudança)
  app/
    App.jsx                  (só orquestração: roteamento + estado global — ~150 linhas)
    data/
      loadSocial.js
      loadTechnical.js
      loadTrails.js
      loadProfiles.js        (quebrar em loadProfiles + loadProfilesEnrichment)
      loadSectors.js
      loadMercado.js
      loadComplementarity.js
      searchIndex.js
    components/
      SourceCard.jsx
      TrailCard.jsx
      Nav.jsx
      badges.jsx              (UrlStatusBadge, TierBadge, ImpactBadge, Tag)
    views/
      ViewHome.jsx
      ViewExplore.jsx
      ViewTrails.jsx
      ViewProfiles/
        index.jsx              (~80 linhas: layout + roteamento interno)
        ProfileList.jsx
        ProfileDetail.jsx
        RedeDeCarreira.jsx
        RoteiroDeCarreira.jsx
        OndeEstudar.jsx
        ValeAPenaMigrar.jsx
      ViewSectors/
        index.jsx
        SectorList.jsx
        SectorDetail.jsx
        PanoramaDoSetor.jsx
      ViewMercadoTrabalho.jsx
      ViewEmpresas.jsx
      ViewGuideBlocks.jsx
      ViewGaps.jsx              (a "Cobertura Guia × Atlas")
      ViewAbout.jsx
    theme/
      tokens.js                 (expandir o `C` atual pra cobrir as 75 cores achadas)
      styles.js                 (pill/card/btn — já existem, só mudam de lugar)
```

**Por que isso, e não um bundler ainda:** dá pra fazer essa quebra **sem adicionar Vite/webpack**, só usando `<script type="module">` que já está em uso em `db.js`. É o meio-termo: resolve o acoplamento sem exigir um passo de build novo, adiando essa decisão maior pra quando (e se) o projeto justificar o investimento.

**Quando justificaria um bundler de verdade:** se a contagem de arquivos passar de ~20-25, ou se a transpilação no navegador (hoje, todo visitante recompila 2685 linhas de JSX a cada carregamento) começar a pesar no tempo de carregamento perceptível — nesse ponto, Vite com plugin React é a escolha natural, sem mudar a filosofia zero-servidor.

---

## 4. Proposta de direção visual

Não é um redesign completo agora — é uma direção registrada, pronta pra quando fizer sentido investir nisso.

- **Assunto real do produto:** educação técnica industrial brasileira — chão de fábrica, normas técnicas, CBOs, chapas de identificação de máquina. Isso é material rico pra tipografia e estrutura, muito mais específico que "dashboard escuro genérico".
- **Tipografia:** considerar uma fonte monoespaçada de verdade (não só `fontFamily:"monospace"` improvisado, como já é feito pra CBOs/normas) pareada com uma sans-serif de peso técnico — remete a ficha técnica/datasheet industrial, que é literalmente o que várias telas do site são. **✅ Implementado em 14/07/2026:** IBM Plex Sans (texto/títulos) + IBM Plex Mono (os 13 usos de `fontFamily:"monospace"` improvisado, agora carregando de verdade via Google Fonts) — substitui também a "Inter" que o `App.jsx` pedia sem nunca ter carregado (achado nesta sessão: nenhum `@font-face`/link em lugar nenhum, sempre caiu no fallback do sistema). Ver `index.html`, `CHANGELOG_PORTAL.md` v3.19, D110.
- **Um elemento de assinatura:** o produto já tem um dado nativo interessante e sub-explorado visualmente — o grafo de "Rede de Carreira" (`dm_rede_centralidade`/`dm_rede_comunidades`, hoje só um badge de texto "HUB PRINCIPAL · 87 conexões"). Isso poderia ser a peça de assinatura visual do produto: uma visualização de rede de verdade na página de perfil, em vez de um número. **✅ Implementado em 14/07/2026 (D111):** grafo radial por perfil (`components/RedeDeCarreira.jsx`) + visão geral nova (`views/ViewRedeCarreira.jsx`), usando `dm_sinonimos_perfis` (laço forte, dado específico) e `dm_rede_comunidades` (laço fraco, aproximação) sem misturar os dois como se fossem a mesma força de conexão. Ver `CHANGELOG_PORTAL.md` v3.20.
- **Paleta:** manter fundo escuro (funciona bem pro público-alvo, uso prolongado, muitos números), mas fazer os múltiplos acentos existentes (verde/azul/roxo/laranja) seguirem uma lógica explícita e documentada (ex: verde = ganho financeiro, azul = navegação/CBO, roxo = rede/relacionamento, laranja = alerta/pré-requisito) — hoje a lógica existe implicitamente no código, mas nunca foi declarada como sistema. **✅ Implementado em 14/07/2026 (D109):** a lógica foi auditada no código real (não reinventada) e documentada como comentário no topo de `theme/tokens.js`; achada e corrigida uma inconsistência real (código CBO ora azul, ora roxo, sem critério — padronizado para azul). Ver `CHANGELOG_PORTAL.md` v3.18.

---

## 5. Faxina na pasta do projeto

**Inventário: 15 arquivos `.md` na raiz + 10 sprints soltos em `portal/` + 2 na pasta `auditorias/` = 27 documentos markdown, 375 KB de texto, 5838 linhas.** Isso não é exagero por si só — é sintoma de duas convenções de documentação que nunca foram unificadas (achado do D80, ainda sem resolução).

### 5.1 O problema real: duas convenções coexistindo, com conteúdo genuinamente diferente

| Convenção antiga (SITE) | Convenção nova (BANCO) | Situação |
|---|---|---|
| `_LEIA_PRIMEIRO.md` (168 linhas) | `ESTADO_ATUAL.md` (177 linhas) | Ambos tentam ser "o ponto de entrada" — conteúdo diferente, nenhum aponta claramente pro outro |
| `_CHANGELOG.md` (740 linhas) | `CHANGELOG.md` (710 linhas) + `CHANGELOG_fato.md` (435 linhas) | **Não são duplicatas** — cobrem períodos diferentes (`_CHANGELOG.md` vai até v3.11/27-06; `CHANGELOG.md` para em v97; `CHANGELOG_fato.md` cobre v106-109) — três fatias de tempo, nenhuma completa sozinha |
| — | `HISTORICO_SESSOES.md` (320 linhas) | Sem equivalente do lado SITE — decisões de processo do BANCO |
| — | `SCHEMA.md` (476 linhas) | Sem equivalente do lado SITE — documentação de schema, deveria ser autoridade única |

**Recomendação:** não apagar nada — consolidar com nome que declare o período coberto (`CHANGELOG_ate_v97.md`, `CHANGELOG_v98_v109.md`, por exemplo), e escrever **um único** documento de entrada que substitua tanto `_LEIA_PRIMEIRO.md` quanto `ESTADO_ATUAL.md`, com uma seção clara "isto sobrepõe os dois documentos anteriores, mantidos só como histórico".

### 5.2 Arquivos concretamente obsoletos (candidatos a arquivar, não apagar)

| Arquivo | Por quê |
|---|---|
| `portal/README.md` (356 linhas!) | Data de "Sprint 17", contagens hardcoded que já não batem com o banco atual (v128) — o próprio arquivo se autodeclara descartável ("não copie os números abaixo sem confirmar"). Conteúdo único que vale preservar: a explicação da migração JSON→SQLite (Sprint 6) — o resto é redundante com `_BACKLOG.md`/`_DECISIONS.md` |
| `README.md` (raiz) | Diz "Pacote da versão v94" — 34 versões desatualizado |
| `PLANO_ELIMINACAO_IEDU.md` + os JSONs de extração | Item já **concluído e confirmado** (SP-27) — mover pra uma pasta `concluido/` ou `arquivo/`, mantendo como prova de trabalho feito, tirando da visão ativa |

### 5.3 Sprints soltos → consolidar em 1 arquivo histórico

10 arquivos (`SPRINT6` a `SPRINT17`, faltando 1-5, 7, 13 — provavelmente cobertos em outro lugar) somando **584 linhas**. Nenhum motivo pra ficarem arquivos separados — são só entradas cronológicas do mesmo tipo de conteúdo. Proposta: um único `portal/HISTORICO_SPRINTS.md`, cada sprint como uma seção `##`, ordenado por número, com um índice no topo. Reduz de 10 arquivos pra 1, sem perder nenhuma linha de conteúdo.

### 5.4 `_BACKLOG.md` e `_DECISIONS.md` — cuidado que já se aplica, vale reforçar

746 e 587 linhas respectivamente, crescendo a cada sincronização (e vão continuar crescendo). Não são candidatos a "limpar" — são o registro mais valioso do projeto —, mas quando passarem de ~1000 linhas cada, vale paginar por data (`_DECISIONS_2026H1.md`, `_DECISIONS_2026H2.md`) pra não virarem inviáveis de carregar/ler inteiros. Não é problema hoje — é a próxima parede que o projeto vai bater se continuar no ritmo atual.

---

## 6. Gaps que restam do lado do site (puxado do backlog vivo)

| Item | Descrição | Esforço |
|---|---|---|
| `SP-12` (Grupo D) | 8 tabelas `dm_*` ainda não classificadas quanto a expor ou não — inclui `dm_completude_fontes`, que suspeito ser infraestrutura interna (mesma família do achado de segurança §2) | Baixo — é só decisão + eventual UI |
| `SP-19` | Rede de empresas sem ponte com instituições de ensino — parcial, 100 candidatos de baixa confiança (todos ENAP) | Depende de dado melhor do BANCO |
| `SP-35` | Decisão de produto pendente: indicar visualmente que `TRL-CNCT-030`/`004` são a mesma trilha em 2 modalidades | Baixo |
| `SP-37` | `runSmokeTest` compara contra números da v55 — atualizar ou trocar por checagem de schema dinâmica | Baixo |

Todo o resto de aberto (`SP-04/05/07/08/09/15/16/17/21/22/23/24/25/32/33/34/39/40`) é do lado **Dados** — não bloqueia nem depende de trabalho nosso, só de quando o BANCO tratar.

---

## 7. Prontos para a próxima sincronização — checklist consolidado

Este é o runbook que já vimos funcionar em 6 rodadas (v71 até v128). Registro formal aqui pra não depender de memória:

1. **Confirmar versão real**: `MAX(version)` em `db_versions_v2` bate com o número no nome do arquivo? (D81 — já corrigido há 3 rodadas, mas seguir checando)
2. **Checagem de schema (Regra 1)**: todo `FROM tabela` que `App.jsx` usa existe no banco novo? Rodar o grep + comparação com `sqlite_master`, não assumir.
3. **`micro_atlas_pdf` intacto**: a checagem original que motivou todo este protocolo (78/99 cursos) — nunca pular.
4. **Toda chave de JOIN das tabelas `dm_*` do Grupo B/C** (11 chaves, listadas no `AUTOAUDITORIA_SITE.md`) — reconfirmar 0 órfãos, não assumir que continua igual.
5. **Render real de ponta a ponta** (Playwright + Chromium headless, contra o banco exato que será entregue — não uma cópia adaptada) — navegar as 10 abas + abrir 1 perfil + 1 trilha, checar console limpo.
6. **Ler `_DECISIONS.md` do BANCO** (se vier) atrás de colisão de numeração `SP-NN`/gap — já aconteceu 3 vezes (D79, e as 2 colisões internas do próprio BANCO documentadas em D83).
7. **Atualizar `db.js` `DB_PATH`** e `site_sync_log` (nunca mais `db_versions` — ver D92).

---

## 8. O que o passado ensinou (síntese de D79 a D93)

- **Nunca confiar em número de arquivo sem conferir o conteúdo real** (D81, D83, D93 — três achados diferentes, mesma lição).
- **Colisão de numeração entre sessões que não se veem é a regra, não a exceção** (D79, D83, SP-39/40) — qualquer convenção de ID compartilhada precisa de dono único ou namespace separado — inclusive a minha própria (D92).
- **Validar contra o artefato exato que será entregue, não contra uma cópia adaptada pra rodar** (D93) — a lição mais cara, porque quase passou despercebida dentro de uma vitória (D88).
- **Descrição de patch/cheklist não é prova — só o estado físico, verificado por query direta, é** (gap 90026, D81).
- **Achado que parece pequeno pode ser estrutural** — a "colisão de nome de trilha" que a auditoria externa achou virou um padrão recorrente (`SP-29`/`30`/`35`); o "SETOR null" que parecia só estética revelou 26% de dado sem classificação.

---

## 9. Roadmap priorizado

### Já feito nesta sessão (sem esperar por prioridade — eram triviais e seguros)
- ✅ `index.html` corrigido (§0)
- ✅ Poluição de `db_versions` corrigida (D92)

### Curto prazo (próxima vez que alguém for mexer no portal)
- Consolidar `_LEIA_PRIMEIRO.md`/`ESTADO_ATUAL.md` num único ponto de entrada
- Consolidar os 10 sprints em 1 arquivo
- Resolver `SP-35`/`SP-37` (esforço baixo, sem dependência)
- Adicionar `integrity=`/SRI nos scripts de CDN (5 minutos, elimina o item 2 de segurança)

### Médio prazo (quando o portal ganhar a próxima leva de features)
- Quebrar `App.jsx` nos módulos propostos em §3, começando pelas views maiores (`ViewProfiles`, `ViewSectors`)
- Decidir SP-12 Grupo D (8 tabelas restantes)
- Expandir `theme/tokens.js` pra cobrir as 75 cores hoje soltas

### Longo prazo (decisão de produto, não só engenharia)
- Direção visual de assinatura (§4) — em especial, a visualização de rede como peça central
- Reavaliar arquitetura client-side-only (§2) **se e quando** o produto ganhar qualquer dado não-público
- Avaliar bundler (Vite) se a contagem de arquivos ou o tempo de transpilação no navegador começarem a doer de verdade

---

*Nenhum item de médio/longo prazo precisa de ação imediata. Este documento existe pra não perder o raciocínio entre uma sessão e a próxima — o mesmo motivo por trás de `_DECISIONS.md`.*
