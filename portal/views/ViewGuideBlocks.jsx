// views/ViewGuideBlocks.jsx — 29 blocos do Guia Industrial v6.3, com fontes técnicas e fichas
// do Guia vinculadas.
// Extraído de App.jsx na Etapa 6 da quebra do monólito (D98/D104, 05/07/2026).
import { useState, useMemo, useEffect } from "react";
import { C, pill, card, btn, SEL } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";

export function ViewGuideBlocks(){
  const {guideBlocks,technical,guia,guiaLoading,ensureGuiaLoaded}=useData();
  useEffect(()=>{ ensureGuiaLoaded(); },[ensureGuiaLoaded]); // EXP-01: fichas do Guia (415, camada `guia`)
  const [selected,setSelected]=useState(null);
  const [q,setQ]=useState("");

  const filtered=useMemo(()=>guideBlocks.filter(b=>
    !q||(b.name+b.code+b.bloco_title).toLowerCase().includes(q.toLowerCase())
  ),[guideBlocks,q]);

  const guiaCountByCode=useMemo(()=>{
    const m={};
    guia.forEach(g=>{ if(g.sector_code) m[g.sector_code]=(m[g.sector_code]||0)+1; });
    return m;
  },[guia]);

  if(selected){
    const sources=technical.filter(t=>t.bloco===selected.bloco);
    const fichas=guia.filter(g=>g.sector_code===selected.code);
    return(
      <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px"}}>
        <button onClick={()=>setSelected(null)} style={{...btn(C.border,C.dim),marginBottom:16}}>← Todos os blocos</button>
        <div style={{...card(C.blueDim2),padding:20,marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span style={{...pill(C.blueDim2,C.skyBlue),fontFamily:"'IBM Plex Mono',monospace",fontSize:12,fontWeight:700}}>{selected.code}</span>
            <span style={{fontSize:11,color:C.muted}}>BLOCO {selected.bloco}</span>
          </div>
          <div style={{fontSize:17,fontWeight:700,color:C.heading,marginBottom:6}}>{selected.name}</div>
          <p style={{fontSize:12,color:C.dim,margin:0,lineHeight:1.7}}>{selected.description}</p>
        </div>
        <div style={{fontSize:11,color:C.muted,marginBottom:10,fontWeight:700}}>
          FONTES INDUSTRIAIS NESTE BLOCO ({sources.length})
        </div>
        {sources.length===0
          ?<div style={{...card(),padding:20,textAlign:"center",color:C.faint,fontSize:12,marginBottom:20}}>Nenhuma fonte mapeada para este bloco ainda.</div>
          :<div style={{display:"grid",gap:8,marginBottom:20}}>
            {sources.map(s=>(
              <div key={s.id} style={{...card(),padding:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:C.heading}}>{s.company}</div>
                    <div style={{fontSize:11,color:C.dim,marginTop:2}}>{s.program}</div>
                    <div style={{fontSize:10,color:C.faint,marginTop:4}}>
                      {s.format} · {s.lang} {s.cadastro?"· Cadastro":"· Sem cadastro"}
                    </div>
                    {s.highlight&&<div style={{fontSize:10,color:C.muted,marginTop:4,lineHeight:1.5}}>{s.highlight}</div>}
                  </div>
                  <a href={s.url} target="_blank" rel="noopener noreferrer"
                    style={{...btn(C.surface,C.skyBlue),fontSize:10,textDecoration:"none",flexShrink:0}}>Acessar →</a>
                </div>
              </div>
            ))}
          </div>
        }
        {/* EXP-01: fichas da camada `guia` (438 ao todo) vinculadas por sector_code */}
        <div style={{fontSize:11,color:C.muted,marginBottom:10,fontWeight:700}}>
          FICHAS DO GUIA NESTE BLOCO ({guiaLoading?"...":fichas.length})
        </div>
        {guiaLoading
          ?<div style={{...card(),padding:20,textAlign:"center",color:C.faint,fontSize:12}}>Carregando fichas do Guia…</div>
          :fichas.length===0
          ?<div style={{...card(),padding:20,textAlign:"center",color:C.faint,fontSize:12}}>Nenhuma ficha do Guia vinculada a este bloco.</div>
          :<div style={{display:"grid",gap:8}}>
            {fichas.map(g=>(
              <div key={g.id} style={{...card(),padding:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:C.heading}}>{g.company||g.program||g.id}</div>
                    {g.program&&g.company&&<div style={{fontSize:11,color:C.dim,marginTop:2}}>{g.program}</div>}
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>
                      {g.free&&<span style={{...pill(C.greenDim,C.emerald),fontSize:9}}>Gratuito</span>}
                      {g.cadastro&&<span style={{...pill(C.border,C.dim),fontSize:9}}>Cadastro</span>}
                      {g.lang&&<span style={{...pill(C.border,C.muted),fontSize:9}}>{g.lang}</span>}
                    </div>
                    {g.highlight&&<div style={{fontSize:10,color:C.muted,marginTop:4,lineHeight:1.5}}>{g.highlight}</div>}
                  </div>
                  {g.url&&<a href={g.url} target="_blank" rel="noopener noreferrer"
                    style={{...btn(C.surface,C.skyBlue),fontSize:10,textDecoration:"none",flexShrink:0}}>Acessar →</a>}
                </div>
              </div>
            ))}
          </div>
        }
      </div>
    );
  }

  return(
    <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 16px"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,color:C.muted,marginBottom:4}}>SISTEMA FATO · GUIA INDUSTRIAL v6.3</div>
        <div style={{fontSize:20,fontWeight:800,color:C.heading}}>29 Blocos do Guia Industrial</div>
        <div style={{fontSize:12,color:C.dim,marginTop:4}}>Setores industriais mapeados com fontes de aprendizagem técnica e {guiaLoading?"...":guia.length} fichas do Guia</div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center"}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar bloco ou código..." style={{...SEL,width:260}}/>
        <span style={{marginLeft:"auto",fontSize:11,color:C.faint}}>{filtered.length} blocos</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
        {filtered.map(b=>(
          <div key={b.code} onClick={()=>setSelected(b)}
            style={{...card(),padding:14,cursor:"pointer",transition:"border-color .15s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderLight}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{...pill(C.blueDim2,C.skyBlue),fontFamily:"'IBM Plex Mono',monospace",fontSize:11,fontWeight:700}}>{b.code}</span>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                {!guiaLoading&&guiaCountByCode[b.code]>0&&<span style={{fontSize:9,color:C.greenLight}}>{guiaCountByCode[b.code]} fichas</span>}
                {b.bloco&&<span style={{fontSize:9,color:C.faint}}>BLOCO {b.bloco}</span>}
              </div>
            </div>
            <div style={{fontSize:12,fontWeight:700,color:C.heading,marginBottom:6,lineHeight:1.4}}>{b.name}</div>
            {b.description&&<p style={{margin:0,fontSize:10,color:C.muted,lineHeight:1.6}}>
              {b.description.slice(0,110)}{b.description.length>110?"…":""}
            </p>}
          </div>
        ))}
      </div>
    </div>
  );
}
