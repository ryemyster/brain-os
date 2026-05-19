# BrainOS

Personal AI operating system built on Claude Code. A persistent orchestration workspace that gives Claude consistent context, memory, and structured workflows across sessions.

## What it is

BrainOS is two coordinated repos:

| Repo | Purpose |
|------|---------|
| `brain-os` (this repo) | Orchestration workspace — durable context, career material, rules, skills, agents |
| `brain-os-mcp` | MCP server — tool schemas, service integrations (Notion, Supabase, Gmail, Calendar) |

## How it works

Claude reads from `context-store/` before doing anything, then calls MCP tools with explicit context — never folder dumps.

```
You → Claude Code
       ↓
  context-store/  (resume, achievements, companies, sessions)
       ↓
  brain-os-mcp tools  (daily, apply, prep, intel, scan, outreach…)
       ↓
  Notion / Supabase / Gmail / Calendar / Ollama
```

## Key directories

| Path | Contains |
|------|----------|
| `.claude/` | Skills, agents, hooks, rules, settings |
| `context-store/career/` | Resume, achievements, voice, job criteria |
| `context-store/context/` | Company notes, memory docs, session insights |
| `context-store/projects/` | Cross-repo project status |
| `context-store/sessions/` | Auto-written session summaries |

## Primary workflows

- **Job search** — scan roles, score fit, generate cover letters, draft outreach, prep for interviews
- **Daily brief** — morning context pull from Notion pipeline, calendar, and memory
- **Memory** — `remember` persists session findings to Supabase; `recall` retrieves them

## Rules

- Orchestration layer reads and selects local context; MCP server executes and writes
- MCP server never reads this repo's filesystem directly
- See `.claude/rules/` for token discipline, security, and context contract

## Related

- MCP server: `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp`
- Built by Ryan K. McDonald — Senior PM, AI/FinTech/HealthTech, Founder of Ascendvent / AOSI
