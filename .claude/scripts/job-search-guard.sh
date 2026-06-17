#!/usr/bin/env bash
# Soft pre-check before job-search MCP tools (intel, fit, prep, apply, outreach).
# Advisory only — reminds Claude to check context layers first. Never blocks (exit 0).

HEALTH=$(curl -s --max-time 2 http://localhost:8088/healthcheck 2>/dev/null)

if [[ -n "$HEALTH" ]]; then
  echo "⚡ CONTEXT FIRST — localhost:8088 is up. Check these layers before proceeding:"
  echo "  1. vector_search(query=\"<company or topic>\", mode=\"context_safe\") via MCP tool mcp__context-engine__vector_search"
  echo "  2. recall(action=\"list\", listType=\"company\") → then recall(type=\"company\", label=<slug>)"
  echo "  3. Only call intel/fit/prep/apply if layers 1-2 are missing or stale (>30d)."
else
  echo "⚡ CONTEXT FIRST — localhost:8088 is down. Check recall before proceeding:"
  echo "  1. recall(action=\"list\", listType=\"company\") → then recall(type=\"company\", label=<slug>)"
  echo "  2. Only call intel/fit/prep/apply if recall has no entry or it's stale (>30d)."
fi

exit 0
