// components/badges.jsx — badges pequenos reutilizados em várias views.
// Extraído de App.jsx na Etapa 2 da quebra do monólito (D98/D100, 05/07/2026).
// Peças originalmente espalhadas em 4 pontos distintos do arquivo (linhas ~26, ~558, ~1814,
// ~2388 na numeração pré-extração) — reunidas aqui por serem a mesma família (badge + o
// objeto de metadados de cor/rótulo que o alimenta).
import { useState } from "react";
import { C, pill, btn } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";

export const LAYER_META = {
  social:{label:"Social",accent:C.social,dim:C.purpleDim},
  technical:{label:"Técnica",accent:C.tech,dim:C.blueDim2},
};
// FORMAT_META removido (M-10/D61) — agora derivado da tabela `format_meta` via useData().formatMeta

// SP-04A/B — badge de status de URL (sources.url_status), com tooltip da data de checagem (url_checado_em)
export const URL_STATUS_META = {
  validado_ok:{label:"✓ Verificado",color:C.emerald,bg:C.greenDim},
  validado_pesquisa_externa:{label:"✓ Verificado (externo)",color:C.greenLight,bg:C.greenDim},
  invalido_403:{label:"⚠ Bloqueado (403)",color:C.red,bg:C.redDim3},
  invalido_404:{label:"⚠ Não encontrado (404)",color:C.red,bg:C.redDim3},
  invalido_500:{label:"⚠ Erro do servidor",color:C.red,bg:C.redDim3},
  invalido_dominio_inativo:{label:"⚠ Domínio inativo",color:C.red,bg:C.redDim3},
  invalido_erro_conexao:{label:"⚠ Erro de conexão",color:C.orangeLight,bg:C.orangeDim3},
  sem_url_pesquisado:{label:"— Sem URL",color:C.muted,bg:C.border},
};
export function UrlStatusBadge({status,checadoEm}){
  const meta = URL_STATUS_META[status];
  if(!meta) return null;
  const title = checadoEm ? `Checado em ${new Date(checadoEm).toLocaleDateString("pt-BR")}` : undefined;
  return <span title={title} style={{...pill(meta.bg,meta.color),fontSize:9}}>{meta.label}</span>;
}

export function Tag({label}){
  const {tagColors} = useData();
  const c=(tagColors&&tagColors[label])||C.muted;
  return <span style={{...pill(c+"18",c,c+"33"),fontSize:9}}>{label}</span>;
}

export function FavBtn({id,favorites,toggleFav}){
  const on=favorites.has(id);
  return <button onClick={e=>{e.stopPropagation();toggleFav(id);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,padding:2,lineHeight:1}} title={on?"Remover favorito":"Adicionar favorito"}>{on?"❤️":"🤍"}</button>;
}

export function CopyBtn({text}){
  const [copied,setCopied]=useState(false);
  return <button onClick={e=>{e.stopPropagation();navigator.clipboard?.writeText(text);setCopied(true);setTimeout(()=>setCopied(false),1500);}} style={{...btn(C.surface,C.muted),fontSize:10,padding:"4px 10px"}}>{copied?"✓ Copiado":"Copiar URL"}</button>;
}

export const URL_CONF_META = {
  validada: {label:"Site verificado", color:C.emerald, bg:C.greenDim},
  sem_sugestao: {label:"Sem sugestão", color:C.muted, bg:C.border},
};
export function urlConfMeta(conf){
  if(!conf) return null;
  if(conf==="validada") return URL_CONF_META.validada;
  if(conf.startsWith("invalido")) return {label:"Link a revisar", color:C.red, bg:C.redDim2};
  if(conf==="sem_sugestao") return URL_CONF_META.sem_sugestao;
  return {label:conf, color:C.muted, bg:C.border};
}

export const TIER_COLOR={T1:C.green,T2:C.tierT2,T3:C.amber,T4:C.tierT4};
export function TierBadge({tier}){
  const c=TIER_COLOR[tier]||C.muted;
  return <span style={{...pill(c+"22",c,c+"44"),fontSize:9}}>{tier}</span>;
}

export const IMPACT_COLOR={"Muito alto":C.redBright,"Alto":C.orange,"Médio":C.amber,"Baixo":C.greenBright};
export function ImpactBadge({level}){
  const c=IMPACT_COLOR[level]||C.muted;
  return <span style={{...pill(c+"22",c,c+"44"),fontSize:9}}>{level||"—"}</span>;
}

// SP-47 (15/07, § A do ESTUDO_VIABILIDADE): pill de norma clicável — abre um popover inline com
// tipo_norma (295/295 preenchido) e/ou descricao (só 55/295, ver SP-46) se existir, e a lista de
// trilhas/níveis que citam essa norma (reverse-index de atlas_trail_detail.normas_ref, cobre
// 166/295 normas — as demais mostram só o que existir em normas_fato, sem lista de trilhas).
// baseStyle: o `pill(...)` já usado no ponto de chamada, pra manter a cor original de cada lugar.
export function NormaBadge({code,baseStyle}){
  const {normasCatalogo} = useData();
  const [open,setOpen]=useState(false);
  const info = normasCatalogo && normasCatalogo[code];
  return (
    <span style={{position:"relative",display:"inline-block"}}>
      <span onClick={e=>{e.stopPropagation();setOpen(o=>!o);}}
        style={{...(baseStyle||pill(C.orangeDim2,C.amberLight,C.amberBorderA)),cursor:"pointer"}}>
        {code}
      </span>
      {open&&(
        <div onClick={e=>e.stopPropagation()}
          style={{position:"absolute",zIndex:20,top:"100%",left:0,marginTop:4,minWidth:220,maxWidth:280,
            background:C.surfacePanel||C.surface3,border:"1px solid #1e293b",borderRadius:8,padding:10,
            boxShadow:"0 8px 24px rgba(0,0,0,.4)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,fontWeight:700,color:C.heading}}>{code}</span>
            <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:12,padding:0}}>✕</button>
          </div>
          {info?(
            <>
              {info.tipo_norma&&<div style={{fontSize:9,color:C.muted,marginBottom:6}}>{info.tipo_norma}</div>}
              {info.descricao&&<p style={{fontSize:10,color:C.dim,margin:"0 0 8px",lineHeight:1.5}}>{info.descricao}</p>}
              {info.trilhas&&info.trilhas.length>0?(
                <div>
                  <div style={{fontSize:9,color:C.faint,marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>
                    Aparece em {info.trilhas.length} nível(is) de trilha
                  </div>
                  <div style={{display:"grid",gap:3,maxHeight:140,overflowY:"auto"}}>
                    {info.trilhas.map((t,i)=>(
                      <div key={i} style={{fontSize:9,color:C.text}}>
                        {t.trail_code} <span style={{color:C.faint}}>· Atlas {t.atlas_num} · {t.nivel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ):(
                <div style={{fontSize:9,color:C.faint}}>Nenhuma trilha com currículo detalhado cita esta norma ainda.</div>
              )}
            </>
          ):(
            <div style={{fontSize:9,color:C.faint}}>Sem dado adicional catalogado para esta norma.</div>
          )}
        </div>
      )}
    </span>
  );
}
