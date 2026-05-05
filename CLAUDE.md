# CLAUDE.md — my-brain

Personal knowledge base and command center for Ryan K. McDonald. Read this at the start of every session before doing anything else.

---

## Who I am

Ryan K. McDonald — Senior Product Manager specializing in AI, FinTech, and HealthTech. Founder of Ascendvent (ascendvent.life), the brand powering AOSI (Agent-Orchestrated Self-Improvement™). Email: admin@ascendvent.life.

## Current focus (May 2026)

**Primary:** Job hunting — actively seeking Senior PM or Head of Product roles, with a strong preference for AI-native companies.
**Secondary:** Building Ascendvent products (Check-In by Ascendvent, SevenSharp) and maintaining active side projects.

Default assumption by request type:
- Company name or role mentioned → job hunt context, use `prep` or `apply` workflow
- Product feature or technical question → check `projects/index.md` first
- Writing or blog → match voice from `career/voice-and-style.md`

---

## Knowledge base map

| Location | Contents |
|----------|----------|
| `career/resume.md` | Canonical resume — always use this as the source of truth |
| `career/achievements.md` | Wins, metrics, STAR-format stories for interviews |
| `career/voice-and-style.md` | Professional tone and writing patterns |
| `career/pipeline/` | One `.md` file per company being pursued |
| `career/interview-notes/` | Post-interview debriefs |
| `writing/drafts/` | Blog posts and essays in progress |
| `writing/published/` | Archive of published work |
| `writing/ideas.md` | Running idea backlog |
| `projects/index.md` | One-paragraph summary of every active repo |
| `brain-os/` | BrainOS MCP server — personal workflow automation tools |

---

## Active projects

Full context in `projects/index.md`. Quick reference:

| Repo | What it is |
|------|-----------|
| `ascendvent-planning` | Strategy and planning brain for Ascendvent — full CLAUDE.md, use FounderOS tools here |
| `ascendvent-home` | Static marketing site for ascendvent.life |
| `SevenSharp` | Voice-first communication training app — 7-second response drills |
| `founderos` | Published MCP server for product discovery (FounderOS) |
| `frompixelstopunk` | Blog: PM as creative discipline |
| `ShaleYeah` | AI-powered oil & gas investment analysis |
| `portfolio` | Personal portfolio site (Astro) |
| `autoresearch` | Automation/research tooling (early stage) |
| `Claude-Cowork` | Claude-related project (early stage) |

---

## BrainOS tools

`brain-os/` is an MCP server registered as `brain-os` in Claude Code. Available tools:

| Tool | What it does |
|------|-------------|
| `daily` | Morning brief — job pipeline status, writing queue, 3 focus items |
| `prep` | Interview/meeting prep for a named company |
| `apply` | Gap analysis + cover letter draft from a pasted job description |
| `scan` | Candidate-market fit scan — NYC AI/FinTech/HealthTech PM roles |
| `fit` | Fit scoring for a specific company across 5 dimensions |
| `intel` | Company intelligence report — org health, NYC presence, PM structure |
| `outreach` | LinkedIn DM + email drafts and warm intro paths for a company |
| `proctor` | Mock interview proctor — product, behavioral, metrics, strategy, vibe-coding |
| `diagnose` | Pattern analysis across interview notes — recurring failures and gaps |
| `story_draft` | Story mining — interviews Ryan to surface STAR stories by theme |
| `loop` | MAANG interview loop reference — full loop or per-round deep dive |

If BrainOS tools aren't responding, check that it's built (`npm run build` inside `brain-os/`) and registered in `~/.claude/settings.json`.

---

## MCP integrations

| Integration | Status | Primary use |
|-------------|--------|-------------|
| BrainOS (`brain-os`) | Active (after build) | Daily workflow, job hunt automation |
| FounderOS (`founder-os`) | Active | Product discovery — use in `ascendvent-planning/` |
| Notion | Active | Job pipeline tracker, project notes |
| Gmail | Needs OAuth | Job application follow-ups |
| Google Calendar | Needs OAuth | Interview scheduling, daily planning |
| Google Drive | Needs OAuth | Document storage |
| GitHub | Phase 4 | Repo activity, PR status, issue tracking across all `/Repos/` projects |
| Google Analytics | Phase 4 | Writing performance — traffic and insights for `frompixelstopunk` and portfolio |

To complete OAuth for Gmail/Calendar/Drive: look for `mcp__claude_ai_Gmail__authenticate` and equivalent tools in the available MCP tools list.

**Phase 4 integration plan (not started):**
- `daily` expanded to pull Google Calendar events and flagged Gmail threads
- `prep`/`apply` writing application activity back to Notion pipeline database
- GitHub MCP for repo health and activity across active projects
- Google Analytics MCP for writing performance surfaced in `daily` or on demand

---

## Working style

- Direct and concise. No preamble, no trailing summaries of what was just done.
- For job hunt tasks: lead with the actionable output, context second.
- For writing: match voice from `career/voice-and-style.md` — don't sanitize it.
- No emoji unless asked.
- When I paste a JD: run `apply` workflow — gap analysis first, then cover letter.
- When I say a company name alone: assume `prep` workflow.
- When files in `career/` are empty templates: ask me to fill them before proceeding, don't hallucinate the content.
