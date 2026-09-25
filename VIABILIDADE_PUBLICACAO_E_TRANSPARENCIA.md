# Viabilidade de Publicação — Hospedagem, Segurança e Transparência de Processo

> Documento de referência, escrito a pedido do autor do projeto (17/07/2026), consolidando a análise
> de viabilidade de hospedagem gratuita feita em conversa, e a decisão de postura sobre os documentos
> internos de construção (`_BACKLOG.md`, `_DECISIONS.md`, `historico/`, estudos, planos). Não é um
> documento de protocolo de sessão (isso continua em `_LEIA_PRIMEIRO.md`) — é uma decisão de produto
> sobre o que publicar e como, registrada uma vez, pra não precisar ser redescoberta.

**Contexto do projeto, pra quem for ler isto de fora:** portal estático (sem backend) que mapeia
cursos e fontes de formação técnica na indústria brasileira, construído com apoio de um assistente de
IA (Claude, Anthropic) ao longo de várias sessões. Não é produto comercial — é demonstração de
capacidade técnica e ferramenta de apoio a estudo, com expectativa de uso por um círculo pequeno.

---

## Parte 1 — Viabilidade de hospedagem gratuita

### 1.1 A restrição de partida: GitHub Pages grátis exige repositório público

Confirmado por busca direta na documentação oficial do GitHub (não por memória, já que isso muda):
hospedar em GitHub Pages com conta pessoal gratuita **só é possível em repositório público**. Repositório
privado com Pages exige GitHub Pro (pago). Isso não tem contorno — é uma decisão de produto do próprio
GitHub, não uma configuração que se ajusta.

**Consequência prática:** se o site vai pro GitHub Pages, o repositório inteiro — código e qualquer
arquivo dentro dele — fica visível pra qualquer pessoa, indexável por buscadores, para sempre (ou até
ser apagado). Isso molda as duas decisões abaixo.

### 1.2 O problema real do banco de dados: não é de configuração, é de arquitetura

O portal usa `sql.js` (SQLite compilado pra WASM) rodando **inteiramente no navegador de quem
visita**. Pra isso funcionar, o navegador precisa baixar o arquivo `.db` inteiro e cru — não uma
consulta, o arquivo completo. Isso é verdade em **qualquer** hospedagem estática (GitHub Pages,
Netlify, Vercel modo estático, Cloudflare Pages): não existe configuração de servidor estático que
permita "consultar sem baixar". A pergunta certa não é "como escondo o banco", é "aceito que o
banco seja público, ou mudo a arquitetura pra ele parar de viajar até o navegador".

Verificação feita no `.db` atual antes de escrever isto: sem CPF, senha, e-mail pessoal ou token.
Tem `cnpj` e `endereco_completo` de empresas (dado institucional, mais próximo de registro público
— mas ainda vale ser deliberado). Mais relevante: o arquivo cru expõe **todo campo interno** de
todas as 118 tabelas, não só o que a interface curada mostra — notas de confiança, métodos de
resolução, achados de auditoria de qualidade de dado, etc.

**Uma armadilha específica a evitar, caso decida usar um banco hospedado (Turso, por exemplo):**
apontar o navegador direto pra uma API de banco hospedado, com uma chave/token embutido no
JavaScript do site, **não resolve o problema — só o desloca**. Qualquer token no código que roda no
navegador é público (visível em qualquer DevTools), e tokens de leitura desse tipo de serviço
tipicamente permitem rodar `SELECT` livre contra a base inteira. Isso é a mesma exposição de antes,
só que "ao vivo" em vez de arquivo — em alguns aspectos pior, por ficar disponível 24h.

### 1.3 Comparativo de opções

| Opção | O que muda | Esforço | Resolve exposição de dado interno? |
|---|---|---|---|
| **A. Estático puro (atual)** — GitHub Pages servindo `portal/` com `.db` embutido | Nada muda no código | Zero — já está pronto | ❌ Não. Todo o banco é baixável por design |
| **B. Banco hospedado (Turso/libSQL), consultado direto do navegador** | Troca o `sql.js` local por chamadas HTTP a um banco remoto | Médio — reescreve `db.js`, mantém schema/queries quase iguais (é SQLite-compatível) | ❌ Não, de verdade. Token fica exposto no cliente; equivale a "arquivo público", só que via API |
| **C. Banco hospedado + função serverless como camada de API** (ex.: Cloudflare D1 + Workers, ou Turso atrás de uma function) | O navegador nunca fala com o banco — só com endpoints seus (`/api/trilhas`, `/api/perfis`...) que decidem o que devolver | Maior — os `loadX.js` que já existem migram de "rodar no navegador" pra "rodar no servidor/edge", isso é escrever handlers de API de fato | ✅ Sim — é a única opção que separa "dado interno" de "dado exposto" de verdade |

