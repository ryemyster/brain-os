#!/bin/bash
# pipeline-guard.sh
# PreToolUse hook on Write + Edit
# If the target file touches pipeline or career context, block and demand remember() first.

input=$(cat)
file_path=$(echo "$input" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('file_path',''))" 2>/dev/null)

if echo "$file_path" | grep -qE "(pipeline|career|context-store/sessions)"; then
  python3 -c "
import json
print(json.dumps({
  'hookSpecificOutput': {
    'additionalContext': '⛔ PIPELINE GUARD: You are writing to a pipeline/career/session file. STOP. Have you called mcp__brain-os__remember() yet? The vector store is the PRIMARY retrieval layer — remember() MUST be called FIRST before any Notion write, pipeline.md edit, or session file write. Call remember() now if not done, then proceed.'
  }
}))
"
fi
