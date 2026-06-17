# BrainOS Context Contract

This repo is the BrainOS orchestration workspace.

Local durable context lives in `context-store/`.

The orchestration layer owns:

- reading local context files
- selecting relevant context
- summarizing large context
- passing explicit context into BrainOS MCP tools
- writing durable local notes back into `context-store/`

The standalone MCP server owns:

- MCP tool schemas
- validation
- LLM/tool execution
- configured service integrations
- Supabase/Notion memory writes when explicitly requested

The MCP server must not read this repo's filesystem layout directly.

Before calling MCP tools, gather only the minimum relevant context from `context-store/`.

## Context Lookup Order

Always check local and stored context before calling external APIs. Follow this sequence:

**0. Context engine check (once per session)** — call any `mcp__context-engine__*` tool (e.g. `load_context`). If it responds, the engine is up. Skip if already done this session.

**1. context-engine MCP** — local files, free, fast. Path prefix: `ryemyster/brain-os/` — never a bare `"."`.
Healthcheck: `engine_down` error → fall back to direct file reading.
Wave scan order: sessions → context → career. One subdirectory per wave; stop when found.
See `.claude/rules/context-engine.md` for full tool decision table and wave pattern.

**2. `recall` + `search` (BrainOS MCP)** — Supabase memory lookup
- `recall(action="list", listType="company")` — enumerate stored company labels (cold-start check)
- `recall(type=company, label=<slug>)` — key-value load by exact label; returns `{ content, updatedAt, label, type }`
- `search(query="<topic>", type?="company")` — pgvector semantic search; use when label is unknown or for discovery
- Call before every `intel`, `fit`, `prep`, `apply`, `outreach` invocation.
- Check `updatedAt` on recall hits — re-run tool if >30d (company intel) or >7d (pipeline state).

**3. External APIs** (Gmail, Google Calendar, Notion MCP) — live data only
Use only for what layers 1 and 2 cannot provide: new emails, today's calendar, live Notion rows.
These are the freshness delta, not the starting point.

**4. `remember`** — write new context back after any substantive session.

## Operating Rule

Do not pass folder dumps to MCP tools. Read the smallest relevant files, summarize them when large, and pass only the context the tool needs for the specific task.

## Current Context Roots

| Path | Purpose |
|------|---------|
| `context-store/career/` | Resume, achievements, voice, job criteria, pipeline, interview notes |
| `context-store/writing/` | Drafts, published writing, and idea backlog |
| `context-store/projects/` | Project index and cross-repo status |
| `context-store/context/` | Human-readable memory, insights, stories, companies |
| `context-store/sessions/` | Session notes and auto-written session summaries |
| `concept-images/` | Private visual inspiration/reference only |
