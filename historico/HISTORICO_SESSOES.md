# HISTÓRICO DE SESSÕES — fato.db

> Notas de **processo/decisão de sessão** (sprints, bugs encontrados, decisões do curador),
> não gaps de dado ativos. Gaps de dado reais ficam em `gaps_v2` (consultável via SQL) e
> resumidos em `ESTADO_ATUAL.md`. Mudanças técnicas por versão ficam em `CHANGELOG.md`.
> Ordenado por versão (`[NN]` = versão do banco em que ocorreu). Extraído originalmente da
> tabela `gaps` (campo `type` fora da taxonomia oficial).

---

## 📌 PROTOCOLO — QUANDO ESCREVER AQUI

Só registre uma nota nesta lista se for **decisão de processo ou curadoria**, não mudança
de dado (isso vai no `CHANGELOG.md`). Exemplos do que entra aqui: decisão de aceitar um
risco conscientemente, conflito entre versões de sessão, descoberta de conteúdo fabricado,
lição aprendida que gerou uma regra nova. Adicione a nota na posição cronológica correta
(por versão de banco), não necessariamente no fim do arquivo.

---

## v14 — Pesquisa externa de URL, lote 3

Lote 3 (reaplicação dos 63 IDs inexistentes a nível de empresa): 4 empresas com URL
company-level validada 200 (Aço Verde do Brasil, Brenntag Brasil, Hytron, Refinaria de
Manguinhos) — mas AVB/Hytron/Manguinhos não têm sources próprias em layer=sector (eram
âncoras de `sector_coverage_matrix`, removidas em v14). Smurfit Westrock(404), Milplan(404)
e Paquetá (DNS) confirmados sem solução nesse momento.
**Impacto:** Superado em v61 (Smurfit Westrock verificado depois com 19 sources válidas).

---

## v34–v36 — Conflito de duas versões e merge S1/S6

Durante a sessão, o responsável enviou um segundo `fato_v34.db` (hash diferente) originado
de outra sessão, que já tinha resolvido independentemente o Sprint S6 (32 recomendações
materializadas, sources 965→991) partindo do mesmo `fato_v33.db`, mas sem o trabalho S1/lote6
feito nesta sessão. Identificado por comparação de hash e diff de `db_versions` antes de
qualquer aplicação adicional.

**Resolução (v35):** mesclar as duas linhas, usando como base a versão com S6 concluído e
aplicando por cima o resultado do S1/lote6 — 30 das 33 linhas do lote6 já estavam corretas
nessa base; só 3 linhas Quartzolit precisaram de atualização real. S1 e S6 ambos encerrados.

**S1 (URLs lote 6) em detalhe:** 33 sources com `url_checado_em` atualizado — 30 confirmações
sem mudança de status (ABB, AVEVA, CRQ-SP, M.Dias Branco, Mosaic, SEL, Stellantis, UFRGS
Lúmina, Paquetá, Ypê) + 3 confirmações de bloqueio Quartzolit/Weber (erro SSL, confirmado 2×).
2 URLs alternativas descobertas (ABB mylearning.abb.com, Ypê ype.ind.br/carreiras) descartadas
por decisão editorial — não duplicar sources já válidas.

---

## v36–v38 — Contaminação na camada Guia e dedup de duplicatas (P1.3, §2.3, §2.6)

**Contaminação Guia (v36):** 80 linhas-lixo em `companies` identificadas — 67 artefatos de
importação malformada v21 (cabeçalhos de relatório, "Camada 1-8" etc.) remapeados para
company placeholder id=9000 "Sem Empresa (técnico)"; 13 duplicatas com par real confirmado
(MIT, Nidec/Embraco, ABENDI, ASNT, BINDT, CCUS Knowledge Centre, DOE H2 Tools, Global CCS
Institute, Hydrogen Council, IIW, Miller Electric, NFPA, OEP) remapeadas. `companies`
615→536. 0 sources órfãs após validação.

