// views/ViewExplore.jsx — explorador de fontes (social/técnica), com filtros, busca e export CSV.
// Extraído de App.jsx na Etapa 6 da quebra do monólito (D98/D104, 05/07/2026).
import { useState, useMemo, useEffect } from "react";
import { C, pill, btn, SEL } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";
import { LAYER_META } from "../components/badges.jsx";
import { SourceCard } from "../components/SourceCard.jsx";

export function ViewExplore({favorites,toggleFav,globalQ=""}){
  const {all,social,technical,sourceMap,sectorsSocial,sectorsTech,sectorsAll,formatMeta} = useData();
  const [layer,setLayer]   = useState("all");
  const [sector,setSector] = useState("Todos");
  const [fmt,setFmt]       = useState("Todos");
  const [lang,setLang]     = useState("Todos");
  const [sortBy,setSortBy] = useState("relevance");
  const [viewMode,setViewMode] = useState("grid");
  const [noReg,setNoReg]   = useState(false);
  const [dataLayer,setDataLayer] = useState("free");
  const [onlyFav,setFav]   = useState(false);
  const [q,setQ]           = useState(globalQ);
  const [sel,setSel]       = useState(null);

  // SP-02: sincroniza busca global do Nav → filtro local
  useEffect(()=>{ if(globalQ!==undefined) setQ(globalQ); },[globalQ]);

  const sectors=layer==="social"?sectorsSocial:layer==="technical"?sectorsTech:sectorsAll;

  const sectorCounts=useMemo(()=>{
    const base=all.filter(c=>layer==="all"||c.layer===layer);
    return base.reduce((acc,c)=>{acc[c.sector]=(acc[c.sector]||0)+1;return acc;},{});
  },[layer,all]);

  const filtered=useMemo(()=>{
    let out=all.filter(s=>{
      if(layer!=="all"&&s.layer!==layer) return false;
      if(sector!=="Todos"&&s.sector!==sector) return false;
      if(fmt!=="Todos"&&s.format!==fmt) return false;
      if(dataLayer==="free"&&s.data_layer!=="primary") return false;
      if(onlyFav&&!favorites.has(s.id)) return false;
      if(noReg&&s.cadastro!==false) return false;
      if(lang!=="Todos"&&!(s.lang&&s.lang.includes(lang))) return false;
      if(q){const qL=q.toLowerCase();return s.company.toLowerCase().includes(qL)||s.program.toLowerCase().includes(qL)||s.sector.toLowerCase().includes(qL)||(s.tags||[]).some(t=>t.toLowerCase().includes(qL))||(s.cnct||[]).some(t=>t.toLowerCase().includes(qL));}
      return true;
    });
    if(sortBy==="company")  out=[...out].sort((a,b)=>a.company.localeCompare(b.company,"pt"));
    if(sortBy==="sector")   out=[...out].sort((a,b)=>a.sector.localeCompare(b.sector,"pt"));
    if(sortBy==="no-reg")   out=[...out].sort((a,b)=>(a.cadastro?1:0)-(b.cadastro?1:0));
    if(sortBy==="pt-first") out=[...out].sort((a,b)=>(b.lang?.includes("PT")?1:0)-(a.lang?.includes("PT")?1:0));
    return out;
  },[layer,sector,fmt,noReg,dataLayer,onlyFav,lang,q,sortBy,favorites,all]);

  const exportCSV=()=>{
    const header=["id","camada","empresa","programa","setor","formato","idioma","nacional","sem_cadastro","url","cnct"];
    const rows=filtered.map(c=>[c.id,c.layer,`"${c.company}"`,`"${c.program}"`,`"${c.sector}"`,c.format,c.lang||"",c.national,!c.cadastro,c.url,`"${(c.cnct||[]).join("; ")}"`]);
    const csv=[header,...rows].map(r=>r.join(",")).join("\n");
    const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download=`portal_industrial_${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{background:C.surface2,borderBottom:"1px solid #1e293b",padding:"12px 24px",position:"sticky",top:48,zIndex:10}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",gap:4,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
            {[["all","Tudo",C.text],["social","Social",C.social],["technical","Técnica",C.tech]].map(([v,l,c])=>(
              <button key={v} onClick={()=>{setLayer(v);setSector("Todos");}}
                style={{padding:"5px 14px",borderRadius:6,border:`1px solid ${layer===v?c:C.border}`,background:layer===v?c+"22":"transparent",color:layer===v?c:C.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:layer===v?700:400}}>
                {l}
              </button>
            ))}
            <div style={{display:"flex",borderRadius:7,overflow:"hidden",border:"1px solid #1e293b",marginLeft:4}}>
              {[["grid","▦"],["list","☰"]].map(([m,icon])=>(
                <button key={m} onClick={()=>setViewMode(m)}
                  style={{padding:"4px 11px",border:"none",background:viewMode===m?C.border:"transparent",color:viewMode===m?C.text:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>{icon}</button>
              ))}
            </div>
            <button onClick={exportCSV} style={{...btn("transparent",C.emerald,C.greenDark),fontSize:10,marginLeft:4}}>⬇ CSV ({filtered.length})</button>
            <div style={{flex:1}}/>
            <span style={{fontSize:11,color:C.faint}}>{filtered.length}/{all.length}</span>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍 Empresa, programa, CNCT, tag..."
              style={{flex:"1 1 180px",padding:"7px 12px",borderRadius:7,border:"1px solid #1e293b",background:C.bg,color:C.text,fontSize:12,outline:"none",fontFamily:"inherit"}}/>
            <select value={sector} onChange={e=>setSector(e.target.value)} style={{...SEL}}>
              {sectors.map(s=><option key={s} value={s}>{s==="Todos"?`Todos (${all.filter(c=>layer==="all"||c.layer===layer).length})`:`${s} (${sectorCounts[s]||0})`}</option>)}
            </select>
            <select value={fmt} onChange={e=>setFmt(e.target.value)} style={{...SEL}}>
              <option value="Todos">Todos formatos</option>
              <option value="EAD">EAD</option>
              <option value="HYBRID">EAD + Presencial</option>
              <option value="PRESENTIAL">Presencial</option>
            </select>
            <select value={lang} onChange={e=>setLang(e.target.value)} style={{...SEL}}>
              <option value="Todos">Todos idiomas</option>
              <option value="PT">🇧🇷 PT</option>
              <option value="EN">🌐 EN</option>
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{...SEL,fontSize:10}}>
              <option value="relevance">↕ Relevância</option>
              <option value="company">A→Z Empresa</option>
              <option value="sector">A→Z Setor</option>
              <option value="no-reg">Sem cadastro 1º</option>
              <option value="pt-first">Português 1º</option>
            </select>
            <label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.dim,cursor:"pointer",whiteSpace:"nowrap"}}>
              <input type="checkbox" checked={noReg} onChange={e=>setNoReg(e.target.checked)} style={{accentColor:C.lime}}/>Sem cadastro
            </label>
            <label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.greenLight,cursor:"pointer",whiteSpace:"nowrap"}} title="Oculta fontes pagas quando disponíveis">
              <input type="checkbox" checked={dataLayer==="free"} onChange={e=>setDataLayer(e.target.checked?"free":"all")} style={{accentColor:C.greenLight}}/>Apenas gratuitos
            </label>
            <label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.dim,cursor:"pointer",whiteSpace:"nowrap"}}>
              <input type="checkbox" checked={onlyFav} onChange={e=>setFav(e.target.checked)} style={{accentColor:C.red}}/>❤️ ({favorites.size})
            </label>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:"16px 20px"}}>
        {viewMode==="list"?(
          <div style={{background:C.surface,border:"1px solid #1e293b",borderRadius:10,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"3px 150px 1fr 160px 110px 60px 28px",gap:8,padding:"7px 14px",borderBottom:"2px solid #1e293b",background:C.surface3}}>
              <div/><div style={{fontSize:9,color:C.faint,textTransform:"uppercase",letterSpacing:1}}>Empresa</div>
              <div style={{fontSize:9,color:C.faint,textTransform:"uppercase",letterSpacing:1}}>Programa</div>
              <div style={{fontSize:9,color:C.faint,textTransform:"uppercase",letterSpacing:1}}>Setor</div>
              <div style={{fontSize:9,color:C.faint,textTransform:"uppercase",letterSpacing:1}}>Formato</div>
              <div style={{fontSize:9,color:C.faint,textTransform:"uppercase",letterSpacing:1}}>Idioma</div><div/>
            </div>
            {filtered.map((s,i)=>{
              const f2=formatMeta[s.format]||{label:s.format||"EAD",color:C.green,bg:C.greenDim};
              const lay=LAYER_META[s.layer];
              return (
                <div key={s.id} style={{display:"grid",gridTemplateColumns:"3px 150px 1fr 160px 110px 60px 28px",gap:8,padding:"9px 14px",borderBottom:"1px solid #1e293b",background:i%2?C.surface3:C.surface,alignItems:"center"}}
                  onMouseEnter={e=>e.currentTarget.style.background=C.hoverBg}
                  onMouseLeave={e=>e.currentTarget.style.background=i%2?C.surface3:C.surface}>
                  <div style={{width:3,height:28,background:lay.accent,borderRadius:99,alignSelf:"center"}}/>
                  <div>
                    <div style={{fontSize:11,fontWeight:600,color:C.heading,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.company}</div>
                  </div>
                  <div style={{fontSize:10,color:C.dim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={s.program}>{s.program}</div>
                  <div style={{fontSize:10,color:lay.accent,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.sector}</div>
                  <span style={{...pill(f2.bg,f2.color),fontSize:9,justifyContent:"center"}}>{f2.label}</span>
                  <span style={{fontSize:9,color:C.muted}}>{s.lang}</span>
                  <a href={s.url} target="_blank" rel="noreferrer" style={{color:C.tech,textDecoration:"none",fontSize:14}}>🔗</a>
                </div>
              );
            })}
            {filtered.length===0&&<div style={{textAlign:"center",color:C.faint,padding:40,fontSize:13}}>Nenhuma fonte encontrada.</div>}
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:10}}>
            {filtered.map(s=>(
              <SourceCard key={s.id} s={s} favorites={favorites} toggleFav={toggleFav}
                expanded={sel===s.id} onExpand={()=>setSel(sel===s.id?null:s.id)}/>
            ))}
            {filtered.length===0&&(
              <div style={{gridColumn:"1/-1",textAlign:"center",color:C.faint,padding:"50px 20px",fontSize:14}}>
                Nenhuma fonte com esses filtros.<br/>
                <button onClick={()=>{setLayer("all");setSector("Todos");setFmt("Todos");setLang("Todos");setNoReg(false);setDataLayer("free");setFav(false);setQ("");}}
                  style={{...btn(C.border,C.muted),marginTop:12}}>Limpar filtros</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
