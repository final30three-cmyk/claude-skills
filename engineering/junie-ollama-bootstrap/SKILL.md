---
name: "junie-ollama-bootstrap"
description: "Drop-in bootstrap for Junie + Ollama local LLM: preconfigured environment, task-oriented shortcuts, and starter prompt templates"
---

# Junie + Ollama Bootstrap

**Tier:** STARTER
**Category:** Engineering
**Domain:** AI Tooling / Local LLM Integration

---

## Overview

A drop-in bootstrap that makes Junie + a local Ollama model immediately productive instead of just installed. Includes environment preconfiguration, callable task shortcuts, and high-value prompt templates so you start from a working workflow rather than a blank REPL.

## Core Capabilities

- One-command environment bootstrap bridging Junie to a local Ollama instance
- Reusable shell functions (`ai-code`, `ai-debug`, `ai-explain`, `ai-optimize`) for common dev tasks
- Starter prompt templates for domain-specific work (game modding, telemetry, tooling)
- Model selection guidance matched to hardware constraints (VRAM tiers)
- Cross-platform support (PowerShell and Bash)

---

## When to Use

- You have Junie and Ollama installed but start from a blank slate each session
- You want deterministic, code-tuned outputs from a local model without manual prompting
- You need callable shortcuts instead of retyping prompts for common tasks
- You are bootstrapping a local AI-assisted dev workflow on consumer hardware

---

## Quick Start

### PowerShell (Windows)

```powershell
# Bootstrap environment + install shortcuts in one shot
.\scripts\bootstrap.ps1

# Verify everything is wired up
python3 scripts/validate_setup.py
```

### Bash (Linux / macOS)

```bash
# Bootstrap environment + install shortcuts in one shot
source scripts/bootstrap.sh

# Verify everything is wired up
python3 scripts/validate_setup.py
```

### Use the shortcuts immediately

```bash
ai-code "python script to batch rename images by timestamp"
ai-debug "segfault when using ctypes with dll"
ai-explain "how async/await works in Python"
ai-optimize "$(cat slow_function.py)"
```

---

## What Gets Configured

| Variable                   | Default Value                        | Purpose                           |
|----------------------------|--------------------------------------|-----------------------------------|
| `JUNIE_LLM_PROVIDER`      | `custom`                             | Route Junie to a custom endpoint  |
| `JUNIE_CUSTOM_ENDPOINT`    | `http://127.0.0.1:11434/v1`         | Ollama's OpenAI-compatible API    |
| `JUNIE_MODEL`              | `llama3:8b`                          | Default model (low VRAM friendly) |
| `JUNIE_TEMPERATURE`        | `0.2`                                | More deterministic for code tasks |
| `JUNIE_MAX_TOKENS`         | `2048`                               | Reasonable output length cap      |
| `JUNIE_SYSTEM_PROMPT`      | Precise coding assistant persona     | Steers toward runnable outputs    |

---

## Callable Shortcuts

| Command        | Purpose                                              |
|----------------|------------------------------------------------------|
| `ai-code`      | Generate clean, production-ready code with examples   |
| `ai-debug`     | Diagnose root cause and produce corrected code        |
| `ai-explain`   | Plain-language explanation with examples               |
| `ai-optimize`  | Return performance/readability-improved code           |
| `ai-ac`        | Assetto Corsa (Content Manager + CSP) specific tasks  |

---

## Recommended Workflow

1. Run the bootstrap script once to wire up Junie to Ollama.
2. Run `validate_setup.py` to confirm connectivity and model availability.
3. Use the callable shortcuts for day-to-day tasks instead of raw prompting.
4. Swap models via `JUNIE_MODEL` when task complexity changes (see `references/model-recommendations.md`).
5. Pull from `references/prompt-templates.md` for domain-specific scaffolding prompts.

---

## Upgrading the Model

For better output quality when hardware allows:

```bash
ollama pull mistral:7b-instruct   # strong general-purpose
ollama pull codellama:13b          # best for code-heavy tasks
ollama pull deepseek-coder:6.7b    # compact code specialist
```

Then switch:

```bash
export JUNIE_MODEL="codellama:13b"
```

Full hardware-to-model mapping: `references/model-recommendations.md`

---

## Common Pitfalls

- Forgetting to start Ollama (`ollama serve`) before running Junie commands
- Using a model that exceeds available VRAM, causing OOM or swap thrashing
- Setting temperature too high (> 0.5) for code generation tasks
- Not persisting env vars across sessions (run the bootstrap script, don't just set vars manually)

## Best Practices

1. Keep temperature at 0.2 for code tasks; raise to 0.7 only for creative/brainstorming work.
2. Use `codellama` or `deepseek-coder` for anything code-heavy; use `llama3` or `mistral` for general reasoning.
3. Pipe file contents directly into shortcuts (`ai-optimize "$(cat file.py)"`) for context-rich queries.
4. Re-run `validate_setup.py` after any model or endpoint change.