**23 clusters de duplicatas (v36–v38):** 11 clusters de normas técnicas + 7 resolução direta
sem fontes (CBMM, Dow Brasil, Grendene, Kinross, Romi, Ternium, Votorantim) + 2 merge simples
(WEG, Dexco) + 3 merge com dedup interna (Samarco, JBS, Alpargatas — 15 sources duplicadas
por texto idêntico removidas) + Volkswagen do Brasil mantida separada de "+ Caminhões e
Ônibus" por decisão explícita (escopos distintos). `companies` 536→520, `sources` 991→976.

**Provenance adicionada (v37):** colunas de proveniência em `guia_source_profiles` (curado
vs inferido) e `source_sector_codes` (curado/heurística/posterior). Limitação documentada:
changelog v23 não rastreia por linha qual vínculo foi heurística-regex vs fallback-setorial.

**Setor 12 perfis inferidos (v39):** 6 perfis inseridos por analogia com Setor 4 + programas
reais de 3 empresas com sources (Smurfit Westrock, Tetra Pak, Papirus). **Conteúdo inferido,
não extraído de documento-fonte** — confirmado pelo responsável antes da inserção.
`sector_fato_profiles` 60→66.

---

## v40–v43 — Métricas de URL, bug de confiança, foreign keys

**Métricas de URL documentadas (v40):** nova tabela `schema_metric_docs` com definição +
query SQL para `url_cadastrada` (permissiva), `url_validada_inclusivo` (padrão recomendado),
`url_validada_estrito`. Resolve confusão entre "94%"/"73%" em relatórios diferentes.

**Bug de confiança (v40):** concatenação duplicada em `company_url_suggestions.confianca`
(`invalido_invalido_403`, 15 linhas) normalizada para padrão de `sources.url_status`.

**Foreign keys ativadas (v41):** `PRAGMA foreign_key_check` revelou 83 violações causadas
por sanitização incompleta do P1.3 original — corrigido: 28 linhas remapeadas em
`sector_programs`/`company_sectors`/`company_url_suggestions` (incluindo Grendene 172→464,
não coberta no P1.3); 55 vínculos órfãos excluídos. 0 violações finais.
**Nota técnica:** `foreign_keys=ON` é PRAGMA por conexão, não persiste no arquivo `.db`.

**P3 baixo impacto (v42):** tabelas deprecated removidas (`cnct_profile_atlas_trails_deprecated`,
`profile_atlas_trails_deprecated`); normas AWS D1.1 padronizadas (formatação, não duplicata);
`url_status` NULL aplicado só a 1 linha genuinamente nunca testada.

**Duplicata de gap (v43):** gap id=198 era duplicata exata de id=197 — excluída.

**4 views sem documentação (v43):** `vw_trilha_enhanced`, `vw_indicador_demanda`,
`vw_mapa_competencias_predito`, `dm_pnp_indicadores`. **Atenção:** `dm_pnp_indicadores` é
VIEW mas usa prefixo `dm_` (reservado para tabelas) — queries de auditoria por
`type='table' AND name LIKE 'dm_%'` não a detectam.

---

## v51 — Tabela de dedup não documentada

`dm_empresas_duplicatas_log` (infraestrutura de dedup) existia no banco mas não constava
no README do pacote v51. 0 linhas — criada mas nunca populada. Schema: id, nome, id_manter,
ids_remover, executado_em. Baixo risco, mas omissão real de documentação.

---

## v55 — Status real de validação de URL (D01-D)

Snapshot superado: estado real é 23 sources `layer=sector` sem URL (de 444 total), todas já
testadas via HTTP (lote 6 + sessões S1-P3). Substitui contagem anterior de "61/455 sem URL".

---

## v63–v67 — Schema, sources P7, contaminação descartada

**_SCHEMA.md recriado (v63):** gerado por consulta direta (PRAGMA table_info/foreign_key_list
em 89 tabelas), não por memória. Inclui mapa de prefixos de `sources.id`, vocabulário de
`sector_codes`, descrição das 30 tabelas `dm_*`, e as 8 views.
**Atualizado novamente (v67):** 12 tabelas com contagem corrigida, 2 tabelas novas do v66
documentadas, 1 tabela esquecida (`profile_normas`, 117 linhas) incluída.