Checado agora (não de memória, pra não citar limite desatualizado): o `.db` atual tem ~7,5 MB —
muito abaixo de qualquer limite gratuito relevante em qualquer uma das três opções (Turso: 5–9 GB;
Cloudflare D1: 5 GB; Cloudflare Workers: 100 mil requisições/dia). Custo de infraestrutura não é
o fator decisivo aqui — esforço de engenharia e o que cada opção realmente protege, é.

### 1.4 Recomendação, dado o perfil declarado do projeto

O autor descreveu o projeto como: não-comercial, demonstração de capacidade, uso esperado por
círculo pequeno, sem ambição de crescimento, "no máximo uma linha no currículo". Dado isso:

- **Opção C (função serverless + banco hospedado) é a mais correta tecnicamente** e, sendo honesto,
  é também o sinal de currículo mais forte dos três — mostra entendimento de fronteira
  cliente/servidor e de modelagem de exposição de dado, que a Opção A não demonstra (é só front-end
  estático) e a Opção B demonstra errado (parece resolver segurança, mas não resolve).
- **Mas não é obrigatória** dado o perfil de baixa ambição. Se o conteúdo do banco for aceito como
  público por natureza (é um mapeamento de cursos e fontes de formação — um recurso pensado pra ser
  público, na essência), a Opção A já é honesta o suficiente, **desde que a decisão de aceitar isso
  seja explícita e registrada** (este documento cumpre esse papel), não uma omissão.
- **Caminho intermediário sugerido, se quiser testar a Opção C sem se comprometer:** implementar
  1–2 endpoints de exemplo (ex. `/api/trilhas`, `/api/perfis`) reaproveitando a lógica já escrita em
  `loadTrailsProfiles.js`, publicados como Cloudflare Worker gratuito, mantendo o resto do site como
  está. Dá pra medir o esforço real antes de decidir migrar tudo.

**Decisão em aberto, não tomada por mim:** qual das três opções seguir. Ficou registrado o
trade-off; a escolha é do autor do projeto.

---

## Parte 2 — Postura de transparência sobre os documentos de processo

### 2.1 O que existe hoje

O projeto acumulou, ao longo das sessões, um conjunto de documentos de processo que normalmente
ficariam "atrás de cortina" num projeto comercial: `_BACKLOG.md` (backlog vivo, com itens abertos e
fechados), `_DECISIONS.md` (log de decisões arquiteturais, incluindo as erradas e como foram
corrigidas), `historico/` (sessões e auditorias antigas), `ESTUDO_ARQUITETURA_E_PLANO.md`,
`ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md`, `PLANO_ENXUGAMENTO_ESTRUTURA.md`, e o `LOG.md` de uma
sessão específica de limpeza.

### 2.2 Por que publicar em vez de esconder

O autor colocou isso com clareza: seria incoerente usar ferramentas livres (hospedagem gratuita,
banco de dados gratuito, um assistente de IA como colaborador de desenvolvimento) e, no fim,
esconder como o resultado foi construído. Concordo com a lógica — na tradição de software livre, o
processo costuma valer tanto quanto o artefato final, especialmente pra quem quer aprender ou
replicar. Pontos concretos a favor de publicar tudo:

- **`_DECISIONS.md` documenta erros e correções reais** (ex.: um bug de hooks que impedia o site de
  renderizar, achado só ao testar de ponta a ponta; ambiguidades de dado corrigidas depois de já
  estarem em produção). Isso tem mais valor pedagógico exposto do que escondido — é exatamente o
  tipo de "como eu resolvi isso na prática" que costuma faltar em portfólios polidos demais.
- **`_BACKLOG.md` mostra o raciocínio de priorização** (o que foi resolvido, o que foi
  conscientemente adiado e por quê, o que virou pedido formal entre partes do projeto) — mais
  interessante pra quem quer aprender processo do que qualquer README polido escondendo isso.
- **O uso de IA no processo é factual, não é algo a admitir com pudor.** Os próprios documentos já
  descrevem isso abertamente (sessões "SITE"/"BANCO", protocolo de handoff, correções de rumo).
  Publicar do jeito que está, sem reescrever pra parecer mais "só eu sozinho", é a opção coerente
  com o que o autor pediu.

### 2.3 O que eu sugiro além de só "não esconder"

