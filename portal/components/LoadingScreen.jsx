// components/LoadingScreen.jsx — tela exibida enquanto o banco carrega.
// Extraído de App.jsx na Etapa 2 da quebra do monólito (D98/D100, 05/07/2026).
import { C } from "../theme/tokens.js";

export function LoadingScreen() {
  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
      <div style={{width:28,height:28,border:"2px solid #1e293b",borderTop:"2px solid #6366f1",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <div style={{color:C.faint,fontSize:12}}>Carregando dados...</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
