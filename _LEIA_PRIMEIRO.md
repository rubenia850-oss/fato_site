---
tipo: PROTOCOLO DE SESSÃO — obrigatório, não é documentação de projeto
não contém: números de versão, contagens, datas de "estado atual" (isso envelhece e mente — ver Regra 0)
---

# Protocolo de sessão — leia isto antes de tocar em qualquer arquivo

Este documento não descreve o projeto. Descreve **o que toda sessão (humana ou IA) deve fazer**, sempre, independente de quando for lida. Se você está procurando "qual é o estado atual", a resposta certa não está neste arquivo — está nos comandos da Regra 1. Qualquer número escrito aqui ficaria errado em poucos dias; por isso não há nenhum.

## Regra 0 — Por que este arquivo existe

Este projeto já teve duas sessões trabalhando em paralelo sem se comunicar: uma evoluindo o portal (`App.jsx`/`db.js`) contra uma versão do banco, outra evoluindo o banco (`fato_v*.db`) sem saber da primeira. O resultado foi uma feature já entregue (`micro_atlas_pdf`) sendo perdida silenciosamente numa versão posterior do banco, e meses de documentos descrevendo um "estado atual" que nenhum dos dois lados conferia de fato. Ver `_DECISIONS.md`, entradas D62-DB e D63-DB, para o caso completo.

Este arquivo existe para que isso não dependa de alguém lembrar de pedir. As regras abaixo são o procedimento — não uma sugestão.

## Regra 0.1 — Divisão de responsabilidade, a partir de 20/06/2026

A partir desta data, **as duas sessões deixam de operar como linhas paralelas que ocasionalmente se cruzam** e passam a ser papéis fixos e mutuamente exclusivos:

- **Sessão SITE** — único papel autorizado a editar `App.jsx`, `db.js`, `index.html`, e qualquer outro arquivo de `portal/` fora de `portal/dados/`. **Nunca** edita o conteúdo do `.db` (esquema, linhas, merges, limpeza de duplicata) — só **lê** o `.db` para testar suas próprias queries.
- **Sessão BANCO** (antes chamada "auditoria") — único papel autorizado a editar o `.db` (esquema, dados, qualidade, deduplicação, tabelas novas `dm_*` ou qualquer outra). **Nunca** edita `App.jsx`/`db.js`/`index.html` — só **lê** esses arquivos para saber o que o portal espera (Regra 1).

Isso substitui o modelo anterior (qualquer sessão podia, encontrando um problema do "outro lado", simplesmente corrigi-lo). **Não é mais permitido.** Se uma sessão SITE encontra um problema de dado (duplicata, valor ausente, inconsistência), ela registra um **pedido explícito** (ver modelo na Regra 4) em vez de corrigir o banco ela mesma — e vice-versa para a sessão BANCO encontrando algo que exigiria mudar `App.jsx`.

**Por quê:** a Regra 0 documenta um incidente causado por duas sessões mexendo nos dois lados sem avisar uma à outra. A correção daquele incidente específico (Sprint 14) ainda exigiu que a sessão SITE corrigisse dado no banco — um trabalho que, com a separação de papéis valendo a partir de agora, teria sido feito como **pedido formal** para a sessão BANCO executar, não como correção direta. O kit `KIT_AUDITORIA_BANCO_DADOS.md` (raiz do projeto) documenta esse episódio em detalhe e é o modelo de como um pedido formal entre sessões deve ser escrito.

## Regra 1 — Início de sessão: nunca confie em texto, confira o estado real primeiro

Antes de ler qualquer `.md` de "estado do projeto" (incluindo `portal/README.md`, `CHANGELOG_PORTAL.md`), rode isto primeiro:

```bash
# Qual .db é o canônico de fato (não confie em nome de arquivo nem em comentário de código)
ls -la portal/dados/*.db
grep "DB_PATH" portal/db.js
```

