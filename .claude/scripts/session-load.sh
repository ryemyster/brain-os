#!/usr/bin/env bash
# Injects the most recent session summary into Claude's context at session start.
# Fired by the SessionStart hook. Output appears as a system-reminder.

SESSIONS_DIR="/Users/rmcdonald/Repos/ryemyster/brain-os/context-store/sessions"
MAX_LINES=120

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 LAST SESSION CONTEXT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Find most recent session file (local sort is authoritative for recency)
LATEST=$(ls -t "$SESSIONS_DIR"/*.md 2>/dev/null | grep -v archive | head -1)

if [[ -z "$LATEST" ]]; then
  echo "No prior session found. Starting fresh."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  exit 0
fi

BASENAME=$(basename "$LATEST")
echo "Source: context-store/sessions/$BASENAME"
echo ""

# Output file content, capped to avoid context overload
LINE_COUNT=$(wc -l < "$LATEST")
if [[ "$LINE_COUNT" -gt "$MAX_LINES" ]]; then
  head -n "$MAX_LINES" "$LATEST"
  echo ""
  echo "... ($((LINE_COUNT - MAX_LINES)) more lines — run /context-load for full scan)"
else
  cat "$LATEST"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Pipeline state above may be stale. Run /daily or /context-load to verify."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
