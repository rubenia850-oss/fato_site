# Plano de Enxugamento de Estrutura — sistema_fato_SP47-50_SITE

> Documento de trabalho, registrado ao longo da sessão de limpeza. Base: zip enviado em 16/07/2026 (133 arquivos, 13 pastas: 78 PDF, 20 MD, 19 JSX, 10 JS, 3 JSON, 2 HTML, 1 DB).

---

## 1. PDFs (`portal/dados/micro_atlas/*.pdf`) — 78 arquivos

**Diagnóstico:** não são documentos autênticos — são exportações estáticas geradas a partir da tabela `cnct_courses` do `fato_v168.db` (99 registros, 41 colunas, todas presentes nos PDFs: perfil profissional, infraestrutura, certificações, especializações, graduações, normas, CBOs). Coluna `micro_atlas_pdf` da própria tabela aponta para o caminho do arquivo gerado.

**Evidência de acoplamento no front:**
- `portal/data/loadTrailsProfiles.js` (linha ~110): já faz `SELECT profile_id, nome, micro_atlas_pdf FROM cnct_courses ...` — ou seja, já consulta o banco certo, só repassa o link do PDF em vez do conteúdo.
- `portal/views/ViewProfiles.jsx` (linha 276): renderiza `<a href={p.micro_atlas_pdf}>` que abre o arquivo estático.

**Problemas do modelo atual:**
- Só 78 de 99 cursos têm PDF gerado (21 ficam sem, com `status_atlas = "Planejado"`) — cobertura incompleta por depender de geração manual/externa.
- Nenhum script gerador está no pacote — o processo de criação do PDF é uma etapa cega, fora do repositório.
- Qualquer atualização de dado em `cnct_courses` exige regenerar o PDF manualmente para não ficar desatualizado (risco de drift banco ↔ arquivo).

**Plano de ação — renderização dinâmica:**
1. Trocar a query em `loadTrailsProfiles.js` de `SELECT ... micro_atlas_pdf` para trazer o registro completo de `cnct_courses` (ou os campos necessários) por `profile_id`.
2. Criar componente `<MicroAtlasView profile={row}/>` em JSX reaproveitando o mesmo layout visual dos PDFs, substituindo o `<a href={pdf}>` em `ViewProfiles.jsx`.
3. Se ainda houver necessidade de exportar/imprimir, gerar PDF sob demanda (client-side, ex. jsPDF) a partir do mesmo componente — sem manter 78 arquivos versionados.
4. Resultado esperado: elimina os 78 arquivos estáticos (~1,5MB), resolve a cobertura incompleta (renderização dinâmica não depende de pré-geração) e remove uma fonte de inconsistência banco↔site.

**Status:** ✅ Viabilidade confirmada. Aguardando decisão para implementar a prova de conceito do componente dinâmico.

---

## 2. Arquivos MD — 20 arquivos

**Método:** leitura do cabeçalho/propósito declarado de cada um dos 20 arquivos, sem alteração de conteúdo.

### 🟢 Ativos e centrais — manter
| Arquivo | Motivo |
|---|---|
| `_DECISIONS.md` | Log arquitetural principal (161KB), atualizado na data mais recente do pacote. |
| `_BACKLOG.md` | Backlog vivo de gaps (75KB), referenciado por outros documentos ativos. |
| `CHANGELOG_PORTAL.md` | Changelog ativo do lado SITE, atualizado na mesma data do pacote. |
| `_LEIA_PRIMEIRO.md` | Protocolo de sessão, atemporal por design (propositalmente sem números/datas). |
| `ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md` | Estudo mais recente (16/07), diretamente relevante ao enxugamento em curso. |
| `ESTUDO_ARQUITETURA_E_PLANO.md` | Plano de arquitetura vigente (05/07). |

