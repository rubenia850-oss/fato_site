// components/TrailCard.jsx — card de uma trilha do catálogo CNCT, com etapas expansíveis.
// Extraído de App.jsx na Etapa 3 da quebra do monólito (D98/D101, 05/07/2026).
// SP-45 (15/07): cada etapa pode mostrar "onde estudar" (trail_escola_links+escola_sources).
import { useState } from "react";
import { C, pill, card, btn } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";
import { SourceCard } from "./SourceCard.jsx";
import { NormaBadge } from "./badges.jsx";
import { isStepDone, toggleStep, trailProgress } from "../utils/progress.js";

// SP-49 (15/07, achado no SP-45 item 2 do ESTUDO_VIABILIDADE): escola_sources.tipo — cobertura
// 120/253 (47%), melhor que material_types (item 10 do Tier 2, 6,5%). Valores reais no dado:
// senai (67), governo (41), privada (8), federal (4).
const INSTITUICAO_TIPO_META = {
  senai: { label: "SENAI", color: C.orangeLight, bg: C.orangeDim },
  governo: { label: "Governo", color: C.blue, bg: C.blueDim },
  federal: { label: "Rede Federal", color: C.emerald, bg: C.greenDim },
  privada: { label: "Privada", color: C.muted, bg: C.border },
};

