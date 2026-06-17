#!/bin/bash
# Blocks mcp__brain-os__daily if context engine hasn't indexed this session.
# Exit 2 = block tool call. Exit 0 = allow.

# If context engine is down, warn and allow — don't block when fallback is the right move
HEALTH=$(curl -s --max-time 3 http://localhost:8088/healthcheck 2>/dev/null)
if [ -z "$HEALTH" ]; then
  echo "⚠️  localhost:8088 is unreachable — skipping guard. Proceed with recall + external APIs."
  exit 0
fi

# Context engine is up — check vector_row_count as the signal that indexing has run
VECTOR_ROWS=$(curl -sf --max-time 2 http://localhost:8088/debug \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['vector_row_count'])" 2>/dev/null)

if [ -z "$VECTOR_ROWS" ] || [ "$VECTOR_ROWS" -lt 10 ]; then
  echo "⛔ CONTEXT ENGINE NOT INDEXED — vector store is empty"
  echo ""
  echo "localhost:8088 is up but vector store has no content."
  echo "/index has no MCP equivalent — run it directly (this is the only legitimate REST call):"
  echo ""
  echo "  curl -s -X POST http://localhost:8088/index \\"
  echo "    -H 'Content-Type: application/json' \\"
  echo "    -d '{\"paths\": [\"ryemyster/brain-os/context-store/sessions\"], \"force\": false}'"
  echo ""
  echo "Then retry. All other context-engine calls go through MCP (mcp__context-engine__*)."
  exit 2
fi

exit 0
