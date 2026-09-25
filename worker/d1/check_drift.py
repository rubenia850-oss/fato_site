#!/usr/bin/env python3
"""
check_drift.py — Regra 1 da sessão MIGRAÇÃO (ver PROTOCOLO_BANCO_SITE_MIGRACAO.md).

Compara o manifest.json (schema hash + contagem de linhas na última exportação pro D1)
contra o .db de produção que o BANCO está entregando agora. Não confia em número de
versão no nome do arquivo nem em changelog em prosa — confere o schema de verdade,
tabela por tabela, das 85 que o site inteiro usa (28 já no worker + 57 pendentes).

Uso:
    python3 check_drift.py /caminho/pro/fato_vNNN_novo.db

Saída: 3 listas —
  1. MUDOU DE VERDADE (schema_hash diferente) — a query em loadX.js pode ter quebrado,
     reexportar e testar antes de qualquer outra coisa.
  2. SÓ CRESCEU (mesmo schema, linhas a mais) — normal, mas indica que os dados no D1
     estão desatualizados (staleness), não um bug — reexportar quando o produto exigir
     que o D1 reflita o dado novo.
  3. TABELA SUMIU (existia no manifest, não existe mais no .db novo) — sinal grave,
     investigar antes de fazer qualquer coisa (Regra 3 do protocolo).
"""
import sqlite3
import json
import hashlib
import sys
from pathlib import Path

def schema_hash(cur, name):
    cur.execute("SELECT sql FROM sqlite_master WHERE name=?", (name,))
    row = cur.fetchone()
    if not row or not row[0]:
        return None
    return hashlib.sha256(row[0].encode()).hexdigest()[:16]

def row_count(cur, name):
    try:
        cur.execute(f"SELECT COUNT(*) FROM {name}")
        return cur.fetchone()[0]
    except Exception:
        return None

def main():
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)

    db_path = sys.argv[1]
    manifest_path = Path(__file__).parent / "manifest.json"

    with open(manifest_path) as f:
        manifest = json.load(f)

    con = sqlite3.connect(db_path)
    cur = con.cursor()

    print(f"Comparando {manifest_path.name} (origem: {manifest['banco_version_origem']}) contra {db_path}\n")

    mudou_schema = []
    so_cresceu = []
    sumiu = []
    novo_ok = []

    todas = {**manifest["tabelas_no_worker_hoje"], **manifest["tabelas_pendentes_de_portar"]}

    for nome, info in todas.items():
        novo_hash = schema_hash(cur, nome)
        novo_count = row_count(cur, nome)
        antigo_hash = info.get("schema_hash")
        antigo_count = info.get("linhas_na_exportacao")

        if novo_hash is None:
            sumiu.append(nome)
        elif novo_hash != antigo_hash:
            mudou_schema.append((nome, antigo_count, novo_count))
        elif novo_count != antigo_count:
            so_cresceu.append((nome, antigo_count, novo_count))
        else:
            novo_ok.append(nome)

    print(f"✅ Sem mudança ({len(novo_ok)} tabelas): schema e contagem idênticos ao manifest.")
    print()

    if so_cresceu:
        print(f"📈 SÓ CRESCEU/MUDOU CONTAGEM, schema igual ({len(so_cresceu)} tabelas) — normal, D1 desatualizado nelas:")
        for nome, antigo, novo in so_cresceu:
            delta = "?" if antigo is None or novo is None else novo - antigo
            print(f"   {nome:40s} {antigo} → {novo}  (Δ {delta})")
        print()

    if mudou_schema:
        print(f"⚠️  MUDOU DE VERDADE — schema diferente ({len(mudou_schema)} tabelas), checar queries em loadX.js:")
        for nome, antigo, novo in mudou_schema:
            print(f"   {nome:40s} linhas: {antigo} → {novo}  [SCHEMA MUDOU]")
        print()

    if sumiu:
        print(f"🚨 TABELA SUMIU do .db novo ({len(sumiu)}) — investigar antes de qualquer coisa:")
        for nome in sumiu:
            print(f"   {nome}")
        print()

    if not mudou_schema and not sumiu:
        print("Nenhuma mudança estrutural. Reexportar só se quiser atualizar dado (linhas cresceram) — não é obrigatório pra manter o site funcionando.")
    else:
        print("Mudança estrutural detectada — ver Regra 3 do PROTOCOLO_BANCO_SITE_MIGRACAO.md antes de reexportar.")

if __name__ == "__main__":
    main()
