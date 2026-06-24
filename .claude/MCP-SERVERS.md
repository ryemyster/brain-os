# MCP Servers

Centralized reference for all Model Context Protocol servers configured in this workspace.

---

## Servers Summary

| Server | Type | Location | Status | Purpose |
|--------|------|----------|--------|---------|
| `brain-os` | stdio | `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp/dist/index.js` | ✅ Active | Job hunt tools + operational memory |
| `context-engine` | HTTP MCP | `http://127.0.0.1:8089/mcp` | ✅ Active | Local file retrieval, vector search, code investigation |
| `github` | HTTP | `https://api.githubcopilot.com/mcp/` | 🟡 Enabled, not integrated | Repo activity (not yet wired into any skill) |
| `claude_ai_Gmail` | claude.ai managed | — | ✅ Active | Gmail read/search |
| `claude_ai_Google_Calendar` | claude.ai managed | — | ✅ Active | Calendar read/write |
| `claude_ai_Notion` | claude.ai managed | — | ✅ Active | Notion read/write |
| `founder-os` | stdio | `../ascendvent/founderos/dist/index.js` | ❌ Disabled | Product discovery (Ascendvent only) |

---

## Brain-OS Server

**Tool prefix:** `mcp__brain-os__*`

**Purpose:** Job hunting, interview prep, research synthesis, and operational memory.

**Location:** sibling repo `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp`

This root repo is the Claude Code orchestration workspace. MCP server development belongs in the sibling repo. Do not edit brain-os-mcp from this session.

**Tools:**
- `daily` — Morning brief (calendar + email + pipeline)
- `scan` — Market opportunity scan
- `intel` — Company research
- `fit` — Fit scoring
- `prep` — Interview prep
- `apply` — Gap analysis + cover letter
- `outreach` — DM + email drafts
- `proctor` — Mock interview
- `diagnose` — Interview pattern analysis
- `story_draft` — STAR story mining
- `loop` — MAANG interview loop reference
- `remember` — Persistence to Supabase context store
- `recall` — Retrieve stored memories by label or type
- `search` — Semantic search over stored memories

**Troubleshooting:**
1. Switch to sibling repo `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp`
2. Check that `dist/index.js` exists
3. Restart Claude Code session to reload

---

## Context Engine

**Tool prefix:** `mcp__context-engine__*`

**Purpose:** Local file retrieval, vector search, code investigation, and diff review. Backed by Ollama + Supabase pgvector.

**Location:** HTTP MCP at `http://127.0.0.1:8089/mcp`

**REST admin (debug only):** `GET http://localhost:8088/setup`

**Path prefix for this repo:** `ryemyster/brain-os`

**Primary tools:**
- `load_context` — Default first pass; bounded pre-task inventory
- `investigate_codebase` — Deep agent loop (10–50 min); for multi-step investigation needing planning, memory, repair passes
- `find_in_code` — Mechanical concept lookup
- `vector_search` — Semantic similarity search (requires `/index` to have run)
- `scan_directory` — Directory inventory
- `summarize_file` — Single-file summary
- `review_diff` — Git diff review (required gate after every Edit/Write)
- `audit_issue` — Evidence-based issue triage

See `.claude/rules/context-engine.md` for the full decision table, wave scan order, and timing notes.

---

## GitHub

**Tool prefix:** `mcp__github__*`

**Status:** Enabled but not yet integrated into any brain-os skill or workflow.

**Next step:** Integrate repo activity summary into `/daily` (project status block). Until then, available for ad-hoc use only.

---

## Cloud MCP Servers (claude.ai managed)

These are provided by claude.ai and do not require local configuration.

| Server | Primary use |
|--------|------------|
| `claude_ai_Gmail` | Pre-fetch for `/daily`; job search email monitoring |
| `claude_ai_Google_Calendar` | Pre-fetch for `/daily`; interview scheduling |
| `claude_ai_Notion` | Pipeline tracking; prep material writes |

---

## Founder-OS (Disabled)

**Status:** Explicitly disabled in `.claude/settings.local.json`.

**Why:** Founder-OS is for Ascendvent product work, not job-search orchestration. Enable only when working in an Ascendvent context. See `~/.claude/rules/founderos-read-only.md`.

---

## Data Flow

```
User / Claude Code
    ↓
brain-os MCP server (job hunt tools)
    ├─→ Google Calendar API (via claude.ai)
    ├─→ Gmail API (via claude.ai)
    ├─→ Notion API (via claude.ai)
    └─→ Supabase (operational memory)

context-engine MCP server (file retrieval)
    ├─→ Local filesystem (ryemyster/brain-os/*)
    ├─→ Ollama (qwen2.5-coder:3b / qwen3:4b / qwen3.5:9b)
    └─→ Supabase pgvector (semantic search)
```

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NOTION_TOKEN` | Notion API auth — set in `~/.claude/settings.json` env |
| `ANTHROPIC_API_KEY` | For Claude API calls within tools (optional) |

Never store real tokens in this repo. Use `.env.example` for placeholders.

---

## To Add a New MCP Server

1. Register in `~/.claude/settings.json` under `mcpServers`
2. Add an entry to this file
3. Add permission allowlist entries to `.claude/settings.json`
4. Document in `CLAUDE.md` if it's a primary workflow tool
