#!/usr/bin/env bash
# Injects the current date, time, and week ranges into Claude Code context at session start.
# Fired by the Start hook in settings.json.

DAY=$(date '+%A')
DATE=$(date '+%B %-d, %Y')
ISO=$(date '+%Y-%m-%d')
TIME=$(date '+%-I:%M %p %Z')

# Compute current week Mon–Sun (ISO week, Mon=start)
DOW=$(date '+%u')  # 1=Mon … 7=Sun
WEEK_START=$(date -v -"$((DOW - 1))"d '+%Y-%m-%d')
WEEK_END=$(date -v +"$((7 - DOW))"d '+%Y-%m-%d')

# Last week
LAST_START=$(date -v -"$((DOW + 6))"d '+%Y-%m-%d')
LAST_END=$(date -v -"${DOW}"d '+%Y-%m-%d')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📅 TODAY: $DAY, $DATE ($ISO)"
echo "🕐 TIME:  $TIME"
echo "📆 THIS WEEK: $WEEK_START → $WEEK_END"
echo "📆 LAST WEEK: $LAST_START → $LAST_END"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Use the above as the authoritative current date and time for this session."
echo "When answering date-relative requests (\"last week\", \"this week\", \"yesterday\"),"
echo "anchor ALL date math to TODAY and the week ranges above — never infer from file order."
