#!/usr/bin/env python3
"""
TerraForge Doctor - Diagnostic checker for TerraForge installations.

Validates:
  1. Python version meets minimum requirement (3.10+)
  2. TerraForge CLI is installed and reachable
  3. Current directory contains valid .tf config files
  4. Provider connectivity (if base_url is configured)
  5. State file integrity

Usage:
    python3 scripts/terraforge_doctor.py
    python3 scripts/terraforge_doctor.py --json
    python3 scripts/terraforge_doctor.py --project-dir /path/to/project
"""

import json
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request

MIN_PYTHON = (3, 10)


def check_python_version():
    """Verify Python >= 3.10."""
    current = sys.version_info[:2]
    if current >= MIN_PYTHON:
        return {
            "check": "python:version",
            "status": "OK",
            "detail": f"{current[0]}.{current[1]} (minimum: {MIN_PYTHON[0]}.{MIN_PYTHON[1]})",
        }
    return {
        "check": "python:version",
        "status": "FAIL",
        "detail": f"{current[0]}.{current[1]} -- need {MIN_PYTHON[0]}.{MIN_PYTHON[1]}+",
    }


def check_terraforge_cli():
    """Check if terraforge command is available."""
    path = shutil.which("terraforge")
    if path:
        try:
            result = subprocess.run(
                ["terraforge", "version"],
                capture_output=True,
                text=True,
                timeout=10,
            )
            version = result.stdout.strip() or result.stderr.strip()
            return {
                "check": "cli:terraforge",
                "status": "OK",
                "detail": f"found at {path} -- {version}",
            }
        except Exception as exc:
            return {
                "check": "cli:terraforge",
                "status": "WARN",
                "detail": f"found at {path} but could not get version: {exc}",
            }
    return {
        "check": "cli:terraforge",
        "status": "FAIL",
        "detail": "terraforge not found in PATH. Run: pip install -e . from the terraforge directory",
    }


def check_tf_files(project_dir):
    """Look for .tf config files in the project directory."""
    tf_files = [f for f in os.listdir(project_dir) if f.endswith(".tf")]
    if tf_files:
        return {
            "check": "config:tf_files",
            "status": "OK",
            "detail": f"found {len(tf_files)} file(s): {', '.join(tf_files)}",
        }
    return {
        "check": "config:tf_files",
        "status": "FAIL",
        "detail": f"no .tf files in {project_dir}. Create a main.tf first.",
    }


def parse_base_url(project_dir):
    """Extract base_url from .tf files (simple regex, not a full HCL parser)."""
    for fname in os.listdir(project_dir):
        if not fname.endswith(".tf"):
            continue
        try:
            content = open(os.path.join(project_dir, fname)).read()
            match = re.search(r'base_url\s*=\s*"([^"]+)"', content)
            if match:
                return match.group(1)
        except Exception:
            pass
    return None


def check_provider_connectivity(base_url):
    """Attempt a HEAD request to the provider base_url."""
    if not base_url:
        return {
            "check": "provider:connectivity",
            "status": "SKIP",
            "detail": "no base_url found in .tf files",
        }

    try:
        req = urllib.request.Request(base_url, method="HEAD")
        with urllib.request.urlopen(req, timeout=5) as resp:
            return {
                "check": "provider:connectivity",
                "status": "OK",
                "detail": f"{base_url} responded with HTTP {resp.status}",
            }
    except urllib.error.HTTPError as exc:
        # Even a 401/403 means the server is reachable
        if exc.code in (401, 403, 405):
            return {
                "check": "provider:connectivity",
                "status": "OK",
                "detail": f"{base_url} reachable (HTTP {exc.code} -- auth required, which is expected)",
            }
        return {
            "check": "provider:connectivity",
            "status": "WARN",
            "detail": f"{base_url} returned HTTP {exc.code}",
        }
    except urllib.error.URLError as exc:
        return {
            "check": "provider:connectivity",
            "status": "FAIL",
            "detail": f"{base_url} unreachable: {exc.reason}",
        }
    except Exception as exc:
        return {
            "check": "provider:connectivity",
            "status": "FAIL",
            "detail": f"{base_url} error: {exc}",
        }


def check_state_file(project_dir):
    """Check if a state file exists and is valid JSON."""
    state_path = os.path.join(project_dir, "terraforge.tfstate")
    if not os.path.exists(state_path):
        return {
            "check": "state:file",
            "status": "SKIP",
            "detail": "no state file yet (run terraforge apply first)",
        }
    try:
        with open(state_path) as f:
            data = json.load(f)
        resource_count = len(data.get("resources", []))
        return {
            "check": "state:file",
            "status": "OK",
            "detail": f"valid JSON, {resource_count} resource(s) tracked",
        }
    except json.JSONDecodeError as exc:
        return {
            "check": "state:file",
            "status": "FAIL",
            "detail": f"corrupt state file: {exc}",
        }
    except Exception as exc:
        return {
            "check": "state:file",
            "status": "FAIL",
            "detail": f"could not read state file: {exc}",
        }


def main():
    as_json = "--json" in sys.argv

    project_dir = "."
    for i, arg in enumerate(sys.argv):
        if arg == "--project-dir" and i + 1 < len(sys.argv):
            project_dir = sys.argv[i + 1]

    project_dir = os.path.abspath(project_dir)
    results = []

    # 1. Python version
    results.append(check_python_version())

    # 2. CLI availability
    results.append(check_terraforge_cli())

    # 3. Config files
    results.append(check_tf_files(project_dir))

    # 4. Provider connectivity
    base_url = parse_base_url(project_dir)
    results.append(check_provider_connectivity(base_url))

    # 5. State file
    results.append(check_state_file(project_dir))

    if as_json:
        print(json.dumps(results, indent=2))
    else:
        print()
        print("  TerraForge Doctor")
        print("  " + "=" * 42)
        fail_count = 0
        for r in results:
            icon = {"OK": "+", "FAIL": "X", "WARN": "!", "SKIP": "-"}.get(r["status"], "?")
            print(f"  [{icon}] {r['check']}: {r['detail']}")
            if r["status"] == "FAIL":
                fail_count += 1
        print()
        if fail_count == 0:
            print("  All checks passed.")
        else:
            print(f"  {fail_count} check(s) failed. See above for details.")
        print()

    sys.exit(1 if any(r["status"] == "FAIL" for r in results) else 0)


if __name__ == "__main__":
    main()