Publicar os documentos brutos como estão é honesto, mas eles foram escritos **para a próxima sessão
de IA**, não para um leitor humano de fora — são densos, cheios de referência cruzada por código
(`SP-NN`, `D-NN`), e assumem contexto acumulado. Duas coisas ajudam sem contradizer a transparência:

1. **Um documento novo, tipo `COMO_FOI_CONSTRUIDO.md`**, escrito uma vez para leitor humano, que
   funciona como porta de entrada pros demais — não substitui `_BACKLOG.md`/`_DECISIONS.md`, só
   explica o que eles são, por que existem nesse formato, e aponta pra eles. Sugestão de estrutura:
   - Motivação do projeto e por que existe.
   - Como o processo funcionou na prática (sessões de IA como colaborador de desenvolvimento,
     divididas por papel — ex. a convenção "SITE"/"BANCO" usada aqui — e por que separar assim
     ajudou).
   - O papel de cada documento vivo (`_BACKLOG.md` = pendências e pedidos entre partes do projeto;
     `_DECISIONS.md` = por que cada decisão não-óbvia foi tomada, incluindo as revertidas depois).
   - 2-3 exemplos concretos e legíveis de erro real encontrado e corrigido (não os 100, só os mais
     ilustrativos) — isso é o que mais ajuda quem for replicar o processo.
   - O que ficaria diferente numa próxima vez (honestidade sobre limitação, não só o que deu certo).
2. **Não precisa reescrever nem resumir os documentos existentes** — eles continuam como registro
   técnico primário. O documento novo é um guia de leitura, não uma substituição.

**Decisão em aberto, não tomada por mim:** se esse `COMO_FOI_CONSTRUIDO.md` é algo que o autor prefere
escrever com a própria voz (mais autêntico, é sobre a experiência dele) ou se quer que eu monte um
primeiro rascunho a partir do material que já existe, pra editar em cima.

---

## Parte 3 — Estrutura de repositório proposta (assumindo publicação total)

Dado que tudo vai ficar público (Parte 1 + Parte 2 juntas), um único repositório público, sem
necessidade de separar em "público" e "privado" como eu tinha sugerido antes desta conversa —
essa sugestão anterior partia da premissa de esconder os documentos internos, que não é mais o
plano.

```
/ (raiz do repositório público)
├── README.md                              ← novo: porta de entrada, aponta pro COMO_FOI_CONSTRUIDO
├── COMO_FOI_CONSTRUIDO.md                 ← novo, sugerido acima
├── VIABILIDADE_PUBLICACAO_E_TRANSPARENCIA.md  ← este documento
├── _BACKLOG.md
├── _DECISIONS.md
├── _LEIA_PRIMEIRO.md
├── ESTUDO_ARQUITETURA_E_PLANO.md
├── ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md
├── PLANO_ENXUGAMENTO_ESTRUTURA.md
├── CHANGELOG_PORTAL.md
├── SCHEMA.md
├── ESTADO_ATUAL.md
├── historico/                             ← sessões e auditorias antigas, como já organizado
└── portal/                                ← o site em si (o que de fato é publicado no Pages)
```

Sem necessidade de `.gitignore` escondendo nada além do óbvio (`node_modules/`, se um dia houver
etapa de build). O `.db` dentro de `portal/dados/` continua público — decisão explícita da Parte 1,
não omissão.

---

## Direção futura registrada (não desenvolvida ainda)

Em conversa após a primeira versão deste documento, ficou definido que a Parte 2 acima (o
`COMO_FOI_CONSTRUIDO.md`) não é mais um guia de replicação — vira a semente de um **projeto
separado**: um estudo sobre colaboração humano-IA em si, usando este projeto (portal + seus
documentos de processo) como dataset real, não como o objeto final. Foco em fricção de coordenação
real (ex.: colisão de numeração `D114` entre duas sessões paralelas sobre o mesmo pacote-base;
o próprio protocolo `_LEIA_PRIMEIRO.md` existindo por causa de uma colisão anterior; casos de
pedido malinterpretado e reformulado) — não em "como construir um portal parecido".

Por ora, fica só registrado como direção futura. Sem outline, sem desenvolvimento — retomado quando
fizer sentido, como projeto à parte.

---



1. Manter arquitetura estática (banco público, decisão aceita) ou migrar pra função serverless +
   banco hospedado (Opção C, Parte 1) — pode ser testado em pequena escala primeiro (1–2 endpoints).
2. Escrever `COMO_FOI_CONSTRUIDO.md` com a própria voz, ou pedir um rascunho inicial pra editar.
3. Nome final do repositório/organização no GitHub (não abordado aqui — é decisão de branding pessoal).
