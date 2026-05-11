# Brain-OS Documentation Audit (2026-05-07)

## Executive Summary

Documentation is significantly out of sync with actual configuration. This audit maps current state vs documented state and prioritizes updates.

**Status:** 🔴 Stale — Multiple components documented incorrectly or not at all

---

## 1. MCP Tools (brain-os server)

### Current State ✅
12 tools registered in `brain-os-mcp/src/server.ts`:

| Tool | Type | Purpose |
|------|------|---------|
| `daily` | Generated | Morning brief with pipeline, writing queue, focus items |
| `prep` | Generated | Interview/meeting prep for specific company |
| `apply` | Generated | Gap analysis + cover letter from pasted JD |
| `scan` | Context-loader | Market scan for hiring PM roles matching profile |
| `fit` | Generated | Fit scoring (domain, industry, depth, stage, leadership) |
| `intel` | Context-loader | Company research (funding, org health, strategy, PM org) |
| `outreach` | Generated | LinkedIn DM + email drafts + warm intro paths |
| `proctor` | Context-loader | Mock interview with feedback (product/behavioral/metrics/strategy/vibe-coding) |
| `diagnose` | Generated | Pattern analysis from interview notes |
| `loop` | Context-loader | MAANG interview loop reference |
| `story_draft` | Context-loader | STAR story mining + drafting |
| `remember` | Generated | Persist intel/stories/insights/tasks/sessions to context store |

**Response types:**
- **Generated:** Calls Notion + Claude internally, returns finished text
- **Context-loader:** Returns structured JSON task objects for Claude to act on (needs web search or multi-turn)

### Documentation Status ❌
**File:** `brain-os-mcp/README.md`

**Issues:**
- Says "11 tools" (off by one)
- Lists only `daily`–`loop`, missing `remember`
- Setup paths reference `/Users/rmcdonald/Repos/my-brain/` (should be `/Users/rmcdonald/Repos/ryemyster/brain-os/`)
- Tool descriptions outdated/incomplete

**What needs fixing:**
```
- Update tool count to 12
- Add remember tool to list + description
- Fix all path references
- Clarify generated vs context-loader distinction
```

---

## 2. Google & Notion Integrations

### Current State ✅
**Integrated into brain-os via allowlisted MCP tools in `.claude/settings.json`**

**Google Calendar:**
- `mcp__claude_ai_Google_Calendar__list_events` (pre-fetch for `daily`)

**Gmail:**
- `mcp__claude_ai_Gmail__search_threads` (pre-fetch for `daily`)

**Notion:**
- `notion-search`, `notion-create-pages`, `notion-update-page`, `notion-fetch`
- `notion-create-database`, `notion-query-database-view`

**Status:** Live and in use (Phase 4 complete)

### Documentation Status ❌
**File:** `brain-os-mcp/README.md` (Phase 4 Integrations section)

**Issues:**
- Lists as "not yet built" when they're actually active
- No documentation on what Notion integration does (stores pipeline, research, stories)
- No mention of what Calendar/Gmail serve (input to `daily`)

**What needs fixing:**
```
- Remove "Phase 4 Integrations (not yet built)" section
- Add new section "Integrations" documenting each
- Explain data flow: Calendar + Gmail → daily → morning brief
- Explain Notion: pipeline tracking, research persistence, story library
```

---

## 3. Skills

### Current State ✅
**5 skills defined in `.claude/skills/`:**

1. **job-search.md**
   - Orchestrates tools across job hunt lifecycle (DISCOVER → RESEARCH → QUALIFY → PURSUE → INTERVIEW → LEARN)
   - Chains: scan → intel → fit → prep → apply/outreach → proctor → diagnose

2. **prep-loop.md**
   - Shortcut: runs intel + fit + prep in sequence for a company
   - Usage: `/prep-loop <company>`

3. **build-brainos.md**
   - Builds MCP server, reports TypeScript errors
   - Usage: `/build-brainos`

