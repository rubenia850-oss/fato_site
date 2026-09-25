// views/ViewMercadoTrabalho.jsx — mercado de trabalho (EXP-08, Sprint 15) + sinais de mercado
// regional (SP-12 Grupo D).
// Dados reais RAIS/PNAD Contínua 2024, por CBO×UF (dm_mercado_trabalho, auditoria Sprint 13/14).
// Nome amigável e link para Perfil CNCT via cbo_canonical, quando existir (80/85 perfis cobertos).
// Extraído de App.jsx na Etapa 6 da quebra do monólito (D98/D104, 05/07/2026).
import { useState, useMemo } from "react";
import { C, pill, card, btn, SEL } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";
import { fmtMoeda, fmtNum } from "../utils/helpers.js";

export function ViewMercadoTrabalho(){
  const {mercadoTrabalho,sinaisMercado,panoramaUF,navigateTo}=useData();
  const [q,setQ]=useState("");
  const [setor,setSetor]=useState("Todos");
  const [sortBy,setSortBy]=useState("vinculos");
  const [expanded,setExpanded]=useState(null);
  const [sinaisOpen,setSinaisOpen]=useState(false); // SP-12 Grupo D — fechado por padrão
  const [panoramaOpen,setPanoramaOpen]=useState(false); // SP-57 — fechado por padrão, mesmo padrão do SP-12

  const setores=useMemo(()=>["Todos",...new Set(mercadoTrabalho.map(m=>m.setor_cnae))],[mercadoTrabalho]);

  const filtered=useMemo(()=>{
    let list=mercadoTrabalho.filter(m=>
      (!q || (m.nome||m.cbo).toLowerCase().includes(q.toLowerCase())) &&
      (setor==="Todos" || m.setor_cnae===setor)
    );
    const sorters={
      vinculos: (a,b)=>b.total_vinculos-a.total_vinculos,
      salario: (a,b)=>(b.salario_medio||0)-(a.salario_medio||0),
      crescimento: (a,b)=>b.crescimento_medio-a.crescimento_medio,
    };
    return [...list].sort(sorters[sortBy]);
  },[mercadoTrabalho,q,setor,sortBy]);

  const totalVinculosNacional = useMemo(()=>mercadoTrabalho.reduce((a,m)=>a+m.total_vinculos,0),[mercadoTrabalho]);

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:"24px 16px"}}>
      <div style={{marginBottom:18}}>
        <div style={{fontSize:20,fontWeight:800,color:C.heading}}>📊 Mercado de Trabalho</div>
        <div style={{fontSize:12,color:C.dim,marginTop:4}}>
          {mercadoTrabalho.length} ocupações técnicas · {fmtNum(totalVinculosNacional)} vínculos ativos mapeados · fonte: RAIS/PNAD Contínua 2024
        </div>
      </div>

      {/* SP-12 / Grupo D: sinais de mercado regional (compras públicas, concursos, notícias, descompasso oferta×demanda) */}
      <div style={{...card(),padding:0,marginBottom:16,overflow:"hidden"}}>
        <button onClick={()=>setSinaisOpen(v=>!v)} style={{width:"100%",textAlign:"left",background:"transparent",border:"none",cursor:"pointer",padding:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,fontWeight:700,color:C.heading}}>📡 Sinais de Mercado Regional</span>
          <span style={{fontSize:11,color:C.muted}}>{sinaisOpen?"▲ recolher":"▼ compras públicas · concursos · notícias · alertas de região"}</span>
        </button>
        {sinaisOpen&&(
          <div style={{padding:"0 14px 14px"}}>
            {sinaisMercado.colapso&&sinaisMercado.colapso.length>0&&(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.faint,marginBottom:6}}>ALERTA DE DESCOMPASSO OFERTA × DEMANDA POR REGIÃO</div>
                <div style={{display:"grid",gap:5}}>
                  {sinaisMercado.colapso.slice(0,6).map((c,i)=>{
                    const alerta=c.sinal_oferta_trabalho&&c.sinal_oferta_trabalho.includes("EVITAR");
                    return(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",background:C.surface3,borderRadius:6,border:`1px solid ${alerta?C.redBorder:C.border}`,gap:8}}>
                        <div style={{minWidth:0}}>
                          <span style={{fontSize:11,color:C.text,fontWeight:600}}>{c.uf} · {c.setor_importacao}</span>
                          <div style={{fontSize:9,color:C.muted}}>{c.padrao_detectado} · {c.cursos_na_uf} curso(s) na UF, {fmtNum(c.matriculas_total)} matrículas</div>
                        </div>
                        <span style={{...pill(alerta?C.redDim:C.greenDim,alerta?C.red:C.emerald),fontSize:9,flexShrink:0}}>{c.sinal_oferta_trabalho}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {sinaisMercado.noticias&&sinaisMercado.noticias.length>0&&(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.faint,marginBottom:6}}>NOTÍCIAS DE INVESTIMENTO NA INDÚSTRIA</div>
                <div style={{display:"grid",gap:5}}>
                  {sinaisMercado.noticias.slice(0,5).map((n,i)=>(
                    <a key={i} href={n.url} target="_blank" rel="noopener noreferrer" style={{display:"block",padding:"7px 10px",background:C.surface3,borderRadius:6,border:"1px solid #1e293b",textDecoration:"none"}}>
                      <div style={{fontSize:11,color:C.blue}}>{n.titulo}</div>
                      <div style={{fontSize:9,color:C.muted,marginTop:2}}>{n.uf} · {n.setor_impactado}{n.valor_investido?` · ${fmtMoeda(n.valor_investido)}`:""}{n.empregos_prometidos?` · ${fmtNum(n.empregos_prometidos)} empregos prometidos`:""}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {sinaisMercado.concursos&&sinaisMercado.concursos.length>0&&(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,color:C.faint,marginBottom:6}}>CONCURSOS TÉCNICOS ABERTOS</div>
                <div style={{display:"grid",gap:5}}>
                  {sinaisMercado.concursos.slice(0,5).map((c,i)=>(
                    <a key={i} href={c.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",background:C.surface3,borderRadius:6,border:"1px solid #1e293b",textDecoration:"none",gap:8}}>
                      <div style={{minWidth:0}}>
                        <div style={{fontSize:11,color:C.blue}}>{c.cargo}</div>
                        <div style={{fontSize:9,color:C.muted}}>{c.orgao} · {c.uf}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontSize:10,color:C.emerald}}>{c.vagas} vaga(s)</div>
                        <div style={{fontSize:9,color:C.muted}}>{fmtMoeda(c.salario)}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {sinaisMercado.comprasGoverno&&sinaisMercado.comprasGoverno.length>0&&(
              <div>
                <div style={{fontSize:10,color:C.faint,marginBottom:6}}>COMPRAS GOVERNAMENTAIS RECENTES (SINAL DE DEMANDA)</div>
                <div style={{display:"grid",gap:5}}>
                  {sinaisMercado.comprasGoverno.slice(0,5).map((c,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 10px",background:C.surface3,borderRadius:6,border:"1px solid #1e293b",gap:8}}>
                      <div style={{minWidth:0}}>
                        <div style={{fontSize:11,color:C.text}}>{c.orgao}</div>
                        <div style={{fontSize:9,color:C.muted}}>{c.descricao}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{fontSize:10,color:C.emerald}}>{fmtMoeda(c.valor)}</div>
                        <div style={{fontSize:9,color:C.muted}}>{c.uf}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{fontSize:8,color:C.faint,marginTop:10}}>Categorias de setor aqui (automação/elétrica/mecânica...) são um rótulo informal, não a taxonomia oficial do Guia — ver SP-39</div>
          </div>
        )}
      </div>

      {/* SP-57 (item 8): Panorama por Estado — ranking de UF por score_demanda, com calor
          preditivo, competências e indicadores PNP quando existirem pra aquela UF */}
      <div style={{...card(),padding:0,marginBottom:16,overflow:"hidden"}}>
        <button onClick={()=>setPanoramaOpen(v=>!v)} style={{width:"100%",textAlign:"left",background:"transparent",border:"none",cursor:"pointer",padding:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:12,fontWeight:700,color:C.heading}}>🗺️ Panorama por Estado</span>
          <span style={{fontSize:11,color:C.muted}}>{panoramaOpen?"▲ recolher":`▼ ${panoramaUF.length} UFs · demanda, calor preditivo, competências e formação`}</span>
        </button>
        {panoramaOpen&&(
          <div style={{padding:"0 14px 14px",display:"grid",gap:8}}>
            {panoramaUF.map(p=>(
              <div key={p.uf} style={{padding:"10px 12px",background:C.surface3,borderRadius:8,border:"1px solid #1e293b"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:13,fontWeight:700,color:C.heading}}>{p.uf}</span>
                  {p.score_demanda_total>0&&<span style={{...pill(C.blueDim,C.blue),fontSize:9}}>score demanda {p.score_demanda_total.toFixed(1)}</span>}
                </div>
                {p.top_setor_demanda&&(
                  <div style={{fontSize:10,color:C.dim,marginBottom:4}}>
                    Maior demanda: <strong>{p.top_setor_demanda.setor}</strong> — {fmtNum(p.top_setor_demanda.vagas_concursos)} vagas em concurso, {fmtMoeda(p.top_setor_demanda.compras_milhoes*1e6)} em compras
                  </div>
                )}
                {p.calor.length>0&&(
                  <div style={{fontSize:10,color:C.orangeLight,marginBottom:4}}>
                    🔥 {p.calor[0].setor_impactado}: {fmtNum(p.calor[0].empregos)} empregos previstos, {p.calor[0].investimento_bilhoes}bi investimento ({p.calor[0].qtd_noticias} notícia(s))
                  </div>
                )}
                {p.competencias.length>0&&(
                  <div style={{fontSize:9,color:C.muted,marginBottom:4}}>
                    Competências em foco: {p.competencias.slice(0,3).map(c=>c.setor).join(", ")}
                  </div>
                )}
                {p.pnp&&(
                  <div style={{fontSize:9,color:C.faint}}>
                    Formação: {p.pnp.n_cursos} curso(s) · {p.pnp.taxa_ocupacao_media.toFixed(0)}% ocupação média · {fmtNum(p.pnp.total_matriculas)} matrículas
                    {p.pnp.vagas_fantasmas>0&&<span style={{color:C.red}}> · {p.pnp.vagas_fantasmas} vaga(s) fantasma</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar ocupação..." style={{...SEL,width:220}}/>
        <select value={setor} onChange={e=>setSetor(e.target.value)} style={SEL}>
          {setores.map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={SEL}>
          <option value="vinculos">Ordenar: mais vínculos</option>
          <option value="salario">Ordenar: maior salário</option>
          <option value="crescimento">Ordenar: maior crescimento</option>
        </select>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map(m=>{
          const isOpen = expanded===m.cbo;
          return (
            <div key={m.cbo} style={{...card(isOpen?C.social:C.border),padding:14}}>
              <div onClick={()=>setExpanded(isOpen?null:m.cbo)} style={{cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:9,color:C.faint}}>{m.cbo}</span>
                    <span style={{fontSize:13,fontWeight:700,color:C.heading}}>{m.nome || "(sem nome padronizado)"}</span>
                  </div>
                  <div style={{fontSize:10,color:C.muted}}>{m.setor_cnae}</div>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.emerald}}>{fmtMoeda(m.salario_medio)}</div>
                  <div style={{fontSize:9,color:C.muted}}>{fmtNum(m.total_vinculos)} vínculos</div>
                  {m.score_oportunidade_medio!=null&&(
                    <div style={{fontSize:9,color:C.purpleLight,marginTop:2}}>★ {m.score_oportunidade_medio.toFixed(2)} oportunidade</div>
                  )}
                </div>
              </div>
              <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap",alignItems:"center"}}>
                <span style={{...pill(m.ufs_em_alta>m.total_ufs/2?C.greenDim:C.border,m.ufs_em_alta>m.total_ufs/2?C.emerald:C.dim),fontSize:9}}>
                  {m.ufs_em_alta>0 ? `📈 Alta em ${m.ufs_em_alta}/${m.total_ufs} estados` : "Estável"}
                </span>
                {m.top_uf && <span style={{...pill(C.border,C.dim),fontSize:9}}>Maior mercado: {m.top_uf}</span>}
                {m.saldo>0 && <span style={{...pill(C.greenDim,C.emerald),fontSize:9}}>+{fmtNum(m.saldo)} saldo no ano</span>}
                {m.profile_id!=null && navigateTo && (
                  <button onClick={(e)=>{e.stopPropagation(); navigateTo("profiles",{profileId:m.profile_id});}}
                    style={{...btn(C.purpleDim,C.indigoLight),fontSize:9,padding:"3px 8px",marginLeft:"auto"}}>
                    Ver Perfil CNCT ↗
                  </button>
                )}
              </div>

              {isOpen && (
                <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #1e293b"}}>
                  <div style={{fontSize:9,color:C.muted,fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:1}}>
                    Detalhe por estado ({m.total_ufs} UFs)
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:6}}>
                    {m.detalhe_uf.map(u=>(
                      <div key={u.uf} style={{background:C.surface3,borderRadius:6,padding:"6px 8px",border:"1px solid #1e293b"}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:10}}>
                          <span style={{fontWeight:700,color:C.text}}>{u.uf}</span>
                          <span style={{color: u.tendencia==="Alta"?C.emerald:C.muted}}>{u.tendencia==="Alta"?"📈":"–"}</span>
                        </div>
                        <div style={{fontSize:11,color:C.dim,marginTop:2}}>{fmtMoeda(u.salario_medio_bruto)}</div>
                        <div style={{fontSize:9,color:C.faint}}>{fmtNum(u.total_vinculos_ativos)} vínculos</div>
                        {u.oportunidade&&(
                          <div style={{fontSize:9,color:C.purpleLight,marginTop:2}}>★ {u.oportunidade.score_oportunidade.toFixed(2)} · {u.oportunidade.taxa_cobertura.toFixed(0)}% cobertura</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filtered.length===0&&(
        <div style={{textAlign:"center",padding:"40px 0",color:C.faint,fontSize:12}}>
          Nenhuma ocupação encontrada com esses filtros.
        </div>
      )}
    </div>
  );
}
