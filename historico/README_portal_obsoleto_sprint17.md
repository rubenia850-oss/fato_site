---
produto: IndústriaEDU
versao: 3.5
ultima_revisao: 24/06/2026 (Sprint 17)
sprint_atual: Sprint 17 (investigação e plano de eliminação iedu_*, sem mudança em .db/App.jsx) concluída · Sprint 18 não iniciada
proximo_id_social: s36
proximo_id_technical: t84
proximo_id_trilha: trl-07
---

# Portal IndústriaEDU — Contexto de Sessão v3.4

> 👉 Se ainda não leu `_LEIA_PRIMEIRO.md` na raiz do projeto, leia antes — uma página, te diz se este é mesmo o arquivo que você precisa agora.

> **Documento de retomada.** Toda nova sessão começa lendo este arquivo.
> Contém: estado atual · estrutura · arquitetura · workflow de dados · vocabulário · checklist.

> ⚠️ **Mudança de arquitetura na Sprint 6 (16/06/2026):** os dados deixaram de viver em JSONs e passaram a viver num banco SQLite (carregado no browser via sql.js/WASM). As Seções 4, 5 e 9 deste documento foram reescritas para refletir isso. Se você está lendo uma versão deste arquivo anterior a 16/06/2026, **ignore as instruções de "editar social.json/technical.json"** — elas não têm mais efeito algum no app.

> ⚠️ **Nome do arquivo `.db` muda entre sprints (já mudou pelo menos 4 vezes: v20→v33→v55, e provavelmente mudará de novo).** Não confie em nenhum nome de arquivo escrito neste documento ou em qualquer outro `.md`. O nome real e atual está sempre em `portal/db.js`, variável `DB_PATH` — rode `grep DB_PATH portal/db.js` antes de assumir qual versão está em uso. Ver `_LEIA_PRIMEIRO.md`, Regra 1, para o procedimento completo de checagem no início de sessão.

---

## 1. Estado atual

**Não copie os números abaixo sem confirmar primeiro.** Esta seção é só um retrato do momento em que foi escrita — pode estar desatualizada agora. Para o estado real, rode os comandos da Regra 1 em `_LEIA_PRIMEIRO.md` antes de usar qualquer número aqui.

```
Portal v3.5 — 20/06/2026 (pós Sprint 13)
──────────────────────────────────────────────────────
Fonte de dados: o `.db` apontado por `DB_PATH` em `portal/db.js` (já foi `fato_v20.db`→`fato_v33.db`→`fato_v55.db`; confira o nome atual, não assuma) — não mais JSONs
Carregamento:   sql.js-fts5 (WASM) via CDN, sem backend
Entrada:        index.html (NOVO Sprint 13 — necessário para rodar no browser)

Fontes núcleo (tabela `sources`)
  Social:     35 entradas  (layer=social)
  Técnica:    83 entradas  (layer=technical — 55→71 na Sprint 7/S3-S4, →83 em expansões posteriores)
  Guia:      415 entradas  (layer=guia · lazy load · sem aba própria, integrado à aba "Guia")
  Setor:     458 entradas  (layer=sector · lazy load · aba "Setores")
  Trilhas de Carreira: 105 (6 curadas originais trl-01 a trl-06 + 99 novas TRL-* via D71-DB/Sprint 16 — 456 passos totais, busca/filtro adicionado EXP-09)

Conhecimento estruturado (tabelas relacionadas, todas via JOIN em App.jsx)
  Perfis CNCT:      85 perfis   (31 originais + 49 propagados de cnct_courses + 8 editoriais; 88→87 Sprint 11, 87→85 Sprint 12 — sobre fato_v33.db; reapareceu como 88 em fato_v55.db por sessão paralela sem conhecimento dessas correções, refundido para 85 na Sprint 14)
  Micro-Atlas PDF:  78 cursos com PDF anexado (de 99 cnct_courses) — EXP-07, Sprint 12
  Blocos do Guia:    29 blocos   (sector_codes)
  Trilhas do Atlas: 145 trilhas  (atlas_trails — inclui cbos/normas do Atlas II, D53-DB;
                                   núcleo curricular EXP-06A; aproveitamento EXP-06B)
  Complementaridade: ~140 entradas (gaps + gap_atlas_trails, 4 tipos originais + tipos de auditoria)
  Setores:          458 entradas (sources layer=sector + industry_sectors, 12 setores)
  Empresas:         442 empresas (companies + company_sectors + company_url_suggestions — EXP-04/Sprint 8; 615→513 Sprint 9; →447 Sprint 14 (72 grupos); →442 D70-DB sessão BANCO, 21/06, 5 pares: Anglo American, Khan Academy, Schneider Electric, SEL, GHG Protocol)
  Cobertura setorial: 112 entradas (sector_coverage_matrix — EXP-03B, dentro do painel de Contexto FATO)

App.jsx: ~2270 linhas · 10 abas · v3.7 (Sprint 16: busca/filtro em Trilhas, EXP-09)
db.js:    47 linhas (M-00 — Sprint 6, sem alterações desde então)
index.html: NOVO Sprint 13 — entrada do browser (React + Babel CDN, sem Vite/webpack)
Decisões registradas: D10–D61 + execução Sprint 7 + Sprint 8 (ver _DECISIONS.md e SPRINT8_EXECUCAO.md)
db_versions: rode `SELECT COUNT(*) FROM db_versions` no `.db` atual (não copie um número antigo daqui)

Próximos IDs (se algum dia se voltar a inserir via JSON intermediário): s36 · t84 · trl-07
  ⚠️ Na prática, hoje a inserção é via SQL direto na tabela `sources` — ver Seção 9.
──────────────────────────────────────────────────────
```

