// views/ViewGaps.jsx — Cobertura Guia × Atlas (ex-"Lacunas", renomeada no SP-28/D85).
// Comparação entre os 2 catálogos: o que o Guia cobre e o Atlas ainda não cita, o que o
// Atlas cobre e o Guia ainda não lista, e onde os dois se sobrepõem.
// Extraído de App.jsx na Etapa 6 da quebra do monólito (D98/D104, 05/07/2026).
//
// NOTA (D104): a primeira tentativa desta extração reconstruiu o componente de memória em vez
// de copiar o texto original literal, e introduziu 3 bugs reais (opções de impacto dinâmicas
// em vez da lista fixa original; os 3 layouts por aba fundidos num só, causando duplicação de
// campo; prefixo de nível de impacto não removido do texto). Achado pelo pixel-diff (a página
// renderizava ~3x mais texto que o original) antes de qualquer entrega — reescrito aqui a
// partir do texto original extraído do último snapshot funcional, verbatim.
import { useState, useMemo } from "react";
import { C, pill, card, btn } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";
import { IMPACT_COLOR, ImpactBadge } from "../components/badges.jsx";

export function ViewGaps(){
  const {complementarity,atlasTrails,setView}=useData();
  const [tab,setTab]=useState("guia_sem_atlas");
  const [filterImpact,setImpact]=useState("Todos");
  const [selectedTrail,setTrail]=useState(null);

  const TAB_LABELS={"guia_sem_atlas":"Só no Guia","atlas_sem_guia":"Só no Atlas","sobreposicao":"Nos dois"};
  const IMPACT_LEVELS=["Todos","Muito alto","Alto","Médio","Baixo"];

  const filtered=useMemo(()=>complementarity.filter(e=>{
    if(e.type!==tab) return false;
    if(filterImpact!=="Todos"&&e.impacto!==filterImpact) return false;
    return true;
  }),[complementarity,tab,filterImpact]);

  if(selectedTrail){
    // SP-51/SP-66 (sincronização com fato_v193_MERGED.db, 18/07): BANCO resolveu atlas_num pra
    // 69/106 (65%) linhas — via cruzamento real por empresa/fonte (source_atlas_trails), sem
    // chute (ver `resolucao_metodo` na tabela). Quando `selectedTrail.atlas_num` existe, resolve
    // direto, sem ambiguidade. Os 37/106 restantes (sem atlas_num ainda) continuam caindo pra
    // lista de candidatas — mitigação do SP-48, não decisão nossa: não inventamos o que a fonte
    // de dado não resolveu.
    const { code, atlas_num } = selectedTrail;
    const candidates=atlasTrails.filter(x=>x.code===code);
    const t = atlas_num!=null
      ? atlasTrails.find(x=>x.code===code&&x.atlas_num===atlas_num)
      : (candidates.length===1?candidates[0]:null);
    return(
      <div style={{maxWidth:800,margin:"0 auto",padding:"24px 16px"}}>
        <button onClick={()=>setTrail(null)} style={{...btn(C.border,C.dim),marginBottom:16}}>← Voltar ao mapa</button>
        <div style={{...card(C.blueBorderA3),padding:20}}>
          <span style={{...pill(C.blueDark,C.blue),fontFamily:"'IBM Plex Mono',monospace",fontSize:12}}>{code}</span>
          <div style={{fontSize:16,fontWeight:700,color:C.heading,marginTop:8}}>{t?t.name:code}</div>
          {t&&<div style={{fontSize:11,color:C.muted,marginTop:4}}>Atlas {t.atlas_num} · {t.atlas_name}</div>}
          {t&&t.description&&<p style={{fontSize:12,color:C.dim,marginTop:8,lineHeight:1.7}}>{t.description}</p>}
          {!t&&candidates.length>1&&(
            <div style={{marginTop:10}}>
              <div style={{fontSize:11,color:C.orangeLight,marginBottom:6}}>
                Este código existe em {candidates.length} Atlas diferentes — o dado de origem (gaps) ainda
                não tem essa resolução pra este caso específico. Candidatas:
              </div>
              <div style={{display:"grid",gap:6}}>
                {candidates.map(c=>(
                  <div key={c.atlas_num} style={{padding:"8px 10px",background:C.surface3,borderRadius:6,border:"1px solid #1e293b"}}>
                    <div style={{fontSize:11,fontWeight:600,color:C.text}}>{c.name}</div>
                    <div style={{fontSize:10,color:C.muted}}>Atlas {c.atlas_num} · {c.atlas_name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!t&&candidates.length===0&&(
            <div style={{fontSize:11,color:C.faint,marginTop:10}}>Trilha não encontrada em atlasTrails.</div>
          )}
        </div>
      </div>
    );
  }

  return(
    <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 16px"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,color:C.muted,marginBottom:4}}>SISTEMA FATO · ANÁLISE DE COBERTURA</div>
        <div style={{fontSize:20,fontWeight:800,color:C.heading}}>Cobertura Guia × Atlas</div>
        <div style={{fontSize:12,color:C.dim,marginTop:4}}>Comparação entre os dois catálogos: o que o Guia cobre e o Atlas ainda não cita · o que o Atlas cobre e o Guia ainda não lista · onde os dois se sobrepõem</div>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16,alignItems:"center"}}>
        {Object.entries(TAB_LABELS).map(([k,label])=>(
          <button key={k} onClick={()=>setTab(k)}
            style={{...btn(tab===k?C.border:"transparent",tab===k?C.heading:C.muted),fontSize:11}}>
            {label}
          </button>
        ))}
        <div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:10,color:C.faint}}>Impacto:</span>
          {IMPACT_LEVELS.map(lvl=>(
            <button key={lvl} onClick={()=>setImpact(lvl)}
              style={{...btn(filterImpact===lvl?C.border:"transparent",
                filterImpact===lvl?(IMPACT_COLOR[lvl]||C.heading):C.muted),fontSize:10}}>
              {lvl}
            </button>
          ))}
        </div>
      </div>
      <div style={{fontSize:11,color:C.faint,marginBottom:12}}>{filtered.length} entradas</div>
      <div style={{display:"grid",gap:8}}>
        {filtered.map(e=>(
          <div key={e.id} style={{...card(),padding:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
              <div style={{flex:1}}>
                {tab==="guia_sem_atlas"&&(
                  <>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{fontSize:10,color:C.muted}}>{e.bloco_guia}</span>
                      <ImpactBadge level={e.impacto}/>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:C.heading,marginBottom:4}}>{e.empresa}</div>
                    {e.trails_atlas_detail&&e.trails_atlas_detail.length>0&&(
                      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>
                        <span style={{fontSize:10,color:C.faint}}>Alimenta: </span>
                        {e.trails_atlas_detail.map(d=>(
                          <button key={d.code+(d.atlas_num||'')} onClick={()=>setTrail(d)}
                            style={{...pill(C.blueDark,C.blue),cursor:"pointer",fontSize:10}}>
                            {d.code}
                          </button>
                        ))}
                      </div>
                    )}
                    {e.impacto_detail&&<p style={{fontSize:11,color:C.muted,margin:"6px 0 0",lineHeight:1.6}}>
                      {e.impacto_detail.replace(/^(Muito alto|Alto|Médio|Baixo)\s*[—-]\s*/,'')}</p>}
                  </>
                )}
                {tab==="atlas_sem_guia"&&(
                  <>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <ImpactBadge level={e.prioridade}/>
                    </div>
                    <div style={{fontSize:13,fontWeight:700,color:C.heading,marginBottom:4}}>{e.recurso}</div>
                    {e.trails_atlas_detail&&e.trails_atlas_detail.length>0&&(
                      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>
                        <span style={{fontSize:10,color:C.faint}}>Trilhas: </span>
                        {e.trails_atlas_detail.map(d=>(
                          <button key={d.code+(d.atlas_num||'')} onClick={()=>setTrail(d)}
                            style={{...pill(C.blueDark,C.blue),cursor:"pointer",fontSize:10}}>
                            {d.code}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
                {tab==="sobreposicao"&&(
                  <>
                    <div style={{fontSize:13,fontWeight:700,color:C.heading,marginBottom:4}}>{e.fonte}</div>
                    <div style={{fontSize:11,color:C.dim,marginTop:4}}>{e.observacao}</div>
                    <div style={{display:"flex",gap:8,marginTop:6,fontSize:10,color:C.faint}}>
                      {e.presente_atlas&&<span>Atlas: {e.presente_atlas}</span>}
                      {e.presente_guia&&<span>· Guia: {e.presente_guia}</span>}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
