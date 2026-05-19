# MCP Servers

Centralized reference for all Model Context Protocol servers configured in this workspace. These provide Claude with specialized tools and integrations.

---

## Servers Summary

| Server | Type | Location | Status | Purpose |
|--------|------|----------|--------|---------|
| `brain-os` | stdio | `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp/dist/index.js` | ✅ Active | Job hunt tools + operational memory |
| `founder-os` | stdio | `../ascendvent/founderos/dist/index.js` | ✅ Active | Product discovery for Ascendvent |
| `github` | HTTP | `https://api.githubcopilot.com/mcp/` | 🟡 Phase 4 | Repo activity (not yet integrated) |

---

## Brain-OS Server

**Purpose:** Provides tools for job hunting, interview prep, research synthesis, and operational memory.

**Location:** sibling repo `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp`

This root repo is the Claude Code orchestration workspace. MCP server development belongs in the sibling repo.

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
- `remember` — Persistence to context store

**Integrations:**
- **Google Calendar** (pre-fetch for `daily`)
- **Gmail** (pre-fetch for `daily`)
- **Notion** (read job pipeline, write research findings)

**Configuration:** Registered in local Claude settings with:

- command path pointing to `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp/dist/index.js`

Do not store local settings or tokens in git.

Do not configure the MCP server to depend on this repo's filesystem layout. Orchestration should gather relevant context from `context-store/` and pass concise context into MCP tools explicitly.

**Build:** build from the sibling MCP repo only, after explicit approval.

---

## Founder-OS Server

**Purpose:** Provides tools for product discovery and Ascendvent strategy work.

**Location:** `../ascendvent/founderos/dist/index.js`

**Status:** Active but documented separately (see `ascendvent-planning/` CLAUDE.md)

**When to use:** When working in `ascendvent-planning/` or other Ascendvent repos; not primary focus in brain-os

---

## GitHub Server (Phase 4)

**Purpose:** Provides repo activity and insights across all projects.

**Location:** `https://api.githubcopilot.com/mcp/` (HTTP endpoint)

**Status:** 🟡 Configured but not yet integrated into brain-os tools

**What it provides (planned):**
- Repo activity summaries
- Issue/PR status
- Contribution history
- Code health metrics

**Next steps:**
- Integrate into `daily` tool to show project status
- Surface in project reviews
- Link to `context-store/projects/index.md` updates

---

## Data Flow

### Brain-OS Integrations

```
┌─────────────────────────────────────────┐
│         Claude Code Session             │
├─────────────────────────────────────────┤
│                                         │
│  User input / Tool calls                │
│         ↓                               │
│  brain-os MCP server                   │
│  ├─→ Google Calendar API                │
│  ├─→ Gmail API                          │
│  ├─→ Notion API (read/write)            │
│  └─→ Claude internal (for generated tools)
│         ↓                               │
│  Tools return structured output         │
│         ↓                               │
│  PostToolUse hooks fire                 │
│    (prompt to remember)                 │
│         ↓                               │
│  remember tool writes to operational memory          │
│  local notes stay under context-store/               │
│         ↓                               │
│  Stop hook runs (session-write.sh)     │
│    (archives old sessions)              │
│                                         │
└─────────────────────────────────────────┘
```

### Google Calendar → daily

1. User calls `/daily` or Claude calls `mcp__brain-os__daily`
2. Pre-fetch: `mcp__claude_ai_Google_Calendar__list_events` (next 7 days)
3. Tool receives structured calendar data
4. Returns: Interview dates, deadlines, scheduled events mixed with pipeline status

### Gmail → daily

1. Pre-fetch: `mcp__claude_ai_Gmail__search_threads` (job-related, last 7 days)
2. Tool receives email threads
3. Returns: Application follow-ups, recruiter messages, deadline reminders

### Notion → prep/fit/apply

1. User provides company name to `prep`, `fit`, or `apply`
2. Tool queries Notion job pipeline database
3. Returns: Company history, fit notes, interview progress
4. Appends new findings back via `remember` → `notion-update-page`

### remember → operational memory

1. User calls `remember type=company|session|story|insight` with content
2. Saves through the MCP server's operational memory layer.
3. Human-readable/manual context remains in this repo under `context-store/context/`.

The orchestration layer is responsible for reading, selecting, and summarizing local `context-store/` files before calling BrainOS MCP tools. The MCP server should receive explicit context and should not depend on this repo's filesystem layout.

---

## Environment Variables

| Variable | Purpose | Set in |
|----------|---------|--------|
| `BRAIN_ROOT` | Legacy only; do not use for direct repo context reads | avoid for new workflows |
| `NOTION_TOKEN` | Notion API authentication | `~/.claude/settings.json` env |
| `ANTHROPIC_API_KEY` | For Claude API calls within tools | `~/.claude/settings.json` env (optional, uses local token if set) |

---

## To Add a New MCP Server

1. **Register in `~/.claude/settings.json`** under `mcpServers`:
   ```json
   "new-server": {
     "type": "stdio",
     "command": "node",
     "args": ["/path/to/dist/index.js"],
     "env": {"KEY": "value"}
   }
   ```

2. **Create `.claude/MCP-SERVERS.md` entry** (or update this file)

3. **Add permission allowlist** entries to `.claude/settings.json` for any tools you want pre-approved:
   ```json
   "mcp__new-server__tool-name"
   ```

4. **Document in `CLAUDE.md`** if it's a primary workflow tool

5. **Test with `mcp-call`** if available:
   ```bash
   mcp-call new-server tool-name args
   ```

---

## Troubleshooting

### Brain-OS tools not responding

1. Switch to sibling repo `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp`.
2. Check that its build output exists at `dist/index.js`.
3. Verify local Claude MCP registration points to the sibling repo.
4. Run build or direct smoke tests only after explicit approval.
5. Restart Claude Code session to reload.

### Google Calendar/Gmail not loading in `daily`

1. Verify allowlist includes `mcp__claude_ai_Google_Calendar__list_events` and `mcp__claude_ai_Gmail__search_threads`
2. Check that both calls are pre-fetched before `daily` runs (requires explicit user call first)
3. Verify OAuth tokens are valid in Claude Code settings

### Notion writes failing

1. Verify `NOTION_TOKEN` is set in `~/.claude/settings.json`
2. Check that `notion-update-page` and `notion-create-pages` are in allowlist
3. Verify target page/database IDs exist and are accessible

---

## Phase Status

| Feature | Phase | Status | Notes |
|---------|-------|--------|-------|
| Brain-OS tools (12) | 1-3 | ✅ Live | All tools active and documented |
| Google Calendar integration | 4 | ✅ Live | Pre-fetch for `daily` |
| Gmail integration | 4 | ✅ Live | Pre-fetch for `daily` |
| Notion pipeline tracking | 4 | ✅ Live | Read/write via `remember` |
| GitHub MCP | 4 | 🟡 Waiting | Configured, not integrated into tools |
| GitHub repo health feed | 4 | ⏳ Planned | To integrate into `daily` |
| Google Analytics integration | 5 | ⏳ Planned | Writing performance dashboard |
| Vector retrieval / semantic memory | 5 | 🟡 In progress | Implemented by BrainOS MCP server memory layer |
