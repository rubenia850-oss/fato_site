// db.js — Sistema FATO · Sprint 13
// fato_v55.db é a fonte canônica do portal. sql.js (WASM), sem backend (D56).

// SP-02/D59: build padrão do sql.js NÃO inclui o módulo FTS5 (testado e confirmado).
// Usamos o fork `sql.js-fts5` (mesmo mantenedor sql-js, mesma API/loader, WASM com -DSQLITE_ENABLE_FTS5).
// ATUALIZAÇÃO (19/07/2026): auto-hospedado (era https://cdn.jsdelivr.net/npm/sql.js-fts5@1.4.0/dist/)
// — mesmo motivo do React/Babel/fonte (ver index.html): dependência de CDN externa impedia
// testar/renderizar o portal em ambiente de rede restrita. Arquivo idêntico, baixado via npm
// (sql.js-fts5@1.4.0), só a origem mudou.
const SQLJS_VENDOR = "./vendor/";
const DB_PATH = "./dados/fato_v237.db"; // Sincronizacao SITE x BANCO #10 (23/07): v193->v237 (fato_v237_reconciliado_db.txt -- extensao errada, e um .db SQLite de verdade, confirmado pelo cabecalho binario). 44 versoes de trabalho. Resolvidos de verdade: SP-46 (normas_fato FECHADO -- 80/265 com descricao real, 185 marcadas "conteudo pago" por decisao explicita do usuario de nao adquirir, fila zerada), SP-39 (redesign N:N implementado usando tabela ja existente sector_to_sector_codes, view vw_industry_sector_codes criada, ainda sem consumidor no portal), SP-51 (108/113 = 95,6% resolvido, so 5 casos genuinamente sem fonte publica achavel). Achado novo do BANCO, nao pedido: gap 90063 (32 linhas orfas em dm_rede_empresas_*, mesma familia do gap 90061, FK real adicionada -- SP-72). Sources: guia caiu 397->393 (mais 4 fontes de empresa-lixo ja conhecida, cascata do SP-60, floor rebaixado). SP-07 piorou proporcionalmente (10,2%->21,5% sem UF) -- nao e regressao de qualidade, e ~186 empresas novas promovidas de staging mais rapido que a pesquisa de UF deu conta. SP-70 (protocolo _LEIA_PRIMEIRO.md referenciando db_versions/gaps legadas) RECONFIRMADO ainda aberto, sem mudanca -- continua pedido formal de alta prioridade. Ver PEDIDOS_E_BUGS_PARA_BANCO.md e _BACKLOG.md pro detalhe de cada item.

let dbPromise = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Falha ao carregar ${src}`));
    document.head.appendChild(s);
  });
}

export function initDB(path = DB_PATH) {
  if (dbPromise) return dbPromise;
  dbPromise = loadScript(SQLJS_VENDOR + "sql-wasm.js")
    .then(() => window.initSqlJs({ locateFile: (f) => SQLJS_VENDOR + f }))
    .then((SQL) => fetch(path).then((r) => {
      if (!r.ok) throw new Error(`Não foi possível carregar ${path} (HTTP ${r.status})`);
      return r.arrayBuffer();
    }).then((buf) => new SQL.Database(new Uint8Array(buf))));
  return dbPromise;
}

// Executa uma query e retorna array de objetos {coluna: valor}
export function query(db, sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

// Atalho para uma única query escalar (ex.: COUNT(*))
export function scalar(db, sql, params = []) {
  const rows = query(db, sql, params);
  return rows.length ? Object.values(rows[0])[0] : null;
}
