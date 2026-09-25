"""
Sobe TODO um projeto (pasta inteira, recursivamente) pro GitHub via API REST,
sem precisar de `git` instalado. Feito pra rodar no Pydroid (Android).

Reaproveita o mesmo repositório 'fato_site' já criado — só complementa com
o resto dos arquivos do handoff (worker/, HANDOFF.md, resto do portal/, etc.)
que ainda não foram enviados.

ANTES DE RODAR:
1. `pip install requests` (no Pydroid: menu -> Pip -> digite "requests" -> Install)
2. Preencha TOKEN e PASTA_LOCAL abaixo.
3. IMPORTANTE: PASTA_LOCAL tem que ser a pasta que você descompactou do zip
   HANDOFF_fato_portal_completo.zip original (a que tem worker/, portal/,
   HANDOFF.md etc. dentro) — NÃO a fato_portal_SITE_SP75 (essa só tinha 3
   arquivos). Se não tiver certeza do caminho exato, rode primeiro só o
   bloco "SÓ CONFERIR" lá embaixo (veja instrução no final do arquivo).
"""

import base64
import os
import time
import requests

# ========== CONFIG — preencha aqui ==========
TOKEN = "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"            # github_pat_... ou ghp_...
REPO = "fato_site"                        # já existe, reaproveita
BRANCH = "main"

PASTA_LOCAL = "/storage/emulated/0/Download/fato_portal_SITE_SP75" # ajuste se necessário

# Pastas/arquivos que NUNCA devem subir (lixo/local/pesado demais)
IGNORAR_PASTAS = {".git", "__pycache__", "node_modules", ".DS_Store", ".idea", ".vscode"}
IGNORAR_ARQUIVOS = {".DS_Store", "Thumbs.db"}

# Tamanho máximo por arquivo que a API de Contents aceita bem (acima disso,
# a API do GitHub passa a exigir outro fluxo — não deve ser o caso aqui)
LIMITE_MB = 20
# ==============================================

API = "https://api.github.com"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}


def usuario_atual() -> str:
    resp = requests.get(f"{API}/user", headers=HEADERS)
    resp.raise_for_status()
    return resp.json()["login"]


def listar_arquivos(pasta_local: str):
    """Percorre a pasta inteira e devolve lista de (caminho_completo, caminho_relativo)."""
    resultado = []
    for raiz, pastas, arquivos in os.walk(pasta_local):
        pastas[:] = [p for p in pastas if p not in IGNORAR_PASTAS]
        for nome in arquivos:
            if nome in IGNORAR_ARQUIVOS:
                continue
            caminho_completo = os.path.join(raiz, nome)
            caminho_relativo = os.path.relpath(caminho_completo, pasta_local)
            caminho_relativo = caminho_relativo.replace(os.sep, "/")  # sempre "/" no GitHub
            resultado.append((caminho_completo, caminho_relativo))
    return resultado


def sha_atual(owner: str, caminho_no_repo: str):
    url = f"{API}/repos/{owner}/{REPO}/contents/{caminho_no_repo}"
    resp = requests.get(url, headers=HEADERS, params={"ref": BRANCH})
    if resp.status_code == 200:
        return resp.json()["sha"]
    if resp.status_code == 404:
        return None
    resp.raise_for_status()


def enviar_arquivo(owner: str, caminho_local: str, caminho_no_repo: str):
    tamanho_mb = os.path.getsize(caminho_local) / (1024 * 1024)
    if tamanho_mb > LIMITE_MB:
        print(f"  ✗ {caminho_no_repo} — pulado, arquivo grande demais ({tamanho_mb:.1f} MB)")
        return False

    with open(caminho_local, "rb") as f:
        conteudo_b64 = base64.b64encode(f.read()).decode("utf-8")

    sha = sha_atual(owner, caminho_no_repo)

    payload = {
        "message": f"Adiciona/atualiza {caminho_no_repo} (upload em massa)",
        "content": conteudo_b64,
        "branch": BRANCH,
    }
    if sha:
        payload["sha"] = sha

    url = f"{API}/repos/{owner}/{REPO}/contents/{caminho_no_repo}"
    resp = requests.put(url, headers=HEADERS, json=payload)

    if resp.status_code in (200, 201):
        acao = "atualizado" if sha else "criado"
        print(f"  ✓ {caminho_no_repo} — {acao}")
        return True
    else:
        print(f"  ✗ {caminho_no_repo} — falhou ({resp.status_code}): {resp.json().get('message')}")
        return False


def main():
    if not os.path.isdir(PASTA_LOCAL):
        print(f"✗ Pasta não encontrada: {PASTA_LOCAL}")
        print("  Confira o caminho certo antes de rodar de novo.")
        return

    owner = usuario_atual()
    arquivos = listar_arquivos(PASTA_LOCAL)

    if not arquivos:
        print(f"✗ Nenhum arquivo encontrado dentro de {PASTA_LOCAL}")
        return

    print(f"Usuário: {owner}")
    print(f"Repositório: {owner}/{REPO} (branch {BRANCH})")
    print(f"Pasta local: {PASTA_LOCAL}")
    print(f"{len(arquivos)} arquivo(s) encontrados. Enviando...\n")

    ok = 0
    for caminho_completo, caminho_relativo in arquivos:
        print(f"Enviando {caminho_relativo}")
        if enviar_arquivo(owner, caminho_completo, caminho_relativo):
            ok += 1
        time.sleep(0.3)  # evita bater no limite de requisições por segundo da API

    print(f"\n{ok}/{len(arquivos)} arquivos enviados.")
    print(f"Repositório: https://github.com/{owner}/{REPO}")


if __name__ == "__main__":
    main()

# ---------------------------------------------------------------------------
# SÓ CONFERIR: se quiser só ver a lista de arquivos que SERIAM enviados, sem
# enviar nada de verdade, comente a linha "main()" no if __name__ acima e
# descomente as 3 linhas abaixo:
#
# arquivos = listar_arquivos(PASTA_LOCAL)
# for _, rel in arquivos:
#     print(rel)
