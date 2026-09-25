// views/ViewRedeCarreira.jsx — visão geral da rede de carreira: os 85 perfis CNCT com dado de
// rede mapeado (de 98 no catálogo — 13 ainda sem `dm_rede_centralidade`/`dm_rede_comunidades`),
// agrupados pelas 5 comunidades temáticas reais (`dm_rede_comunidades`) e ligados pelos 21
// pares de sinônimo real (`dm_sinonimos_perfis`, overlap de trilhas Atlas compartilhadas).
// Criada em 14/07/2026 (D111) — peça de assinatura visual sugerida em
// ESTUDO_ARQUITETURA_E_PLANO.md §4, antes só um badge de texto na tela de perfil.
//
// Layout determinístico, sem lib de grafo (mesma filosofia do projeto: sem bundler/dependência
// nova). Comunidades posicionadas em círculo; dentro de cada uma, membros em espiral de ângulo
// áureo (phyllotaxis) — distribui bem sem sobreposição mesmo na comunidade de 55 membros, sem
// precisar de force-layout iterativo.
import { useState, useMemo } from "react";
import { C } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";

const COR_COMUNIDADE = [C.indigoBright, C.indigoLight, C.purpleLight, C.purpleSoft, C.purple];
const GOLDEN_ANGLE = 137.5 * (Math.PI / 180);

export function ViewRedeCarreira() {
  const { profiles, navigateTo } = useData();
  const [hoveredId, setHoveredId] = useState(null);

  const { positioned, edges, comunidades } = useMemo(() => {
    const withRede = profiles.filter(p => p.rede_comunidade);
    const byComunidade = {};
    withRede.forEach(p => {
      const cid = p.rede_comunidade.comunidade_id;
      (byComunidade[cid] ||= []).push(p);
    });
    const comunidadeIds = Object.keys(byComunidade).map(Number).sort((a, b) => a - b);

    const W = 900, H = 700, cx = W / 2, cy = H / 2, R = 240;
    const posById = {};
    const clusterCentroids = {};

    comunidadeIds.forEach((cid, ci) => {
      const angle = (ci / comunidadeIds.length) * 2 * Math.PI - Math.PI / 2;
      const centroid = { x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) };
      clusterCentroids[cid] = centroid;
      const membros = byComunidade[cid];
      membros.forEach((p, j) => {
        const a = j * GOLDEN_ANGLE;
        const r = 9 * Math.sqrt(j);
        posById[p.id] = {
          x: centroid.x + r * Math.cos(a),
          y: centroid.y + r * Math.sin(a),
          comunidade: cid,
          score: p.rede_centralidade?.score || 0.31,
          name: p.name,
          classificacao: p.rede_centralidade?.classificacao || "",
        };
      });
    });

    // Arestas reais: dm_sinonimos_perfis (via profile.sinonimos, já carregado — evita duplicar
    // a mesma query; cada par aparece 2x, uma por direção, então deduplicamos por par ordenado)
    const seen = new Set();
    const edges = [];
    withRede.forEach(p => {
      (p.sinonimos || []).forEach(s => {
        const key = [p.id, s.outro_id].sort((a, b) => a - b).join("-");
        if (seen.has(key) || !posById[s.outro_id]) return;
        seen.add(key);
        edges.push({ a: posById[p.id], b: posById[s.outro_id], overlap: s.overlap });
      });
    });

    return { positioned: posById, edges, comunidades: comunidadeIds.map(cid => ({ cid, n: byComunidade[cid].length, centroid: clusterCentroids[cid] })) };
  }, [profiles]);

  const nodeList = Object.entries(positioned).map(([id, n]) => ({ id: Number(id), ...n }));

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: C.purple, textTransform: "uppercase", marginBottom: 6 }}>
          Visão geral · dado real, sem conexão inventada
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: C.heading, margin: "0 0 6px" }}>Rede de Carreira</h1>
        <p style={{ margin: 0, fontSize: 12, color: C.dim, lineHeight: 1.7, maxWidth: 640 }}>
          {nodeList.length} perfis CNCT com dado de rede mapeado (de 98 no catálogo), agrupados nas
          5 comunidades temáticas reais. As {edges.length} linhas brilhantes são sinônimos
          confirmados por trilhas Atlas compartilhadas — o resto do agrupamento é por comunidade,
          não por par específico.
        </p>
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12 }}>
        <svg width="100%" viewBox="0 0 900 700" style={{ display: "block" }}>
          {edges.map((e, i) => (
            <line key={i} x1={e.a.x} y1={e.a.y} x2={e.b.x} y2={e.b.y}
              stroke={C.indigoBright} strokeWidth={1 + e.overlap * 2} strokeOpacity={0.55} />
          ))}
          {nodeList.map(n => {
            const r = 3 + ((n.score - 0.30) / 0.10) * 9;
            const dimmed = hoveredId != null && n.comunidade !== hoveredId;
            return (
              <circle key={n.id} cx={n.x} cy={n.y} r={Math.max(3, r)}
                fill={COR_COMUNIDADE[n.comunidade % COR_COMUNIDADE.length]}
                fillOpacity={dimmed ? 0.15 : (n.classificacao.includes("HUB") ? 1 : 0.75)}
                stroke={n.classificacao.includes("HUB") ? C.emerald : "none"}
                strokeWidth={1.2}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredId(n.comunidade)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => navigateTo && navigateTo("profiles", { profileId: n.id })}>
                <title>{n.name}{n.classificacao ? ` — ${n.classificacao}` : ""}</title>
              </circle>
            );
          })}
        </svg>
      </div>

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12 }}>
        {comunidades.map(c => (
          <div key={c.cid} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.dim }}>
            <span style={{ width: 10, height: 10, borderRadius: 99, background: COR_COMUNIDADE[c.cid % COR_COMUNIDADE.length], display: "inline-block" }} />
            Comunidade {c.cid} · {c.n} perfis
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.dim }}>
          <span style={{ width: 10, height: 10, borderRadius: 99, border: `1.5px solid ${C.emerald}`, display: "inline-block" }} />
          Hub principal da comunidade
        </div>
      </div>
    </div>
  );
}