---

## 2. Estrutura de arquivos

```
portal/
├── index.html                         ← NOVO (Sprint 13) — ponto de entrada do browser
├── README.md                          ← ESTE ARQUIVO (atualizar a cada sprint)
├── SPRINT6_EXECUCAO.md            ← relatório da migração Sprint 6 (smoke test, gaps de dados)
├── SPRINT8_EXECUCAO.md            ← relatório da Sprint 8 (EXP-03B, EXP-04, EXP-06B, SP-03)
├── SPRINT9_EXECUCAO.md           ← relatório da Sprint 9 (qualidade de dados, DB-DUP-01)
├── SPRINT10_EXECUCAO.md          ← relatório da Sprint 10 (GR-02/03/07, correção de schema)
├── SPRINT11_EXECUCAO.md          ← relatório da Sprint 11 (DB-DUP-02, DB-L06, SP-04)
├── SPRINT12_EXECUCAO.md          ← relatório da Sprint 12 (EXP-07, DB-DUP-03)
├── App.jsx                        ← componente React único (~2060 linhas · v3.4)
├── db.js                          ← M-00 (Sprint 6): loader sql.js-fts5 (WASM) + helpers query()/scalar() — DB_PATH define qual .db é o atual
└── dados/
    ├── [nome do .db atual — confira DB_PATH em db.js, não assuma pelo que está escrito aqui]
    └── micro_atlas/ (78 PDFs, ~1,5 MB — EXP-07/Sprint 12, referenciados por cnct_courses.micro_atlas_pdf)
```

**Para rodar o portal localmente:**
```bash
cd portal/
python3 -m http.server 8080
# abrir http://localhost:8080
```
> Não abre diretamente como `file://` — o `fetch()` do banco e o WASM do sql.js bloqueiam por política de segurança do browser. O servidor HTTP local é obrigatório mesmo em ambiente de desenvolvimento.

**Regra central (Sprint 6+):** dados ficam no `.db` apontado por `DB_PATH` (`portal/db.js`) — não fixe o nome do arquivo de memória, ele já mudou várias vezes. Código no `App.jsx` + `db.js`.
Para adicionar fontes: **INSERT na tabela `sources` do banco** (ver Seção 9).

> Nota de limpeza (19/06/2026): a pasta `histórico/` (JSONs pré-Sprint-6 preservados como fallback, D57) e o banco legado `fato_v20.db` foram removidos do pacote de trabalho. Nenhum dos dois era lido pelo app — eram apenas registro histórico. Se precisar deles para auditoria, consulte um pacote anterior à Sprint 8.

---

## 3. Arquitetura do App.jsx (pós Sprint 6/7/8)

- `DataContext` + hook `useData()` — sem prop drilling
- Carregamento: `initDB()` (db.js) carrega o `.db` apontado por `DB_PATH` via sql.js-fts5/WASM → `loadCore(db)` roda as queries SQL e monta os objetos consumidos pelos componentes de UI
- Camadas `sector` e `guia` (juntas, ~85% das `sources`) são carregadas **sob demanda** (M-11/D58) — só quando a aba correspondente é aberta, via `ensureSectorsLoaded()`/`ensureGuiaLoaded()`
- `companies` (EXP-04, Sprint 8) é carregada eager — 513 linhas (pós-fusão Sprint 9) é peso baixo, sem necessidade de lazy-load
- Smoke test de paridade de contagens roda automaticamente no console a cada carga (`runSmokeTest`, M-12). **Se algum ❌ aparecer no console, não ignore por hábito** — confira primeiro se é só o `expected` hardcoded ficando atrás do banco real (rode a query equivalente para confirmar) ou se é uma divergência real de schema/dado (ver `_LEIA_PRIMEIRO.md`, Regra 1). Atualizar os valores `expected` é tarefa de quem fechar a sessão que mudou a contagem, não um item adiado.
- Índice de busca full-text (FTS5) é (re)construído em memória a cada carga (`buildSearchIndex`, SP-02A) — ver Seção 3.1
- 10 abas: **Início · Explorar · Trilhas · Perfis CNCT · Guia · Lacunas · Setores · Empresas · Mercado de Trabalho · Sobre**
- Estilos inline como objetos JS (sem CSS externo, sem Tailwind)
- JS puro, sem TypeScript, sem libs externas além do React + sql.js-fts5 (CDN)
- Transpilação Babel CDN no browser (MVP — sem Vite/webpack)

