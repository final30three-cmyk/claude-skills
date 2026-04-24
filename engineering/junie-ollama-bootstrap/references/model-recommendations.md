# Model Recommendations by Hardware Tier

## Quick Reference

| VRAM    | Recommended Model       | Pull Command                     | Best For                  |
|---------|-------------------------|----------------------------------|---------------------------|
| 4 GB    | `phi3:mini`             | `ollama pull phi3:mini`          | Light tasks, fast answers |
| 6 GB    | `deepseek-coder:6.7b`  | `ollama pull deepseek-coder:6.7b`| Code generation           |
| 6 GB    | `llama3:8b`             | `ollama pull llama3:8b`          | General reasoning + code  |
| 8 GB    | `mistral:7b-instruct`  | `ollama pull mistral:7b-instruct`| Instruction following     |
| 8 GB    | `codellama:7b`          | `ollama pull codellama:7b`       | Code (fits 8 GB well)    |
| 10+ GB  | `codellama:13b`         | `ollama pull codellama:13b`      | Best code quality         |
| 12+ GB  | `llama3:70b-q4`         | `ollama pull llama3:70b`         | Near-cloud quality        |

## Switching Models

Change the active model in your current session:

```bash
# Bash
export JUNIE_MODEL="codellama:13b"

# PowerShell
$env:JUNIE_MODEL = "codellama:13b"
```

To make it permanent, re-run the bootstrap script or edit your shell profile directly.

## Model Selection Guide

### Code Generation

For writing new code, fixing bugs, and refactoring:

1. **codellama:13b** -- best output quality, needs 10+ GB VRAM
2. **deepseek-coder:6.7b** -- strong code output, fits in 6 GB
3. **codellama:7b** -- lighter alternative, fits 8 GB comfortably
4. **llama3:8b** -- decent code + general reasoning balance

### Explanation and Documentation

For understanding code, writing docs, or brainstorming:

1. **mistral:7b-instruct** -- clear, well-structured prose
2. **llama3:8b** -- good general-purpose reasoning
3. **phi3:mini** -- fast answers when you just need a quick explanation

### Debugging and Diagnostics

For root-cause analysis and systematic troubleshooting:

1. **codellama:13b** -- strongest reasoning about code behavior
2. **llama3:8b** -- good at systematic problem decomposition
3. **deepseek-coder:6.7b** -- solid for code-focused debugging

### Assetto Corsa / Game Modding

For AC plugin development, setup tuning, telemetry work:

1. **llama3:8b** -- best balance of code + domain reasoning
2. **codellama:7b** -- when the task is purely code-focused
3. **mistral:7b-instruct** -- for setup/tuning explanations

## Temperature Guidance

| Task Type               | Recommended Temperature |
|-------------------------|------------------------|
| Code generation          | 0.1 -- 0.2            |
| Bug fixing               | 0.0 -- 0.1            |
| Code review              | 0.2 -- 0.3            |
| Documentation            | 0.3 -- 0.5            |
| Brainstorming            | 0.7 -- 0.9            |
| Creative writing         | 0.8 -- 1.0            |

## GPU-Specific Notes

### NVIDIA RTX 3060 (12 GB)

Comfortable with any 7B model and most 13B models at Q4 quantization. You can run `codellama:13b` without issues. Avoid 30B+ models unless heavily quantized.

### NVIDIA RTX 3060 (8 GB variant)

Stick with 7B models. `llama3:8b` and `mistral:7b-instruct` both fit. Use `deepseek-coder:6.7b` for code tasks.

### NVIDIA RTX 4060/4070 (8 GB)

Same constraints as 8 GB 3060 but faster inference due to newer architecture. All 7B models work well.

### Apple Silicon (M1/M2/M3)

Ollama uses Metal acceleration automatically. 8 GB unified memory handles 7B models; 16 GB handles 13B; 32 GB can run 30B+ models.

### CPU-Only (No GPU)

Use the smallest model available (`phi3:mini` or `tinyllama`). Inference will be slow but functional for short tasks.
