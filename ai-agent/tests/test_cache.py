"""tests/test_cache.py

Unit tests for cache.py — specifically its "fail open" guarantee: the agent
must keep working even when Redis is unreachable or unconfigured.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))  # Make "cache" importable when run standalone

import cache  # noqa: E402


def test_get_cached_spec_returns_none_without_redis_url(monkeypatch):
    """With no REDIS_URL set, a cache lookup must be a clean miss, not a crash."""
    monkeypatch.delenv("REDIS_URL", raising=False)  # Simulate no Redis configuration at all

    result = cache.get_cached_spec("some scenario text", "")  # Should not raise

    assert result is None  # A miss is the only acceptable outcome here


def test_set_cached_spec_does_not_raise_without_redis_url(monkeypatch):
    """Writing to the cache without Redis configured must silently no-op."""
    monkeypatch.delenv("REDIS_URL", raising=False)

    cache.set_cached_spec("some scenario text", "", "// generated spec")  # Must not raise


def test_cache_key_is_stable_for_identical_input():
    """The same scenario text and feedback must always produce the same key."""
    key_a = cache._cache_key("scenario text", "feedback")  # noqa: SLF001 (intentional: testing internal helper)
    key_b = cache._cache_key("scenario text", "feedback")  # noqa: SLF001

    assert key_a == key_b  # Determinism is required for the cache to be useful


def test_cache_key_differs_when_feedback_differs():
    """Different feedback must produce a different key, so a retry after a
    real fix is never served a stale cached spec."""
    key_without_feedback = cache._cache_key("scenario text", "")  # noqa: SLF001
    key_with_feedback = cache._cache_key("scenario text", "fix the selector")  # noqa: SLF001

    assert key_without_feedback != key_with_feedback