### 3.1 Busca global (FTS5 — Sprint 7/SP-02)

`sql.js` padrão (incl. o pacote oficial no npm e a build do cdnjs) **não inclui o módulo FTS5** — testado e confirmado nesta sessão. `db.js` usa o fork `sql.js-fts5` (mesma API, WASM compilado com `-DSQLITE_ENABLE_FTS5`) via jsDelivr. O índice (`search_idx`) cobre `sources` (todas as camadas) + `cnct_profiles` + `atlas_trails`. O painel de resultados no `Nav` agrupa por categoria (Fontes / Perfis CNCT / Trilhas Atlas).

### Componentes principais

| Componente | Função |
|---|---|
| `ViewExplore` | Filtros + cards de fontes (social + técnica) |
| `ViewTrails` | 6 trilhas curadas com steps |
| `ViewProfiles` | 31 perfis CNCT com detalhe e trilhas clicáveis |
| `ViewGuideBlocks` | 29 blocos do Guia + fontes técnicas associadas + **fichas do Guia (415, EXP-01 Sprint 7)** |
| `ViewGaps` | Mapa de gaps/sobreposição Atlas × Guia |
| `ViewSectors` | 12 setores industriais com empresas e programas (lazy load, M-11) + badge de status de URL (SP-04A/B) |
| `ViewHome` | KPIs + destaque de fontes novas |
| `ViewAbout` | Sobre o sistema FATO |

### DataContext — campos disponíveis via `useData()` (atualizado Sprint 6/7)

```js
{
  social, technical, all, trails, profiles, guideBlocks, atlasTrails, complementarity,
  sourceMap, newIds, sectorsSocial, sectorsTech, sectorsAll,
  tagColors, formatMeta,                         // M-10/D61 — antes hardcoded (TAG_COLORS/FORMAT_META)
  sectors, sectorsLoading, ensureSectorsLoaded,   // M-11 — lazy load camada `sector`
  guia, guiaLoading, ensureGuiaLoaded,            // M-11 — lazy load camada `guia`
  search,                                          // SP-02B — search(term) → {fonte:[],perfil:[],trilha:[]}
}
```

---

## 4. Schema de dados — Fontes (tabela `sources` no `.db` atual, ver `DB_PATH` em `db.js`)

> Os JSONs `social.json`/`technical.json` citados nas versões antigas deste documento **não são mais a fonte de dados** (removidos do pacote na Sprint 8 — eram apenas fallback histórico, D57, e nunca foram lidos pelo app desde a Sprint 6). O schema abaixo descreve o **formato do objeto JS** que `App.jsx::loadSocial()`/`loadTechnical()` monta a partir das tabelas do banco — mantido compatível com o formato antigo para não exigir reescrever os componentes de UI.

### Campos comuns (sources + companies + sectors + source_tags/tag_meta)

| Campo | Tipo | Origem no banco | Descrição |
|---|---|---|---|
| `id` | string | `sources.id` | `"s01"`–`"s35"`, `"t01"`–`"t56"` |
| `layer` | string | `sources.layer` | `"social"` ou `"technical"` |
| `company` | string | `companies.name` (JOIN `company_id`) | Nome da empresa/instituição |
| `sector` | string | `sectors.name` (JOIN `sector_id`, `type='social'`\|`'tech'`) | Vocabulário controlado (Seção 6) |
| `uf` | string | `sources.uf` | `"SP"`, `"Nacional"`, etc. |
| `program` | string | `sources.program` | Nome do programa educacional |
| `format` | string | `sources.format` | Chave de `format_meta` — `"EAD"` · `"PRESENTIAL"` · `"HYBRID"` |
| `national`/`free`/`cadastro` | bool | `sources.*` (0/1 → coagido em JS) | — |
| `lang` | string | `sources.lang` | Vocabulário de idiomas (Seção 7) |
| `highlight` | string | `sources.highlight` | Dado mais relevante |
| `audience` | string | `sources.audience` | Público-alvo |
| `url` | string | `sources.url` | — |
| `tags` | array | `source_tags` JOIN `tags` | Vocabulário controlado (Seção 8) |
| `source_doc` | string | `sources.source_doc` | `"mapeamento"` · `"guia"` · `"atlas"` |
| `verified` | bool | **derivado, não é coluna** | `true` para social/technical (curadoria manual); `sector` usa `url_status` em vez disso |
| `batch` | string\|null | `sources.batch` | Lote de origem |
| `data_layer` | string | `sources.data_layer` | `"primary"` · `"paid"` · `"hybrid"` |
| `cost_range`/`cost_note` | string\|null | `sources.*` | — |

