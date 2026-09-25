"""
Cria um repositório novo no GitHub (se ainda não existir) e sobe/atualiza
arquivos nele via API REST — sem precisar de `git` instalado.
Feito pra rodar no Pydroid (Android).

ANTES DE RODAR:
1. `pip install requests` (no Pydroid: menu -> Pip -> digite "requests" -> Install)
2. Preencha as variáveis no bloco CONFIG abaixo.
3. Confira o mapa ARQUIVOS no final: caminho local (no seu celular) -> caminho no repo.
"""

import base64
import os
import requests

# ========== CONFIG — preencha aqui ==========
TOKEN = "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"           # github_pat_...  (nunca compartilhe isso com ninguém)
REPO = "fato_site"         # nome do repositório a criar, ex: "fato-portal-site"
DESCRICAO = "Full control of private repositories"                          # descrição opcional do repositório
PRIVADO = True                          # True = privado, False = público
BRANCH = "main"

# Pasta onde você descompactou o zip no celular. Exemplos comuns no Android:
#   "/storage/emulated/0/Download/final_handoff"
#   "/sdcard/Download/final_handoff"
PASTA_LOCAL = "/storage/emulated/0/Download/fato_portal_SITE_SP75"

# Mapa: caminho relativo dentro de PASTA_LOCAL -> caminho no repositório
ARQUIVOS = {
    "_BACKLOG.md": "_BACKLOG.md",
    "portal/index.html": "portal/index.html",
    "portal/App.jsx": "portal/App.jsx",
}
# ==============================================

API = "https://api.github.com"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}


def usuario_atual() -> str:
    """Descobre o dono (seu usuário) a partir do próprio token."""
    resp = requests.get(f"{API}/user", headers=HEADERS)
    resp.raise_for_status()
    return resp.json()["login"]


def repo_existe(owner: str) -> bool:
    resp = requests.get(f"{API}/repos/{owner}/{REPO}", headers=HEADERS)
    if resp.status_code == 200:
        return True
    if resp.status_code == 404:
        return False
    resp.raise_for_status()


def criar_repo():
    payload = {
        "name": REPO,
        "description": DESCRICAO,
        "private": PRIVADO,
        "auto_init": True,  # já cria com um commit inicial (README) — deixa o branch "main" existir
    }
    resp = requests.post(f"{API}/user/repos", headers=HEADERS, json=payload)
    if resp.status_code == 201:
        print(f"✓ Repositório '{REPO}' criado com sucesso ({'privado' if PRIVADO else 'público'}).")
    else:
        resp.raise_for_status()


def sha_atual(owner: str, caminho_no_repo: str):
    """Busca o SHA do arquivo que já existe no repo (necessário pra atualizar).
    Retorna None se o arquivo ainda não existir lá (aí ele será criado)."""
    url = f"{API}/repos/{owner}/{REPO}/contents/{caminho_no_repo}"
    resp = requests.get(url, headers=HEADERS, params={"ref": BRANCH})
    if resp.status_code == 200:
        return resp.json()["sha"]
    if resp.status_code == 404:
        return None
    resp.raise_for_status()


def enviar_arquivo(owner: str, caminho_local: str, caminho_no_repo: str):
    if not os.path.isfile(caminho_local):
        print(f"  ✗ não encontrei o arquivo local: {caminho_local}")
        return False

    with open(caminho_local, "rb") as f:
        conteudo_b64 = base64.b64encode(f.read()).decode("utf-8")

    sha = sha_atual(owner, caminho_no_repo)

    payload = {
        "message": f"Adiciona/atualiza {caminho_no_repo} (via script Python)",
        "content": conteudo_b64,
        "branch": BRANCH,
    }
    if sha:
        payload["sha"] = sha  # obrigatório quando o arquivo já existe

    url = f"{API}/repos/{owner}/{REPO}/contents/{caminho_no_repo}"
    resp = requests.put(url, headers=HEADERS, json=payload)

    if resp.status_code in (200, 201):
        acao = "atualizado" if sha else "criado"
        print(f"  ✓ {caminho_no_repo} — {acao} com sucesso")
        return True
    else:
        print(f"  ✗ {caminho_no_repo} — falhou ({resp.status_code}): {resp.json().get('message')}")
        return False


def main():
    owner = usuario_atual()
    print(f"Usuário: {owner}")

    if repo_existe(owner):
        print(f"Repositório '{REPO}' já existe — só vou enviar os arquivos.\n")
    else:
        print(f"Repositório '{REPO}' não existe ainda — criando...")
        criar_repo()
        print()

    ok = 0
    for local, remoto in ARQUIVOS.items():
        caminho_completo = os.path.join(PASTA_LOCAL, local)
        print(f"Enviando {local} -> {remoto}")
        if enviar_arquivo(owner, caminho_completo, remoto):
            ok += 1

    print(f"\n{ok}/{len(ARQUIVOS)} arquivos enviados.")
    print(f"Repositório: https://github.com/{owner}/{REPO}")


if __name__ == "__main__":
    main()
