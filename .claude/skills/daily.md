---
name: daily
description: Start-of-day briefing. Surfaces calendar, email, job pipeline, and open threads from yesterday. Use when Ryan wants to know what's on his plate, starts a morning session, or asks for a daily brief.
---

# Daily Briefing

Start-of-day orientation for Ryan. Scans local context first, then calls the daily MCP tool to pull live data.

## Step 0 — Context engine (skip if session files already in context)

```bash
curl -s http://localhost:8088/healthcheck
```
If up:
```
POST /find {"path": "ryemyster/brain-os/context-store/sessions", "query": "recent session notes open threads"}
```
Read `ai-context/` output. Extract any open threads, follow-ups, or active pipeline state from the last session. Pass these as `pipelineNotes` to step 1.

## Step 1 — Daily MCP tool

Call `mcp__brain-os-mcp__daily` with any `pipelineNotes` from step 0.

The tool pulls Calendar, Gmail, and Notion pipeline on its own — do not pre-fetch those.

## Step 2 — Surface the briefing

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
