# Integrations

Third-party systems connected to BrainOS. Each integration provides data or a place to write data.

---

## Quick Reference

| Integration | Provides | Used by | Type | Status |
|-------------|----------|---------|------|--------|
| Google Calendar | Interview dates, deadlines, events | `daily` | Read | ✅ Live |
| Gmail | Job-related emails, follow-ups | `daily` | Read | ✅ Live |
| Notion | Job pipeline, company research | `prep`, `fit`, `apply` | Read/Write | ✅ Live |
| GitHub | Repo activity, code metrics | — | Read | 🟡 Phase 4 |
| Google Analytics | Writing performance data | — | Read | ⏳ Phase 5 |

---

## Google Calendar

**What it provides:** Your calendar for the next 7 days, including interview dates, deadline reminders, and scheduled events.

**How it's used:**
- `daily` tool pre-fetches the next 7 days to surface upcoming interviews and deadlines
- Used to create a unified morning brief showing what's on your calendar + what's in your pipeline

**Integration method:** `mcp__claude_ai_Google_Calendar__list_events` (pre-fetch, manual call required)

**Configuration:**
- Allowed in `~/.claude/settings.json` permissions
- Reads from your primary Google Calendar
- Returns: event title, time, duration, attendees, description

**When it's useful:**
- First thing in the morning: see what interviews are scheduled
- Before `prep` or `proctor`: check if prep needs to happen today
- To track interview follow-up deadlines

**Limitations:**
- Only pulls 7-day window (configurable)
- Requires pre-fetch before `daily` runs (not automatic)
- Doesn't integrate with other brain-os tools yet

---

## Gmail

**What it provides:** Job-related email threads from the last 7 days, including recruiter emails, application confirmations, and follow-up reminders.

**How it's used:**
- `daily` tool pre-fetches job-related threads to surface action items
- Shows which companies have emailed, recruitment status, follow-up needs

**Integration method:** `mcp__claude_ai_Gmail__search_threads` (pre-fetch, manual call required)

**Configuration:**
- Allowed in `~/.claude/settings.json` permissions
- Searches threads matching: `from:<recruiter-domain> OR to:admin@ascendvent.life`
- Returns: email subject, sender, timestamp, thread summary

**Query example:**
```
newer_than:7d (from:linkedin.com OR from:greenhouse.io OR subject:interview)
```

**When it's useful:**
- Morning brief: see what companies have emailed
- Before scheduling interviews: check for pending confirmations
- To track follow-up deadlines from interviews

**Limitations:**
- Only pulls 7-day window
- Requires pre-fetch before `daily` runs
- Doesn't automatically tag or categorize emails

---

## Notion

**What it provides:** Centralized database for job pipeline, company research, interview notes, and story library.

**How it's used:**

### Reading (by brain-os tools)
- `prep` reads company history, interview progress, and previous notes
- `fit` reads achievement data and job criteria for scoring
- `apply` reads resume and voice guide for cover letter generation
- `daily` can pull pipeline status (if implemented)

### Writing (by remember tool)
- After `intel`: research findings saved to company page
- After `fit`: fit score and rationale appended to company page
- After `prep`: prep notes and talking points appended
- After `apply`: gap analysis and cover letter draft saved as session note
- After `outreach`: draft messages and warm intro paths appended
- After `story_draft`: STAR stories saved to story library
- After `diagnose`: pattern analysis saved to insights page
- After `scan`: opportunity summaries saved as session note

**Integration method:**
- Read: `notion-fetch`, `notion-search`, `notion-query-database-view`
- Write: `notion-create-pages`, `notion-update-page`
- Notion API token in `~/.claude/settings.json` environment

**Configuration:**
- Notion workspace with authenticated token
- Database structure:
  - Job Pipeline (companies being pursued)
  - Research Notes (company intel, fit analysis)
  - Stories Library (STAR stories by theme)
  - Interview Progress (round-by-round progress)
  - Insights (recurring patterns from diagnose)

**Data flow:**

```
prep/fit/apply
    ↓
    reads from Notion
    ↓
(Generates output)
    ↓
PostToolUse hook fires
    ↓
Prompt to call remember
    ↓
remember type=company|session|story|insight
    ↓
Writes back to Notion
```