4. **sync-context.md**
   - End-of-session summary and persistence
   - Calls `remember` with type=session
   - Usage: `/sync-context`

5. **doc-coauthoring.md** 
   - Structured workflow for collaborative document creation (Context Gathering → Refinement → Reader Testing)
   - 50+ lines, well-documented

### Documentation Status ❌
**File:** `.claude/skills/README.md`

**Issues:**
- Says "No skills are defined yet"
- Lists example skills that don't exist
- Doesn't document the 5 that DO exist
- No usage examples

**What needs fixing:**
```
- Update "What's missing" to "What's defined"
- Document all 5 skills with name, purpose, usage
- Add examples of when to use each
- Note that job-search is the primary orchestration skill
```

---

## 4. Agents

### Current State ✅
**0 agents defined** — placeholder only

### Documentation Status ✅
**File:** `.claude/agents/README.md`

**Accurate.** Says "no agents yet" which is correct. Candidate use cases are relevant (deep research, interview debrief, article research).

**No action needed.**

---

## 5. Hooks (Rules & Guardrails)

### Current State ✅
**2 hook types configured in `.claude/settings.json`:**

**Stop hook (runs on session end):**
```
Command: /Users/rmcdonald/Repos/ryemyster/brain-os/.claude/scripts/session-write.sh
Purpose: Auto-archive old sessions, write session summary
```

**PostToolUse hooks (fire after specific tools):**

| Tool | Action |
|------|--------|
| `intel` | Prompt to call `remember type=company` |
| `fit` | Prompt to call `remember type=company` |
| `prep` | Prompt to call `remember type=company` |
| `apply` | Prompt to call `remember type=session` |
| `outreach` | Prompt to call `remember type=company` |
| `story_draft` | Prompt to call `remember type=story` |
| `diagnose` | Prompt to call `remember type=insight` |
| `scan` | Prompt to call `remember type=session` |

### Documentation Status ❌
**File:** `.claude/rules/README.md`

**Issues:**
- Section "Currently configured hooks: None" is **FALSE**
- 8 active PostToolUse hooks not listed
- Stop hook not documented
- Doesn't explain what each hook does

**What needs fixing:**
```
- Replace "None" with list of active hooks
- Document Stop hook (session persistence)
- Document all 8 PostToolUse hooks with their intent
- Update examples to match actual config
```

---

## 6. MCP Server Registration

### Current State ✅
**Registered in `~/.claude/settings.json`:**

| Server | Type | Path | Purpose |
|--------|------|------|---------|
| brain-os | stdio | `/Users/rmcdonald/Repos/ryemyster/brain-os/brain-os/dist/index.js` | Job hunt + writing tools |
| founder-os | stdio | `/Users/rmcdonald/Repos/ascendvent/founderos/dist/index.js` | Product discovery for Ascendvent |
| github | HTTP | `https://api.githubcopilot.com/mcp/` | Repo activity (Phase 4) |

**Environment variables:**
- `BRAIN_ROOT`: Points to project root
- `NOTION_TOKEN`: Notion API access
- `ANTHROPIC_API_KEY`: For Anthropic SDK calls within tools

### Documentation Status ⚠️
**No centralized documentation.** Scattered across:
- `CLAUDE.md` (mentions brain-os, founder-os, Phase 4)
- `brain-os-mcp/README.md` (only covers brain-os)
- `.claude/rules/README.md` (generic hooks info, not specific servers)

**What needs fixing:**
```
- Create `.claude/MCP-SERVERS.md` (centralized reference)
- Document each server: what it provides, when to use, Phase status
- Explain data flow between servers (brain-os ↔ Notion, etc.)
```

---

## 7. Context & Configuration Files

### Current State ✅
**Career files (used by brain-os tools):**
- `career/resume.md` ✅
- `career/achievements.md` ✅
- `career/voice-and-style.md` ✅
- `career/job-criteria.md` ✅
- `career/pipeline/` (companies in pursuit) ✅
- `career/interview-notes/` (post-interview debriefs) ✅

