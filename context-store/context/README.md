# Memory & Context Store

This directory is the human-readable context layer for BrainOS. It holds manual notes, durable context, and session artifacts for Claude Code.

Operational memory is handled by the sibling BrainOS MCP server repo:

`/Users/rmcdonald/Repos/ryemyster/brain-os-mcp`

That server uses Supabase plus embeddings/vector retrieval for machine-readable memory. This directory remains useful because it is editable, reviewable, and easy for humans to maintain.

## Current Human-Readable Context

| Path | Written by | Contains |
|------|-----------|---------|
| `companies/{slug}.md` | Manual or legacy MCP output | Intel reports, outreach history, notes per company |
| `stories/{theme}.md` | Manual or legacy MCP output | Polished STAR stories by theme |
| `../sessions/{date}-{company}-{type}.md` | Manual, hooks, or legacy MCP output | Session summaries and notes |
| `patterns.md` | Manual or legacy MCP output | Recurring interview failure patterns and practice priorities |
| `outreach-log.md` | Manual or legacy MCP output | Chronological outreach history |
| `insights.md` | Manual or memory export | Ad-hoc insights and tasks saved during sessions |
| `experience.md` | Manual | Background context on Ryan's experience arc |
| `positioning-*.md` | Manual | Positioning snapshots at a point in time |

## How learning works today

BrainOS has two memory surfaces:

- Human-readable context in this repo: markdown files that can be reviewed and edited directly.
- Operational memory in the MCP server: Supabase-backed memory with embeddings/vector retrieval.

The goal is for Claude to use durable context without requiring every session to carry the whole repo in active chat.

## Retrieval Model

Markdown context works well for known files and human review. Operational memory works better for semantic retrieval, clustering, and "find relevant past context" workflows.

When adding durable knowledge:

- Put canonical, human-maintained facts in markdown.
- Use `remember` or BrainOS MCP workflows for operational memory.
- Keep labels specific so future retrieval is accurate.
