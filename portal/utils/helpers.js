// utils/helpers.js — funções puras de apoio, sem dependência de React ou banco.
// Extraído de App.jsx (linhas 21-32 originais, "Sprint 6") na quebra do monólito (D98/D99, 05/07/2026).

export function groupBy(rows, keyField) {
  const map = {};
  for (const r of rows) {
    (map[r[keyField]] ||= []).push(r);
  }
  return map;
}

export function slugify(s) {
  return (s || "").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

// Formatação pt-BR — usadas por ViewMercadoTrabalho e ViewProfiles (Etapas 5/6/7 da quebra
// do monólito, D98/D103, 05/07/2026). Extraídas do meio do arquivo, entre ViewEmpresas e
// ViewMercadoTrabalho na numeração original — moradia natural é aqui, junto de slugify/groupBy,
// por serem funções puras de formatação, não específicas de nenhuma view.
export const fmtMoeda = (v) => v==null ? "—" : `R$ ${Math.round(v).toLocaleString("pt-BR")}`;
export const fmtNum = (v) => v==null ? "—" : v.toLocaleString("pt-BR");
