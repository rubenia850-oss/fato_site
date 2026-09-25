# SCHEMA — Dicionário de Dados — fato_v168.db

> Regenerado em 16/07/2026 (sessão SITE, parte do enxugamento de estrutura) por consulta direta
> ao banco (`sqlite_master`, `PRAGMA table_info`). 118 tabelas + 16 views (era 108 tabelas + 14
> views na base v91, snapshot anterior).
> Para o estado de gaps/pendências, ver `ESTADO_ATUAL.md`. Para histórico de criação de cada
> objeto, ver changelogs em `historico/`.

---

## 📌 PROTOCOLO — COMO MANTER ESTE ARQUIVO

1. **Toda tabela ou view nova criada num patch precisa de uma entrada aqui**, no grupo
   temático correto — problema raiz que já gerou views órfãs no passado (ver
   `historico/ESTADO_ATUAL_v97_snapshot.md` §2.6).
2. Ao adicionar: nome, propósito em 1 linha, colunas-chave, FKs, contagem de linhas
   verificada por query — não copiar de log ou de patch SQL sem confirmar no banco.
3. Se uma tabela for removida (`DROP`), mova a entrada para uma seção "Removidas" no fim
   deste arquivo, não apague — mantém rastreabilidade.
4. Re-gere as contagens a cada versão nova.

---

## ⚠️ Nota desta regeneração (16/07/2026)

O dicionário coluna-a-coluna completo (grupos 1–12, como na versão anterior) **não foi
reconstruído integralmente nesta passada** — o foco desta sessão foi o enxugamento de estrutura
de arquivos (PDFs estáticos e MDs obsoletos), não uma auditoria completa de schema. O que foi
feito agora:

- Confirmada a contagem atual: **118 tabelas, 16 views** (snapshot anterior: 108 + 14).
- Levantados os objetos que aparecem no banco atual e não constavam (por nome) no dicionário
  da base v91 — lista abaixo. Alguns são novos de fato; outros podem já estar cobertos por
  descrição textual não pega no diff automático (falso positivo a checar).

**Pendência registrada:** regenerar os grupos 1–12 por completo (colunas, FKs, contagem de
linha por tabela) na próxima sessão dedicada a schema. Até lá, use
`historico/SCHEMA_v91_snapshot.md` para a estrutura das tabelas antigas (ainda válida para
quem não mudou) e a lista abaixo para o que é novo/não documentado.

### Objetos presentes em `fato_v168.db` e não identificados no dicionário da base v91

| Tabela | Observação preliminar |
|---|---|
| `cnct_cbo_disambiguacao` | Nome sugere apoio à desambiguação do CBO compartilhado por múltiplos perfis (ver gap histórico do CBO 3111-05). Não investigada em detalhe nesta passada. |
| `cnct_courses_backup_pre_migracao` | Nome indica backup de segurança pré-migração. Candidata a mover/whitelistar como tabela de backup, não de produção — checar se ainda é necessária. |
| `companies_removidas_backup` | Backup de linhas removidas de `companies` (fusões). Mesma observação acima. |
| `dm_densidade_setorial` | Novo data mart analítico — grupo 10 (`dm_*`). |
| `dm_formula_score_oportunidade` | Provavelmente documenta a fórmula pendente do gap 90002 (histórico) — checar se resolve aquela pendência. |
| `dm_monopolio_oferta_arquivado` | Sufixo `_arquivado` sugere versão descontinuada mantida por rastreabilidade — candidata a mover para seção "Removidas". |
| `dm_rede_empresas_centralidade_arquivado` | Idem. |
| `dm_rede_empresas_comunidades_arquivado` | Idem. |
| `dm_truncamento_corrigido` | Provavelmente ligado à correção de truncamento mencionada no gap 90053 (histórico). |
| `trail_steps_arquivados` | Par arquivado de `trail_steps` — mesmo padrão dos `dm_*_arquivado` acima. |
| `trails_arquivadas` | Par arquivado de `trails`. |

**Padrão observado:** ao menos 5 dos 11 itens têm sufixo `_backup`/`_arquivado`/`_removidas`,
indicando uma convenção de "soft delete" via tabela paralela, não um crescimento real de
escopo de dado. Vale confirmar se essa convenção está documentada em `meta_protocolo` — se não
estiver, é o mesmo tipo de lacuna que gerou as views órfãs do histórico.

---

## Índice de grupos (estrutura herdada da v91 — colunas ainda não reverificadas nesta sessão)

1. Núcleo — empresas, fontes, setores
2. Governança — versões, gaps, protocolo
3. CBO e perfis CNCT
4. Cursos CNCT (detalhe)
5. Trilhas (Trails) — modelo legado
6. Atlas — modelo de trilhas atual
7. Setores — múltiplos espaços de ID
8. Vínculos source↔perfil/setor/atlas
9. Tags e metadados de exibição
10. `dm_*` — Camada analítica (data marts)
11. Diversos
12. Views

> Conteúdo detalhado de cada grupo (na base v91): ver `historico/SCHEMA_v91_snapshot.md`.
> Regeneração completa contra v168 é a próxima pendência deste arquivo.
