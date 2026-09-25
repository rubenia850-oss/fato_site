// views/ViewEmpresas.jsx — catálogo de empresas mapeadas, com filtro por setor/UF.
// Extraído de App.jsx na Etapa 5 da quebra do monólito (D98/D103, 05/07/2026).
// 442 empresas (`companies`), pós-fusões de duplicatas Sprint 9/14 (615→513→447) + D70-DB sessão BANCO (447→442, 5 pares: Anglo American, Khan Academy, Schneider Electric, SEL, GHG Protocol), com setores (company_sectors), contagem de fontes
// e sugestão de URL validada (company_url_suggestions). Filtro por setor e UF.
import { useState, useMemo, useEffect } from "react";
import { C, pill, card, btn, SEL } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";
import { urlConfMeta } from "../components/badges.jsx";
import { RedeDeEmpresas } from "../components/RedeDeEmpresas.jsx";

export function ViewEmpresas({pendingCompany, onPendingConsumed}){
  const {companies,navigateTo}=useData();
  const [q,setQ]=useState("");
  const [ufFilter,setUf]=useState("Todos");
  const [sectorFilter,setSectorFilter]=useState("Todos");
  const [onlyWithUrl,setOnlyWithUrl]=useState(false);
  const [selected,setSelected]=useState(null); // SP-58

  // SP-58: mesmo padrão de navegação cruzada do SP-03 (ViewProfiles/pendingProfile)
  useEffect(()=>{
    if(pendingCompany!=null && companies.length){
      const c = companies.find(x=>x.id===pendingCompany);
      if(c){ setSelected(c); onPendingConsumed&&onPendingConsumed(); }
    }
  },[pendingCompany, companies]); // eslint-disable-line

  const ufs=useMemo(()=>["Todos",...new Set(companies.map(c=>c.uf).filter(Boolean))].sort(),[companies]);
  const sectorOptions=useMemo(()=>{
    const map={};
    companies.forEach(c=>c.sectors.forEach(s=>{ map[s.id]=s.name; }));
    return [["Todos","Todos os setores"],...Object.entries(map).sort((a,b)=>a[1].localeCompare(b[1]))];
  },[companies]);

  const filtered=useMemo(()=>companies.filter(c=>
    (!q||c.name.toLowerCase().includes(q.toLowerCase()))&&
    (ufFilter==="Todos"||c.uf===ufFilter)&&
    (sectorFilter==="Todos"||c.sectors.some(s=>String(s.id)===String(sectorFilter)))&&
    (!onlyWithUrl||c.url)
  ),[companies,q,ufFilter,sectorFilter,onlyWithUrl]);

  // SP-58 (item 6): painel de detalhe da empresa, com Rede de Empresas (grafo radial, mesmo
  // padrão de RedeDeCarreira.jsx no lado perfis — ver components/RedeDeEmpresas.jsx)
  if(selected){
    const conf=urlConfMeta(selected.url_confianca);
    return(
      <div style={{maxWidth:800,margin:"0 auto",padding:"24px 16px"}}>
        <button onClick={()=>setSelected(null)} style={{...btn(C.border,C.dim),marginBottom:16}}>← Todas as empresas</button>
        <div style={{...card(),padding:20,marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:8}}>
            <div style={{fontSize:18,fontWeight:800,color:C.heading}}>{selected.name}</div>
            {selected.uf&&selected.uf!=="–"&&<span style={{...pill(C.border,C.dim),fontSize:10,flexShrink:0}}>{selected.uf}</span>}
          </div>
          {selected.sectors.length>0&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
              {selected.sectors.map(s=><span key={s.id} style={{...pill(C.blueDim2,C.skyBlue,C.blueBorderA),fontSize:9}}>{s.name}</span>)}
            </div>
          )}
          <div style={{fontSize:11,color:C.faint}}>
            {selected.total_sources} fonte{selected.total_sources!==1?'s':''} mapeada{selected.total_sources!==1?'s':''}
            {conf&&<span style={{...pill(conf.bg,conf.color),fontSize:9,marginLeft:8}}>{conf.label}</span>}
          </div>
          {selected.url&&conf&&conf.label==="Site verificado"&&(
            <a href={selected.url} target="_blank" rel="noopener noreferrer"
              style={{display:"block",marginTop:8,fontSize:10,color:C.blue,textDecoration:"none"}}>
              {selected.url.replace(/^https?:\/\//,"")} ↗
            </a>
          )}
        </div>

        {/* SP-58: Rede de Empresas — mesma lógica de "não misturar laços fortes/fracos com o
            mesmo peso" documentada em RedeDeEmpresas.jsx. Só aparece se houver pelo menos 1 tipo
            de dado real (concorrência de talento OU comunidade de rede). */}
        {((selected.concorrentes_talento&&selected.concorrentes_talento.length>0)||selected.rede_comunidade)&&(
          <div style={{...card(),padding:16,marginBottom:16}}>
            <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>
              Rede de Empresas
            </div>
            {selected.rede_centralidade&&(
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <span style={{...pill(selected.rede_centralidade.classificacao.includes("GATEKEEPER")?C.greenDim:C.border,selected.rede_centralidade.classificacao.includes("GATEKEEPER")?C.emerald:C.dim),fontSize:10}}>
                  {selected.rede_centralidade.classificacao}
                </span>
                <span style={{fontSize:9,color:C.muted}}>{selected.rede_centralidade.n_empresas_conectadas} empresas conectadas na rede</span>
              </div>
            )}

            <RedeDeEmpresas company={selected} allCompanies={companies} navigateTo={navigateTo}/>

            <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:10,fontSize:9,color:C.muted,flexWrap:"wrap"}}>
              <span>▬ <span style={{color:C.indigoBright}}>brilhante</span> = compete por talento (dado específico)</span>
              <span>▬ <span style={{color:C.purpleDim3}}>apagado</span> = mesma comunidade de rede (aproximação)</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 16px"}}>
      <div style={{marginBottom:18}}>
        <div style={{fontSize:20,fontWeight:800,color:C.heading}}>🏢 Empresas</div>
        <div style={{fontSize:12,color:C.dim,marginTop:4}}>
          {companies.length} empresas mapeadas no FATO · {filtered.length} exibidas
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar empresa..." style={{...SEL,width:220}}/>
        <select value={sectorFilter} onChange={e=>setSectorFilter(e.target.value)} style={SEL}>
          {sectorOptions.map(([id,name])=><option key={id} value={id}>{name}</option>)}
        </select>
        <select value={ufFilter} onChange={e=>setUf(e.target.value)} style={SEL}>
          {ufs.map(u=><option key={u} value={u}>{u==="Todos"?"Todas as UFs":u}</option>)}
        </select>
        <label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.greenLight,cursor:"pointer"}}>
          <input type="checkbox" checked={onlyWithUrl} onChange={e=>setOnlyWithUrl(e.target.checked)} style={{accentColor:C.greenLight}}/>
          Apenas com site verificado
        </label>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:10}}>
        {filtered.map(c=>{
          const conf=urlConfMeta(c.url_confianca);
          return(
            <div key={c.id} onClick={()=>setSelected(c)} style={{...card(),padding:14,cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:8}}>
                <div style={{fontSize:13,fontWeight:700,color:C.heading,lineHeight:1.3}}>{c.name}</div>
                {c.uf&&c.uf!=="–"&&<span style={{...pill(C.border,C.dim),fontSize:9,flexShrink:0}}>{c.uf}</span>}
              </div>
              {c.sectors.length>0&&(
                <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
                  {c.sectors.map(s=>(
                    <span key={s.id} style={{...pill(C.blueDim2,C.skyBlue,C.blueBorderA),fontSize:9}}>{s.name}</span>
                  ))}
                </div>
              )}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:10,color:C.faint}}>
                  {c.total_sources} fonte{c.total_sources!==1?'s':''} mapeada{c.total_sources!==1?'s':''}
                </span>
                {conf&&<span style={{...pill(conf.bg,conf.color),fontSize:9}}>{conf.label}</span>}
              </div>
              {c.url&&conf&&conf.label==="Site verificado"&&(
                <a href={c.url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()}
                  style={{display:"block",marginTop:8,fontSize:10,color:C.blue,textDecoration:"none"}}>
                  {c.url.replace(/^https?:\/\//,"")} ↗
                </a>
              )}
              {/* SP-12/Grupo C: dm_competicao_talentos — só 9 linhas hoje, badge discreto */}
              {c.concorrentes_talento.length>0&&(
                <div style={{marginTop:8,fontSize:9,color:C.purpleLight}}>
                  ⚔ Compete por talento com {c.concorrentes_talento.map(x=>x.outra_nome).join(", ")}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filtered.length===0&&(
        <div style={{textAlign:"center",padding:"40px 0",color:C.faint,fontSize:12}}>
          Nenhuma empresa encontrada com esses filtros.
        </div>
      )}
    </div>
  );
}
