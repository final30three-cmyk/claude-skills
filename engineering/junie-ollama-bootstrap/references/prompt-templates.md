# Starter Prompt Templates

Ready-to-use prompts organized by domain. Paste these directly into Junie REPL or use them with the `ai-code` / `ai-debug` / `ai-explain` shortcuts.

---

## General Development

### Project Scaffolding

```
Create a minimal but complete project structure for a [Python CLI tool / Node.js REST API / Go microservice] that does [task]. Include:
- Directory layout
- Entry point with argument parsing
- Config file template
- README with setup instructions
- .gitignore
```

### Code Review Prompt

```
Review this code for:
1. Correctness bugs
2. Performance issues
3. Security concerns
4. Readability improvements

Code:
[paste code here]

Provide fixes inline with explanations.
```

### Test Generation

```
Write unit tests for the following function using [pytest / jest / go test].
Cover: happy path, edge cases, error conditions.
Use descriptive test names that explain the scenario.

Function:
[paste function here]
```

### Refactoring

```
Refactor this code to:
1. Extract repeated logic into reusable functions
2. Improve naming for clarity
3. Add type hints / annotations
4. Reduce cyclomatic complexity

Original:
[paste code here]

Return the refactored version only, with brief comments explaining changes.
```

---

## Assetto Corsa (Content Manager + CSP)

### Plugin Scaffold

```
Create a minimal Python app for Assetto Corsa (Content Manager + CSP) that displays speed and gear on screen. Include:
- Folder structure (apps/python/MyApp/)
- acMain() and acUpdate() usage
- Label creation and positioning
- Basic error handling
```

### Telemetry Logger

```
Write a Python script that logs live telemetry (speed, RPM, throttle, brake, gear, steering angle) from Assetto Corsa into a CSV file. Include:
- Timestamped rows
- Configurable logging interval
- Clean file rotation per session
- acMain/acUpdate structure
```

### Drift Setup Helper

```
Generate a baseline drift setup for a RWD car in Assetto Corsa. Cover:
- Suspension geometry (camber, toe, ride height)
- Differential settings (power/coast lock)
- Alignment tuning
- Spring and damper rates

Explain the tuning logic behind each value so it can be adapted to different cars.
```

### Track Condition Analyzer

```
Write an AC Python app that reads track surface data (grip level, temperature) and displays a simple HUD showing:
- Current grip percentage
- Optimal tire temperature range indicator
- Lap time delta
Use CSP extended physics where available.
```

---

## DevOps and Tooling

### Dockerfile Generation

```
Create a production-ready Dockerfile for a [Python / Node.js / Go] application. Include:
- Multi-stage build
- Non-root user
- .dockerignore recommendations
- Health check
- Minimal final image size
```

### CI Pipeline

```
Write a GitHub Actions workflow that:
1. Runs on push to main and PRs
2. Sets up [language] environment
3. Installs dependencies with caching
4. Runs linting and type checking
5. Runs tests with coverage reporting
6. Fails on coverage below 80%
```

### Shell Script Hardening

```
Review this shell script for robustness:
- Add proper error handling (set -euo pipefail)
- Quote all variables
- Handle missing dependencies gracefully
- Add usage/help output
- Make it idempotent (safe to run twice)

Script:
[paste script here]
```

---

## Data and Analysis

### CSV Processor

```
Write a Python script that:
1. Reads a CSV file from stdin or file argument
2. [describe transformation: filter rows, aggregate columns, join files, etc.]
3. Outputs clean CSV to stdout
4. Handles malformed rows gracefully
Use only stdlib (csv module). No pandas.
```

### Log Parser

```
Write a script that parses [nginx / application / systemd] logs and produces:
1. Top 10 [errors / slow requests / IPs]
2. Timeline of [events] bucketed by [minute / hour]
3. Summary statistics
Output as both human-readable table and JSON.
```

---

## Tips for Writing Effective Prompts

1. **Be specific about output format** -- say "return only the code" or "include explanations as comments" to control verbosity.
2. **Provide context** -- paste the actual code, error message, or config rather than describing it.
3. **Constrain the scope** -- "use only stdlib" or "no external dependencies" prevents the model from reaching for libraries you do not have.
4. **Request structure** -- ask for "numbered steps" or "bullet points" when you need scannable output.
5. **Chain prompts** -- use `ai-code` to generate, then `ai-optimize` on the result, then `ai-debug` if something breaks.