### Campos exclusivos da camada Técnica

| Campo | Tipo | Origem | Descrição |
|---|---|---|---|
| `bloco` | string | `sources.bloco` | Bloco do Guia. Ex: `"1-A"` |
| `cnct` | array | `source_cnct_profiles` JOIN `cnct_profiles` | Ex: `["#2 Automação Industrial"]` |
| `cnct_hint` | string\|null | derivado: `${tier}-${id padded}` do primeiro perfil vinculado | Ex: `"T1-02"`. **Migrado para JOIN no banco na Sprint 6 (M-03)** — antes era hardcoded no JSON. |
| `atlas_trails` | array | `source_atlas_trails` | Códigos de trilha Atlas |
| `caminhos_cbo` | objeto\|null | **novo, EXP-02 (Sprint 7)** — `cnct_courses`(1:1 c/ perfil)+`course_cbos`/`course_certificacoes`/`course_normas` | `{course_name, cbos:[{codigo,descricao,principal}], certificacoes:[...], normas:[...]}`. Presente em 41 das 55 fontes técnicas. |

### Camada `guia` (415 fichas) e `sector` (455 fichas) — lazy load, M-11

Não têm um JSON histórico equivalente direto (vieram do v20/`iedu_setores_v7.0.md` + `iedu_guia_v6.3.md`). Ver `App.jsx::loadGuia()`/`loadSectors()` para o shape exato. `sector` inclui `url_status`/`url_checado_em` (8 estados possíveis, badge SP-04A/B) — `social`/`technical` não têm esse campo populado.

---

## 5. Schema de Trilhas curadas (tabela `trails` + `trail_steps` + `trail_step_sources` + `trail_cnct_profiles`)

Formato do objeto JS montado por `App.jsx::loadTrails()` (D54-DB: mantidas sem expansão nesta fase — 6 trilhas, ver `_DECISIONS.md`):

```js
{
  id:           "trl-01",
  icon:         "⚡",
  name:         "Eletrotécnica Industrial do Zero",
  cnct:         "#7 Eletrotécnica Industrial",   // trails.cnct_label no banco
  cnct_profiles: [7],
  color:        "#fcd34d",
  description:  "...",
  steps: [
    { phase: "Nivelamento", ids: ["t23"], note: "..." },
    { phase: "Técnica: BT/MT", ids: ["t34","t29"], note: "..." }
  ]
}
```

Não confundir com as **145 `atlas_trails`** (tabela `atlas_trails`), que são uma estrutura maior e separada — ver Seção 1 e `_DECISIONS.md` (D54-DB).

---

## 6. Vocabulário de Setores

### Camada Social
`"Mineração"` · `"Siderurgia e Metalurgia"` · `"Petróleo e Petroquímica"` ·
`"Papel e Celulose"` · `"Química"` · `"Máquinas e Equipamentos"` ·
`"Automotivo"` · `"Alimentos e Bebidas"` · `"Materiais de Construção"` ·
`"Têxtil e Calçados"` · `"Montagem Industrial"` · `"Papel e Embalagem"`

### Camada Técnica
`"Automação e Instrumentação"` · `"Equipamentos e Fluidos"` · `"Integridade e END"` ·
`"Segurança Industrial"` · `"Petróleo e Processo"` · `"Soldagem e Metalurgia"` ·
`"Educação Técnica Base"` · `"Transição Energética"` · `"Eletrotécnica Industrial"` ·
`"Mecatrônica e Robótica"`

*(Vocabulário inalterado pela Sprint 6/7 — ainda vive nas tabelas `sectors`/`industry_sectors`, só a forma de consulta mudou.)*

---

## 7. Vocabulário de Idiomas (`lang`)

| Valor | Quando usar |
|---|---|
| `"PT"` | Somente português |
| `"EN"` | Somente inglês |
| `"EN/PT"` | Inglês primário, conteúdo/legendas em PT disponíveis |
| `"PT/EN"` | Português primário, inglês disponível |
| `"EN/PT/ES"` | Inglês, português e espanhol |
| `"PT/ES"` | Português e espanhol |

