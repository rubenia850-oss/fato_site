"""
Deploy automático do Worker + D1 pra Cloudflare — sem CLI, sem dashboard manual.

COMO USAR
---------
1. Preencha os 4 valores na seção "PREENCHA AQUI" logo abaixo.
2. Coloque ESTE ARQUIVO dentro da pasta "worker" que veio no zip
   (no mesmo nível de wrangler.toml, ao lado das pastas "src" e "d1").
   A estrutura deve ficar assim:

       worker/
       ├── deploy.py        <- este arquivo, colocado aqui
       ├── wrangler.toml
       ├── src/
       │   ├── index.js
       │   └── ...
       └── d1/
           ├── schema.sql
           └── data.sql

3. Instale a biblioteca "requests" uma vez (no Pydroid 3: menu Pip -> requests
   -> Install; no terminal normal: pip install requests).
4. Rode o script (botão Play no Pydroid, ou "python deploy.py" no terminal).

ONDE CONSEGUIR API_TOKEN e ACCOUNT_ID
--------------------------------------
- API_TOKEN: dash.cloudflare.com -> ícone da sua conta (canto superior direito)
  -> "My Profile" -> aba "API Tokens" -> "Create Token" -> use o template
  "Edit Cloudflare Workers" -> Continue -> Create Token -> copie o token
  (ele só aparece uma vez, guarde em lugar seguro).
- ACCOUNT_ID: na página inicial do dashboard (ou em Workers & Pages),
  aparece na barra lateral direita como "Account ID".

O QUE O SCRIPT FAZ
-------------------
1. Cria o banco D1 (ou reaproveita se já existir com esse nome).
2. Carrega o schema.sql (estrutura das 85 tabelas).
3. Carrega o data.sql (dados reais, ~4MB — carregado em lotes, pode demorar
   alguns minutos, é normal).
4. Publica o Worker com os 9 arquivos de código, já conectado ao banco D1.
5. Ativa a URL pública (*.workers.dev) e mostra o link final pra testar.

Se algum passo falhar, o script para e mostra exatamente qual passo e o
erro devolvido pela Cloudflare — copie essa mensagem e leve de volta pra
conversa, é fácil de ajustar a partir do erro exato.
"""

import hashlib
import json
import re
import sys
import time
from pathlib import Path

try:
    import requests
except ImportError:
    print("Falta instalar a biblioteca 'requests'. No Pydroid 3: menu Pip -> requests -> Install.")
    sys.exit(1)

# ========================= PREENCHA AQUI =========================
API_TOKEN = "COLE_SEU_TOKEN_AQUI"
ACCOUNT_ID = "COLE_SEU_ACCOUNT_ID_AQUI"
DB_NAME = "fato-portal-db"
WORKER_NAME = "fato-portal-api"
# ===================================================================

BASE = "https://api.cloudflare.com/client/v4"
HEADERS = {"Authorization": f"Bearer {API_TOKEN}"}

HERE = Path(__file__).resolve().parent
SRC_DIR = HERE / "src"
D1_DIR = HERE / "d1"


def check(resp, step):
    try:
        data = resp.json()
    except Exception:
        print(f"❌ Falhou em: {step} (resposta não era JSON, status {resp.status_code})")
        print(resp.text[:2000])
        sys.exit(1)
    if not data.get("success"):
        print(f"❌ Falhou em: {step}")
        print(json.dumps(data.get("errors"), indent=2, ensure_ascii=False))
        sys.exit(1)
    print(f"✅ {step}")
    return data["result"]


def get_or_create_d1():
    r = requests.get(
        f"{BASE}/accounts/{ACCOUNT_ID}/d1/database",
        headers=HEADERS,
        params={"name": DB_NAME},
        timeout=60,
    )
    existing = check(r, "Verificar se o banco D1 já existe")
    for db in existing:
        if db["name"] == DB_NAME:
            print(f"   (banco '{DB_NAME}' já existia, reaproveitando)")
            return db["uuid"]
    r = requests.post(
        f"{BASE}/accounts/{ACCOUNT_ID}/d1/database",
        headers=HEADERS,
        json={"name": DB_NAME},
        timeout=60,
    )
    result = check(r, f"Criar banco D1 '{DB_NAME}'")
    return result["uuid"]


