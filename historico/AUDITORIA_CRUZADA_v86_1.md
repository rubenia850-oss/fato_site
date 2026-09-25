# Auditoria Cruzada — Banco fato_v86_1.db vs Documentação v86

> Verificação direta por query em 2026-06-29.
> O conteúdo do documento colado (CHANGELOG v86.1 + plano de entidades) foi gerado
> por outra LLM e verificado contra o banco real antes de ser aceito.
> O patch_v86_consolidado.sql foi "modificado antes de rodar" — o banco é a fonte de verdade.

---

## RESUMO: O que foi verificado e o resultado

| Item | Documentado | Real (banco) | Veredicto |
|------|-------------|--------------|-----------|
| `companies` total | 735 | 735 | ✅ correto |
| `sources` | 1.492 | 1.492 | ✅ correto |
| `gaps_v2` total | 98 | 98 | ✅ correto |
| `gaps_v2` ativos | — | 24 | ✅ verificado |
| `gaps_v2` resolvidos | — | 74 | ⚠️ ver divergência 6 |
| `cbo_canonical` inseridos | 18 | 18 | ✅ correto |
| `company_name_variants` | "37" (patch) / "12" (changelog) | **51** | ❌ divergente |
| AVEVA → id | 442 (patch) / 489 (changelog) | **489** | ⚠️ script modificado |
| `company_sectors` ABB | sector_id=5 | sector_id=5 | ✅ correto |
| `gap 90007` registrado | sim | sim | ✅ correto |
| Fusões (dm_log) | 12 (changelog) | 12 (ids 7–18) | ✅ correto |
| IDs removidos | 13 ids | 13 confirmados | ✅ correto |
| FK violations | 0 | 0 | ✅ correto |

---

## DIVERGÊNCIAS ENCONTRADAS

### ⚠️ DIV-1 — company_name_variants: 51 no banco, 37 no SQL, "37" no log

O `db_versions_v2.linhas_inseridas` regista `"company_name_variants": 37`.
O `patch_v86_consolidado.sql` tem 39 VALUES (não 37 — erro de contagem no log).
O banco tem **51 linhas**.

A diferença de **12 variantes extras** corresponde exatamente ao bloco
"Adição de variantes para company_raw pendentes" do CHANGELOG v86.1:
são variantes com o `company_raw` completo (ex: `'CRQ-SP Qualifica (70 cursos gratuitos)'`,
`'Fundacentro (higiene ocupacional, NRs)'`, etc.) que o script modificado adicionou
além do patch SQL base.

**Impacto:** Nenhum em dado — as 12 variantes extras são legítimas e apontam
para IDs corretos. O campo `linhas_inseridas` do v86 está errado (39, não 37;
e o banco tem 51 por causa das 12 adicionadas pelo script Python).

**Ação:** Registrar em `meta_protocolo` que `company_name_variants` tem 51 linhas reais.

---

### ⚠️ DIV-2 — AVEVA aponta para id=489, não id=442 como no patch SQL

O `patch_v86_consolidado.sql` inseria `'AVEVA' → 442` (AVEVA Learning) com
comentário "revisar se deveria ser id=489". O script modificado aplicou a versão
corrigida: `'AVEVA' → 489` (AVEVA ex-Wonderware).

O CHANGELOG v86.1 documenta isso corretamente:
> "AVEVA e AVEVA Group redirecionadas do ID 442 (plataforma de treino)
> para o ID 489 (AVEVA ex-Wonderware)"

**Impacto:** O banco está correto. O SQL do patch arquivado está desatualizado
em relação ao que foi executado.

---

### ⚠️ DIV-3 — gaps_v2 resolvidos: 74 no banco, 43 citados no log

O `db_versions_v2` regista `"gaps_corrigidos": 43`. No banco há 74 resolvidos
(v85 tinha 30 → delta de 44).

Explicação: a condição `impacto LIKE '%Resolvido%' OR impacto LIKE '%Superado%'`
capturou **também os 7 gaps com impacto='Parcialmente Resolvido'** (LIKE casa
o substring 'Resolvido' dentro de 'Parcialmente Resolvido'). Mais o gap 90001
atualizado por UPDATE separado.

Contagem real: **36** (totalmente resolvidos) + **7** (parcialmente resolvidos,
também capturados pelo LIKE) + **1** (90001 via UPDATE separado) = **44** movidos
para `status='resolvido'`. Os 7 "Parcialmente Resolvido" foram marcados como
resolvidos — diferente do que nosso patch v86 recomendou (mantê-los como ativo
com observação). Isso pode ser intencional ou não — verificar com o curador.

**Ação recomendada:** Se os 7 gaps "Parcialmente Resolvido" (ids 111, 112, 113,
116, 165, 172, 195) estão realmente resolvidos, o estado atual está correto.
Se havia pendência residual real, reverter para `status='ativo'` e adicionar
nota explícita de pendência.

---

### ⚠️ DIV-4 — CBO colisão: 4 perfis distintos com cbo_padronizado='3111-05'

Perfis 19 (Técnico em Análises Químicas), 20 (Técnico em Química), 30
(Técnico em Biocombustíveis), 63 (Técnico em Açúcar e Álcool) e os recém
inseridos 98 (Simulação de Processos) e 100 (Metrologia e Calibração)
compartilham o mesmo código `3111-05`.

