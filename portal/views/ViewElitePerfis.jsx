// views/ViewElitePerfis.jsx — "Perfis de Elite" (atlas_destination_profiles), combinações de
// 2-4 trilhas Atlas com escada de saídas intermediárias. Conteúdo 100% editorial, já pronto
// em Markdown no banco — este arquivo só precisa renderizar.
// SP-45 (15/07/2026, Tier 1 item 1 do ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md).
//
// Sem bundler neste projeto (ver index.html) — não há como importar uma lib de markdown do
// npm (só "react"/"react-dom" são resolvidos como specifiers "nus"; qualquer outro import
// teria que ser um arquivo local). Por isso o parser abaixo é deliberadamente pequeno e
// específico ao formato real do conteúdo (checado contra as 55 linhas de
// atlas_destination_profiles antes de escrever isto: sempre "## título", depois um bloco de
// "**Label**: valor", depois seções "### Nome" com parágrafos e 1 bloco ``` ``` de ASCII) —
// não é um parser de Markdown genérico.
import { useState, useMemo } from "react";
import { C, pill, card, btn, SEL } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";

function renderInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-${i}`} style={{ color: C.heading }}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

function parseElite(md) {
  const lines = (md || "").split("\n");
  let i = 0;
  if (lines[i] && lines[i].trim().startsWith("## ")) i++;

  const meta = {};
  while (i < lines.length) {
    const line = lines[i].trim();
    const m = line.match(/^\*\*(.+?)\*\*:\s*(.+)$/);
    if (m) { meta[m[1]] = m[2]; i++; continue; }
    if (line === "") { i++; continue; }
    break;
  }

  const sections = [];
  let current = null;
  let codeBuffer = null;
  let pendingBreak = true;
  for (; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (line.startsWith("```")) {
      if (codeBuffer === null) { codeBuffer = []; }
      else {
        if (!current) { current = { title: "", blocks: [] }; sections.push(current); }
        current.blocks.push({ type: "code", content: codeBuffer.join("\n") });
        codeBuffer = null;
        pendingBreak = true;
      }
      continue;
    }
    if (codeBuffer !== null) { codeBuffer.push(raw); continue; }
    if (line.startsWith("### ")) {
      current = { title: line.replace(/^###\s*/, ""), blocks: [] };
      sections.push(current);
      pendingBreak = true;
      continue;
    }
    if (line === "" || line === "---") { pendingBreak = true; continue; }
    if (!current) { current = { title: "", blocks: [] }; sections.push(current); }
    const last = current.blocks[current.blocks.length - 1];
    if (!pendingBreak && last && last.type === "p") { last.content += " " + line; }
    else { current.blocks.push({ type: "p", content: line }); }
    pendingBreak = false;
  }
  return { meta, sections };
}