def bulk_import(db_id, path, label, timeout_polls=180, poll_interval=5):
    """Upload an entire .sql file and let D1 process it server-side via the
    bulk import API (init -> upload -> ingest -> poll). This sidesteps every
    client-side limit we hit before (statement length, bound-parameter
    count): the whole file is handled by Cloudflare, not sent statement by
    statement."""
    if not path.exists():
        print(f"❌ Não encontrei {path} — confira se o deploy.py está na pasta 'worker' certa.")
        sys.exit(1)
    text = path.read_text(encoding="utf-8")
    # Make CREATE TABLE/VIEW idempotent so re-running against a database
    # that already has the schema (e.g. a retried/reused DB) never errors.
    text = re.sub(r"(?i)^CREATE\s+TABLE\s+(?!IF\s+NOT\s+EXISTS)", "CREATE TABLE IF NOT EXISTS ", text, flags=re.MULTILINE)
    text = re.sub(r"(?i)^CREATE\s+VIEW\s+(?!IF\s+NOT\s+EXISTS)", "CREATE VIEW IF NOT EXISTS ", text, flags=re.MULTILINE)
    content = text.encode("utf-8")
    etag = hashlib.md5(content).hexdigest()

    r = requests.post(
        f"{BASE}/accounts/{ACCOUNT_ID}/d1/database/{db_id}/import",
        headers=HEADERS, json={"action": "init", "etag": etag}, timeout=60,
    )
    result = check(r, f"{label}: iniciar upload")
    upload_url = result.get("upload_url")
    filename = result.get("filename")

    if upload_url:
        r2 = requests.put(upload_url, data=content, timeout=300)
        if r2.status_code not in (200, 201, 204):
            print(f"❌ Falhou ao enviar o arquivo ({label}): HTTP {r2.status_code}")
            print(r2.text[:1000])
            sys.exit(1)
        print(f"✅ {label}: arquivo enviado ({len(content)/1024:.0f} KB)")
    else:
        print(f"   ({label}: Cloudflare já tinha uma cópia idêntica, pulando upload)")

    r = requests.post(
        f"{BASE}/accounts/{ACCOUNT_ID}/d1/database/{db_id}/import",
        headers=HEADERS,
        json={"action": "ingest", "etag": etag, "filename": filename},
        timeout=60,
    )
    result = check(r, f"{label}: iniciar processamento no servidor")
    bookmark = result.get("at_bookmark") or result.get("bookmark")

    print(f"   {label}: processando", end="", flush=True)
    for _ in range(timeout_polls):
        time.sleep(poll_interval)
        r = requests.post(
            f"{BASE}/accounts/{ACCOUNT_ID}/d1/database/{db_id}/import",
            headers=HEADERS,
            json={"action": "poll", "current_bookmark": bookmark},
            timeout=60,
        )
        try:
            data = r.json()
        except Exception:
            print()
            print(f"❌ Falhou em: {label} (poll) — resposta inesperada, status {r.status_code}")
            print(r.text[:1000])
            sys.exit(1)
        if not data.get("success"):
            print()
            print(f"❌ Falhou em: {label} (poll)")
            print(json.dumps(data.get("errors"), indent=2, ensure_ascii=False))
            sys.exit(1)
        result = data.get("result") or {}
        status = result.get("status")
        print()
        print(f"   [debug] resposta do poll: {json.dumps(result, ensure_ascii=False)}")
        err = result.get("error")
        # Per Cloudflare's own docs/tutorial, "Not currently importing
        # anything." from a poll means the job already finished and was
        # cleared — treat it as success, not failure.
        if status == "complete" or result.get("success") is True or err == "Not currently importing anything.":
            print(f" {label}: concluído!")
            return
        if status == "error" or result.get("success") is False:
            print(f"❌ {label}: erro no processamento — {err or result}")
            sys.exit(1)
        print(f"   {label}: ainda processando, aguardando mais {poll_interval}s...", end="", flush=True)
    print()
    print(f"❌ {label}: tempo esgotado aguardando o servidor terminar de processar.")
    sys.exit(1)



