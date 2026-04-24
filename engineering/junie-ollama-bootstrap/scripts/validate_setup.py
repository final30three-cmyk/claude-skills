#!/usr/bin/env python3
"""
Junie + Ollama Bootstrap Validator

Checks that the environment is correctly wired:
  1. Required env vars are set
  2. Ollama endpoint is reachable
  3. Configured model is available locally
  4. OpenAI-compatible completions endpoint responds

Usage:
    python3 scripts/validate_setup.py
    python3 scripts/validate_setup.py --json   # machine-readable output
"""

import json
import os
import sys
import urllib.error
import urllib.request

REQUIRED_VARS = {
    "JUNIE_LLM_PROVIDER": "custom",
    "JUNIE_CUSTOM_ENDPOINT": None,  # any non-empty value
    "JUNIE_MODEL": None,
}

OPTIONAL_VARS = {
    "JUNIE_TEMPERATURE": "0.2",
    "JUNIE_MAX_TOKENS": "2048",
    "JUNIE_SYSTEM_PROMPT": None,
}


def check_env_vars():
    """Verify required and optional environment variables."""
    results = []

    for var, expected in REQUIRED_VARS.items():
        value = os.environ.get(var, "")
        if not value:
            results.append({"check": f"env:{var}", "status": "FAIL", "detail": "not set"})
        elif expected and value != expected:
            results.append({
                "check": f"env:{var}",
                "status": "WARN",
                "detail": f"expected '{expected}', got '{value}'",
            })
        else:
            results.append({"check": f"env:{var}", "status": "OK", "detail": value})

    for var, default in OPTIONAL_VARS.items():
        value = os.environ.get(var, "")
        if not value:
            results.append({
                "check": f"env:{var}",
                "status": "SKIP",
                "detail": f"not set (default: {default})",
            })
        else:
            results.append({"check": f"env:{var}", "status": "OK", "detail": value})

    return results


def check_ollama_reachable(endpoint):
    """Ping the Ollama /api/tags endpoint."""
    # Derive base URL (strip /v1 suffix if present)
    base = endpoint.rstrip("/")
    if base.endswith("/v1"):
        base = base[:-3]

    tags_url = f"{base}/api/tags"
    try:
        req = urllib.request.Request(tags_url, method="GET")
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read())
            models = [m["name"] for m in data.get("models", [])]
            return {"check": "ollama:reachable", "status": "OK", "detail": f"{len(models)} model(s) available"}
    except urllib.error.URLError as exc:
        return {"check": "ollama:reachable", "status": "FAIL", "detail": str(exc.reason)}
    except Exception as exc:
        return {"check": "ollama:reachable", "status": "FAIL", "detail": str(exc)}


def check_model_available(endpoint, model):
    """Verify the configured model exists in the local Ollama registry."""
    base = endpoint.rstrip("/")
    if base.endswith("/v1"):
        base = base[:-3]

    tags_url = f"{base}/api/tags"
    try:
        req = urllib.request.Request(tags_url, method="GET")
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read())
            available = [m["name"] for m in data.get("models", [])]

            # Ollama model names can be "llama3:8b" or "llama3:8b-instruct-q4_0"
            # Check if the configured model matches any available model prefix
            matched = any(m == model or m.startswith(f"{model}-") for m in available)

            if matched:
                return {"check": f"model:{model}", "status": "OK", "detail": "found in local registry"}
            else:
                return {
                    "check": f"model:{model}",
                    "status": "FAIL",
                    "detail": f"not found. Available: {', '.join(available) or '(none)'}. Run: ollama pull {model}",
                }
    except Exception:
        return {"check": f"model:{model}", "status": "SKIP", "detail": "could not query Ollama (offline?)"}


def check_completions_endpoint(endpoint, model):
    """Send a minimal completions request to verify the OpenAI-compat API works."""
    url = f"{endpoint.rstrip('/')}/chat/completions"
    payload = json.dumps({
        "model": model,
        "messages": [{"role": "user", "content": "Say OK"}],
        "max_tokens": 8,
        "temperature": 0.0,
    }).encode("utf-8")

    try:
        req = urllib.request.Request(url, data=payload, method="POST")
        req.add_header("Content-Type", "application/json")
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            return {"check": "completions:api", "status": "OK", "detail": f"response: {content[:60]}"}
    except urllib.error.URLError as exc:
        return {"check": "completions:api", "status": "FAIL", "detail": str(exc.reason)}
    except Exception as exc:
        return {"check": "completions:api", "status": "FAIL", "detail": str(exc)}


def main():
    as_json = "--json" in sys.argv
    results = []

    # 1. Environment variables
    results.extend(check_env_vars())

    endpoint = os.environ.get("JUNIE_CUSTOM_ENDPOINT", "http://127.0.0.1:11434/v1")
    model = os.environ.get("JUNIE_MODEL", "llama3:8b")

    # 2. Ollama reachable
    results.append(check_ollama_reachable(endpoint))

    # 3. Model available
    results.append(check_model_available(endpoint, model))

    # 4. Completions endpoint (only if Ollama is reachable)
    ollama_ok = any(r["check"] == "ollama:reachable" and r["status"] == "OK" for r in results)
    if ollama_ok:
        results.append(check_completions_endpoint(endpoint, model))
    else:
        results.append({"check": "completions:api", "status": "SKIP", "detail": "Ollama not reachable"})

    # Output
    if as_json:
        print(json.dumps(results, indent=2))
    else:
        print("\n  Junie + Ollama Setup Validation")
        print("  " + "=" * 42)
        fail_count = 0
        for r in results:
            icon = {"OK": "+", "FAIL": "X", "WARN": "!", "SKIP": "-"}.get(r["status"], "?")
            print(f"  [{icon}] {r['check']}: {r['detail']}")
            if r["status"] == "FAIL":
                fail_count += 1
        print()

        if fail_count == 0:
            print("  All checks passed. You are good to go.")
        else:
            print(f"  {fail_count} check(s) failed. Review the output above.")
        print()

    sys.exit(1 if any(r["status"] == "FAIL" for r in results) else 0)


if __name__ == "__main__":
    main()