---

## 8. Vocabulário de Tags

> Desde a Sprint 6 (M-10/D61), as cores das tags **não são mais hardcoded no App.jsx** — vêm de `tags`+`tag_meta` no banco. A lista abaixo é o vocabulário de *nomes* de tag (ainda válida); tags sem entrada em `tag_meta` caem no cinza padrão `#64748b`.

```
"EAD"  "Nacional"  "PT"  "EN"  "Inclusão"  "Jovens"  "Comunidade"  "PcD"
"Racial"  "Tech"  "Bolsa"  "Sustentabilidade"  "Sem Cadastro"  "Gratuito Total"
"Certificado"  "App"  "EJA"  "Empreendedorismo"  "Gestão"  "Regional"
"NE"  "SE"  "S"  "Soldagem"  "Eólica"  "H2V"  "Renováveis"  "Internacional"
"NRs"  "Industrial"  "Técnico"  "PLC"  "SCADA"  "DCS"  "Instrumentação"
"IoT"  "Redes"  "Drives"  "Hidráulica"  "Pneumática"  "Caldeiras"  "NR-13"
"Vapor"  "END"  "Ultrassom"  "Inspeção"  "Corrosão"  "Normas"  "ASME"
"API"  "RBI"  "SST"  "Offshore"  "O&G"  "Downstream"  "Simulação"
"Open Source"  "Processos"  "Universitário"  "Automação"  "Elétrica"
"Base"  "70+ cursos"  "Novo"  "Trial"  "Standards"  "Webinar"
"Presencial"  "Híbrido"  "Agro"  "Rural"  "Solar FV"  "CCUS"
"Robótica"  "Cobots"  "Proteção Elétrica"  "CLP"  "ATEX"  "END-PT"
"Gov.br"  "PSM"  "SIL"  "Eólica Onshore"
```

---

## 9. Como adicionar uma nova fonte (Sprint 6+ — via SQL, não mais via JSON)

> Esta seção substitui o antigo "Formato de entrega de lote" (que descrevia anexar objetos JSON a `social.json`/`technical.json`). Esse fluxo **não tem mais efeito** — o app não lê mais esses arquivos.

```sql
-- 1. Garantir que a empresa existe (ou reaproveitar company_id existente)
INSERT INTO companies (name, uf) VALUES ('Nome da Empresa', 'SP');

-- 2. Inserir a fonte
INSERT INTO sources (
  id, layer, company_id, sector_id, uf, program, format,
  national, free, lang, cadastro, highlight, audience, url,
  batch, data_layer, cost_range, cost_note, source_doc
) VALUES (
  's36', 'social', (SELECT id FROM companies WHERE name='Nome da Empresa'),
  (SELECT id FROM sectors WHERE name='Mineração' AND type='social'),
  'Nacional', 'Nome do Programa', 'EAD',
  1, 1, 'PT', 0, 'Resumo em até 120 caracteres', 'Público-alvo', 'https://...',
  'fato_003', 'primary', NULL, NULL, 'mapeamento'
);

-- 3. Tags (se houver)
INSERT INTO source_tags (source_id, tag_id) SELECT 's36', id FROM tags WHERE name IN ('EAD','Nacional');

-- 4. Para fontes técnicas adicionalmente: source_cnct_profiles, source_atlas_trails (se aplicável)
```

Depois de rodar o SQL, distribuir o novo `.db` (ou o patch) para substituir o arquivo em `portal/dados/` — e **confirmar que `DB_PATH` em `db.js` aponta para o nome correto** (renomear o arquivo sem atualizar `db.js` é a causa mais comum de divergência neste projeto — ver `_LEIA_PRIMEIRO.md`). **Não existe mais passo de "editar JSON"** nesse fluxo.

**Campos obrigatórios:** `id`, `layer`, `company_id`, `program`, `format`, `national`, `free`, `lang`, `cadastro`, `highlight`, `audience`, `url`, `batch`, `data_layer`, `source_doc`.
**Campo obrigatório para técnica:** ao menos considerar popular `source_atlas_trails` (mesmo que vazio por ora).

---

## 10. Checklist de qualidade

