// data/trailCategories.js — classificação heurística de trilhas por área.
// IMPORTANTE: essa categoria NÃO existe no banco (tabela `trails` só tem name/cnct_label/
// description) — é inferida aqui por palavra-chave no nome e no rótulo CNCT. Pode classificar
// errado ou deixar em "Outros" trilhas que caberiam melhor numa área específica; revisar/
// corrigir manualmente é o próximo passo natural (ver conversa 25/09/2026 sobre o Relatório
// Técnico Final IndústriaEDU, seção 5 — lista de áreas sugerida por lá, dado real vem daqui).
const RULES = [
  { key:"automacao", label:"Automação e Controle", kws:["automação","automacao","automatização","automatizacao","controle","robótica","robotica","clp","instrumentação","instrumentacao"] },
  { key:"eletrica", label:"Elétrica e Eletrônica", kws:["elétric","eletric","eletrônic","eletronic","energia elétrica","energia eletrica","eletrotécnic","eletrotecnic"] },
  { key:"mecanica", label:"Mecânica e Manutenção", kws:["mecânic","mecanic","manutenção","manutencao","usinagem","solda","caldeiraria","tornearia","ajustagem"] },
  { key:"gestao", label:"Gestão e Administração", kws:["gestão","gestao","administra","logística","logistica","qualidade","produção industrial","producao industrial","supply chain"] },
  { key:"ti", label:"Tecnologia e TI Industrial", kws:["tecnologia da informação","tecnologia da informacao","informática","informatica","software","programação","programacao","redes de computadores","desenvolvimento de sistemas","banco de dados"] },
  { key:"alimentos", label:"Alimentos e Agro", kws:["aliment","agro","agrícola","agricola","agroindustr","agropecuár","agropecuar"] },
  { key:"construcao", label:"Construção e Infraestrutura", kws:["construção","construcao","edificaç","edificac","edificações","edificacoes","civil","infraestrutura","obras"] },
  { key:"seguranca", label:"Segurança e Meio Ambiente", kws:["segurança do trabalho","seguranca do trabalho","meio ambiente","ambiental","gestão ambiental","gestao ambiental"] },
];

export function categorizeTrail(trail) {
  const text = `${trail.name || ""} ${trail.cnct || ""}`.toLowerCase();
  for (const rule of RULES) {
    if (rule.kws.some(kw => text.includes(kw))) return rule.key;
  }
  return "outros";
}

export const CATEGORY_LABELS = Object.assign(
  Object.fromEntries(RULES.map(r => [r.key, r.label])),
  { outros: "Outros / Transversais" }
);

export const CATEGORY_ORDER = [...RULES.map(r => r.key), "outros"];
