// components/MicroAtlasView.jsx — Micro-Atlas do curso renderizado dinamicamente a partir de
// cnct_courses, substituindo o link estático para o PDF pré-gerado.
//
// [16/07/2026 — sessão de enxugamento de estrutura, ver PLANO_ENXUGAMENTO_ESTRUTURA.md]
// Contexto: os 78 PDFs em dados/micro_atlas/*.pdf não eram documentos autênticos — eram
// exportações estáticas de 1 registro de cnct_courses cada, geradas por um script fora do
// repositório (não versionado, não auditável). Cobertura incompleta: só 78 dos 99 cursos
// tinham PDF gerado; os outros 21 simplesmente não mostravam nada em ViewProfiles.jsx.
// Confirmado por extração de texto (pdfplumber) que os 78 PDFs seguem 1 único template
// (Identificação → Vinculação ao Macro-Atlas → Referências Preliminares), variando só o
// conteúdo — o que tornou a substituição por componente direta, sem perda de informação.
// Este componente cobre os 99/99 cursos (com ou sem PDF gerado antes), lendo o campo
// `micro_atlas` que loadTrailsProfiles.js agora popula a partir de cnct_courses.
import { C, pill, card } from "../theme/tokens.js";

const STATUS_STYLE = {
  "Planejado":           { color: C.amberLight, bg: C.orangeDim2, border: C.amberBorderA },
  "Sem Atlas dedicado":  { color: C.red,        bg: C.redDim,     border: C.redBorder },
  "Integrado":           { color: C.emerald,    bg: C.greenDim,   border: C.greenBorder },
  "Integrado em múltiplos": { color: C.emerald, bg: C.greenDim,   border: C.greenBorder },
  "Existente":           { color: C.emerald,    bg: C.greenDim,   border: C.greenBorder },
  "Complementar":        { color: C.indigoBright, bg: C.purpleDim, border: C.indigoBorderA },
  "Próximo":             { color: C.skyBlue,    bg: C.blueDim2,   border: C.blueBorderA },
};

function StatusPill({ status }) {
  const s = STATUS_STYLE[status] || { color: C.muted, bg: C.surface2, border: C.border };
  return <span style={pill(s.bg, s.color, s.border)}>{status || "Não classificado"}</span>;
}

function Field({ label, children, warn }) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: warn ? C.amber : C.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: C.text, lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

// `profile` é o objeto já retornado por loadTrailsProfiles.js (contém `micro_atlas`,
// `cbo_principal`, `ch`, `cnct_page`, `name`, `id` — ver loadProfiles()).
export default function MicroAtlasView({ profile }) {
  const m = profile.micro_atlas;
  if (!m) return null; // curso sem linha correspondente em cnct_courses — nada a renderizar

  const semVinculo = !m.atlas_referencia && !profile.cbo_principal;

  return (
    <div style={{ ...card(C.border), padding: 20, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 6 }}>
            IndústriaEDU · Micro-Atlas do Curso #{profile.id}
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.heading }}>{profile.name}</div>
        </div>
        <StatusPill status={m.status_atlas} />
      </div>

      {semVinculo && (
        <div style={{ ...card(C.redBorder), background: C.redDim, padding: 12, margin: "12px 0", display: "flex", gap: 8, alignItems: "flex-start" }}>
          <span style={{ fontSize: 13 }}>⚠️</span>
          <span style={{ fontSize: 12, color: C.text }}>
            Este curso ainda não está vinculado a um Macro-Atlas dedicado — CBO, carga horária e
            norma não são atribuídos até que essa vinculação exista.
          </span>
        </div>
      )}

      {m.atlas_referencia && (
        <Field label="Vinculação ao macro-atlas">{m.atlas_referencia}</Field>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10, margin: "14px 0" }}>
        <Field label="CBO de referência">
          {profile.cbo_principal ? <code style={{ color: C.blue }}>{profile.cbo_principal}</code> : <span style={{ color: C.muted }}>—</span>}
        </Field>
        <Field label="Carga horária">
          {m.carga_horaria_min ? `${m.carga_horaria_min}h · ${m.carga_dias_uteis ?? "?"} dias úteis` : <span style={{ color: C.muted }}>—</span>}
        </Field>
        <Field label="Página CNCT">
          {m.pagina_cnct ?? profile.cnct_page ?? <span style={{ color: C.muted }}>—</span>}
        </Field>
      </div>

      <Field label="Perfil profissional">{m.perfil_profissional}</Field>
      <Field label="Infraestrutura requerida">{m.infraestrutura}</Field>
      <Field label="Norma de referência" warn>{m.normas_associadas}</Field>

      {m.principais_certificacoes && (
        <Field label={`Certificações intermediárias (${m.num_certificacoes ?? 0})`}>
          {m.principais_certificacoes}
        </Field>
      )}
      {m.principais_especializacoes && (
        <Field label={`Especializações técnicas (${m.num_especializacoes ?? 0})`}>
          {m.principais_especializacoes}
        </Field>
      )}
      {m.principais_graduacoes && (
        <Field label={`Verticalização — graduações (${m.num_graduacoes ?? 0})`}>
          {m.principais_graduacoes}
        </Field>
      )}

      {m.palavras_chave && (
        <div style={{ marginTop: 4, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {m.palavras_chave.split(",").map((k) => (
            <span key={k} style={pill(C.surface2, C.dim)}>{k.trim()}</span>
          ))}
        </div>
      )}

      <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 10, color: C.muted }}>
          Documento de planejamento interno — referência preliminar, sujeita a validação técnica e regulatória.
        </span>
        {/* [17/07] Botão de download do PDF removido: os 78 arquivos estáticos foram eliminados
            do repositório (ver _DECISIONS.md D115). Este componente já era a fonte de conteúdo;
            o PDF era só um formato de saída alternativo que deixou de existir. */}
      </div>
    </div>
  );
}
