#!/usr/bin/env bash
# Injects the current date and time into Claude Code context at session start.
# Fired by the Start hook in settings.json.

DAY=$(date '+%A')
DATE=$(date '+%B %-d, %Y')
TIME=$(date '+%-I:%M %p %Z')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📅 TODAY: $DAY, $DATE"
echo "🕐 TIME:  $TIME"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Use the above as the authoritative current date and time for this session."
