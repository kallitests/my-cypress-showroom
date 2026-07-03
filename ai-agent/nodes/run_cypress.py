"""nodes/run_cypress.py

Executes the generated Cypress spec via the CLI and parses its JSON report
into a simple success/failure summary the rest of the graph can act on.
"""

import json
import subprocess


def run_cypress(state: dict) -> dict:
    """Runs `cypress run` against state['spec_path'] and stores the outcome.

    Populates state['run_report'] with at least {"success": bool, "summary": str}.
    """
    result = subprocess.run(
        [
            "npx",
            "cypress",
            "run",
            "--spec",
            state["spec_path"],
            "--reporter",
            "json",
        ],
        capture_output=True,
        text=True,
        check=False,  # Do not raise on non-zero exit: failing tests are an expected outcome to handle, not a crash
    )

    try:
        report = json.loads(result.stdout)  # Attempt to parse the JSON reporter output
        success = report.get("stats", {}).get("failures", 1) == 0  # No failures means the spec passed
    except json.JSONDecodeError:
        report = {"raw_stdout": result.stdout, "raw_stderr": result.stderr}  # Fall back to raw output for debugging
        success = False

    state["run_report"] = {
        "success": success,
        "summary": result.stdout[-2000:],  # Keep only the tail of the output to stay within prompt limits
        "raw": report,
    }
    return state
