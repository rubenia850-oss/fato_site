---
sistema: FATO
produto: Documento de Gestão
tipo: Backlog Unificado de Gaps
versao: 5.8
data_criacao: 12/06/2026 21h28
ultima_revisao: 21/06/2026 (reconciliação sessão BANCO v61)
origem: "gaps_v4.0 (10 gaps) + Sprints 2–4 (4 resolvidos, 5 novos) + Sprint 7 (1 resolvido) + Sprint 8 (1 resolvido) + Sprint 9 (1 resolvido + 3 novos) + Sprint 11 (1 resolvido + 1 fechamento formal) + Sprint 12 (1 resolvido + EXP-07 parcial) + Sprint 14 (2 resolvidos, mesmos achados de Sprints 9/11/12 reaplicados sobre fato_v55.db + 1 grupo novo de duplicatas em companies) + reconciliação sessão BANCO 21/06 (SP-08 corrigido + 5 itens novos SP-15 a SP-19, renumerados de uma colisão SP-13/14 entre as duas sessões)"
total_gaps_anteriores: 10
gaps_resolvidos_sprints_2_4: 4
gaps_novos_sprints_2_4: 5
gaps_resolvidos_sprint_7: 1
gaps_resolvidos_sprint_8: 1
gaps_resolvidos_sprint_9: 1
gaps_novos_sprint_9: 3
gaps_resolvidos_sprint_11: 1
gaps_fechados_formalmente_sprint_11: 1
gaps_resolvidos_sprint_12: 1
gaps_resolvidos_sprint_14: 2
gaps_novos_sprint_14: 1
gaps_novos_reconciliacao_banco_21_06: 5
gaps_ativos: 14
---

> ## 🧭 Índice de itens genuinamente abertos (adicionado 19/07/2026, sem remover nada abaixo)
> O restante deste arquivo tem 60+ entradas, a maioria já fechada — mantidas por design (Regra 6,
> `_LEIA_PRIMEIRO.md`: backlog é histórico vivo, não lista de tarefas, nunca podado). Este índice
> existe só pra não precisar escanear tudo pra saber o que ainda precisa de ação. Atualizar aqui
> sempre que um item mudar de status — não é um documento separado, é um atalho pra este mesmo.
>
> **Decisão de produto sua, não correção (sem pressa, opcional):** SP-73 — Worker/Cloudflare D1
> completo (Opção C do documento de hospedagem), testado e verificado, pronto pra publicar quando
> (se) você quiser trocar algum endpoint. Não muda nada em produção até você decidir.
>
> **Esperando a sessão BANCO (nada a fazer do lado SITE):**
> SP-05, SP-07 (221 sem UF, piorou proporcionalmente — ver nota na entrada), SP-08, SP-09, SP-15,
> SP-16, SP-17, SP-21, SP-22, SP-24, SP-25, SP-32, SP-33, SP-34, SP-40 (`dm_oportunidade_estrategica`),
> SP-51 (só 5 casos restantes, 108/113 resolvido), SP-68 (confirmar se existe `fato_v194.db`),
> SP-74 (checar dependência de VIEW, não só `.js`, antes de eliminar `dm_importacoes_maquinas`
> numa futura rodada de enxugamento).
>
> **🔴 Alta prioridade, esperando BANCO:** SP-70 (`_LEIA_PRIMEIRO.md` Regras 1/7 referenciam tabelas
> legadas — `db_versions`/`gaps` — em vez das vivas `db_versions_v2`/`gaps_v2`; reconfirmado aberto
> em 23/07, 3ª sincronização seguida sem mudança).
>
> **Oportunidade barata, dado pronto, sem UI ainda (não é pedido, é registro):** SP-39 —
> `vw_industry_sector_codes` já existe, `ViewMercadoTrabalho.jsx` já tem o lugar certo pra usar.
>
> **Esperando decisão do usuário (produto, não dado):** item 11 do `ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md`
> já implementado (SP-63) — nada pendente aqui na verdade, removido de listas antigas.
> Hospedagem/`COMO_FOI_CONSTRUIDO.md` — ver `VIABILIDADE_PUBLICACAO_E_TRANSPARENCIA.md`, fora deste
> backlog.
>
> **Tudo mais abaixo deste ponto:** ✅ fechado, ou 🟢 registro de oportunidade sem urgência (Regra 4).

# Sistema FATO — Backlog Unificado de Gaps
## Versão 5.0 — Atualização pós-Sprints 2, 3 e 4 (13/06/2026)

> **Atualização v5.1 — 16/06/2026 (pós Sprint 6 e 7 do Portal):** SP-02 (busca global) resolvido na Sprint 7 — ver entrada abaixo e tabela-resumo no final do arquivo. Gaps ativos: 11 → 9. As seções abaixo descrevem o contexto original da v5.0 (13/06) e foram mantidas como registro histórico; as entradas SP-02/SP-03/SP-04 têm uma nota de status mais recente embutida.

> **Contexto v5.0 — 13/06/2026 (pós-Sprints 2, 3 e 4):**
> O backlog v4.0 tinha 10 gaps de infraestrutura identificados em auditoria física do ZIP v3.9.
> Esta versão registra o fechamento de 4 desses gaps pelos Sprints 2–4 e adiciona 5 novos gaps
> identificados durante a execução dos sprints.
> **Gaps ativos: 11** (6 herdados do v4.0 + 5 novos).
>
> **Prioridade:**
> - 🔴 Crítico — bloqueia navegação, manutenção ou uso correto do sistema
> - 🟡 Relevante — limita rastreabilidade mas não bloqueia conteúdo
> - 🟢 Melhoria — cosmético, qualidade ou completude histórica

---

## VERIFICAÇÕES CONFIRMADAS (conteúdo técnico íntegro)

Antes dos gaps, registro do que foi auditado e **confirmado correto**:

| Artefato | Claim v3.9 | Verificado |
|----------|-----------|-----------|
| Atlas Automação v1.2 | Série C (C1+C2 Ciberseg OT) adicionada | ✅ Conteúdo e `versao: 1.2` confirmados |
| Atlas Mecatrônica v1.2 | Robótica R1 atualizada; KUKA/Fanuc/ABB/FESTO mapeados | ✅ `versao: 1.2` + trilhas confirmados |
| Atlas Transição Energética v1.2 | Séries S/W/H/G presentes; Blocos 12-B/12-C na tabela | ✅ `versao: 1.2` confirmado |
| Atlas Instrumentação v1.0 | 5 séries (F/P/M/Q/D), âncoras CNCT #2/#7 | ✅ Arquivo presente, conteúdo confirmado |
| Guia v6.3 | Blocos 12-B (Solar/Eólica) e 12-C (Carbono/ESG) | ✅ Ambos os blocos presentes e populados |
| Guia v6.3 | GHG Protocol, Serasa, IFPR/Parquetec, WEG NR-10 | ✅ Todos presentes (6–12 ocorrências cada) |
| GICEA | 1.828 linhas, 12 grupos | ✅ `wc -l` = 1828; 12 grupos `##` confirmados |
| Índice v4.1 | Seção 9 (notas CBOs 311205/316325) | ✅ `## SEÇÃO 9` presente na linha 1388 |
| Setores (12) | Campo `codigos_guia` em todos | ✅ 12/12 arquivos com campo preenchido |
| Análise P6 | 9 seções, 6 eixos I4.0/I5.0, P6-01 a P6-06 | ✅ Arquivo completo e íntegro |

---

## 🔴 CRÍTICO — 3 gaps

---

### IN-03 · README desatualizado — versão 3.3, 6 ciclos defasado
**Origem:** Auditoria ZIP v3.9 — Junho 2026
**Esforço:** Médio | **Arquivo:** `sistema_fato/_README.md`

O README declara `**Versão do sistema:** 3.3` quando o sistema está em v3.9.
Consequências diretas verificadas no arquivo:

- Lista **7 Atlas** na estrutura de pastas — sistema tem **9** (falta Instrumentação v1.0)
- Declara `guia_v6_2_completo.md` como **"← CANÔNICO"** — arquivo não existe no ZIP; canônico real é `guia_v6_3_completo.md`
- Declara `indice_triangular_v4.md` como **"← CANÔNICO"** — canônico real é `indice_triangular_v4_1.md`
- Estado do sistema lista `GICEA v1.0` e `Índice v4.0` como atuais
- Seção "Próximas ações" lista SI-03 e SI-04 como pendentes — ambos fechados em v3.6
- Changelog termina em v3.3

**Ação:** Reescrever README como v4.0: atualizar versão declarada, estrutura de pastas (9 Atlas + guia_v6_3 + indice_v4_1), estado do sistema, seção de próximas ações (P6-01 a P6-06), changelog.

---

### IN-04 · guia_v6_2_completo.md ausente do ZIP
**Origem:** Auditoria ZIP v3.9 — Junho 2026
**Esforço:** Baixo | **Impacto:** Rastreabilidade histórica + README aponta para arquivo inexistente

O ZIP tem `guia_v6_1_completo.md` (REC-01) e `guia_v6_3_completo.md` (Blocos 12-B/12-C),
mas não tem `guia_v6_2_completo.md` (v6.1 + Bloco LOG). O v6.2 foi produzido
(referenciado em múltiplos documentos de gestão como GU-03/AT-04 closure) mas não está fisicamente no repositório.

O próprio guia_v6_3_completo.md referencia o v6.2 em notas internas:
`"fontes ausentes do Guia v6.2"` — o que confirma que v6.2 deveria existir como estado intermediário.

Consequências:
- README aponta para `guia_v6_2_completo.md ← CANÔNICO` → arquivo 404
- Sequência histórica guia/: v6.0 → v6.1 → **[buraco]** → v6.3
- Não é possível reconstruir o estado do sistema entre os fechamentos de GU-03 (v6.2) e AT-09 (v6.3)

**Ação:** Produzir `guia_v6_2_completo.md` aplicando o Bloco LOG ao v6.1 (via `bloco_log_supply_chain_v1_0.md` já presente). Ou documentar a ausência como decisão explícita em _DECISIONS.md (D22).

---

### IN-05 · _DECISIONS.md com 8+ decisões não registradas (D22 em diante)
**Origem:** Auditoria ZIP v3.9 — Junho 2026
**Esforço:** Médio | **Arquivo:** `sistema_fato/_DECISIONS.md`

O _DECISIONS.md documenta decisões até D21 (Guia v6.2, v3.3). As sessões v3.4 a v3.9
geraram pelo menos 8 decisões arquiteturais não registradas:

| Decisão não registrada | Sessão | Impacto |
|-----------------------|--------|---------|
| Auditoria como metodologia contínua | v3.4 | Metodológica |
| Gaps abertos por auditoria interna (não só por artefatos externos) | v3.4 | Processo |
| Índice v4.1 como canônico (supersede v4.0) | v3.6 | Infraestrutura |
| Guia v6.3 como canônico final desta fase (v6.2 não arquivado) | v3.9 | ⚠️ Crítico |
| Atlas v1.2: update in-place sem rename de arquivo | v3.9 | ⚠️ Crítico (ver IN-06) |
| Atlas Instrumentação como 9º Atlas (decisão de escopo) | v3.9 | Escopo |
| Análises P6 como nova camada do sistema | v3.9 | Arquitetural |
| P6-01 a P6-06 como backlog de próxima fase | v3.9 | Roadmap |

**Ação:** Registrar D22 a D29 (estimativa) cobrindo as decisões acima. Prioridade para D22 (v6.2 não arquivado) e D23 (Atlas v1.2 sem rename — ver IN-06).

---

## 🟡 RELEVANTE — 4 gaps

---

### IN-06 · 3 Atlas com nome de arquivo v1_1 mas conteúdo v1.2
**Origem:** Auditoria ZIP v3.9 — Junho 2026
**Esforço:** Baixo | **Impacto:** Referências por nome de arquivo incorretas

Os seguintes arquivos têm divergência entre nome e versão interna:

| Arquivo | Nome (filename) | Versão interna (YAML) |
|---------|-----------------|----------------------|
| `atlas_automacao_industrial_v1_1.md` | v1_1 | `versao: 1.2` |
| `atlas_mecatronica_industrial_v1_1.md` | v1_1 | `versao: 1.2` |
| `atlas_transicao_energetica_v1_1.md` | v1_1 | `versao: 1.2` |

Qualquer script, depende_de ou referência por nome de arquivo aponta para "v1_1"
mas encontra conteúdo v1.2. O README lista esses arquivos como "v1.1" nos seus
metadados da estrutura de pastas.

**Ação:** Opção A — Renomear arquivos para `_v1_2.md` e atualizar todas as referências (README, `depende_de` dos Atlas, Índice). Opção B — Registrar como D23 em _DECISIONS.md: "Atlas v1.2 são atualizações in-place dos arquivos v1.1 — o nome de arquivo não reflete a versão interna".

---

### IN-07 · gaps_v3_9.md fora da pasta gestao/
**Origem:** Auditoria ZIP v3.9 — Junho 2026
**Esforço:** Muito baixo

O arquivo `gaps_sistema_fato_v3_9.md` está na raiz `sistema_fato/` enquanto todos os
versões anteriores (v3_5, v3_7, v3_8) estão em `sistema_fato/gestao/`. Além disso,
`gaps_v3_6.md` não existe no ZIP (a versão foi produzida mas não arquivada).

Estado da série histórica em `gestao/`:
```
gestao/gaps_sistema_fato_v3_5.md  ✅
gestao/gaps_sistema_fato_v3_6.md  ❌ ausente
gestao/gaps_sistema_fato_v3_7.md  ✅
gestao/gaps_sistema_fato_v3_8.md  ✅
sistema_fato/gaps_sistema_fato_v3_9.md  ← fora do lugar
```

**Ação:** Mover `gaps_v3_9.md` para `gestao/`. Verificar se `gaps_v3_6.md` foi produzido e adicionar ao repositório, ou documentar ausência.

---

### IN-08 · NOTAS_DE_VERSAO declara GICEA com "10 grupos" — real é 12
**Origem:** Auditoria ZIP v3.9 — Junho 2026
**Esforço:** Muito baixo | **Arquivo:** `sistema_fato/_CHANGELOG.md`

A entrada v3.9 nas NOTAS_DE_VERSAO declara:
`"GICEA: v3.9 (10 grupos, 30+ perfis extraídos)"`

A auditoria do arquivo `iedu_cnct_fundamentos_v1.0.md` conta **12 grupos** `##`:
PETROQUÍMICA E QUÍMICA · AUTOMAÇÃO E CONTROLE · ELETROTÉCNICA INDUSTRIAL ·
MECÂNICA E FABRICAÇÃO · METALURGIA E SOLDAGEM · MANUTENÇÃO INDUSTRIAL ·
ENERGIA E SUSTENTABILIDADE · SEGURANÇA INDUSTRIAL · GESTÃO E LOGÍSTICA ·
TI E TELECOMUNICAÇÕES · QUALIDADE INDUSTRIAL · BIOTECNOLOGIA E BIOECONOMIA