- [ ] `id` é o próximo disponível (s36 / t84) — convenção de nomenclatura mantida mesmo com banco
- [ ] `sector_id` resolve para um nome do vocabulário (Seção 6)
- [ ] `highlight` ≤ 120 caracteres
- [ ] `url` começa com `https://`
- [ ] tags usadas existem em `tags` (e idealmente têm entrada em `tag_meta` para cor — M-10)
- [ ] `batch` preenchido com identificador do lote
- [ ] `data_layer`: `"primary"` (padrão para fontes gratuitas)
- [ ] `cost_range` e `cost_note`: `NULL` para fontes gratuitas
- [ ] Para fontes técnicas: considerar `source_atlas_trails` (pode ficar sem linhas se sem mapeamento)
- [ ] `db_versions`: registrar uma nova linha descrevendo a mudança (convenção desde Sprint 4, mantida)

---

## 11. Metas e histórico de versões

| Versão | Data | Fontes | Destaque |
|---|---|---|---|
| v1.0 | 12/06 | 45 | Fundação — Mapeamento + Guia v6.0 |
| v2.0 | 12/06 | 73 | +28 técnicas (Atlas FATO), filtro idioma, CNCT |
| v2.2 | 12/06 | 90 | +15 social (s21–s35), Ciclo Imediato t26+t27 |
| v3.0 | 12/06 | 90 | JSONs externos, DataContext, 6 trilhas |
| v3.1-S2 | 13/06 | 90 | Sprint 2: batch, data_layer, cost_range, toggle gratuitos |
| v3.1-S3 | 13/06 | 90 | Sprint 3: 30 perfis, 29 blocos, 128→145 trilhas, ViewProfiles, ViewGuideBlocks |
| v3.2 | 13/06 | 90+634 | Sprint 4: complementarity, sectors, ViewGaps, ViewSectors |
| v3.2 | 14/06 | 90+634 | Sprint 5: bugs Nav/noReg, versões, busca global (input simples), cnct_hint badge (não clicável) |
| — | 13–16/06 | — | **Trabalho de dados fora do portal** (não documentado neste arquivo até agora): reconciliação cnct_profiles↔cnct_courses, D01 a D09, validação de URLs (424/455 sector com URL válida), correção de setores malformados, Atlas II (cbos/normas). Ver `_DECISIONS.md` D01–D52 e `fato_v20.db::db_versions` (entradas 1–20). **fato_v20.db nasceu desse trabalho.** |
| **v3.3** | **16/06** | **35+55+415+455** | **Sprint 6: migração para `fato_v20.db` (sql.js/WASM, sem backend). PRÉ-6B/C aplicados. TAG_COLORS/FORMAT_META eliminados (M-10). Lazy load sector+guia (M-11). Smoke test 100% (M-12). JSONs arquivados em histórico/ (M-13).** |
| v3.3 | 16/06 | 35+55+415+455 | Sprint 7: busca FTS5 com painel por categoria (SP-02, via fork `sql.js-fts5`), badge de status de URL (SP-04A/B), fichas do Guia integradas à aba Guia (EXP-01, 415 fichas antes invisíveis), seção "Caminhos CBO" no card técnico (EXP-02, 41/55 fontes) |
| — | 16–19/06 | — | **Trabalho de dados fora do portal:** banco evoluiu de 22→33 versões em `db_versions` — perfis CNCT 31→88 (propagação de `cnct_courses` + 8 perfis editoriais), technical 55→83. Ver `fato_v33.db::db_versions` entradas 23–33. |
| **v3.4** | **19/06** | **35+83+415+458** | **Sprint 8 (Tier 2): cnct_hint clicável (SP-03, navegação Explore→Perfil), painel "Contexto FATO" em Setores com perfis/blocos/Atlas relevantes + cobertura empresas×status (EXP-03A/B/C), núcleo curricular + aproveitamento no drawer de trilha (EXP-06A/B), nova aba Empresas com 615 empresas e status de URL (EXP-04). EXP-05 confirmado já implementado em sessão anterior. EXP-07 (Micro-Atlas PDF) bloqueado — falta coluna no banco.** |
| — | 19/06 | 35+83+415+458 | **Sprint 9 (qualidade de dados): removidas tabelas redundantes `*_deprecated` (DB-M03), colunas de FK adicionadas em `cnct_courses` para GR-01, `tag_meta` populada para as 69 tags com badge visível (DB-01 parcial), heurísticas de DB-L03/DB-02 avaliadas e descartadas por falta de sinal confiável no banco (decisão documentada, não silenciosa). Achado fora de escopo: 102 de 615 empresas eram cadastros duplicados — fundidas com segurança (FKs reatribuídas, zero perda de dado, plano auditável) — `companies` 615→513 (DB-DUP-01). Removidas também 2 FKs órfãs pré-existentes em `company_url_suggestions` (DB-FK-01). `PRAGMA integrity_check` e `foreign_key_check` limpos ao final. Ver `portal/SPRINT9_EXECUCAO.md`.** |
| — | 19/06 | 35+83+415+458 | **Sprint 10 (bloco 2 — grafo): GR-07 conecta o único gap com dado real (1 de 55), os outros 54 confirmados sem dado de origem. GR-02/GR-03 corrigidos de schema 1:1 (Sprint 9) para tabelas de junção muitos-para-muitos `cnct_course_atlas_trails` (100 vínculos, 16/99 cursos) e `cnct_course_sources` (51 vínculos, 7/99 cursos) — a relação real exigia isso, forçar 1 valor seria inventar precisão que o dado não tem. Achado de reaproveitamento de código de trilha entre Atlas, documentado e não corrigido por ambiguidade real. `documents` investigada e mantida sem alteração (é log histórico de ETL, não espelho do pacote). Ver `portal/SPRINT10_EXECUCAO.md`.** |
| — | 19/06 | 35+83+415+458 | **Sprint 11: segundo caso de duplicata encontrado no banco — dois perfis "Técnico em Plásticos" em `cnct_profiles` (ids 31/73). Decisão por CBO mais específico, verificado externamente antes de executar (3114-10 confirmado oficial, 8153-10 não confirmado) — fundidos, `cnct_profiles` 88→87 (DB-DUP-02). DB-L06 avançado parcialmente (`atlas_ref` derivado para 2 perfis a partir de vínculo já existente no banco; campos editoriais não inventados). Hipótese de renumeração de trilhas da Sprint 10 investigada e fechada — confirmada em parte, sem ganho de cobertura. SP-04 fechado formalmente após 3 investigações sem solução. `expected.profiles` do smoke test corrigido para 87, refletindo a mudança real desta sprint. Ver `portal/SPRINT11_EXECUCAO.md`.** |
| — | 19/06 | 35+83+415+458 | **Sprint 12 (EXP-07): processados os 78 PDFs de Micro-Atlas enviados pelo usuário (formato real: 1 por curso CNCT, não por trilha como esperado). Numeração interna dos arquivos não correspondia a nenhum id atual — match feito por nome de curso, único critério confiável. Esse processo revelou mais 2 pares de perfis duplicados (Mecânica de Precisão, Informática) — varredura sistemática completa confirma não haver outros. `cnct_profiles` 87→85 (DB-DUP-03). Coluna `micro_atlas_pdf` em `cnct_courses`, 78/99 cursos preenchidos; botão "Ver Micro-Atlas" no card de Perfil CNCT (65 perfis cobertos; 13 cursos com PDF mas sem perfil ficam sem UI por ora). Ver `portal/SPRINT12_EXECUCAO.md`.** |
| — | 20/06 | 35+83+415+458 | **Sprint 13 parte 1: criado `portal/index.html` (faltava para rodar no browser). Marcados `.OBSOLETO.md` em `iedu_sumario_v2.0.md` e `iedu_integracao_v1.0.md` (congelados desde 12/06, pré-migração para banco).** |
| — | 20/06 | 35+83+415+458 | **Sprint 13 parte 2 — reconciliação `fato_v33.db`→`fato_v55.db`: confirmado que uma sessão paralela de auditoria de dados gerou `fato_v55.db` (35 tabelas novas `dm_*`/`cbo_canonical`/etc.) sem conhecimento da Sprint 12, regredindo `cnct_courses.micro_atlas_pdf`. Coluna recriada e repopulada (78/99, casamento exato por id contra v33). `db.js` atualizado para o `.db` atual. Ver D62-DB/D63-DB em `_DECISIONS.md`. Criado protocolo de sessão obrigatório em `_LEIA_PRIMEIRO.md` (não mais documento de "estado", e sim de regras fixas — checagem de schema obrigatória no início e no fechamento de toda sessão) para que esse tipo de divergência pare de depender de pedido manual do responsável.** |

