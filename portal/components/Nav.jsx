// components/Nav.jsx — barra de navegação superior, com busca global (SP-02B).
// Extraído de App.jsx na Etapa 2 da quebra do monólito (D98/D100, 05/07/2026).
// UX 25/09/2026 (Relatório Técnico Final IndústriaEDU, seção 4.2): menu vira hambúrguer
// em telas estreitas — os 12 itens não cabem numa linha só no celular. Regras de
// exibição (.nav-items / .nav-hamburger) ficam em portal/index.html.
import { useState, useEffect } from "react";
import { C, btn } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";

const NAV_ITEMS = [["home","Início"],["explore","Explorar"],["trails","Trilhas"],["profiles","Perfis CNCT"],["elite","Perfis de Elite"],["guide","Guia"],["gaps","Cobertura Guia × Atlas"],["sectors","Setores"],["empresas","Empresas"],["mercado","Mercado"],["rede","Rede de Carreira"],["about","Sobre"]];

export function Nav({view,setView,favCount,globalQ,setGlobalQ}){
  const {all,trails,profiles,guideBlocks,complementarity,sectors,companies,mercadoTrabalho,eliteProfiles,search} = useData();
  const [results,setResults] = useState({fonte:[],perfil:[],trilha:[]});
  const [mobileOpen,setMobileOpen] = useState(false);

  // SP-02B — busca global via FTS5 (debounce leve, índice já é local/em memória)
  useEffect(()=>{
    if(!globalQ.trim()){ setResults({fonte:[],perfil:[],trilha:[]}); return; }
    const t=setTimeout(()=>setResults(search(globalQ)),120);
    return ()=>clearTimeout(t);
  },[globalQ,search]);

  const CATEGORY_LABEL={fonte:"Fontes",perfil:"Perfis CNCT",trilha:"Trilhas Atlas"};
  const totalResults=results.fonte.length+results.perfil.length+results.trilha.length;

  const goTo=(category,r)=>{
    if(category==="fonte"){ setView("explore"); setGlobalQ(r.label.split(" — ")[0]); return; }
    if(category==="perfil"){ setView("profiles"); setGlobalQ(""); return; }
    if(category==="trilha"){ setView("trails"); setGlobalQ(""); return; }
  };

  const countFor=(v)=>{
    if(v==="explore")return all.length;
    if(v==="trails")return trails.length;
    if(v==="profiles")return profiles.length;
    if(v==="elite")return eliteProfiles.length;
    if(v==="guide")return guideBlocks.length;
    if(v==="sectors")return sectors.length;
    if(v==="empresas")return companies.length;
    if(v==="mercado")return mercadoTrabalho.length;
    return null;
  };
  const gapsCount = complementarity.filter(x=>x.type==="guia_sem_atlas").length;

  const selectView=(v)=>{ setView(v); setMobileOpen(false); };

  return (
    <nav style={{background:C.surface,borderBottom:"1px solid #1e293b",padding:"0 20px",position:"sticky",top:0,zIndex:20}}>
      <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",gap:2}}>
        <button onClick={()=>selectView("home")} style={{background:"none",border:"none",cursor:"pointer",padding:"14px 0",marginRight:10}}>
          <span style={{fontWeight:900,fontSize:13,color:C.social}}>IndústriaEDU</span>
          <span style={{fontSize:9,color:C.faint,marginLeft:4}}>v3.6</span>
        </button>

        {/* Desktop: linha de itens (escondida em telas estreitas via CSS, ver index.html) */}
        <div className="nav-items">
          {NAV_ITEMS.map(([v,l])=>(
            <button key={v} onClick={()=>selectView(v)}
              style={{padding:"14px 11px",background:"none",border:"none",borderBottom:`2px solid ${view===v?C.social:"transparent"}`,color:view===v?C.social:C.muted,fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:view===v?700:400,transition:"color .15s",whiteSpace:"nowrap"}}>
              {l}
              {v==="gaps"
                ? <span style={{fontSize:9,marginLeft:3,color:C.redBright}}>{gapsCount}</span>
                : countFor(v)!==null && <span style={{fontSize:9,marginLeft:3,color:C.faint}}>{countFor(v)}</span>}
            </button>
          ))}
        </div>

        {/* Mobile: botão hambúrguer (escondido em telas largas via CSS) */}
        <button className="nav-hamburger" onClick={()=>setMobileOpen(o=>!o)}
          aria-label="Abrir menu"
          style={{background:"none",border:`1px solid ${C.border}`,borderRadius:7,color:C.text,fontSize:16,padding:"6px 11px",cursor:"pointer",marginRight:8}}>
          {mobileOpen?"✕":"☰"}
        </button>

        <div style={{marginLeft:"auto",position:"relative",display:"flex",alignItems:"center",gap:6}}>
          <input
            value={globalQ}
            onChange={e=>setGlobalQ(e.target.value)}
            placeholder="🔍 busca…"
            style={{background:C.surface,border:"1px solid #1e293b",borderRadius:6,padding:"4px 9px",color:C.text,fontSize:11,width:120,outline:"none",fontFamily:"inherit"}}
          />
          {globalQ&&<button onClick={()=>setGlobalQ("")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,padding:"0 2px"}}>✕</button>}
          {favCount>0&&(
            <button onClick={()=>setView("explore")}
              style={{...btn(C.redBorderA,C.red,C.redBorderA2),fontSize:11}}>❤️ {favCount}</button>
          )}
          {/* SP-02B: painel de resultados por categoria */}
          {globalQ.trim()&&(
            <div style={{position:"absolute",top:"calc(100% + 6px)",right:0,width:280,maxWidth:"90vw",maxHeight:420,overflowY:"auto",
              background:C.surface,border:"1px solid #1e293b",borderRadius:10,boxShadow:"0 12px 28px rgba(0,0,0,.5)",zIndex:30,padding:8}}>
              {totalResults===0
                ?<div style={{fontSize:11,color:C.muted,padding:12,textAlign:"center"}}>Nenhum resultado para "{globalQ}"</div>
                :["fonte","perfil","trilha"].map(cat=>results[cat].length>0&&(
                  <div key={cat} style={{marginBottom:6}}>
                    <div style={{fontSize:9,color:C.faint,textTransform:"uppercase",letterSpacing:1,padding:"4px 6px"}}>
                      {CATEGORY_LABEL[cat]} ({results[cat].length})
                    </div>
                    {results[cat].map(r=>(
                      <div key={cat+r.ref_id} onClick={()=>goTo(cat,r)}
                        style={{padding:"7px 8px",borderRadius:6,cursor:"pointer",transition:"background .1s"}}
                        onMouseEnter={e=>e.currentTarget.style.background=C.border}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                        <div style={{fontSize:11,color:C.text,fontWeight:600}}>{r.label}</div>
                        {r.snippet&&<div style={{fontSize:9,color:C.muted,marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.snippet}</div>}
                      </div>
                    ))}
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>

      {/* Painel mobile — lista vertical dos mesmos itens, só quando aberto */}
      {mobileOpen&&(
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",flexDirection:"column",borderTop:`1px solid ${C.border}`,paddingBottom:6}}>
          {NAV_ITEMS.map(([v,l])=>(
            <button key={v} onClick={()=>selectView(v)}
              style={{textAlign:"left",padding:"12px 8px",background:"none",border:"none",borderBottom:`1px solid ${C.border}`,color:view===v?C.social:C.text,fontSize:13,cursor:"pointer",fontFamily:"inherit",fontWeight:view===v?700:400}}>
              {l}
              {v==="gaps"
                ? <span style={{fontSize:10,marginLeft:6,color:C.redBright}}>{gapsCount}</span>
                : countFor(v)!==null && <span style={{fontSize:10,marginLeft:6,color:C.faint}}>{countFor(v)}</span>}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
