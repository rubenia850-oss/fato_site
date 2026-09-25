# Relatório de Ruído no Banco de Dados — visto pelo Portal (sessão SITE)

> ⚠️ **Atualizado em 04/07/2026:** este relatório foi feito em cima de `fato_v109.db`. O banco já avançou para `fato_v128.db`, e um recheck item-a-item já foi feito — **ver `RECHECK_RUIDO_v109_v128.md`** para o estado atual de cada achado (o que foi corrigido, o que não foi). Os números abaixo (325/733) são o estado histórico da v109, não o estado atual — mantidos aqui como registro da auditoria original, não como situação corrente.

**Banco auditado:** `fato_v109.db` (`/portal/dados/fato_v109.db` no pacote sincronizado mais recente)
**Método:** leitura das telas do portal como um visitante veria, sem contexto prévio, cruzada com query direta no banco pra confirmar cada achado (nenhum item abaixo é só impressão visual — todos têm contagem exata).
**Data:** 04/07/2026

---

## Resumo

Abrindo o portal pela primeira vez, a aba **Empresas** é onde o ruído fica mais visível: nomes de empresa que não são nomes de empresa nenhuma — fragmentos de frase, códigos de setor entre crases, e em pelo menos 2 casos, texto que parece ter vazado de um processo automatizado (prompt/resposta de IA) direto pro campo `name`.

Rodei uma checagem objetiva: **empresa sem nenhuma fonte (`sources`) e sem nenhum setor (`company_sectors`) associado.**

- **325 de 733 empresas (44,3%) caem nesse critério.**
- Isso **não** significa que todas as 325 são lixo — várias são entidades normativas/de referência reais (ASME, IEC, NR-13, SENAI, universidades) que só não foram linkadas a uma fonte específica. Mas o critério pega, com 100% de precisão na amostra que inspecionei manualmente, todo o lixo de verdade também.

---

## Categoria 1 — Taxonomia de setor vazada pra dentro de "empresas"

23 linhas na tabela `companies` são, na verdade, a lista de códigos de setor do Guia (a mesma taxonomia usada em `sector_codes`), só que reformatada e reinserida como se fosse empresa:

```
`AMB` — Meio Ambiente e Sustentabilidade
`AUT` — Automação e Controle
`DIG` — Tecnologia Digital / I4.0
`ENE` — Transição Energética
... (+19 outras, todas no formato `CÓDIGO` — Descrição)
```

Nenhuma das 23 tem fonte ou setor associado. E o texto nem bate exatamente com `sector_codes` — é uma segunda versão, com rótulos ligeiramente diferentes (ex: `sector_codes.AUT` = "Automação de Processos, DCS e SCADA", mas aqui aparece "Automação e Controle"). Ou seja, não é uma cópia — é uma **terceira fonte de verdade** pra essa taxonomia, divergente das outras duas.

## Categoria 2 — Fragmentos de frase e rascunho, sem nenhum sentido como nome de empresa

Amostra direta do banco (todas com 0 fontes, 0 setor):

```
"Preciso de QP técnica industrial gratuita de alto volume"
(prioridade
(P-004).
(P-007).
(Simulador Operacional)
(Regulatório (prioridade
+ organização setorial
& Controle Automação
10 Programas de maior impacto — ranking final de acesso
6 encontradas fontes novas SENAI até treinamento (IPIRANGA). empresas
```

Isso lê como anotação de trabalho ou cabeçalho de seção que foi cortado no lugar errado durante alguma extração — não é dado, é rastro de processo.

## Categoria 3 — Achado mais sério: possível vazamento de texto de IA/pipeline automatizado

Três linhas em particular não parecem nem rascunho de humano — parecem fragmento de geração de linguagem natural, com inglês e português misturados de um jeito que não corresponde a nenhuma fonte real do setor industrial:

```
id 10228: "Request: The user in is my response to Cargas Içamento). e (or of rest the the"
id 10230: "MOV. Then for consolidate. me to"
id 10279: "SOL apenas — continue? eu que"
```