Os perfis 19, 20 e 63 já tinham `3111-05` antes do v86 — eram pré-existentes.
O patch v86 adicionou perfis 30, 98 e 100 com o mesmo código.
O próprio patch documentou: "98 e 100 ainda compartilham o código 3111-05 com
30... recomenda-se revisão humana futura".

**Impacto:** O campo `cbo_padronizado` em `cbo_canonical` não é UNIQUE — colisão
é aceita pelo schema. Mas JOINs por cbo em relatórios retornarão múltiplos
perfis para o mesmo código, podendo inflar contagens. Flagrado como gap residual.

---

### ❌ DIV-5 — Seção 5 da auditoria ("Possíveis duplicatas") está INCORRETA

O algoritmo da outra LLM gerou centenas de pares de "duplicatas" como:
- "Anglo American Brasil" ↔ "ArcelorMittal Brasil"
- "BASF Brasil" ↔ "Volkswagen do Brasil"

Claramente falsos positivos — o match foi feito por sufixo "Brasil" ou similaridade
de string genérica, sem nenhum critério semântico. **Essa seção NÃO deve ser usada**
para decisões de merge. Nenhuma fusão baseada nessa seção deve ser executada sem
validação humana caso a caso.

As fusões que foram de fato executadas (12 casos em `dm_empresas_duplicatas_log`)
são legítimas e verificadas — duplicatas reais identificadas manualmente.

---

### ✅ DIV-6 — Fusões: 12 registros, 13 IDs removidos — correto

O CHANGELOG v86.1 lista 13 linhas na tabela de fusões, mas diz "12 casos".
A discrepância é porque a fusão "API" removeu **2 IDs** (43 e 9030) em um único
registro de log (id=7, `ids_remover='43,9030'`). Então: 12 operações lógicas = 13
IDs físicos removidos. Correto e confirmado no banco.

---

### ✅ DIV-7 — Plano de entidades separadas: AINDA NÃO EXECUTADO

O plano de criação de tabela `entities` e `categories` descrito no documento
(Seção 2) é apenas um plano — nenhuma dessas tabelas existe no banco v86.1.
A Seção 2 é proposta para versão futura, não changelog do que foi feito.
Confirmado: `CREATE TABLE entities` não existe.

---

## Estado real do banco pós-v86.1

| Objeto | Linhas / Status |
|--------|----------------|
| `companies` | 735 |
| `sources` | 1.492 |
| `gaps_v2` total | 98 |
| `gaps_v2` ativos | 24 |
| `gaps_v2` resolvidos | 74 |
| `cbo_canonical` | 98 linhas |
| `company_name_variants` | **51** (não 37) |
| `company_sectors` | 97 |
| `dm_empresas_duplicatas_log` | 18 entradas (6 antigas + 12 novas) |
| `db_versions_v2` | 86 versões rastreadas |
| `meta_protocolo` | 21 regras |
| Violações de FK | 0 |

---

## Gaps ativos reais (24)

| id | tipo | impacto |
|----|------|---------|
| 93 | `conteudo_faltante` | Muito alto |
| 103 | `conteudo_faltante` | Alto |
| 104 | `conteudo_faltante` | Muito alto |
| 110 | `conteudo_faltante` | Alta |
| 114 | `conteudo_faltante` | Alta |
| 115 | `conteudo_faltante` | Média |
| 117 | `conteudo_faltante` | Média |
| 118 | `conteudo_faltante` | Média |
| 123 | `conteudo_faltante` | Média |
| 124 | `conteudo_faltante` | Baixa |
| 125–132 | `duplicidade` (8×) | sobreposição Atlas/Guia |
| 182 | `conteudo_faltante` | Médio |
| 197 | `lacuna_join` | dm_qualidade_preditiva |
| 209 | `conteudo_faltante` | Pendente — pesquisa parcial |
| 90002 | `recomendacao` | score_oportunidade sem fórmula |
| 90006 | `mapeamento_incompleto` | Rebuild source_cnct_profiles setores 4–12 |
| 90007 | `mapeamento_incompleto` | 48 empresas sem sector_code |

---

## O que NÃO deve ser feito com base nessa documentação

1. **Não executar merges baseados na Seção 5 da auditoria** — algoritmo bugado.
2. **Não assumir que `company_name_variants` tem 37 linhas** — tem 51.
3. **Não reutilizar `patch_v86_consolidado.sql` como referência** — o SQL arquivado
   difere do que foi executado (AVEVA=442 vs 489 executado; 39 variantes no SQL
   vs 51 no banco).
4. **Não usar o CHANGELOG v86.1 colado como fonte de verdade** — é gerado por
   outra LLM sobre estado inferido, não sobre execução verificada.

## Pendências para próxima sessão

| Prioridade | Item |
|------------|------|
| 🔴 Decisão | Verificar se ids 111,112,113,116,165,172,195 (status=resolvido) realmente foram concluídos ou têm pendência residual |
| 🔴 Alta | gap 90006 — rebuild source_cnct_profiles setores 4–12 |
| 🟡 Média | gap 90007 — mapear sector_code para 48 empresas listadas |
| 🟡 Média | CBO colisão 3111-05 (6 perfis) — revisão humana |
| 🟡 Média | db_versions_v2 v86 tem company_name_variants=37 (errado, real=51) — sem correção retroativa, registrar em meta_protocolo |
| 🟡 Média | patch_v86_consolidado.sql arquivado difere do executado — arquivar versão "as-executed" |
| 🟢 Baixa | Plano de tabela `entities` / `categories` — executar quando aprovado |