| — | 20/06 | 34+83+415+444 | **Sprint 14 — sincronização cnct_profiles/companies com a sessão de auditoria (em andamento, independente): confirmado que a reconciliação da Sprint 13 cobriu só schema/coluna, não qualidade de dados — os 3 pares de perfis duplicados das Sprints 11/12 (Plásticos, Mecânica de Precisão, Informática) tinham voltado em `fato_v55.db` com os mesmos ids, e um lote novo de 72 grupos de empresas duplicadas (companies 520) entrou via importação em lote da própria auditoria. Ambos refundidos com a mesma metodologia já validada (CBO externo verificado para Plásticos e Air Products/Linde; completude de dado para os outros pares; 2 falsos-positivos excluídos, BRF e SENAI). Merge de perfis revelou 516 violações de FK em 4 tabelas novas com nomenclatura em português (`perfil_origem_id` etc.) que a varredura original não capturou — corrigidas sem perda de dado. `cnct_profiles`: 88→85. `companies`: 520→447. `expected.social`/`expected.sector` do smoke test corrigidos (34/444, mudanças reais já feitas pela auditoria antes desta sessão). 3 novas decisões em `_DECISIONS.md` (D64-DB/D65-DB/D66-DB) com instruções explícitas para a auditoria não recriar os mesmos problemas. Ver `portal/SPRINT14_EXECUCAO.md`. Ao final desta sessão, divisão formal de papéis adotada (Regra 0.1 em `_LEIA_PRIMEIRO.md`, D67-DB): SITE só edita `App.jsx`/`db.js`/`index.html`, BANCO só edita o `.db` — kit de transição em `KIT_AUDITORIA_BANCO_DADOS.md`.** |
| — | 21/06 | 34+83+415+444 | **Sprint 15 (EXP-08, primeira sob a divisão formal): nova aba "Mercado de Trabalho" com dados reais RAIS/PNAD 2024 (`dm_mercado_trabalho`, 1458 linhas) + painel na página de Perfil CNCT (80/85 perfis, via `cbo_canonical`). Nenhuma alteração no `.db` — só leitura, conforme Regra 0.1. Achado incidental registrado como pedido para a sessão BANCO (CBO `8153-10` sem nome mapeado). Corrigido texto de erro que citava `fato_v33.db` hardcoded. Ver `portal/SPRINT15_EXECUCAO.md`.** |
| — | 23/06 | 34+107+438+444 | **Sprint 16 — recebido `sistema_fato_v65_combinado.zip` (reconciliação das sessões SITE+BANCO, v61-65). Reconfirmado por execução própria (não por confiança no relato do pacote): schema compatível, `companies` 447→442 (D70-DB), `sources` 991→1023. `expected.technical`/`expected.guia` do smoke test corrigidos (83→107, 415→438) — mudança real verificada, não suposta. EXP-09: busca/filtro adicionados a `ViewTrails` após a tabela `trails` crescer de 6 para 105 (D71-DB) + fallback de ícone para as 99 trilhas novas. Lacuna de sincronização corrigida: `D68` original (Sprint 15) recriado em `_DECISIONS.md` (D73) — não tinha chegado ao pacote combinado. Ordem de prosa de SP-15 a SP-22 corrigida em `_BACKLOG.md` (sem perda de conteúdo). Novo item SP-23 (`trail_cbos`/`trail_normas` sem UI). Ver `portal/SPRINT16_EXECUCAO.md`.** |