**Ação:** Corrigir NOTAS_DE_VERSAO: `(10 grupos)` → `(12 grupos)`.

---

### IN-09 · SUMARIO_EXECUTIVO desatualizado — reflete estado v2.0
**Origem:** Auditoria ZIP v3.9 — Junho 2026
**Esforço:** Alto | **Arquivo:** `sistema_fato/iedu_sumario_v2.0.md`

O SUMARIO_EXECUTIVO menciona:
- "dois Atlases completos" — sistema tem **9**
- "Guia em v6.0" — sistema está em **v6.3**
- "Índice em v4.0 e 4 setores industriais mapeados" — sistema tem **v4.1 e 12 setores**
- "próximos 9 Atlas a produzir" — **todos produzidos**

Este documento é o principal artefato de apresentação externa do sistema. Está
5 versões defasado e apresenta métricas que subestimam o sistema por um fator de ~4x.

**Ação:** Reescrever SUMARIO_EXECUTIVO como v2.0: atualizar todos os números, mencionar os 9 Atlas, Guia v6.3 com 33 blocos, 12 setores, Índice v4.1, GICEA 12 grupos, Análise P6. Destacar o backlog zerado como marco de maturidade do sistema.

---

## 🟢 MELHORIA — 3 gaps

---

### IN-10 · integracao/iedu_complementaridade_v1.0.md desatualizada
**Origem:** Auditoria ZIP v3.9 — Junho 2026
**Esforço:** Médio | **Arquivo:** `sistema_fato/integracao/iedu_complementaridade_v1.0.md`

Arquivo não faz referência a: Atlas Instrumentação v1.0, versões v1.2 dos Atlas atualizados,
Guia v6.3, Blocos 12-B/12-C, Série C de Cibersegurança OT. A tabela foi produzida no
contexto do Guia v4.0/v5.0 e não foi atualizada durante o ciclo v3.x.

**Ação:** Atualizar tabela com os 9 Atlas e respectivos blocos do Guia v6.3.

---

### GU-14 · Revisão de URLs do Guia — sem rotina formalizada
**Origem:** `relatorio_pendencias_v5_0.md` (Alta prioridade) · não presente no backlog anterior
**Esforço:** Médio (processo) | **Impacto:** Fichas com URLs mortas não detectadas

O relatorio_pendencias_v5_0 lista "Revisar URLs de todas as fichas (validade)" como
tarefa de Alta prioridade. Este item nunca foi rastreado como gap nem como processo formal.
O Guia v6.3 tem ~200 fichas com URLs externas — drift de links é esperado em 12–18 meses.

**Ação:** Formalizar rotina trimestral de verificação de URLs. Script simples com
`curl -I --max-time 5` para cada URL do Guia e relatório de 404/redirect.

---

### IN-11 · gestao/ faltando gaps_v3_6
**Origem:** Auditoria ZIP v3.9 — Junho 2026
**Esforço:** Muito baixo

O arquivo `gaps_sistema_fato_v3_6.md` nunca foi arquivado no repositório.
A versão v3.6 fechou SI-03 e SI-04 e produziu `indice_triangular_v4_1.md` —
foi uma sessão relevante sem registro canônico do estado do backlog naquele ponto.

**Ação:** Verificar se o arquivo foi produzido em sessão paralela e adicionar ao repositório,
ou documentar a ausência no _DECISIONS.md.

---

## RESUMO EXECUTIVO — BACKLOG v4.0

| ID | Gap | Camada | Prioridade | Esforço | Status |
|----|-----|--------|-----------|---------|--------|
| IN-03 ✅ | README v3.3 — 6 versões defasado | Infra | 🔴 | Médio | ⏳ Pendente |
| IN-04 | guia_v6_2_completo.md ausente do ZIP | Infra | 🔴 | Baixo | ⏳ Pendente |
| IN-05 ✅ | _DECISIONS.md — D22+ não registradas | Infra | 🔴 | Médio | ⏳ Pendente |
| IN-06 | 3 Atlas: filename v1_1 ≠ versão interna v1.2 | Infra | 🟡 | Baixo | ⏳ Pendente |
| IN-07 | gaps_v3_9.md fora de gestao/ + v3_6 ausente | Infra | 🟡 | Muito baixo | ⏳ Pendente |
| IN-08 | NOTAS_DE_VERSAO: GICEA "10 grupos" → real 12 | Infra | 🟡 | Muito baixo | ⏳ Pendente |
| IN-09 ✅ | SUMARIO_EXECUTIVO reflete estado v2.0 | Infra | 🟡 | Alto | ⏳ Pendente |
| IN-10 ✅ | tabela_complementaridade desatualizada | Integração | 🟢 | Médio | ⏳ Pendente |
| GU-14 | Revisão de URLs — rotina não formalizada | Guia | 🟢 | Médio | ⏳ Pendente |
| IN-11 | gaps_v3_6.md ausente do histórico | Infra | 🟢 | Muito baixo | ⏳ Pendente |

---

## ORDEM DE EXECUÇÃO RECOMENDADA

**Imediato — corrigir dados incorretos (erros, não omissões):**
1. **IN-08** — NOTAS_DE_VERSAO: "10 grupos" → "12 grupos" (1 linha, 5 min)
2. **IN-07** — Mover gaps_v3_9.md para gestao/ (mv, 2 min)
3. **IN-06** — Decisão: renomear arquivos v1_1→v1_2 OU registrar D23 no _DECISIONS.md

**Curto prazo — atualizar documentação de navegação:**
4. **IN-05** — Registrar decisões D22–D29 no _DECISIONS.md (inclui D22: v6.2 ausente; D23: Atlas in-place)
5. **IN-04** — Produzir guia_v6_2_completo.md OU formalizar ausência como D22
6. **IN-03** — Reescrever README como v4.0

**Médio prazo — atualizar artefatos de apresentação:**
7. **IN-09** — Reescrever SUMARIO_EXECUTIVO como v2.0
8. **IN-10** — Atualizar tabela_complementaridade com 9 Atlas e Guia v6.3

**Processo contínuo:**
9. **GU-14** — Implementar script de verificação de URLs (rotina trimestral)
10. **IN-11** — Recuperar ou documentar gaps_v3_6.md

---

## ESTADO DO SISTEMA — v4.0 (canônico pós-auditoria)

```
Sistema FATO — Junho 2026 — pós-auditoria física ZIP v3.9

CAMADA 0 — CNCT (Fundamento)
  ✓ iedu_cnct_fundamentos_v1.0.md — 32 perfis, 12 grupos, 1.828 linhas
  ✓ Análise P6 — Gap CNCT × I4.0/I5.0 — 6 eixos mapeados, P6-01 a P6-06
  ✓ indice_triangular_v4_1.md — Seção 9 (disambiguação CBOs)

CAMADA 1 — Atlas (9 publicados)
  ✓ Atlas Petroquímica v1.1         — CNCT #31/#32 · 33 trilhas · 18 perfis
  ✓ Atlas Soldagem e Metalurgia v1.0 — CNCT #13/#22 · 8 trilhas · 1 PE
  ✓ Atlas Segurança Industrial v1.1  — CNCT #25 · 11 trilhas · 1 PE
  ✓ Atlas Eletrotécnica Industrial v1.1 — CNCT #7 · 10 trilhas · 1 PE
  ✓ Atlas Mecatrônica Industrial v1.2   — CNCT #1 · 10 trilhas · 1 PE (file: _v1_1)
  ✓ Atlas Transição Energética v1.2     — CNCT #17 · 9 trilhas + Série G/H · 1 PE (file: _v1_1)
  ✓ Atlas Automação Industrial v1.2     — CNCT #2 · 9 trilhas + Série C · 1 PE (file: _v1_1)
  ✓ Atlas Supply Chain v1.0             — CNCT #23 · 8 trilhas · 2 PE
  ✓ Atlas Instrumentação Industrial v1.0 — CNCT #2/#7 · 5 séries · 7 trilhas · 1 PE

CAMADA 2 — Guia v6.3 (33 blocos)
  ✓ Blocos 1–21 + sub-blocos + BLOCO EDU + BLOCO LOG
  ✓ Bloco 12-B (Solar FV / Eólica Onshore)
  ✓ Bloco 12-C (Carbono / ESG / Armazenamento)
  ⚠ guia_v6_2_completo.md ausente (IN-04)

CAMADA 3 — Setores (12 arquivos)
  ✓ codigos_guia alinhado com 29 códigos Guia v6.3 em todos os 12 setores

INFRAESTRUTURA
  ✓ indice_triangular_v4_1.md — canônico físico no ZIP
  ✓ GICEA v3.9 — 12 grupos, 1.828 linhas
  ✓ _README.md — ⚠ DESATUALIZADO (v3.3) — IN-03
  ✓ _DECISIONS.md — ⚠ INCOMPLETO (até D21) — IN-05
  ✓ _CHANGELOG.md — ⚠ erro contagem GICEA (10→12 grupos) — IN-08
  ✓ iedu_sumario_v2.0.md — ⚠ DESATUALIZADO (v2.0) — IN-09
  ✓ gaps_sistema_fato_v3_9.md — ⚠ fora de gestao/ — IN-07

BACKLOG
  Resolvidos acumulados: 51 (v3.9) + 0 (v4.0)
  Ativos: 10 (todos de infraestrutura/documentação — nenhum de conteúdo técnico)
  Oportunidades estratégicas: P6-01 a P6-06
```

---

*Sistema FATO — Documento de Gestão Interna*
*Versão 4.0 — Junho 2026*
*Origem: auditoria física ZIP sistema_fato_v3_9.zip (65 arquivos) + análise cruzada v2.0 (13 documentos)*
*Método: verificação conteúdo × claim × localização × referências cruzadas*
*Total acumulado: 51 resolvidos (v3.9) · 10 novos ativos (v4.0) · 0 gaps de conteúdo técnico*


---

## Gaps Identificados durante Sprints 2–4 (v5.0)

### SP-01 · portal_industria_edu.html desatualizado (standalone)
- **Prioridade:** 🟡 Relevante
- **Identificado em:** Sprint 3
- **Descrição:** O arquivo `portal_industria_edu.html` (versão standalone com dados embutidos) ainda reflete v3.0. Não inclui as 8 abas, os novos JSONs de conhecimento (perfis, guia, atlas) nem as views ViewProfiles/ViewGuideBlocks/ViewGaps/ViewSectors.
- **Ação:** Regenerar a versão standalone a partir do App.jsx v3.2 ou descontinuar e manter apenas a versão com JSONs externos.
- **Dependência:** Decisão entre manter ou descontinuar o standalone.

### ~~SP-02~~ · Busca global (globalQ) declarada mas não implementada na UI
- **Prioridade:** 🟡 Relevante
- **Identificado em:** Sprint 4 (D43)
- **Status:** ✅ **Resolvido na Sprint 7** (16/06/2026) — índice FTS5 (`search_idx`) sobre fontes (todas as camadas) + perfis CNCT + trilhas Atlas, com painel de resultados unificado por categoria no header (`Nav`). Ver `_DECISIONS.md` § "Sprint 7 — Execução" e `portal/db.js`.
- **Descrição original:** O estado `globalQ` foi declarado no `App` e previsto para Sprint 5. Não há campo de busca no header nem painel de resultados unificado. Os usuários precisam navegar aba a aba sem busca cruzada.

### SP-03 · cnct_hint no SourceCard não implementado
- **Prioridade:** 🟢 Melhoria
- **Identificado em:** Sprint 4 (C4 adiado)
- **Status:** ✅ **Resolvido na Sprint 8** (19/06/2026) — badge `cnct_hint` no `SourceCard` agora é clicável; usa `navigateTo("profiles",{profileId})` (novo helper em `DataContext`) para abrir o perfil CNCT correspondente direto na aba Perfis. Não confundir com o item de mesmo nome no `PLANO_MIGRACAO_v4.md` (migração da *fonte de dados* do `cnct_hint`, do JSON para JOIN no banco — resolvido na Sprint 6/M-03).
- **Descrição original:** O campo `cnct_hint` (badges de perfis CNCT clicáveis no card expandido do Explore) foi planejado como Sprint 4 C4 mas não implementado. A navegação cruzada Explore→Perfil ainda não existia.

### SP-04 · atlas_trails em iedu_sectors.json sempre vazio
- **Prioridade:** 🟢 Melhoria
- **Identificado em:** Sprint 4
- **Status:** 🔒 **Fechado na Sprint 11 (19/06/2026) como "sem solução viável com os dados atuais"** — investigado 3 vezes (Sprint 7 como "SP-05A", confirmado de novo na Sprint 9, e revisitado na Sprint 11): `source_atlas_trails` tem **0 linhas** para a camada `sector` em todas as verificações. Não é problema de query/join — o vínculo de origem nunca foi gerado para essa camada. Continuar reabrindo este item em toda sprint sem novo dado de entrada não é produtivo; fechado para não repetir a mesma investigação indefinidamente. **Reabrir apenas se `source_atlas_trails` for populado para `layer='sector'` por outro processo** (fora do escopo deste backlog).
- **Descrição:** Todas as 634 entradas de `iedu_sectors.json` têm `atlas_trails: []`. O mapeamento empresa→trilha da tabela de complementaridade foi aplicado apenas em `technical.json`, não em `sectors`.

### SP-10 · ~~Perfis CNCT duplicados~~ ("Técnico em Plásticos", ids 31/73)
- **Prioridade:** 🔴 Crítico (qualidade de dados)
- **Identificado em:** Sprint 11, durante investigação de DB-L06
- **Status:** ✅ **Resolvido na Sprint 11** (19/06/2026) — mesmo padrão de duplicata da Sprint 9 (DB-DUP-01), agora em `cnct_profiles` em vez de `companies`. Decisão (do usuário, com pesquisa de CBO feita antes de executar): manter o perfil com CBO mais específico/verificado (id=73, CBO 3114-10, confirmado oficial) e eliminar o outro (id=31, CBO 8153-10, não confirmado como código brasileiro válido). FK reatribuída em `atlas_trail_profiles` (1 vínculo, sem conflito); `cnct_cbos` do perfil eliminado descartado sem migrar (continha o código não confiável e uma duplicata do que o sobrevivente já tinha). `cnct_profiles`: 88 → 87. Ver `db_versions` v43 e `portal/SPRINT11_EXECUCAO.md`.
- **Nota para o futuro:** este caso foi achado por acaso ao investigar outro item, não por busca sistemática como a que identificou as 102 empresas duplicadas. Não foi feita uma varredura completa de `cnct_profiles` por nomes similares — pode haver outros pares não descobertos ainda.

