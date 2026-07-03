"""cli.py

Command-line entry point for the LangGraph agent.

Usage:
    python ai-agent/cli.py --feature cypress/features/transaction.feature
"""

import argparse

from dotenv import load_dotenv

from graph import build_graph


def main() -> None:
    load_dotenv()  # Load ANTHROPIC_API_KEY and other variables from .env

    parser = argparse.ArgumentParser(description="Generate, run and self-heal a Cypress smoke spec from a Gherkin file.")
    parser.add_argument("--feature", required=True, help="Path to the .feature file to process")
    args = parser.parse_args()

    app = build_graph()  # Compile the LangGraph state machine

    initial_state = {
        "feature_path": args.feature,  # Entry point for the parse_gherkin node
        "scenarios": [],
        "spec_code": None,
        "spec_path": None,
        "run_report": None,
        "retries": 0,
    }

    final_state = app.invoke(initial_state)  # Run the full graph end to end

    status = "PASSED" if final_state["run_report"]["success"] else "FAILED"  # Human-readable final status
    print(f"\nSpec generated at: {final_state['spec_path']}")  # Where to find the generated spec
    print(f"Run result: {status}")  # Whether the generated spec ultimately passed
    print(f"Attempts: {final_state['retries'] + 1}")  # Total generation attempts including the first one


if __name__ == "__main__":
    main()