def split_value_tuples(values_str):
    """Split '(a,b),\n(c,d);' into ['(a,b)', '(c,d)'], respecting quotes/parens."""
    tuples = []
    depth = 0
    in_quote = False
    current = []
    i = 0
    n = len(values_str)
    while i < n:
        ch = values_str[i]
        if in_quote:
            current.append(ch)
            if ch == "'":
                if i + 1 < n and values_str[i + 1] == "'":
                    current.append(values_str[i + 1])
                    i += 1
                else:
                    in_quote = False
        else:
            if ch == "'":
                in_quote = True
                current.append(ch)
            elif ch == "(":
                depth += 1
                current.append(ch)
            elif ch == ")":
                depth -= 1
                current.append(ch)
                if depth == 0:
                    tuples.append("".join(current))
                    current = []
            elif depth > 0:
                current.append(ch)
        i += 1
    return tuples


def split_top_level_commas(s):
    parts = []
    current = []
    in_quote = False
    i, n = 0, len(s)
    while i < n:
        ch = s[i]
        if in_quote:
            current.append(ch)
            if ch == "'":
                if i + 1 < n and s[i + 1] == "'":
                    current.append(s[i + 1])
                    i += 1
                else:
                    in_quote = False
        else:
            if ch == "'":
                in_quote = True
                current.append(ch)
            elif ch == ",":
                parts.append("".join(current))
                current = []
            else:
                current.append(ch)
        i += 1
    parts.append("".join(current))
    return parts


def parse_sql_literal(v):
    v = v.strip()
    if v.upper() == "NULL":
        return None
    if v.startswith("'") and v.endswith("'") and len(v) >= 2:
        return v[1:-1].replace("''", "'")
    try:
        if "." in v or "e" in v.lower():
            return float(v)
        return int(v)
    except ValueError:
        return v


def send_sql(db_id, sql, label, params=None):
    body = {"sql": sql}
    if params is not None:
        body["params"] = params
    r = requests.post(
        f"{BASE}/accounts/{ACCOUNT_ID}/d1/database/{db_id}/query",
        headers=HEADERS,
        json=body,
        timeout=120,
    )
    check(r, label)


CHECKPOINT_FILE = HERE / "deploy_checkpoint.json"


