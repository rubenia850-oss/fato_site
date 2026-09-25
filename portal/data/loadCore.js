// data/loadCore.js — orquestrador: busca todos os endpoints do Worker em paralelo e monta o
// mesmo objeto único que sempre alimentou o DataContext. Antes rodava ~13 funções de SQL local
// (loadTrails(db), loadProfiles(db)...); agora cada uma virou um endpoint no Worker que roda a
// MESMA lógica do lado do servidor (ver worker/src/*.js — porta 1:1, mesmas queries/comentários).
// O navegador só recebe o JSON já pronto — nunca mais o banco inteiro.
import { getJSON } from "../apiClient.js";

export async function loadCore() {
  const [
    trails, profiles, companies, guideBlocks, atlasTrails, eliteProfiles,
    normasCatalogo, socialBundle, technicalBundle, complementarity,
    sectorFato, mercadoTrabalho, sinaisMercado, panoramaUF,
  ] = await Promise.all([
    getJSON("/api/trilhas"),
    getJSON("/api/perfis"),
    getJSON("/api/companies"),
    getJSON("/api/guide-blocks"),
    getJSON("/api/atlas-trilhas"),
    getJSON("/api/elite-perfis"), // SP-45
    getJSON("/api/normas"), // SP-47
    getJSON("/api/social"), // -> { tagColors, formatMeta, social }
    getJSON("/api/technical"), // -> { technical }
    getJSON("/api/gaps"), // = complementaridade
    getJSON("/api/sector-fato"),
    getJSON("/api/mercado-trabalho"), // EXP-08
    getJSON("/api/sinais-mercado"), // SP-12 Grupo D
    getJSON("/api/panorama-uf"), // SP-57
  ]);

  return {
    social: socialBundle.social,
    tagColors: socialBundle.tagColors,
    formatMeta: socialBundle.formatMeta,
    technical: technicalBundle.technical,
    trails, profiles, guideBlocks, atlasTrails, eliteProfiles, normasCatalogo,
    complementarity, sectorFato, companies, mercadoTrabalho, sinaisMercado, panoramaUF,
  };
}

// M-12 — Smoke test: paridade de contagens. Adaptado pra rodar sobre o `core` já carregado da
// API (antes rodava um GROUP BY direto em `sources`, que agora só existe no servidor — as
// checagens de `guia`/`sector`, que dependiam disso, foram removidas; o resto continua igual).
export function runSmokeTest(core) {
  const floor = { social: 35, technical: 390, profiles: 98, trails: 187 };
  const actual = {
    social: core.social.length,
    technical: core.technical.length,
    profiles: core.profiles.length,
    trails: core.atlasTrails.length, // "Atlas Trilhas" — não confundir com as 6 `trails` customizadas
  };
  let ok = true;
  for (const k in floor) {
    const pass = actual[k] >= floor[k];
    if (!pass) ok = false;
    const arrow = actual[k] > floor[k] ? `(+${actual[k] - floor[k]} desde o piso, ok)` : "";
    console.log(`[Smoke M-12] ${k}: piso=${floor[k]} atual=${actual[k]} ${pass ? "✅" : "❌ QUEDA — investigar"} ${arrow}`);
  }
  console.log(ok ? "[Smoke M-12] ✅ Nenhuma queda abaixo do piso conhecido" : "[Smoke M-12] ❌ Queda detectada — possível perda de dado, ver acima");
  return { floor, actual, ok };
}
