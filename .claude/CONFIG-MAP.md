# Brain-OS Configuration Map

One-page reference: what each component does, where it's documented, what needs syncing.

---

## The System at a Glance

```
┌─────────────────────────────────────────────────────────┐
│                    CLAUDE CODE SESSION                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  /skill-name  ──→  .claude/skills/skill-name.md          │
│       ↓                                                   │
│  prompt ──→  Claude Code harness                        │
│       ↓                                                   │
│  Tool calls ──→  MCP Servers                            │
│       ↓                                                   │
│  ┌─────────────────────────────────────────────────┐    │
│  │ brain-os        (12 tools)                      │    │
│  │ ├─ daily        ──→ Google Calendar + Gmail    │    │
│  │ ├─ prep/fit/apply/intel/outreach              │    │
│  │ ├─ scan/proctor/diagnose/loop                 │    │
│  │ ├─ story_draft                                 │    │
│  │ └─ remember ──→ writes to context/            │    │
│  │                                                 │    │
│  │ founder-os      (Product discovery)             │    │
│  │                                                 │    │
│  │ github          (Repo activity - Phase 4)       │    │
│  └─────────────────────────────────────────────────┘    │
│       ↓                                                   │
│  Hooks (Stop, PostToolUse) ──→ Auto-persist via        │
│                                 remember + session-write │
│       ↓                                                   │
│  context/  (companies, sessions, stories)               │
│  ~/.claude/projects/memory/                             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## Component Directory

### 1. Skills (User-Facing Workflows)

**Location:** `.claude/skills/*.md`

| Skill | File | Purpose | Chains |
|-------|------|---------|--------|
| Job Search | `job-search.md` | Orchestrates full job hunt (scan → intel → fit → prep → apply) | All 12 brain-os tools |
| Prep Loop | `prep-loop.md` | Quick sequence: intel → fit → prep | intel, fit, prep |
| Build BrainOS | `build-brainos.md` | Rebuild MCP server, show errors | none (bash) |
| Sync Context | `sync-context.md` | Session summary + persistence | remember |
| Doc Coauth | `doc-coauthoring.md` | Structured doc writing workflow | none (Claude only) |

**Documented in:** `.claude/skills/README.md` (currently stale — says "no skills")

---

### 2. MCP Tools (brain-os server)

**Location:** `brain-os-mcp/src/server.ts`

**Tool Categories:**

**Discovery & Research (context-loaders — return JSON tasks):**
- `scan` — market scan for hiring PM roles
- `intel` — company research (funding, org, strategy)
- `loop` — MAANG interview loop reference
- `proctor` — mock interview
- `story_draft` — STAR story mining

**Application Tools (generated — return finished text):**
- `apply` — gap analysis + cover letter
- `outreach` — DM + email drafts + warm intros

**Planning Tools (generated):**
- `prep` — interview prep for a company
- `fit` — fit scoring for a company
- `diagnose` — pattern analysis from interview notes
- `daily` — morning brief (pulls Google Calendar + Gmail)

**Persistence:**
- `remember` — writes to context store (companies, sessions, stories, insights)

**Documented in:** `brain-os-mcp/README.md` (stale — says 11 tools, missing remember, Phase 4 says "not yet")

---

### 3. Integrations (Data In/Out)

**Google Calendar:**
- **What it does:** Provides interview dates, deadlines, events
- **How it's used:** Pre-fetched for `daily` tool
- **Configured in:** `.claude/settings.json` allowlist
- **Documented in:** (none — should be in MCP-SERVERS.md)

**Gmail:**
- **What it does:** Surfaces job-related email threads
- **How it's used:** Pre-fetched for `daily` tool
- **Configured in:** `.claude/settings.json` allowlist
- **Documented in:** (none — should be in MCP-SERVERS.md)

**Notion:**
- **What it does:** Stores job pipeline, company research, stories, interview notes
- **How it's used:** Read by prep/fit, written by remember
- **Configured in:** `~/.claude/settings.json` (NOTION_TOKEN env var)
- **Documented in:** (none — should be in MCP-SERVERS.md)

**GitHub (Phase 4):**
- **What it does:** Repo activity across all projects
- **How it's used:** Not yet integrated
- **Configured in:** `~/.claude/settings.json` (HTTP endpoint)
- **Documented in:** (none)

---

### 4. Hooks (Automation Rules)

**Location:** `.claude/settings.json` → "hooks"

**Stop Hook (runs on session end):**
```
Command: ./.claude/scripts/session-write.sh
Purpose: Archive old sessions, write session summary
```

**PostToolUse Hooks (fire after specific tools):**

| Tool | Action |
|------|--------|
| intel | Remind: call remember type=company |
| fit | Remind: call remember type=company |
| prep | Remind: call remember type=company |
| apply | Remind: call remember type=session |
| outreach | Remind: call remember type=company |
| story_draft | Remind: call remember type=story |
| diagnose | Remind: call remember type=insight |
| scan | Remind: call remember type=session |

**Documented in:** `.claude/rules/README.md` (stale — says "None" configured)

---

### 5. Context Store (Persistence Layer)

**Location:** `context/` + `~/.claude/projects/.../memory/`

**What gets stored:**

| Type | Location | Written by | Read by |
|------|----------|-----------|---------|
| Company intel/fit/prep | `context/companies/` | remember (manual) | next session |
| Interview notes | `career/interview-notes/` | user | diagnose, proctor |
| Job pipeline | Notion (primary) | remember (manual) | daily, prep, fit |
| STAR stories | `context/stories/` | remember (manual) | prep, interview |
| Session summaries | `context/sessions/` | remember + Stop hook | future sessions |
| Recurring patterns | `context/insights/` | remember (manual) | diagnose |

**Documented in:** `context/README.md` ✅, `CLAUDE.md` ✅

---

### 6. Career Files (Brain Content)

**Location:** `career/`

| File | Purpose | Used by |
|------|---------|---------|
| `resume.md` | Full resume | apply, fit, prep, proctor |
| `achievements.md` | Wins with metrics | apply, story_draft, prep |
| `voice-and-style.md` | Writing tone & patterns | apply, outreach, story_draft |
| `job-criteria.md` | Role preferences | scan, fit |
| `portfolio.md` | Projects shipped | apply, fit, prep |
| `pipeline/` | Companies in pursuit | daily, fit, prep |
| `interview-notes/` | Post-interview debriefs | diagnose, proctor |

**Documented in:** `CLAUDE.md` ✅

---

### 7. Project Files (Founder Content)

**Location:** `projects/`, `ascendvent-planning/`

| File | Purpose | Used by |
|------|---------|---------|
| `projects/index.md` | 13 active projects status | daily, founder-os |
| `ascendvent-planning/` | Ascendvent strategy brain | founder-os |

**Documented in:** `CLAUDE.md` ✅

---

## Data Flow Examples

### Morning Brief (`/daily`)

```
Google Calendar (next 7 days)  ┐
                                ├──→ daily tool ──→ Claude ──→ Text output
Gmail (job threads)            ┤
Job pipeline (Notion)          ┤
Writing queue (project files)  ┘
```

### Interview Prep (`/prep-loop`)

```
Company name
    ↓
intel ──→ (web search) ──→ Company research
    ↓
fit ──→ (resume + achievements) ──→ Fit score
    ↓
prep ──→ (pipeline + interview history) ──→ Prep brief
    ↓
Output: Intel | Fit | Prep (unified)
    ↓
(Post-hook) → remind: call remember type=company
```

### Session Persistence

```
Tool runs (intel/fit/prep/apply/etc.)
    ↓
PostToolUse hook fires
    ↓
Prompt: "Call remember type=X"
    ↓
User calls: remember type=company label=X content=Y
    ↓
Written to: context/companies/X.md
    ↓
At session end: Stop hook → session-write.sh
    ↓
Session summary written to: context/sessions/YYYY-MM-DD.md
```

---

## Configuration Checklist

### To add a new skill:
1. Create `.claude/skills/skill-name.md`
2. Update `.claude/skills/README.md` to document it
3. (Optional) Create hook in `.claude/settings.json` if it needs auto-triggers

### To add a new MCP tool (brain-os):
1. Create `brain-os-mcp/src/tools/tool-name.ts`
2. Register in `brain-os-mcp/src/server.ts`
3. Update `brain-os-mcp/README.md` with tool count + description
4. Run `npm run build`
5. Test with `mcp-call` if needed

### To add a new MCP server:
1. Register in `~/.claude/settings.json` under mcpServers
2. Create `.claude/MCP-SERVERS.md` entry (or update existing)
3. Add allowlist entries to `.claude/settings.json` permissions if needed

### To add a new hook:
1. Add to `.claude/settings.json` under hooks
2. Update `.claude/rules/README.md` to document it
3. Test by triggering the hook

---

## Currently Stale Docs

| File | Issue | Priority |
|------|-------|----------|
| `brain-os-mcp/README.md` | Tool count (11→12), missing remember, Phase 4 marked "not yet" | 🔴 High |
| `.claude/rules/README.md` | Says "None" hooks when 8 are active | 🔴 High |
| `.claude/skills/README.md` | Says "no skills" when 5 exist | 🔴 High |
| (missing) `.claude/MCP-SERVERS.md` | No central reference for 3 servers | 🟡 Medium |
| (missing) `.claude/INTEGRATIONS.md` | No docs on Calendar/Gmail/Notion flow | 🟡 Medium |

---

## Quick Links

| Document | Purpose |
|----------|---------|
| `CLAUDE.md` | Overview of who you are, what projects exist, MCP tools |
| `AUDIT.md` | Full audit of stale vs current documentation (this audit) |
| `CONFIG-MAP.md` | This file — quick reference for how pieces fit together |
| `brain-os-mcp/README.md` | How brain-os MCP works, setup, tools (needs update) |
| `.claude/skills/README.md` | How to create skills (needs update) |
| `.claude/rules/README.md` | Hook documentation (needs update) |
| `.claude/agents/README.md` | Future agent architecture (accurate, no action) |
| `context/README.md` | What gets stored where (accurate) |