### SP-11 · ~~Perfis CNCT duplicados (2º e 3º casos)~~ ("Mecânica de Precisão", "Informática")
- **Prioridade:** 🔴 Crítico (qualidade de dados)
- **Identificado em:** Sprint 12, casando os PDFs do EXP-07 por nome de curso contra `cnct_profiles`
- **Status:** ✅ **Resolvido na Sprint 12** (19/06/2026) — varredura sistemática completa (nome exato + normalização agressiva) encontrou 2 pares adicionais: "Técnico em Mecânica de Precisão" (ids 6/32) e "Técnico em Informática" (ids 16/33). Diferente do par Plásticos (SP-10), aqui o CBO é **idêntico** dentro de cada par — critério de decisão foi completude de dado (versão "fina" com zero vínculos em `guia_source_profiles` contra 54 e 42 da versão rica). 4 itens de conteúdo real, presentes só na versão fina, migrados antes do `DELETE`. `cnct_profiles`: 87 → 85. Ver `db_versions` v46 e `portal/SPRINT12_EXECUCAO.md`.
- **Nota:** após esta varredura sistemática (exata + normalizada), não restam mais pares óbvios por esse critério em `cnct_profiles`. Não foi feita varredura equivalente em outras tabelas (`atlas_trails`, `sources`).

### SP-05 · GU-14 · Revisão de URLs sem rotina formalizada (herdado v4.0)
- **Prioridade:** 🟢 Melhoria
- **Identificado em:** Backlog v4.0
- **Descrição:** Não existe rotina de verificação de URLs das 90 fontes núcleo. Entradas com `verified: false` nunca foram acessadas desde a criação (t29–t56 e s21–s35).
- **Ação:** Criar sessão dedicada de verificação de URLs e atualizar campo `verified`. Meta: todas as entradas com `batch: "fato_002"` verificadas.

### SP-06 · ~~Empresas duplicadas em `companies`~~ (Sprint 9)
- **Prioridade:** 🔴 Crítico (qualidade de dados)
- **Identificado em:** Sprint 9, durante investigação de SP-08 (URLs faltantes em sector)
- **Status:** ✅ **Resolvido na Sprint 9** (19/06/2026) — 102 de 615 empresas eram cadastros duplicados (mesma empresa com nome curto e nome longo, ex: `WEG`/`WEG S.A.`, incluindo um lote pré-marcado com prefixo 🔴 que parecia já identificado em sessão anterior não documentada). Fundidas com segurança: FKs reatribuídas em `sources`, `gaps`, `company_sectors`, `sector_programs` e `company_url_suggestions` antes de qualquer remoção, plano de fusão auditável, 1 falso-positivo (`BRF S.A.` ≠ `BRF/M. Dias Branco`) identificado e excluído manualmente do lote. `companies`: 615 → 513. Ver `db_versions` v39 e `portal/SPRINT9_EXECUCAO.md`.
- **Efeito colateral positivo:** resolveu parcialmente SP-07 (empresas sem UF caiu de 529 para 433) sem nenhuma pesquisa externa — só eliminação de redundância.

### SP-07 · Empresas sem UF preenchida
- **Prioridade:** 🟢 Melhoria
- **Identificado em:** Sprint 9
- **Status:** ⏳ Parcialmente melhorado como efeito colateral de SP-06 (529→433), mas **não resolvido** — não há sinal disponível no banco para inferir a UF restante. Heurística de cruzamento com `sources.uf` testada e descartada (zero casos com dado disponível). Resolver os 433 restantes exige pesquisa externa empresa por empresa.
- **Descrição:** 433 de 513 empresas têm `uf` nulo ou vazio.
- **Ação:** Pesquisa manual/externa de sede ou UF de atuação principal — não automatizável com os dados atuais do banco.

### SP-08 · Fontes `sector` sem URL (atualizado: 23 casos, era 27)
- **Prioridade:** 🟢 Melhoria
- **Identificado em:** Sprint 9
- **Status:** ⏳ Pendente — número corrigido na auditoria cruzada de 20-21/06 (sessão BANCO): eram 27, hoje são **23** depois do trabalho de validação de URL (lote 6) e da sanitização de duplicatas (sessão BANCO, v34-v55). Composição atual: 22 já testados via HTTP e confirmados mortos (403/404/500/erro de conexão — não revalidar a mesma URL, buscar substituta) + 1 nunca testado (Milplan, `secA-0262`). Empresas: Anglo American (5), Milplan (5), Nexa Resources (4), Quartzolit (3, bloqueio SSL confirmado 2x — provável descontinuado), Paquetá Calçados (2), Dexco (2), Stellantis (2).
- **Descrição:** 23 entradas de `sources` com `layer='sector'` têm `url` nulo ou vazio.
- **Ação:** Pesquisa manual/externa por programa — não automatizável. Para os 22 já testados, buscar URL **substituta** (domínio novo/programa renomeado), não revalidar a mesma.

### SP-15 · Empresas no Guia sem trilha Atlas correspondente (3 casos de severidade alta)
- **Prioridade:** 🟡 Relevante
- **Identificado em:** Sessão BANCO, 20/06/2026 — auditoria cruzada `gaps` × documentação externa
- **Status:** ⏳ Pendente — confirmado 0 vínculo em `source_atlas_trails` para as 3.
- **Descrição:** Spirax Sarco e Aspen Technology (severidade "Muito alto" em `gaps`), AVEVA ex-Wonderware — id=489, distinta de AVEVA Learning id=442 que já está resolvida (severidade "Alto") aparecem no Guia mas não têm nenhuma trilha do Atlas vinculada.
- **Ação:** Mapear trilha Atlas correspondente (provável candidata: Automação/Instrumentação) e criar vínculo em `source_atlas_trails`.

### SP-16 · Recursos do Atlas sem cobertura no Guia (11 casos)
- **Prioridade:** 🟢 Melhoria
- **Identificado em:** Sessão BANCO, 20/06/2026 — mesma auditoria cruzada. Nomes aparecem em `_CHANGELOG.md` só por um evento histórico não relacionado (criação de fichas em sprint antiga), não pelo gap atual.
- **Status:** ⏳ Pendente — 7 sem nenhuma source no banco (Plataformas públicas de ensino, IBP, MIT OpenCourseWare, Serasa/Transforme-se, Escola do Trabalhador 4.0/Microsoft, Parker Academy, Khan Academy PT) + 4 com source em outra camada mas não em `layer='guia'` (DWSIM — hoje "DWSIM / CAPES" id=48 pós-dedup, CRQ-SP Qualifica, Fundacentro, FIAP Nano Courses).
- **Descrição:** Recursos citados no Atlas sem ficha correspondente na estrutura de Bloco do Guia.
- **Ação:** Para os 7 sem nenhuma source: pesquisa e cadastro completo. Para os 4 com source em outra camada: decisão editorial — duplicar como ficha de Guia, ou aceitar a cobertura cruzada como suficiente.

### SP-17 · Setor 11 — 5 empresas sem programa público identificado
- **Prioridade:** 🟢 Melhoria
- **Identificado em:** Sprint anterior (D09-B/S5), nunca tinha entrada própria no `_BACKLOG.md` — só em `gaps` (ids 172, 182)
- **Status:** ⏳ Pendente — pesquisa já tentada e sem programa encontrado: TSE (só vagas via Gupy), MIP Engenharia (site institucional apenas), Telemont, Enesa, MPE Montagens (nenhum programa localizado).
- **Descrição:** 5 das 8 empresas catalogadas no Setor 11 (Montagem Industrial e Engenharia) não têm programa de qualificação público identificado.
- **Ação:** Re-tentar pesquisa periodicamente (empresas podem lançar programas novos) ou aceitar como limite real do setor.

### ~~SP-18~~ · `cnct_profiles.nivel_cnct` vazio (88/88 linhas)
- **Prioridade:** 🟢 Melhoria
- **Identificado em:** Sessão BANCO, auditoria do documento `FATO_DOCUMENTO_UNICO_AUDITADO.md` (19/06)
- **Status:** ✅ **Resolvido (27/06)** — patch externo populou `nivel_cnct` para 98/98 perfis (incluindo os 13 adicionados em v66), com mapeamento determinístico 1:1 a partir de `tier` (T1=Formação Inicial e Continuada/FIC, T2=Técnico, T3=Técnico Integrado, T4=Tecnólogo, T5=Pós-Técnico, T6=Especialização Técnica). Verificado por query antes de aplicar: correlação 100% consistente, sem exceção, com nomenclatura real da educação técnica brasileira — não é mais coluna vazia, nem inferência arbitrária.
- **Descrição:** Coluna existia no schema mas estava 100% vazia.
- **Ação:** Concluída.

### SP-19 · Rede de empresas sem ponte com instituições de ensino
- **Prioridade:** 🟢 Melhoria (capacidade nova, não bug)
- **Identificado em:** Sessão BANCO (script 16, `dm_rede_empresas_centralidade`/`comunidades`)
- **Status:** ⏳ **Parcial (27/06)** — tabela `company_institution_links` criada e populada com 100 candidatos, mas **todos** apontam para uma única instituição (ENAP), via heurística fraca (mesmo `sector_code` em sources distintos) — honestamente marcada `confianca='heuristica_ou_fallback'` e nota "confirmar curadoria". Aplicado como candidato de baixa confiança, não como vínculo confirmado. Continua precisando de curadoria manual e expansão para outras instituições (SENAI, IFs).
- **Descrição:** `dm_rede_empresas_*` conecta empregadores entre si, mas o vínculo com instituições de ensino agora existe estruturalmente, só precisa de validação de conteúdo.
- **Ação:** Revisar os 100 vínculos manualmente; expandir heurística ou curadoria para SENAI/IFs além de ENAP.

### ~~SP-20~~ · ANP duplicada (`id=944`, 0 sources) — mesmo padrão de lixo residual
- **Prioridade:** 🟢 Melhoria
- **Identificado em:** Sessão BANCO, 21/06/2026
- **Status:** ✅ **Resolvido (27/06)** — `id=944` removido. Verificado antes de aplicar: 0 linhas em todas as 5 tabelas com FK para `companies` (`sources`, `gaps`, `sector_programs`, `company_sectors`, `company_url_suggestions`), não só as 2 que o patch limpava explicitamente.
- **Descrição:** ANP real é `id=486` (3 sources reais).
- **Ação:** Concluída.

### SP-21 · 11 vínculos `trail_step_sources` descartados por ambiguidade (P5)
- **Prioridade:** 🟢 Melhoria
- **Identificado em:** Sessão BANCO, 21/06/2026 — `p5_step_sources_normas_corrigido.sql` usava `LIKE '%padrão%' LIMIT 1` sem `ORDER BY` para resolver `source_id`; padrões amplos (`com.br`, `org.br`, `gov.br`) produziam vínculo arbitrário/errado, confirmado por execução (1 caso real: "Eu Capacito - UX" resolvia para Anglo American).
- **Status:** ⏳ Pendente — os 11 vínculos de alto risco foram descartados (não aplicados), não corrigidos. As trilhas/steps afetadas ficam sem fonte vinculada por enquanto.
- **Descrição:** Refazer esses 11 vínculos com `source_id` exato (não `LIKE` ambíguo) — provavelmente exige revisão manual de qual source específica cada step deveria referenciar.
- **Ação:** Pedir versão corrigida do patch com IDs exatos, ou mapear manualmente os 11 casos.

### SP-22 · CBO `8153-10` sem nome em `cbo_canonical`
- **Prioridade:** 🟢 Melhoria
- **Identificado em:** Sprint 15 (sessão SITE, 21/06/2026) — aparece em `dm_mercado_trabalho` com dado real (9.320 vínculos RAIS, todas as UFs), mas sem entrada em `cbo_canonical`. Mesmo código que a Sprint 11 já tinha notado como "não confirmado como CBO brasileiro válido" ao decidir a fusão do par "Técnico em Plásticos".
- **Status:** ⏳ Pendente — pesquisa parcial feita pela sessão BANCO (21/06): família `8153` confirmada como "Operadores de equipamentos de filtração e separação de substâncias químicas" (códigos vizinhos confirmados: 811305 Operador de centrifugadora, 811320 Operador de filtro de tambor rotativo, 811330 Operador de filtro-prensa — todos da mesma família). **Título oficial exato do código `8153-10` especificamente não confirmado com certeza suficiente** para inserir em `cbo_canonical` sem risco de erro.
- **Descrição:** Gap de nomenclatura — o dado de mercado de trabalho é real, só falta o nome amigável/padronizado.
- **Ação:** Consultar diretamente `https://www.mtecbo.gov.br/cbosite/pages/pesquisas/BuscaPorCodigo.jsf` ou a tábua de conversão oficial (RAIS usa `8153-10` com hífen, formato que pode diferir levemente da tabela CBO 2002 de 6 dígitos sem hífen) para confirmar o título exato antes de popular `cbo_canonical`.

### SP-23 · 194 sources `p7-*` aplicadas com ~58% de conteúdo fragmentado (risco aceito)
- **Prioridade:** 🟢 Melhoria
- **Identificado em:** Sessão BANCO, 21-22/06/2026 — patch consolidado de 10 blocos, Bloco 9 (origem D88). Mesma classe de problema do Bloco 7 do mesmo patch (extração de PDF quebrada), mas aqui a decisão do responsável foi **aplicar do jeito que está, aceitando o risco** — ao contrário do Bloco 7, onde se decidiu filtrar.
- **Status:** ⏳ Pendente — ~112 das 194 sources têm `program` com texto fragmentado/sem sentido (ex.: `"Completação"`, `"dano. de"`, `"Abrange duração."`). Nenhuma quebra técnica (sem violação de FK), só qualidade de conteúdo baixa.
- **Descrição:** Limpeza futura precisa revisar e corrigir ou remover manualmente os `program` ilegíveis dentro do range `p7-0001` a `p7-0194`.
- **Ação:** Revisão manual ou nova tentativa de extração mais cuidadosa do PDF original, se localizável.

### SP-24 · Perfil CNCT #6 (Técnico em Mecânica de Precisão) sem source `layer=technical`
- **Prioridade:** 🟡 Relevante
- **Identificado em:** Sprint anterior (gap interno `technical_sem_perfil`, id 165) — nunca tinha entrada própria no `_BACKLOG.md`, só em `gaps`. Achado durante auditoria de 26/06 (checagem cruzada Regra 7).
- **Status:** ⏳ Parcialmente coberto — Guia cobre via 32 vínculos indiretos (bombas/válvulas), Atlas cobre via trilha relacionada, mas não há nenhuma source cadastrada diretamente com `layer='technical'` para o tema usinagem/CNC/ferramentaria/metrologia dimensional, que é o núcleo do perfil.
- **Descrição:** Gap de cobertura direta de conteúdo técnico para um perfil CNCT específico.
- **Ação:** Pesquisar e cadastrar 2-3 fontes técnicas diretas (cursos/normas de usinagem CNC, metrologia dimensional) com `layer='technical'` vinculadas a este perfil.

