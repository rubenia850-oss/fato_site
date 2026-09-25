// views/ViewHome.jsx — página inicial: estatísticas gerais + trilhas em destaque + setores.
// Extraído de App.jsx na Etapa 5 da quebra do monólito (D98/D103, 05/07/2026).
import { C, pill, btn } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";

export function ViewHome({setView}){
  const {all,trails,sectorsTech} = useData();
  const kpis=[
    {v:all.length,l:"Fontes mapeadas",c:C.text},
    {v:all.filter(s=>s.layer==="social").length,l:"Programas sociais",c:C.social},
    {v:all.filter(s=>s.layer==="technical").length,l:"Fontes técnicas",c:C.tech},
    {v:all.filter(s=>!s.cadastro).length,l:"Sem cadastro",c:C.lime},
    {v:all.filter(s=>s.lang&&s.lang.includes("PT")).length,l:"Em português",c:C.greenBright},
    {v:trails.length,l:"Trilhas de carreira",c:C.purpleLight},
  ];
  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"32px 20px"}}>
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontSize:11,letterSpacing:4,color:C.social,textTransform:"uppercase",marginBottom:10}}>Portal Aberto · Junho 2026</div>
        <h1 style={{margin:"0 0 12px",fontSize:"clamp(22px,5vw,40px)",fontWeight:900,color:C.heading,letterSpacing:-1,lineHeight:1.1}}>
          Educação Industrial<br/>
          <span style={{background:"linear-gradient(90deg,#6366f1,#0891b2)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>100% Gratuita</span>
        </h1>
        <p style={{margin:"0 0 28px",fontSize:14,color:C.dim,maxWidth:520,marginLeft:"auto",marginRight:"auto",lineHeight:1.7}}>
          O maior mapeamento de fontes educacionais gratuitas para a indústria brasileira. Programas sociais, qualificação técnica e trilhas de carreira curadas.
        </p>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>setView("explore")} style={{...btn("linear-gradient(135deg,#6366f1,#0891b2)",C.white,"transparent"),fontSize:13,padding:"10px 22px",borderRadius:9}}>
            🔍 Explorar {all.length} fontes
          </button>
          <button onClick={()=>setView("trails")} style={{...btn(C.purpleDim,C.indigoLight,C.indigoDark),fontSize:13,padding:"10px 22px",borderRadius:9}}>
            🗺️ Ver {trails.length} trilhas
          </button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:40}}>
        {kpis.map(k=>(
          <div key={k.l} style={{background:C.surface,border:`1px solid ${k.c}22`,borderRadius:10,padding:"14px 16px",textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:900,color:k.c,lineHeight:1}}>{k.v}</div>
            <div style={{fontSize:9,color:C.muted,marginTop:4}}>{k.l}</div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:3,height:18,background:C.purple,borderRadius:2}}/>
        <span style={{fontSize:14,fontWeight:700,color:C.text}}>Trilhas de Carreira</span>
        <span style={{fontSize:11,color:C.faint}}>— do programa social à qualificação técnica</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:10,marginBottom:36}}>
        {trails.map(t=>(
          <div key={t.id} onClick={()=>setView("trails")}
            style={{background:C.surface,border:`1px solid ${t.color}33`,borderRadius:10,padding:"14px 16px",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:22}}>{t.icon}</span>
              <span style={{fontSize:12,fontWeight:700,color:C.heading,lineHeight:1.3}}>{t.name}</span>
            </div>
            <div style={{fontSize:10,color:C.muted,marginBottom:6}}>{t.steps.length} etapas · {t.steps.reduce((a,s)=>a+s.ids.length,0)} fontes</div>
            <span style={{...pill(t.color+"22",t.color,t.color+"44")}}>{t.cnct}</span>
          </div>
        ))}
      </div>
      <div style={{marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:3,height:18,background:C.tech,borderRadius:2}}/>
        <span style={{fontSize:14,fontWeight:700,color:C.text}}>Por Setor Técnico</span>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
        {sectorsTech.slice(1).map(s=>{
          const count=all.filter(x=>x.sector===s).length;
          return <button key={s} onClick={()=>setView("explore")} style={{...btn(C.surface,C.dim),fontSize:11}}>{s} <span style={{color:C.tech,fontWeight:700,marginLeft:3}}>{count}</span></button>;
        })}
      </div>
    </div>
  );
}