function EliteDetail({ perfil, atlasTrails, onBack }) {
  const parsed = useMemo(() => parseElite(perfil.descricao), [perfil.descricao]);
  const trilhaMatches = perfil.trilhas.map(code => ({
    code, trail: atlasTrails.find(t => t.code === code && t.atlas_num === perfil.atlas_num),
  }));

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 16px" }}>
      <button onClick={onBack} style={{ ...btn(C.border, C.dim), marginBottom: 16 }}>← Voltar aos Perfis de Elite</button>

      <div style={{ ...card(C.purpleBorderA), padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ ...pill(C.purpleDim, C.purpleLight), fontFamily: "'IBM Plex Mono',monospace", fontSize: 11 }}>{perfil.code}</span>
          <span style={{ fontSize: 11, color: C.dim }}>Atlas {perfil.atlas_num}{perfil.atlas_doc&&` · ${perfil.atlas_doc.name}`}</span>
          {perfil.nivel_perfil && <span style={{ ...pill(C.orangeDim, C.orangeLight) }}>{perfil.nivel_perfil}</span>}
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.heading, marginBottom: 10 }}>{perfil.name}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {trilhaMatches.map(({ code, trail }) => (
            <span key={code} title={trail ? trail.name : "trilha não encontrada"}
              style={{ ...pill(C.blueDim, C.blue, C.blueBorderA), fontFamily: "'IBM Plex Mono',monospace" }}>
              {code}{trail ? <span style={{ color: C.faint, fontWeight: 400 }}> · {trail.name}</span> : null}
            </span>
          ))}
        </div>
        {/* SP-62 (item 13): fonte CNCT + página, e blocos de competência do Atlas de origem */}
        {perfil.atlas_doc&&(perfil.atlas_doc.fontes_cnct||perfil.atlas_doc.codigos_guia)&&(
          <div style={{marginBottom:10,paddingTop:8,borderTop:"1px solid #1e293b",fontSize:10,color:C.faint}}>
            {perfil.atlas_doc.fontes_cnct&&<div>📖 {perfil.atlas_doc.fontes_cnct}</div>}
            {perfil.atlas_doc.codigos_guia&&<div style={{marginTop:2}}>Blocos: {perfil.atlas_doc.codigos_guia}</div>}
          </div>
        )}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {parsed.meta["Aproveitamento cruzado acumulado"] && (
            <div>
              <div style={{ fontSize: 9, color: C.faint }}>APROVEITAMENTO CRUZADO</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.emerald }}>{parsed.meta["Aproveitamento cruzado acumulado"]}</div>
            </div>
          )}
          {parsed.meta["Esforço relativo"] && (
            <div>
              <div style={{ fontSize: 9, color: C.faint }}>ESFORÇO RELATIVO</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.heading }}>{parsed.meta["Esforço relativo"]}</div>
            </div>
          )}
          {parsed.meta["Classificação de valor"] && (
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 9, color: C.faint }}>CLASSIFICAÇÃO DE VALOR</div>
              <div style={{ fontSize: 12, color: C.dim }}>{parsed.meta["Classificação de valor"]}</div>
            </div>
          )}
        </div>
      </div>

      {parsed.sections.map((sec, si) => (
        <div key={si} style={{ ...card(), padding: 16, marginBottom: 14 }}>
          {sec.title && (
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>
              {sec.title}
            </div>
          )}
          {sec.blocks.map((b, bi) => b.type === "code" ? (
            <pre key={bi} style={{
              margin: "0 0 8px", padding: 12, background: C.surface3, borderRadius: 7,
              border: "1px solid #1e293b", fontSize: 10, lineHeight: 1.6, color: C.dim,
              overflowX: "auto", fontFamily: "'IBM Plex Mono',monospace", whiteSpace: "pre",
            }}>{b.content}</pre>
          ) : (
            <p key={bi} style={{ margin: "0 0 8px", fontSize: 12, color: C.dim, lineHeight: 1.75 }}>
              {renderInline(b.content, `${si}-${bi}`)}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export function ViewElitePerfis() {
  const { eliteProfiles, atlasTrails } = useData();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  const grouped = useMemo(() => {
    const filtered = eliteProfiles.filter(p =>
      !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.trilhas.join(" ").toLowerCase().includes(q.toLowerCase())
    );
    const byAtlas = {};
    filtered.forEach(p => { (byAtlas[p.atlas_num] = byAtlas[p.atlas_num] || []).push(p); });
    return byAtlas;
  }, [eliteProfiles, q]);

  if (selected) {
    return <EliteDetail perfil={selected} atlasTrails={atlasTrails} onBack={() => setSelected(null)} />;
  }

  const atlasNums = Object.keys(grouped).sort();
  const total = eliteProfiles.length;
  const totalFiltered = atlasNums.reduce((a, k) => a + grouped[k].length, 0);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.purple, textTransform: "uppercase", marginBottom: 6 }}>
          Combinações de trilhas Atlas
        </div>
        <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: C.heading }}>Perfis de Elite</h2>
        <p style={{ margin: 0, fontSize: 13, color: C.dim, lineHeight: 1.7, maxWidth: 640 }}>
          {total} combinações de 2 a 4 trilhas Atlas — cada uma com mercado de atuação, faixa
          salarial de referência e uma escada de saídas intermediárias (o que já dá pra fazer
          depois de cada trilha concluída, antes de chegar ao perfil completo).
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar perfil de elite ou código de trilha..." style={{ ...SEL, width: 300 }} />
        <span style={{ fontSize: 11, color: C.faint, marginLeft: "auto" }}>{totalFiltered} de {total}</span>
      </div>

      {atlasNums.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", color: C.faint, fontSize: 12 }}>
          Nenhum perfil de elite encontrado com esses filtros.
        </div>
      )}

      {atlasNums.map(num => (
        <div key={num} style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, marginBottom: 10 }}>
            ATLAS {num}{grouped[num][0]?.categoria ? ` — ${grouped[num][0].categoria.replace(/^Nível Elite — /, "")}` : ""}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 10 }}>
            {grouped[num].map(p => (
              <div key={p.code} onClick={() => setSelected(p)}
                style={{ ...card(), padding: 14, cursor: "pointer", transition: "border-color .15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.purpleBorderA}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ ...pill(C.purpleDim, C.purpleLight), fontFamily: "'IBM Plex Mono',monospace", fontSize: 10 }}>{p.code}</span>
                  {p.nivel_perfil && <span style={{ fontSize: 9, color: C.faint }}>{p.nivel_perfil}</span>}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.heading, marginBottom: 8, lineHeight: 1.4 }}>{p.name}</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {p.trilhas.map(code => (
                    <span key={code} style={{ ...pill(C.blueDim, C.blue, C.blueBorderA), fontFamily: "'IBM Plex Mono',monospace", fontSize: 9 }}>{code}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
