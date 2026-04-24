# ============================================================
# Junie + Ollama Bootstrap (PowerShell)
# One-shot environment setup + callable task shortcuts
# ============================================================

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "--- Junie + Ollama Bootstrap ---" -ForegroundColor Cyan

# --------------------------------------------------
# 1. Set environment variables for the current session
# --------------------------------------------------

$env:JUNIE_LLM_PROVIDER    = "custom"
$env:JUNIE_CUSTOM_ENDPOINT = "http://127.0.0.1:11434/v1"
$env:JUNIE_MODEL           = "llama3:8b"
$env:JUNIE_TEMPERATURE     = "0.2"
$env:JUNIE_MAX_TOKENS      = "2048"
$env:JUNIE_SYSTEM_PROMPT   = "You are a precise coding and systems assistant. Prefer concise, correct, runnable outputs."

Write-Host "[OK] Environment variables set for current session." -ForegroundColor Green

# --------------------------------------------------
# 2. Persist to PowerShell profile
# --------------------------------------------------

$profilePath = "$HOME\Documents\PowerShell\Microsoft.PowerShell_profile.ps1"
$profileDir  = Split-Path $profilePath -Parent

if (-not (Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
    Write-Host "[OK] Created profile directory: $profileDir" -ForegroundColor Green
}

$marker = "# --- Junie/Ollama Bootstrap ---"

# Check if already bootstrapped
if (Test-Path $profilePath) {
    $existing = Get-Content $profilePath -Raw -ErrorAction SilentlyContinue
    if ($existing -and $existing.Contains($marker)) {
        Write-Host "[SKIP] Profile already contains Junie bootstrap block." -ForegroundColor Yellow
    }
    else {
        $block = @"

$marker
`$env:JUNIE_LLM_PROVIDER    = 'custom'
`$env:JUNIE_CUSTOM_ENDPOINT = 'http://127.0.0.1:11434/v1'
`$env:JUNIE_MODEL           = 'llama3:8b'
`$env:JUNIE_TEMPERATURE     = '0.2'
`$env:JUNIE_MAX_TOKENS      = '2048'
`$env:JUNIE_SYSTEM_PROMPT   = 'You are a precise coding and systems assistant. Prefer concise, correct, runnable outputs.'
# --- End Junie/Ollama Bootstrap ---
"@
        Add-Content -Path $profilePath -Value $block -Encoding UTF8
        Write-Host "[OK] Appended env vars to profile: $profilePath" -ForegroundColor Green
    }
}
else {
    $block = @"
$marker
`$env:JUNIE_LLM_PROVIDER    = 'custom'
`$env:JUNIE_CUSTOM_ENDPOINT = 'http://127.0.0.1:11434/v1'
`$env:JUNIE_MODEL           = 'llama3:8b'
`$env:JUNIE_TEMPERATURE     = '0.2'
`$env:JUNIE_MAX_TOKENS      = '2048'
`$env:JUNIE_SYSTEM_PROMPT   = 'You are a precise coding and systems assistant. Prefer concise, correct, runnable outputs.'
# --- End Junie/Ollama Bootstrap ---
"@
    Set-Content -Path $profilePath -Value $block -Encoding UTF8
    Write-Host "[OK] Created profile with env vars: $profilePath" -ForegroundColor Green
}

# --------------------------------------------------
# 3. Define callable task shortcuts
# --------------------------------------------------

function global:ai-code {
    param([Parameter(Mandatory)][string]$task)
    junie "Write clean, production-ready code for: $task. Include comments and usage example."
}

function global:ai-debug {
    param([Parameter(Mandatory)][string]$issue)
    junie "Diagnose and fix this issue. Provide root cause and corrected code: $issue"
}

function global:ai-explain {
    param([Parameter(Mandatory)][string]$thing)
    junie "Explain clearly with examples: $thing"
}

function global:ai-optimize {
    param([Parameter(Mandatory)][string]$code)
    junie "Optimize this code for performance and readability. Return improved version only: $code"
}

function global:ai-ac {
    param([Parameter(Mandatory)][string]$task)
    junie "This is for Assetto Corsa (Content Manager + CSP). Provide practical implementation steps: $task"
}

Write-Host "[OK] Shortcuts registered: ai-code, ai-debug, ai-explain, ai-optimize, ai-ac" -ForegroundColor Green

# --------------------------------------------------
# 4. Quick connectivity check
# --------------------------------------------------

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:11434/api/tags" -TimeoutSec 3 -ErrorAction Stop
    $models = ($response.models | ForEach-Object { $_.name }) -join ", "
    Write-Host "[OK] Ollama is running. Available models: $models" -ForegroundColor Green
}
catch {
    Write-Host "[WARN] Ollama not reachable at 127.0.0.1:11434. Start it with: ollama serve" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Bootstrap complete. Try: ai-code 'python script to list open ports'" -ForegroundColor Cyan