```sql
-- Dentro do .db que portal/db.js realmente aponta para:
SELECT version, created_at, description FROM db_versions ORDER BY version DESC LIMIT 10;
-- Leia a versão mais recente até o fim. Se ela mencionar "sessão paralela",
-- "auditoria", ou qualquer trabalho que você não reconhece, pare e leia
-- TODO o histórico de db_versions antes de continuar — pode haver uma
-- segunda linha de trabalho que você ainda não cruzou com o portal.
```

```bash
# As tabelas/colunas que o site espera existem de fato no banco que ele vai carregar?
# (substitua o nome do .db pelo que DB_PATH apontar)
grep -oE "FROM [a-z_]+" portal/App.jsx | sed 's/FROM //' | sort -u > /tmp/tabelas_usadas.txt
python3 -c "
import sqlite3
con = sqlite3.connect('portal/dados/NOME_DO_DB_AQUI.db')
existentes = set(r[0] for r in con.execute(\"SELECT name FROM sqlite_master WHERE type='table'\"))
usadas = set(open('/tmp/tabelas_usadas.txt').read().split())
faltando = usadas - existentes - {'search_idx'}  # search_idx é virtual/runtime, não conta
print('Tabelas que o site espera e o banco NÃO tem:', faltando or 'nenhuma')
"
```

Só depois dessas três checagens — e só se elas não revelarem nada estranho — vale ler `portal/README.md` para contexto de arquitetura e vocabulário (ele não muda tanto quanto o estado de dados).

## Regra 2 — Sessão BANCO (única que toca no `.db`) precisa, antes de fechar:

1. **Rodar a checagem de schema da Regra 1** contra o resultado do seu próprio trabalho — não assuma que o que você criou/removeu é seguro para o portal sem testar.
2. **Registrar em `db_versions`** o que mudou — não só tabelas novas, mas qualquer coluna alterada ou removida de tabela que o portal já consome (`grep` na Regra 1 mostra quais são).
3. **Se removeu ou renomeou uma coluna**, procurar por ela em `portal/App.jsx` antes de finalizar. Se ela aparecer lá, a remoção vai quebrar algo — **não corrija o `App.jsx` você mesma** (Regra 0.1). Registre um pedido explícito para a sessão SITE (modelo na Regra 4) e, se possível, evite remover a coluna até a sessão SITE confirmar que pode.
4. **Copiar o `.db` final para `portal/dados/`** e confirmar que `portal/db.js` (`DB_PATH`) aponta para o nome de arquivo certo. Se isso exigir editar `db.js`, é a única exceção à Regra 0.1 permitida sem pedido formal — é uma troca de 1 linha (caminho do arquivo), não lógica de portal.

## Regra 3 — Sessão SITE (única que toca em `App.jsx`/`db.js`/`index.html`) precisa, antes de fechar:

1. **Rodar de fato as queries novas/alteradas** contra o `.db` real em `portal/dados/` (não confiar em "deveria funcionar" — rodar o SQL contra o arquivo de verdade).
2. **Se uma query espera uma coluna que não existe**, não adicionar a coluna você mesma no banco (Regra 0.1) e não adicionar dado fantasma só para a query passar. Registre um pedido explícito para a sessão BANCO (modelo na Regra 4) e trate a feature como bloqueada até a coluna existir de fato.
3. **Se encontrar um problema de qualidade de dado** (duplicata, valor inconsistente, FK órfã) enquanto testa uma query — mesmo que pareça simples de corrigir — não corrija você mesma. Registre o pedido (Regra 4) com a evidência que você já levantou, para a sessão BANCO não precisar refazer a investigação do zero.
4. **Atualizar `_BACKLOG.md`** se a tarefa abriu ou fechou algum item — não deixar para uma sessão de documentação separada.

## Regra 4 — Encontrou algo que precisa de ajuste do outro lado? Registre um pedido, não execute (resumo — caso completo em D63-DB/D64-DB a D67-DB)