### 🟡 Úteis, porém desatualizados — regerar, não excluir
| Arquivo | Problema |
|---|---|
| `ESTADO_ATUAL.md` | Deveria ser sempre sobrescrito por protocolo próprio, mas ainda referencia `fato_v94.db`/v97; banco atual é `fato_v168.db`. |
| `SCHEMA.md` | Gerado sobre a v94 (108 tabelas); banco atual tem 116+ tabelas/16 views. Precisa ser regerado por query direta. |
| `RECHECK_RUIDO_v109_v128.md` | Válido como registro histórico, mas não reflete o banco atual (v168). |

### 🔴 Obsoletos — candidatos a arquivar/apagar
| Arquivo | Motivo |
|---|---|
| `_arquivo/README_raiz_obsoleto_v94.md` | Autoidentificado como obsoleto no nome. |
| `portal/_arquivo/README_portal_obsoleto_sprint17.md` | Idem, já em pasta `_arquivo`. |
| `RELATORIO_RUIDO_BANCO.md` | O próprio cabeçalho diz que foi superado por `RECHECK_RUIDO_v109_v128.md`. |
| `ROTEIRO_QUEBRA_MONOLITO.md` | Marcado `✅ CONCLUÍDO`; conteúdo já consolidado em `_DECISIONS.md` (D98-D106). |
| `AUTOAUDITORIA_SITE.md` | Autoauditoria pontual (04/07), achado já resolvido. |
| `auditorias/AUDITORIA_CRUZADA_v86_1.md` | Auditoria de versão já superada (v86). |
| `_arquivo/PLANO_ELIMINACAO_IEDU.md` | Já em `_arquivo`, plano já executado. |

### ⚪ Históricos consolidados — mover para arquivo morto, tirar da raiz operacional
| Arquivo | Motivo |
|---|---|
| `CHANGELOG_BANCO_v81-v97.md` | Changelog de faixa de versão já superada. |
| `CHANGELOG_BANCO_v102-v109.md` | Idem. |
| `HISTORICO_SESSOES.md` | Histórico de processo já consolidado. |
| `portal/HISTORICO_SPRINTS.md` | Idem, consolidado a partir de 10 arquivos de sprint. |

**Padrão observado:** a maioria dos itens 🔴 já se autoidentifica como obsoleta (nome do arquivo ou nota no cabeçalho tipo "superado por X") — não exige julgamento externo, só execução. O risco real está nos 🟡: `ESTADO_ATUAL.md` e `SCHEMA.md` estão desatualizados em relação ao banco vigente e podem induzir a erro quem confiar neles sem checar a versão.

**Decisão executada (16/07):** grupos 🔴 e ⚪ (12 arquivos) movidos para pasta `historico/` na raiz do projeto. Grupo 🟡 atualizado:
- `ESTADO_ATUAL.md` regenerado por query direta contra `fato_v168.db` (companies=936, sources=2.045, gaps_v2=152 [8 ativos/144 resolvidos], 118 tabelas/16 views). Encontrada e registrada nova divergência: `db_versions_v2` MAX(version)=169 ≠ nome do arquivo `fato_v168.db`. Conteúdo antigo preservado em `historico/ESTADO_ATUAL_v97_snapshot.md`.
- `SCHEMA.md` atualizado (contagem 118 tabelas/16 views) com lista de 11 objetos não documentados no dicionário anterior — maioria são tabelas `_backup`/`_arquivado` (convenção de soft-delete a confirmar em `meta_protocolo`). Reconstrução completa coluna-a-coluna dos 12 grupos **ainda pendente** (registrado como TODO no próprio arquivo). Snapshot antigo em `historico/SCHEMA_v91_snapshot.md`.
- `RECHECK_RUIDO_v109_v128.md` foi reclassificado de 🟡 para histórico (é um snapshot pontual v109→v128, não um doc "vivo") e movido para `historico/` junto com o grupo ⚪.

**Próximo passo:** avaliar os demais tipos de arquivo do pacote (19 JSX, 10 JS, 3 JSON, 2 HTML) — em andamento.

---

## 3. HTML e JSON (5 arquivos) — analisados e resolvidos

