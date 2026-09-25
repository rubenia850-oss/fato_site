# Changelog — `fato_*.db`

## v109 — merge de 2 branches paralelas (v107→v108) + descoberta do `meta_protocolo`

**Contexto:** o usuário enviou 3 arquivos de uma sessão paralela que também
partiu do meu `fato_v107.db`: `patch_v107_to_v108_consolidado.sql`,
`fato_v108_merged.db` e `gaps_v108.md`. Comparação inicial já mostrou
colisão real: os dois lados usaram o id de gap **90030** pra achados
diferentes.

**Descoberta no meio do caminho:** o banco já tinha uma tabela
`meta_protocolo` com **26 regras** de processo pré-existentes — nunca
consultada nesta sessão. A regra 1 manda literalmente ler essa tabela antes
de processar qualquer documento de auditoria/correção. A regra 8 descreve
exatamente esta situação (duas versões `vN` divergentes = branches
paralelas) e manda: (a) comparar contagem de linhas por tabela, (b) ler
`db_versions` de cada lado, (c) reconciliar — não aplicar um por cima do
outro cegamente. Segui esse processo agora, retroativamente.

**Comparação (regra 8):**
- Só 2 tabelas com contagem diferente: `gaps_v2` (123 vs 126) e
  `meta_protocolo` (26 vs 27).
- SP27b (cnct_cbos.descricao, atlas_trails.atlas_name): **0 divergências**
  entre as duas branches — validação cruzada independente, os dois lados
  recalcularam e chegaram exatamente ao mesmo resultado.
- As duas branches encontraram e corrigiram a **mesma colisão de nome**
  (`TRL-CNCT-022` × `TRL-CNCT-DG-001`) de forma independente, com propostas
  de nome diferentes.