export function TrailCard({trail,favorites,toggleFav}){
  const {sourceMap} = useData();
  const [open,setOpen]=useState(false);
  const [stepSel,setStepSel]=useState(null);
  const [progress,setProgress]=useState(()=>trailProgress(trail.id,trail.steps.length));
  const handleToggleStep=(i)=>{
    toggleStep(trail.id,i);
    setProgress(trailProgress(trail.id,trail.steps.length));
  };
  const total=trail.steps.reduce((a,s)=>a+s.ids.length,0);
  const hasPT=trail.steps.some(s=>s.ids.some(id=>sourceMap[id]?.lang?.includes("PT")));
  const hasFree=trail.steps.some(s=>s.ids.some(id=>!sourceMap[id]?.cadastro));
  return (
    <div style={{...card(trail.color+"44"),transition:"border-color .2s"}}>
      <div style={{height:3,background:`linear-gradient(90deg,${trail.color},${trail.color}44,transparent)`}}/>
      <div style={{padding:"16px 18px"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10,marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:28}}>{trail.icon || "🛠️"}</span>
            <div>
              <div style={{fontSize:15,fontWeight:800,color:C.heading,lineHeight:1.2}}>{trail.name}</div>
              <span style={{...pill(trail.color+"22",trail.color,trail.color+"44")}}>{trail.cnct}</span>
            </div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:18,fontWeight:800,color:trail.color}}>{trail.steps.length}</div>
            <div style={{fontSize:9,color:C.muted}}>etapas</div>
          </div>
        </div>
        <p style={{margin:"0 0 10px",fontSize:12,color:C.dim,lineHeight:1.6}}>{trail.description}</p>
        {/* SP-61 (achado ao sincronizar com fato_v175_MERGED.db): `descricao_geral` é onde o BANCO
            registra ressalvas de curadoria (piloto, cobertura parcial, etc.) — hoje só 1 trilha
            (trl-107) tem esse campo preenchido, mas o badge não é hardcoded pra ela: aparece pra
            qualquer trilha que tiver essa nota, presente ou futura. */}
        {trail.nota_curadoria&&(
          <div style={{...pill(C.orangeDim2,C.amberLight,C.amberBorderA),fontSize:9,marginBottom:10,display:"inline-block"}}>
            ⚠️ {trail.nota_curadoria}
          </div>
        )}
        {/* SP-35: trilha-irmã em outra modalidade (ex: presencial/EAD) — mesmo conteúdo, registro separado */}
        {trail.variantes&&trail.variantes.length>0&&(
          <div style={{marginBottom:8,fontSize:10,color:C.dim}}>
            ⇄ Mesmo conteúdo também disponível como: {trail.variantes.map(v=>v.name).join(", ")}
          </div>
        )}
        {/* SP-53 (item 12): trail_dependencies — módulo/sub-trilha derivado de uma trilha-base */}
        {trail.derivada_de&&(
          <div style={{marginBottom:8,fontSize:10,color:C.dim}}>
            ↳ {trail.derivada_de.tipo} derivado de <strong>{trail.derivada_de.name}</strong>
            {trail.derivada_de.temas_chave&&<span style={{color:C.faint}}> — {trail.derivada_de.temas_chave}</span>}
          </div>
        )}
        {trail.derivadas&&trail.derivadas.length>0&&(
          <div style={{marginBottom:8,fontSize:10,color:C.dim}}>
            ↳ Trilhas derivadas desta: {trail.derivadas.map(d=>d.name).join(", ")}
          </div>
        )}
        {/* SP-26: trail_cbos/trail_normas — nem toda trilha tem uma das duas, ou nenhuma */}
        {trail.cbos&&trail.cbos.length>0&&(
          <div style={{marginBottom:8}}>
            <span style={{fontSize:9,color:C.faint,marginRight:6}}>CBO</span>
            {trail.cbos.map(c=><span key={c} style={{...pill(C.blueDim,C.blue,C.blueBorderA),fontFamily:"'IBM Plex Mono',monospace",fontSize:9,marginRight:4}}>{c}</span>)}
          </div>
        )}
        {trail.normas&&trail.normas.length>0&&(
          <div style={{marginBottom:10}}>
            <span style={{fontSize:9,color:C.faint,marginRight:6}}>NORMAS</span>
            {trail.normas.map(n=><NormaBadge key={n} code={n} baseStyle={{...pill(C.orangeDim2,C.amberLight,C.amberBorderA),fontSize:9,marginRight:4}}/>)}
          </div>
        )}
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
          <span style={{...pill(C.surface,C.muted)}}>{total} fontes</span>
          {hasFree&&<span style={{...pill(C.greenDim4,C.lime,C.limeBorderA)}}>✓ Sem cadastro</span>}
          {hasPT&&<span style={{...pill(C.greenDim2,C.greenBright,C.greenBorderA2)}}>✓ Em PT</span>}
        </div>
        {/* Progresso local (Fase 1, sem login) — persistido em localStorage, ver utils/progress.js */}
        {progress.total>0&&(
          <div style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.muted,marginBottom:3}}>
              <span>{progress.pct===100?"✓ Concluída":progress.done>0?"Em andamento":"Não iniciada"}</span>
              <span>{progress.done}/{progress.total} etapas</span>
            </div>
            <div style={{height:5,borderRadius:3,background:C.border,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${progress.pct}%`,background:progress.pct===100?C.greenBright:trail.color,transition:"width .2s"}}/>
            </div>
          </div>
        )}
        <button onClick={()=>setOpen(o=>!o)}
          style={{...btn(open?trail.color+"33":C.surface,trail.color,trail.color+"44"),width:"100%"}}>
          {open?"▲ Fechar trilha":"▼ Ver etapas da trilha"}
        </button>
      </div>
      {open&&(
        <div style={{borderTop:`1px solid ${trail.color}33`,padding:"14px 18px",background:C.surface3}}>
          {trail.steps.map((step,i)=>{
            const isSel=stepSel===i;
            return (
              <div key={i} style={{marginBottom:i<trail.steps.length-1?12:0}}>
                <div onClick={()=>setStepSel(isSel?null:i)}
                  style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"8px 10px",borderRadius:7,background:isSel?trail.color+"15":"transparent",border:`1px solid ${isSel?trail.color+"44":"transparent"}`,transition:"all .15s"}}>
                  <input type="checkbox" checked={isStepDone(trail.id,i)} title="Marcar etapa como concluída"
                    onClick={e=>e.stopPropagation()} onChange={()=>handleToggleStep(i)}
                    style={{width:15,height:15,accentColor:C.greenBright,cursor:"pointer",flexShrink:0}}/>
                  <div style={{width:22,height:22,borderRadius:"50%",background:trail.color+"22",border:`1px solid ${trail.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:trail.color,flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:700,color:C.text}}>{step.phase}</div>
                    <div style={{fontSize:10,color:C.muted}}>{step.note}</div>
                  </div>
                  <span style={{color:C.muted,fontSize:11}}>{isSel?"▲":"▼"}</span>
                </div>
                {isSel&&(
                  <div style={{paddingLeft:32,paddingTop:8,display:"flex",flexDirection:"column",gap:8}}>
                    {step.ids.map(id=>{
                      const src=sourceMap[id];
                      if(!src) return <div key={id} style={{fontSize:10,color:C.red}}>⚠️ ID não encontrado: {id}</div>;
                      return <SourceCard key={id} s={src} favorites={favorites} toggleFav={toggleFav} expanded={false} onExpand={()=>{}} mini/>;
                    })}
                    {/* SP-45 (item 2 do estudo de viabilidade): trail_escola_links — onde estudar este passo */}
                    {step.escolas&&step.escolas.length>0&&(
                      <div style={{display:"flex",flexDirection:"column",gap:5,marginTop:step.ids.length>0?2:0,padding:"8px 10px",background:C.greenDim3,borderRadius:7,border:`1px solid ${C.greenBorderA}`}}>
                        <div style={{fontSize:9,color:C.greenLight,fontWeight:700,letterSpacing:.5}}>🎓 ONDE ESTUDAR ESTE PASSO</div>
                        {step.escolas.map((e,ei)=>{
                          const tipoMeta = e.escola_tipo && INSTITUICAO_TIPO_META[e.escola_tipo];
                          return (
                            <div key={ei} style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                              <a href={e.url} target="_blank" rel="noopener noreferrer"
                                style={{fontSize:11,color:C.greenLight,textDecoration:"none",lineHeight:1.5}}>
                                {e.curso_nome}{e.escola_nome?<span style={{color:C.muted}}> — {e.escola_nome}</span>:null}
                              </a>
                              {tipoMeta&&<span style={{...pill(tipoMeta.bg,tipoMeta.color),fontSize:8}}>{tipoMeta.label}</span>}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                {i<trail.steps.length-1&&(
                  <div style={{paddingLeft:21,paddingTop:4,paddingBottom:2}}>
                    <div style={{width:1,height:10,background:trail.color+"44"}}/>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