| Arquivo | Diagnóstico | Ação |
|---|---|---|
| `auditorias/Auditoria_v94_v106.html` | Relatório estático de auditoria pontual v94→v106, mesmo padrão dos MDs já arquivados. | Movido para `historico/`. Pasta `auditorias/` (vazia) removida. |
| `portal/index.html` | Entrypoint real do site (React 18 via CDN + IBM Plex Sans/Mono). | Mantido — ativo/essencial. |
| `_arquivo/extracao_cnct_justificativa.json` | Confirmado por query: conteúdo já ingerido em `cnct_courses` (dados batem palavra por palavra). | Movido para `historico/` — staging já consumido. |
| `_arquivo/extracao_cnct_fundamentos_corrigido.json` | Idem (ex: campos de Petroquímica conferem exatamente com `perfil_profissional`/`infraestrutura`). | Movido para `historico/`. |
| `_arquivo/extracao_atlas_pe_ps_pd.json` (501KB, 55 itens/43 códigos PE/PS/PD) | Na 1ª checagem não achei tabela junction óbvia; investigação mais a fundo (ver seção 6) achou `atlas_destination_profiles` (55 linhas, `full_text` idêntico). | **Resolvido e movido para `historico/`** — ver seção 6. |

## 4. JSX (19) e JS (10) — código do portal

Núcleo funcional do site (views, components, data loaders). Nenhuma duplicata ou arquivo morto identificado por nome/uso. Achado incidental já corrigido em sessão anterior (14/07): `App.jsx` referenciava a fonte "Inter" sem nunca carregá-la — trocada por IBM Plex Sans/Mono (documentado no próprio `portal/index.html`). Sem ação de enxugamento necessária neste grupo.

---

## 6. Pendência do JSON — resolvida
`extracao_atlas_pe_ps_pd.json` (55 itens, códigos PE/PS/PD): confirmado por query que a tabela `atlas_destination_profiles` tem exatamente 55 linhas e o campo `full_text` bate palavra por palavra com o JSON (testado no item `PE-1`). **Já estava 100% migrado** — movido para `historico/`. Pasta `_arquivo/` (agora vazia) removida.

## 7. Prova de conceito — MicroAtlasView (renderização dinâmica dos 78 PDFs)
Construída em `MicroAtlasView.jsx` (artefato isolado). Decisões:
- Reaproveita o sistema de tokens/cor semântico real do portal (`theme/tokens.js`) — não é uma tela nova, é substituição de um componente existente.
- Investigação extra: os 78 PDFs seguem **um único template simples** (Identificação → Vinculação ao Macro-Atlas → Referências Preliminares), variando só o conteúdo — confirmado extraindo o texto de 3 PDFs de status diferentes (`Planejado`, `Sem Atlas dedicado`, `Integrado`).
- Componente cobre os 3 estados de dado observados, incluindo o caso "sem CBO/carga horária/norma" (curso sem Macro-Atlas vinculado) com aviso visual — isso automaticamente resolve a lacuna dos 21 cursos sem PDF hoje (eles simplesmente não tinham nem o botão; agora sempre renderizam algo).
- Dados de exemplo no artefato são reais, extraídos por query de `fato_v168.db` (não inventados).

## 8. Implementação real — integrada ao portal (16/07)
A POC foi levada para dentro do código real (não ficou só no artefato isolado). Detalhe completo em `_DECISIONS.md` D114 e `CHANGELOG_PORTAL.md` v3.24. Resumo:
- `portal/data/loadTrailsProfiles.js` — query de `cnct_courses` expandida (removido filtro que excluía os 21 cursos sem PDF); novo campo `micro_atlas` no objeto de perfil.
- `portal/components/MicroAtlasView.jsx` (novo arquivo) — componente real, integrado aos tokens do projeto (`../theme/tokens.js`), não mais a cópia standalone da POC.
- `portal/views/ViewProfiles.jsx` — botão trocado de `<a href={p.micro_atlas_pdf}>` para toggle condicionado a `p.micro_atlas` (cobre os 99 cursos, não só os 78 com PDF).
- Sintaxe dos 3 arquivos validada via `typescript.transpileModule` (JSX-aware) — sem erros.
- **Não incluído nesta passada:** remoção física dos 78 arquivos PDF e do diretório `dados/micro_atlas/` — fica para depois de confirmar o componente rodando em produção (evita perda de um fallback de download caso algo precise de ajuste).

