#!/usr/bin/env bash
# ============================================================
# Junie + Ollama Bootstrap (Bash)
# One-shot environment setup + callable task shortcuts
#
# Usage: source scripts/bootstrap.sh
# ============================================================

set -euo pipefail

echo "--- Junie + Ollama Bootstrap ---"

# --------------------------------------------------
# 1. Set environment variables for the current session
# --------------------------------------------------

export JUNIE_LLM_PROVIDER="custom"
export JUNIE_CUSTOM_ENDPOINT="http://127.0.0.1:11434/v1"
export JUNIE_MODEL="llama3:8b"
export JUNIE_TEMPERATURE="0.2"
export JUNIE_MAX_TOKENS="2048"
export JUNIE_SYSTEM_PROMPT="You are a precise coding and systems assistant. Prefer concise, correct, runnable outputs."

echo "[OK] Environment variables set for current session."

# --------------------------------------------------
# 2. Persist to shell profile
# --------------------------------------------------

MARKER="# --- Junie/Ollama Bootstrap ---"
END_MARKER="# --- End Junie/Ollama Bootstrap ---"

# Detect the right profile file
if [ -n "${ZSH_VERSION:-}" ]; then
    PROFILE_FILE="${HOME}/.zshrc"
elif [ -n "${BASH_VERSION:-}" ]; then
    PROFILE_FILE="${HOME}/.bashrc"
else
    PROFILE_FILE="${HOME}/.profile"
fi

if grep -qF "$MARKER" "$PROFILE_FILE" 2>/dev/null; then
    echo "[SKIP] Profile already contains Junie bootstrap block: $PROFILE_FILE"
else
    cat >> "$PROFILE_FILE" << 'BOOTSTRAP_BLOCK'

# --- Junie/Ollama Bootstrap ---
export JUNIE_LLM_PROVIDER="custom"
export JUNIE_CUSTOM_ENDPOINT="http://127.0.0.1:11434/v1"
export JUNIE_MODEL="llama3:8b"
export JUNIE_TEMPERATURE="0.2"
export JUNIE_MAX_TOKENS="2048"
export JUNIE_SYSTEM_PROMPT="You are a precise coding and systems assistant. Prefer concise, correct, runnable outputs."

# Junie task shortcuts
ai-code()     { junie "Write clean, production-ready code for: $1. Include comments and usage example."; }
ai-debug()    { junie "Diagnose and fix this issue. Provide root cause and corrected code: $1"; }
ai-explain()  { junie "Explain clearly with examples: $1"; }
ai-optimize() { junie "Optimize this code for performance and readability. Return improved version only: $1"; }
ai-ac()       { junie "This is for Assetto Corsa (Content Manager + CSP). Provide practical implementation steps: $1"; }
# --- End Junie/Ollama Bootstrap ---
BOOTSTRAP_BLOCK

    echo "[OK] Appended env vars + shortcuts to: $PROFILE_FILE"
fi

# --------------------------------------------------
# 3. Define callable task shortcuts for current session
# --------------------------------------------------

ai-code()     { junie "Write clean, production-ready code for: $1. Include comments and usage example."; }
ai-debug()    { junie "Diagnose and fix this issue. Provide root cause and corrected code: $1"; }
ai-explain()  { junie "Explain clearly with examples: $1"; }
ai-optimize() { junie "Optimize this code for performance and readability. Return improved version only: $1"; }
ai-ac()       { junie "This is for Assetto Corsa (Content Manager + CSP). Provide practical implementation steps: $1"; }

echo "[OK] Shortcuts registered: ai-code, ai-debug, ai-explain, ai-optimize, ai-ac"

# --------------------------------------------------
# 4. Quick connectivity check
# --------------------------------------------------

if curl -s --connect-timeout 3 "http://127.0.0.1:11434/api/tags" > /dev/null 2>&1; then
    MODELS=$(curl -s "http://127.0.0.1:11434/api/tags" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(', '.join(m['name'] for m in data.get('models', [])))
" 2>/dev/null || echo "(could not parse model list)")
    echo "[OK] Ollama is running. Available models: $MODELS"
else
    echo "[WARN] Ollama not reachable at 127.0.0.1:11434. Start it with: ollama serve"
fi

echo ""
echo "Bootstrap complete. Try: ai-code 'python script to list open ports'"