**When it's useful:**
- Persistent storage across sessions (context doesn't carry between days)
- Company history review (what did we learn about this company last month?)
- Candidate comparison (fit scores across 5 companies)
- Story library (pull stories by theme for interviews)
- Interview progress tracking (multi-round interviews)

**Limitations:**
- Manual sync required (not automatic)
- Notion API token needed (stored in settings)
- Large databases can be slow to query
- Phase 5 will add automatic sync on tool completion

---

## GitHub (Phase 4)

**What it provides:** Repository activity, code metrics, issue/PR status across all projects.

**Status:** 🟡 Configured but not yet integrated into brain-os tools.

**How it will be used (planned):**
- `daily` shows project status (recent commits, open issues, PR status)
- Help prioritize among 13 active projects
- Surface blocking issues or PRs needing attention
- Identify stale repos

**Integration method:** HTTP endpoint to GitHub Copilot MCP proxy

**Configuration:**
- Registered in `~/.claude/settings.json` as HTTP server
- Requires GitHub personal access token
- Reads from: ryemyster org, ascendvent org

**Next steps:**
- Wire into `daily` tool (show project status)
- Add repo health dashboard to `projects/index.md`
- Link to GitHub issue creation workflow

---

## Google Analytics (Phase 5)

**What it provides:** Writing performance data — views, time on page, engagement metrics for published blog posts.

**Status:** ⏳ Planned for Phase 5.

**How it will be used (planned):**
- Show which writing topics resonate (views + engagement)
- Inform `writing/ideas.md` prioritization
- Surface best-performing content for portfolio
- Track blog growth over time

**Integration method:** Google Analytics API

**Configuration:**
- Requires Analytics property ID
- OAuth token for API access
- Set up in `~/.claude/settings.json`

**Next steps:**
- Create Google Analytics API credentials
- Wire into `daily` or new `/writing-insights` skill
- Visualize as chart/summary

---

## Data Architecture

### Read Flow (Pre-fetch pattern)

```
daily tool called
    ↓
Requires: calendarEvents, gmailThreads
    ↓
User must pre-fetch:
  - mcp__claude_ai_Google_Calendar__list_events (next 7 days)
  - mcp__claude_ai_Gmail__search_threads (job-related, last 7 days)
    ↓
daily receives structured JSON
    ↓
daily synthesizes into morning brief
```

**Note:** Pre-fetch is manual because some users may not want to share calendar/email data in every session. Phase 5 could add optional auto-fetch.

### Write Flow (Hook-triggered pattern)

```
Tool runs (intel, fit, prep, apply, etc.)
    ↓
Tool generates output
    ↓
PostToolUse hook fires
    ↓
Hook echoes: "Call remember type=X label=Y"
    ↓
User calls: remember type=company label=Acme
    ↓
remember reads input, queries career/ files
    ↓
remember creates/updates page in Notion
    ↓
Page saved to: Job Pipeline / Company Detail
    ↓
Context file also saved: context/companies/acme.md
```

**Symmetry:** Every brain-os tool can read from Notion and write findings back. This creates a positive feedback loop where each session builds on previous research.

---

## Setup Checklist

### Google Calendar
- [ ] Google account with calendar enabled
- [ ] Token available in Claude Code
- [ ] Permission `mcp__claude_ai_Google_Calendar__list_events` in settings.json

### Gmail
- [ ] Google account with Gmail
- [ ] Token available in Claude Code
- [ ] Permission `mcp__claude_ai_Gmail__search_threads` in settings.json

### Notion
- [ ] Notion workspace and database created
- [ ] Notion API token generated (workspace settings)
- [ ] Token stored in `~/.claude/settings.json` as `NOTION_TOKEN`
- [ ] Permissions for `notion-*` tools in settings.json
- [ ] Job pipeline database with columns: Company, Fit Score, Interview Progress, Research Notes
- [ ] Stories library database with columns: Theme, Story Content, Date Added
- [ ] Insights database with columns: Pattern, Evidence, Date Found

### GitHub (Phase 4)
- [ ] GitHub token (personal access)
- [ ] HTTP endpoint configured in settings.json
- [ ] Permission `mcp__github__*` (when integrated)

### Google Analytics (Phase 5)
- [ ] Analytics property ID
- [ ] Service account credentials
- [ ] Token stored in settings.json

---

## Troubleshooting

### Calendar/Gmail not loading in daily

**Problem:** `daily` says "calendarEvents and gmailThreads required"

**Solution:** Pre-fetch must happen first. Call:
1. `mcp__claude_ai_Google_Calendar__list_events` with next 7 days
2. `mcp__claude_ai_Gmail__search_threads` with job query
3. Then call `daily` and pass results

### Notion writes failing

**Problem:** `remember` says "Failed to update Notion page"

**Solution:**
1. Check `NOTION_TOKEN` is set in `~/.claude/settings.json`
2. Verify token has read/write access to target database
3. Confirm page ID or database ID is correct
4. Check that `notion-update-page` or `notion-create-pages` is in permissions

### Stale data in Notion

**Problem:** Tool shows old research notes, not latest intel

**Solution:** 
1. After running `intel`, manually call `remember type=company` to overwrite stale notes
2. Phase 5 will add automatic write-back on tool completion
3. Until then, manual `remember` calls are required to stay in sync

