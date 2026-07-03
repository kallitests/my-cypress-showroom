"""nodes/parse_gherkin.py

Reads a .feature file and extracts a structured list of scenarios
(title + Given/When/Then steps) that downstream nodes can consume.
"""

import re


def parse_gherkin(state: dict) -> dict:
    """Parses the .feature file referenced in state['feature_path'].

    Returns the state updated with a 'scenarios' list, where each item is
    a dict: {"title": str, "steps": list[str]}.
    """
    with open(state["feature_path"], "r", encoding="utf-8") as file:
        content = file.read()  # Read the raw Gherkin source

    scenarios = []
    current_title = None
    current_steps: list[str] = []

    for raw_line in content.splitlines():
        line = raw_line.strip()

        if line.startswith("Scenario:"):
            if current_title is not None:
                scenarios.append({"title": current_title, "steps": current_steps})  # Flush the previous scenario
            current_title = line.removeprefix("Scenario:").strip()  # Start a new scenario
            current_steps = []
        elif re.match(r"^(Given|When|Then|And)\s", line):
            current_steps.append(line)  # Collect each Gherkin step line

    if current_title is not None:
        scenarios.append({"title": current_title, "steps": current_steps})  # Flush the last scenario

    state["scenarios"] = scenarios  # Store the parsed scenarios for the next node
    return state