O terceiro em especial ("continue? eu que") lê como fronteira de turno de conversa, não como nome de empresa ou fonte. Recomendo forte que a sessão BANCO investigue a origem exata dessas 3 linhas — se veio de um pipeline com LLM no meio (por exemplo, geração automática de trilha ou extração assistida), pode haver mais casos não capturados pelos padrões que testei aqui, e vale revisar o pipeline, não só apagar as linhas.

## Categoria 4 — Corpo normativo/institucional catalogado como "empresa"

Boa parte das ~300 linhas restantes sem fonte/setor não é ruído no sentido de corrupção — é problema de modelagem: `companies` está guardando referências normativas e institucionais que não são empresas:

```
ASME - BPVC Seção V
IEC 61511 - Maintenance Guidelines
NR-13 - Caldeiras e Vasos de Pressão
ISO 19901-3:2024
ABNT NBR 15219/16570
ANP - Legislação
```

Essas fazem sentido existir no banco (são fontes normativas legítimas), mas talvez não devessem estar na tabela `companies` — a tabela parece ter virado um cesto genérico pra "qualquer entidade citada", misturando empresa real, associação de classe, órgão regulador e norma técnica.

## Categoria 5 — Bug confirmado: "SETOR null" visível pro usuário final

Na aba Setores, um card aparece literalmente como **"SETOR null"**, com 29 empresas e 129 programas dentro. Confirmei a causa: **129 de 497 fontes com `layer='sector'` (26%) têm `industry_sector_id` NULL** — não têm setor nenhum atribuído. O código do portal faz `String(sec.id)` sem tratar o caso nulo, e o JavaScript literalmente escreve a palavra "null" na tela.

Isso é dois problemas empilhados: (1) 26% das fontes de setor sem classificação — problema de dado, cabe à sessão BANCO completar; (2) a UI não deveria mostrar "null" pro usuário mesmo que o dado falte — isso eu registro como correção nossa, do lado portal.

## Categoria 6 — Corrupção de texto: espaço inserido no meio de palavra

Achado direto na descrição de uma trilha (`TRL-CNCT-001`), a mesma frase tem 3 palavras quebradas ao meio, de forma inconsistente (a palavra vizinha "instalação" está certa, mas as outras não):

> *"...projetos, instalação, **ope ração** e manutenção de sistemas elétricos industriais, incluindo motores, **transform adores**, painéis de comando, subestações, proteção e controle, com base em normas **N R-10**, NR-12..."*

`operação` → `ope ração`, `transformadores` → `transform adores`, `NR-10` → `N R-10`. Encontrei mais 2 casos isolados do mesmo padrão em outras trilhas (`TRL-IMO-007`, `TRL-PM-013`). Não investiguei a causa raiz (pode ser artefato de quebra de linha de PDF mal removida, ou de outro processo de texto), mas o padrão — quebra no meio da palavra, não no espaço — é consistente o bastante pra não ser digitação manual.

---

## Recomendação prática pra sessão BANCO

1. **Não apagar as 325 linhas às cegas** — o critério "0 fontes + 0 setor" pega o lixo real com precisão alta na amostra que revisei, mas mistura com entidades normativas legítimas (Categoria 4) que só precisam ser recategorizadas, não excluídas.
2. **Investigar a origem das 3 linhas da Categoria 3** antes de qualquer outra coisa — se for vazamento de pipeline, o problema pode estar ativo e gerando mais lixo agora.
3. **Decidir se `companies` deveria ter um `type`/`entity_type`** (empresa / associação / órgão regulador / norma técnica) — resolveria a Categoria 4 sem apagar dado.
4. **Completar os 129 registros sem `industry_sector_id`** (Categoria 5) — ou pelo menos os que tiverem fonte identificável.
5. **Investigar a Categoria 6** — se o mesmo processo que gerou essas trilhas tocou outros campos de texto, vale rodar uma varredura mais ampla do que a que fiz aqui (usei só 2 padrões de regex, propositalmente conservadores pra não gerar falso positivo em massa).

## Nota de método — cuidado com falso positivo

Um filtro ingênuo por "nome começa com dígito" pegaria **"3M Brasil"** e **"4C Offshore"** como suspeitos — são empresas reais, com fontes de verdade associadas. Qualquer limpeza automatizada da Categoria 2 precisa desse tipo de checagem cruzada (fonte/setor associado), não só regex no nome.
