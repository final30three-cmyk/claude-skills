---
name: "terraforge-guide"
description: "TerraForge API orchestrator: declarative .tf configs to talk to any REST API without writing code"
---

# TerraForge Guide

**Tier:** STARTER
**Category:** Engineering
**Domain:** API Orchestration / Infrastructure-as-Code Patterns

---

## Overview

TerraForge lets you interact with any REST API using declarative `.tf` config files instead of writing code. You describe what you want (provider, endpoint, method), TerraForge plans the work, executes it, and tracks state so you can undo everything later. Think Terraform, but for arbitrary API consumption.

## Core Capabilities

- Declarative API interaction via `.tf` config files
- Plan/apply/destroy lifecycle for safe, reversible operations
- Local resource management (files, directories) alongside API calls
- API key management with secure storage
- State tracking so every action can be rolled back
- Data export for offline use
- Built-in diagnostics (`terraforge doctor`)

---

## When to Use

- You need to pull data from a REST API without writing a custom client
- You want a repeatable, version-controllable way to interact with APIs
- You need to collect and export API data for offline analysis
- You want plan-then-apply safety for API operations
- You are prototyping integrations before committing to a full SDK

---

## Prerequisites

- Python 3.10+ (3.13 tested)
- `pip install -e .` from the TerraForge directory
- PowerShell or Bash

---

## Quick Start

```bash
# 1. Install (one time)
cd terraforge
pip install -e .
terraforge version   # expect: TerraForge v1.0.0

# 2. Try the local resources example (no internet needed)
cd examples/local_resources
terraforge init
terraforge plan      # preview -- nothing changes yet
terraforge apply     # creates files/folders
terraforge show      # inspect state
terraforge destroy   # clean up

# 3. Try with a real API
cd ../rest_api
terraforge init
terraforge plan
terraforge apply --auto
```

---

## Commands Cheat Sheet

| Command                        | Purpose                                      |
|--------------------------------|----------------------------------------------|
| `terraforge init`              | Initialize workspace, check connections       |
| `terraforge plan`              | Preview changes (dry run, safe)               |
| `terraforge apply`             | Execute the plan (asks confirmation)          |
| `terraforge apply --auto`      | Execute without confirmation prompt           |
| `terraforge show`              | Display current state of all resources        |
| `terraforge destroy`           | Undo everything / clean up                    |
| `terraforge doctor`            | Diagnose setup issues                         |
| `terraforge export`            | Save all data for offline use                 |
| `terraforge state list`        | List all managed resources                    |
| `terraforge version`           | Show version number                           |
| `terraforge key set <p> <k>`   | Save an API key for provider `<p>`            |
| `terraforge key list`          | List saved API keys                           |
| `terraforge key remove <p>`    | Delete a saved API key                        |

---

## Config File Structure

A `.tf` file has two main blocks:

### Provider Block (where is the API?)

```hcl
provider "rest_api" {
    base_url = "https://your-api-url.com"
    api_key  = "your-api-key-here"
}
```

### Resource Block (what do you want from it?)

```hcl
resource "rest_api_resource" "my_data" {
    endpoint = "/api/v1/assets"
    method   = "GET"
}
```

Multiple resources can live in the same `.tf` file. Each resource maps to one API call.

---

## Recommended Workflow

1. Create a project folder and a `main.tf` config file.
2. Run `terraforge init` to validate the config and check connectivity.
3. Run `terraforge plan` to preview what will happen -- always do this first.
4. Run `terraforge apply` to execute. Use `--auto` for scripted/automated runs.
5. Run `terraforge show` or check the `data/` folder for collected results.
6. Run `terraforge export` to snapshot everything for offline use.
7. Run `terraforge destroy` when done to clean up created resources.

---

## Project Scaffolding

Use the included scaffolder to generate a new TerraForge project:

```bash
python3 scripts/terraforge_scaffold.py my-api-project \
    --base-url "https://api.example.com" \
    --endpoint "/api/v1/data" \
    --method GET
```

This creates a ready-to-use project folder with `main.tf`, `.gitignore`, and a README.

---

## Diagnostics

When something goes wrong, run the doctor:

```bash
terraforge doctor
```

Or use the Python diagnostic script for a more detailed check:

```bash
python3 scripts/terraforge_doctor.py
python3 scripts/terraforge_doctor.py --json   # machine-readable output
```

See `references/troubleshooting.md` for common error patterns and fixes.

---

## Directory Layout After Apply

```
my-project/
  main.tf                  # your config (the recipe)
  terraforge.tfstate       # state file (tracks what was created)
  data/                    # collected API data (JSON files)
  logs/                    # detailed request/response logs
  output/                  # files created by local provider
```

---

## Common Pitfalls

- Running `apply` before `plan` -- always preview first
- Being in the wrong directory (no `.tf` files found)
- Forgetting to start the target API before connecting
- Typos in `.tf` files (mismatched brackets `{}` or unquoted strings)
- Not running `destroy` after experiments, leaving stale state

## Best Practices

1. Always run `plan` before `apply` to understand what will change.
2. Use `--auto` only in scripts/automation, not during exploration.
3. Keep API keys out of `.tf` files in production -- use `terraforge key set` instead.
4. Use `export` regularly to create offline snapshots of collected data.
5. Version-control your `.tf` files but `.gitignore` the state file and `data/` directory.
6. One provider per project keeps things simple; use separate folders for different APIs.
