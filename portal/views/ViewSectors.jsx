// views/ViewSectors.jsx — 12 setores industriais, com empresas, programas, panorama do
// setor (densidade/monopólio) e contexto FATO (perfis/blocos/Atlas relevantes).
// Extraído de App.jsx na Etapa 7 da quebra do monólito (D98/D105, 05/07/2026).
// Extração feita por script a partir do texto original (lição do D104: nunca reconstruir de
// memória) — só a assinatura da função (function -> export function) foi tocada.
import { useState, useMemo, useEffect } from "react";
import { C, pill, card, btn, SEL } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";
import { UrlStatusBadge } from "../components/badges.jsx";

export function ViewSectors(){
  const {sectors,sectorsLoading,ensureSectorsLoaded,sectorFato,navigateTo,profiles}=useData();
  useEffect(()=>{ ensureSectorsLoaded(); },[ensureSectorsLoaded]);
  // SP-38 (achado 04/07, corrigido 16/07): 129/497 (26%) fontes de `sources` (layer=sector) têm
  // industry_sector_id NULO — antes disso caía num grupo com id=null, que colidia com o valor
  // "nada selecionado" do próprio estado (também null): o card desse grupo renderizava "SETOR null"
  // E não abria ao clicar (setSector(null) é indistinguível de nunca ter selecionado nada).
  // Sentinela dedicado resolve os dois problemas de uma vez.
  const NO_SECTOR_ID="sem_setor";
  const [selectedSector,setSector]=useState(undefined);
  const [selectedCompany,setCompany]=useState(null);
  const [q,setQ]=useState("");
  const [onlyFree,setFree]=useState(false);

  const SECTOR_ICONS={1:"⛏",2:"🏭",3:"🛢",4:"📦",5:"🧪",6:"⚙️",7:"🚗",8:"🥤",9:"🏗",10:"👕",11:"🔧",12:"🖨",[NO_SECTOR_ID]:"❓"};

  const sectorList=useMemo(()=>{
    const map={};
    sectors.forEach(e=>{
      const id = e.sector_id==null ? NO_SECTOR_ID : e.sector_id;
      const name = e.sector_id==null ? "Sem setor classificado" : e.sector_name;
      if(!map[id]) map[id]={id,name,entries:[]};
      map[id].entries.push(e);
    });
    // grupos numéricos em ordem, "sem_setor" sempre por último (não é um setor #13, é a ausência de 1)
    return Object.values(map).sort((a,b)=>{
      if(a.id===NO_SECTOR_ID) return 1;
      if(b.id===NO_SECTOR_ID) return -1;
      return a.id-b.id;
    });
  },[sectors]);

  if(sectorsLoading || (!sectors.length)) return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"60px 20px",textAlign:"center",color:C.faint,fontSize:12}}>
      Carregando dados de setores (camada `sector`, 455 fontes — M-11)...
    </div>
  );

  // Company detail
  if(selectedCompany){
    const progs=sectors.filter(e=>(e.sector_id==null?NO_SECTOR_ID:e.sector_id)===selectedSector&&e.company===selectedCompany);
    return(
      <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px"}}>
        <button onClick={()=>setCompany(null)} style={{...btn(C.border,C.dim),marginBottom:16}}>← Voltar ao setor</button>
        <div style={{...card(),padding:20,marginBottom:16}}>
          <div style={{fontSize:11,color:C.muted,marginBottom:4}}>{progs[0]?.sector_name||"Sem setor classificado"}</div>
          <div style={{fontSize:18,fontWeight:800,color:C.heading}}>{selectedCompany}</div>
        </div>
        <div style={{display:"grid",gap:8}}>
          {progs.filter(p=>p.program).map((p,i)=>(
            <div key={i} style={{...card(),padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700,color:C.heading,marginBottom:4}}>{p.program}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:6}}>
                    {p.format&&<span style={{...pill(C.border,C.muted),fontSize:9}}>{p.format.slice(0,30)}</span>}
                    {p.free===true&&<span style={{...pill(C.greenDim,C.emerald),fontSize:9}}>Gratuito</span>}
                    {p.free===false&&p.cost_range&&<span style={{...pill(C.orangeDim,C.orange),fontSize:9}}>💰 {p.cost_range}</span>}
                  </div>
                  {p.audience&&<div style={{fontSize:11,color:C.muted,marginBottom:4}}>Público: {p.audience.slice(0,80)}</div>}
                  {p.detail&&<p style={{fontSize:10,color:C.faint,margin:"4px 0 0",lineHeight:1.6}}>{p.detail.slice(0,180)}</p>}
                </div>
                {p.url&&<div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end",flexShrink:0}}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer"
                    style={{...btn(C.surface,C.blue),fontSize:10,textDecoration:"none"}}>Acessar →</a>
                  <UrlStatusBadge status={p.url_status} checadoEm={p.url_checado_em}/>
                </div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sector detail — company list
  if(selectedSector!==undefined){
    const sec=sectorList.find(s=>s.id===selectedSector);
    const fato=sectorFato[selectedSector]||{profiles:[],blocos:[],atlas:[]};
    const companyMap={};
    sec.entries.forEach(e=>{ if(e.company) companyMap[e.company]=(companyMap[e.company]||[]).concat(e.program?[e]:[]); });
    const companies=Object.entries(companyMap)
      .filter(([,progs])=>!onlyFree||progs.some(p=>p.free===true))
      .filter(([name])=>!q||name.toLowerCase().includes(q.toLowerCase()));
    return(
      <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 16px"}}>
        <button onClick={()=>{setSector(undefined);setQ("");}} style={{...btn(C.border,C.dim),marginBottom:16}}>← Todos os setores</button>
        <div style={{marginBottom:16}}>
          {sec.id!==NO_SECTOR_ID&&<div style={{fontSize:11,color:C.muted,marginBottom:4}}>SETOR {String(sec.id).padStart(2,'0')}</div>}
          <div style={{fontSize:20,fontWeight:800,color:C.heading}}>{SECTOR_ICONS[sec.id]} {sec.name}</div>
          {sec.id===NO_SECTOR_ID&&<div style={{fontSize:10,color:C.faint,marginTop:2}}>Fontes cadastradas sem vínculo a um dos 12 setores industriais (dado incompleto, não é um 13º setor)</div>}
          <div style={{fontSize:12,color:C.dim,marginTop:4}}>{companies.length} empresas · {sec.entries.filter(e=>e.program).length} programas mapeados</div>
        </div>

        {/* SP-12/Grupo C: dm_densidade_setorial + dm_monopolio_oferta */}
        {(fato.densidade||( fato.monopolio&&fato.monopolio.length>0))&&(
          <div style={{...card(),padding:16,marginBottom:16}}>
            <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>
              Panorama do Setor
            </div>
            {fato.densidade&&(
              <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:fato.monopolio&&fato.monopolio.length>0?12:0}}>
                <div>
                  <div style={{fontSize:9,color:C.faint}}>DENSIDADE DE OFERTA</div>
                  <div style={{fontSize:13,fontWeight:700,color:C.heading}}>{fato.densidade.classificacao}</div>
                </div>
                <div>
                  <div style={{fontSize:9,color:C.faint}}>EMPRESAS MAPEADAS</div>
                  <div style={{fontSize:13,fontWeight:700,color:C.heading}}>{fato.densidade.n_empresas}</div>
                </div>
                <div>
                  <div style={{fontSize:9,color:C.faint}}>PROGRAMAS</div>
                  <div style={{fontSize:13,fontWeight:700,color:C.heading}}>{fato.densidade.n_programas}</div>
                </div>
              </div>
            )}
            {fato.monopolio&&fato.monopolio.length>0&&(
              <div>
                <div style={{fontSize:9,color:C.faint,marginBottom:6}}>CONCENTRAÇÃO DE OFERTA (mapeamento atual, não market share real)</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                  {fato.monopolio.filter(m=>m.dominante&&m.dominante.includes("DOMINANTE")).slice(0,8).map((m,i)=>(
                    <span key={i} style={{...pill(C.orangeDim,C.orangeLight),fontSize:9}}>{m.empresa} ({m.pct.toFixed(0)}%)</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* EXP-03: painel Contexto FATO — perfis, blocos e Atlas relevantes para este setor (v33/sector_fato_*) */}
        {(fato.profiles.length>0||fato.blocos.length>0||fato.atlas.length>0)&&(
          <div style={{...card(C.blueBorderA2),padding:16,marginBottom:20,borderColor:C.blueDark}}>
            <div style={{fontSize:10,color:C.blue,fontWeight:700,marginBottom:12,textTransform:"uppercase",letterSpacing:1}}>
              📚 Contexto FATO — Base de Conhecimento deste Setor
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
              {fato.profiles.length>0&&(
                <div>
                  <div style={{fontSize:9,color:C.faint,marginBottom:6,fontWeight:700}}>PERFIS CNCT RELEVANTES</div>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    {fato.profiles.map((p,i)=>{
                      const match=profiles&&profiles.find(x=>x.name&&p.perfil_cnct&&x.name.toLowerCase().includes(p.perfil_cnct.toLowerCase().replace(/#\d+\s*/,"")));
                      return(
                        <div key={i} style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6,padding:"6px 8px",background:C.surface3,borderRadius:6,border:"1px solid #1e293b"}}>
                          <div style={{flex:1}}>
                            <div style={{fontSize:10,color:C.text,fontWeight:600,lineHeight:1.3}}>{p.perfil_cnct}</div>
                            {p.cbo&&<div style={{fontSize:9,color:C.faint,fontFamily:"'IBM Plex Mono',monospace",marginTop:2}}>CBO {p.cbo}</div>}
                            {p.trilhas_atlas&&<div style={{fontSize:9,color:C.blue,marginTop:2}}>Trilhas: {p.trilhas_atlas}</div>}
                          </div>
                          {match&&navigateTo&&(
                            <button onClick={()=>navigateTo("profiles",{profileId:match.id})}
                              style={{...btn(C.surface,C.blue),fontSize:9,padding:"3px 8px",flexShrink:0}}>
                              Ver ↗
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {fato.blocos.length>0&&(
                <div>
                  <div style={{fontSize:9,color:C.faint,marginBottom:6,fontWeight:700}}>BLOCOS DO GUIA FATO</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {fato.blocos.map((b,i)=>(
                      <span key={i} style={{...pill(C.blueDim2,C.skyBlue,C.blueBorderA),fontSize:9}}>
                        {b.bloco_codigo&&<span style={{fontFamily:"'IBM Plex Mono',monospace",marginRight:3}}>{b.bloco_codigo}</span>}
                        {b.bloco_nome||b.descricao}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {fato.atlas.length>0&&(
                <div>
                  <div style={{fontSize:9,color:C.faint,marginBottom:6,fontWeight:700}}>ATLAS FATO COBRINDO ESTE SETOR</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {fato.atlas.map((a,i)=>(
                      <span key={i} style={{...pill(C.purpleDim3,C.purpleSoft,C.purpleBorderA),fontSize:9}}>
                        {a.atlas_nome||a.atlas}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* EXP-03B: mapa de cobertura empresas x status (sector_coverage_matrix) */}
            {fato.coverage&&fato.coverage.length>0&&(()=>{
              const STATUS_META = {
                "✅ Sim":          {color:C.emerald,bg:C.greenDim},
                "✅ Sim (parcial)":{color:C.emerald,bg:C.greenDim},
                "✅ Sim (OSC parceira)":{color:C.emerald,bg:C.greenDim},
                "⚠️ Limitado":    {color:C.orangeLight,bg:C.orangeDim},
                "⚠️ Interno":     {color:C.orangeLight,bg:C.orangeDim},
                "⚠️ B2B técnico": {color:C.orangeLight,bg:C.orangeDim},
                "⚠️ B2B parceiros":{color:C.orangeLight,bg:C.orangeDim},
                "⚠️ B2B (rede)":  {color:C.orangeLight,bg:C.orangeDim},
                "⚠️ Pontual":     {color:C.orangeLight,bg:C.orangeDim},
                "⚠️ Só trainee":  {color:C.amberLight,bg:C.orangeDim4},
                "⚠️ Interno + PcD local":{color:C.orangeLight,bg:C.orangeDim},
              };
              const mapeadas = fato.coverage.filter(c=>c.status.startsWith("✅")).length;
              const total = fato.coverage.length;
              return(
                <div style={{marginTop:14,borderTop:"1px solid #1e3a8a44",paddingTop:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{fontSize:9,color:C.faint,fontWeight:700}}>COBERTURA DE PROGRAMAS — PRINCIPAIS EMPRESAS</div>
                    <span style={{fontSize:9,color:C.blue}}>{mapeadas}/{total} mapeadas</span>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {fato.coverage.map((c,i)=>{
                      const meta=STATUS_META[c.status]||{color:C.muted,bg:C.border};
                      return(
                        <span key={i} title={c.status}
                          style={{...pill(meta.bg,meta.color),fontSize:9,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis"}}>
                          {c.empresa_avaliada}
                        </span>
                      );
                    })}
                  </div>
                  <div style={{display:"flex",gap:10,marginTop:6,fontSize:9,color:C.faint}}>
                    <span>✅ Programa público mapeado</span>
                    <span>⚠️ Acesso restrito / parcial</span>
                    <span style={{color:C.red}}>❌ Sem programa identificado</span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center"}}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar empresa..." style={{...SEL,width:220}}/>
          <label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.greenLight,cursor:"pointer"}}>
            <input type="checkbox" checked={onlyFree} onChange={e=>setFree(e.target.checked)} style={{accentColor:C.greenLight}}/>Apenas gratuitos
          </label>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:8}}>
          {companies.map(([name,progs])=>(
            <div key={name} onClick={()=>setCompany(name)}
              style={{...card(),padding:14,cursor:"pointer",transition:"border-color .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderLight}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <div style={{fontSize:13,fontWeight:700,color:C.heading,marginBottom:6}}>{name}</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                <span style={{fontSize:10,color:C.faint}}>{progs.length} programa{progs.length!==1?'s':''}</span>
                {progs.some(p=>p.free===true)&&<span style={{...pill(C.greenDim,C.emerald),fontSize:9}}>Gratuito</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sector grid
  return(
    <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 16px"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,color:C.muted,marginBottom:4}}>SISTEMA FATO · SETORES INDUSTRIAIS</div>
        <div style={{fontSize:20,fontWeight:800,color:C.heading}}>12 Setores Industriais</div>
        <div style={{fontSize:12,color:C.dim,marginTop:4}}>Empresas e programas de qualificação por setor produtivo brasileiro</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:10}}>
        {sectorList.map(s=>{
          const companies=new Set(s.entries.map(e=>e.company)).size;
          const progs=s.entries.filter(e=>e.program).length;
          const freeCount=s.entries.filter(e=>e.free===true).length;
          const fatoData=sectorFato[s.id]||{};
          const profileCount=(fatoData.profiles||[]).length;
          return(
            <div key={s.id} onClick={()=>{setSector(s.id);setQ("");setFree(false);}}
              style={{...card(),padding:16,cursor:"pointer",transition:"border-color .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderLight}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <div style={{fontSize:24,marginBottom:8}}>{SECTOR_ICONS[s.id]}</div>
              <div style={{fontSize:11,color:C.muted,marginBottom:4}}>{s.id===NO_SECTOR_ID?"SEM SETOR":`SETOR ${String(s.id).padStart(2,'0')}`}</div>
              <div style={{fontSize:13,fontWeight:700,color:C.heading,marginBottom:8,lineHeight:1.4}}>{s.name}</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                <span style={{fontSize:10,color:C.faint}}>{companies} empresas</span>
                <span style={{fontSize:10,color:C.faint}}>· {progs} programas</span>
                {freeCount>0&&<span style={{...pill(C.greenDim,C.emerald),fontSize:9}}>{freeCount} grátis</span>}
                {profileCount>0&&<span style={{...pill(C.blueDark,C.blue),fontSize:9}}>{profileCount} perfis FATO</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