- Banco perdeu algo que o site espera e que existia antes → **pedido para a sessão BANCO**: restaurar, se o dado original ainda existe em alguma versão anterior.
- Banco ganhou algo novo que o site não usa ainda → não é bug, é item de `_BACKLOG.md` (decisão de produto) — nenhuma sessão precisa "ajustar" nada, só registrar a oportunidade.
- Site espera algo que nunca existiu de verdade no banco → **pedido para a sessão SITE**: a suposição de schema estava errada, corrigir a query/lógica, não forçar dado fantasma no banco.
- Site encontrou um problema de qualidade de dado ao testar (duplicata, inconsistência) → **pedido para a sessão BANCO**, com a evidência já levantada (queries usadas, ids afetados, critério de decisão se já houver um precedente documentado em `_DECISIONS.md`).

**Modelo de pedido** (registrar em `_BACKLOG.md`, com referência cruzada em `_DECISIONS.md` se envolver critério de decisão não-trivial): o que foi encontrado, evidência (query + resultado), impacto se não for corrigido, e se já existe precedente de decisão similar documentado (cite o D-número). A sessão que vai executar não deveria precisar reabrir a investigação do zero.

## Regra 5 — Ao fechar QUALQUER sessão (banco, site, ou documentação), atualizar nesta ordem:

1. `db_versions` (dentro do próprio `.db`, se algo nele mudou) — é o único lugar que uma sessão futura *de qualquer tipo* vai necessariamente cruzar, mesmo que nunca abra os `.md`. Sessão SITE: só registra aqui se a Regra 2 item 4 te deu permissão (troca de `DB_PATH`); qualquer outra mudança de banco não é sua para registrar, porque não é sua para fazer.
2. `_DECISIONS.md` — se houve decisão de arquitetura, schema, ou critério de resolução de ambiguidade.
3. `CHANGELOG_PORTAL.md` — o que foi entregue nesta sessão, em 1 parágrafo + tabela se houver mais de 1 item.
4. `_BACKLOG.md` — itens abertos ou fechados, **incluindo qualquer pedido novo para o outro lado** (Regra 4) — esse é o canal oficial de comunicação entre as duas sessões agora, não mais a correção direta.
5. `portal/README.md`, seção "Estado atual" — só se algo nela ficou errado (contagens, nome do `.db`, sprint atual). Não copie números de outro lugar sem confirmar com uma query/comando real primeiro.

Pular qualquer um desses é o motivo exato pelo qual a divergência da Regra 0 aconteceu.

## Regra 6 — O que fazer se você (sessão atual) achar uma contradição entre dois documentos

Nunca decida por "qual parece mais recente pela data escrita no topo" — datas em texto podem estar erradas ou desatualizadas (é exatamente o que causou o problema original). Decida por evidência executável: rode a query ou comando que confirma o fato no sistema real (banco, código), e corrija o documento errado imediatamente, não depois.

**Isso vale também para arquivos de trabalho da sua própria sessão, não só para documentos externos ou de outras sessões.** Achado real (22/06): uma cópia de trabalho intermediária continha uma decisão e uma entrada de changelog com números fabricados, sem nenhuma execução real por trás — incluindo a menção a uma regra de `meta_protocolo` que nunca tinha sido criada. Antes de copiar qualquer `.md` de uma pasta de trabalho para a entrega final, reconfirme cada número citado contra uma query real no banco, mesmo que você mesmo tenha "escrito" aquele arquivo antes na mesma sessão.

## Regra 7 — Nunca deixe um único documento ser "a resposta" — mantenha fontes cruzáveis

O incidente da Regra 0 (e sua repetição em D69-DB, mesmo já com a Regra 0.1 valendo) só foi descoberto porque havia fontes independentes que podiam ser confrontadas uma contra a outra. Se existisse um único documento de "estado atual", ele teria envelhecido silenciosamente e ninguém teria como notar.

Por isso, a tabela `gaps` (dentro do `.db`, lado BANCO) e o `_BACKLOG.md` (fora do `.db`, canal entre as duas sessões) devem **coexistir como fontes independentes e cruzáveis** — não um substituindo o outro. Isso é proposital, não duplicação a ser eliminada.