def load_checkpoint():
    if CHECKPOINT_FILE.exists():
        try:
            return json.loads(CHECKPOINT_FILE.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def save_checkpoint(data):
    CHECKPOINT_FILE.write_text(json.dumps(data), encoding="utf-8")


def load_data_sql(db_id, path, label, max_params_per_batch=80, max_batch_bytes=300_000):
    """Load a data.sql file of INSERT statements using parameterized queries
    (?, so huge text fields never hit D1's statement-length limit), batched
    by total bound-parameter count (D1 caps this around ~100 per query) and
    by byte size. Progress is checkpointed so a rerun skips finished
    statements; INSERT OR IGNORE makes a resent statement safe either way."""
    if not path.exists():
        print(f"❌ Não encontrei {path} — confira se o deploy.py está na pasta 'worker' certa.")
        sys.exit(1)
    sql = path.read_text(encoding="utf-8")
    statements = [s.strip() for s in re.split(r";\s*\n", sql) if s.strip()]
    total = len(statements)

    insert_re = re.compile(r"^(INSERT\s+INTO\s+.+?)\bVALUES\b\s*(.*)$", re.IGNORECASE | re.DOTALL)

    checkpoint = load_checkpoint()
    done = checkpoint.get("data", 0)
    if done:
        print(f"↷ Retomando '{label}' do checkpoint: pulando statements 1-{done}/{total} (já concluídos antes)")

    for idx, stmt in enumerate(statements, start=1):
        if idx <= done:
            continue
        progress = f"{label}: statement {idx}/{total}"

        m = insert_re.match(stmt)
        if not m:
            send_sql(db_id, stmt + ";", progress)
        else:
            head = re.sub(r"^INSERT\s+INTO", "INSERT OR IGNORE INTO", m.group(1), flags=re.IGNORECASE).strip()
            values_part = m.group(2)
            tuples = split_value_tuples(values_part)

            rows = []
            for t in tuples:
                inner = t[1:-1] if t.startswith("(") and t.endswith(")") else t
                rows.append([parse_sql_literal(v) for v in split_top_level_commas(inner)])

            batch, batch_params, batch_bytes = [], [], 0
            batch_no = 1

            def flush(batch, batch_params, batch_no):
                if not batch:
                    return
                placeholders = ",".join("(" + ",".join(["?"] * len(row)) + ")" for row in batch)
                sql_text = f"{head} VALUES {placeholders};"
                send_sql(db_id, sql_text, f"{progress} (lote {batch_no})", params=batch_params)

            for row in rows:
                ncols = len(row)
                row_bytes = sum(len(str(v)) for v in row) + 20
                would_be_params = len(batch_params) + ncols
                if batch and (would_be_params > max_params_per_batch or batch_bytes + row_bytes > max_batch_bytes):
                    flush(batch, batch_params, batch_no)
                    batch_no += 1
                    batch, batch_params, batch_bytes = [], [], 0
                batch.append(row)
                batch_params.extend(row)
                batch_bytes += row_bytes
            flush(batch, batch_params, batch_no)

        checkpoint["data"] = idx
        save_checkpoint(checkpoint)


def deploy_worker(db_id):
    modules = sorted(SRC_DIR.glob("*.js"))
    if not modules:
        print("❌ Não encontrei os arquivos .js em ./src — confira o caminho da pasta.")
        sys.exit(1)

    metadata = {
        "main_module": "index.js",
        "compatibility_date": "2026-07-01",
        "bindings": [{"type": "d1", "name": "DB", "id": db_id}],
    }

    files = {"metadata": (None, json.dumps(metadata), "application/json")}
    for mod in modules:
        files[mod.name] = (mod.name, mod.read_text(encoding="utf-8"), "application/javascript+module")

    r = requests.put(
        f"{BASE}/accounts/{ACCOUNT_ID}/workers/scripts/{WORKER_NAME}",
        headers=HEADERS,
        files=files,
        timeout=120,
    )
    check(r, f"Publicar Worker '{WORKER_NAME}' ({len(modules)} arquivos)")


def enable_public_url():
    r = requests.post(
        f"{BASE}/accounts/{ACCOUNT_ID}/workers/scripts/{WORKER_NAME}/subdomain",
        headers=HEADERS,
        json={"enabled": True},
        timeout=60,
    )
    check(r, "Ativar URL pública (*.workers.dev)")

    r = requests.get(f"{BASE}/accounts/{ACCOUNT_ID}/workers/subdomain", headers=HEADERS, timeout=60)
    sub = check(r, "Buscar subdomínio da conta")
    return f"https://{WORKER_NAME}.{sub['subdomain']}.workers.dev"


def main():
    if "COLE_" in API_TOKEN or "COLE_" in ACCOUNT_ID:
        print("⚠️  Preencha API_TOKEN e ACCOUNT_ID no topo do script antes de rodar.")
        sys.exit(1)

    print("== 1/4: Banco D1 ==")
    db_id = get_or_create_d1()

    print("\n== 2/4: Schema (85 tabelas + views) ==")
    bulk_import(db_id, D1_DIR / "schema.sql", "Schema")

    print("\n== 3/4: Dados (~4MB) ==")
    t0 = time.time()
    load_data_sql(db_id, D1_DIR / "data.sql", "Dados")
    print(f"   (levou {time.time() - t0:.0f}s)")

    print("\n== 4/4: Worker + URL pública ==")
    deploy_worker(db_id)
    url = enable_public_url()

    print("\n🎉 Pronto! Teste no navegador ou colando o link no chat:")
    print(f"   {url}/api/trilhas")
    print(f"   {url}/api/panorama-uf")


if __name__ == "__main__":
    main()
