// data/loadLazy.js — versões via API de loadSectors/loadGuia (antes em loadSectorsGuia.js,
// rodando SQL local sob demanda). Continuam lazy: só chamadas quando a aba correspondente abre
// (ver App.jsx ensureSectorsLoaded/ensureGuiaLoaded).
import { getJSON } from "../apiClient.js";

export function loadSectors() {
  return getJSON("/api/sectors");
}

export function loadGuia() {
  return getJSON("/api/guia");
}