**Próxima sprint pendente: Sprint 18** — continuar SP-12 (~34 tabelas `dm_*` ainda sem UI); SP-23 (`trail_cbos`/`trail_normas` sem UI); SP-24 (pedido formal de migração `iedu_*` aguardando execução pela sessão BANCO — Atlas pronto pra carregar, ver `extracao_atlas_pe_ps_pd.json`); decisão de produto sobre Setores/Guia (`PLANO_ELIMINACAO_IEDU.md`); 13 cursos com PDF sem perfil CNCT; 9 PDFs de "Atlas previstos". **Itens exclusivos da sessão BANCO** (Regra 0.1, só registrados aqui para contexto): SP-15 a SP-18 e SP-20 a SP-22.

**Gaps de dados conhecidos, ainda sem solução (ver `_DECISIONS.md`/`_BACKLOG.md` para detalhe):**
- `sectors[].atlas_trails` sempre `[]` — `source_atlas_trails` tem 0 linhas para a camada `sector` (confirmado Sprint 7).
- Texto de `recurso`/`fonte` ausente em alguns `gaps` (tipos `atlas_sem_guia`/`sobreposicao`) — falta pré-existente no v20, ainda presente no v33.
- `cnct_courses.micro_atlas_pdf` não existe no banco — bloqueia EXP-07.
- Trilha `PE-1` do Atlas I/Petroquímica ("Especialista em Automação Sênior") não existe em `atlas_trails`, apesar de haver vínculo histórico de perfil para ela (achado Sprint 9/DB-M03, ver `db_versions` v34).
- 27 fontes `sector` ainda sem URL (DB-L05) — não resolvido, exige pesquisa externa.
- 433 empresas ainda sem UF (DB-02, melhorou de 529 só como efeito colateral da fusão de duplicatas) — exige pesquisa externa para o restante.
- 155 fichas do Guia sem perfil CNCT vinculado (DB-L03) — exige curadoria manual, não é recuperável por heurística textual.

---

*Atualizar este arquivo ao final de cada sprint — não apenas ao iniciar.*
*Próxima revisão: ao final da Sprint 10 · Última revisão: 19/06/2026 (Sprint 9)*
