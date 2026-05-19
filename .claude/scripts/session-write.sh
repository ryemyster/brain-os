#!/usr/bin/env bash
# Writes a session state file to context-store/sessions/ at the end of every Claude session.
# Fired by the Stop hook. Reads the session transcript summary from stdin (passed by Claude Code).
# Falls back to a minimal timestamp-only note if no transcript data is available.

BRAIN_OS_DIR="/Users/rmcdonald/Repos/ryemyster/brain-os"
SESSIONS_DIR="$BRAIN_OS_DIR/context-store/sessions"
ARCHIVE_DIR="$SESSIONS_DIR/archive"
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H-%M)
FILENAME="$SESSIONS_DIR/${DATE}-auto-${TIME}.md"

mkdir -p "$SESSIONS_DIR" "$ARCHIVE_DIR"

# Archive sessions older than 30 days
find "$SESSIONS_DIR" -maxdepth 1 -name "*.md" -type f -mtime +30 -exec mv {} "$ARCHIVE_DIR/" \; 2>/dev/null || true

# The Stop hook receives a JSON payload on stdin with session info
# Extract transcript text if available, otherwise write a minimal marker
PAYLOAD=$(cat 2>/dev/null)

TRANSCRIPT=$(echo "$PAYLOAD" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    # Claude Code Stop hook passes transcript in various fields depending on version
    transcript = data.get('transcript', data.get('summary', data.get('conversation', '')))
    if isinstance(transcript, list):
        # Join message contents
        parts = []
        for msg in transcript:
            role = msg.get('role', '')
            content = msg.get('content', '')
            if isinstance(content, list):
                text = ' '.join(c.get('text', '') for c in content if isinstance(c, dict))
            else:
                text = str(content)
            if text.strip():
                parts.append(f'{role}: {text[:300]}')
        print('\n'.join(parts[-10:]))  # last 10 turns
    else:
        print(str(transcript)[:2000])
except Exception as e:
    print('')
" 2>/dev/null)

cat > "$FILENAME" <<EOF
---
date: $DATE
time: $TIME
type: auto-session
---

## Session — $DATE $TIME

$(if [[ -n "$TRANSCRIPT" ]]; then
  echo "$TRANSCRIPT"
else
  echo "(No transcript captured — session ended without summary. Check context-store/sessions/ for manually saved notes from this session.)"
fi)
EOF

echo "Session note written to $FILENAME"
