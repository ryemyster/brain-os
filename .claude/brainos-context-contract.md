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

**0. GET /setup (once per session)** — load the live integration protocol before any code or MCP task
```bash
curl -s http://localhost:8088/setup
```
Skip if the protocol is already loaded this session.

**1. localhost:8088 (context engine)** — local files, free, fast
```bash
curl -s http://localhost:8088/healthcheck  # verify up first
POST /find   {"path": "ryemyster/brain-os/context-store", "query": "..."}  → semantic search
POST /summarize {"file": "ryemyster/brain-os/<path>"}  → deep read of one file
POST /context   {"task": "...", "paths": ["ryemyster/brain-os/..."], "focus": [...]}  → full bundle (code tasks only)
```
**Path prefix for this repo: `ryemyster/brain-os/` — never use a bare `"."`.**
Use `/find` for discovery; only escalate to `/context` when you need a full bundle.
Results are embedded and stored in Supabase pgvector (primary). Use `POST /vector-search` to retrieve previously indexed context before re-calling. If the engine was recently down, check `~/Library/Application Support/context-store/artifacts/` as crash-recovery fallback.

**Wave scanning — never scan a broad path in one call:**
Scan one subdirectory at a time. Stop expanding as soon as the answer is found.
```
Wave 1: POST /find {"path": "ryemyster/brain-os/context-store/sessions", "query": "..."}  → stop if found
Wave 2: POST /find {"path": "ryemyster/brain-os/context-store/context", "query": "..."}   → stop if found
Wave 3: POST /find {"path": "ryemyster/brain-os/context-store/career",  "query": "..."}   → stop if found
```
Never pass `"ryemyster/brain-os"` as the path — that scans the whole repo.

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