**Reconciliação aplicada:**
1. **`TRL-CNCT-DG-001`**: adotei o nome da outra branch ("...e Produção
   Cultural — Ferramentas Livres") **e** revertida `cnct_label` pra `NULL`
   (eu tinha setado `'Design Gráfico'` na v108; a outra branch argumentou —
   corretamente — que isso faz a trilha parecer catálogo CNCT oficial,
   quando na real ela não tem CBO nem `cnct_label` original; isso é o sinal
   que a distingue de `022`). Mudei de ideia com base num argumento melhor.
2. **`TRL-CNCT-030`**: mantive meu rename `"(EAD)"` desta sessão (já bem
   verificado, step a step). Ajustei o gap novo da outra branch (90032)
   pra refletir que a colisão de nome já foi resolvida, deixando só a
   pergunta de fundo (merge ou manter 2 registros) em aberto.
3. **Colisão de ID**: meu gap 90030 (sourcing de DG-001) renumerado pra
   **90034** — a outra branch já tinha usado 90030-90033 como bloco
   coerente (ABB/setor, script de rede quebrado, 004/030, reabertura
   016/039), preservei como veio.
4. **Gap 90033** (reabre a pergunta "016/039 são duplicata?"): aceitei o
   gap, mas **corrigi a caracterização da evidência** antes de gravar —
   verifiquei pessoalmente e os artefatos de fragmentação de PDF nas duas
   descriptions **não são idênticos byte a byte** (`"r efino"` vs
   `"re fino"`, pontos de quebra diferentes; cada uma tem uma palavra
   diferente corrompida). Isso é evidência mais fraca de duplicata do que
   a outra branch alegou ("os MESMOS artefatos") — mais consistente com
   duas extrações independentes do mesmo texto-fonte oficial do Atlas do
   que com uma cópia exata. Documentei a nuance, não vetei o gap.
5. **Gaps 90016/90023**: adotei a observação mais completa e
   cross-referenciada da outra branch, com nota de convergência entre as
   duas.
6. **`meta_protocolo` regra 27**: adicionada sem colisão (id 27 estava
   livre) — boa regra, documenta exatamente o que aconteceu (reaplicar
   fórmula já invalidada sem checar colisão).

**Validação:** 0 violações de FK · integrity_check ok · 127 gaps_v2 total
(123 meu + 4 líquidos da outra branch, com 1 renumeração).

**Backup:** `fato_v109_pre_merge_backup.db`, estado antes desta
reconciliação.

**Pendência que carrego pra próxima vez:** ler a tabela `meta_protocolo`
(e `gaps`/`db_versions` conforme a regra 1) **no início** de qualquer
sessão futura, não descobrir no meio de um merge. Também não tenho acesso
a `_BACKLOG.md`, `validar_patch_externo.py` nem `audit_classes.py`
citados nas regras — só ao que é enviado nesta conversa.

---

## v108 — `patch_SP27b_derivacoes_internas.sql` + 2 correções da Auditoria v94-v106

**Parte 1 — patch SP-27b (derivações internas, sem pesquisa externa):**
- `cnct_cbos.descricao`: 86 linhas preenchidas via **moda por `codigo`**
  (quando um mesmo código CBO aparece em várias linhas com descrições
  divergentes, usa a mais frequente; empate → mais longa). **Não confiei de
  olho**: recomputei essa lógica do zero, direto no banco, pras 86 linhas —
  **0 divergências** contra o que o patch propunha. Os 3 ids que sobraram
  vazios (226, 229, 230) são exatamente os que têm `codigo` único no banco
  inteiro (sem outra linha pra derivar a moda) — exclusão correta, não
  descuido.
- `atlas_trails.atlas_name`: 42 linhas preenchidas via `JOIN` com
  `atlas_docs` (chave primária, sem ambiguidade). Confirmado 42/42 antes de
  rodar — todas as linhas vazias tinham `atlas_num` correspondente em
  `atlas_docs`.

**Parte 2 — 2 correções propostas pela `Auditoria_v94_v106.html`** (relatório
de auditor externo, não-participante do patch), **verificadas ponto a ponto
antes de aplicar**:

- **Colisão de nome `TRL-CNCT-022` × `TRL-CNCT-DG-001`**: confirmei que as
  duas mostravam exatamente `"Trilha do Profissional em Design Gráfico"`,
  e que `DG-001` tem **0** `trail_step_sources` contra **14** de `022` —
  ou seja, aparecem como gêmeas no portal, mas uma é clicável e a outra não.
  Renomeei `DG-001` para `"Trilha do Profissional em Design Gráfico
  (Ferramentas Livres)"` e criei o gap **90030** (`conteudo_sem_fonte`,
  `ativo`) documentando que o gap 90016 fechou a *estrutura*, não o
  *sourcing* — são coisas diferentes.
- **`TRL-CNCT-030` × `TRL-CNCT-004`**: o changelog anterior (v106) tinha
  descrito como "quase idênticas"; conferi de novo, step a step — são
  **8/9 idênticas de verdade**, e o único ponto de diferença (escola do
  step 1: ENAP/"Administração" em 004 vs IFSP/"Administração (EAD)" em 030;
  fonte `p6-0050` vs `p6-0140`) aponta consistentemente pra modalidade EAD.
  Renomeei `030` para `"Trilha do Profissional em Administração (EAD)"`.

**Validação:** 0 violações de FK · integrity_check ok · versão registrada
= 108 (o próprio patch não trazia o `INSERT` em `db_versions_v2`).

**Backup:** `fato_v108_pre_patch_backup.db`, isolado deste patch.

**Recomendações da auditoria que ficaram pendentes** (sem SQL pronto, não
aplicadas nesta rodada): `PRAGMA foreign_keys = ON` em produção; convenção
de blocos de ID reservados por branch (pra evitar repetir a colisão do gap
90026); fechar a "Parte B" do gap 90013 (14 linhas residuais de
`sector_id`); revisar se dá pra recuperar `atlas_num` retroativamente pros
138/223 registros ambíguos de `source_atlas_trails` (gap 90028).

---

## Auditoria pós-fato — pacote fonte do `patch_iedu_SP27-1.sql` (`pacote_BANCO_pedido_iedu.zip`)

O usuário enviou o pacote de origem (`PLANO_ELIMINACAO_IEDU.md` + 4 JSONs de
extração + 4 `.md` fonte) do patch que eu já tinha aplicado na v107 — dava
pra finalmente conferir o texto longo que eu tinha sinalizado como "não
verificado" no changelog anterior.

**Comparação byte-a-byte entre o que está no banco (`fato_v106.db`, pré-v107
rename) e os JSONs de extração:**
- 55/55 `atlas_destination_profiles.descricao_completa` — **0 divergências**.
- 22/22 `cnct_profiles.justificativa_i4_i5` aplicadas — **0 divergências**;
  os 4 nulos (ids 8,9,11,13) batem exatamente com os 4 nulos no JSON fonte.
- 19/19 correções de `campo_atuacao`/`infraestrutura_requerida` — **0
  divergências** contra `extracao_cnct_fundamentos_corrigido.json`.
- `cnct_cbo_disambiguacao` (2 linhas) — bate exatamente com a tabela da
  Seção 3 do plano.

**Achado de processo (não de dado — nada precisou ser corrigido no banco):**
o `PLANO_ELIMINACAO_IEDU.md` original documenta e valida explicitamente
**18 perfis** (nomeados um a um) + **1 pendente de confirmação de nome**
("TÉCNICO EM MANUTENÇÃO" → resolvido como id 12 por confirmação humana fora
desta sessão) = **19 no total**, com a ressalva explícita de que os demais
perfis do documento-fonte ainda não tinham sido validados.

O `patch_iedu_SP27-1.sql` que apliquei, porém, continha `UPDATE` para
**29** perfis — 10 além do escopo aprovado:
- **3** (Plásticos id=73, Mecânica id=11, Mecânica de Precisão id=6) —
  conteúdo real, extraído pelo mesmo parser, presente no JSON, mas nunca
  validado/aprovado no plano. Não tiveram efeito porque o banco já tinha
  valores distintos pra essas 3 linhas (a trava `WHERE infraestrutura_requerida
  = campo_atuacao` bloqueou).
- **7** (o grupo "TI" — Redes, Desenvolvimento de Sistemas, Telecom,
  Informática, Suporte em Informática, Qualidade, Biotecnologia) — o JSON
  fonte tem **`None` (nulo Python) genuíno** pra essas 7 (o parser não
  conseguiu extrair do documento original); confirmei isso abrindo o JSON
  diretamente. Quem gerou o `.sql` final serializou esse `None` como string
  literal `'None'` em vez de pular a linha ou usar `NULL` — bug de geração
  do patch. Também não teve efeito, mesma trava de proteção, mesmo motivo:
  o banco já tinha conteúdo bom nessas 7 linhas antes do patch rodar.

**Conclusão:** o dado que está hoje em `fato_v107.db` está 100% correto e
rastreável até a fonte aprovada — a trava de segurança do próprio SQL
evitou que o excesso de escopo (não aprovado) e o bug de serialização
tivessem qualquer efeito prático. Não há nada para corrigir no banco. Fica
só o registro de que o processo de geração do `.sql` a partir do plano não
respeitou o escopo documentado — vale mencionar pra quem gerou o patch, caso
aconteça de novo com um banco em estado diferente (sem a trava salvando).

**Sobre a eliminação dos arquivos `iedu_*`:** o plano indica que, com essas
migrações confirmadas, os arquivos-fonte `iedu_atlas_v1.0.md`,
`iedu_cnct_extracao_v1.0.md`, `iedu_cnct_fundamentos_v1.0.md` e
`iedu_indice_v4.1.md` podem ser apagados do projeto — mas isso é fora do
escopo desta ferramenta (são arquivos de outra sessão/repositório, não
tenho acesso a eles). Passo pendente pra quem administra esses arquivos.

---

## v107 — patch externo aplicado: `patch_iedu_SP27-1.sql`

**Origem:** patch `.sql` de ~6.800 linhas, gerado a partir de um plano externo
(`PLANO_ELIMINACAO_IEDU.md`, não anexado nesta sessão), enviado pelo usuário
para verificação e aplicação.

**Escopo:** 3 frentes (mais uma tabela nova):
1. `atlas_destination_profiles` — nova coluna `descricao_completa`, texto
   longo (mercado de atuação, remuneração de referência, saídas
   intermediárias) para os 55 perfis PE/PS/PD do Atlas.
2. `cnct_profiles` — nova coluna `justificativa_i4_i5`, preenchida em 22 dos
   26 perfis "core" do CNCT (justificativa de por que o perfil é relevante
   pra Indústria 4.0/5.0).
3. `cnct_cbo_disambiguacao` — tabela nova, 2 linhas, notas de desambiguação
   pra CBOs que mapeiam pra mais de um perfil CNCT.
4. `cnct_profiles.campo_atuacao`/`infraestrutura_requerida` — correção de
   bug onde os dois campos tinham o mesmo texto duplicado (em vez de
   conteúdos distintos) em várias linhas.

**Por que não apliquei de cara:** o item 4 tinha um trecho que me deixou
desconfiado — pra 7 perfis (Redes de Computadores, Desenvolvimento de
Sistemas, Telecomunicações, Informática, Manutenção e Suporte em
Informática, Qualidade, Biotecnologia), o `UPDATE` setava os dois campos
literalmente pra string `'None'` em vez de conteúdo real.

**Verificação que fiz antes de aplicar:**
1. Contei e conferi os 3 números do cabeçalho do patch (55/55, 26/26, 19/29)
   contra o banco real, um por um — todos bateram exatamente.
2. Descobri que o `WHERE ... AND infraestrutura_requerida = campo_atuacao`
   em cada `UPDATE` da seção 4 funciona como trava de segurança: só aplica
   se os dois campos **ainda** estiverem duplicados (sintoma do bug). Testei
   e confirmei que, no estado atual do banco, as 7 linhas com `'None'` **já
   tinham valores distintos e corretos** — a trava impede que sejam
   sobrescritas, então esse trecho arriscado do patch é inerte, não
   perigoso.
3. Rodei um **dry-run completo** numa cópia isolada antes de tocar no banco
   real — confirmei que nenhuma das 7 linhas virou a string `'None'`, e que
   exatamente 19 linhas (não 22, não 29) receberam conteúdo novo e distinto,
   batendo com "19 confirmados" do cabeçalho.
4. Só depois de tudo isso, apliquei no banco real.

**Validação pós-patch:** 0 violações de FK · integrity_check ok · 55/55 atlas
com `descricao_completa` · 22/22 cnct com `justificativa_i4_i5` · 2/2 linhas
em `cnct_cbo_disambiguacao` · 19/19 correções de `campo_atuacao` confirmadas.

**O que não verifiquei:** não tenho como confirmar a exatidão factual de
todo o texto longo (as descrições de mercado/remuneração dos 55 perfis, as
justificativas I4.0/I5.0) — só a integridade estrutural e as travas lógicas.
Não achei o arquivo `PLANO_ELIMINACAO_IEDU.md` referenciado nesta sessão
pra cruzar o conteúdo com a fonte original.

**Backup:** `fato_v106_pre_iedu_patch_backup.db`, separado do backup anterior
(company_sectors), caso precise reverter só este patch.

**Versão registrada:** 107 (o próprio patch não trazia o `INSERT` em
`db_versions_v2` — adicionei eu pra manter o rastro).

---

## v106 — patch externo aplicado: `patch_v105_to_v106_correcao_definitiva_company_sectors.sql`

**Origem:** patch `.sql` de sessão de auditoria externa (fora da linhagem
v94-v105), enviado pelo usuário para verificação e aplicação.

**Alegação do patch:** o gap 90013 (que a v99 tinha marcado "resolvido",
"53/67 linhas corrigidas") estava assentado sobre premissa falsa — a Parte A
do patch_v99 diagnosticou o bug de `company_sectors.sector_id` comparando
contra a tabela errada (`sectors`, espaço B, usado por perfis CNCT) em vez
da FK real (`industry_sectors`, espaço A). Resultado: "corrigiu" 53 linhas
que já estavam certas, e o dano real era muito maior que os "14 residuais"
documentados — setores 5 a 9 inteiros estavam deslocados em +1, não só os
buckets mistos 4 e 12.

**Verificação que fiz antes de aplicar (não confiei de olho):**
1. Validação pré-patch do próprio arquivo (contagem 67 total, distribuição
   4=15/5=8/6=7/7=7/8=7/9=7/12=16) — bateu exatamente.
2. Conferi o `CREATE TABLE` real: `company_sectors.sector_id REFERENCES
   industry_sectors(id)` — confirmado, a alegação sobre o espaço de FK errado
   está certa; `sectors` é mesmo uma tabela sem relação (usada por
   `sector_code` tipo AUT/INS).
3. Cruzei **todas** as empresas dos setores 5-9 (não só as citadas por nome
   no patch) contra `sources.industry_sector_id` — toda empresa com fonte
   direta confirmou o mesmo deslocamento de +1, sem exceção além da Randon
   S.A. (`company_id=148`, que o próprio patch já tratava à parte).
4. Conferi as duas empresas multi-setor (Dexco, Smurfit Westrock) — batem
   com a fonte antes e depois do patch.
5. Conferi que o `INSERT` em `db_versions_v2` seria compatível com o schema
   real e que o pré-requisito (`MAX(version)=105`) batia com o estado atual.

**Apliquei o patch.** Validação pós-patch (também especificada no próprio
arquivo) rodou 100% conforme o esperado:
- distribuição final 4=8/5=7/6=7/7=8/8=7/9=7/10=7/11=9/12=7 (total 67) ✓
- 0 divergências remanescentes contra `sources.industry_sector_id`
  (excluindo as 2 empresas multi-setor) ✓
- 0 violações de FK, `integrity_check` ok ✓
- `MAX(version)` em `db_versions_v2` = 106 ✓
- ABB (`company_id=59`) permanece em `sector_id=4`, sem alteração — pendência
  de curadoria documentada no próprio gap 90013, não resolvida (não tem fonte
  própria e não é claramente Química nem Papel/Celulose).

**Gaps afetados:** 90013 → `resolvido` (com nota corrigindo a premissa
falsa). 172 e 182 → continuam `ativo`, só o texto da observação foi
corrigido (bucket certo de Montagem Industrial é 11, não 12).

**Backup:** guardei uma cópia do banco *antes* deste patch específico em
`fato_v106_pre_company_sectors_patch_backup.db`, caso seja preciso reverter
só essa mudança sem perder os patches anteriores desta sessão.

---

## v106 — 2ª rodada (gaps 111, 112, 113, 114 resolvidos + 90011 parcial + 90029 novo)

**A partir daqui resolvo tudo sozinho** (instrução do usuário: sem esperar
"decisão editorial/curador" — só sinalizo quando não dá pra verificar algo
sem inventar).

**Gap 90011 — `TRL-SUB-008` (NR-38 vs NR-37), PARCIALMENTE resolvido:**
- A nota do gap dizia que os 5 `trail_steps` tinham `nome=NULL` — confirmado,
  mas o conteúdo real estava no campo `note` (a nota original não olhou essa
  coluna). Copiei/limpei `note` → `nome` nos 5 steps.
- **Verificado por busca externa:** NR-38 = Segurança e Saúde nas Atividades
  de Limpeza Urbana e Manejo de Resíduos Sólidos (Portaria MTP 4.101/2022) —
  **sem nenhuma relação com petróleo**. A norma real de plataformas é
  **NR-37** (Portaria MTb 1.186/2018). Corrigido `trails.description` e os
  `trail_steps.nome` que citavam "NR-38 (Petróleo e Gás)" → NR-37.
- Steps 3 e 4 tinham formatação quebrada (texto "Trilha 4"/"Metodologias
  Ágeis" misturado no meio do conteúdo de NR-12) — só limpei a formatação,
  **não reconstruí o conteúdo**, porque não existe backup nem fonte externa
  pra confirmar o texto canônico (`trail_steps_arquivados` existe no banco
  mas é de outro lote, `TRL-GES-PDF-*`, não ajuda aqui).
- **Continua `ativo`**: zero `trail_step_sources`/`trail_escola_links`
  vinculadas, e não existe nenhuma fonte real sobre NR-37 no banco pra
  linkar — não inventei uma.

**Gap 111 — DWSIM:** entrada `guia` criada (`g0370`, Bloco 10-A), reaproveitando
dados já verificados nas camadas `technical`/`sector`. Decisão de promover
tomada por mim (bloco já tem concorrentes pagos do DWSIM cadastrados).

**Gap 112 — CRQ-SP Qualifica:** entrada `guia` criada (`g0371`, Bloco 14,
`sector_code=QUI`). A "ambiguidade QUI vs Bloco 14" citada na nota não era
real — `QUI` já é o `sector_code` padrão usado por outras 3 empresas dentro
do próprio Bloco 14 (Braskem, BASF, Dow). Verificado direto no banco.

**Gap 113 — Fundacentro:** entrada `guia` criada (`g0372`, Bloco 8,
`sector_code=SEG`), usando o curso NR-38 já confirmado por busca externa na
sessão anterior (esse sim é o contexto correto pra NR-38 — limpeza urbana,
não petróleo). Reforcei na nota que isso **não** foi usado pra resolver o
90011.

**Gap 114 — IBP / Plataforma Jovem:** ao investigar o bloco de destino, achei
que o `company_id=101` referenciado no gap é **duplicata vazia** de
`company_id=47` (a IBP "de verdade", que já tinha conteúdo). Também achei
que `company_id=47` tinha **duas entradas `guia` quase idênticas** (`g0188` e
`g0330`, mesmo `program`, mesmo bloco) — mesclei as duas (mantive `g0188`,
deletei `g0330`) antes de inserir o recurso novo. Entrada `g0373` (Plataforma
Jovem) criada sob `company_id=47` — o registro correto, não o 101 do gap
original.

**Gap 90029 (novo):** documentei a duplicata de company (47 × 101) sem
apagar a 101 — ela só aparece em tabelas derivadas de rede (`dm_rede_*`,
métricas todas zeradas, nó órfão) e nos próprios registros de gap; apagar
sem necessidade correria risco de deixar essas 4 referências órfãs à toa.
Deixei `ativo`, prioridade Baixa, pra uma limpeza formal futura se quiserem.

**Bug que cometi e corrigi no processo:** ao inserir `g0373` errei o valor
de `format` (`'Híbrido'` em vez do código `'HYBRID'` de `format_meta`) e
esqueci de preencher `program` — `PRAGMA foreign_key_check` pegou o erro de
formato na hora, corrigi os dois antes de fechar.

**Integridade final:** 0 violações de FK · integrity_check ok · 23 gaps
ativos (eram 27 antes deste patch, incluindo o 90029 novo)

---

## v106 — 1ª rodada (gap 111 resolvido)

**Origem:** `fato_v105_fixed.db` (mesma sessão, ver mudanças abaixo)

**Gap 111 — `conteudo_faltante` (DWSIM sem cobertura na camada `guia`)**
- Tipo: decisão editorial (não bug de dado)
- Ação: inserida 1 linha em `sources` (id `g0370`, `layer='guia'`, `bloco='10-A'`)
  reaproveitando `company_id=48` (DWSIM/CAPES, já existente) e os fatos já
  verificados nas camadas `technical`/`sector` (t18, sec-06-103, secA-0208,
  secA-0216, secA-0270) — nenhum dado novo inventado.
- Justificativa: Bloco 10-A já lista concorrentes pagos do DWSIM (Ansys
  `g0114`, AspenTech `g0115`); a própria entrada técnica do DWSIM já o
  descreve como "alternativa ao Aspen HYSYS", então a promoção pra `guia`
  segue o padrão do bloco.
- **Assunção que tomei sozinho** (a observação original do gap dizia
  "decisão editorial pendente"): decidi promover em vez de deixar em aberto,
  por ser conteúdo real e já verificado, de baixo risco. Se você discordar,
  é só reverter a linha `g0370`.
- `gaps_v2.id=111` → `status='resolvido'`

**Integridade:** `PRAGMA foreign_key_check` = 0 violações · `PRAGMA integrity_check` = ok

**Gaps ativos restantes:** 25 (eram 26 antes deste patch — comparado ao
`gaps_v105.md`, que listava 29 antes dos patches 90016/90022/90023 desta
mesma sessão)

---

## v105_fixed (01/07/2026) — 90016, 90022, 90023 resolvidos

**Origem:** `fato_v105_merged.db` (upload do usuário, resultado de sessão paralela)

- **Gap 90016** (`trilha_orfa_sem_conteudo`): portada a solução gerada na
  sessão anterior (`fato_v102_fixed.db`) — 5 `trail_steps` (M1-M5) + 6
  `trail_escola_links` para `TRL-CNCT-DG-001`. Conteúdo **gerado**, não
  reconstruído — pendente de revisão de curador.
- **Gap 90022** (`dado_corrompido`): `trails.name` de `TRL-CNCT-021` estava
  igual ao `trail_steps.nome` do step 1 ("Fundamentos de Panificação e
  Matérias-Primas"). Corrigido para `"Trilha do Profissional em Panificação
  e Confeitaria"` (padrão `cnct_label`, sem `atlas_trails` pra cruzar).
- **Gap 90023** (`dado_corrompido`): mesmo padrão em `TRL-CNCT-022`.
  Corrigido para `"Trilha do Profissional em Design Gráfico"`.
- Varredura completa confirmou que essas eram as **únicas 2** linhas com
  `trails.name == trail_steps.nome` (ordem=1) em todo o banco.

**Integridade:** 0 violações de FK · integrity_check ok

---

## v102_fixed (01/07/2026) — 90016 (1ª versão), 90017, 90021 resolvidos

**Origem:** `fato_v102.db` (upload original do usuário)

- **Gap 90017**: confirmado que `TRL-CNCT-016` e `TRL-CNCT-039` (ambas
  "Metalurgia", `atlas_num='II'`, `atlas_slug='soldagem'`) são trilhas
  distintas curadas independentemente (steps e escolas diferentes) —
  **não fez merge**.
- **Gap 90021** (novo, criado nesta sessão): vazamento de coluna —
  `trails.name` de 4 linhas (`TRL-CNCT-015/016/024/030`) continha
  `escola_sources.nome` em vez do nome real. Nomes reconstruídos via
  `atlas_trails.code` (015, 016) ou conteúdo de `trail_steps` (024, 030).
  Ressalva documentada: `TRL-CNCT-030` tem steps quase idênticos a
  `TRL-CNCT-004` (não é curadoria totalmente independente como o caso
  Metalurgia).
- **Gap 90016** (1ª tentativa): `TRL-CNCT-DG-001` populada com 5 steps +
  6 escola_links gerados a partir da `description` já existente (perfil
  gratuito/open-source, distinto de `TRL-CNCT-022`).

**Integridade:** 0 violações de FK · integrity_check ok

---

## Convenção de versionamento

Cada patch cria um novo arquivo (`fato_vNNN.db` ou `_fixed`/`_merged` como
sufixo de proveniência) em vez de sobrescrever o anterior. Todo patch:
1. Copia o banco de origem antes de editar.
2. Aplica só os `UPDATE`/`INSERT` do gap em questão.
3. Roda `PRAGMA foreign_key_check` + `PRAGMA integrity_check` antes de entregar.
4. Fecha o gap correspondente em `gaps_v2` com nota explicando o que foi
   feito e, quando relevante, qual suposição foi tomada no lugar do usuário.
