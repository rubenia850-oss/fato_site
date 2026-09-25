# README — Comece por aqui

Pacote da versão **v94** (2026-06-29) do banco `fato.db`.

## 🔴 Leia primeiro se você só tem 1 minuto

- **29 gaps ativos** no banco — nenhum bloqueante.
- **Resolvidos nesta sessão (v87→v91):** os 7 gaps "parcialmente resolvidos" foram
  reativados com nota explícita (111, 112, 113, 116, 165, 172, 195); gap 90006
  (rebuild `source_cnct_profiles` setores 4–12) e gap 90007 (sector_code) foram
  **encerrados**.
- **Gap 90002** (fórmula `score_oportunidade`) tem agora uma análise estatística
  registrada (R²=0,92, não confirmada) — ainda ativo, aguardando confirmação da
  fórmula original.
- Tudo isso está detalhado em **`ESTADO_ATUAL.md` §5** (tabela de prioridades).

## Ordem de leitura recomendada

| Ordem | Arquivo | Quando ler |
|---|---|---|
| 1 | **`ESTADO_ATUAL.md`** | Sempre. É o estado vivo e atual do banco — comece aqui. |
| 2 | `SCHEMA.md` | Quando precisar entender o que uma tabela/view faz, suas colunas-chave ou FKs — dicionário de dados completo (107 tabelas + 14 views). |
| 3 | `CHANGELOG.md` | Quando precisar entender *como* o banco chegou a este estado, versão por versão. |
| 4 | `HISTORICO_SESSOES.md` | Quando precisar entender uma decisão de processo/curadoria específica (não é mudança de dado). |
| 5 | `auditorias/*.md` | Só se for investigar uma divergência específica já resolvida — arquivo de referência, não leitura corrente. |

## Arquivos neste pacote

```
fato_v94.db                ← o banco de dados (fonte de verdade)
ESTADO_ATUAL.md            ← snapshot vivo: contagens, gaps abertos, pendências
SCHEMA.md                  ← dicionário de dados: toda tabela/view, propósito, colunas-chave, FKs
CHANGELOG.md               ← histórico técnico acumulado, v81 → v91
HISTORICO_SESSOES.md       ← decisões de processo/sessão, v14 → v67+
auditorias/
  AUDITORIA_CRUZADA_v86_1.md   ← auditoria pontual (v86.1), já incorporada ao ESTADO_ATUAL — registro histórico, não editar retroativamente
```

## Regra de manutenção (para qualquer sessão futura, humana ou LLM)

> **O banco é sempre a fonte de verdade.** Qualquer número em log, changelog ou patch SQL
> arquivado deve ser conferido por query direta antes de ser aceito como fato.

Ao gerar uma nova versão (`v92` em diante):
1. Sobrescreva `ESTADO_ATUAL.md` por completo com o novo estado verificado.
2. Adicione uma seção nova **no topo** de `CHANGELOG.md`.
3. **Se a versão criar tabela ou view nova, adicione a entrada em `SCHEMA.md` no mesmo
   patch** — é a causa raiz das 8 views órfãs que existiam sem documentação até esta versão.
4. Não crie arquivos `_v87`, `_v88`... soltos — estes arquivos absorvem tudo.
5. Gere um novo zip da versão e arquive o anterior, se quiser manter histórico de pacotes.

Cada um dos 4 arquivos `.md` também tem esse protocolo repetido no topo e no fim, então
qualquer um deles funciona como ponto de entrada se você abrir direto.
