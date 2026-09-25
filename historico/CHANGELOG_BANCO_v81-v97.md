# CHANGELOG — fato.db

> Histórico técnico acumulativo, uma seção por versão, mais recente no topo.
> Para o snapshot do estado atual, ver `ESTADO_ATUAL.md`.
> Para decisões de processo/sessão (não-técnicas), ver `HISTORICO_SESSOES.md`.

---

## v97 — 2026-06-30

**Tipo:** Correção de decisão + ingestão de fila de gaps do relatório externo (Delta_v86_v94.html)

### `vw_buscador_completo` — decisão revertida (confirmação do responsável)

O responsável confirmou que `vw_buscador_completo` **está em uso ativo pelo portal**.
A hipótese inicial desta sessão (possível redundância com `vw_buscador_v2`) não se
confirmou. As duas views coexistem por motivo legítimo: `vw_buscador_v2` é a view
"sem fanout" (1 linha = 1 fonte + 1 perfil, usada em busca/listagem); `vw_buscador_completo`
é o join largo com fanout (source→trilha→perfil→CBO→salário→oportunidade→roteiro,
11.869 linhas), consumido em outro ponto do portal que precisa dessas colunas adicionais.
`gaps_v2` id=90008 reclassificado de "candidata a remoção" para "documentar a distinção
em `SCHEMA.md`" (impacto Baixa). **View não removida — decisão correta era mantê-la.**

### 4 gaps importados da fila do relatório `Delta_v86_v94.html`

Cada item foi **verificado por query direta** contra o banco real antes de ser aceito
como gap — nenhum aceito só por estar citado no relatório:

| ID | Achado | Verificação |
|---|---|---|
| 90009 | `dm_rede_empresas_centralidade`: 367 duplicatas | confirmado: 797 linhas / 430 `company_id` distintos |
| 90010 | `cbo_canonical`: 6 perfis sob `3111-05` | confirmado: ids 19,20,62,84,98,100 (profile_id 19,20,63,30,98,100) |
| 90011 | `TRL-SUB-008`: 5 steps residuais sem nome/fonte | confirmado: ids 20190–20193,20196, todos `nome=NULL` e zero `trail_step_sources` — **achado novo**, não coberto pelo escopo da dedup em v84/gap 90004 |
| 90012 | `trails.name`: 14 nomes duplicados | confirmado: 122 linhas / 108 nomes distintos, bloqueia `UNIQUE(name)` futura |

#### Arquivos modificados
- `gaps_v2`: 4 INSERTs (90009–90012) + 1 UPDATE (90008, decisão revertida)
- `ESTADO_ATUAL.md`: contagens atualizadas
- `CHANGELOG.md`: esta entrada

---



**Tipo:** Limpeza de dívida estrutural — tabela de backup esquecida + view legada (avaliada, não removida)

### `scp_backup_v87` removida

Tabela criada em v88 como backup pontual antes de um `DELETE` em `source_cnct_profiles`
(3.085 linhas removidas naquela versão). Confirmado antes de dropar: 0 referências em
qualquer `CREATE` de tabela/view (`sqlite_master`), sem FK declarada, e 6 versões
consecutivas (v89–v94) com `PRAGMA foreign_key_check` limpo desde a criação — o dado
que ela protegia já foi validado repetidas vezes pelo próprio histórico de versões.
3.702 linhas exportadas para CSV externo ao banco antes do `DROP TABLE` (arquivamento,
não descarte).

| Ação | Resultado |
|---|---|
| `scp_backup_v87` | exportada para CSV externo, depois `DROP TABLE` |
| FK violations pós-DROP | 0 |

### `vw_buscador_completo` — avaliada, NÃO removida