### SP-25 · 40 `companies` fragmentadas descartadas de um patch externo (v68) + achado de eixo possivelmente trocado em 11 trilhas
- **Prioridade:** 🟢 Melhoria
- **Identificado em:** Sessão BANCO, 27/06/2026 — patch externo "v67→v76", mesma classe de problema de extração de PDF já vista antes (SP-23, D74-DB), proporção menor (~14%, era 39%/58% antes).
- **Status:** ⏳ Pendente — as 40 linhas foram descartadas (não aplicadas), conteúdo perdido se não houver outra fonte. Achado relacionado, não corrigido (fora do escopo pedido): 11 das 15 trilhas novas `TRL-GES-PDF-*` (Design de Calçados, Design de Móveis, Modelagem do Vestuário, Produção e Gestão de Moda, Design de Joias e Ourivesaria) têm `eixo='Gestão e Negócios'`, mas tematicamente parecem pertencer a um eixo de Design/Produção Cultural ou Manufatura — não confirmado, só apontado.
- **Descrição:** Mesma lição de sempre — qualidade de extração de PDF é inconsistente entre lotes, requer checagem manual amostral antes de aplicar.
- **Ação:** Se o PDF original for localizável, re-extrair as 40 linhas. Confirmar (ou não) se o eixo das 11 trilhas de design/moda está realmente errado.

### SP-09 · Fichas do Guia sem perfil CNCT vinculado (155 casos)
- **Prioridade:** 🟡 Relevante
- **Identificado em:** Sprint 9 (já existia, mas não tinha entrada própria no backlog até agora — estava só em `_DECISIONS.md`/`PLANO_MIGRACAO_v4.md` como DB-L03)
- **Status:** ⏳ Pendente — heurística de match textual avaliada e descartada (`sources.program` é nome de empresa, `cnct_profiles.name` é título de qualificação técnica; não há string em comum entre os dois que permita vínculo confiável sem inferir área de atuação por conhecimento de mercado, o que seria classificação editorial, não inferência de dado).
- **Descrição:** 155 fichas do Guia (`layer='guia'`) não têm vínculo em `guia_source_profiles`.
- **Ação:** Curadoria manual — ler cada ficha e decidir o perfil CNCT correspondente. Não automatizável com os dados de texto atuais.

### EXP-07 · Atualização (Sprint 13, 20/06/2026) — regressão detectada e corrigida
- **O que aconteceu:** a coluna `micro_atlas_pdf` (entregue nesta mesma feature, Sprint 12) tinha sido perdida na geração do `fato_v55.db` por uma sessão paralela que trabalhou sobre um snapshot anterior à v47 sem saber da existência da coluna — ver D62-DB em `_DECISIONS.md`.
- **Correção aplicada:** coluna recriada em `cnct_courses` no v55 e repopulada (78/99 cursos), casamento por `id` validado 1:1 contra o `fato_v33.db` original. Estado atual idêntico ao fechamento da Sprint 12.
- **Pendência original inalterada:** os 13 cursos com PDF mas sem `profile_id` continuam sem superfície de UI (mesma observação da Sprint 12 — não automatizável sem decidir se vale criar perfis CNCT para cursos administrativos/comerciais que nunca tiveram um).

### SP-12 · 35 tabelas novas (`dm_*` e outras) sem nenhuma UI no portal
- **Prioridade:** 🟢 Melhoria (não é bug — é capacidade nova ainda não exposta)
- **Identificado em:** Sprint 13 (20/06/2026), durante a reconciliação `fato_v33.db`→`fato_v55.db`
- **Status:** ⏳ Pendente, **parcial desde Sprint 15 (21/06)** — `dm_mercado_trabalho` ganhou UI dedicada (aba "Mercado de Trabalho" + painel no Perfil CNCT). Restam ~34 tabelas sem UI.
- **Descrição:** `fato_v55.db` traz 35 tabelas novas geradas por uma sessão paralela de auditoria/enriquecimento de dados (ex.: `dm_concursos_tecnicos`, `dm_compras_governo`, `dm_rede_centralidade`/`dm_rede_comunidades`, `cbo_canonical`, `normas_fato`, `sector_mapping`). Nenhuma delas (exceto `dm_mercado_trabalho` agora) é lida pelo `App.jsx`.
- **Ação:** Priorizar próxima tabela candidata (rede de empresas? concursos técnicos?) em sprint dedicada. Ver `dm_proveniencia_dados` e `meta_protocolo` no próprio banco para entender a proveniência e regras de uso de cada tabela antes de desenhar a UI.

### SP-13 · ~~Os mesmos 3 pares de perfis CNCT duplicados (SP-10/SP-11) reapareceram em fato_v55.db~~
- **Prioridade:** 🔴 Crítico (qualidade de dados / sincronização entre sessões)
- **Identificado em:** Sprint 14 (20/06/2026), ao verificar se as correções das Sprints 11/12 sobreviveram à reconciliação da Sprint 13
- **Status:** ✅ **Resolvido na Sprint 14** (20/06/2026) — confirmado que os mesmos pares (Plásticos 31/73, Mecânica de Precisão 6/32, Informática 16/33) existiam em `fato_v55.db` com os ids exatos, porque a linha "auditoria" partiu de um snapshot anterior às correções e nunca teve conhecimento delas. Refundidos com a mesma decisão já validada. Esse merge revelou 516 violações de FK em 4 tabelas novas (`dm_matriz_pivotamento`, `dm_rede_centralidade`, `dm_rede_comunidades`, `dm_premio_transferencia`) que a varredura original (só em inglês) não tinha capturado por usarem nomenclatura em português (`perfil_origem_id` etc.) — corrigidas sem perda de dado real. `cnct_profiles`: 88 → 85. Ver `_DECISIONS.md` D64-DB/D65-DB e `portal/SPRINT14_EXECUCAO.md`.
- **Causa raiz, agora documentada para evitar repetição:** a propagação `cnct_courses`→`cnct_profiles` não verifica nome existente antes de inserir. Instruções explícitas para a sessão de auditoria em `_DECISIONS.md` D66-DB.

### SP-14 · 72 grupos de empresas duplicadas em `companies` (fato_v55.db, 520 registros)
- **Prioridade:** 🔴 Crítico (qualidade de dados)
- **Identificado em:** Sprint 14 (20/06/2026), varredura sistemática (mesma metodologia de SP-06/Sprint 9)
- **Status:** ✅ **Resolvido na Sprint 14** (20/06/2026) — 72 grupos candidatos, concentrados nos ids 484-610 (provável importação em lote da própria auditoria sem checar contra a base existente). 2 falsos-positivos excluídos após verificação individual: "BRF"/"BRF·M.Dias Branco" (concorrentes, já conhecido) e "SENAI"/"SENAI·SESI EaD (ES)" (2 programas técnicos diferentes que só coincidem em citar "SENAI" genericamente — verificado via contagem de fontes, 1 cada, programas distintos). 1 caso verificado por busca externa antes de fundir: "Air Products / Linde" — fontes vinculadas apontam só para `airproducts.com`, sem nenhuma referência a `linde.com`; Linde e Air Products são concorrentes globais distintos — conclusão de erro de cadastro, não joint venture. `companies`: 520 → 447. Ver `_DECISIONS.md` D64-DB e `portal/SPRINT14_EXECUCAO.md`.
- **Nota:** ainda não foi feita varredura equivalente em `atlas_trails` nem `sources` — registrado como pendência.

---

## Resumo executivo v5.0