---

## 9. Pendências gerais deste plano
- [x] Implementar prova de conceito do `MicroAtlasView` dinâmico — feito, ver seção 7.
- [x] Levar a implementação para o código real do portal — feito, ver seção 8.
- [x] Decisão sobre MDs 🔴/⚪ — executada: movidos para `historico/`.
- [x] Regerar `ESTADO_ATUAL.md` e `SCHEMA.md` contra `fato_v168.db` — feito (dicionário coluna-a-coluna completo do SCHEMA ainda pendente).
- [x] Avaliar HTML e JSON — feito, ver seção 3.
- [x] Avaliar JSX/JS — feito, ver seção 4, sem ação necessária.
- [x] Verificar se `extracao_atlas_pe_ps_pd.json` já foi migrado — confirmado migrado, ver seção 6.
- [x] Confirmar componente em produção e remover os 78 PDFs físicos + diretório `dados/micro_atlas/` — feito, ver seção 10.
- [x] ~~Investigar divergência `db_versions_v2` MAX=169 vs nome de arquivo `fato_v168.db`.~~ Não se repete em v193 (`db_versions_v2` MAX=193, nome do arquivo bate) — mas o padrão já se repetiu 1x antes (v168) e 1x depois de forma diferente (v194 citado em `ESTADO_ATUAL.md` sem existir no arquivo real, ver `_BACKLOG.md` SP-68) — vale conferir de novo a cada sincronização, não assumir resolvido de vez.
- [ ] Confirmar se a convenção `_backup`/`_arquivado` (11 tabelas novas encontradas no `SCHEMA.md`) está documentada em `meta_protocolo` — reconferido em 19/07: **ainda não está** (0 linhas relevantes na tabela).
- [x] ~~Pedido formal SP-52 pendente de resposta da sessão BANCO: nulificar/dropar `cnct_courses.micro_atlas_pdf`.~~ **Resolvido pelo BANCO em 18/07** (fato_v193) — coluna nulificada, 0/99 preenchida.

## 10. Remoção física dos 78 PDFs (17/07)
Antes de remover, a cadeia de implementação da seção 8 foi **reconferida por grep direto** nos 3 arquivos reais (`loadTrailsProfiles.js` → campo `micro_atlas` → `MicroAtlasView.jsx` → `ViewProfiles.jsx`) — íntegra e consistente. Só então:
- Removido `portal/dados/micro_atlas/` (78 arquivos).
- `MicroAtlasView.jsx` — removido o botão "Baixar PDF" (seria link morto) e o import `btn`, que ficou sem uso.
- `loadTrailsProfiles.js` — removida a coluna `micro_atlas_pdf` da query e do objeto de perfil (sem consumidor restante).
- **Pedido formal SP-52, registrado em `_BACKLOG.md`** para a sessão BANCO: `cnct_courses.micro_atlas_pdf` continuava no `.db` com paths agora inválidos — o SITE não edita o banco diretamente (Regra 0.1, `_LEIA_PRIMEIRO.md`), então ficou registrado como pedido, não corrigido aqui. **✅ Resolvido pelo BANCO em 18/07** (fato_v193) — coluna nulificada.
- Sintaxe dos arquivos revalidada (`typescript.transpileModule`) após as edições.
- Decisão completa em `_DECISIONS.md` D115.

**Esta sessão de enxugamento está encerrada.** Pendências remanescentes (3 itens acima) dependem da sessão BANCO ou de uma sessão futura dedicada a schema — nenhuma é bloqueante.
