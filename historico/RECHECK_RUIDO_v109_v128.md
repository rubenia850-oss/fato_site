# Recheck do Relatório de Ruído — v109 → v128

**Método:** cada achado do `RELATORIO_RUIDO_BANCO.md` foi reconferido por query direta em `fato_v128.db`, comparado item a item com o estado anterior (`fato_v109.db`).

## Resumo

| Métrica | v109 | v128 | Situação |
|---|---|---|---|
| Empresas sem fonte E sem setor | 325/733 (44,3%) | 239/651 (36,7%) | 🟡 Melhorou, não foi zerado |

**86 linhas de ruído foram removidas. 239 continuam exatamente como estavam. Nenhum ruído novo apareceu.**

## Categoria por categoria

| # | Categoria | Status em v128 |
|---|---|---|
| 1 | Taxonomia de setor vazada em `companies` (23 linhas com crase, ex: `` `AUT` — Automação e Controle ``) | ❌ **Sem mudança** — as 23 linhas continuam, idênticas |
| 2 | Fragmentos de frase/rascunho | 🟡 **Maioria removida** — sumiram `(prioridade`, `(P-004).`, `(SENAI, perfuração...`, `(Regulatório...`, `+ organização setorial`, `& Controle Automação`, entre outras. **Ainda restam 2**: `"Preciso de QP técnica industrial..."` (id 415) e os dois fragmentos de cabeçalho de lista, `10 Programas de maior impacto...` (id 427) e `5. Programa Evoluir da Votorantim...` (id 430) |
| 3 | Possível vazamento de IA/pipeline (as 3 linhas mais graves) | ✅ **Removidas as 3** — `id 10228`, `10230` e `10279` não existem mais no banco |
| 4 | Corpo normativo catalogado como empresa (ASME/IEC/NR-13/ISO) | ❌ Não verificado como prioridade de remoção (não era recomendação de apagar, e sim de recategorizar) — segue presente, como esperado |
| 5 | "SETOR null" (fontes sem `industry_sector_id`) | ❌ **Sem mudança** — continua exatamente 129/497 (26%) |
| 6 | Corrupção de texto (espaço no meio de palavra) | ❌ **Sem mudança** — as 3 trilhas (`TRL-CNCT-001`, `TRL-IMO-007`, `TRL-PM-013`) continuam com o mesmo texto quebrado. **Adendo:** revendo `TRL-PM-013` agora reparei em mais 2 ocorrências no mesmo campo que não tinha citado antes — `venda`→`vend a` e `planejamento`→`pla nejamento`, mesma frase, mesmo padrão |

## Leitura

O que foi corrigido (achado mais grave — Categoria 3 — e a maior parte da Categoria 2) sugere uma limpeza pontual e manual dos casos mais visivelmente quebrados, não uma correção estrutural. As duas categorias que dependem de mudança de schema ou de pipeline (a taxonomia duplicada, o `null` na UI teria que ser tratado do nosso lado de qualquer forma, e a corrupção de texto) não foram tocadas — o que é esperado, já que são mais trabalhosas de resolver que apagar uma linha solta.

**O relatório original majoritariamente se mantém válido.** Recomendo continuar cobrando especificamente as categorias 1, 5 e 6 na próxima rodada — são as que exigem decisão de schema/pipeline, não simplesmente apagar uma linha.
