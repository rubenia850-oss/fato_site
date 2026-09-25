// theme/tokens.js — Sistema de tokens de cor e helpers de estilo.
// Extraído de App.jsx (linhas 39-51 originais) na quebra do monólito (D98/D99, 05/07/2026).
// Paleta expandida em 05/07/2026 (D97) — as 76 cores que antes estavam soltas pelo arquivo,
// nomeadas num só lugar. Ver ESTUDO_ARQUITETURA_E_PLANO.md seção 4.
//
// SISTEMA DE COR SEMÂNTICO (14/07/2026) — a lógica abaixo já existia implicitamente no uso
// real do código (auditada view por view antes de escrever isto); esta é a primeira vez que
// ela é declarada como regra. Ao adicionar cor nova a uma tela, escolher pelo SIGNIFICADO,
// não pelo gosto — e usar os tokens já existentes da família certa, não uma cor nova.
//
//   🟢 verde/emerald   — VANTAGEM para quem usa o site: valor em R$ (salário, saldo),
//                        conteúdo gratuito, status validado/aprovado, tendência de alta.
//   🔵 azul/skyBlue    — NAVEGAÇÃO e IDENTIFICADOR OFICIAL: link externo ("Acessar →"),
//                        código de trilha (TRL-...), código CBO, botão de navegação interna.
//   🟣 roxo/indigo     — REDE e RELACIONAMENTO: trilhas de carreira, soft skills, Atlas FATO,
//                        score de oportunidade, competidores de talento — dado que conecta
//                        uma entidade a outra, não um identificador isolado.
//   🟠 laranja/amber   — ALERTA e PRÉ-REQUISITO: pré-requisito, dificuldade, dominância de
//                        mercado, custo/pago, normas técnicas (NR-xx), avisos ⚠️.
//   🔴 vermelho        — CRÍTICO/NEGATIVO: erro, impacto muito alto, status inválido, saldo
//                        negativo.
//
// Achado ao auditar: código CBO aparecia ora em azul (identificador), ora em roxo (como se
// fosse dado de rede) sem critério — corrigido para azul em todo lugar (14/07/2026), por ser
// um identificador oficial (mesma família de TRL-xx), não uma relação. Ver _DECISIONS.md D109.

export const C = {
  bg:"#060810",surface:"#0f172a",surface2:"#0a0d18",border:"#1e293b",
  text:"#e2e8f0",muted:"#64748b",dim:"#94a3b8",
  social:"#6366f1",tech:"#0891b2",green:"#10b981",amber:"#f59e0b",
  purple:"#7c3aed",orange:"#f97316",
  amberBorderA:"#92400e44",amberLight:"#fbbf24",blue:"#60a5fa",blueBorderA:"#0369a144",blueBorderA2:"#1e3a8a44",blueBorderA3:"#1e3a8a33",blueBorderA4:"#1e40af55",blueDark:"#1e3a8a",blueDim:"#0c1a3a",blueDim2:"#0c2333",borderLight:"#334155",emerald:"#34d399",faint:"#475569",greenBorder:"#15803d",greenBorderA:"#16a34a44",greenBorderA2:"#22c55e44",greenBright:"#22c55e",greenDark:"#065f46",greenDim:"#052e1c",greenDim2:"#0c2a1e",greenDim3:"#0c2a0c",greenDim4:"#14290f",greenLight:"#4ade80",heading:"#f1f5f9",hoverBg:"#0c1830",indigoBorderA:"#4338ca44",indigoBorderA2:"#4338ca66",indigoBorderA3:"#3730a344",indigoBorderA4:"#3730a333",indigoBright:"#818cf8",indigoDark:"#3730a3",indigoLight:"#a5b4fc",lime:"#a3e635",limeBorderA:"#a3e63533",orangeBorderA:"#c2410c44",orangeDim:"#1c0f00",orangeDim2:"#1c1207",orangeDim3:"#291a00",orangeDim4:"#1a1000",orangeLight:"#fb923c",purpleBorderA:"#7c3aed44",purpleDim:"#1e1b4b",purpleDim2:"#3b0764",purpleDim3:"#1e0a3c",purpleLight:"#a78bfa",purpleSoft:"#c4b5fd",red:"#f87171",redBorder:"#7f1d1d",redBorderA:"#f8717122",redBorderA2:"#f8717144",redBright:"#ef4444",redDim:"#450a0a",redDim2:"#1c0a0a",redDim3:"#2a0f0f",skyBlue:"#38bdf8",surface3:"#080d18",surfacePanel:"#0c1322",textSoft:"#cbd5e1",tierT2:"#3b82f6",tierT4:"#8b5cf6",warmGray:"#78716c",white:"#fff",yellow:"#facc15",
};

export const pill=(bg,color,border)=>({fontSize:10,padding:"2px 9px",borderRadius:99,background:bg,color,border:`1px solid ${border||color+"44"}`,whiteSpace:"nowrap",fontWeight:600,display:"inline-flex",alignItems:"center",gap:3});
export const card=(accent=C.border)=>({background:C.surface,border:`1px solid ${accent}`,borderRadius:10,overflow:"hidden"});
export const btn=(bg,color,border)=>({padding:"6px 14px",borderRadius:7,background:bg,color,border:`1px solid ${border||color+"55"}`,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600,whiteSpace:"nowrap"});
export const SEL={padding:"7px 10px",borderRadius:7,border:`1px solid ${C.border}`,background:C.bg,color:C.text,fontSize:11,fontFamily:"inherit"};
