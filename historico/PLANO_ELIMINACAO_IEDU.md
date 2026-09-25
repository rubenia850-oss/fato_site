# Plano de Migração e Eliminação — Documentos `iedu_*`

**Data:** 24/06/2026 · **Sessão:** SITE · **Pedido original:** eliminar os 8 arquivos `iedu_*` da raiz do projeto, por crença de que "não têm nada útil".

## Resultado da investigação

A crença não se confirmou por igual nos 6 arquivos não marcados como obsoletos. Cada um tem um perfil de valor diferente — não é uma decisão binária "apagar tudo" ou "manter tudo".

| Arquivo | Tamanho | Veredito | Ação recomendada |
|---|---|---|---|
| `iedu_integracao_v1.0.md` | 15 KB | Já marcado `.OBSOLETO` pelo próprio sistema, conteúdo confirmado migrado | ✅ Apagar agora (com o marcador) |
| `iedu_sumario_v2.0.md` | 6,7 KB | Já marcado `.OBSOLETO` pelo próprio sistema, conteúdo confirmado migrado | ✅ Apagar agora (com o marcador) |
| `iedu_atlas_v1.0.md` | 521 KB | **Gap crítico confirmado** — 55 perfis de destino (PE/PS/PD) com mercado, remuneração, saídas intermediárias e sequência de estudo, **ausentes 100% do banco** | ⏳ Migrar primeiro — dado já extraído e validado nesta sessão (ver abaixo) |
| `iedu_setores_v7.0.md` | 476 KB | **Alto valor confirmado** — 12 fichas executivas por setor (matriz de acesso por perfil, gaps críticos) + 4 trilhas de aprendizagem, sem equivalente no banco | ⏳ Migrar — extração ainda não feita, escopo mapeado abaixo |
| `iedu_cnct_extracao_v1.0.md` | 32 KB | **Valor médio — extração concluída nesta sessão** | ✅ Dado pronto (`extracao_cnct_justificativa.json`), apagar após carga |
| `iedu_cnct_fundamentos_v1.0.md` | 80 KB | **Baixo valor remanescente** — confirmado por comparação literal (`Técnico em Petroquímica`) que o conteúdo já foi migrado palavra por palavra para `cnct_profiles` | ✅ Quase pronto para apagar — só falta confirmar os outros ~25 perfis com a mesma checagem |
| `iedu_guia_v6.3.md` | 459 KB | **Valor baixo-médio, volume alto** — metadado (`url`, `idioma`, `cadastro`, `destaques`) já capturado fielmente em `sources.highlight`; só falta o parágrafo narrativo de contexto por fonte (centenas de entradas) | ⏳ Decisão de prioridade — ver nota abaixo |
| `iedu_indice_v4.1.md` | 93 KB | **Confirmado baixo valor** — spot-check completo (perfil #1, todos os campos: CBOs, setores, normas) bate exatamente com o banco. Único conteúdo único: 2 notas de desambiguação de CBO sobreposto (Seção 9) | ✅ Dado pronto (2 registros, ver abaixo), apagar após decisão sobre as 2 notas |

## O que já está pronto para a sessão BANCO executar

### 1. Atlas — 55 perfis de destino, extraídos e validados (match 55/55 contra `atlas_destination_profiles`)

Arquivo `extracao_atlas_pe_ps_pd.json` (entregue junto com este plano) contém, para cada um dos 55 perfis PE/PS/PD: `atlas_num`, `code`, `nome`, `linha` de origem, e `full_text` com o bloco completo (descrição, mercado de atuação, remuneração de referência, saídas intermediárias, sequência de estudo — os campos variam um pouco entre os perfis de Petroquímica, mais elaborados, e os dos outros 8 Atlas, mais compactos, mas o texto completo preserva tudo).

**Proposta de schema:** adicionar 1 coluna `descricao_completa TEXT` em `atlas_destination_profiles` (mais simples, preserva tudo, permite extração de subcampos específicos depois se for útil) — em vez de tentar forçar 5-6 colunas estruturadas separadas, que arriscaria perder nuance dado que o formato varia entre Petroquímica (mais detalhado, com tabela de saídas intermediárias) e os outros 8 Atlas (mais compacto).

```sql
ALTER TABLE atlas_destination_profiles ADD COLUMN descricao_completa TEXT;
-- depois, popular com os 55 registros de extracao_atlas_pe_ps_pd.json, casando por (atlas_num, code)
```

### 2. CNCT — 22 parágrafos "Por que é essencial para I4.0/I5.0" extraídos e validados

Arquivo `extracao_cnct_justificativa.json` (entregue junto com este plano). De 26 perfis no documento, **22 têm o campo preenchido** (match 26/26 por nome contra `cnct_profiles`; os 4 sem justificativa — Eletroeletrônica, Eletromecânica, Mecânica, Metalurgia — foram confirmados por inspeção direta como genuinamente ausentes no documento original, não falha de extração).

A extração precisou de 3 rodadas de ajuste de regex: o rótulo do campo varia entre "I4.0/I5.0", "I4.0" e "I5.0" sozinhos, e o texto às vezes vem na mesma linha do rótulo, às vezes na linha seguinte — documentado aqui para quem for extrair conteúdo parecido de outro arquivo não cometer o mesmo retrabalho.

```sql
ALTER TABLE cnct_profiles ADD COLUMN justificativa_i4_i5 TEXT;
-- popular com os 22 registros de extracao_cnct_justificativa.json, casando por profile_id (já resolvido no JSON)
```

### 3. Índice — 2 notas de desambiguação de CBO sobreposto (Seção 9)

Conteúdo pequeno, incluído direto aqui em vez de arquivo separado:

| CBO | Perfis que o citam | Critério de distinção (resumo — texto completo na Seção 9 do arquivo) |
|---|---|---|
| `311205` (Técnico em petroquímica) | #20 Técnico em Química · #27 Técnico em Petroquímica | #20 = processos químicos gerais (síntese, controle de qualidade, laboratório); #27 = refino/petroquímica especificamente (fracionamento, reações catalíticas, planta O&G). Critério primário: texto do "campo de atuação" ("em geral" vs. "petroquímicas e de refino") |
| `316325` (Técnico de produção em refino de petróleo) | #21 Técnico em Petróleo e Gás · #27 Técnico em Petroquímica | #21 = operacional/campo (perfuração, completação, operação offshore/onshore); #27 = processo industrial (engenharia de processo, operação de unidades de refino). Cruzar com séries do Atlas: A/B para #21, A/A5 para #27 |

Proposta: nova tabela `cnct_cbo_disambiguacao (cbo TEXT, profile_id_1 INTEGER, profile_id_2 INTEGER, criterio TEXT)`, ou simplesmente um campo de observação em `cnct_cbos` para os 2 códigos afetados — volume baixo, qualquer formato serve.

### 4. Achado incidental, agora confirmado em escala e com correção pronta — troca de coluna em `cnct_profiles`

O que parecia ser 1 caso isolado (Petroquímica) é, na verdade, **18 de 29 perfis** cobertos por `iedu_cnct_fundamentos_v1.0.md` (62%): `campo_atuacao` e `infraestrutura_requerida` têm o mesmo valor duplicado no banco. Causa raiz identificada com certeza: o markdown-fonte usa rótulos em texto puro (sem negrito), com "Infraestrutura mínima requerida" e "Campo de atuação" listados em sequência, seguidos pelos 2 blocos de conteúdo correspondentes NA MESMA ORDEM — um padrão fácil de ler para humano, mas que qualquer script de extração ingênuo (não necessariamente desta sessão; a extração original aconteceu antes da Sprint 6) tem boa chance de embaralhar.

Escrevi e validei um parser correto para os 29 perfis (validado por amostra: o texto extraído para "Técnico em Petroquímica" bate exatamente com a leitura manual feita nesta mesma sessão). Resultado em `extracao_cnct_fundamentos_corrigido.json`: para cada perfil, `perfil_conclusao` (confirmado já correto no banco, incluído só para conferência), `infraestrutura_correta` e `campo_atuacao_correto` (os valores certos, prontos para sobrescrever os 18 casos com bug).

**18 perfis afetados:** Petroquímica, Petróleo e Gás, Química, Análises Químicas, Automação Industrial, Eletrotécnica, Eletroeletrônica, Eletrônica, Eletromecânica, Mecatrônica, Fabricação Mecânica, Metrologia, Soldagem, Metalurgia, Sistemas de Energia Renovável, Biocombustíveis, Segurança do Trabalho, Logística.

**1 perfil sem match de nome exato:** "TÉCNICO EM MANUTENÇÃO" no documento — provavelmente corresponde a um nome mais específico no banco (ex.: "Técnico em Manutenção de Máquinas Industriais"); a sessão BANCO precisa confirmar qual.

```sql
-- Exemplo para 1 perfil — repetir para os 18, usando extracao_cnct_fundamentos_corrigido.json
UPDATE cnct_profiles
SET infraestrutura_requerida = '<infraestrutura_correta do JSON>',
    campo_atuacao = '<campo_atuacao_correto do JSON>'
WHERE name = 'Técnico em Petroquímica';
```

## O que ainda não foi extraído (escopo mapeado, trabalho não feito)

- **Setores (12 fichas executivas + 4 trilhas de aprendizagem):** maior peça de trabalho restante. Cada ficha tem ~50 linhas de análise sintetizada (indicadores, matriz de acesso por perfil, gaps, particularidades) que não existe em nenhuma tabela atual — mais perto de conteúdo editorial do que de dado estruturado, então a forma de migração (nova tabela vs. documento de referência fora do banco) é uma decisão de produto, não só técnica.
- **Guia — parágrafos de contexto narrativo:** centenas de entradas (1 por fonte cadastrada em `sources` layer=guia/technical), cada uma com 1-2 parágrafos explicando por que a fonte importa. Volume alto, valor mais "nice to have" editorial do que operacional — sugiro decidir prioridade separadamente do resto deste plano, não bloquear a eliminação dos outros arquivos por causa deste.

## Plano de execução recomendado

1. ~~**Agora:** apagar `iedu_integracao_v1.0.md`, `iedu_integracao_v1.0.OBSOLETO.md`, `iedu_sumario_v2.0.md`, `iedu_sumario_v2.0.OBSOLETO.md`~~ ✅ feito (Sprint 17)
2. **Pedido para a sessão BANCO** (registrado em `_BACKLOG.md` SP-24): aplicar as 2 migrações com dado já pronto (Atlas — item 1, CNCT — item 2), decidir formato de destino para as 2 notas de desambiguação (item 3), e investigar o achado de troca de coluna (item 4) antes de qualquer exclusão dos arquivos CNCT.
3. **Depois da migração do Atlas confirmada:** apagar `iedu_atlas_v1.0.md`.
4. **Depois da migração do CNCT confirmada e do achado de troca de coluna resolvido:** apagar `iedu_cnct_extracao_v1.0.md` e `iedu_cnct_fundamentos_v1.0.md`.
5. **Depois da migração das 2 notas do Índice confirmada:** apagar `iedu_indice_v4.1.md`.
6. **Decisão de produto pendente** (não bloqueia o resto): o que fazer com o conteúdo de Setores e os parágrafos narrativos do Guia — manter os arquivos até essa decisão, ou arquivar fora do pacote de trabalho ativo (ex: pasta `histórico/` como já foi feito com outros arquivos obsoletos no passado) em vez de apagar de fato.

## Redução de tamanho esperada

Já removido (grupo 1, Sprint 17): ~23 KB.
Pronto para remover após carga pela sessão BANCO (Atlas + CNCT + Índice, dado já extraído e validado): ~626 KB.
Restante até decisão de produto (Setores + Guia): ~935 KB.
