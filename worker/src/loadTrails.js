// loadTrails.js — porta de portal/data/loadTrailsProfiles.js:loadTrails() pro Worker (D1).
// Lógica idêntica ao original (mesmas queries, mesmo formato de saída) — só troca:
//   1. query(db, sql) síncrono (sql.js)  →  await query(db, sql) assíncrono (D1)
//   2. queries independentes rodam em paralelo via Promise.all (D1 é rede, não memória local —
//      sequencial aqui custaria ~9 round-trips em série à toa)
import { query, groupBy } from "./helpers.js";

export async function loadTrails(db) {
  const [
    trailRows,
    stepRows,
    stepSourceRows,
    escolaLinkRows,
    escolaRows,
    profileRows,
    cboRows,
    normaRows,
    depRows,
  ] = await Promise.all([
    query(db, `SELECT id, icon, name, cnct_label, color, description, descricao_geral FROM trails ORDER BY id`),
    query(db, `SELECT id AS step_id, trail_id, ordem, phase, note FROM trail_steps ORDER BY trail_id, ordem`),
    query(db, `SELECT step_id, source_id FROM trail_step_sources`),
    query(db, `SELECT trail_id, step_ordem, escola_id, curso_nome, url_curso FROM trail_escola_links`),
    query(db, `SELECT id, nome, url_referencia, tipo FROM escola_sources`),
    query(db, `SELECT trail_id, profile_id FROM trail_cnct_profiles`),
    query(db, `SELECT trail_id, codigo FROM trail_cbos`),
    query(db, `SELECT trail_id, norma FROM trail_normas`),
    query(db, `SELECT child_id, parent_id, tipo, temas_chave FROM trail_dependencies`),
  ]);

  const idsByStep = groupBy(stepSourceRows, "step_id");
  const stepsByTrail = groupBy(stepRows, "trail_id");

  const escolaById = {};
  escolaRows.forEach((e) => { escolaById[e.id] = e; });
  const escolasByTrailStep = {};
  escolaLinkRows.forEach((l) => {
    const key = `${l.trail_id}|${l.step_ordem}`;
    (escolasByTrailStep[key] = escolasByTrailStep[key] || []).push({
      escola_id: l.escola_id,
      escola_nome: (escolaById[l.escola_id] || {}).nome || null,
      escola_tipo: (escolaById[l.escola_id] || {}).tipo || null,
      curso_nome: l.curso_nome,
      url: l.url_curso,
    });
  });

  const profilesByTrail = groupBy(profileRows, "trail_id");
  const cbosByTrail = groupBy(cboRows, "trail_id");
  const normasByTrail = groupBy(normaRows, "trail_id");

  const nameById = {};
  trailRows.forEach((t) => { nameById[t.id] = t.name; });
  const paiByChild = {};
  const filhasByParent = {};
  depRows.forEach((d) => {
    paiByChild[d.child_id] = { id: d.parent_id, name: nameById[d.parent_id] || d.parent_id, tipo: d.tipo, temas_chave: d.temas_chave };
    (filhasByParent[d.parent_id] = filhasByParent[d.parent_id] || []).push({ id: d.child_id, name: nameById[d.child_id] || d.child_id, tipo: d.tipo, temas_chave: d.temas_chave });
  });

  const baseName = (n) => n.replace(/\s*\([^)]*\)\s*$/, "").trim();
  const byBaseName = {};
  trailRows.forEach((t) => {
    const b = baseName(t.name);
    (byBaseName[b] = byBaseName[b] || []).push(t);
  });
  const variantesById = {};
  Object.values(byBaseName).forEach((group) => {
    if (group.length < 2) return;
    group.forEach((t) => {
      variantesById[t.id] = group.filter((o) => o.id !== t.id).map((o) => ({ id: o.id, name: o.name }));
    });
  });

  return trailRows.map((t) => ({
    id: t.id, icon: t.icon, name: t.name, cnct: t.cnct_label, color: t.color, description: t.description,
    nota_curadoria: t.descricao_geral || null,
    steps: (stepsByTrail[t.id] || []).map((s) => ({
      phase: s.phase, note: s.note, ordem: s.ordem,
      ids: (idsByStep[s.step_id] || []).map((x) => x.source_id),
      escolas: escolasByTrailStep[`${t.id}|${s.ordem}`] || [],
    })),
    cnct_profiles: (profilesByTrail[t.id] || []).map((p) => p.profile_id),
    cbos: (cbosByTrail[t.id] || []).map((c) => c.codigo),
    normas: (normasByTrail[t.id] || []).map((n) => n.norma),
    variantes: variantesById[t.id] || [],
    derivada_de: paiByChild[t.id] || null,
    derivadas: filhasByParent[t.id] || [],
  }));
}
