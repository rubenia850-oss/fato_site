// index.js — Worker de produção. O navegador nunca fala com o banco: só com estes
// endpoints, que decidem o que devolver.
// Reaproveita a lógica exata de portal/data/loadTrailsProfiles.js (loadTrails/loadProfiles),
// só trocando a fonte de sql.js local pro binding D1.
//
// Segurança (25/09/2026, Relatório Técnico Final IndústriaEDU):
// - CORS restrito ao domínio do site publicado (era "*").
// - Rate limit simples de 40 req/60s por IP, armazenado no próprio D1 (tabela
//   _rate_limit, criada sob demanda). Falha "aberta": se o rate-limit em si der
//   erro, a API continua respondendo normalmente em vez de derrubar o serviço.

import { loadTrails } from "./loadTrails.js";
import { loadProfiles } from "./loadProfiles.js";
import { loadCompanies } from "./loadCompanies.js";
import { loadGuideBlocks, loadAtlasTrails, loadElitePerfis, loadNormasCatalogo } from "./loadAtlas.js";
import { loadSocialBundle, loadTechnicalBundle } from "./loadSocialTechnical.js";
import { loadComplementarity, loadSectors, loadGuia, loadSectorFato } from "./loadSectorsGuia.js";
import { loadMercadoTrabalho, loadSinaisMercado, loadPanoramaUF } from "./loadMercado.js";

// Origens autorizadas a chamar a API a partir do navegador. Ajuste aqui se o
// portal ganhar um domínio próprio no futuro.
const ALLOWED_ORIGINS = new Set([
  "https://projetoindustrial.github.io",
]);

const RATE_LIMIT_MAX = 40; // requests
const RATE_LIMIT_WINDOW_SECONDS = 60;

function corsHeaders(request) {
  const origin = request.headers.get("origin");
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "public, max-age=300",
    vary: "origin",
  };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["access-control-allow-origin"] = origin;
  }
  return headers;
}

let rateLimitTableReady = false;

async function ensureRateLimitTable(db) {
  if (rateLimitTableReady) return;
  await db
    .prepare(
      "CREATE TABLE IF NOT EXISTS _rate_limit (ip TEXT NOT NULL, window_start INTEGER NOT NULL, count INTEGER NOT NULL, PRIMARY KEY (ip, window_start))"
    )
    .run();
  rateLimitTableReady = true;
}

/** Retorna true se a requisição deve ser bloqueada (429). Falha aberta em caso de erro. */
async function isRateLimited(db, ip) {
  try {
    await ensureRateLimitTable(db);
    const windowStart = Math.floor(Date.now() / 1000 / RATE_LIMIT_WINDOW_SECONDS);
    const row = await db
      .prepare("SELECT count FROM _rate_limit WHERE ip = ? AND window_start = ?")
      .bind(ip, windowStart)
      .first();
    const current = row ? row.count : 0;
    if (current >= RATE_LIMIT_MAX) return true;
    await db
      .prepare(
        "INSERT INTO _rate_limit (ip, window_start, count) VALUES (?, ?, 1) " +
          "ON CONFLICT(ip, window_start) DO UPDATE SET count = count + 1"
      )
      .bind(ip, windowStart)
      .run();
    return false;
  } catch (err) {
    // Rate limit é proteção extra, não deve derrubar a API se o D1 falhar aqui.
    return false;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const headers = corsHeaders(request);

    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    if (await isRateLimited(env.DB, ip)) {
      return new Response(JSON.stringify({ error: "too many requests" }), {
        status: 429,
        headers: { ...headers, "retry-after": String(RATE_LIMIT_WINDOW_SECONDS) },
      });
    }

    try {
      if (url.pathname === "/api/trilhas" && request.method === "GET") {
        const data = await loadTrails(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/perfis" && request.method === "GET") {
        const data = await loadProfiles(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/companies" && request.method === "GET") {
        const data = await loadCompanies(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/guide-blocks" && request.method === "GET") {
        const data = await loadGuideBlocks(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/atlas-trilhas" && request.method === "GET") {
        const data = await loadAtlasTrails(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/elite-perfis" && request.method === "GET") {
        const data = await loadElitePerfis(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/normas" && request.method === "GET") {
        const data = await loadNormasCatalogo(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/social" && request.method === "GET") {
        const data = await loadSocialBundle(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/technical" && request.method === "GET") {
        const data = await loadTechnicalBundle(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/gaps" && request.method === "GET") {
        const data = await loadComplementarity(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/sectors" && request.method === "GET") {
        const data = await loadSectors(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/guia" && request.method === "GET") {
        const data = await loadGuia(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/sector-fato" && request.method === "GET") {
        const data = await loadSectorFato(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/mercado-trabalho" && request.method === "GET") {
        const data = await loadMercadoTrabalho(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/sinais-mercado" && request.method === "GET") {
        const data = await loadSinaisMercado(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      if (url.pathname === "/api/panorama-uf" && request.method === "GET") {
        const data = await loadPanoramaUF(env.DB);
        return new Response(JSON.stringify(data), { headers });
      }

      return new Response(JSON.stringify({ error: "not found" }), {
        status: 404,
        headers,
      });
    } catch (err) {
      // Erro cru (err.message) só em teste — antes de produção, trocar por log estruturado
      // e mensagem genérica ao cliente, pra não vazar detalhe de schema em erro de SQL.
      return new Response(JSON.stringify({ error: "internal error", detail: String(err.message || err) }), {
        status: 500,
        headers,
      });
    }
  },
};
