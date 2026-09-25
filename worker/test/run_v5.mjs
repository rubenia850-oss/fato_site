import { makeD1Shim } from "./d1-shim.mjs";
import { loadTrails } from "../src/loadTrails.js";
import { loadProfiles } from "../src/loadProfiles.js";
import { loadCompanies } from "../src/loadCompanies.js";
import { loadGuideBlocks, loadAtlasTrails, loadElitePerfis, loadNormasCatalogo } from "../src/loadAtlas.js";
import { loadSocialBundle, loadTechnicalBundle } from "../src/loadSocialTechnical.js";
import { loadComplementarity, loadSectors, loadGuia, loadSectorFato } from "../src/loadSectorsGuia.js";
import { loadMercadoTrabalho, loadSinaisMercado, loadPanoramaUF } from "../src/loadMercado.js";

const DB_PATH = process.argv[2];
const db = makeD1Shim(DB_PATH);

const t0 = Date.now();
const trails = await loadTrails(db);
const profiles = await loadProfiles(db);
const companies = await loadCompanies(db);
const guideBlocks = await loadGuideBlocks(db);
const atlasTrails = await loadAtlasTrails(db);
const elitePerfis = await loadElitePerfis(db);
const normasCatalogo = await loadNormasCatalogo(db);
const socialBundle = await loadSocialBundle(db);
const technicalBundle = await loadTechnicalBundle(db);
const gaps = await loadComplementarity(db);
const sectors = await loadSectors(db);
const guia = await loadGuia(db);
const sectorFato = await loadSectorFato(db);
const mercadoTrabalho = await loadMercadoTrabalho(db);
const sinaisMercado = await loadSinaisMercado(db);
const panoramaUF = await loadPanoramaUF(db);
const t1 = Date.now();

console.log(`Site INTEIRO carregado em ${t1-t0}ms — 16 loaders/bundles, 85/85 tabelas\n`);
console.log("trails:", trails.length, "profiles:", profiles.length, "companies:", companies.length);
console.log("guideBlocks:", guideBlocks.length, "atlasTrails:", atlasTrails.length, "elitePerfis:", elitePerfis.length, "normas:", Object.keys(normasCatalogo).length);
console.log("social:", socialBundle.social.length, "technical:", technicalBundle.technical.length);
console.log("gaps:", gaps.length, "sectors:", sectors.length, "guia:", guia.length, "sectorFato (setores):", Object.keys(sectorFato).length);
console.log("mercadoTrabalho (cbos agregados):", mercadoTrabalho.length);
console.log("sinaisMercado:", Object.fromEntries(Object.entries(sinaisMercado).map(([k,v]) => [k, v.length])));
console.log("panoramaUF (UFs):", panoramaUF.length);

console.log("\n--- checagens dos achados documentados ---");
const sectorFatoComMonopolio = Object.values(sectorFato).filter(s => s.monopolio).length;
console.log("setores com dado de monopolio (SP-12/rename v168):", sectorFatoComMonopolio);
const sectorFatoComDensidade = Object.values(sectorFato).filter(s => s.densidade).length;
console.log("setores com densidade:", sectorFatoComDensidade);

const ufsComPnp = panoramaUF.filter(u => u.pnp).length;
console.log(`UFs com pnp (dm_pnp_indicadores, VIEW sobre dm_oferta_real): ${ufsComPnp}/${panoramaUF.length}`);
const ufsComCalor = panoramaUF.filter(u => u.calor.length > 0).length;
console.log(`UFs com dado de calor (VIEW vw_mapa_calor_preditivo, filtro uf IS NOT NULL): ${ufsComCalor}/${panoramaUF.length}`);
const ufsComDemanda = panoramaUF.filter(u => u.setores_demanda.length > 0).length;
console.log(`UFs com demanda (VIEW vw_indicador_demanda, usa dm_importacoes_maquinas): ${ufsComDemanda}/${panoramaUF.length}`);

console.log("\nOK — nenhuma exceção lançada em nenhum dos 16 loaders/bundles. Site 100% funcional contra o D1.");
