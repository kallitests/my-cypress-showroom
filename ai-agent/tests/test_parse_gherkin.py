"""tests/test_parse_gherkin.py

Unit tests for nodes/parse_gherkin.py.
Pure function, no network/LLM/Redis involved -> fast and deterministic.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))  # Make "nodes" importable when run standalone

from nodes.parse_gherkin import parse_gherkin  # noqa: E402


def test_parses_a_single_scenario(tmp_path):
    """A .feature file with one scenario should yield exactly one parsed entry."""
    feature_file = tmp_path / "sample.feature"
    feature_file.write_text(
        "Feature: Sample\n"
        "  Scenario: Do the thing\n"
        "    Given a starting state\n"
        "    When I do the thing\n"
        "    Then the outcome is correct\n",
        encoding="utf-8",
    )

    state = {"feature_path": str(feature_file)}  # Minimal state expected by the node
    result = parse_gherkin(state)  # Run the node under test

    assert len(result["scenarios"]) == 1  # Exactly one scenario was declared
    assert result["scenarios"][0]["title"] == "Do the thing"  # Title is extracted without the "Scenario:" prefix
    assert len(result["scenarios"][0]["steps"]) == 3  # Given/When/Then were all captured


def test_parses_multiple_scenarios(tmp_path):
    """Multiple scenarios in the same file should all be captured, in order."""
    feature_file = tmp_path / "multi.feature"
    feature_file.write_text(
        "Feature: Multi\n"
        "  Scenario: First\n"
        "    Given a\n"
        "    Then b\n"
        "  Scenario: Second\n"
        "    Given c\n"
        "    Then d\n",
        encoding="utf-8",
    )

    state = {"feature_path": str(feature_file)}
    result = parse_gherkin(state)

    titles = [s["title"] for s in result["scenarios"]]
    assert titles == ["First", "Second"]  # Order is preserved, both scenarios are present
