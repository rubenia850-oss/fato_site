// index.js — Worker de teste (2 endpoints), Opção C do VIABILIDADE_PUBLICACAO_E_TRANSPARENCIA.md.
// O navegador nunca fala com o banco: só com estes endpoints, que decidem o que devolver.
// Reaproveita a lógica exata de portal/data/loadTrailsProfiles.js (loadTrails/loadProfiles),
// só trocando a fonte de sql.js local pro binding D1.

import { loadTrails } from "./loadTrails.js";
import { loadProfiles } from "./loadProfiles.js";
import { loadCompanies } from "./loadCompanies.js";
import { loadGuideBlocks, loadAtlasTrails, loadElitePerfis, loadNormasCatalogo } from "./loadAtlas.js";
import { loadSocialBundle, loadTechnicalBundle } from "./loadSocialTechnical.js";
import { loadComplementarity, loadSectors, loadGuia, loadSectorFato } from "./loadSectorsGuia.js";
import { loadMercadoTrabalho, loadSinaisMercado, loadPanoramaUF } from "./loadMercado.js";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  // Ajuste pro domínio real do site antes de publicar em produção (ver README do worker) —
  // "*" é aceitável aqui porque os endpoints só fazem SELECT e devolvem dado já público.
  "access-control-allow-origin": "*",
  "cache-control": "public, max-age=300", // dado muda por sessão de publicação, não por request
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/api/trilhas" && request.method === "GET") {
        const data = await loadTrails(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/perfis" && request.method === "GET") {
        const data = await loadProfiles(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/companies" && request.method === "GET") {
        const data = await loadCompanies(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/guide-blocks" && request.method === "GET") {
        const data = await loadGuideBlocks(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/atlas-trilhas" && request.method === "GET") {
        const data = await loadAtlasTrails(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/elite-perfis" && request.method === "GET") {
        const data = await loadElitePerfis(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/normas" && request.method === "GET") {
        const data = await loadNormasCatalogo(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/social" && request.method === "GET") {
        const data = await loadSocialBundle(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/technical" && request.method === "GET") {
        const data = await loadTechnicalBundle(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/gaps" && request.method === "GET") {
        const data = await loadComplementarity(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/sectors" && request.method === "GET") {
        const data = await loadSectors(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/guia" && request.method === "GET") {
        const data = await loadGuia(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/sector-fato" && request.method === "GET") {
        const data = await loadSectorFato(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/mercado-trabalho" && request.method === "GET") {
        const data = await loadMercadoTrabalho(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/sinais-mercado" && request.method === "GET") {
        const data = await loadSinaisMercado(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      if (url.pathname === "/api/panorama-uf" && request.method === "GET") {
        const data = await loadPanoramaUF(env.DB);
        return new Response(JSON.stringify(data), { headers: JSON_HEADERS });
      }

      return new Response(JSON.stringify({ error: "not found" }), {
        status: 404,
        headers: JSON_HEADERS,
      });
    } catch (err) {
      // Erro cru (err.message) só em teste — antes de produção, trocar por log estruturado
      // e mensagem genérica ao cliente, pra não vazar detalhe de schema em erro de SQL.
      return new Response(JSON.stringify({ error: "internal error", detail: String(err.message || err) }), {
        status: 500,
        headers: JSON_HEADERS,
      });
    }
  },
};