**Project files (used by founder-os, FounderOS skills):**
- `projects/index.md` ✅
- `ascendvent-planning/` (Ascendvent strategy) ✅

**Context store (written by `remember` tool):**
- `context/companies/` (intel, fit, prep notes) ✅
- `context/sessions/` (auto-written summaries) ✅
- `context/README.md` ✅

### Documentation Status ✅
**File:** `CLAUDE.md` (excellent reference)

**Accurate and complete.** No action needed.

---

## 8. Session & Context Management

### Current State ✅
**Implemented per Phase 3 completion:**

- Session summaries auto-written by Stop hook
- Old sessions auto-archived (via `archive-old-sessions.sh`)
- Memory system in place at `~/.claude/projects/..../memory/`

### Documentation Status ✅
**File:** `CLAUDE.md` mentions it; `context/README.md` explains the store

**Accurate.** No action needed.

---

## Action Plan (Priority Order)

### 🔴 High Priority (Update Now)

**1. `brain-os-mcp/README.md` — Complete rewrite sections**
   - Tool count: 11 → 12
   - Add `remember` tool
   - Fix paths (`/my-brain/` → `/ryemyster/`)
   - Move Phase 4 integrations from "not yet" to "live"
   - Estimated effort: 30 min

**2. `.claude/rules/README.md` — Update hooks section**
   - Replace "None" with actual hooks list
   - Document Stop hook (session persistence)
   - List all 8 PostToolUse hooks
   - Estimated effort: 20 min

**3. `.claude/skills/README.md` — Complete rewrite**
   - Replace "What's missing" with "What's defined"
   - Document all 5 skills (name, purpose, usage, trigger)
   - Add examples
   - Estimated effort: 30 min

### 🟡 Medium Priority (Document Relationships)

**4. Create `.claude/MCP-SERVERS.md` — New file**
   - Centralized reference for all 3 servers
   - Data flow diagram (brain-os ↔ Notion, Calendar, Gmail)
   - Environment variables and secrets
   - Phase status
   - Estimated effort: 40 min

**5. Create `.claude/INTEGRATIONS.md` — New file**
   - What Google Calendar, Gmail, Notion do
   - How they feed into brain-os tools
   - Which tools use which integrations
   - Estimated effort: 30 min

### 🟢 Low Priority (Already Accurate)

- `.claude/agents/README.md` ✅ Keep as-is
- `CLAUDE.md` ✅ Keep as-is
- `context/README.md` ✅ Keep as-is

---

## Summary Table

| Component | Current | Documented | Status | Effort |
|-----------|---------|------------|--------|--------|
| MCP tools (12) | ✅ | 🔴 (11, missing remember) | Stale | 30 min |
| Google/Notion integrations | ✅ | 🔴 (marked "Phase 4 - not yet") | Stale | 20 min |
| Skills (5) | ✅ | 🔴 (says none exist) | Stale | 30 min |
| Hooks (8 active) | ✅ | 🔴 (says none) | Stale | 20 min |
| MCP servers (3) | ✅ | ⚠️ (scattered) | Fragmented | 40 min |
| Agents (0) | ✅ | ✅ | Accurate | — |
| Career/context files | ✅ | ✅ | Accurate | — |
| Session management | ✅ | ✅ | Accurate | — |

**Total effort to full sync: ~2.5 hours**

---

## Notes for Future Maintenance

1. **Rebuild triggers updates:** After `npm run build`, docs may be stale. Audit `server.ts` for new tools.
2. **Hook changes don't auto-sync:** Remember to update `rules/README.md` when adding PostToolUse hooks.
3. **Phase status matters:** Track Phase 4/5 work in CLAUDE.md and cascade to MCP-SERVERS.md.
4. **Skills are discoverable:** When adding new skills, update `.claude/skills/README.md`.
5. **Consider automation:** Could add a pre-commit hook to validate that tool counts match.

