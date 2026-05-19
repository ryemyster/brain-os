#!/bin/bash
# Archive sessions older than 30 days to reduce context load

SESSIONS_DIR="/Users/rmcdonald/Repos/ryemyster/brain-os/context-store/sessions"
ARCHIVE_DIR="$SESSIONS_DIR/archive"
DAYS_THRESHOLD=30

if [ ! -d "$SESSIONS_DIR" ]; then
  exit 0
fi

find "$SESSIONS_DIR" -maxdepth 1 -name "*.md" -type f -mtime +$DAYS_THRESHOLD | while read file; do
  if [ -f "$file" ]; then
    mv "$file" "$ARCHIVE_DIR/" 2>/dev/null
  fi
done
