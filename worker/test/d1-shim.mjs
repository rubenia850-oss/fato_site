// d1-shim.mjs — simula o subconjunto da API D1 (env.DB.prepare(sql).bind(...).all()) usado por
// helpers.js#query, em cima do node:sqlite local, só pra testar loadTrails.js/loadProfiles.js
// contra o banco real ANTES de qualquer deploy de verdade no Cloudflare.
import { DatabaseSync } from "node:sqlite";

export function makeD1Shim(dbPath) {
  const raw = new DatabaseSync(dbPath, { readOnly: true });
  return {
    prepare(sql) {
      let boundParams = [];
      return {
        bind(...params) {
          boundParams = params;
          return this;
        },
        async all() {
          const stmt = raw.prepare(sql);
          const results = boundParams.length ? stmt.all(...boundParams) : stmt.all();
          return { results };
        },
      };
    },
  };
}
