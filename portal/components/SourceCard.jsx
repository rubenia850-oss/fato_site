// components/SourceCard.jsx — card de uma fonte (social/técnica/setor), com painel expandido.
// Extraído de App.jsx na Etapa 3 da quebra do monólito (D98/D101, 05/07/2026).
import { C, pill, card, btn } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";
import { LAYER_META, Tag, FavBtn, CopyBtn } from "./badges.jsx";

export function SourceCard({s,favorites,toggleFav,expanded,onExpand,mini}){
  const {newIds,formatMeta,navigateTo,profiles} = useData();
  const lay=LAYER_META[s.layer]||LAYER_META.technical;
  const fmt=formatMeta[s.format]||{label:s.format||"EAD",color:C.green,bg:C.greenDim};
  const isAtlas = s.source_doc==="atlas";
  const isPending = s.verified===false;

  // SP-03: resolve profile id from cnct_hint string (e.g. "T1-02" → id 2)
  const handleCnctClick = (e) => {
    e.stopPropagation();
    if (!s.cnct_hint || !profiles || !navigateTo) return;
    const match = s.cnct_hint.match(/T\d+-(\d+)/);
    if (!match) return;
    const id = parseInt(match[1], 10);
    const profile = profiles.find(p => p.id === id);
    if (profile) navigateTo("profiles", { profileId: profile.id });
  };

  return (
    <div style={{...card(lay.accent+"44"),cursor:"pointer",transition:"border-color .2s"}} onClick={onExpand}>
      <div style={{height:2,background:`linear-gradient(90deg,${lay.accent},transparent)`}}/>
      <div style={{padding:mini?"8px 10px":"12px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:mini?10:12,fontWeight:700,color:C.heading}}>{s.company}</span>
            {newIds?.has(s.id)&&<span style={{fontSize:8,color:C.greenLight}}>🆕</span>}
            {isAtlas&&<span style={{...pill(C.purpleDim2,C.purpleSoft,C.purpleBorderA),fontSize:8}}>Atlas IndústriaEDU</span>}
            {s.material_type&&<span title={s.material_type.confidence==='inferido'?'Classificação inferida':undefined} style={{...pill(C.border,C.muted),fontSize:8}}>{s.material_type.label}</span>}
            {s.cnct_hint&&<button onClick={handleCnctClick} title={`Ver Perfil CNCT: ${s.cnct_hint}`} style={{...pill(C.purpleDim,C.indigoBright,C.indigoBorderA3),fontSize:8,cursor:"pointer",border:"1px solid #4338ca66"}}>CNCT {s.cnct_hint} ↗</button>}
            {isPending&&<span title="URL pendente de verificação" style={{fontSize:11,cursor:"help"}}>⚠️</span>}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"flex-end",flexShrink:0}}>
            <span style={{...pill(fmt.bg,fmt.color)}}>{fmt.label}</span>
            {s.national&&<span style={{...pill(C.purpleDim,C.indigoLight,C.indigoBorderA4)}}>🌎 Nacional</span>}
            <FavBtn id={s.id} favorites={favorites} toggleFav={toggleFav}/>
          </div>
        </div>
        <div style={{fontSize:10,color:C.dim,marginBottom:5,fontStyle:"italic"}}>{s.program}</div>
        <div style={{fontSize:11,color:C.textSoft,lineHeight:1.5,marginBottom:8}}>{s.highlight}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
          {(s.tags||[]).slice(0,mini?4:undefined).map(t=><Tag key={t} label={t}/>)}
        </div>
      </div>
      {expanded&&(
        <div style={{borderTop:"1px solid #1e293b",padding:"12px 14px",background:C.surface3}}>
          {s.audience&&(
            <div style={{fontSize:11,color:C.dim,marginBottom:8,lineHeight:1.5}}>
              <span style={{color:C.text,fontWeight:600}}>Público: </span>{s.audience}
            </div>
          )}
          {s.cost_range&&(
            <div style={{fontSize:11,color:C.dim,marginBottom:8}}>
              💰 <span style={{color:C.yellow,fontWeight:600}}>{s.cost_range}</span>
              {s.cost_note&&<span style={{color:C.warmGray}}> ({s.cost_note})</span>}
            </div>
          )}
          {s.cnct&&s.cnct.length>0&&(
            <div style={{marginBottom:8}}>
              <div style={{fontSize:9,color:C.faint,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>Perfil CNCT</div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {s.cnct.map(p=><span key={p} style={{...pill(C.greenDim3,C.greenLight,C.greenBorderA)}}>{p}</span>)}
              </div>
            </div>
          )}
          {s.caminhos_cbo&&(
            <div style={{marginBottom:8,padding:10,background:C.surfacePanel,borderRadius:8,border:"1px solid #1e293b"}}>
              <div style={{fontSize:9,color:C.faint,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>
                Caminhos CBO · {s.caminhos_cbo.course_name}
              </div>
              {s.caminhos_cbo.cbos.length>0&&(
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
                  {s.caminhos_cbo.cbos.map(c=>(
                    <span key={c.codigo} title={c.descricao} style={{...pill(C.blueDim,C.blue,C.blueBorderA),fontSize:9}}>
                      {c.codigo}{c.principal?" ★":""}
                    </span>
                  ))}
                </div>
              )}
              {s.caminhos_cbo.certificacoes.length>0&&(
                <div style={{fontSize:10,color:C.dim,marginBottom:4}}>
                  🎓 {s.caminhos_cbo.certificacoes.slice(0,3).map(c=>c.nome).join(" · ")}
                  {s.caminhos_cbo.certificacoes.length>3&&` +${s.caminhos_cbo.certificacoes.length-3}`}
                </div>
              )}
              {s.caminhos_cbo.normas.length>0&&(
                <div style={{fontSize:9,color:C.muted}}>📋 {s.caminhos_cbo.normas.slice(0,2).join(" · ")}{s.caminhos_cbo.normas.length>2&&` +${s.caminhos_cbo.normas.length-2}`}</div>
              )}
            </div>
          )}
          {s.bloco&&(
            <div style={{fontSize:10,color:C.faint,marginBottom:8}}>
              Bloco Guia: <span style={{color:C.tech}}>{s.bloco}</span>
              {s.source_doc&&<span style={{marginLeft:8,color:s.source_doc==="atlas"?C.purpleLight:C.tech,fontSize:9}}>· {s.source_doc==="atlas"?"Atlas IndústriaEDU":"Guia v6.3"}</span>}
            </div>
          )}
          {s.url&&(
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:4}}>
              <a href={s.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}
                style={{...btn(lay.dim,lay.accent),textDecoration:"none"}}>🔗 Acessar portal</a>
              <CopyBtn text={s.url}/>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
