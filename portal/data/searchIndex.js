// data/searchIndex.js — antes era um índice FTS5 rodando dentro do sql.js local; agora que o
// navegador não tem mais o banco, virou uma busca simples em memória sobre os arrays que a API
// já devolveu (core.social/technical/profiles/atlasTrails). Mesma interface pro resto do app
// (buildSearchIndex, searchFTS), só a implementação interna que trocou de SQL pra JS puro.
let INDEX = null;

export function buildSearchIndex(core) {
  const idx = [];
  [...core.social, ...core.technical].forEach((s) => {
    idx.push({ category: "fonte", ref_id: s.id, label: `${s.company || ""} — ${s.program || ""}`, snippet: s.highlight || s.program || "" });
  });
  core.profiles.forEach((p) => {
    idx.push({ category: "perfil", ref_id: p.id, label: p.name, snippet: p.campo_atuacao || "" });
  });
  core.atlasTrails.forEach((t) => {
    idx.push({ category: "trilha", ref_id: t.code, label: t.name, snippet: t.description || "" });
  });
  INDEX = idx;
}

export function searchFTS(term, limitPerCategory = 8) {
  if (!term || !term.trim() || !INDEX) return { fonte: [], perfil: [], trilha: [] };
  const words = term.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const out = { fonte: [], perfil: [], trilha: [] };
  for (const r of INDEX) {
    const hay = `${r.label} ${r.snippet}`.toLowerCase();
    if (words.every((w) => hay.includes(w))) {
      if (out[r.category] && out[r.category].length < limitPerCategory) out[r.category].push(r);
    }
  }
  return out;
}