| ID | Descrição resumida | Área | Prior. | Status |
|---|---|---|---|---|
| ~~IN-03~~ | README v3.3 defasado | Infra | 🔴 | ✅ Sprint 2–4 |
| IN-04 | guia_v6_2_completo.md ausente | Infra | 🔴 | ⏳ Pendente |
| ~~IN-05~~ | _DECISIONS.md D22+ não registradas | Infra | 🔴 | ✅ Sprint 2–4 |
| IN-06 | 3 Atlas: filename v1_1 ≠ v1.2 interna | Infra | 🟡 | ⏳ Pendente |
| IN-07 | gaps_v3_9.md fora de gestao/ | Infra | 🟡 | ⏳ Pendente |
| IN-08 | NOTAS_DE_VERSAO: GICEA "10" → 12 | Infra | 🟡 | ⏳ Pendente |
| ~~IN-09~~ | SUMARIO_EXECUTIVO estado v2.0 | Infra | 🟡 | ✅ Sprint 4 |
| ~~IN-10~~ | tabela_complementaridade desatualizada | Integr. | 🟢 | ✅ Sprint 4 |
| IN-11 | gestao/ faltando gaps_v3_6 | Infra | 🟢 | ⏳ Pendente |
| GU-14 | Revisão URLs sem rotina | Conteúdo | 🟢 | ⏳ SP-05 |
| ~~SP-01~~ | ~~portal_industria_edu.html desatualizado~~ | Portal | 🟡 | ✅ Removido 13/06 |
| ~~SP-02~~ | Busca global não implementada | Portal | 🟡 | ✅ Sprint 7 (16/06) |
| ~~SP-03~~ | cnct_hint no SourceCard adiado (badges *clicáveis*) | Portal | 🟢 | ✅ Sprint 8 (19/06) |
| SP-04 | atlas_trails em sectors sempre vazio | Dados | 🟢 | 🔒 Fechado Sprint 11 (sem solução viável) |
| SP-05 | URLs fato_002 não verificadas | Dados | 🟢 | ⏳ Sprint 5 |
| ~~SP-06~~ | Empresas duplicadas em `companies` (102 casos) | Dados | 🔴 | ✅ Sprint 9 (19/06) |
| SP-07 | Empresas sem UF | Dados | 🟢 | 🟡 **Piora proporcional real, não só diluição (23/07, fato_v237): 86→221 sem UF, mas de uma base que cresceu 840→1.026 tipo_entidade='empresa' (~186 promovidas de staging nas v205-v236).** Proporção: 10,2%→21,5% — a promoção em lote correu mais rápido que a pesquisa de UF conseguiu acompanhar (o próprio BANCO nomeia isso "item 9 company_uf_pesquisa_pendentes" nas versões v224+). Não é regressão de qualidade, é crescimento de escopo sem a etapa de enriquecimento ter dado conta ainda — mas o número absoluto que aparece na tela é maior, vale documentar sem maquiar |
| SP-08 | Fontes sector sem URL (23 casos, era 27) | Dados | 🟢 | ⏳ Pesquisa externa necessária |
| SP-09 | Fichas do Guia sem perfil CNCT (155 casos) | Dados | 🟡 | ⏳ Curadoria manual necessária |
| ~~SP-10~~ | Perfis CNCT duplicados ("Técnico em Plásticos") | Dados | 🔴 | ✅ Sprint 11 (19/06) |
| ~~SP-11~~ | Perfis CNCT duplicados (2 pares: Mecânica de Precisão, Informática) | Dados | 🔴 | ✅ Sprint 12 (19/06) |
| ~~EXP-07~~ | Micro-Atlas em PDF (78/99 cursos) | Portal | 🟢 | ✅ Sprint 12 (19/06) — parcial, 13 cursos sem perfil ainda sem UI; ⚠️ regrediu no `fato_v55.db` (sessão paralela), corrigido Sprint 13 (20/06) |
| SP-12 | 36 tabelas/views `dm_*` sem UI (era 35 — 1 view achada na recontagem, mesma classe do achado de `meta_protocolo` regra 15) | Portal/Dados | 🟢 | ✅ **Concluído, 20/36 com UI + 16/36 confirmadas como infraestrutura interna sem necessidade de UI (05/07)** — inventariado por completo em 4 grupos (ver `SP-12_inventario_e_plano.md`). **Grupo B** (6 tabelas — ver histórico). **Grupo C** (10 tabelas — ver histórico, achado de nomenclatura `sectors`/`industry_sectors`). **Grupo D concluído** (8 tabelas): `dm_compras_governo` + `dm_concursos_tecnicos` + `dm_noticias_industria` + `dm_colapso_silencioso` → novo painel "📡 Sinais de Mercado Regional" na aba Mercado, recolhido por padrão — o mais valioso (`dm_colapso_silencioso`) sinaliza descompasso oferta×demanda por região com alerta visual ("EVITAR RECOMENDAR"). `dm_curso_cbo_bridge`/`dm_cbo_pendentes`/`dm_completude_fontes` confirmados como bridge/auditoria interna (não expostos — mesma decisão do SP-38). `dm_importacoes_maquinas` (dado bruto por NCM) fica só como suporte de `dm_colapso_silencioso`, já resumido lá, não exposto separado. **Achado novo:** `categoria`/`setor_importacao`/`setor` nessas 4 tabelas são uma **4ª taxonomia de setor informal**, que não bate com `sector_codes` nem `industry_sectors` — reforça `SP-39`. Todas as 4 queries testadas por execução direta + render real (Playwright), sem erro |
| ~~SP-13~~ | Os 3 pares de SP-10/SP-11 reapareceram em `fato_v55.db` | Dados | 🔴 | ✅ Sprint 14 (20/06) |
| ~~SP-14~~ | Empresas duplicadas em `fato_v55.db` (72 grupos, 73 registros) | Dados | 🔴 | ✅ Sprint 14 (20/06) |
| SP-15 | 3 empresas no Guia sem trilha Atlas (Spirax Sarco, AVEVA ex-Wonderware, Aspen Technology) | Dados | 🟡 | ⏳ Pendente — achado sessão BANCO 20/06 |
| SP-16 | 11 recursos do Atlas sem cobertura no Guia | Dados | 🟢 | ⏳ Pendente — achado sessão BANCO 20/06 |
| SP-17 | Setor 11 — 5 empresas sem programa público | Dados | 🟢 | ⏳ Pendente — pesquisa já tentada, sem solução encontrada |
| ~~SP-18~~ | `nivel_cnct` vazio (88/88) | Dados | 🟢 | ✅ Resolvido (27/06) — mapeamento 1:1 a partir de tier |
| SP-19 | Rede de empresas sem ponte com instituições de ensino | Dados/Portal | 🟢 | ⏳ Parcial (27/06) — 100 candidatos, todos ENAP, baixa confiança |
| ~~SP-20~~ | ANP duplicada (id=944, 0 sources) | Dados | 🟢 | ✅ Resolvido (27/06) |
| SP-21 | 11 vínculos trail_step_sources descartados por ambiguidade (P5) | Dados | 🟢 | ⏳ Pendente — achado sessão BANCO 21/06 |
| SP-22 | CBO 8153-10 sem nome em cbo_canonical | Dados | 🟢 | ⏳ Pendente — achado Sprint 15, pesquisa parcial pela sessão BANCO |
| SP-23 | 194 sources p7-* com ~58% conteúdo fragmentado (risco aceito) | Dados | 🟢 | ⏳ Pendente — achado sessão BANCO 21-22/06 |
| SP-24 | Perfil CNCT #6 (Mecânica de Precisão) sem source technical direta | Dados | 🟡 | ⏳ Pendente — gap antigo, sem entrada própria até 26/06 |
| SP-25 | 40 companies fragmentadas descartadas (patch v68) + eixo a confirmar em 11 trilhas | Dados | 🟢 | ⏳ Pendente — achado sessão BANCO 27/06 |
| SP-26 | `trail_cbos`/`trail_normas` sem UI no portal | Portal | 🟢 | ✅ **Resolvido (02/07)** — `loadTrails` agora consulta as duas tabelas, agrupadas por `trail_id`; exibidas em `TrailCard` como pills "CBO" e "NORMAS" logo abaixo da descrição da trilha. Trilha sem linha em nenhuma das duas simplesmente não mostra a seção (98/55 linhas totais, nem toda trilha tem) |
| SP-27 | Migrar conteúdo único dos `iedu_*` antes de eliminá-los — pedido formal p/ sessão BANCO | Dados | 🔴 Crítico (item 3: bug confirmado em 18/29 perfis) | ✅ **Resolvido (v107, confirmado v109)** — patch `patch_iedu_SP27-1.sql` aplicado com dry-run prévio; auditoria byte-a-byte pós-fato confirmou 55/55 + 22/22 + 19/19 + 2/2 sem divergência contra o pacote fonte que enviamos. Achado de processo (não de dado): patch gerado continha `UPDATE` pra 10 perfis além do escopo aprovado no plano — inerte, bloqueado pela trava de segurança do próprio SQL. **Ação restante fora do escopo do banco:** os 4 arquivos-fonte `iedu_*.md` ainda podem ser apagados do projeto (não é responsabilidade da sessão BANCO) — ver D83 |
| SP-28 | Aba "Lacunas" do portal — investigação revelou não ser o que o nome sugeria (ver nota abaixo) | Portal | 🟡 | ✅ **Resolvido por reenquadramento (02/07)** — a aba "Lacunas" não lê a tabela de gestão de dívida técnica que o nome sugeria. `loadComplementarity` sempre leu `FROM gaps` (a tabela congelada), mas filtrando implicitamente (via `TAB_LABELS` na UI) só os 3 tipos que são conteúdo de produto real: `guia_sem_atlas`/`atlas_sem_guia`/`sobreposicao` (49 de 129 linhas) — uma comparação de cobertura entre o Guia e o Atlas, não dívida técnica do banco. **Ações tomadas:** (1) filtro movido para o SQL (`WHERE type IN (...)`) em vez de depender só da UI — mais seguro contra um `type` novo vazar pra tela no futuro; (2) aba renomeada de "Lacunas" para "Cobertura Guia × Atlas" no menu e no cabeçalho da tela, e sub-abas renomeadas ("Só no Guia"/"Só no Atlas"/"Nos dois") — o nome anterior sugeria gestão de dado interna, que não é isso. **Decisão do usuário:** não há necessidade de expor gestão de lacunas/dívida técnica (`gaps_v2`) ao usuário final — não será construída nenhuma tela para isso |
| SP-29 | `TRL-CNCT-022` e `TRL-CNCT-DG-001` têm o mesmo nome exibido em `vw_trails_ativas`, DG-001 sem fonte | Portal + Dados | 🔴 Crítico (UX) | ✅ **Resolvido (v109)** — renomeado para "Trilha do Profissional em Design Gráfico e Produção Cultural — Ferramentas Livres" e `cnct_label` revertido pra `NULL` (decisão consciente: `cnct_label` preenchido faria parecer catálogo CNCT oficial, quando a trilha não tem CBO original — esse é justamente o sinal que a distingue de `022`). Gap de sourcing renumerado de 90030→**90034**, `ativo`, confirmado por query direta |
| SP-30 | `TRL-CNCT-030` e `TRL-CNCT-004` nome idêntico, sinal EAD apagado | Dados | 🟡 | ✅ **Resolvido (v108, confirmado v109)** — renomeado "Trilha do Profissional em Administração (EAD)", verificado step a step (diferença real: escola do step 1, ENAP presencial vs IFSP EAD). Pergunta de fundo (merge os dois registros ou manter 2) segue aberta no gap **90032** |
| SP-31 | `meta_protocolo` — tabela de 27 regras de processo do lado BANCO nunca foi compartilhada com a sessão SITE | Processo | 🟡 | ✅ **Resolvido (02/07)** — tabela lida por completo direto do `fato_v109.db` (estava dentro do próprio banco o tempo todo, não em arquivo externo). Regras mais relevantes pra sessão SITE: regra 16 (protocolo canônico = `_LEIA_PRIMEIRO.md`, `meta_protocolo` é suplemento do lado BANCO), regra 20 (numeração `SP-NN` de patch externo é namespace próprio da ferramenta, nunca deve ser tratada como referência ao `_BACKLOG.md` real — 3ª ocorrência confirmada do mesmo padrão que já vimos entre nós), regra 8 (branches paralelas de `.db`: nunca aplicar uma sobre a outra sem comparar contagem por tabela e perguntar ao responsável). Nenhuma ação adicional necessária |
| SP-32 | 4 gaps promovidos de texto solto dentro de gaps já "resolvidos" para gaps próprios `ativo` (90030, 90031, 90032) — eram observações documentadas mas invisíveis a qualquer relatório | Dados | 🟢 | ⏳ Novo (v109) — sem ação necessária da sessão SITE, só ciência; ver `gaps_v2` ids 90030-90032 |
| SP-33 | Gap 90033 (reabertura parcial 90017: `TRL-CNCT-016`/`TRL-CNCT-039` são duplicata?) — evidência de duplicata mais fraca do que uma branch alegou; artefatos de corrupção de PDF não são idênticos byte a byte entre as duas descriptions | Dados | 🟢 | ⏳ Novo (v109) — investigação em aberto do lado BANCO, sem ação da sessão SITE por ora |
| SP-34 | `PRAGMA foreign_keys = ON` em produção; convenção de blocos de ID reservados por branch (evitar repetição da colisão 90026/90030); Parte B do gap 90013 (14 linhas residuais `sector_id`); recuperação retroativa de `atlas_num` pra 138/223 registros ambíguos (gap 90028) | Dados | 🟢 | ⏳ Recomendações da auditoria externa reafirmadas como pendentes em v108 — sem SQL pronto ainda |
| SP-35 | `TRL-CNCT-030`/`TRL-CNCT-004` são a mesma trilha em 2 modalidades (presencial/EAD, ver SP-30) mas aparecem como trilhas totalmente desconectadas na UI | Portal | 🟢 | ✅ **Resolvido (05/07)** — detecção genérica de trilhas-irmãs por nome-base (não hardcoded pro par que motivou o achado), exibida como nota discreta no `TrailCard`. Confirmado renderizando na tela real |
| SP-36 | **CRÍTICO** — `App()` violava as Regras de Hooks do React: `useState(pendingProfile)` e `useCallback(navigateTo)` estavam declarados *depois* de dois `return` condicionais (`loadError`/`!dataLoaded`). Na 1ª renderização (dados ainda carregando) o componente retorna antes de chamar esses hooks; ao terminar de carregar e re-renderizar, ele passa pelos `if`s e chama hooks que não existiam na renderização anterior — React error #310, crash garantido em qualquer navegador real assim que o banco terminasse de carregar | Portal | 🔴 Crítico | ✅ **Resolvido (03/07)** — achado ao montar pela 1ª vez um ambiente de render real (Playwright + Chromium headless) pra mostrar o site funcionando; nunca tinha sido testado num browser de verdade até agora. Os dois hooks movidos pra cima dos `return`s, junto dos demais. Corrigido antes de qualquer teste do usuário. Validado com `eslint-plugin-react-hooks` (`rules-of-hooks`) rodado no arquivo inteiro — 0 violações restantes — e reproduzido end-to-end: site carrega, navega entre as 10 abas e abre detalhe de perfil/trilha sem erro |
| SP-37 | `runSmokeTest` (M-12) compara contagens hardcoded da v55 contra o banco atual — gerava falso alarme a cada sincronização | Portal | 🟢 | ✅ **Resolvido (05/07)** — redesenhado de "bater exato" pra "checagem de piso": só alerta se os números **caírem** abaixo de um piso conhecido, nunca por crescimento legítimo de dado. Piso atual = v128 confirmado (35/572/397/497/98/187). Confirmado sem falso alarme em teste real (todas ✅) |
| SP-38 | **Auditoria de ruído em `companies`** — 325/733 empresas (44,3%) sem nenhuma fonte e sem nenhum setor associado. Inclui: 23 linhas que são a taxonomia de setor do Guia reinserida como "empresa" (com rótulos divergentes de `sector_codes`); dezenas de fragmentos de frase/rascunho sem sentido como nome; **3 linhas que parecem vazamento de texto de IA/pipeline** (ex: "Request: The user in is my response to..."); corpo normativo (ASME/IEC/NR-13/ISO) catalogado como empresa por falta de um campo de tipo. Também confirmado: ~~"SETOR null" visível na aba Setores~~ (129/497 fontes de setor = 26% sem `industry_sector_id`, UI escreve a string `"null"` sem tratar o caso); e corrupção de texto com espaço inserido no meio de palavra em pelo menos 3 descrições de trilha (`operação`→`ope ração`, `NR-10`→`N R-10`) | Dados + Portal | 🔴 Alto (integridade de dado + UX) | 🟡 **Parcial (recheck 04/07 em v128, ver `RECHECK_RUIDO_v109_v128.md`)** — 86/325 linhas de ruído removidas (26%), 239 seguem idênticas. ✅ Resolvido: as 3 linhas de possível vazamento de IA (categoria 3) foram removidas. 🟡 Maioria da categoria 2 (fragmentos de frase) removida, restam 2 linhas. ❌ **Sem nenhuma mudança do lado Dados**: categoria 1 (23 linhas de taxonomia de setor duplicada), categoria 6 (corrupção de texto nas 3 trilhas, mais 2 ocorrências novas notadas em `TRL-PM-013`: `venda`→`vend a`, `planejamento`→`pla nejamento`). ✅ **Categoria 5 (SETOR null) corrigida do lado Portal (16/07, sincronizado 17/07):** bug era duplo, não só o texto — `ViewSectors.jsx` usava `null` tanto pro id do grupo sem setor quanto pro estado "nada selecionado", então o card desse grupo nem abria ao clicar. Sentinela dedicado (`NO_SECTOR_ID="sem_setor"`) resolve os dois: grupo agora aparece como "Sem setor classificado" (129 fontes, sempre por último na lista, com nota explicando que não é um 13º setor) e é clicável normalmente. Critério registrado em `_DECISIONS.md` D116. Categorias 1/6 continuam sem solução — dependem da sessão BANCO |
| SP-39 | **Pedido novo (04/07, reforçado 05/07): consolidar as taxonomias de setor concorrentes — agora 4, não 3.** `sector_codes` (29, taxonomia técnica do Guia), `sectors` (22, `type='social'`, propósito pouco claro pra sessão SITE), `industry_sectors` (12, usado pelo mercado/empresas) — ligadas por uma ponte fina e não totalmente confiável, `sector_mapping` (12 linhas: 7 `direct`, 4 `inferred`, 1 `partial`). **Achado em 05/07 (SP-12 Grupo D):** `dm_compras_governo.categoria`/`dm_colapso_silencioso.setor_importacao`/`dm_importacoes_maquinas.setor` usam uma **4ª taxonomia informal** (`automacao`, `eletrica`, `mecanica`, `maquinas`, `eletronico`, `automotivo`, `instrumentacao`) que não bate com nenhuma das 3 anteriores. Já tivemos que investigar isso a fundo 3 vezes (D87, sincronização Grupo C, sincronização Grupo D) pra não plugar tabela errada — é um risco real de bug futuro pra qualquer nova feature que envolva setor | Dados | 🟡 | ✅ **Redesign N:N implementado (23/07, fato_v237)** — achado do BANCO antes de construir: a tabela N:N que seria necessária **já existia** (`sector_to_sector_codes`, criada em v76, 71 linhas, peso alta/média/baixa) — só não estava ligada em `industry_sectors.id` diretamente. Como `sector_mapping` já estava 12/12 completo desde v193, bastou encadear as tabelas existentes — 0 tabela nova, 0 curadoria nova necessária. Criada `vw_industry_sector_codes` (view). **Ainda sem consumidor no portal** — mesma oportunidade barata de antes (`ViewMercadoTrabalho.jsx` já tem a nota "rótulo informal, não taxonomia oficial" no lugar exato onde isso resolveria), agora com o dado pronto de verdade |
| SP-40 | **Pedido novo (04/07): reduzir dependência de chave em texto livre nas tabelas `dm_*` mais recentes, e formalizar dry-run/diff obrigatório antes de aplicar qualquer patch gerado.** Duas tabelas usam texto livre como chave de ligação em vez de ID estável: `dm_oportunidade_estrategica.cbo_6digitos` só bate com `cbo_canonical.cbo_padronizado` em 1134/1152 (98,4%), e `dm_qualidade_preditiva.curso` só bate com `cnct_profiles.name` em 37/47 (78%) — os órfãos ficam invisíveis silenciosamente, sem erro, só sem aparecer na tela. Relacionado: já vimos 2 vezes um patch gerado divergir do que alegava fazer (gap 90026; e o patch do SP-27 com 10 `UPDATE`s fora do escopo aprovado, só não teve efeito por causa de uma trava de segurança que por acaso existia) | Dados | 🟡 | 🟡 **Melhorou parcialmente (18/07, fato_v193)**: `dm_qualidade_preditiva.curso` 37→39/47 (normalização de 2 linhas). `dm_oportunidade_estrategica.cbo_6digitos` segue em 1134/1152 (18 órfãos, sem mudança) — "não tocado" por decisão do BANCO (ver ESTADO_ATUAL.md). Sugestão original segue válida: (1) usar `profile_id`/`atlas_trails.id` como chave nas próximas tabelas analíticas em vez de nome; (2) rodar um diff automático entre o que o patch declara mudar e o que ele muda de fato, antes de aplicar |

| SP-41 | **Pedido novo (14/07, sessão SITE — consolidação de documentação): `ESTADO_ATUAL.md` está descrevendo `fato_v94.db`/v97 (733 empresas, 103 `gaps_v2`), mas o banco real é `fato_v128.db`** (confirmado por query direta: `MAX(version)` em `db_versions_v2` = 128, `companies` = 651, `gaps_v2` = 132 — 10 ativos, não 33). Além disso, não existe changelog em `.md` cobrindo v98-v101 nem v110-v128 (`CHANGELOG_BANCO_v81-v97.md` para em v97, `CHANGELOG_BANCO_v102-v109.md` cobre só até v109) — só existe dentro do próprio `.db`, em `db_versions_v2`.** | Documentação/Dados | 🟡 | ⏳ Pedido formal — sugestão: (1) sobrescrever `ESTADO_ATUAL.md` com contagens verificadas de v128, seguindo o próprio protocolo descrito no topo daquele arquivo; (2) gerar o changelog faltante (v98-128) a partir de `db_versions_v2`, já que todo o conteúdo já existe lá — não precisa de reconstrução de memória. Não fiz essa edição eu mesmo (sessão SITE) por ser documento de estado do lado BANCO (Regra 9, `_LEIA_PRIMEIRO.md`) |