**Toda sessão BANCO deve, antes de fechar:**

1. Rodar esta checagem cruzada — qualquer linha de `gaps` com status não-resolvido (`impacto` nulo, ou que não comece com "Resolvido"/"Superado"/"Já cobre") precisa ter equivalente reconhecível em `_BACKLOG.md`:
   ```sql
   SELECT id, type, impacto, observacao FROM gaps
   WHERE impacto IS NULL OR (impacto NOT LIKE 'Resolvido%' AND impacto NOT IN ('Já cobre','Superado'));
   ```
   Para cada resultado, `grep` por nome de empresa/termo-chave em todos os `.md` do projeto. Mencionado só de passagem (ex.: numa lista histórica de fichas criadas) **não conta** como documentado — tem que descrever o gap em si, não só citar o nome.

2. Não confiar apenas em status com texto de progresso ("Em Progresso", "Parcialmente Resolvido") para achar itens obsoletos — rótulos de severidade ("Alto", "Médio", "Baixo") também podem esconder dado obsoleto. Verificar o **fato afirmado**, não só o rótulo de status.

3. Qualquer gap sem equivalente no `_BACKLOG.md` deve ganhar uma entrada nova lá. **Antes de escolher o número `SP-NN`, confirme o próximo número livre real no arquivo que será de fato entregue** — não assuma a partir de memória de sessão anterior. Foi exatamente a violação desta regra que causou a colisão SP-13/14 entre a sessão BANCO e a Sprint 14/SITE em 20-21/06/2026 (ver D69-DB) — ambas escolheram o mesmo número, cada uma sem saber da outra, porque "próximo número livre" foi assumido de memória, não confirmado no arquivo real no momento da entrega.

4. Se o `_BACKLOG.md` citar um número (contagem de casos) que não bate mais com uma query real no banco, corrigir o número ali também — números errados em documentação são tão perigosos quanto gaps não documentados.

5. Se uma fusão/merge de entidade central (`companies`, `cnct_profiles`) invalidar um `company_id`/`profile_id` referenciado em `gaps`, **verifique se a própria operação de merge já propagou a correção** (pode já estar certo) antes de "corrigir" algo que não está quebrado — e, se a referência realmente quebrou, corrija pelo nome/contexto, não apague a entrada.

## Regra 8 — Todo patch externo recebido pela sessão BANCO passa pelo pipeline de validação antes de qualquer aplicação

A partir de 27/06/2026, depois de 5 patches externos avaliados manualmente (~30-60 min de revisão cada),
essa checagem foi automatizada e depois **fundida com 2 ferramentas externas** (`audit_sql_patch_v2.py` +
`fix_sql_patch_v2.py`, recebidas do responsável) num pipeline único de 4 estágios.

**Ferramenta:** `00_pipeline_completo.py` (orquestra `01_auditar_estatico.py` → `02_corrigir_automatico.py`
→ `01` de novo → `03_validar_dinamico.py`; todos entregues junto com este protocolo).

**Uso obrigatório, sempre que um patch `.sql` externo for recebido, antes de ler o conteúdo linha a linha:**
```bash
python3 00_pipeline_completo.py <patch.sql> <banco_atual.db> --backlog _BACKLOG.md --decisions _DECISIONS.md
```

**O que cada estágio verifica:**
1. **Auditoria estática** (sem precisar do banco): duplicata exata, near-duplicata por Jaccard (calculado
   só sobre a parte após `VALUES`, não a linha inteira — boilerplate de coluna infla falso positivo),
   `ALTER TABLE` duplicado (quebra a execução), balanço `BEGIN`/`COMMIT`, `PRAGMA foreign_keys` sem par,
   slug/trail_id/source_id fora do padrão esperado, corrupção visível de extração de PDF.
2. **Correção automática** (só o que é seguro decidir sem julgamento humano): remove slug de empresa
   lixo (~80 padrões regex conhecidos), corrige espaço intra-palavra de OCR (corpus de 2070 palavras),
   injeta `PRAGMA foreign_keys=ON` ausente, comenta `ALTER TABLE` duplicado, remove duplicata exata.
