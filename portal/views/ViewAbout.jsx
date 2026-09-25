// views/ViewAbout.jsx — página "Sobre o Portal".
// Extraído de App.jsx na Etapa 5 da quebra do monólito (D98/D103, 05/07/2026).
import { C } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";

export function ViewAbout(){
  const {all,trails} = useData();
  const items=[
    {title:"O que é",color:C.social,content:"Mapeamento aberto de fontes educacionais gratuitas para a indústria brasileira. Cobre programas sociais corporativos e recursos de qualificação técnica — sem anunciante, sem paywall."},
    {title:`${all.length} fontes em duas camadas`,color:C.tech,content:`Social: ${all.filter(s=>s.layer==="social").length} programas de empresas para comunidades e trabalhadores. Técnica: ${all.filter(s=>s.layer==="technical").length} fontes de qualificação profissional curadas do Guia v6.3 e Sistema FATO Atlas v1.2.`},
    {title:`${trails.length} trilhas de carreira`,color:C.purpleLight,content:"Cada trilha conecta programas sociais de acesso a fontes técnicas de qualificação, com o perfil CNCT alvo identificado. Etapas clicáveis mostram os cards das fontes diretamente."},
    {title:"Protocolo de curadoria",color:C.green,content:"Protocolo v1.2: campos obrigatórios de acesso, idioma, formato e cadastro. Entradas do Atlas FATO rastreadas ao documento-origem. Badge ⚠️ indica URL pendente de verificação."},
    {title:"Como sugerir uma fonte",color:C.amber,content:"Requisitos: (1) gratuita sem compra, (2) URL verificada, (3) conteúdo técnico ou social industrial relevante para o Brasil, (4) não duplicata. Use o Protocolo v1.2 para formatar a sugestão."},
  ];
  return (
    <div style={{maxWidth:760,margin:"0 auto",padding:"28px 20px"}}>
      <h2 style={{margin:"0 0 20px",fontSize:20,fontWeight:800,color:C.heading}}>Sobre o Portal</h2>
      {items.map(({title,color,content})=>(
        <div key={title} style={{background:C.surface,border:`1px solid ${color}33`,borderRadius:10,padding:"16px 18px",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <div style={{width:3,height:16,background:color,borderRadius:2}}/>
            <span style={{fontSize:13,fontWeight:700,color:C.heading}}>{title}</span>
          </div>
          <p style={{margin:0,fontSize:12,color:C.dim,lineHeight:1.7}}>{content}</p>
        </div>
      ))}
      <div style={{marginTop:16,padding:"12px 16px",background:C.surface2,border:"1px solid #1e293b",borderRadius:8,fontSize:11,color:C.faint}}>
        Mapeamento + Guia v6.3 + Sistema FATO Atlas v1.2 · v3.2 · Junho 2026
      </div>
    </div>
  );
}