| SP-42 | **Sincronização SITE×BANCO (15/07, v128→v168):** achado ao rodar a checagem de schema da Regra 1 — `dm_monopolio_oferta` foi renomeada para `dm_monopolio_oferta_arquivado` em algum ponto entre v135 e v167, **sem registro em `db_versions_v2` e sem menção em nenhum `.md` do projeto** (a própria v168 afirma "nada mudou fora de cnct_profiles/cnct_courses" entre v167→v168, então o rename é anterior e não coberto por essa verificação). Dado preservado intacto (215 linhas, mesmo schema) — só o nome mudou, `vw_rede_empresas` já usa o nome novo internamente, o que sugere rename intencional (arquivamento) cujo registro de versão simplesmente não foi feito. | Dados + Portal | 🟡 | ✅ **Portal corrigido (15/07)** — `loadSectorsGuia.js` ajustado pra `dm_monopolio_oferta_arquivado`, testado contra o `.db` real (0 erros nas 70 queries do site). **Pedido formal para a sessão BANCO:** confirmar se o rename foi intencional (arquivamento por algum critério — ex. dado desatualizado?) e registrar retroativamente em `db_versions_v2`/`_DECISIONS.md` qual versão fez a mudança e por quê, já que hoje não há como saber sem isso |
| SP-43 | **Sincronização SITE×BANCO (15/07): oportunidades de produto não utilizadas ainda** — (1) `companies` ganhou 11 colunas de enriquecimento CNPJ (`cnpj`, `razao_social`, `cnae`, `situacao_cadastral`, `capital_social`, `endereco_completo`, `cidade`, `tipo_entidade`, `tipo_unidade`, `confianca_cnpj`, `cnpj_verificado_em`) — não expostas em nenhuma tela hoje; (2) 2 views novas da migração v168 (`vw_cnct_catalogo`, `vw_cnct_cobertura`) ainda sem consumidor no portal; (3) 13 perfis CNCT novos (98→111) já aparecem automaticamente nas telas existentes (query sem filtro por id), mas todos com `nivel_cnct`/`justificativa_i4_i5` NULL (gap 90058 do lado BANCO, decisão editorial pendente) — campos não usados pelo portal hoje, sem risco de exibir NULL na tela | Dados + Portal | 🟢 | ✅ **Item (3) resolvido do lado BANCO (18/07, fato_v175)** — gap 90058 fechado, `nivel_cnct`/`justificativa_i4_i5` preenchidos pros 13 perfis novos (0/111 nulo, confirmado por query). Itens (1) e (2) seguem sem consumidor no portal — registro de oportunidade, não bug, nenhuma ação necessária |
| SP-44 | **Estudo de viabilidade completo (15/07, sessão SITE): as 68 tabelas/views de `fato_v168.db` sem nenhum consumidor no portal** — pedido explícito do usuário. Inspecionadas todas (contagem, integridade referencial contra o que o portal já carrega, overlap com telas existentes). Ver `ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md` (substitui/expande o escopo de SP-43 acima) | Dados + Portal | 🟢 | ⏳ **5 recomendados para implementar direto** (Tier 1: Perfis de Elite/`atlas_destination_profiles`, "onde estudar" por passo/`trail_escola_links`, currículo detalhado por trilha/`atlas_trail_detail`, catálogo de normas técnicas/`normas_fato`, matriz de pivotamento de carreira/`dm_matriz_pivotamento`) · **8 viáveis com decisão de produto antes de codar** (Tier 2: Rede de Empresas, programas de treinamento de empresa, painel "Panorama por Estado", vínculos fonte↔perfil adicionais, badge de tipo de fonte, verticalização mais completa, trilhas relacionadas, metadados do Atlas) · **~40 não recomendados** (Tier 3: infraestrutura de processo/auditoria já com decisão anterior documentada, backups/arquivo, dado morto/vazio, tabelas-ponte de taxonomia, views redundantes com o que já existe). Nenhum item foi implementado nesta rodada — é estudo, não execução; abrir `SP-NN` próprio se algum item for aprovado |
| SP-45 | **Implementação de 4 dos 5 itens Tier 1 do SP-44 (15/07, sessão SITE):** (1) **Perfis de Elite** — nova aba, `atlas_destination_profiles` (55 combinações de 2-4 trilhas Atlas), conteúdo editorial já pronto renderizado por um parser Markdown pequeno e específico ao formato real (não uma lib genérica — sem bundler neste projeto, ver `index.html`); vínculo trilha↔perfil extraído por regex (não é FK declarada); (2) **"Onde estudar" por passo de trilha** — `trail_escola_links`+`escola_sources` (894 linhas), anexado a cada `step` de `loadTrails()`, renderizado no `TrailCard`; (3) **Currículo detalhado por nível** — `atlas_trail_detail` (74 linhas), anexado a cada trilha Atlas, renderizado no painel de detalhe de trilha em `ViewProfiles`; (4) **Matriz de pivotamento** — `dm_matriz_pivotamento` (7140 pares), anexada a cada perfil CNCT, seletor com busca em `ViewProfiles` (complementar ao `dm_premio_transferencia` já existente: aquele é qualitativo/top-5, este é quantitativo/todos os pares) | Dados + Portal | 🟢 | ✅ **Implementado e testado (15/07)** — todas as 5 queries novas rodadas contra o `.db` real antes de codar (Regra 3.1): `trail_escola_links` 894 linhas/0 órfãos em ambas FKs (melhor que os 508/894 estimados no estudo), `atlas_trail_detail` 74/74 resolvendo, `dm_matriz_pivotamento` 7140/7140 resolvendo contra `cnct_profiles`, 0 pares (X,X). Todos os 7 arquivos alterados/criados validados sintaticamente com o mesmo Babel usado em produção (`@babel/preset-react`, instalado localmente pra teste, não é dependência do portal). **Achado no meio do trabalho:** o parser de trilhas de Perfis de Elite só cobria o formato da amostra do estudo (3/55 linhas) — o texto real tem 3 templates distintos; regex ajustado cobre 47/55 (0 código de trilha extraído que não bata contra `atlas_trails.code`); os 8 restantes ("perfis consolidados", ex. `PE-SEG`) descrevem pré-requisito em prosa livre, ficam sem pills de trilha (texto completo continua visível) — parse por regex arriscaria extrair errado |
| SP-46 | **Achado de qualidade de dado ao investigar o item Tier 1 nº5 do SP-44 (catálogo de normas técnicas, `normas_fato`), não implementado por isso:** o estudo original relatou "descricao e tipo_norma pra cada uma das 295" normas — checagem própria antes de codar (Regra 3.3) achou que só 55/295 (18,6%) têm `descricao` preenchida, e boa parte dessas 55 parece texto corrompido/fora de ordem (ex. `"API Fonte: acesso — de e loja mycommittees.api.org via"`, `"DNV 3. Padrões — (Det A DNV Norske Estruturas Unidades e para Veritas) classificação em global referência é"`) — leitura como extração OCR ou scraping mal-sucedido, não frases reais. Também há duplicatas em `frequencia_total` (`"Lei nº 5.524/1968"` vs `"Lei nº nº 5.524/1968"`, mesmo texto com "nº" duplicado) | Dados | 🟡 | ✅ **Fechado (23/07, fato_v237)** — 80/265 com descrição real (36 por conhecimento do modelo em v198, auditado contra busca externa em 2 casos de maior risco em v203, sem inconsistência; mais correções pontuais depois). As 185 restantes (normas técnicas pagas — séries IEC/ISO/ABNT NBR/ASME/AWS específicas) marcadas explicitamente "Conteúdo pago — sem descrição disponível gratuitamente" por **decisão do usuário de não adquirir as normas** (v199) — não é mais uma pendência, é um estado final aceito. Fila fechada, 0 pendentes. `loadNormasCatalogo()` (SP-47) continua funcionando sem mudança |
| SP-47 | **Possibilidade nova, achada ao implementar SP-45 (não estava no estudo original SP-44): catálogo de normas técnicas via reverse-index de `atlas_trail_detail.normas_ref`, sem depender da correção pedida no SP-46.** `normas_ref` (JSON array por nível de trilha, já carregado pelo item 3 do SP-45) cita 166 das 295 normas de `normas_fato` (56%, checado por `json.loads` de cada linha vs. `normas_fato.codigo`) — dá pra mostrar "em quais trilhas/níveis esta norma aparece" em vez de depender de `descricao` (que está quebrada/ausente pra ~87% das normas, SP-46). Menos ambicioso que um catálogo editorial completo, mas real e não bloqueado | Portal | 🟢 | ✅ **Implementado (15/07):** `loadNormasCatalogo()` (`loadTrailsProfiles.js`) monta o reverse-index (166/295 confirmado de novo contra o `.db` real, +1 código `"DNV standards "` citado em `normas_ref` sem linha em `normas_fato`, tratado sem quebrar). Componente `NormaBadge` (`badges.jsx`) — pill clicável com popover (código, `tipo_norma` [295/295 preenchido], `descricao` se existir, lista de trilhas/níveis) — usado em `ViewProfiles.jsx` (3 pontos: Atlas II, currículo detalhado, normas do perfil) e `TrailCard.jsx`. `SourceCard.jsx` não alterado (normas lá são resumo de texto truncado, não pills — fora do escopo de baixo esforço deste item) |
| SP-48 | **Bug pré-existente achado ao implementar SP-45 (não introduzido nesta sessão, não corrigido ainda): `atlasTrails.find(x=>x.code===code)` em `ViewProfiles.jsx` (~linha 392) não desambigua por `atlas_num`.** 28 códigos de trilha Atlas se repetem entre 2 e 6 `atlas_num` diferentes (ex. `C1` existe em 5 Atlas distintos: I, II, III, V, VII; `F1` em 6) — `Array.find()` sempre pega a 1ª ocorrência, então o nome de trilha exibido pra esses 28 códigos pode estar errado dependendo de qual perfil os referencia. Não tinha sido notado antes porque nenhuma tela anterior cruzava tantos Atlas ao mesmo tempo quanto a nova aba Perfis de Elite (`ViewElitePerfis.jsx`, que já foi escrita corretamente com o filtro por `atlas_num` desde o início, por já saber deste risco) | Portal | 🟡 | ✅ **Varredura completa + correção onde possível (15/07)** — 4 pontos achados no total (não só o 1º documentado): (1) `ViewProfiles.jsx` lista de trilhas do perfil (linha ~468) — **corrigido**, precisou adicionar `trails_atlas_detail:[{code,atlas_num}]` em `loadProfiles()` (o dado de origem, `atlas_trail_profiles`, não guardava atlas_num nenhum antes); (2) `relProfiles`/`relSources` no painel de trilha (mesma linha ~41-42) — **corrigido junto**, mesma classe de bug; (3) fontes técnicas via `source_atlas_trails.atlas_code` — **corrigido pra 194/232 (83%)** linhas que já têm `atlas_num` resolvido na própria tabela (`atlas_trails_detail` em `loadSocialTechnical.js`); os 38 casos (17%) ainda sem `atlas_num` continuam com o comportamento antigo (ambíguo), não pioram nem fingem correção; (4) `ViewGaps.jsx` linha 33 (`gap_atlas_trails.atlas_code`, 13 códigos ambíguos usados aqui) — **NÃO fixável do lado SITE**, tabela não tem `atlas_num` nem `trail_id` pra desambiguar (Regra 0.1/3.2) — mitigado com lista de candidatas em vez de escolha silenciosa errada; **pedido formal pra sessão BANCO**: adicionar `atlas_num` (ou `trail_id`) a `gap_atlas_trails`, e completar a resolução dos 38 casos ainda nulos em `source_atlas_trails.atlas_num` se a fonte permitir. Query pra reproduzir a lista original de 28 códigos ambíguos: `SELECT code, GROUP_CONCAT(DISTINCT atlas_num) FROM atlas_trails GROUP BY code HAVING COUNT(DISTINCT atlas_num)>1` |
| SP-49 | **Oportunidade nova, achada ao implementar SP-45 (item 2, "onde estudar"): `escola_sources.tipo` não é usado em nenhuma tela** — `senai` (67), `governo` (41), `privada` (8), `federal` (4) = 120/253 (47%) preenchido, cobertura bem maior que o item 10 do estudo original (`material_types`, 6,5%) | Portal | 🟢 | ✅ **Implementado (15/07)** — `loadTrails()` (`loadTrailsProfiles.js`) agora expõe `escola_tipo` em cada link de escola por passo; `TrailCard.jsx` renderiza um badge (SENAI/Governo/Rede Federal/Privada, cor própria por tipo) ao lado de cada link "🎓 Onde estudar" quando o tipo é conhecido |
| SP-50 | **Oportunidade nova, achada ao implementar SP-45 (item 1): índice reverso "esta trilha compõe os Perfis de Elite X, Y" — já cogitado no estudo original (SP-44) mas fora do escopo mínimo, agora barato de fazer porque o item 1 do SP-45 já carrega `trilhas: string[]` por perfil de elite** | Portal | 🟢 | ✅ **Implementado (15/07)** — nova seção em `ViewProfiles.jsx` (painel de detalhe de trilha, ao lado do currículo detalhado do SP-45/item 3), `groupBy`/filter sobre `eliteProfiles` (já em memória, sem query nova). Comparação por `code`+`atlas_num` do próprio perfil de elite — checagem própria confirmou 0 mismatches (toda trilha citada num Perfil de Elite pertence ao mesmo `atlas_num` do perfil, 55/55 perfis verificados) |
| SP-51 | **Pedido formal para a sessão BANCO, registrado ao fechar SP-48 (15/07):** `gap_atlas_trails` guarda só `atlas_code` (texto), sem `atlas_num` nem `trail_id` — impossível desambiguar do lado SITE quando o código é um dos 28 que se repetem entre Atlas diferentes (13 desses códigos são efetivamente usados nesta tabela: A1, A2, A7, B2, C1, C2, C3, D1, D2, D3, F1, F2, PE-1). Pedido: adicionar coluna `atlas_num` (ou, melhor, `trail_id` como FK direta pra `atlas_trails.id`) a `gap_atlas_trails`, populada a partir do contexto original de cada gap. Complementar: `source_atlas_trails.atlas_num` já existe mas só 194/232 (83%) linhas resolvidas — se a fonte permitir, completar os 38 casos restantes fecha a mesma classe de ambiguidade nas fontes técnicas | Dados | 🟡 | ✅ **Quase fechado (23/07, fato_v237)** — 108/113 (95,6%) desambiguadas (tabela cresceu de 106→113 linhas com mais casos identificados no processo). Trabalho extenso em várias rodadas (v228-v235): match fuzzy conservador, cruzamento temático quando o histórico misto de `atlas_num` da mesma empresa não invalidava o match (correção de premissa própria em v230 — 'empresa grande atua em várias trilhas, isso é esperado'), auditoria de uma 2ª LLM externa verificada célula a célula antes de aplicar. **Restam só 5** (gaps 116-118/D8, 120/122/C3) — 1 caso (Hytron) teve busca externa confirmando ausência de portal educacional público, decisão explícita do usuário de parar de rastrear. `loadSectorsGuia.js`/`ViewGaps.jsx` (SP-66) não precisaram de nenhuma mudança — já usam a resolução direta quando existe, caindo pra candidatas só nos 5 restantes |
| SP-52 | **Pedido formal para a sessão BANCO (17/07, sessão SITE — enxugamento de estrutura, ver `_DECISIONS.md` D114/D115): coluna `cnct_courses.micro_atlas_pdf` ficou órfã.** Os 78 PDFs estáticos que essa coluna referenciava (`dados/micro_atlas/*.pdf`) foram removidos do repositório — eram exportações geradas por script fora do versionamento, substituídas por renderização dinâmica (`components/MicroAtlasView.jsx`, lendo `cnct_courses` diretamente). O portal já parou de consumir essa coluna (removida da query em `loadTrailsProfiles.js` e do componente). A coluna em si, porém, continua existindo no `.db` com 78 paths que agora apontam pra arquivos inexistentes. | Dados | 🟢 | ✅ **Resolvido pelo BANCO (18/07, fato_v193)** — `cnct_courses.micro_atlas_pdf` nulificada (0/99 preenchida, confirmado por query, era 78) |
| SP-53 | **Item 12 do estudo de viabilidade (trilhas relacionadas/pré-requisito, `trail_dependencies`) — decisão de produto confirmada 17/07: "pode anexar".** | Portal | 🟢 | ✅ **Implementado (17/07)** — `loadTrails()` (`loadTrailsProfiles.js`) anexa `derivada_de`/`derivadas` por trilha (14/14 linhas resolvidas, 0 órfãos contra `trails`). `TrailCard.jsx` mostra "↳ {tipo} derivado de {trilha-base}" e "↳ Trilhas derivadas desta: ..." quando existe, mesmo padrão visual do SP-35 (`variantes`) |
| SP-54 | **Item 10 do estudo de viabilidade (badge de tipo de fonte, `material_types`/`source_material_types`) — decisão de produto confirmada 17/07: "pode implementar".** | Portal | 🟢 | ✅ **Implementado (17/07)** — `loadTechnical()` anexa `material_type` (código corrigido em runtime: a coluna real é `label_pt`, não `label` como o estudo original sugeria — achado ao validar a query contra o `.db`, corrigido antes de fechar). Cobertura real pra layer=technical: 101/572 (17,7%) — maior que a estimativa de 6,5% do estudo (que era sobre todas as camadas de `sources`), mas ainda baixa; badge aparece em ~1 a cada 6 fontes. `SourceCard.jsx` mostra o badge ao lado do badge "Atlas FATO" quando existe |
| SP-55 | **Item 9 do estudo de viabilidade (vínculos fonte↔perfil adicionais, `source_cnct_profiles` ∪ `guia_source_profiles`) — decisão de produto confirmada 17/07: "pode somar, o site ainda não é público".** | Portal | 🟢 | ✅ **Implementado com achado adicional (17/07)** — a união pedida dá **0 vínculos novos** especificamente pra `layer=technical` (confirmado por query: `guia_source_profiles` não tem nenhuma linha pra essa camada, só cobre 'guia'/'sector'). Aplicada mesmo assim em `loadTechnical()`, por completude. **O ganho real veio de outro lugar**: `loadSocial()` nunca lia nem a 1ª tabela (`source_cnct_profiles`) — 699 vínculos existentes pra `layer=social`, 0 expostos até agora. Corrigido — 34/35 fontes sociais agora mostram vínculo de perfil (era 0/35). O par ('sector'/'guia', ~1.600 vínculos somados) segue sem UI que os consuma — ver SP-59 |
| SP-56 | **Item 7 do estudo de viabilidade (mesclar `sector_programs` na aba Social) — decisão de produto confirmada 17/07: "pode mesclar".** | Portal | 🟢 | ✅ **Implementado (17/07)** — `loadSocial()` mescla as 174 linhas de `sector_programs` (94 empresas) na mesma lista, id prefixado `sp-N`. `sector_programs` não tem `url` — achado ao mesclar: `SourceCard.jsx` renderizava o botão "🔗 Acessar portal" incondicionalmente (bug latente, só ficou visível ao introduzir uma fonte sem link). Corrigido — botão e o rótulo "Público:" agora condicionais à existência do dado (este 2º também por causa de 47/174 linhas de `sector_programs` com `publico` nulo, 0 casos assim nas fontes sociais originais) |
| SP-57 | **Item 8 do estudo de viabilidade (painel "Panorama por Estado") — decisão de produto confirmada 17/07: "painel agregado".** | Portal | 🟢 | ✅ **Implementado (17/07)** — `loadPanoramaUF()` (`loadMercadoEmpresas.js`) une as 4 fontes (`vw_indicador_demanda`, `vw_mapa_calor_preditivo`, `vw_mapa_competencias_predito`, `dm_pnp_indicadores`) por UF, ranqueado por score de demanda. Achado ao validar: 2/10 linhas de `vw_mapa_calor_preditivo` têm `uf=NULL` (setores sem escopo estadual claro) — filtradas (não teria sentido num painel "por Estado"; lição do D116 sobre não deixar um NULL real colidir com um agrupamento aplicada aqui como filtro). 12 UFs cobertas por pelo menos 1 das 4 fontes. Painel colapsável em `ViewMercadoTrabalho.jsx`, mesmo padrão do painel "Sinais de Mercado Regional" (SP-12 Grupo D) |
| SP-58 | **Item 6 do estudo de viabilidade (Rede de Empresas, espelhando Rede de Carreira) — decisão de produto confirmada 17/07: "pode replicar".** | Portal | 🟢 | ✅ **Implementado com achado adicional (17/07)** — `RedeDeEmpresas.jsx` (novo componente, mesmo padrão radial de `RedeDeCarreira.jsx`/D111). Laços fortes = `dm_competicao_talentos` (já carregado como `concorrentes_talento`, achado ao investigar que **já existia** um equivalente de `dm_sinonimos_perfis` pro lado empresas — só precisou normalizar escala, `overlap_pct_a` é 0-100 vs. `overlap_percent` 0-1). Laços fracos = `dm_rede_empresas_comunidades` (405/936 empresas, 47%). Painel de detalhe novo em `ViewEmpresas.jsx` (view não tinha estado de seleção nenhum antes) + navegação cruzada (`pendingCompany`, mesmo mecanismo do `pendingProfile`/SP-03). **Achado de qualidade de dado**: 19 `company_id` com linhas conflitantes em `dm_rede_empresas_comunidades`/`_centralidade` (provável resíduo da fusão de duplicatas D70-DB não recalculado nessas tabelas derivadas) — ver SP-59 |
| SP-59 | **Pedido formal para a sessão BANCO, registrado ao fechar SP-58 (17/07/2026):** `dm_rede_empresas_comunidades` e `dm_rede_empresas_centralidade` têm 19 `company_id` cada uma aparecendo 2x com valores conflitantes (ex.: `company_id=5` classificado como "🟢 GATEKEEPER" numa linha e "⚪ Periférico" noutra, `comunidade_id` diferente em cada linha). Provável resíduo da fusão de duplicatas de empresa (D70-DB, 447→442 empresas, 5 pares mesclados) que não recalculou estas 2 tabelas derivadas depois do merge de IDs. Mitigação temporária aplicada no SITE: escolha determinística (maior `tamanho_comunidade`/`score_gatekeeper`) em vez de depender da ordem de retorno do SQLite — evita resultado não-determinístico, não resolve a causa raiz. Pedido: recalcular as 2 tabelas depois de qualquer fusão de `company_id`, ou pelo menos deduplicar as 19 linhas conflitantes na próxima versão do banco. Complementar (mencionado no SP-55): `guia_source_profiles`/`source_cnct_profiles` somam ~1.600 vínculos pra `layer='sector'`/`'guia'` sem nenhuma UI que os consuma hoje — não é pedido de dado, é nota pra uma futura decisão de produto (não implementado nesta sessão, fora do escopo dos itens 6-12 decididos) | Dados | 🟡 | ✅ **Resolvido na raiz pelo BANCO (18/07, fato_v193)** — causa raiz era recálculo por INSERT sem limpar linhas antigas do mesmo `company_id` quando o nome da empresa mudava (rename/merge). Corrigido: recálculo agora limpa antes de inserir, 0 duplicatas confirmadas nas 2 tabelas. Critério de desempate do SITE (`ORDER BY .. DESC` + dedup) mantido como rede de segurança inofensiva, não precisa mais resolver nada hoje |
| SP-60 | **Achado ao sincronizar com `fato_v175_MERGED.db` (18/07/2026):** BANCO documentou (gap 90061) 24 `companies` que na verdade são lixo de parsing — título de artigo/listagem, sigla de sistema interno, ou frase genérica ("Cursos Gratuitos", "SEI", "CIPA Net", "Study Abroad"...) — entraram como `tipo_entidade='empresa'` por erro de extração de texto livre. Confirmadas pelo BANCO sem UF/CNPJ/razão social e não localizáveis como entidade formal em busca externa. Todas as 24 têm ≥1 fonte vinculada (apareceriam como card normal em `ViewEmpresas`) e 6 delas já apareceriam na Rede de Empresas (SP-58) como se fossem empresas reais com relação de rede | Portal | 🟡 | ✅ **Resolvido na raiz pelo BANCO (18/07, fato_v193)** — gap 90061 fechado: as 24 originais + 70 achadas por heurística ampliada (94 no total) reclassificadas `tipo_entidade='pagina_agregadora'`. **SP-64**: filtro fixo de IDs no SITE removido, substituído por `WHERE tipo_entidade='empresa'` na query de `loadCompanies()` — cobre as 94 automaticamente, não só as 24 originais, e se ajusta sozinho se o BANCO reclassificar mais no futuro. Critério do D118 (mitigar → correção de raiz substitui) se confirmou na prática |
| SP-61 | **Achado ao sincronizar com `fato_v175_MERGED.db` (18/07/2026):** `trails.descricao_geral` é onde o BANCO registra ressalvas de curadoria — hoje só preenchida pra `trl-107` ("Piloto v1 — cobertura parcial, pendente de curadoria..."), uma trilha piloto criada numa entrega explicitamente marcada "NÃO REVISADA POR CURADORIA" (regra 29 `meta_protocolo`) e com cobertura deliberadamente parcial (4 de 354 fontes vinculadas ao perfil, ~340 programas institucionais amplos não incluídos). O campo existia mas não era lido em nenhum loader | Portal | 🟢 | ✅ **Implementado (18/07)** — `loadTrails()` expõe `nota_curadoria` (de `descricao_geral`), `TrailCard.jsx` mostra um badge de aviso quando presente. Não é hardcoded pra `trl-107` — aparece pra qualquer trilha que tiver essa nota, presente ou futura. Não foi preciso decidir "incorporar ou excluir" os ~340 programas remanescentes (isso é decisão do BANCO/curadoria, gap referenciado na própria nota) — só garantir que a ressalva já escrita pelo BANCO chegue até a tela |
| SP-62 | **Item 13 do estudo de viabilidade (metadados do Atlas, `atlas_docs`) — decisão de produto confirmada 18/07: "pode implementar agora, itens 1/3 já decididos".** | Portal | 🟢 | ✅ **Implementado (18/07)** — `loadAtlasDocsMap()` (função compartilhada, `loadTrailsProfiles.js`) anexa `atlas_doc` (nome oficial, fonte CNCT + página, blocos de competência) tanto em `atlasTrails` (painel de trilha, `ViewProfiles.jsx`) quanto em `eliteProfiles` (painel de Perfil de Elite, `ViewElitePerfis.jsx`). Cobertura: 18/18 `atlas_docs`, 0 `atlas_num` de `atlas_trails` sem doc correspondente (1 sobra do lado `atlas_docs`, `"B01"`, sem trilha associada — inofensivo, só não é usado em lugar nenhum) |
| SP-63 | **Item 11 do estudo de viabilidade (verticalização mais completa) — decisão de produto confirmada 18/07: "junto com Tecnólogo/Bacharelado".** | Portal | 🟡 | ✅ **Implementado com correção de premissa (18/07)** — o estudo original afirmava que `course_graduacoes`/`course_especializacoes` eram "estritamente mais completas" que `cnct_verticalizacao`/`cnct_qualificacoes`; checagem perfil a perfil (não só amostra) mostrou que **não são** — 30/85 perfis (35%) perderiam item real (não lixo) numa troca direta. Implementado como **união** (deduplicada por nome) em vez de substituição: `specializations` e a nova `graduacoes` cobrem 98 perfis cada (era 85), 0 perda confirmada. `course_graduacoes` não distingue Tecnólogo/Bacharel — por isso a seção Verticalização virou 1 card único ("Graduação") em vez de 2 colunas; a distinção "especialização técnica" que a decisão original cogitava como 3ª coluna já tinha lugar certo: a seção "Especializações" (pills) existente, que só ganhou mais itens. `course_tags` (mencionada no título do item 11 no estudo) não fazia parte do escopo real — é tag temática de curso, conceito não relacionado à verticalização, fica de fora. Critério e achado completo em `_DECISIONS.md` D119 |
| SP-64 | **Achado ao sincronizar com `fato_v193_MERGED.db` (18/07/2026):** ver detalhe completo em SP-60 acima — filtro fixo de 24 `company_id` no SITE substituído por `WHERE tipo_entidade='empresa'` real na query, depois do BANCO fechar o gap 90061 (94 empresas reclassificadas). | Portal | 🟢 | ✅ **Implementado (18/07)** — `loadMercadoEmpresas.js` |
| SP-65 | **Achado ao sincronizar com `fato_v193_MERGED.db` (18/07/2026):** o floor check de `loadCore.js` (guarda contra perda de dado silenciosa) falhou ao carregar v193 — `technical` 572→396, `sector` 497→477. Investigado antes de simplesmente rebaixar o número: **quedas legítimas**, não perda acidental. `technical`: gap 90062 (BANCO, achado próprio deles, não pedido nosso) — 189 `sources` continham texto de raciocínio de IA vazado (ex. prompts/respostas de um pipeline mal configurado), removidas; 5 legítimas mantidas, 2 recuperadas por busca externa. `sector`: cascata do SP-60/SP-64 — fontes ligadas às 94 empresas reclassificadas `pagina_agregadora` removidas junto. Confirmado por query: 0 `sources` de `layer='sector'` remanescentes ligadas a `pagina_agregadora` | Portal | 🟢 | ✅ **Floor rebaixado pra nova linha de base real (18/07)** — `technical: 390`, `sector: 470` (com margem, não o número exato, pra não voltar a estourar por variação normal) |
| SP-66 | **Achado ao sincronizar com `fato_v193_MERGED.db` (18/07/2026):** ver detalhe completo em SP-51 acima — `loadSectorsGuia.js`/`ViewGaps.jsx` atualizados pra consumir `atlas_num`/`trail_id` de `gap_atlas_trails` quando resolvidos (69/106), caindo pra lista de candidatas nos 37 restantes. | Portal | 🟢 | ✅ **Implementado (18/07)** |
| SP-68 | **Achado ao montar o handoff pro BANCO (18/07/2026, antes mesmo de receber `fato_v193_MERGED.db`): `ESTADO_ATUAL.md` fica defasado da versão real do `.db` — recorrência do SP-41.** Confirmado de novo nesta sincronização: o `ESTADO_ATUAL.md` recebido junto com `fato_v193_MERGED.db` descreve "v194" (menciona `company_curso_resolucao`, 55 linhas, 124 tabelas) — mas o `.db` recebido é v193 de verdade (123 tabelas, `company_curso_resolucao` não existe, confirmado por query). O documento descreve um estado à frente do arquivo que foi de fato entregue | Dados | 🟡 | 🟡 **Regenerado do lado SITE (19/07), a pedido explícito do usuário** — como `ESTADO_ATUAL.md` normalmente é responsabilidade do BANCO (`_LEIA_PRIMEIRO.md`), regenerá-lo é uma exceção, não a regra daqui pra frente. Todo número no documento novo foi verificado por query direta contra `fato_v193.db` — nenhum copiado do documento anterior sem checar (2 números divergiram: `companies` com UF 754 vs 782 citado antes, `sources` com UF 1.528 vs 1.719). Pedido original continua de pé: confirmar se existe um `fato_v194.db` que não foi anexado, ou se o documento anterior foi gerado antes do patch v194 ser persistido no arquivo exportado |
| SP-69 | **Pedido do usuário (19/07/2026): trocar a fonte (e, na prática, todas as dependências de CDN) por algo que não impeça rodar/testar o portal localmente.** Descoberta ao investigar: não era só a fonte (`fonts.googleapis.com`) — React/ReactDOM/Babel Standalone vinham de `unpkg.com` e o motor SQLite/WASM (`sql.js-fts5`) vinha de `cdn.jsdelivr.net`. As 3 CDNs eram inacessíveis no ambiente da sessão de IA que mantém o projeto, impedindo inclusive tirar print de tela pra validação visual (o que already tinha custado uma rodada inteira de "não consigo confirmar visualmente" numa sessão anterior) | Portal | 🟢 | ✅ **Implementado (19/07)** — as 4 dependências (React 18.3.1, ReactDOM 18.3.1, Babel Standalone 8.0.3, sql.js-fts5 1.4.0, IBM Plex Sans/Mono pesos 400-700 subsets latin+latin-ext) baixadas via npm (registro acessível, ao contrário das CDNs) e vendorizadas em `portal/vendor/`. Hashes SRI do React/Babel conferidos byte a byte contra o que já estava documentado no `index.html` — idênticos, zero risco de mudança de comportamento. Site testado de ponta a ponta com servidor local (`python3 -m http.server`) + Chromium headless — 0 erros de console/página nas 12 abas principais, prints gerados e entregues pro usuário analisar. Ver `_DECISIONS.md` D121 |
| SP-70 | **Achado por revisão externa (19/07/2026), verificado e confirmado pela sessão SITE:** `_LEIA_PRIMEIRO.md` (o protocolo em si) referencia tabelas legadas/congeladas em 2 lugares críticos, não as versões vivas. **Regra 1** manda checar `db_versions` (`SELECT ... FROM db_versions ORDER BY version DESC`) — essa tabela está parada em v80, a viva é `db_versions_v2` (MAX=193, confirmado). **Regra 7** manda checar `gaps` pra cruzar com `_BACKLOG.md` — essa tabela tem 33 linhas "abertas", mas é a legada (129 linhas, id máx 216); a viva é `gaps_v2` (155 linhas, id máx 90062), que tem só **2** linhas realmente abertas (90041, 90048 — ambas já rastreadas). Qualquer sessão que siga o protocolo ao pé da letra, sem saber da existência das tabelas `_v2`, seria enganada nos dois pontos mais críticos do próprio protocolo (checagem de versão e checagem cruzada de gaps) | Dados | 🔴 | ⏳ **Reconfirmado ainda aberto (23/07, fato_v237)** — `db_versions` MAX ainda 80, tabela `gaps` legada ainda com 34 linhas "abertas" (era 33, cresceu 1). Nenhuma mudança em `_LEIA_PRIMEIRO.md` detectada. Continua pedido formal, alta prioridade — não é um bug de dado, é um bug no próprio texto do protocolo, responsabilidade do BANCO editar (Regra 9) — SITE não vai editar esse documento sem autorização explícita, mesmo achando o bug de novo. Sugestão inalterada: atualizar as Regras 1 e 7 pra referenciar `db_versions_v2`/`gaps_v2` explicitamente |
| SP-71 | **Achado por revisão externa (19/07/2026), corrigido pela sessão SITE:** comentário em `loadMercadoEmpresas.js` linha 8 dizia "442 empresas (pós-fusões Sprint 9/14 + D70-DB)" — desatualizado, a contagem real de `tipo_entidade='empresa'` em v193 é 840 | Portal | 🟢 | ✅ **Corrigido (19/07)** — comentário atualizado com a contagem real e nota de quando/por que ficou desatualizado |
| SP-72 | **Achado e resolvido pelo próprio BANCO (v201-v202, dentro da entrega v237, não pedido pelo SITE):** gap 90063 — 32 linhas órfãs em `dm_rede_empresas_centralidade`/`_comunidades` (código de setor e título de seção tratados como `company_id`, mesma família de erro do gap 90061 mas nunca corrigida nessas 2 tabelas especificamente). Removidas as 32 linhas; tabelas recriadas com FK real (`company_id REFERENCES companies(id)`) — próximo recálculo que reintroduzir `company_id` inválido falha com erro de integridade, não mais um JOIN vazio sem aviso silencioso | Dados | 🟢 | ✅ **Resolvido pelo BANCO, confirmado pela sessão SITE (23/07)** — `RedeDeEmpresas.jsx`/`loadMercadoEmpresas.js` (SP-58) não precisaram de nenhuma mudança, o novo FK não quebra nada do lado portal (schema de colunas idêntico) |
| SP-73 | **Achado ao fechar a migração para D1/Cloudflare Worker (22/07/2026, sessão MIGRAÇÃO — papel novo, fora do fluxo BANCO↔SITE, ver `worker/PROTOCOLO_BANCO_SITE_MIGRACAO.md`) — banco ganhou algo novo que o site não usa ainda, não é bug.** Todas as 85 tabelas que `portal/data/load*.js` usa foram portadas para um Cloudflare Worker com D1 (Opção C do `VIABILIDADE_PUBLICACAO_E_TRANSPARENCIA.md`, Parte 1), testado de ponta a ponta contra `fato_v226_reconciliado.db` — 16 endpoints REST espelhando byte a byte a saída dos 16 loaders/bundles atuais (`loadTrails`→`/api/trilhas` ... `loadPanoramaUF`→`/api/panorama-uf`; mapa completo em `worker/HANDOFF_PARA_SITE_SP72.md`). Testado reconstruindo um banco só a partir do `schema.sql`+`data.sql` exportados (o que o D1 recebe de fato) e rodando os 16 loaders originais contra ele via shim que imita a API do D1 — resultado idêntico ao teste contra o `.db` real. Nenhum arquivo em `portal/` foi tocado (Regra 0.1 do novo protocolo: papel MIGRAÇÃO não edita `App.jsx`/`db.js`, só sugere). | Portal (infra) | 🟡 | ⏳ **Pendente — decisão de produto do lado SITE, não correção.** Adoção é opcional (Opção A, site 100% estático com banco público, segue aceita explicitamente na Parte 1.4 do doc de viabilidade) e pode ser feita endpoint por endpoint, no ritmo que fizer sentido, ou nunca. Pré-requisito antes de qualquer troca: publicar o worker (`worker/README.md`, 4 comandos, exige conta Cloudflare — não executado ainda). 3 bugs reais encontrados e corrigidos no processo de exportação, registrados em `worker/PROTOCOLO_BANCO_SITE_MIGRACAO.md` Regra 5. |
| SP-74 | **Achado ao portar `loadPanoramaUF()` pro Worker/D1 (22/07/2026, sessão MIGRAÇÃO) — risco pro `ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md`/`PLANO_ENXUGAMENTO_ESTRUTURA.md`, não bug em produção hoje.** O comentário em `loadMercadoEmpresas.js` (linha ~148) classifica `dm_importacoes_maquinas` como "bridge/auditoria interna... já resumida dentro de `dm_colapso_silencioso` — não exposta diretamente". Isso é verdade pra `loadSinaisMercado()`, mas incompleto: a tabela também é base direta (via `FROM`/`JOIN`) de **2 das 4 VIEWs** que `loadPanoramaUF()` consulta — `vw_indicador_demanda` e `vw_mapa_competencias_predito`. Nenhum `loadX.js` cita `dm_importacoes_maquinas` nominalmente (só as VIEWs, na definição SQL delas, que não aparece em nenhum arquivo `.js`) — uma classificação de "tabela usada" feita por grep/busca textual em `portal/data/*.js` (o método mais óbvio pra um estudo de tabelas não-usadas) marcaria essa tabela como candidata a remoção. Se removida, `vw_indicador_demanda`/`vw_mapa_competencias_predito` quebram (ou retornam vazio, dependendo de como o SQLite trata `FROM` de tabela inexistente numa VIEW) — silenciosamente, porque o SITE hoje roda `sql.js` contra o `.db` completo e nunca exerceria esse caminho de falha em teste normal, só apareceria se/quando alguém de fato removesse a tabela numa rodada de enxugamento. Achado ao inspecionar o SQL de definição das 4 VIEWs pra recriá-las no D1 (`CREATE VIEW`) — não estava em nenhum comentário existente. | Dados | 🟡 | ⏳ **Pedido formal para a sessão BANCO** — se/quando o `ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md`/`PLANO_ENXUGAMENTO_ESTRUTURA.md` for executado, checar dependência de VIEW (não só de `loadX.js`) antes de eliminar qualquer tabela — `dm_importacoes_maquinas` especificamente precisa ficar de fora de qualquer lista de remoção enquanto as 2 VIEWs existirem. Sugestão: `SELECT name, sql FROM sqlite_master WHERE type='view'` e grep manual do nome de cada tabela candidata dentro do `sql` de cada VIEW, além do grep em `portal/data/*.js` que provavelmente já é o método usado. Não é urgente — nenhuma remoção está em andamento até onde eu sei, é só o tipo de coisa que precisa estar registrado antes de alguém confiar só na busca textual em `.js`. |

