// components/RedeDeCarreira.jsx — visualização da rede de carreira de um perfil (radial).
// Criado em 14/07/2026 pra substituir o badge de texto "HUB PRINCIPAL · 87 conexões" por um
// grafo de verdade. Ver ESTUDO_ARQUITETURA_E_PLANO.md §4 (peça de assinatura visual) e D111.
//
// Dado real usado, nada inventado — e os dois tipos NÃO são misturados com o mesmo peso visual:
//  • Laços FORTES — dm_sinonimos_perfis (já carregado em profile.sinonimos): pares específicos
//    de perfis com overlap calculado a partir de trilhas Atlas realmente compartilhadas. Só
//    cobre 21 pares em 85 perfis — quando existe, é o dado mais preciso que temos.
//  • Laços FRACOS — dm_rede_comunidades (profile.rede_comunidade): perfil pertence a 1 de 5
//    comunidades temáticas. Não diz "quanto" dois perfis se conectam, só que estão no mesmo
//    grupo — por isso desenhado sempre mais fino/apagado que um laço forte, nunca do mesmo peso.
//
// Layout: radial determinístico (sem lib de grafo — ângulo = índice/total), sem Vite/bundler,
// consistente com o resto do projeto. Cores da família roxo/indigo (sistema semântico D109:
// roxo = rede/relacionamento).

import { C } from "../theme/tokens.js";

const GRAU_COR = {
  "🔴 SINÔNIMO FORTE (Mesma carreira)": C.indigoBright,
  "🟡 SOBREPOSIÇÃO ALTA": C.indigoLight,
  "🟢 MODERADA": C.purpleLight,
};

export function RedeDeCarreira({ profile, allProfiles, navigateTo, size = 340 }) {
  const cx = size / 2, cy = size / 2;
  const selfCommunity = profile.rede_comunidade?.comunidade_id;

  const fortes = (profile.sinonimos || [])
    .slice()
    .sort((a, b) => (b.overlap || 0) - (a.overlap || 0))
    .slice(0, 6)
    .map(s => ({ id: s.outro_id, name: s.outro_nome, tipo: "forte", overlap: s.overlap, grau: s.grau }));

  const fortesIds = new Set(fortes.map(f => f.id));

  const fracos = selfCommunity == null ? [] : (allProfiles || [])
    .filter(p2 => p2.id !== profile.id && p2.rede_comunidade?.comunidade_id === selfCommunity && !fortesIds.has(p2.id))
    .slice(0, Math.max(0, 8 - fortes.length))
    .map(p2 => ({ id: p2.id, name: p2.name, tipo: "fraco" }));

  const nodes = [...fortes, ...fracos];

  if (nodes.length === 0) {
    return (
      <div style={{ fontSize: 11, color: C.muted, padding: "16px 0", textAlign: "center" }}>
        Sem sinônimos ou comunidade de rede mapeados pra este perfil ainda.
      </div>
    );
  }

  const n = nodes.length;
  const rStrong = size * 0.26, rWeak = size * 0.42;

  const positioned = nodes.map((node, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const r = node.tipo === "forte" ? rStrong * (1.15 - (node.overlap || 0.5) * 0.3) : rWeak;
    return { ...node, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });

  const shortName = (s) => (s || "").replace("Técnico em ", "").slice(0, 16);

  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: size, display: "block", margin: "0 auto" }}>
      {positioned.map(node => (
        <line key={"l" + node.id}
          x1={cx} y1={cy} x2={node.x} y2={node.y}
          stroke={node.tipo === "forte" ? (GRAU_COR[node.grau] || C.indigoBright) : C.purpleDim}
          strokeWidth={node.tipo === "forte" ? 1 + (node.overlap || 0.5) * 2.5 : 1}
          strokeOpacity={node.tipo === "forte" ? 0.9 : 0.45}
        />
      ))}

      {/* nó central — o perfil aberto */}
      <circle cx={cx} cy={cy} r={26} fill={C.greenDim} stroke={C.emerald} strokeWidth={1.5} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.emerald} fontFamily="'IBM Plex Sans',sans-serif">
        {shortName(profile.name)}
      </text>

      {positioned.map(node => {
        const r = node.tipo === "forte" ? 15 + (node.overlap || 0.5) * 6 : 11;
        return (
          <g key={node.id} style={{ cursor: navigateTo ? "pointer" : "default" }}
             onClick={() => navigateTo && navigateTo("profiles", { profileId: node.id })}>
            <circle cx={node.x} cy={node.y} r={r}
              fill={node.tipo === "forte" ? C.purpleDim : C.purpleDim3}
              stroke={node.tipo === "forte" ? (GRAU_COR[node.grau] || C.indigoBright) : C.purpleBorderA}
              strokeWidth={1.2} />
            <text x={node.x} y={node.y + r + 10} textAnchor="middle" fontSize={8} fill={C.dim} fontFamily="'IBM Plex Sans',sans-serif">
              {shortName(node.name)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
