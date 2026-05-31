---
name: daily
description: Start-of-day briefing. Surfaces calendar, email, job pipeline, and open threads from yesterday. Use when Ryan wants to know what's on his plate, starts a morning session, or asks for a daily brief.
---

# Daily Briefing

Start-of-day orientation for Ryan. Scans local context first, then calls the daily MCP tool to pull live data.

## Step 0 — Context engine (always run; session memory alone is not enough)

This skill handles both "what happened today" (backward-looking) and "what's tomorrow" (forward-looking). Session memory only covers the current conversation — the context store has prior-session data that is invisible without this scan.

```bash
curl -s http://localhost:8088/healthcheck
```
If up, run two waves and stop when found:

**Wave 1 — today's session notes:**
```
POST /find {"path": "ryemyster/brain-os/context-store/sessions", "query": "YYYY-MM-DD session summary pipeline"}
```
Surface: pipeline moves, decisions made, unemployment activity, interview prep, open items.

**Wave 2 — broader context (only if wave 1 insufficient):**
```
POST /find {"path": "ryemyster/brain-os/context-store/context", "query": "active pipeline open threads"}
```

Use `POST /vector-search {"query": "recent session pipeline open threads"}` to retrieve indexed session context. Pass relevant pipeline state and open threads as `pipelineNotes` to step 1.

## Step 1 — Pre-fetch external data (orchestrator responsibility)

The daily MCP tool expects all external data as inputs — it does NOT call Calendar, Gmail, or Notion itself. Pre-fetch before calling:

```
mcp__claude_ai_Google_Calendar__list_events  startTime=today, endTime=+7d
mcp__claude_ai_Gmail__search_threads  query="interview OR recruiter OR application newer_than:7d"
```

Notion pipeline is optional — skip if recall has fresh pipeline state (<7d).

## Step 2 — Daily MCP tool

Call `mcp__brain-os__daily` with all pre-fetched data:
- `calendarEvents` — from Calendar MCP
- `gmailThreads` — from Gmail MCP
- `recentSessions` — from step 0 context engine scan
- `pipelineSummary` — synthesized from step 0 + recall

## Step 3 — Surface the briefing

Present in this order:
1. **Calendar** — what's happening today and tomorrow
2. **Email** — anything that needs a response or action
3. **Pipeline** — active companies, statuses, follow-ups due
4. **Open threads** — anything carried forward from yesterday

Lead with the highest-leverage action. Keep it scannable — bullets, not prose.

## Step 3 — Persist (if anything new surfaced)

If the daily tool surfaces new pipeline state or decisions, call:
```
remember(type=session, label=YYYY-MM-DD-daily, content=<brief summary>)
```
