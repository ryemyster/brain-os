# MCP Servers

Centralized reference for all Model Context Protocol servers configured in this workspace. These provide Claude with specialized tools and integrations.

---

## Servers Summary

| Server | Type | Location | Status | Purpose |
|--------|------|----------|--------|---------|
| `brain-os` | stdio | `brain-os-mcp/dist/index.js` | ✅ Active | Job hunt tools + writing persistence |
| `founder-os` | stdio | `../ascendvent/founderos/dist/index.js` | ✅ Active | Product discovery for Ascendvent |
| `github` | HTTP | `https://api.githubcopilot.com/mcp/` | 🟡 Phase 4 | Repo activity (not yet integrated) |

---

## Brain-OS Server

**Purpose:** Provides 12 tools for job hunting, interview prep, and research synthesis.

**Location:** `brain-os-mcp/` (TypeScript source, compiled to `dist/index.js`)

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

**Configuration:** Registered in `~/.claude/settings.json` with `BRAIN_ROOT` environment variable pointing to project root.

**Build:** `npm run build` inside `brain-os-mcp/`

**How to rebuild after changes:**
```bash
cd brain-os-mcp
npm run build
```

Then restart Claude Code session to load new build.

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
- Link to `projects/index.md` updates

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
│  remember tool writes to context/      │
│  (companies, sessions, stories)        │
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

### remember → context/

1. User calls `remember type=company|session|story|insight` with content
2. Writes to local file: `context/companies/`, `context/sessions/`, `context/stories/`, or `context/insights/`
3. (Phase 5) Also syncs to Notion pipeline database

---

## Environment Variables

| Variable | Purpose | Set in |
|----------|---------|--------|
| `BRAIN_ROOT` | Path to project root | `.claude/settings.json` (brain-os server env) |
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

1. Check that build is current: `npm run build` inside `brain-os-mcp/`
2. Verify registration in `~/.claude/settings.json` (paths and env vars)
3. Test direct call: `echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | BRAIN_ROOT=/path node dist/index.js`
4. Restart Claude Code session to reload

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
| LanceDB semantic search | 5 | ⏳ Planned | Issue #9 |

