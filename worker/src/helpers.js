// helpers.js — réplica exata de portal/utils/helpers.js (groupBy, slugify), pra manter a
// mesma lógica de agrupamento que loadTrailsProfiles.js já usa no cliente.

export function groupBy(rows, key) {
  const out = {};
  rows.forEach((r) => {
    const k = r[key];
    (out[k] = out[k] || []).push(r);
  });
  return out;
}

export function slugify(name) {
  return String(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Executa uma query no D1 e retorna array de objetos — equivalente ao query(db, sql) de db.js,
// só que assíncrono (D1 não tem API síncrona como sql.js).
export async function query(db, sql, params = []) {
  const stmt = params.length ? db.prepare(sql).bind(...params) : db.prepare(sql);
  const { results } = await stmt.all();
  return results;
}
