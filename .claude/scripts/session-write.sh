#!/usr/bin/env bash
# Writes a session state file to context-store/sessions/ at the end of every Claude session.
# Fired by the Stop hook. Claude Code passes a JSON payload on stdin with transcript_path.

BRAIN_OS_DIR="/Users/rmcdonald/Repos/ryemyster/brain-os"
SESSIONS_DIR="$BRAIN_OS_DIR/context-store/sessions"
ARCHIVE_DIR="$SESSIONS_DIR/archive"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H-%M)
FILENAME="$SESSIONS_DIR/${DATE}-auto-${TIME}.md"

mkdir -p "$SESSIONS_DIR" "$ARCHIVE_DIR"

# Archive sessions older than 30 days
find "$SESSIONS_DIR" -maxdepth 1 -name "*.md" -type f -mtime +30 -exec mv {} "$ARCHIVE_DIR/" \; 2>/dev/null || true

# Claude Code Stop hook sends JSON on stdin with transcript_path field
PAYLOAD=$(cat 2>/dev/null)

# Extract the transcript path from the payload
TRANSCRIPT_PATH=$(echo "$PAYLOAD" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('transcript_path', ''))
except:
    print('')
" 2>/dev/null)

# Parse the JSONL transcript file to extract the last ~10 assistant turns
SUMMARY=""
if [[ -n "$TRANSCRIPT_PATH" && -f "$TRANSCRIPT_PATH" ]]; then
  SUMMARY=$(python3 -c "
import json, sys

turns = []
with open('$TRANSCRIPT_PATH', 'r') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        try:
            msg = json.loads(line)
            role = msg.get('role', '')
            content = msg.get('content', '')
            if role == 'assistant':
                if isinstance(content, list):
                    text = ' '.join(
                        c.get('text', '') for c in content
                        if isinstance(c, dict) and c.get('type') == 'text'
                    )
                else:
                    text = str(content)
                text = text.strip()
                if text:
                    turns.append(text[:500])
        except:
            continue

# Last 5 assistant turns
recent = turns[-5:] if len(turns) > 5 else turns
for i, t in enumerate(recent, 1):
    print(f'**Turn {i}:** {t}')
    print()
" 2>/dev/null)
fi

# Write the session file — skip if summary is empty (nothing useful to record)
if [[ -z "$SUMMARY" ]]; then
  exit 0
fi

cat > "$FILENAME" <<EOF
---
date: $DATE
time: $TIME
type: auto-session
source: transcript
---

## Session — $DATE $TIME

### Last Assistant Turns

$SUMMARY

---
*Auto-written by Stop hook from transcript. Run \`/sync-context\` to replace with a structured summary.*
EOF

echo "Session note written to $FILENAME"
