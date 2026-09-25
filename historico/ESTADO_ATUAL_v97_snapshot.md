# ESTADO ATUAL — snapshot histórico (base fato_v94.db, última atualização v97, 30/06/2026)

> **Nota (16/07/2026):** este arquivo é o snapshot de `ESTADO_ATUAL.md` na sua versão anterior à
> regeneração da sessão SITE. Movido para `historico/` porque as contagens abaixo (companies=733,
> gaps_v2=103 etc.) não refletem mais `fato_v168.db`. Mantido como registro histórico das
> inconsistências, lições e regras de não-uso documentadas até então — as seções 2, 4 e 6 continuam
> válidas como lição de processo, mesmo com números desatualizados. Ver `ESTADO_ATUAL.md` (raiz) para
> o estado atual.

---

## 1. Contagens verificadas (histórico, v97)

| Tabela / Objeto | Linhas | Observação |
|---|---|---|
| `companies` | 733 | −12 fusões +2 novas em v86 |
| `sources` | 1.492 | inalterado desde v85 |
| `gaps` (original) | 129 | intacto, somente leitura |
| `gaps_v2` | 103 | 33 ativos / 70 resolvidos — +4 (90009–90012, fila Delta_v86_v94.html) em v97, vw_buscador_completo (90008) mantida intencionalmente |
| `db_versions_v2` | 97 versões | v95 reconstrução v87–v94; v96 remoção `scp_backup_v87`; v97 fila de gaps do Delta_v86_v94.html |
| `cbo_canonical` | 98 | +18 inseridos em v86 |
| `company_name_variants` | 51 | nova tabela v86 (log diz 37 — errado, ver §2.2) |
| `company_sectors` | 97 | +1 ABB (sector_id=5) em v86 |
| `dm_mercado_trabalho` | 1.152 | −306 duplicatas em v84 |
| `dm_completude_fontes` | 929 | −47 órfãos em v82 |
| `dm_empresas_duplicatas_log` | 18 | 6 pré-v86 + 12 fusões de v86 |
| `industry_to_sector_map` | 14 | criada v85, 2 índices |
| `source_cnct_profiles` | 9.451 | rebuild completo v88+v89: setores 4–12 todos corrigidos |
| `vw_buscador_v2` | 11.055 linhas | |
| `vw_trails_ativas` | 85 trilhas | |
| `sectors` colunas | 3 (id, name, type) | `code` removida em v82 |
| `meta_protocolo` | 23 regras | +1 db_versions_v2_registro_obrigatorio (reconstrução v87–v94) |
| Violações de FK | 0 | |

---

## 2. Inconsistências conhecidas e não corrigidas (histórico)

### 2.1 ✅ 7 gaps revertidos para `ativo` — RESOLVIDO nesta sessão
IDs: 111, 112, 113, 116, 165, 172, 195.
Inconsistência detectada em v86 (LIKE '%Resolvido%' capturou 'Parcialmente Resolvido')
foi resolvida em v87: todos os 7 revertidos para `status='ativo'` com `observacao`
explícita registrando o motivo e referência ao sprint de backlog correspondente.
Contagens em v87: 31 ativos / 67 resolvidos (contagem em v97: 29 ativos / 69 resolvidos, pós gaps 90006/90007 resolvidos em v88–v90).

### 2.2 ⚠️ `db_versions_v2` v86: `company_name_variants=37` (real: 51)
O log registrou 37, mas o banco tem 51. Erro de contagem no momento do INSERT
do registro de versão — o campo `linhas_inseridas` foi preenchido pelo SQL
(39 variantes), antes do script Python adicionar as 12 extras.
Sem correção retroativa (política do projeto). Registrado em `meta_protocolo`.

### 2.3 ⚠️ CBO 3111-05 compartilhado por 6 perfis
Perfis 19, 20, 30, 63, 98 e 100 compartilham `cbo_padronizado='3111-05'`.
Perfis 19/20/63 eram pré-existentes. Perfis 30/98/100 inseridos em v86.
O schema não tem UNIQUE nessa coluna — não é erro técnico, mas JOINs por CBO
retornam múltiplos perfis para o mesmo código. Requer revisão editorial.

### 2.4 ⚠️ `patch_v86_consolidado.sql` arquivado ≠ script executado
Dois pontos divergem:
- AVEVA: SQL tinha `→ id=442`, executado foi `→ id=489`
- Variantes: SQL tinha 39, executado teve 51 (12 a mais via Python)

O SQL arquivado não é o "as-executed". Para rastreabilidade futura, tratar o banco
como fonte de verdade e o changelog como documentação do que de fato ocorreu.

### 2.5 ⚠️ `vw_buscador_v2` ausente em `tabelas_criadas` do v81
Campo `db_versions_v2.tabelas_criadas` para v81 lista apenas `["db_versions_v2","gaps_v2"]`.
A view `vw_buscador_v2`, criada no mesmo patch, não consta. Sem correção retroativa.

### 2.6 ✅ 8 views sem documentação (criadas entre v68–v80) — RESOLVIDO nesta sessão
Estavam presentes em `sqlite_master` mas sem entrada em nenhum changelog:
`vw_buscador_completo`, `vw_guia_companies_clean`, `vw_mapa_calor_preditivo`,
`vw_normas_fato_completa`, `vw_rede_carreiras`, `vw_rede_empresas`,
`vw_trail_index`, `v_all_social_sources`.
Investigadas e documentadas em `SCHEMA.md` §12, com propósito inferido a partir da
definição SQL real (`sqlite_master.sql`) de cada uma. Não eram erro de dado — eram lacuna
de documentação. Mantido aqui como registro histórico de que existiram sem documentação
entre v68 e v86.

### 2.7 ⚠️ Lacuna de changelog: versões v68–v80
`tabelas_criadas` e `tabelas_modificadas` são NULL para v78, v79, v80 em `db_versions_v2`.
Versões v68–v77 não investigadas.

---

## 4. O que estava correto e não precisava de ação (histórico, v97)

- Fusões v86: 12 operações, 13 IDs removidos, 0 órfãos de FK ✅
- 18 CBOs inseridos com schema correto de `cbo_canonical` ✅
- ABB em `company_sectors` com sector_id=5 (Máquinas e Equipamentos) ✅
- gap 90001 resolvido ✅
- gap 90006 resolvido — rebuild completo `source_cnct_profiles` setores 4–12 (v88+v89) ✅
- gap 90007 resolvido — `source_sector_codes` completo (v90) ✅
- `company_name_variants` com 51 variantes legítimas ✅
- AVEVA → id=489 (AVEVA ex-Wonderware) — correto ✅
- Checksums v81–v86 rastreados em `db_versions_v2` ✅
- `meta_protocolo` com 22 regras (regra 22 `foreign_keys_enforcement`, v87) ✅
- 0 violações de FK ✅

---

## 6. Regras de não-uso (lições da auditoria v86.1) — ainda válidas como lição de processo

1. **Não executar merges baseados em algoritmos de similaridade de string sem critério semântico** — geram falsos positivos massivos (ex: "Anglo American Brasil" ↔ "ArcelorMittal Brasil" por sufixo "Brasil").
2. **Não confiar em changelog gerado por outra LLM sem verificação direta no banco** — sempre cruzar contagens por query antes de aceitar.
3. **Não reutilizar SQL de patch arquivado como referência de execução** — o que foi de fato executado pode diferir (ver §2.4). O banco é a fonte de verdade.
4. **Plano de tabelas `entities`/`categories`:** era só plano na época, não existia no banco. Não assumir que foi criado sem checar.
