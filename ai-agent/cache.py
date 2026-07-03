"""cache.py

Thin Redis-backed cache for the LangGraph agent's LLM calls.

Purpose: identical Gherkin scenarios should not be re-sent to Claude on
every self-healing retry within the same run, or across separate runs on
an unchanged .feature file. This cuts both token cost and latency.

Designed to fail open: if Redis is unavailable (e.g. REDIS_URL not set,
or the container isn't running), every call is simply treated as a cache
miss — the agent still works, just without the speed/cost benefit.
"""

import hashlib
import json
import os
from typing import Optional

try:
    import redis  # Imported lazily so the agent still runs without the package during local dev
except ImportError:
    redis = None  # Cache becomes a no-op if redis-py isn't installed

_CACHE_TTL_SECONDS = 60 * 60 * 24  # Cached generations expire after 24 hours


def _get_client():
    """Returns a connected Redis client, or None if unavailable."""
    redis_url = os.environ.get("REDIS_URL")  # e.g. redis://redis:6379 inside docker-compose
    if not redis_url or redis is None:
        return None  # No URL configured, or the library isn't installed: skip caching entirely
    try:
        client = redis.from_url(redis_url, socket_connect_timeout=1)  # Short timeout: never block the agent for long
        client.ping()  # Verify the connection actually works before relying on it
        return client
    except Exception:
        return None  # Any connection issue: fail open, treat as a cache miss


def _cache_key(scenarios_text: str, feedback: str) -> str:
    """Builds a stable cache key from the scenario text and any prior feedback."""
    raw = f"{scenarios_text}::{feedback}"  # Feedback is included so a retry after a real fix isn't served a stale entry
    return "cypress-spec:" + hashlib.sha256(raw.encode("utf-8")).hexdigest()  # Namespaced, fixed-length key


def get_cached_spec(scenarios_text: str, feedback: str) -> Optional[str]:
    """Returns a previously generated spec for this exact input, or None on a miss."""
    client = _get_client()
    if client is None:
        return None  # No Redis available: always a miss
    cached = client.get(_cache_key(scenarios_text, feedback))  # Look up the deterministic key
    return cached.decode("utf-8") if cached else None  # Redis returns bytes; decode back to text


def set_cached_spec(scenarios_text: str, feedback: str, spec_code: str) -> None:
    """Stores a generated spec so identical future requests can skip the LLM call."""
    client = _get_client()
    if client is None:
        return  # No Redis available: silently skip storing
    client.setex(_cache_key(scenarios_text, feedback), _CACHE_TTL_SECONDS, spec_code)  # Store with a TTL, not forever
