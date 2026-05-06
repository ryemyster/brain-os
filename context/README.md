# Memory & Context Store

This directory is the persistent memory layer for BrainOS. It is written to automatically by MCP tools and can be read by any tool to inform responses.

## Current architecture — file-based context store

All persistence is flat markdown files, written and read by `brain-os-mcp/src/context.ts`.

| Path | Written by | Contains |
|------|-----------|---------|
| `companies/{slug}.md` | `intel`, `outreach`, `remember` | Intel reports, outreach history, notes per company |
| `stories/{theme}.md` | `story_draft`, `remember` | Polished STAR stories by theme |
| `sessions/{date}-{company}-{type}.md` | `proctor`, `remember` | Mock interview session summaries |
| `patterns.md` | `diagnose` | Recurring interview failure patterns and practice priorities |
| `outreach-log.md` | `outreach` | Chronological log of all outreach activity |
| `insights.md` | `remember` | Ad-hoc insights and tasks saved during sessions |
| `experience.md` | Manual | Background context on Ryan's experience arc |
| `positioning-*.md` | Manual | Positioning snapshots at a point in time |

## How learning works today

Tools write to this store as a side effect of doing work:
- `intel` → writes to `companies/{slug}.md`
- `outreach` → writes to `outreach-log.md` and `companies/{slug}.md`
- `proctor` → writes session summary to `sessions/`
- `diagnose` → reads all sessions and writes updated `patterns.md`
- `remember` → explicit save of any type

On the next call, tools read back what was written — so context accumulates over time. This is the "learns as it goes" layer.

## What's missing — Phase 5: Vector store

File-based context works for retrieval by known key (company name, story theme). It does not support semantic search — "find everything relevant to my experience with HealthTech" or "what stories relate to cross-functional influence?"

**Planned: LanceDB integration** (tracked in GitHub issue #9)

- Embed all context files on write
- Add a `search` tool or enrich existing tools with semantic retrieval
- `prep` and `apply` automatically surface the most relevant stories and intel without needing exact matches
- `diagnose` can cluster sessions by pattern, not just read them linearly

Until then: use `remember` explicitly after every session to ensure nothing is lost, and use specific labels so file-based lookup works reliably.