### Sincronização SITE×BANCO (30/06/2026)

Esta sessão consolidou o pacote `sprint17` (sessão SITE, última sincronia em v65) com o pacote `v70` (sessão BANCO, 5 versões à frente). Achados:

1. **Colisão de numeração SP-23/SP-24**, mesma categoria do incidente D69-DB (SP-13/14): a sessão SITE e a sessão BANCO escolheram os mesmos números pra itens diferentes, sem se comunicarem. Renumerados acima para SP-26/SP-27 (próximos livres confirmados na tabela real, não por memória).
2. **Pedido formal SP-24 original (agora SP-27) nunca foi visto pela sessão BANCO** — confirmado por busca textual: nenhuma menção a `iedu` nos documentos do v70 é posterior a 24/06 (todas históricas, de sprints anteriores). Os 3 arquivos de extração (`extracao_atlas_pe_ps_pd.json`, `extracao_cnct_justificativa.json`, `extracao_cnct_fundamentos_corrigido.json`) e `PLANO_ELIMINACAO_IEDU.md` foram copiados de volta pra raiz do projeto neste pacote sincronizado, para a próxima sessão BANCO aplicar (itens 1-4 já validados e prontos pra carregar, conforme descrito em SP-27).
3. **Checagem de schema (Regra 1) rodada**: 0 tabelas que `App.jsx` espera estão faltando em `fato_v70.db`. `micro_atlas_pdf` (o incidente original da Regra 0) confirmado intacto — 78/99 cursos com link, idêntico ao v55.
4. **`portal/db.js` atualizado** (`DB_PATH`: `fato_v55.db` → `fato_v70.db`) — exceção de 1 linha permitida pela Regra 2.4 sem pedido formal.

