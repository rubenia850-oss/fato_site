// components/RedeDeEmpresas.jsx — visualização da rede de uma empresa (radial).
// SP-58 (17/07/2026, item 6 do ESTUDO_VIABILIDADE_TABELAS_NAO_USADAS.md, decisão de produto do
// usuário: "pode replicar"). Mesmo padrão visual/estrutural de RedeDeCarreira.jsx (D111) — os dois
// tipos de laço NÃO são misturados com o mesmo peso visual.
//
// Dado real usado, nada inventado:
//  • Laços FORTES — dm_competicao_talentos (já carregado em company.concorrentes_talento): pares
//    específicos de empresas que competem pelos mesmos perfis de talento. Só 9 pares em 936
//    empresas — quando existe, é o dado mais preciso que temos (mesmo princípio de
//    dm_sinonimos_perfis no lado perfis). `overlap_pct_a` é 0-100 (não 0-1 como
//    dm_sinonimos_perfis.overlap_percent) — normalizado aqui na entrada do componente.
//  • Laços FRACOS — dm_rede_empresas_comunidades (company.rede_comunidade): empresa pertence a 1
//    de N comunidades de rede. 405/936 empresas (47%) — não diz "quanto" duas empresas se
//    relacionam, só que estão no mesmo grupo — desenhado sempre mais fino/apagado.
//
// Layout: radial determinístico (sem lib de grafo), mesmo esquema de cores (roxo/indigo, D109).

import { C } from "../theme/tokens.js";

export function RedeDeEmpresas({ company, allCompanies, navigateTo, size = 340 }) {
  const cx = size / 2, cy = size / 2;
  const selfCommunity = company.rede_comunidade?.comunidade_id;

  const fortes = (company.concorrentes_talento || [])
    .slice()
    .sort((a, b) => (b.perfis_comuns || 0) - (a.perfis_comuns || 0))
    .slice(0, 6)
    .map(c => ({ id: c.outra_id, name: c.outra_nome, tipo: "forte", overlap: (c.overlap_pct_a || 100) / 100, perfis_comuns: c.perfis_comuns }));

  const fortesIds = new Set(fortes.map(f => f.id));

  const fracos = selfCommunity == null ? [] : (allCompanies || [])
    .filter(c2 => c2.id !== company.id && c2.rede_comunidade?.comunidade_id === selfCommunity && !fortesIds.has(c2.id))
    .slice(0, Math.max(0, 8 - fortes.length))
    .map(c2 => ({ id: c2.id, name: c2.name, tipo: "fraco" }));

  const nodes = [...fortes, ...fracos];

  if (nodes.length === 0) {
    return (
      <div style={{ fontSize: 11, color: C.muted, padding: "16px 0", textAlign: "center" }}>
        Sem concorrência de talento ou comunidade de rede mapeada pra esta empresa ainda.
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

  const shortName = (s) => (s || "").slice(0, 18);
  const classif = company.rede_centralidade?.classificacao;

  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size}`} style={{ maxWidth: size, display: "block", margin: "0 auto" }}>
      {positioned.map(node => (
        <line key={"l" + node.id}
          x1={cx} y1={cy} x2={node.x} y2={node.y}
          stroke={node.tipo === "forte" ? C.indigoBright : C.purpleDim}
          strokeWidth={node.tipo === "forte" ? 1 + (node.overlap || 0.5) * 2.5 : 1}
          strokeOpacity={node.tipo === "forte" ? 0.9 : 0.45}
        />
      ))}

      {/* nó central — a empresa aberta */}
      <circle cx={cx} cy={cy} r={26} fill={C.greenDim} stroke={C.emerald} strokeWidth={1.5} />
      <text x={cx} y={cy + (classif ? -2 : 4)} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.emerald} fontFamily="'IBM Plex Sans',sans-serif">
        {shortName(company.name)}
      </text>
      {classif && (
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize={7} fill={C.emerald} fontFamily="'IBM Plex Sans',sans-serif">
          {classif.replace(/[^\w\s]/g, "").trim()}
        </text>
      )}

      {positioned.map(node => {
        const r = node.tipo === "forte" ? 15 + (node.overlap || 0.5) * 6 : 11;
        return (
          <g key={node.id} style={{ cursor: navigateTo ? "pointer" : "default" }}
             onClick={() => navigateTo && navigateTo("empresas", { companyId: node.id })}>
            <circle cx={node.x} cy={node.y} r={r}
              fill={node.tipo === "forte" ? C.purpleDim : C.purpleDim3}
              stroke={node.tipo === "forte" ? C.indigoBright : C.purpleBorderA}
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