3. **Auditoria estática de novo** no patch corrigido — confirma queda de issues, mostra antes/depois.
4. **Validação dinâmica contra o banco real** (só esta etapa precisa do `.db` de verdade): execução
   completa, `PRAGMA foreign_key_check`, escrita indevida em `db_versions`, `LIKE '%padrão%' LIMIT 1`
   sem `ORDER BY` resolvendo FK, numeração `SP-NN`/`D-NN-DB` citada — existe? e se existe, o **conteúdo**
   em torno bate com o que o número real significa em `_BACKLOG.md`/`_DECISIONS.md`? — e propagação de
   `DELETE FROM companies` pras 5 tabelas conhecidas com FK.

**Saída final:** lista do que foi ✅ resolvido automaticamente (não precisa de decisão), o que ficou em
`review_needed.txt` (decisão humana específica, com contexto already extraído) e o resultado ⚠️/🔴 da
etapa dinâmica. Nunca aplicar um ⚠️/🔴 silenciosamente só porque não houve erro técnico.

**Limites honestos desta ferramenta — não é um oráculo:**
- Toda checagem heurística (fragmento, conteúdo de SP-NN, near-duplicata) é triagem, não veredito final — sempre olhar a amostra impressa antes de decidir.
- A ferramenta **não decide nada** — toda saída ⚠️/🔴 exige decisão humana explícita, registrada como sempre em `gaps`+`_BACKLOG.md`+`_DECISIONS.md`.
- A ferramenta roda dentro desta sessão/ambiente — **não impede** uma sessão diferente de aplicar um patch sem rodá-la primeiro. A barreira real é o protocolo (este arquivo) ser lido e seguido, mais a ferramenta tornar isso rápido o suficiente para não haver desculpa de "não deu tempo de revisar".
- Os scripts recebidos do responsável tinham 4 bugs reais (incompatibilidade com notação `[tabela]` entre colchetes; Jaccard inflado por boilerplate de coluna; regex de slug não pulando `id` numérico líder em 2 lugares) — corrigidos nesta versão. Reportar isso de volta a quem mantém os originais, já que os bugs de extração do pipeline upstream estão sendo corrigidos em paralelo.

**Testada e validada (27/06/2026)** contra os 2 patches mais complexos já recebidos nesta linha — depois
das correções, reproduz exatamente os achados da revisão manual original em ambos, e **achou 1 caso novo
que a revisão manual tinha perdido** (4 sources de `escola_sources` duplicadas por variação de
capitalização/ordem de palavra — texto limpo, mas redundante, categoria fora do alcance da heurística de
fragmento usada manualmente).

## Regra 9 — Relação com os documentos de estado da sessão BANCO (`ESTADO_ATUAL.md`, `CHANGELOG.md`, `HISTORICO_SESSOES.md`)

A partir da migração de convenção documentada em D80, a sessão BANCO passou a manter seus próprios documentos de estado: `ESTADO_ATUAL.md` (retrato do momento, **sobrescrito a cada versão** — não é histórico, é o presente) e `HISTORICO_SESSOES.md` (decisões de processo do lado BANCO). Isso **não substitui nem é substituído** por este protocolo — são coisas diferentes por design:

- **Este arquivo (`_LEIA_PRIMEIRO.md`)** é atemporal, cross-sessão, e propositalmente não contém número nenhum que possa envelhecer.
- **`ESTADO_ATUAL.md`** é o inverso proposital: só números do momento, sobrescrito a cada versão, específico do lado BANCO.

Se você é sessão SITE e quer saber o estado mais recente que o BANCO já viu do próprio banco (gaps ativos, pendências deles, contagens que eles já verificaram), leia `ESTADO_ATUAL.md` — mas **ainda assim rode a Regra 1 primeiro**, porque o `ESTADO_ATUAL.md` deles pode estar descrevendo uma versão anterior à que você recebeu.


