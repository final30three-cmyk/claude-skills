# TerraForge Troubleshooting

## Quick Diagnosis

Always start with:

```bash
terraforge doctor
```

This checks Python version, CLI installation, config files, connectivity, and state integrity in one shot.

For more detail, use the Python diagnostic script:

```bash
python3 scripts/terraforge_doctor.py
python3 scripts/terraforge_doctor.py --json          # machine-readable
python3 scripts/terraforge_doctor.py --project-dir .  # check a specific project
```

---

## Common Errors and Fixes

### "No .tf files found"

**Cause:** You are in the wrong directory. TerraForge looks for `.tf` files in the current working directory.

**Fix:**
```bash
cd /path/to/your/project    # the folder containing main.tf
terraforge init
```

---

### "Connection refused" / "Cannot connect to host"

**Cause:** The target API is not running or not reachable at the configured `base_url`.

**Fix:**
1. Verify the API is running: `curl -I https://your-api-url.com`
2. Check `base_url` in your `.tf` file -- no trailing slash, correct port
3. If it is a local API, make sure the server process is started first
4. Check firewall rules if connecting to a remote host

---

### "Invalid API Key" / 401 Unauthorized

**Cause:** The `api_key` in your `.tf` file is wrong, expired, or missing required scopes.

**Fix:**
1. Verify the key works independently: `curl -H "Authorization: Bearer YOUR_KEY" https://api.example.com/test`
2. Regenerate the key from the API provider's dashboard
3. Use `terraforge key set rest_api NEW_KEY` to update

---

### "Parse error in .tf file"

**Cause:** Syntax error in your config file -- usually mismatched brackets, missing quotes, or invalid HCL.

**Fix:**
1. Check that all `{` have matching `}`
2. All string values must be in double quotes `"..."`
3. Remove any trailing commas (HCL does not use commas)
4. Example of correct syntax:
   ```hcl
   provider "rest_api" {
       base_url = "https://api.example.com"
   }
   ```

---

### "State file corrupt"

**Cause:** The `terraforge.tfstate` file was manually edited or partially written due to a crash.

**Fix:**
1. If you have a backup: `cp terraforge.tfstate.backup terraforge.tfstate`
2. If no backup, delete the state file and re-apply:
   ```bash
   rm terraforge.tfstate
   terraforge init
   terraforge apply --auto
   ```
   Note: this will re-create resources, potentially duplicating API calls.

---

### "Module not found: terraforge"

**Cause:** TerraForge is not installed in the current Python environment.

**Fix:**
```bash
cd /path/to/terraforge
pip install -e .
terraforge version
```

If using a virtual environment, make sure it is activated first.

---

### "Python version too old"

**Cause:** TerraForge requires Python 3.10 or newer.

**Fix:**
```bash
python3 --version
```
If below 3.10, install a newer version from [python.org](https://www.python.org/downloads/) or use `pyenv`:
```bash
pyenv install 3.13.0
pyenv local 3.13.0
```

---

### "Permission denied" when creating files

**Cause:** TerraForge cannot write to the `output/` or `data/` directory.

**Fix:**
1. Check directory permissions: `ls -la`
2. Run from a directory you own (e.g., your Desktop or home folder)
3. On Windows, avoid running from `C:\Program Files\` or system directories

---

### Timeouts on Large Responses

**Cause:** The API takes longer than the default timeout to respond.

**Fix:** Add a `timeout` field to the provider block:
```hcl
provider "rest_api" {
    base_url = "https://slow-api.example.com"
    timeout  = 120
}
```

---

## Logging

TerraForge writes detailed request/response logs to the `logs/` directory inside your project folder. Check these for:

- Full HTTP request headers and body
- Response status codes and body
- Timestamps for each operation

---

## Getting Help

1. Run `terraforge doctor` first
2. Check `logs/` for detailed request traces
3. Verify config syntax against `references/provider-guide.md`
4. Try the same API call with `curl` to isolate whether the issue is TerraForge or the API itself:
   ```bash
   curl -v -H "Authorization: Bearer YOUR_KEY" "https://api.example.com/endpoint"
   ```
