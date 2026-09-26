// views/ViewProfiles.jsx — perfis do catálogo CNCT (98), com detalhe de perfil, mercado de
// trabalho associado, rede de carreira, onde estudar, roteiro sugerido e vale-a-pena-migrar.
// Extraído de App.jsx na Etapa 7 da quebra do monólito (D98/D105, 05/07/2026).
// Extração feita por script a partir do texto original (lição do D104: nunca reconstruir de
// memória) — só a assinatura da função (function -> export function) foi tocada.
import { useState, useMemo, useEffect } from "react";
import { C, pill, card, btn, SEL } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";
import { TierBadge } from "../components/badges.jsx";
import { NormaBadge } from "../components/badges.jsx";
import { RedeDeCarreira } from "../components/RedeDeCarreira.jsx";
import MicroAtlasView from "../components/MicroAtlasView.jsx";
import { fmtMoeda, fmtNum } from "../utils/helpers.js";

export function ViewProfiles({pendingProfile, onPendingConsumed}){
  const {profiles,atlasTrails,technical,mercadoTrabalho,navigateTo,eliteProfiles}=useData();
  const [selected,setSelected]=useState(null);
  const [filterTier,setTier]=useState("all");
  const [trailDetail,setTrailDetail]=useState(null);
  const [q,setQ]=useState("");
  const [pivotQuery,setPivotQuery]=useState(""); // SP-45
  const [pivotExpanded,setPivotExpanded]=useState(false); // SP-45
  const [showMicroAtlas,setShowMicroAtlas]=useState(false); // [16/07] toggle do Micro-Atlas dinâmico
  useEffect(()=>{ setShowMicroAtlas(false); },[selected?.id]); // fecha o Micro-Atlas ao trocar de perfil

  // SP-03: se há um perfil pendente de navegação cruzada, abre ele imediatamente
  useEffect(()=>{
    if(pendingProfile!=null && profiles.length){
      const p = profiles.find(x=>x.id===pendingProfile);
      if(p){ setSelected(p); onPendingConsumed&&onPendingConsumed(); }
    }
  },[pendingProfile, profiles]); // eslint-disable-line

  // SP-45: reseta busca/expansão da matriz de pivotamento ao trocar de perfil
  useEffect(()=>{ setPivotQuery(""); setPivotExpanded(false); },[selected]);

  const filtered=useMemo(()=>profiles.filter(p=>
    (filterTier==="all"||p.tier===filterTier)&&
    (!q||p.name.toLowerCase().includes(q.toLowerCase()))
  ),[profiles,filterTier,q]);

  // ── Trail detail panel ───────────────────────────────────────────────────
  if(trailDetail){
    const t=atlasTrails.find(x=>x.code===trailDetail.code&&x.atlas_num===trailDetail.atlas_num)||trailDetail;
    // SP-50 (15/07, § D do ESTUDO_VIABILIDADE): "esta trilha compõe os Perfis de Elite X, Y" —
    // groupBy sobre eliteProfiles (já carregado por inteiro, sem query nova). Checagem própria:
    // trilhas citadas em cada Perfil de Elite sempre pertencem ao mesmo atlas_num do próprio
    // perfil (0 mismatches, confirmado par a par) — comparar code+atlas_num aqui é seguro e não
    // repete a ambiguidade do SP-48.
    const elitePerfisDaTrilha = eliteProfiles.filter(ep =>
      ep.atlas_num===t.atlas_num && (ep.trilhas||[]).includes(t.code)
    );
    // SP-48: comparar por (code, atlas_num), não só code — 28 códigos se repetem entre atlas
    // diferentes (ex. C1 em I/II/III/V/VII); usar só code aqui associaria trilhas erradas.
    const relProfiles=profiles.filter(p=>(p.trails_atlas_detail||[]).some(x=>x.code===t.code&&x.atlas_num===t.atlas_num));
    // Fontes técnicas: atlas_num só está resolvido pra 194/232 (83%) linhas de source_atlas_trails
    // (SP-48, pedido pendente pra sessão BANCO completar o restante). Onde existe, desambigua;
    // onde é null (dado ainda não resolvido do lado BANCO), cai pra comparação só por code — mesmo
    // comportamento de antes pra essas linhas, não piora nem finge estar corrigido.
    const relSources=technical.filter(s=>(s.atlas_trails_detail||[]).some(x=>
      x.code===t.code && (x.atlas_num==null ? true : x.atlas_num===t.atlas_num)
    ));
    return(
      <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px"}}>
        <button onClick={()=>setTrailDetail(null)} style={{...btn(C.border,C.dim),marginBottom:16}}>← Voltar ao perfil</button>
        <div style={{...card(C.blueBorderA4),padding:20,marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <span style={{...pill(C.blueDark,C.blue),fontFamily:"'IBM Plex Mono',monospace",fontSize:11}}>{t.code}</span>
            <span style={{fontSize:11,color:C.dim}}>Atlas {t.atlas_num} · {t.atlas_name}</span>
            {t.aproveitamento&&(
              <span title="Aproveitamento base estimado para ingresso direto" style={{...pill(C.greenDim,C.emerald),fontSize:9}}>
                ✓ {t.aproveitamento} aproveitamento
              </span>
            )}
            {t.nivel_perfil&&(
              <span style={{...pill(C.orangeDim,C.orangeLight),fontSize:9}}>{t.nivel_perfil}</span>
            )}
          </div>
          <div style={{fontSize:16,fontWeight:700,color:C.heading,marginBottom:6}}>{t.name}</div>
          {t.description&&<p style={{fontSize:12,color:C.dim,margin:0,lineHeight:1.7}}>{t.description}</p>}
          {/* SP-62 (item 13): fonte CNCT + página, e blocos de competência do documento Atlas —
              contexto editorial que não existia em nenhuma tela antes desta sessão */}
          {t.atlas_doc&&(
            <div style={{marginTop:8,paddingTop:8,borderTop:"1px solid #1e293b",fontSize:10,color:C.faint}}>
              {t.atlas_doc.fontes_cnct&&<div>📖 {t.atlas_doc.fontes_cnct}</div>}
              {t.atlas_doc.codigos_guia&&<div style={{marginTop:2}}>Blocos: {t.atlas_doc.codigos_guia}</div>}
            </div>
          )}
        </div>

        {/* SP-12/Grupo B: ROI, dificuldade, tecnologias, soft skills — só aparece se houver algum dado */}
        {(t.roi||t.dificuldade||(t.tecnologias&&t.tecnologias.length>0)||(t.soft_skills&&t.soft_skills.length>0))&&(
          <div style={{...card(),padding:16,marginBottom:16}}>
            <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>
              Perfil da trilha
            </div>
            <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:(t.tecnologias&&t.tecnologias.length>0)||(t.soft_skills&&t.soft_skills.length>0)?12:0}}>
              {t.roi&&(
                <div>
                  <div style={{fontSize:9,color:C.faint}}>SALÁRIO ESTIMADO DE DESTINO</div>
                  <div style={{fontSize:15,fontWeight:800,color:C.emerald}}>
                    R$ {Number(t.roi.salario).toLocaleString("pt-BR",{maximumFractionDigits:0})}
                  </div>
                  <div style={{fontSize:9,color:C.muted}}>{t.roi.carga}h de formação · R$ {t.roi.roi_hora.toFixed(2)}/hora investida</div>
                </div>
              )}
              {t.dificuldade&&(
                <div>
                  <div style={{fontSize:9,color:C.faint}}>DIFICULDADE ESTIMADA</div>
                  <div style={{fontSize:13,fontWeight:700,color:C.heading}}>{t.dificuldade.nivel}</div>
                  {t.dificuldade.tem_pre_requisito&&<div style={{fontSize:9,color:C.orangeLight}}>Tem pré-requisito</div>}
                </div>
              )}
              {t.versatilidade&&(
                <div>
                  <div style={{fontSize:9,color:C.faint}}>VERSATILIDADE</div>
                  <div style={{fontSize:13,fontWeight:700,color:C.heading}}>{t.versatilidade.qtd_setores} setores</div>
                  <div style={{fontSize:9,color:C.muted}}>{t.versatilidade.classificacao}</div>
                </div>
              )}
            </div>
            {t.tecnologias&&t.tecnologias.length>0&&(
              <div style={{marginBottom:t.soft_skills&&t.soft_skills.length>0?10:0}}>
                <div style={{fontSize:9,color:C.faint,marginBottom:5}}>TECNOLOGIAS</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {t.tecnologias.map((x,i)=>(
                    <span key={i} style={{...pill(x.categoria==="EMERGENTE"?C.orangeDim:C.surface,x.categoria==="EMERGENTE"?C.orangeLight:C.dim),fontSize:9}}>
                      {x.termo}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {t.soft_skills&&t.soft_skills.length>0&&(
              <div>
                <div style={{fontSize:9,color:C.faint,marginBottom:5}}>SOFT SKILLS MAIS PEDIDAS</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                  {t.soft_skills.map((s,i)=><span key={i} style={{...pill(C.purpleDim,C.indigoLight,C.indigoBorderA),fontSize:9}}>{s.skill}</span>)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* EXP-06A: núcleo curricular (Sprint 8) — D53-DB: Atlas II usa cbos+normas, demais usam nucleo */}
        {t.atlas_num===2?(
          (t.cbos&&t.cbos.length>0)||(t.normas&&t.normas.length>0) ? (
            <div style={{...card(),padding:16,marginBottom:16}}>
              <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>
                Índice Cruzado · Atlas II (Soldagem e Metalurgia)
              </div>
              {t.cbos&&t.cbos.length>0&&(
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:9,color:C.faint,marginBottom:5}}>FUNÇÕES CBO</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {t.cbos.map(c=><span key={c} style={{...pill(C.blueDim,C.blue,C.blueBorderA),fontFamily:"'IBM Plex Mono',monospace",fontSize:9}}>{c}</span>)}
                  </div>
                </div>
              )}
              {t.normas&&t.normas.length>0&&(
                <div>
                  <div style={{fontSize:9,color:C.faint,marginBottom:5}}>NORMAS</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {t.normas.map(n=><NormaBadge key={n} code={n} baseStyle={{...pill(C.orangeDim,C.orangeLight,C.orangeBorderA),fontSize:9}}/>)}
                  </div>
                </div>
              )}
            </div>
          ) : null
        ):(
          t.nucleo&&t.nucleo.length>0&&(
            <div style={{...card(),padding:16,marginBottom:16}}>
              <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>
                Núcleo Curricular · {t.nucleo.length} Unidades Curriculares
              </div>
              <div style={{display:"grid",gap:4}}>
                {t.nucleo.map((u,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",background:C.surface3,borderRadius:6,border:"1px solid #1e293b"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:C.faint,minWidth:40}}>{u.codigo}</span>
                      <span style={{fontSize:11,color:C.text}}>{u.nome}</span>
                    </div>
                    {u.carga&&<span style={{fontSize:9,color:C.muted,flexShrink:0,marginLeft:8}}>{u.carga}h</span>}
                  </div>
                ))}
              </div>
              {t.nucleo.some(u=>u.carga)&&(
                <div style={{marginTop:8,fontSize:9,color:C.faint,textAlign:"right"}}>
                  Carga total estimada: {t.nucleo.reduce((a,u)=>a+(parseInt(u.carga)||0),0)}h
                </div>
              )}
            </div>
          )
        )}
        {/* SP-45 (item 3 do estudo de viabilidade): atlas_trail_detail — currículo real por nível */}
        {t.curriculo_detalhado&&t.curriculo_detalhado.length>0&&(
          <div style={{...card(),padding:16,marginBottom:16}}>
            <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>
              Currículo Detalhado por Nível
            </div>
            <div style={{display:"grid",gap:10}}>
              {t.curriculo_detalhado.map((d,i)=>(
                <div key={i} style={{padding:"10px 12px",background:C.surface3,borderRadius:8,border:"1px solid #1e293b"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6,gap:8}}>
                    <span style={{fontSize:11,fontWeight:700,color:C.heading}}>{d.nivel}</span>
                    {d.carga_estimada&&<span style={{fontSize:9,color:C.muted,flexShrink:0,whiteSpace:"nowrap"}}>{d.carga_estimada}</span>}
                  </div>
                  {d.perfil_saida&&<p style={{margin:"0 0 8px",fontSize:11,color:C.dim,lineHeight:1.6}}>{d.perfil_saida}</p>}
                  {d.topicos.length>0&&(
                    <ul style={{margin:"0 0 8px",paddingLeft:16,fontSize:10,color:C.dim,lineHeight:1.9}}>
                      {d.topicos.map((x,xi)=><li key={xi}>{x}</li>)}
                    </ul>
                  )}
                  {d.normas.length>0&&(
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {d.normas.map((n,ni)=><NormaBadge key={ni} code={n} baseStyle={{...pill(C.orangeDim2,C.amberLight,C.amberBorderA)}}/>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* SP-50 (item D do estudo de viabilidade): índice reverso trilha → Perfis de Elite */}
        {elitePerfisDaTrilha.length>0&&(
          <div style={{...card(),padding:16,marginBottom:16}}>
            <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>
              Esta trilha compõe {elitePerfisDaTrilha.length} Perfil(is) de Elite
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {elitePerfisDaTrilha.map(ep=>(
                <button key={ep.code} onClick={()=>navigateTo&&navigateTo("elite")}
                  style={{...btn(C.purpleDim,C.indigoLight),fontSize:11}}>
                  {ep.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {relProfiles.length>0&&(
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:8,fontWeight:600}}>PERFIS CNCT ASSOCIADOS</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {relProfiles.map(p=>(
                <button key={p.id} onClick={()=>{setTrailDetail(null);setSelected(p);}}
                  style={{...btn(C.surface,C.dim),fontSize:11}}>
                  <TierBadge tier={p.tier}/> #{p.id} {p.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {relSources.length>0&&(
          <div>
            <div style={{fontSize:11,color:C.muted,marginBottom:8,fontWeight:600}}>FONTES ASSOCIADAS ({relSources.length})</div>
            <div style={{display:"grid",gap:8}}>
              {relSources.map(s=>(
                <div key={s.id} style={{...card(),padding:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:C.heading}}>{s.company} — {s.program}</div>
                    <div style={{fontSize:10,color:C.muted,marginTop:2}}>{s.sector}</div>
                  </div>
                  <a href={s.url} target="_blank" rel="noopener noreferrer"
                    style={{...btn(C.surface,C.blue),fontSize:10,textDecoration:"none"}}>Acessar →</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── Profile detail ───────────────────────────────────────────────────────
  if(selected){
    const p=selected;
    return(
      <div style={{maxWidth:900,margin:"0 auto",padding:"24px 16px"}}>
        <button onClick={()=>setSelected(null)} style={{...btn(C.border,C.dim),marginBottom:16}}>← Voltar à lista</button>
        <div style={{...card(C.border),padding:20,marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <TierBadge tier={p.tier}/>
            <span style={{fontSize:10,color:C.muted}}>CH: {p.ch}h · Pág. CNCT: {p.cnct_page}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:4}}>
            <div style={{fontSize:20,fontWeight:800,color:C.heading}}>#{p.id} · {p.name}</div>
            {p.micro_atlas&&(
              <button onClick={()=>setShowMicroAtlas(v=>!v)}
                style={{...btn(C.purpleDim,C.indigoLight),fontSize:10,flexShrink:0,whiteSpace:"nowrap"}}>
                📄 {showMicroAtlas?"Ocultar Micro-Atlas":"Ver Micro-Atlas"}
              </button>
            )}
          </div>
          {p.cbo_principal&&<div style={{fontSize:11,color:C.dim}}>CBO principal: <code style={{color:C.blue}}>{p.cbo_principal}</code></div>}
        </div>

        {showMicroAtlas&&<MicroAtlasView profile={p}/>}

        {(() => {
          const mercado = mercadoTrabalho.filter(m => m.profile_id === p.id).sort((a,b)=>b.total_vinculos-a.total_vinculos)[0];
          if (!mercado) return null;
          return (
            <div style={{...card(C.greenDim),padding:16,marginBottom:16,borderColor:C.greenBorder}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:10,color:C.emerald,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>
                  📊 Mercado de Trabalho · RAIS/PNAD 2024
                </div>
                <button onClick={()=>navigateTo&&navigateTo("mercado")} style={{...btn(C.surface,C.emerald),fontSize:9,padding:"3px 8px"}}>
                  Ver detalhe por estado →
                </button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:C.emerald}}>{fmtMoeda(mercado.salario_medio)}</div>
                  <div style={{fontSize:9,color:C.muted}}>salário médio nacional</div>
                </div>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:C.heading}}>{fmtNum(mercado.total_vinculos)}</div>
                  <div style={{fontSize:9,color:C.muted}}>vínculos ativos</div>
                </div>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:C.heading}}>{mercado.top_uf||"—"}</div>
                  <div style={{fontSize:9,color:C.muted}}>maior mercado</div>
                </div>
                <div>
                  <div style={{fontSize:16,fontWeight:800,color:mercado.ufs_em_alta>0?C.emerald:C.dim}}>
                    {mercado.ufs_em_alta>0 ? `${mercado.ufs_em_alta}/${mercado.total_ufs}` : "Estável"}
                  </div>
                  <div style={{fontSize:9,color:C.muted}}>{mercado.ufs_em_alta>0?"estados em alta":"sem alta registrada"}</div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* SP-12/Grupo C: dm_sinonimos_perfis + dm_rede_centralidade/comunidades.
            14/07/2026 (D111): badge de texto substituído por grafo radial de verdade —
            ver components/RedeDeCarreira.jsx pra saber o que é dado real (sinônimo) e o que
            é aproximação (mesma comunidade). */}
        {((p.sinonimos&&p.sinonimos.length>0)||p.rede_centralidade||p.rede_comunidade)&&(
          <div style={{...card(),padding:16,marginBottom:16}}>
            <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>
              Rede de Carreira
            </div>
            {p.rede_centralidade&&(
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <span style={{...pill(p.rede_centralidade.classificacao.includes("HUB")?C.greenDim:C.border,p.rede_centralidade.classificacao.includes("HUB")?C.emerald:C.dim),fontSize:10}}>
                  {p.rede_centralidade.classificacao}
                </span>
                <span style={{fontSize:9,color:C.muted}}>{p.rede_centralidade.grau} conexões na rede de trilhas</span>
              </div>
            )}

            <RedeDeCarreira profile={p} allProfiles={profiles} navigateTo={navigateTo}/>

            <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:10,fontSize:9,color:C.muted}}>
              <span>▬ <span style={{color:C.indigoBright}}>brilhante</span> = sinônimo (dado específico)</span>
              <span>▬ <span style={{color:C.purpleDim3}}>apagado</span> = mesma comunidade (aproximação)</span>
            </div>

            {p.sinonimos&&p.sinonimos.length>0&&(
              <div style={{marginTop:14}}>
                <div style={{fontSize:9,color:C.faint,marginBottom:6}}>PERFIS QUASE-EQUIVALENTES</div>
                <div style={{display:"grid",gap:5}}>
                  {p.sinonimos.map((s,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",background:C.surface3,borderRadius:6,border:"1px solid #1e293b"}}>
                      <span style={{fontSize:11,color:C.text}}>{s.outro_nome}</span>
                      <span style={{fontSize:9,color:C.muted}}>{(s.overlap*100).toFixed(0)}% overlap</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SP-12/Grupo C: dm_qualidade_preditiva + dm_oferta_real — onde estudar, com selo eMEC */}
        {p.onde_estudar&&p.onde_estudar.length>0&&(
          <div style={{...card(),padding:16,marginBottom:16}}>
            <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>
              Onde Estudar (avaliação de qualidade)
            </div>
            <div style={{display:"grid",gap:6}}>
              {p.onde_estudar.slice(0,6).map((r,i)=>(
                <div key={i} style={{padding:"8px 10px",background:C.surface3,borderRadius:6,border:"1px solid #1e293b"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                    <span style={{fontSize:11,color:C.text,fontWeight:600}}>{r.instituicao}{r.uf?` (${r.uf})`:""}</span>
                    {r.selo_emec&&<span style={{fontSize:10}}>{r.selo_emec}</span>}
                  </div>
                  <div style={{display:"flex",gap:10,marginTop:4,flexWrap:"wrap"}}>
                    {r.taxa_conclusao!=null&&<span style={{fontSize:9,color:C.muted}}>{r.taxa_conclusao.toFixed(0)}% conclusão</span>}
                    {r.taxa_ocupacao!=null&&<span style={{fontSize:9,color:C.muted}}>{r.taxa_ocupacao.toFixed(0)}% ocupação de egressos</span>}
                    {r.salario_medio!=null&&<span style={{fontSize:9,color:C.emerald}}>{fmtMoeda(r.salario_medio)}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{fontSize:8,color:C.faint,marginTop:8}}>Fonte: PNAD Contínua + selo eMEC · dado por curso/instituição, aproximado ao perfil pelo nome</div>
          </div>
        )}

        {/* SP-12/Grupo B: dm_roteiro_carreira — passo-a-passo com carga acumulada */}
        {p.roteiro_carreira&&p.roteiro_carreira.length>0&&(
          <div style={{...card(),padding:16,marginBottom:16}}>
            <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>
              Roteiro de Carreira Sugerido
            </div>
            <div style={{display:"grid",gap:6}}>
              {p.roteiro_carreira.map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 10px",background:C.surface3,borderRadius:6,border:"1px solid #1e293b"}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,color:C.dim,flexShrink:0}}>{r.ordem_passo}</div>
                  <div style={{flex:1,minWidth:0}}>
                    {r.url?(
                      <a href={r.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:C.blue,textDecoration:"none"}}>{r.passo_nome}</a>
                    ):(
                      <span style={{fontSize:11,color:C.text}}>{r.passo_nome}</span>
                    )}
                    <div style={{fontSize:9,color:C.muted}}>{r.tipo_passo}{r.carga_horaria?` · ${r.carga_horaria}h`:""}</div>
                  </div>
                  {r.carga_acumulada&&<span style={{fontSize:9,color:C.faint,flexShrink:0}}>{r.carga_acumulada}h acum.</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SP-12/Grupo B: dm_premio_transferencia — vale a pena migrar pra outro perfil? */}
        {p.premio_transferencia&&p.premio_transferencia.length>0&&(
          <div style={{...card(),padding:16,marginBottom:16}}>
            <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>
              Vale a Pena Migrar de Perfil?
            </div>
            <div style={{display:"grid",gap:6}}>
              {p.premio_transferencia.slice(0,5).map((r,i)=>{
                const positivo=r.diferenca_mensal>0;
                return(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:C.surface3,borderRadius:6,border:"1px solid #1e293b",gap:10}}>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:11,color:C.text,fontWeight:600}}>{r.destino_nome}</div>
                      <div style={{fontSize:9,color:C.muted}}>{r.recomendacao}</div>
                    </div>
                    <div style={{textAlign:"right",flexShrink:0}}>
                      <div style={{fontSize:12,fontWeight:800,color:positivo?C.emerald:C.red}}>
                        {positivo?"+":""}{fmtMoeda(r.diferenca_mensal)}/mês
                      </div>
                      <div style={{fontSize:9,color:C.muted}}>{r.horas_necessarias}h · breakeven {r.breakeven_meses}m</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SP-45 (item 5 do estudo de viabilidade): dm_matriz_pivotamento — custo em horas para
            pivotar para qualquer um dos outros perfis, não só o top-5 qualitativo acima. */}
        {p.matriz_pivotamento&&p.matriz_pivotamento.length>0&&(()=>{
          const filtered = pivotQuery
            ? p.matriz_pivotamento.filter(r=>r.destino_nome.toLowerCase().includes(pivotQuery.toLowerCase()))
            : p.matriz_pivotamento;
          const visible = (pivotExpanded||pivotQuery) ? filtered : filtered.slice(0,6);
          return(
            <div style={{...card(),padding:16,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,gap:8,flexWrap:"wrap"}}>
                <div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:1}}>
                  Pivotar para Outro Perfil — Custo em Horas
                </div>
                <span style={{fontSize:9,color:C.faint}}>{p.matriz_pivotamento.length} destinos possíveis</span>
              </div>
              <input value={pivotQuery} onChange={e=>setPivotQuery(e.target.value)} placeholder="Buscar perfil de destino..."
                style={{...SEL,width:"100%",marginBottom:10,boxSizing:"border-box"}}/>
              <div style={{display:"grid",gap:6}}>
                {visible.map((r,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 10px",background:C.surface3,borderRadius:6,border:"1px solid #1e293b",gap:10}}>
                    <div style={{minWidth:0}}>
                      <div style={{fontSize:11,color:C.text,fontWeight:600}}>{r.destino_nome}</div>
                      <div style={{fontSize:9,color:C.muted}}>{r.nivel}</div>
                    </div>
                    <div style={{fontSize:11,fontWeight:800,color:C.heading,flexShrink:0}}>
                      {r.horas>=9999?"Recomeço":`${r.horas}h`}
                    </div>
                  </div>
                ))}
                {visible.length===0&&(
                  <div style={{fontSize:11,color:C.faint,textAlign:"center",padding:10}}>Nenhum destino encontrado para "{pivotQuery}"</div>
                )}
              </div>
              {!pivotExpanded&&!pivotQuery&&filtered.length>6&&(
                <button onClick={()=>setPivotExpanded(true)} style={{...btn(C.surface,C.dim),width:"100%",marginTop:8}}>
                  Ver todos os {filtered.length} destinos →
                </button>
              )}
            </div>
          );
        })()}

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          {[
            ["Setores do Guia",p.sectors_guia.map(s=><span key={s} style={{...pill(C.border,C.dim),fontFamily:"'IBM Plex Mono',monospace",fontSize:10}}>{s}</span>)],
            ["CBOs associados",p.cbo_list.map(c=><span key={c} style={{...pill(C.border,C.blue),fontFamily:"'IBM Plex Mono',monospace",fontSize:10}}>{c}</span>)],
            ["Qualificações intermediárias",p.qualifications.map(x=><span key={x} style={{...pill(C.purpleDim,C.indigoLight),fontSize:9,flexShrink:0}}>{x}</span>)],
            ["Especializações",p.specializations.map(x=><span key={x} style={{...pill(C.greenDim,C.emerald),fontSize:9,flexShrink:0}}>{x}</span>)],
          ].map(([label,els])=>(
            <div key={label} style={{...card(),padding:14}}>
              <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:8}}>{label.toUpperCase()}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{els}</div>
            </div>
          ))}
        </div>
        <div style={{...card(),padding:14,marginBottom:12}}>
          <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:8}}>TRILHAS DO ATLAS — clique para explorar</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {(p.trails_atlas_detail||[]).map(({code,atlas_num})=>{
              // SP-48: find() por code+atlas_num — code sozinho pegaria a 1ª ocorrência entre
              // até 6 atlas diferentes que compartilham o mesmo código (ex. C1, F1).
              const t=atlasTrails.find(x=>x.code===code&&x.atlas_num===atlas_num);
              return(
                <button key={`${code}-${atlas_num}`} onClick={()=>t&&setTrailDetail(t)}
                  style={{...pill(C.blueDim,C.blue),cursor:t?"pointer":"default",fontSize:10,border:"1px solid #1e3a8a"}}>
                  {code}{t&&<span style={{fontSize:9,color:C.faint,marginLeft:3}}>·{t.atlas_num}</span>}
                </button>
              );
            })}
          </div>
        </div>
        {/* SP-63: era grid de 2 colunas (Tecnólogo/Bacharel, `cnct_verticalizacao`) — a fonte nova
            (`course_graduacoes`) não distingue os 2 níveis, então virou 1 card único. A distinção
            de "especialização técnica" (que a pergunta original cogitava aqui) já tinha um lugar
            melhor: a seção "Especializações" (pills) acima, cuja fonte foi trocada pela mais
            completa junto (98 perfis, era 85) — ver p.specializations. */}
        {p.graduacoes.length>0&&(
          <div style={{...card(),padding:14}}>
            <div style={{fontSize:10,color:C.muted,fontWeight:700,marginBottom:8}}>VERTICALIZAÇÃO — GRADUAÇÃO</div>
            <ul style={{margin:0,paddingLeft:14,fontSize:11,color:C.dim,lineHeight:2}}>
              {p.graduacoes.map(x=><li key={x}>{x}</li>)}
            </ul>
          </div>
        )}
        {p.normas.length>0&&(
          <div style={{...card(),padding:12,marginTop:12}}>
            <span style={{fontSize:10,color:C.muted,fontWeight:700}}>NORMAS: </span>
            <span style={{display:"inline-flex",flexWrap:"wrap",gap:4,verticalAlign:"middle"}}>
              {p.normas.map((n,i)=><NormaBadge key={i} code={n} baseStyle={{...pill(C.border,C.dim),fontSize:10}}/>)}
            </span>
          </div>
        )}
      </div>
    );
  }

  // ── Profile list ─────────────────────────────────────────────────────────
  return(
    <div style={{maxWidth:1100,margin:"0 auto",padding:"28px 16px"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,color:C.muted,marginBottom:4}}>INDÚSTRIAEDU · CNCT 3ª EDIÇÃO</div>
        <div style={{fontSize:20,fontWeight:800,color:C.heading}}>30 Perfis CNCT</div>
        <div style={{fontSize:12,color:C.dim,marginTop:4}}>Técnicos de nível médio reconhecidos pelo MEC para a indústria brasileira</div>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16,alignItems:"center"}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar perfil..." style={{...SEL,width:220}}/>
        {["all","T1","T2","T3","T4"].map(t=>(
          <button key={t} onClick={()=>setTier(t)}
            style={{...btn(filterTier===t?C.border:"transparent",filterTier===t?C.heading:C.muted),fontSize:11}}>
            {t==="all"?"Todos os tiers":t}
          </button>
        ))}
        <span style={{marginLeft:"auto",fontSize:11,color:C.faint}}>{filtered.length} perfis</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10}}>
        {filtered.map(p=>(
          <div key={p.id} onClick={()=>setSelected(p)}
            style={{...card(),padding:14,cursor:"pointer",transition:"border-color .15s",borderColor:C.border}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=C.borderLight}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <TierBadge tier={p.tier}/>
              <span style={{fontSize:10,color:C.faint}}>#{p.id} · {p.ch}h</span>
            </div>
            <div style={{fontSize:13,fontWeight:700,color:C.heading,marginBottom:6,lineHeight:1.4}}>{p.name}</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {p.sectors_guia.slice(0,4).map(s=>(
                <span key={s} style={{...pill(C.border,C.muted),fontFamily:"'IBM Plex Mono',monospace",fontSize:9}}>{s}</span>
              ))}
              {p.trails_atlas.length>0&&<span style={{fontSize:9,color:C.faint}}>{p.trails_atlas.length} trilhas</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