**Ativos: 18 gaps (4 críticos/relevantes · 14 melhoria)** *(SP-01/02/03/06/10/11/13/14/18/20 fechados; SP-04 fechado formalmente sem solução; EXP-07 fechado parcialmente, regressão corrigida na Sprint 13; SP-12 aberto na Sprint 13, parcial desde Sprint 15; SP-19 parcial desde 27/06; SP-15/16/17/21/22/23/24/25 abertos entre 20-27/06)*
**Resolvidos nos Sprints 2–4 e 6–14: 7 de 10 herdados do v4.0, mais 5 gaps críticos novos identificados e fechados nas próprias sessões em que foram achados (SP-06, SP-10, SP-11, SP-13, SP-14), mais 1 fechamento formal de item sem solução (SP-04), mais EXP-07 (parcial)**

*Última revisão: 21/06/2026 · v5.8 — Reconciliação de três linhas divergentes (sessão BANCO, v61): a linha "Sprint 14" (sessão SITE, SP-13/14) e a linha de auditoria cruzada `gaps`×documentação (sessão BANCO, originalmente numerada SP-13 a SP-17, RENUMERADA para SP-15 a SP-19 para não colidir com a numeração já usada pela Sprint 14). Ver D68-DB em `_DECISIONS.md` para o relato completo da colisão e como foi resolvida. SP-08 corrigido (27→23) nesta mesma reconciliação.

*Última revisão: 20/06/2026 · v5.6 — Sprint 13 reconciliou `fato_v33.db`→`fato_v55.db` depois de identificar que duas sessões paralelas (portal/Sprint 12 vs. dados/auditoria) geraram bancos incompatíveis sem se comunicarem (D62-DB/D63-DB em `_DECISIONS.md`). EXP-07 (`micro_atlas_pdf`) tinha regredido no v55 e foi restaurado. Abriu-se SP-12 para as 35 tabelas novas do v55 (`dm_*`, `cbo_canonical`, `normas_fato` etc.) ainda sem UI. **Sprint 14** (mesmo dia, sessão consciente de que a auditoria continua em andamento) descobriu que a reconciliação da Sprint 13 cobriu só o schema/coluna — os 3 pares de perfis duplicados das Sprints 11/12 tinham voltado (SP-13) e um novo lote de 72 grupos de empresas duplicadas tinha entrado via importação em lote da própria auditoria (SP-14). Ambos corrigidos, e — por pedido explícito do usuário — 3 novas entradas em `_DECISIONS.md` (D64-DB/D65-DB/D66-DB) documentam exatamente o que a sessão de auditoria precisa fazer para não recriar os mesmos problemas numa próxima regeração do banco. Ver `portal/SPRINT14_EXECUCAO.md`.