**Bloco 9 sources P7 (v66):** 194 sources "p7-*" inseridas com ~58% (112) de conteúdo
fragmentado de extração de PDF. **Decisão explícita do responsável: aceitar o risco** —
diferente do Bloco 7 (mesmo problema, mas filtrado). Registrado para limpeza futura.

**Contaminação de MD fabricado descartada (v66):** uma cópia de trabalho paralela continha
entrada D73-DB e regra de `meta_protocolo` (#19) **fabricadas**, sem execução real. Confirmado
por query direta (`meta_protocolo` tinha 18 linhas reais, não 19). Descartado integralmente
antes de qualquer entrega. **Lição:** sempre verificar contagens reais antes de confiar em
texto de arquivo de trabalho, mesmo da própria sessão.

**Companies fragmentadas (v67→v76):** 40 de 288 companies de patch externo descartadas por
fragmento de extração de PDF (~14%). Achado relacionado não corrigido: 11 das 15 trilhas
`TRL-GES-PDF-*` têm `eixo="Gestão e Negócios"` mas tematicamente parecem pertencer a outro
eixo — não confirmado, só apontado (ver SP-25).

---

## Notas sem versão de banco associada (`[?]`)

### Qualidade de dados — setor (D01-A2)
370 sources malformadas removidas e substituídas por reextração direta de
`iedu_setores_v7_0.md`. Formato A (23 seções): 277 linhas → 254 sources novas, ligadas a
`source_sector_codes`. Formato B (11 fichas): 49 linhas novas, 45 com URL real. Total sources
sector: 634→567 (queda por remoção de duplicatas/garbage, não perda de informação).

### Atlas II — estrutura própria (D04)
Apenas Atlas II estava com `atlas_nucleo=0` — não todos II–IX. Atlas II não possui seção
PARTE 3 Núcleo no documento-fonte; tem estrutura própria (11 trilhas + INDICE CRUZADO).
Extraído para `atlas_trail_cbos` (22) e `atlas_trail_normas` (26). Diferença estrutural do
documento, não núcleo faltante.

### Coverage matrix — Format C leakage (D-GOV01)
112 sources sector tinham `company`=empresa-âncora arbitrária e `program`/`format`=matriz de
cobertura. Extraídas para `sector_coverage_matrix` (112). Removidas de `sources` (898→786).
Também corrigido: 13 pares de empresas duplicadas (Vale/Vale S.A. etc.) merged,
`companies` 464→451.

### Validação de URL — lotes 1 e 2 (histórico, consolidado em SP-08)
Lote 1: 14 URLs validadas via pesquisa externa, `url_status=validado_pesquisa_externa`.
10 sources sem resolução (Paquetá, Quartzolit, Dexco). Lote 2: 24 URLs novas validadas, 19
já confirmadas, 55 inválidas. Sources sector com URL: 370→394 (86,6%).
*Histórico de progresso — estado atual consolidado é o de `ESTADO_ATUAL.md`.*

### D01-C — reclassificação de sources
6 sources reclassificadas (company_id/program corrigidos): Milplan, Ternium Brasil, Kinross
Brasil, WEG, Petrobras, Unigel. Companies 414 e 420 (placeholders) removidas como órfãs.

### D01-D lote 6 — resultado final
30/35 URLs aplicadas, incluindo correções de domínio (ABB, Ypê, Fundação Pescar). Quartzolit/
Weber (3): erro de conexão persistente mesmo com domínio confirmado — possível bloqueio
geográfico. Sources sector com URL: 394→424 (93%). Restam 31 sem solução.

### dm_mercado_trabalho — resíduo sintético removido
14 linhas `fonte_original=SINTETICO_DEMO_v28` removidas — os mesmos CBOs já tinham cobertura
real (PNAD_Contínua_2024). Tabela 100% real (1458/1458).

### Sprint 13/14 — qualidade de dados (sessão SITE)
Micro atlas PDF restaurado (78/99 cursos) após regressão em linha de auditoria paralela.
3 pares de `cnct_profiles` duplicados refundidos (88→85), revelando 516 violações de FK por
nomenclatura PT não capturada em varredura EN. Varredura sistemática de companies encontrou
72 grupos de duplicata (companies 520→447), com verificação de falsos-positivos (BRF, SENAI
genérico) e 1 erro de cadastro confirmado por pesquisa externa (Air Products/Linde).
**Motivou a Regra 0.1** (divisão estrita BANCO/SITE).

### ANP — duplicata residual (id=944)
2 entradas ANP em `companies`: id=486 (3 sources reais) e id=944 (0 sources, mesmo padrão de
lixo residual visto em outras entidades). **Resolvido em 27/06:** id=944 removido por patch
externo, verificado 0 linhas com FK antes de aplicar.

### Patches externos avaliados e aplicados (21/06)
(1) `sprint0_integridade_corrigido.sql` — merge de 5 pares duplicados (Anglo American, Khan
Academy, Schneider Electric, SEL/Schweitzer, GHG Protocol), cobrindo as 5 tabelas com FK.
`companies` 447→442.
(2) `p1p2_insert_prontos_corrigido.sql` — 15 sources novas. **Bug encontrado antes de
aplicar:** `company_id=97` não existia (ANP real é id=486). Testado empiricamente: com
`PRAGMA foreign_keys=ON`, isso derrubaria a transação inteira (não só a linha ruim).
Corrigido e retestado. `sources` 976→991.

### Trilhas MT-* duplicadas removidas
4 trilhas `MT-*` duplicavam o tema de `TRL-MICRO-001/002/004/005` com profundidade diferente.
Decisão do responsável: remover como redundantes. `trails` 109→105.

### LIKE ambíguo em vínculo de normas — filtrado por risco
`p5_step_sources_normas_corrigido.sql` usava `LIKE '%padrão%' LIMIT 1` sem `ORDER BY` —
padrões amplos (com.br: 232 candidatos) produziam vínculo arbitrário. Confirmado por
execução: um vínculo resolvia errado para Anglo American. Decisão: aplicar só padrões de
risco baixo/médio, descartar com.br/org.br/gov.br. `trail_step_sources`: 79/90 aplicados.

### Arquitetura atlas_trails — decisão confirmada
`atlas_trails` pode reusar códigos `TRL-*` de `trails` intencionalmente — é ponte para o
catálogo Atlas (FK necessária), não duplicação a eliminar. Diferente do caso MT-*
(esse sim era duplicação real).

### Regra 19 (meta_protocolo) — genuína vs fabricada
Regra 19 genuína criada — ironicamente, a versão fabricada que motivou esta lição citava uma
"regra 19" que nunca existiu de fato.

### Validador de patch externo criado
Após 3 ocorrências do mesmo tipo de problema (colisão de numeração, fragmento de PDF, LIKE
ambíguo), construída ferramenta `validar_patch_externo.py`, testada contra os 2 patches mais
complexos recebidos — reproduziu os achados da revisão manual. Uso obrigatório formalizado.
**Limite honesto:** a ferramenta não impede outra sessão de ignorá-la, só torna a checagem
rápida o suficiente para não haver desculpa de pular.

---

## v87 (2026-06-29) — Decisão sobre os 7 gaps "Parcialmente Resolvido" + regra FK

### Reversão dos gaps 111, 112, 113, 116, 165, 172, 195

Os gaps 111, 112, 113, 116, 165, 172, 195 foram capturados indevidamente pelo
`LIKE '%Resolvido%'` do patch v86, que os marcou como `status='resolvido'` apesar
do campo `impacto='Parcialmente Resolvido'`. A auditoria de 2026-06-29 identificou a
inconsistência.

**Decisão do curador (29/06):** reverter todos os 7 para `status='ativo'`, mantendo
`impacto='Parcialmente Resolvido'` e adicionando nota de reversão na `observacao`.
Cada gap tem pendência residual real documentada — nenhum estava totalmente concluído.

A reversão foi executada via script Python com UPDATE em lote.
Gaps ativos passaram de 24 para **31**; resolvidos de 74 para **67**.

### Regra 22 — `foreign_keys_enforcement` (meta_protocolo)

Inserida a regra 22 em `meta_protocolo`: `foreign_keys_enforcement` —
`PRAGMA foreign_keys = ON` obrigatório em toda conexão SQLite.
O banco tem 0 violações de FK, mas o enforcement nunca esteve ativo em 86 versões
anteriores — toda validação referencial era decorativa. Total de regras: **22**.

---

---

## v95–v97 (2026-06-30) — Auditoria externa, reconstrução de gap, e lapso próprio

### Origem

Sessão de auditoria externa (responsável + IA externa, fora desta linha BANCO),
entregue como dois documentos: relatório cruzado "Delta v86→v94" (HTML) e o pacote
`db-fato_v94.zip`. Achado principal do relatório, confirmado por query direta antes
de qualquer ação: `db_versions_v2` parado em v86 enquanto o banco real estava em v94
— 8 versões reais (v87–v94), todas documentadas em `CHANGELOG.md`, nunca inseridas
na própria tabela criada para isso (v81).

### v95 — Reconstrução do gap + correção de causa raiz

8 `INSERT`s reconstruídos a partir do `CHANGELOG.md` existente (trabalho mecânico,
não investigativo — o conteúdo já estava documentado, só não estruturado). Causa raiz
corrigida no protocolo (`ESTADO_ATUAL.md` nunca exigia explicitamente o registro em
`db_versions_v2`) + `meta_protocolo` regra 23.

### v96 — `scp_backup_v87` removida; `vw_buscador_completo` avaliada e NÃO removida

Tabela de backup órfã (v88, sem referência, 6 versões de FK check limpo) arquivada
em CSV e dropada. `vw_buscador_completo`, segunda candidata a dívida estrutural, **não**
foi removida nesta versão por falta de confirmação de uso pelo portal — registrada
como gap 90008 em vez de assumida como redundante.

### v97 — Decisão revertida + fila de gaps do relatório HTML

**Decisão do responsável (30/06): `vw_buscador_completo` está em uso ativo pelo
portal.** A hipótese de redundância com `vw_buscador_v2` levantada em v96 estava
errada — as duas views coexistem por motivo legítimo (uma com fanout, outra sem).
Gap 90008 reclassificado para documentação (já feita em `SCHEMA.md`), não remoção.
**Lição:** avaliar uso de um objeto pelo portal sem acesso ao código-fonte do portal
é, na melhor das hipóteses, uma hipótese — não uma conclusão. A pergunta direta ao
responsável era o passo certo, e foi o que evitou um `DROP` incorreto.

4 gaps adicionais importados da fila do relatório HTML, cada um re-verificado por
query direta antes de aceitar (90009 `dm_rede_empresas_centralidade` duplicatas,
90010 `cbo_canonical` colisão em `3111-05`, 90011 `TRL-SUB-008` residual — achado
novo não coberto pelo escopo da v84, 90012 `trails.name` duplicados).

### Lapso próprio identificado e corrigido na mesma sessão

Ao escrever a seção v95 do `CHANGELOG.md`, o `INSERT` correspondente em
`db_versions_v2` **não foi executado** — exatamente o tipo de falha que a regra 23
(criada nesta mesma versão) existe para prevenir. Identificado por pergunta direta
do responsável ("Você documentou todos seus achados?"), não por checagem proativa
própria — confirmado por `SELECT version FROM db_versions_v2` comparado contra o
intervalo completo `1..MAX(version)`. Corrigido com o INSERT de v95 retroativo.
**Lição prática para regra 23:** a verificação de fechamento (`MAX(version)` =
`NN` do arquivo) precisa ser rodada a cada versão fechada nesta mesma sessão, não
só uma vez no fim — um lapso no meio de uma sequência de versões pode passar
despercebido até a versão seguinte ser fechada.

---

## 📌 FIM DO ARQUIVO

Nova nota de processo? Insira na posição cronológica correta (por versão), não só no final.
Mudança de dado real → vai em `CHANGELOG.md`, não aqui.
