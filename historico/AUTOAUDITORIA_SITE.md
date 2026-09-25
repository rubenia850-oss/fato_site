# Autoauditoria — sessão SITE

**Data:** 04/07/2026 · **Método:** mesma régua aplicada ao banco (evidência por query/teste direto, não impressão), agora virada pro meu próprio trabalho.

---

## 🔴 Achado real, corrigido nesta sessão

### Poluição da tabela `db_versions` (namespace do BANCO) com as minhas próprias notas de sincronização

Desde a sincronização #5 venho inserindo entradas na tabela `db_versions` — a mesma tabela onde o BANCO registra o histórico real do projeto (versões 1 a 80, depois migrado pra `db_versions_v2`). Inseri ali minhas próprias notas de sincronização usando números escolhidos por mim (98, 99... até 109), sem nenhuma base de negociação com o outro lado.

**Isso é exatamente a categoria de risco que eu vim cobrando do BANCO** (D79 — colisão de numeração `SP-23/24`; `SP-39`/`SP-40` — pedido de convenção de ID por branch). Eu cometi a mesma falha, na minha própria tabela deles.

Concretamente, no `fato_v128.db` que eu estava prestes a reempacotar: `db_versions` ia de 1 a 80 (histórico real do BANCO) e depois pulava direto pra 108 e 109 (minhas notas), sem nenhuma explicação do buraco. Qualquer pessoa consultando essa tabela isoladamente teria a impressão de que 27 versões (81-107) desapareceram.

**Correção aplicada:**
1. Criei uma tabela nova, `site_sync_log`, com numeração própria (`sync_round`), sem nenhum contato com o espaço de versão do BANCO.
2. Migrei minhas 2 entradas (108, 109) pra lá.
3. Removi as duas de `db_versions`, restaurando o histórico real do BANCO limpo, de 1 a 80.
4. Deixei uma única nota de rodapé na versão 80 explicando a migração pro `db_versions_v2` e apontando pra `site_sync_log` — sem inventar número novo.

**Nota:** o pacote anterior (`fato_v109.db`, já entregue em zips anteriores) ainda tem o problema original — não reemiti retroativamente, mas fica registrado aqui que esse artefato específico tem a poluição de numeração. Dessa sincronização em diante, uso `site_sync_log`.

---

## 🟡 Achado de documentação, corrigido

### `RELATORIO_RUIDO_BANCO.md` estava desatualizado sem aviso

O relatório original de ruído (feito em cima da v109) segue com "325 de 733 empresas" como se fosse o estado atual, mesmo depois de eu já ter feito e entregue um recheck (`RECHECK_RUIDO_v109_v128.md`) mostrando que isso caiu pra 239/651. Quem abrisse só o relatório original, sem saber que existe um recheck, seria enganado.

**Correção aplicada:** adicionei um aviso no topo do relatório original, apontando pro recheck e deixando claro que os números ali são históricos (v109), não correntes.

---

## ✅ Verificações que rodei e confirmaram que o trabalho está sólido

| O que verifiquei | Método | Resultado |
|---|---|---|
| Todas as 11 chaves de JOIN usadas no código do Grupo B/C (`dm_roi_estudo`, `dm_dificuldade_estimada`, `dm_tecnologias_por_trilha`, `dm_soft_skills_por_trilha`, `dm_premio_transferencia`, `dm_roteiro_carreira`, `dm_versatilidade_trilhas`, `dm_rede_centralidade`, `dm_rede_comunidades`, `dm_densidade_setorial`, `dm_competicao_talentos`) ainda batem no banco atual (v128), não só no v109 onde foram implementadas | Query direta, `LEFT JOIN ... WHERE ref.id IS NULL` | 0 órfãos em todas as 11 — nenhuma regressão |
| Checagem de schema (Regra 1): toda tabela/view que `App.jsx` consulta existe no v128 | Grep de todos os `FROM` + comparação com `sqlite_master` | 0 faltando, 57 tabelas/views usadas |
| O bug crítico de hooks (`App()`, corrigido no D88) continua corrigido no banco atual, não só no v109 onde foi encontrado | Render real (Playwright + Chromium headless) contra `fato_v128.db`, navegação pelas 10 abas + abertura de perfil | Sem erro de React em nenhuma tela |
| `App.jsx` não teve nenhuma mudança silenciosa entre a rodada do Grupo C e a rodada de ruído (sync5 → sync6) | `diff` byte a byte dos dois arquivos | Idêntico |

## 🟢 Erro de processo próprio, sem impacto no produto entregue

Ao reconfirmar o render contra o v128, copiei o `db.js` real do projeto por cima do `db.js` que eu tinha adaptado pro meu ambiente de teste (que aponta pro `sql.js` local em vez do CDN bloqueado no meu sandbox) — quebrei meu próprio teste por um instante (todas as 10 capturas de tela saíram idênticas e vazias, 403 do CDN). Percebi pelo tamanho suspeito dos arquivos (todos exatamente 20.872 bytes), reapliquei o patch de ambiente, e retestei do zero. Não afetou nada do que foi entregue — é só sobre o meu processo de verificação, registrado aqui por hábito de transparência.

---

## O que não voltei a checar (limitação desta autoauditoria)

Não reexecutei manualmente cada uma das 10 telas visualmente pixel a pixel — validei via ausência de erro de console + confirmação de schema/join, que é o mesmo padrão de evidência que uso pra tudo neste projeto, mas não é 100% equivalente a inspeção visual completa de cada tela depois do Grupo C. Se quiser, posso gerar o tour completo de screenshots do v128 pra conferência visual, não só os logs.
