// utils/progress.js — progresso local por trilha (Fase 1 do relatório: sem login,
// via localStorage). Sprint UX 25/09/2026 (Relatório Técnico Final IndústriaEDU, seção 6).
const KEY_PREFIX = "industriaedu:progress:";

function readTrail(trailId) {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + trailId);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeTrail(trailId, data) {
  try {
    localStorage.setItem(KEY_PREFIX + trailId, JSON.stringify(data));
  } catch {
    // localStorage indisponível (modo privado, quota etc.) — progresso simplesmente não persiste
  }
}

export function isStepDone(trailId, stepIndex) {
  return !!readTrail(trailId)[stepIndex];
}

export function toggleStep(trailId, stepIndex) {
  const data = readTrail(trailId);
  data[stepIndex] = !data[stepIndex];
  writeTrail(trailId, data);
}

export function trailProgress(trailId, totalSteps) {
  if (!totalSteps) return { done: 0, total: 0, pct: 0 };
  const data = readTrail(trailId);
  const done = Object.values(data).filter(Boolean).length;
  return { done, total: totalSteps, pct: Math.round((done / totalSteps) * 100) };
}
