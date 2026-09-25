// views/ViewTrails.jsx — catálogo de trilhas de carreira (CNCT), com busca e filtro de curadoria.
// Extraído de App.jsx na Etapa 5 da quebra do monólito (D98/D103, 05/07/2026).
import { useState, useMemo } from "react";
import { C, SEL } from "../theme/tokens.js";
import { useData } from "../context/DataContext.js";
import { TrailCard } from "../components/TrailCard.jsx";

export function ViewTrails({favorites,toggleFav}){
  const {trails} = useData();
  const [q,setQ]=useState("");
  const [onlyCurated,setOnlyCurated]=useState(false);

  // EXP-09 (Sprint 16): trails 6→105 (D71-DB, sessão BANCO) — as 6 originais (trl-01..06) têm
  // ícone próprio e curadoria manual; as 99 novas (TRL-*) são geradas a partir do catálogo CNCT,
  // com conteúdo igualmente rico mas sem emoji definido (fallback abaixo).
  const isCurated = (id) => /^trl-\d+$/.test(id);

  const filtered = useMemo(() => trails.filter(t =>
    (!q || t.name.toLowerCase().includes(q.toLowerCase()) || (t.cnct||"").toLowerCase().includes(q.toLowerCase())) &&
    (!onlyCurated || isCurated(t.id))
  ), [trails, q, onlyCurated]);

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:"28px 20px"}}>
      <div style={{marginBottom:24}}>
        <div style={{fontSize:11,letterSpacing:3,color:C.purple,textTransform:"uppercase",marginBottom:6}}>Diferencial único do portal</div>
        <h2 style={{margin:"0 0 8px",fontSize:22,fontWeight:800,color:C.heading}}>Trilhas de Carreira</h2>
        <p style={{margin:0,fontSize:13,color:C.dim,lineHeight:1.7,maxWidth:620}}>
          Cada trilha conecta um <strong style={{color:C.social}}>programa social de acesso</strong> com a <strong style={{color:C.tech}}>qualificação técnica</strong> e o perfil <strong style={{color:C.greenLight}}>CNCT</strong> alvo. {trails.length} trilhas mapeadas — 6 com curadoria manual completa, {trails.length-6} geradas a partir do catálogo nacional de cursos técnicos.
        </p>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",alignItems:"center"}}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar trilha ou perfil CNCT..." style={{...SEL,width:260}}/>
        <label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.purpleLight,cursor:"pointer"}}>
          <input type="checkbox" checked={onlyCurated} onChange={e=>setOnlyCurated(e.target.checked)} style={{accentColor:C.purpleLight}}/>
          Só as 6 curadas originalmente
        </label>
        <span style={{fontSize:11,color:C.faint,marginLeft:"auto"}}>{filtered.length} de {trails.length}</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {filtered.map(t=><TrailCard key={t.id} trail={t} favorites={favorites} toggleFav={toggleFav}/>)}
      </div>
      {filtered.length===0&&(
        <div style={{textAlign:"center",padding:"40px 0",color:C.faint,fontSize:12}}>
          Nenhuma trilha encontrada com esses filtros.
        </div>
      )}
    </div>
  );
}
