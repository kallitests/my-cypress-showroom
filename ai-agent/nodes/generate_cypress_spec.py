"""nodes/generate_cypress_spec.py

Turns parsed Gherkin scenarios into a commented Cypress .cy.ts spec file,
using an LLM prompted with the repo's coding conventions.
"""

import os

from langchain_anthropic import ChatAnthropic

from pathlib import Path

from cache import get_cached_spec, set_cached_spec  # Redis-backed LLM response cache (see cache.py)

PROMPT_TEMPLATE_PATH = Path(__file__).parent.parent / "prompts" / "cypress_codegen.md"


def generate_cypress_spec(state: dict) -> dict:
    """Generates (or regenerates, on retry) a Cypress spec from state['scenarios'].

    Writes the result to disk and stores both the code and its path in state.
    """
    prompt_template = PROMPT_TEMPLATE_PATH.read_text(encoding="utf-8")  # Load the codegen prompt template

    scenarios_text = "\n\n".join(
        f"Scenario: {s['title']}\n" + "\n".join(s["steps"]) for s in state["scenarios"]
    )  # Flatten parsed scenarios back into readable Gherkin text for the prompt

    previous_feedback = state.get("run_report", {}).get("summary", "")  # Empty on first attempt

    cached_spec = get_cached_spec(scenarios_text, previous_feedback)  # Check Redis before spending any tokens
    if cached_spec is not None:
        spec_code = cached_spec  # Reuse a previous generation for this exact scenario+feedback pair
    else:
        llm = ChatAnthropic(
            model="claude-sonnet-4-6",  # Model used for spec generation
            api_key=os.environ.get("ANTHROPIC_API_KEY"),
            temperature=0,  # Deterministic output is preferred for code generation
        )

        full_prompt = (
            f"{prompt_template}\n\n"
            f"## Scenarios to implement\n{scenarios_text}\n\n"
            f"## Previous run feedback (empty if first attempt)\n{previous_feedback}"
        )

        response = llm.invoke(full_prompt)  # Ask the LLM to produce the Cypress spec
        spec_code = response.content  # Extract the generated TypeScript source
        set_cached_spec(scenarios_text, previous_feedback, spec_code)  # Store it so identical retries skip the LLM call

    feature_name = Path(state["feature_path"]).stem  # e.g. "auth" from "auth.feature"
    spec_path = Path("cypress/e2e/generated") / f"{feature_name}.cy.ts"
    spec_path.parent.mkdir(parents=True, exist_ok=True)  # Ensure the output directory exists
    spec_path.write_text(spec_code, encoding="utf-8")  # Persist the generated spec to disk

    state["spec_code"] = spec_code
    state["spec_path"] = str(spec_path)
    return state
