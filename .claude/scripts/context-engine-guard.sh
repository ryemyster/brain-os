#!/bin/bash
# Blocks mcp__brain-os__daily if context engine is down.
# Exit 2 = block tool call. Exit 0 = allow.

# Check if context engine is reachable
HEALTH=$(curl -s --max-time 3 http://localhost:8088/healthcheck 2>/dev/null)
if [ -z "$HEALTH" ]; then
  echo "⚠️  localhost:8088 is unreachable — skipping guard. Proceed with recall + external APIs."
  exit 0
fi

# Engine is up — check ok field
OK=$(echo "$HEALTH" | python3 -c "import sys,json; print(json.load(sys.stdin).get('ok',''))" 2>/dev/null)
if [ "$OK" != "True" ] && [ "$OK" != "true" ]; then
  echo "⛔ CONTEXT ENGINE UNHEALTHY — healthcheck returned: $HEALTH"
  echo "Run: curl http://localhost:8088/healthcheck"
  exit 2
fi

# Engine healthy. Before calling daily, run /index if the vector store needs it:
#   curl -s -X POST http://localhost:8088/index \
#     -H 'Content-Type: application/json' \
#     -d '{"paths": ["ryemyster/brain-os/context-store/sessions"], "force": false}'
# /index has no MCP equivalent — this is the only legitimate direct REST call.
exit 0
