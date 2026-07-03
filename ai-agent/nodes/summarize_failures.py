"""nodes/summarize_failures.py

Turns a raw Cypress failure report into a short, human-readable explanation
plus a concrete suggestion, and increments the retry counter.
"""

import os

from langchain_anthropic import ChatAnthropic


def summarize_failures(state: dict) -> dict:
    """Summarizes state['run_report'] in plain language and bumps the retry count."""
    llm = ChatAnthropic(
        model="claude-sonnet-4-6",  # Model used for failure analysis
        api_key=os.environ.get("ANTHROPIC_API_KEY"),
        temperature=0,  # Deterministic, focused diagnosis rather than creative writing
    )

    prompt = (
        "You are a senior QA engineer reviewing a failed Cypress smoke test run.\n"
        "Explain the likely root cause in 3-5 sentences, in plain English, "
        "and suggest one concrete fix to the generated spec.\n\n"
        f"Raw Cypress output:\n{state['run_report']['summary']}"
    )

    response = llm.invoke(prompt)  # Ask the LLM to diagnose the failure
    state["run_report"]["summary"] = response.content  # Replace raw output with the human-readable diagnosis
    state["retries"] = state.get("retries", 0) + 1  # Track how many self-correction attempts have been made
    return state