Segunda candidata a dívida estrutural: view com 11.869 linhas, possivelmente uma
versão anterior/redundante de `vw_buscador_v2` (criada v81 especificamente para
eliminar fanout — ver `vw_buscador_v2` em `SCHEMA.md`). O próprio `SCHEMA.md` já
descrevia a relação com incerteza ("provavelmente uma versão anterior ou alternativa
de uso interno/depuração").

**Decisão: não remover nesta versão.** O projeto tem regra própria desde v56/v57
(regressão de `micro_atlas_pdf`) de nunca remover view/coluna que o portal possa
consumir sem `grep` real contra `portal/db.js` + `portal/App.jsx` — código indisponível
nesta sessão. Registrado como `gaps_v2` id=90008 (tipo `recomendacao`) em vez de
assumir redundância sem confirmação.

#### Arquivos modificados
- `scp_backup_v87`: tabela removida (3.702 linhas arquivadas em CSV externo antes do DROP)
- `gaps_v2`: 1 INSERT (id=90008, `vw_buscador_completo` pendente de confirmação via grep do portal)
- `ESTADO_ATUAL.md`: contagens atualizadas, novo gap em §3
- `CHANGELOG.md`: esta entrada

---



**Tipo:** Correção de processo — reconstrução de gap em `db_versions_v2` (auditoria externa)

### Gap v87–v94 reconstruído

`db_versions_v2` (criada v81 para substituir markdown como fonte de verdade de
versionamento) parou de receber registros após v86. As versões v87–v94 — todas
reais, aplicadas e documentadas em `CHANGELOG.md` — nunca foram inseridas na
própria tabela criada para isso. 8 `INSERT`s reconstruídos diretamente a partir
das seções correspondentes de `CHANGELOG.md` (ver `reconstrucao_db_versions_v2_v87_v94.sql`).

| Campo | Observação |
|---|---|
| `applied_at` (v87–v94) | apenas data, sem horário — `CHANGELOG.md` não registra hora para essas versões (diferente de v1–v86) |
| `patch_file` / `checksum` (v87–v94) | `NULL` — correções diretas documentadas em prosa, não patches `.sql` nomeados como v81–v86 |
| `linhas_inseridas` (v91) | `{}` — versão de investigação pura, sem alteração de dado (gap 90002, fórmula `score_oportunidade` não gravada) |

### Causa raiz corrigida (não só o sintoma)

O checklist "PROTOCOLO — COMO ATUALIZAR ESTE ARQUIVO" em `ESTADO_ATUAL.md` listava
`CHANGELOG.md` e `HISTORICO_SESSOES.md` como passos obrigatórios de fechamento de
versão, mas nunca mencionava `db_versions_v2` explicitamente — buraco estrutural no
protocolo, não falha humana pontual repetida 8 vezes. Corrigido:

- `ESTADO_ATUAL.md`: passo 3 do protocolo agora exige INSERT em `db_versions_v2`
  como obrigatório (mesmo para versões só de investigação), com verificação de
  fechamento `SELECT MAX(version) FROM db_versions_v2` = `NN` do `fato_vNN.db`.
- `meta_protocolo` regra 23 (`db_versions_v2_registro_obrigatorio`) criada,
  documentando o achado e a regra.
- `SCHEMA.md`: contagem de `db_versions_v2` corrigida (86 → 94 linhas).

#### Arquivos modificados
- `db_versions_v2`: 8 INSERTs (v87–v94)
- `meta_protocolo`: 1 INSERT (regra 23)
- `ESTADO_ATUAL.md`: protocolo §topo reescrito (passo 3 novo), contagens db_versions_v2/meta_protocolo atualizadas
- `SCHEMA.md`: contagem db_versions_v2 corrigida
- `CHANGELOG.md`: esta entrada

> `auditorias/AUDITORIA_CRUZADA_v86_1.md` é um snapshot histórico do estado em v86
> e não foi editado — as referências a "86 versões" lá dentro descrevem o banco
> naquele momento, não o estado atual.

---



## v94 — 2026-06-29

**Tipo:** Limpeza de dados — empresas fantasma (achado colateral dos gaps 93 e 104)

### Investigação completa das 3 "empresas fantasma" (sufixo `⭐ MUITO ALTO`)

| company_id | Nome | Sources | Veredito |
|---|---|---|---|
| 940 | Spirax Sarco ⭐ MUITO ALTO | 0 | **Fantasma** — duplicata de company_id=36 (registro real) |
| 941 | API — American Petroleum Institute ⭐ MUITO ALTO | 4 | **Legítima** — único registro de API no banco, com conteúdo real |
| 942 | AspenTech ⭐ MUITO ALTO | 0 | **Fantasma** — duplicata de company_id=93/282 (registros reais) |

Mapeamento de referências antes da ação: `gaps_v2`, `gaps` (tabela legada), `dm_rede_empresas_centralidade`,
`dm_rede_empresas_comunidades`. Nenhuma das tabelas com FK declarada para `companies`
(`company_sectors`, `sector_programs`, `company_url_suggestions`, `sector_coverage_matrix`,
`company_institution_links`) referenciava os 3 IDs.

### Ações executadas

| Ação | Detalhe |
|---|---|
| `gaps_v2` id=93 | `company_id` corrigido de 940 → 36 |
| `gaps` (legada) id=93 | `company_id` corrigido de 940 → 36 (consistência, tabela não-operacional) |
| `dm_rede_empresas_centralidade` | 4 linhas órfãs removidas (940, 942) |
| `dm_rede_empresas_comunidades` | 2 linhas órfãs removidas (940, 942) |
| `companies` | 2 linhas removidas (940, 942) — total 735 → **733** |
| `companies` id=941 | renomeada: `'API — American Petroleum Institute ⭐ MUITO ALTO'` → `'API — American Petroleum Institute'`; slug atualizado |
| `dm_rede_empresas_*` (941) | nome decorado limpo em 3 linhas |
| FK violations | 0 |

### Nota residual (não tratada nesta versão)

`dm_rede_empresas_centralidade` tem **linhas duplicadas** para o mesmo `company_id` (ex: 941 aparece
em múltiplas linhas com classificações diferentes) — problema de deduplicação separado, fora do
escopo desta limpeza pontual. Candidato a gap futuro se afetar relatórios de rede.

#### Arquivos modificados
- `gaps_v2`: company_id corrigido (id=93); observacao atualizada (id=93, 104)
- `gaps`: company_id corrigido (id=93)
- `dm_rede_empresas_centralidade`: 4 DELETEs + 2 UPDATEs de nome
- `dm_rede_empresas_comunidades`: 2 DELETEs + 1 UPDATE de nome
- `companies`: 2 DELETEs (940, 942) + 1 UPDATE (941)
- `ESTADO_ATUAL.md`: contagem de companies atualizada
- `CHANGELOG.md`: esta entrada


---

## v93 — 2026-06-29

**Tipo:** Correção parcial de dados — gap 104 (AspenTech / trilha Atlas de simulação)

### Vínculo Atlas corrigido, vínculo de Bloco pendente

AspenTech tem 2 registros reais: `company_id=93` (referenciado pelo gap, 1 source) e
`company_id=282` (mais completo: guia + 2 technical, uma já com `sector_code='SIM'`).

**Achado:** `TRL-SIM-027` (Trilha do Profissional em Simulação de Processos Industriais)
existia com **zero fontes vinculadas** — match exato com `sector_code='SIM'`.

| Ação | Resultado |
|---|---|
| `ps-0021` (company 93) → `TRL-SIM-027` | inserido em `source_atlas_trails` |
| `p2-SIM-001` (company 282, sector_code=SIM) → `TRL-SIM-027` | inserido em `source_atlas_trails` |
| FK violations | 0 |

**Pendência não resolvida:** o `bloco_guia` original do gap ("Bloco 10 — Tecnologia") **não existe**
em nenhuma tabela de referência (`source_guia_blocks` ou `sector_fato_blocos`) — os blocos reais
vão de 1 a 18 com nomenclatura diferente. Não foi inventado um nome de bloco para evitar repetir
o problema já corrigido em sessões anteriores (taxonomia inconsistente). Decisão do curador necessária.

**gap 104:** `status` permanece `ativo`, `impacto` atualizado para `Parcialmente Resolvido`
(mesmo padrão usado para os 7 gaps revertidos em v87 — não marcar como concluído com pendência real).

**Padrão recorrente confirmado:** `company_id=942` (AspenTech ⭐ MUITO ALTO) é a 3ª "empresa fantasma"
do mesmo tipo encontrado no gap 93 (Spirax Sarco) — ainda não tratada.

#### Arquivos modificados
- `source_atlas_trails`: 2 INSERTs (ps-0021, p2-SIM-001 → TRL-SIM-027)
- `gaps_v2` id=104: impacto→Parcialmente Resolvido, observacao detalhada (status inalterado: ativo)
- `ESTADO_ATUAL.md`: nota atualizada em §3
- `CHANGELOG.md`: esta entrada


---

## v92 — 2026-06-29

**Tipo:** Correção de dados — gap 93 (Spirax Sarco / trilha Atlas de vapor)

### Vínculos faltantes corrigidos

Spirax Sarco (company_id=36, registro correto) já tinha 3 sources cadastradas
(t06, g0033, train-s3s4-10), mas nenhuma vinculada à trilha Atlas específica de vapor
nem a um bloco do Guia.

**Achado:** `TRL-VAP-029` (Trilha do Profissional em Sistemas de Vapor e Geração Térmica)
existia no catálogo `atlas_trails` com **zero fontes vinculadas** — Spirax Sarco
(60+ módulos gratuitos de engenharia de vapor) é o candidato natural.

| Ação | Resultado |
|---|---|
| `t06` → `TRL-VAP-029` | inserido em `source_atlas_trails` |
| `g0033` → `Bloco 2 — Válvulas, Bombas e Equipamentos Rotativos` | inserido em `source_guia_blocks` (relevancia=media) |
| FK violations | 0 |

**gap 93:** `status='resolvido'`, `impacto='Resolvido'`.

### Achado colateral — padrão de "empresas fantasma"

3 registros em `companies` com sufixo `⭐ MUITO ALTO` no nome, sem sources, sem
`company_sectors`, aparentemente criados como marcadores de prioridade por um patch
anterior, não como empresas reais:

| company_id | Nome | Gap relacionado |
|---|---|---|
| 940 | Spirax Sarco ⭐ MUITO ALTO | 93 (resolvido nesta versão, no registro correto id=36) |
| 941 | API — American Petroleum Institute ⭐ MUITO ALTO | 100 (já resolvido em versão anterior) |
| 942 | AspenTech ⭐ MUITO ALTO | provável gap 104 (ainda ativo) |

Nenhum desses 3 registros foi removido — fora do escopo deste gap. Recomenda-se avaliação
de limpeza em sessão futura, idealmente ao resolver o gap 104 (AspenTech), para tratar o
padrão de uma vez.

#### Arquivos modificados
- `source_atlas_trails`: 1 INSERT (t06 → TRL-VAP-029)
- `source_guia_blocks`: 1 INSERT (g0033 → Bloco 2)
- `gaps_v2` id=93: status→resolvido, impacto→Resolvido
- `ESTADO_ATUAL.md`: contagens atualizadas, gap 93 removido de §3
- `CHANGELOG.md`: esta entrada


---

## v91 — 2026-06-29

**Tipo:** Investigação (sem alteração de dados) — gap 90002

### Tentativa de reconstrução de `score_oportunidade`

**Método:** correlação de Pearson + regressão linear múltipla sobre `dm_oportunidade_estrategica` (1.152 linhas).

**Achado qualitativo:** `total_fontes` (r=-0,80) e `taxa_cobertura` (r=-0,57) correlacionam
negativamente com o score; `salario_medio` correlaciona positivamente (r=+0,38). Interpretação:
o score parece premiar salário alto combinado com baixa cobertura/concorrência.

**Caso especial (total_fontes=0):** score ≈ salario_medio/1000, com prêmio adicional não-constante
(2,1% a 8,9%, crescente com o salário) — não isolável em fórmula fechada simples com os dados
disponíveis.

**Melhor modelo testado:** regressão linear (salario_medio + log(total_fontes)) → R²=0,92;
84,8% das linhas com erro ≤0,5 pontos; 1,7% com erro >1,0 ponto.

**Decisão:** NÃO gravar como fórmula documentada. R²=0,92 é uma aproximação estatística, não a
fórmula original — usá-la para recálculo arriscaria quebrar comparabilidade histórica nos casos
de maior erro residual. Gap 90002 **permanece ativo**, agora com a análise registrada na
`observacao` para acelerar uma futura tentativa (ou confirmação externa do autor original).

#### Arquivos modificados
- `gaps_v2` id=90002: observacao atualizada (status inalterado: ativo)
- `ESTADO_ATUAL.md`: nota da análise na tabela §3
- `CHANGELOG.md`: esta entrada


---

## v90 — 2026-06-29

**Tipo:** Correção de dados — gap 90007 (source_sector_codes)

### Populate `source_sector_codes` via bridge

**Contexto:** T4 (v88+v89) já havia corrigido `source_cnct_profiles` para todos os setores.
Gap 90007 afetava a tabela auxiliar `source_sector_codes`, usada pela view
`vw_guia_companies_clean` para popular o campo `bloco_ref`. Sem a correção, `bloco_ref`
ficava NULL para 34 sources (layer=sector/social) sem entrada na tabela.

| Operação | Quantidade |
|---|---|
| Entradas inseridas em `source_sector_codes` | +154 |
| Confiança media | 96 |
| Confiança baixa | 58 |
| Sources cobertas | 691 → **725** |
| FK violations | 0 |
| Vínculos novos em `source_cnct_profiles` | 0 (já cobertos pelo T4) |

**Lacuna residual:** 22 sources sem `company_sectors` — sem bridge disponível, lacuna estrutural.

**gap 90007:** `status='resolvido'`, `impacto='Resolvido'`.

#### Arquivos modificados
- `source_sector_codes`: 154 INSERTs
- `gaps_v2` id=90007: status→resolvido, impacto→Resolvido
- `ESTADO_ATUAL.md`: gap 90007 removido de §3 e §5
- `CHANGELOG.md`: esta entrada


---

## v89 — 2026-06-29

**Tipo:** Correção de dados — rebuild source_cnct_profiles fase 2 (gap 90006 encerrado)

### T4 fase 2 — setores 4, 8, 9, 10, 12 (confiança=baixa, aceita pelo curador)

| industry_sector | Setor | Vínculos inseridos |
|---|---|---|
| 4 | Papel e Celulose | 1.609 |
| 8 | Alimentos e Bebidas | 558 |
| 9 | Construção Civil | 680 |
| 10 | Têxtil, Calçados e Couro | 120 |
| 12 | Papel e Embalagens | 1.406 |
| **Total** | | **3.356** |

| Métrica | Antes (v88) | Depois (v89) |
|---|---|---|
| `source_cnct_profiles` | 6.095 | **9.451** |
| `vw_buscador_v2` | 7.865 | **11.055** |
| Violações de FK | 0 | 0 |

**gap 90006**: `status='resolvido'`, `impacto='Resolvido'`.
Rebuild completo: −3.085 errados (v88) +1.377 alta/media (v88) +3.356 baixa (v89).

#### Arquivos modificados
- `source_cnct_profiles`: 3.356 INSERTs
- `gaps_v2` id=90006: status→resolvido, impacto→Resolvido
- `ESTADO_ATUAL.md`: contagens atualizadas, gap 90006 removido de §3 e §5
- `CHANGELOG.md`: esta entrada


---

## v88 — 2026-06-29

**Tipo:** Correção de dados — rebuild de vínculos (gap 90006)
**Banco:** fato_v87.db → fato_v88.db

### T4 — Rebuild `source_cnct_profiles` setores 4–12

#### Causa raiz (gap 90006)
O join histórico de v77 usou `company_sectors.sector_id` diretamente contra
`sector_to_sector_codes.sector_id`, cruzando dois espaços de ID com nomes distintos
a partir do setor 4. Exemplos: BASF (Química, industry_sector=5) recebia codes de
`sectors.id=5` (Máquinas); Suzano (Papel, industry_sector=4) recebia codes de
`sectors.id=4` (Química). Setores 1–3 não foram afetados (nomes coincidiam).

#### Estratégia aplicada
Bridge correta: `industry_to_sector_map` → `sector_to_sector_codes` → `cnct_profile_sector_codes`,
filtrada por `confianca IN ('alta', 'media')`.

#### Diagnóstico pré-T4

| Métrica | Valor |
|---|---|
| Vínculos errados (escopo) | 3.702 (backup; 3.085 rowids únicos — Dexco/Smurfit multi-setor geraram duplicatas no JOIN) |
| Empresas afetadas | 34 |
| Novos vínculos possíveis (alta+media) | 684 (diagnóstico com vínculos errados presentes) |
| Novos vínculos possíveis (incluindo baixa) | 5.506 |

#### Resultado T4

| Operação | Quantidade |
|---|---|
| Backup criado (`scp_backup_v87`) | 3.702 linhas |
| DELETE (rowids únicos removidos) | 3.085 |
| INSERT (alta+media) | 1.377 ¹ |
| Violações de FK | 0 |
| `source_cnct_profiles` antes → depois | 7.803 → **6.095** (−1.708) |
| `vw_buscador_v2` antes → depois | 9.312 → **7.865** |

¹ Inseridos foram 1.377 (vs previsão 684) porque o diagnóstico rodou com os vínculos
errados ainda presentes — o `NOT EXISTS` filtrava combinações que já existiam (erradas).
Após o DELETE, o espaço ficou limpo e todas as combinações válidas foram inseridas.

#### Setores corrigidos vs pendentes

| industry_sector | Setor | Confiança bridge | Vínculos inseridos | Status |
|---|---|---|---|---|
| 5 | Química | media | 270 | ✅ corrigido |
| 6 | Máquinas e Equipamentos | media | 704 | ✅ corrigido |
| 7 | Automotivo | media | 378 | ✅ corrigido |
| 11 | Montagem Industrial | media | 25 | ✅ corrigido |
| 4 | Papel e Celulose | **baixa** | 0 | ⏳ aguarda decisão |
| 8 | Alimentos e Bebidas | **baixa** | 0 | ⏳ aguarda decisão |
| 9 | Construção Civil | **baixa** | 0 | ⏳ aguarda decisão |
| 10 | Têxtil, Calçados e Couro | **baixa** | 0 | ⏳ aguarda decisão |
| 12 | Papel e Embalagens | **baixa** | 0 | ⏳ aguarda decisão |

#### Nota sobre delta backup vs deleted
`scp_backup_v87` tem 3.702 linhas porque o CREATE TABLE usa JOIN contra `company_sectors`,
e Dexco (company_id=27, setores 4 e 9) e Smurfit (company_id=30, setores 4 e 12) têm
duas entradas em `company_sectors` — o JOIN duplica os mesmos rowids de `source_cnct_profiles`.
O DELETE por `rowid` é correto e único (3.085). Diferença: 617 linhas de duplicata no JOIN.

#### Arquivos modificados
- `source_cnct_profiles`: 3.085 DELETEs + 1.377 INSERTs
- `scp_backup_v87`: tabela criada (3.702 linhas de backup)
- `gaps_v2` id=90006: observacao atualizada com resultado T4
- `ESTADO_ATUAL.md`: contagens source_cnct_profiles e vw_buscador_v2 atualizadas; prioridade 90006 rebaixada para 🟡
- `CHANGELOG.md`: esta entrada


---

## v87 — 2026-06-29

**Tipo:** Correção de consistência de dados (gaps_v2)
**Banco:** fato_v86_1.db → fato_v87.db (após empacotamento)

### O que mudou

#### gaps_v2 — 7 registros revertidos de `resolvido` para `ativo`

Causa raiz identificada em v86: o patch usou `WHERE impacto LIKE '%Resolvido%'` para
sincronizar `status='resolvido'`, capturando inadvertidamente 7 registros com
`impacto='Parcialmente Resolvido'` — que não deveriam ser marcados como concluídos.

IDs afetados e motivo da reativação:

| ID | Situação real |
|---|---|
| 111 | DWSIM tem sources em layer=sector/technical, mas **zero em layer=guia**. Integração ao Bloco do Guia pendente. Ref: SP-16 |
| 112 | CRQ-SP Qualifica (company_id=52) idem — [t22] + 4x sector, nenhuma guia. Ref: SP-16 |
| 113 | Fundacentro (company_id=44) idem — [t14] + 3x sector, nenhuma guia. Ref: SP-16 |
| 116 | FIAP Nano Courses (company_id=103) idem — 3x sector, nenhuma guia. Ref: SP-16 |
| 165 | CNCT #6 (Técnico Mecânica de Precisão) — 2 fontes técnicas inseridas, mas faltam CNC avançado PT-BR gratuito e SENAI Jaraguá. Ref: SP-24 |
| 172 | Setor 11 (Montagem Industrial) — 3/8 empresas cobertas; TSE, MIP, Telemont, Enesa, MPE sem source pública. Ref: SP-17 |
| 195 | company_institution_links criada, mas 100 candidatos todos via heurística fraca (ENAP única instituição) — baixa confiança. Ref: SP-19 |

#### Contagens após v87

| | Antes (v86) | Depois (v87) |
|---|---|---|
| gaps_v2 ativos | 24 | **31** |
| gaps_v2 resolvidos | 74 | **67** |
| gaps_v2 total | 98 | 98 |

#### Arquivos modificados nesta versão
- `gaps_v2`: UPDATE em 7 registros (status + observacao)
- `meta_protocolo`: INSERT regra 22 — foreign_keys_enforcement
- `ESTADO_ATUAL.md`: contagens atualizadas, §2.1 e §3 reescritos, §5 ajustado
- `HISTORICO_SESSOES.md`: entrada v87 adicionada
- `CHANGELOG.md`: esta entrada

> Convenção a partir de agora: ao aplicar uma nova versão, adicionar uma seção aqui no topo
> e sobrescrever `ESTADO_ATUAL.md` — nunca criar `CHANGELOG_vNN.md` separado.

---

## 📌 PROTOCOLO — COMO ADICIONAR UMA NOVA VERSÃO

1. Escreva a nova seção **no topo** deste arquivo (acima da versão anterior), mesmo
   formato das seções existentes: patch/checksum, o que foi feito, o que não foi feito
   intencionalmente, validação.
2. Nunca crie um arquivo `CHANGELOG_vNN.md` separado — tudo entra aqui.
3. Depois de escrever a seção, atualize `ESTADO_ATUAL.md` (sobrescrevendo) para refletir
   o novo presente.
4. Se a versão usou um patch SQL arquivado que foi modificado antes de rodar, documente a
   divergência explicitamente (ver exemplo em v86.1, nota de auditoria).

---

## v86.1 — CBOs, fusões de empresas, variantes de nome

**Patch SQL:** `patch_v86_consolidado.sql` (arquivado, difere do executado — ver nota)
**Script complementar:** Python via Pydroid, não arquivado separadamente
**Aplicado sobre:** `fato_v85.db` → resultado: `fato_v86_1.db`
**Data:** 2026-06-29

> **NOTA DE AUDITORIA:** o SQL arquivado difere do executado em dois pontos: (a) variante
> AVEVA→442 no SQL, mas o banco tem →489; (b) o SQL tinha 39 variantes, o script adicionou
> 12 extras (total 51). O banco é a fonte de verdade. Um changelog gerado por outra LLM foi
> verificado e as divergências documentadas (ver auditoria arquivada em `/auditorias/`).

### Feito via patch SQL

**1. `cbo_canonical` — 18 CBOs inseridos (gap 90001 → resolvido)**
18 perfis CNCT sem `cbo_padronizado` receberam mapeamento (perfis 30, 69–71, 75, 89–101).
Nota: `cbo_padronizado='3111-05'` agora tem 6 perfis (19, 20, 30, 63, 98, 100) — colisão aceita
pelo schema (não é UNIQUE), mas recomenda revisão humana (gap residual, não bloqueante).

**2. `gaps_v2` — 44 gaps movidos para `status='resolvido'`**
- Batch 1 (43 via `UPDATE ... LIKE '%Resolvido%' OR impacto LIKE '%Superado%'`): capturou 32
  `recomendacao` (ids 133–164), 2 `url_quebrada` (170, 171), 1 `mapeamento_incompleto` (193),
  1 `url_quebrada` (196) — **e também 7 com impacto='Parcialmente Resolvido'** (ids 111, 112,
  113, 116, 165, 172, 195), capturados pelo LIKE por engano de substring. Decisão pendente
  com o curador.
- Batch 2 (1 via UPDATE separado): gap 90001 → resolvido.

**3. `company_sectors` — ABB inserida**
`company_id=59` (ABB) com `sector_id=5` (Máquinas e Equipamentos), `tier='media'`. Corrigido
de sector_id=6 (Automotivo) que estava no rascunho anterior.

**4. `gaps_v2` — gap 90007 registrado**
48 empresas com fontes `layer=sector/social` sem `sector_code` — vínculo com perfis CNCT
não é gerado para essas empresas.

**5. `company_name_variants` — tabela criada, 51 linhas no total**
39 via SQL + 12 adicionais via script Python (variantes com `company_raw` completo). Total
verificado no banco: **51**. `db_versions_v2.linhas_inseridas` registra 37 — valor incorreto
(erro de contagem no log, sem correção retroativa).
Alteração feita pelo script (não no SQL): `'AVEVA'`/`'AVEVA Group'` apontam para `id=489`
(AVEVA ex-Wonderware), não `id=442` (AVEVA Learning) como estava no SQL.

**6. `companies` — 2 novas empresas inseridas**
id=10289 `ifrs-ifms-ifpr` (IFRS/IFMS/IFPR); id=10290 `senac-sp-generico` (SENAC São Paulo).

### Feito via script Python (não no patch SQL arquivado)

**7. Fusões de empresas — 12 operações, 13 IDs removidos**
API(941←43,9030), ASNT(75←237), TWI(76←598), AWS(81←490), DNV(510←9034),
SENAI CIMATEC(584←9046), UniSenai PR(9012←9047), CSN(20←450), Unipar(19←139),
Vaportec(39←107), Gerdau Summit(4←380), Volkswagen(11←151).
Registradas em `dm_empresas_duplicatas_log` (ids 7–18). Propagação verificada em todas
as tabelas com FK para `companies`.

**8. Correções de órfãos em `dm_rede_*`**
6 `company_id` legados corrigidos com base em `dm_empresas_duplicatas_log` (logs 1–6, de
2026-06-21/25): Khan Academy(53→110), Schneider Electric(57→417), Anglo American(449→3),
GHG Protocol(539→111), Schweitzer(583→58), ANP(944→486).

### Não feito intencionalmente
- Tabela `entities`/`categories`: planejada, não executada — não existe no banco.
- `company_id` para 36 registros em `gaps`/`gaps_v2` com `company_raw` sem `company_id`
  correspondente — decisão do curador.
- Revisão dos 3 perfis com colisão CBO 3111-05 — requer decisão humana.

### Estado final pós-v86.1
Ver `ESTADO_ATUAL.md` §1.

### Pendências abertas
Ver `ESTADO_ATUAL.md` §5.

---

## v85 — Mapeamento industry_sectors→sectors, órfãos VW/Unipar, vínculos de perfis

**Patch:** `patch_v85_fix_industry_map_CORRIGIDO.sql`
**Checksum (sha256):** `c85950abbbda0d959aa4d019e5d64d6ff65d2935dca5562d07376027ca0eaefb`
**Aplicado em:** 2026-06-29 15:43:58

### Contexto e diagnóstico
O banco possui dois espaços de ID distintos para setores industriais: `industry_sectors`
(12 linhas, IDs 1–12, referenciada por `company_sectors.sector_id`) e `sectors` (22 linhas,
IDs 1–22, referenciada por `sector_to_sector_codes.sector_id`). Os nomes coincidem só para
IDs 1–3. A partir do ID 4 divergem completamente. Um join histórico (v77) tratou os dois
espaços como equivalentes, produzindo vínculos semanticamente errados para os setores 4–12.

### Nota de correção do patch
O patch original afirmava corrigir "15 fontes com 0 perfis"; verificação direta mostrou que
apenas **5 sources** realmente tinham 0 perfis (s13, s29, s23, s28, secA-0268) — as outras 15
já tinham perfis e estavam protegidas por `NOT EXISTS`. A versão `_CORRIGIDO.sql` ajusta isso
e corrige também a subquery de contagem do log (que teria registrado 378 em vez de 99).
Bug residual corrigido antes de aplicar: `INSERT INTO gaps_v2` declarava 7 colunas com 6
valores — corrigido com `NULL` para `codigo`.

### Criado
**`industry_to_sector_map`** — tabela-ponte entre os dois espaços de ID (14 linhas, 2 índices:
`idx_industry_to_sector_map_industry`, `idx_industry_to_sector_map_sector`).

### Modificado
- `company_sectors`: 2 empresas órfãs inseridas — Volkswagen do Brasil (cid=11,
  industry_sector_id=7) e Unipar (cid=19, industry_sector_id=5).
- `source_cnct_profiles`: 99 vínculos inseridos nas 5 sources zeradas via
  `industry_to_sector_map`, usando apenas confiança `alta`/`media` (s13→VW 21, s29→VW 21,
  s23→Unipar 15, s28→Stellantis 21, secA-0268→Stellantis 21).
- `gaps_v2`: gap 90006 registrado (`mapeamento_incompleto`, ativo) — vínculos para setores
  4–12 (exceto VW/Unipar/Stellantis) podem estar semanticamente errados; requer decisão
  humana sobre incluir confiança=`baixa`.

### Não feito intencionalmente
Rebuild completo de `source_cnct_profiles` para setores 4–12 (exceto os 3 corrigidos) —
requer decisão editorial sobre confiança=`baixa` para Alimentos, Materiais de Construção,
Têxtil e Papel.

### Nota sobre log de auditoria
`source_cnct_profiles_inserted` em `db_versions_v2.linhas_inseridas` registra 0 em vez de
99 — a subquery de contagem roda depois do INSERT, e com `NOT EXISTS` ativo não encontra mais
sources zeradas. Limitação cosmética do patch; os 99 vínculos foram inseridos corretamente.

---

## v84 — Limpeza de duplicatas na origem + reclassificação de layer

**Patch:** `patch_v84_limpeza.sql`
**Checksum (sha256):** `0c3540e7b80f831dd29630eefeb58104b3076efbc22475abce6edeab4246a78a`

### Feito
1. `dm_mercado_trabalho`: remoção de 306 linhas exatamente duplicadas (gap 90000), grupo
   `(cbo_6digitos, uf, setor_cnae, salario_medio_bruto)`, canônico `MIN(rowid)`.
   1.458 → 1.152 linhas, 0 grupos duplicados restantes.
2. `sources`: reclassificação de layer (gap 90003) — `gap117-001` de `free`→`guia` (Serasa
   Experian + Senac, EAD gratuito); `gap123-001` de `pago`→`technical` (Parker Academy).
   Vocabulário controlado agora sem exceções: `technical`|`sector`|`guia`|`social`.
3. `trail_steps`: remoção de 34 steps duplicados em TRL-SUB-008 (gap 90004), canônico
   `MIN(id)` por `(trail_id, ordem)`. 39 → 5 steps.
4. `gaps_v2`: ids 90000, 90003, 90004 marcados `resolvido`.

---

## v83 — Registro TRL-SUB-008 + ANALYZE

**Patch:** `patch_v83_manutencao.sql`
**Checksum (sha256):** `5cb6c887f811d836dc4de2983aa5f0920513571a9998a016218b0fff7f22aef0`

### Feito
1. `gaps_v2.id=90004` registrado: trail "Sub-trilha NRs Específicas — NR-38 e NR-12" tinha
   39 `trail_steps` para apenas 5 ordens (fator ~7,8×). Correção **não automatizada** —
   impossível determinar step canônico sem inspeção humana (resolvida depois, em v84).
2. `ANALYZE` executado — recalcula `sqlite_stat1` para índices e tabelas afetadas.

### Descartado
Sincronização de `dm_url_validation (ok=0)` → `gaps_v2`: os 20 registros refletem bloqueio
de rede do sandbox (já documentado em gap 196). Criaria falsos positivos.

---

## v82 — Quick Wins: taxa_cobertura, órfãos, índices, schema

**Patch:** `patch_v82_quickwins.sql`
**Checksum (sha256):** `c82f0d5dcaf25812defcee0135d20529a8183060dbb716aeb072bdd5556e82f2`

### Feito
1. Bug `dm_oportunidade_estrategica.taxa_cobertura`: fator de erro ×1000 confirmado
   (MAX=3088,89 vs MAX real 3,08). Recalculado ×100 → MAX=308,89, AVG=33,5.
   `score_oportunidade` não tocado (fórmula original não documentada — gap 90002).
2. `dm_completude_fontes`: 47 órfãos removidos (`source_id` inexistente em `sources`,
   removidas na v79). 976 → 929 linhas.
3. 4 índices criados: `idx_trail_steps_trail`, `idx_ssc_sector`,
   `idx_dmp_pair` (UNIQUE), `idx_at_atlas_code` (UNIQUE).
4. View `vw_trails_ativas` criada: exclui 15 trilhas `TRL-GES-PDF-*` e 22 sem steps.
   122 → 85 trails ativas (nada deletado).
5. `DROP COLUMN sectors.code` — 100% NULL, já substituída por `sector_to_sector_codes`.
   `sectors` passa a ter só `id`, `name`, `type`.

### Não feito intencionalmente
- `score_oportunidade`: fórmula original desconhecida (gap 90002).
- Reclassificação layer free/pago: requer inspeção humana (gap 90003).
- `UNIQUE idx_trails_name`: 14 nomes duplicados impediriam criação — pendente dedup.

---

## v81 — Buscador v2, governança e consolidação de gaps

**Patch:** `patch_v81_buscador_v2.sql`
**Checksum (sha256):** `a84533a99765f26bb9af322ac2169a5d3199c4e01d8e9d2c86853ed800589101`

### Criado
- **`db_versions_v2`** — governança estruturada (`applied_at`, `checksum`, `tabelas_criadas`,
  `tabelas_modificadas`, `linhas_inseridas`). Histórico v1–v80 migrado de `db_versions`
  (somente leitura).
- **`gaps_v2`** — gaps de dado consolidados em 6 categorias oficiais: `lacuna_join`,
  `conteudo_faltante`, `url_quebrada`, `duplicidade`, `mapeamento_incompleto`,
  `recomendacao`. Campo `type_original` preserva tipo legado. 3 índices (`company_id`,
  `type`, `status`).
- **`vw_buscador_v2`** — view sem fanout (1 linha = 1 Fonte + 1 Perfil CNCT), elimina joins
  com `trail_step_sources`/`trail_steps`/`trail_escola_links`. Normas via `GROUP_CONCAT`.
  Fallback de salário: UF específica → média nacional → `indisponivel`.

### Gaps auto-detectados
- 90000 (`duplicidade`): `dm_mercado_trabalho` 306 linhas duplicadas.
- 90001 (`mapeamento_incompleto`): 18 perfis CNCT sem `cbo_padronizado`.

### Validação
Tabelas originais inalteradas (`gaps`=129, `sources`=1.492, `db_versions`=80); view sem
duplicata e cobre 1.492/1.492 fontes; 9.218 linhas (vs 10.438 da view antiga — fanout
eliminado); 0 violações de FK; idempotente.

---

*(Versões anteriores a v81 não possuem changelog técnico estruturado — ver
`HISTORICO_SESSOES.md` para o histórico de decisões de processo das versões v14–v67+,
e `ESTADO_ATUAL.md` §2.7 sobre a lacuna de documentação v68–v80.)*

---

## 📌 FIM DO ARQUIVO

Próxima versão? Adicione uma seção nova **no topo**, acima de "v86.1". Não edite o
histórico abaixo. Depois, sobrescreva `ESTADO_ATUAL.md`.
