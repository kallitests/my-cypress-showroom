"""graph.py

Defines the LangGraph state machine that turns a Gherkin .feature file into
a running, self-correcting Cypress smoke spec.

Flow:
    parse_gherkin -> generate_cypress_spec -> run_cypress
        -> (on failure) summarize_failures -> generate_cypress_spec (retry, max 2)
        -> (on success) END
"""

from typing import TypedDict, Optional

from langgraph.graph import StateGraph, END

from nodes.parse_gherkin import parse_gherkin
from nodes.generate_cypress_spec import generate_cypress_spec
from nodes.run_cypress import run_cypress
from nodes.summarize_failures import summarize_failures


class AgentState(TypedDict):
    feature_path: str          # Path to the .feature file to process
    scenarios: list             # Parsed Gherkin scenarios
    spec_code: Optional[str]    # Generated Cypress spec source
    spec_path: Optional[str]    # Where the generated spec was written on disk
    run_report: Optional[dict]  # Parsed JSON report from `cypress run`
    retries: int                 # Number of self-correction attempts so far


def build_graph():
    """Builds and compiles the LangGraph state machine described above."""
    graph = StateGraph(AgentState)

    graph.add_node("parse_gherkin", parse_gherkin)                  # Step 1: read the .feature file
    graph.add_node("generate_cypress_spec", generate_cypress_spec)  # Step 2: LLM-based code generation
    graph.add_node("run_cypress", run_cypress)                      # Step 3: execute the generated spec
    graph.add_node("summarize_failures", summarize_failures)        # Step 4: explain failures in plain language

    graph.set_entry_point("parse_gherkin")  # Every run starts by reading the Gherkin source
    graph.add_edge("parse_gherkin", "generate_cypress_spec")
    graph.add_edge("generate_cypress_spec", "run_cypress")

    # After running the tests: success ends the graph, failure goes to summarization.
    graph.add_conditional_edges(
        "run_cypress",
        lambda state: END if state["run_report"]["success"] else "summarize_failures",
    )

    # After summarizing: retry generation up to 2 times, then stop regardless.
    graph.add_conditional_edges(
        "summarize_failures",
        lambda state: "generate_cypress_spec" if state["retries"] < 2 else END,
    )

    return graph.compile()


if __name__ == "__main__":
    # Minimal manual smoke check of the graph wiring itself.
    app = build_graph()
    print("LangGraph agent compiled successfully.")  # Confirms the graph builds without errors
