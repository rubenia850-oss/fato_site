// NOTA DE ARQUITETURA (atualizada 05/07/2026 — quebra do monólito, D98-D105)
// ──────────────────────────────────────────────────────────────────────────────
// App.jsx é hoje só o orquestrador raiz: carrega o banco (`fato_v168.db` via sql.js),
// monta o contexto de dados compartilhado e roteia entre as views. Era um arquivo único de
// 2823 linhas (13 funções de carga, 9 componentes, 14 views) — quebrado em 23 módulos:
//   theme/tokens.js       — tokens de cor + helpers de estilo (pill/card/btn)
//   utils/helpers.js      — funções puras (groupBy, slugify, fmtMoeda, fmtNum)
//   context/DataContext.js — o React Context compartilhado por quase todo componente
//   components/           — badges, Nav, LoadingScreen, SourceCard, TrailCard
//   data/                 — as funções load*(db), loadCore (orquestra todas), searchIndex
//   views/                — as 10 telas do portal, uma por arquivo
// Cada módulo é carregado no navegador por um carregador de múltiplos arquivos (ver
// `index.html`), sem bundler — descobre imports por regex, transpila e executa em ordem
// topológica. Ver `ROTEIRO_QUEBRA_MONOLITO.md` para o roteiro completo e `_DECISIONS.md`
// (D98 a D105) para o histórico e verificação de cada etapa.
// ──────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { C } from "./theme/tokens.js";
import { DataContext, useData } from "./context/DataContext.js";
import { LoadingScreen } from "./components/LoadingScreen.jsx";
import { Nav } from "./components/Nav.jsx";
import { loadCore, runSmokeTest } from "./data/loadCore.js";
import { loadSectors, loadGuia } from "./data/loadLazy.js";
import { buildSearchIndex, searchFTS } from "./data/searchIndex.js";
import { ViewHome } from "./views/ViewHome.jsx";
import { ViewTrails } from "./views/ViewTrails.jsx";
import { ViewEmpresas } from "./views/ViewEmpresas.jsx";
import { ViewAbout } from "./views/ViewAbout.jsx";
import { ViewExplore } from "./views/ViewExplore.jsx";
import { ViewMercadoTrabalho } from "./views/ViewMercadoTrabalho.jsx";
import { ViewGuideBlocks } from "./views/ViewGuideBlocks.jsx";
import { ViewGaps } from "./views/ViewGaps.jsx";
import { ViewProfiles } from "./views/ViewProfiles.jsx";
import { ViewSectors } from "./views/ViewSectors.jsx";
import { ViewRedeCarreira } from "./views/ViewRedeCarreira.jsx";
import { ViewElitePerfis } from "./views/ViewElitePerfis.jsx";

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App(){
  const [view,setView]   = useState("home");
  const [favs,setFavs]   = useState(new Set());

  // ── Carregamento de dados (M-01): via API do Worker (fato-portal-api), ponto de entrada único ──
  const [social,setSocial]       = useState([]);
  const [technical,setTechnical] = useState([]);
  const [trails,setTrails]       = useState([]);
  const [profiles,setProfiles]   = useState([]);
  const [guideBlocks,setGuide]   = useState([]);
  const [atlasTrails,setAtlas]         = useState([]);
  const [eliteProfiles,setEliteProfiles] = useState([]); // SP-45
  const [normasCatalogo,setNormasCatalogo] = useState({}); // SP-47
  const [complementarity,setCompat]    = useState([]);
  const [tagColors,setTagColors]       = useState({});
  const [formatMeta,setFormatMeta]     = useState({});
  const [sectorFato,setSectorFato]     = useState({});
  const [companies,setCompanies]       = useState([]); // EXP-04
  const [mercadoTrabalho,setMercado]   = useState([]); // EXP-08
  const [sinaisMercado,setSinaisMercado] = useState({comprasGoverno:[],concursos:[],noticias:[],colapso:[]}); // SP-12 Grupo D
  const [panoramaUF,setPanoramaUF] = useState([]); // SP-57
  const [dataLoaded,setLoaded]         = useState(false);
  const [loadError,setLoadError]       = useState(null);
  const [globalQ,setGlobalQ]           = useState("");

  // SP-03: navegação cruzada Explore→Perfil (cnct_hint clicável)
  // CORREÇÃO CRÍTICA (03/07): este useState estava declarado ABAIXO dos `if(loadError) return`/
  // `if(!dataLoaded) return` — violação das Regras de Hooks do React. Na 1ª renderização
  // (dataLoaded=false) o componente retorna antes de chamar este hook; quando os dados terminam
  // de carregar e o componente re-renderiza, ele passa pelos `if`s e chama um hook NOVO que não
  // existia na renderização anterior — React error #310 ("Rendered more hooks than during the
  // previous render"), reproduzido em teste real de browser (Playwright) ao tentar visualizar
  // o site pela primeira vez. Bug pré-existente, não introduzido pelas mudanças SP-12. Todo hook
  // precisa ficar acima de qualquer `return` condicional — corrigido movendo pra cá.
  const [pendingProfile, setPendingProfile] = useState(null);
  const [pendingCompany, setPendingCompany] = useState(null); // SP-58

  // M-11 — lazy loading: `sector` e `guia` só são materializados quando a aba é aberta
  const [sectors,setSectors]           = useState([]);
  const [sectorsLoading,setSectorsLoading] = useState(false);
  const [guia,setGuia]                 = useState([]);
  const [guiaLoading,setGuiaLoading]   = useState(false);

  useEffect(()=>{
    loadCore().then(core=>{
      setSocial(core.social); setTechnical(core.technical); setTrails(core.trails);
      setProfiles(core.profiles); setGuide(core.guideBlocks); setAtlas(core.atlasTrails);
      setEliteProfiles(core.eliteProfiles); // SP-45
      setNormasCatalogo(core.normasCatalogo); // SP-47
      setCompat(core.complementarity); setTagColors(core.tagColors); setFormatMeta(core.formatMeta);
      setSectorFato(core.sectorFato);
      setCompanies(core.companies); // EXP-04
      setMercado(core.mercadoTrabalho); // EXP-08
      setSinaisMercado(core.sinaisMercado); // SP-12 Grupo D
      setPanoramaUF(core.panoramaUF); // SP-57
      runSmokeTest(core); // M-12
      try { buildSearchIndex(core); } catch(e){ console.warn("[SP-02] índice de busca não pôde ser criado:",e); } // SP-02A
      setLoaded(true);
    }).catch(err=>{ console.error("Erro ao carregar dados da API:",err); setLoadError(err); });
  },[]);

  const ensureSectorsLoaded = useCallback(()=>{
    if (sectors.length || sectorsLoading) return;
    setSectorsLoading(true);
    loadSectors().then(data=>{ setSectors(data); setSectorsLoading(false); })
      .catch(err=>{ console.error("Erro ao carregar setores:",err); setSectorsLoading(false); });
  },[sectors.length,sectorsLoading]);

  const ensureGuiaLoaded = useCallback(()=>{
    if (guia.length || guiaLoading) return;
    setGuiaLoading(true);
    loadGuia().then(data=>{ setGuia(data); setGuiaLoading(false); })
      .catch(err=>{ console.error("Erro ao carregar guia:",err); setGuiaLoading(false); });
  },[guia.length,guiaLoading]);

  const all = useMemo(()=>[...social,...technical],[social,technical]);
  const sourceMap = useMemo(()=>Object.fromEntries(all.map(s=>[s.id,s])),[all]);
  const newIds = useMemo(()=>new Set(all.filter(s=>s.batch!=null&&s.batch!=="").map(s=>s.id)),[all]);

  const sectorsSocial = useMemo(()=>["Todos",...new Set(social.map(s=>s.sector))],[social]);
  const sectorsTech   = useMemo(()=>["Todos",...new Set(technical.map(s=>s.sector))],[technical]);
  const sectorsAll    = useMemo(()=>["Todos",...new Set([...sectorsSocial.slice(1),...sectorsTech.slice(1)])],[sectorsSocial,sectorsTech]);

  const toggleFav=useCallback((id)=>{
    setFavs(prev=>{const next=new Set(prev);next.has(id)?next.delete(id):next.add(id);return next;});
  },[]);

  // CORREÇÃO CRÍTICA (03/07): mesmo padrão de bug do `pendingProfile` acima — este useCallback
  // também estava declarado abaixo dos `return`s condicionais. Movido pra cá.
  const navigateTo = useCallback((targetView, payload={}) => {
    if (targetView === "profiles" && payload.profileId != null) {
      setPendingProfile(payload.profileId);
    }
    if (targetView === "empresas" && payload.companyId != null) { // SP-58
      setPendingCompany(payload.companyId);
    }
    setView(targetView);
  }, []);

  if(loadError) return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.red,display:"flex",alignItems:"center",justifyContent:"center",padding:20,textAlign:"center",fontSize:13}}>
      Não foi possível carregar os dados da API. Verifique sua conexão e se a URL em <code>apiClient.js</code> está correta.<br/>{String(loadError.message||loadError)}
    </div>
  );
  if(!dataLoaded) return <LoadingScreen/>;

  const dataCtx = {
    social,technical,all,trails,profiles,guideBlocks,atlasTrails,eliteProfiles,normasCatalogo,complementarity,
    sectors,sectorsLoading,ensureSectorsLoaded,
    guia,guiaLoading,ensureGuiaLoaded,
    sourceMap,newIds,sectorsSocial,sectorsTech,sectorsAll,
    tagColors,formatMeta,
    sectorFato,
    companies, // EXP-04
    mercadoTrabalho, // EXP-08
    sinaisMercado, // SP-12 Grupo D
    panoramaUF, // SP-57
    search: (term)=>searchFTS(term), // SP-02B
    navigateTo, // SP-03
  };

  return (
    <DataContext.Provider value={dataCtx}>
      <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'IBM Plex Sans',system-ui,sans-serif"}}>
        <Nav view={view} setView={setView} favCount={favs.size} globalQ={globalQ} setGlobalQ={setGlobalQ}/>
        {view==="home"      && <ViewHome setView={setView}/>}
        {view==="explore"   && <ViewExplore favorites={favs} toggleFav={toggleFav} globalQ={globalQ}/>}
        {view==="trails"    && <ViewTrails favorites={favs} toggleFav={toggleFav}/>}
        {view==="profiles"  && <ViewProfiles pendingProfile={pendingProfile} onPendingConsumed={()=>setPendingProfile(null)}/>}
        {view==="gaps"      && <ViewGaps/>}
        {view==="sectors"   && <ViewSectors/>}
        {view==="guide"     && <ViewGuideBlocks/>}
        {view==="empresas"  && <ViewEmpresas pendingCompany={pendingCompany} onPendingConsumed={()=>setPendingCompany(null)}/>}
        {view==="mercado"   && <ViewMercadoTrabalho/>}
        {view==="rede"      && <ViewRedeCarreira/>}
        {view==="elite"     && <ViewElitePerfis/>}
        {view==="about"     && <ViewAbout/>}
      </div>
    </DataContext.Provider>
  );
}
