// apiClient.js — substitui db.js/sql.js: o navegador não baixa mais o banco inteiro,
// só pede o JSON já pronto de cada endpoint do Worker (ver worker/README.md).

export const API_BASE = "https://fato-portal-api.rubenia850.workers.dev";
// TODO: atualizar aqui quando o subdomínio workers.dev for renomeado (tira seu nome da URL).

export async function getJSON(path) {
  const r = await fetch(API_BASE + path);
  if (!r.ok) {
    const body = await r.text().catch(() => "");
    throw new Error(`Falha ao buscar ${path} (HTTP ${r.status}) ${body}`);
  }
  return r.json();
}
