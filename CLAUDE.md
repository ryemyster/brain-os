# CLAUDE.md — BrainOS

Personal knowledge base and orchestration layer for Ryan K. McDonald. Read this at the start of every session.

---

## Who I am

Ryan K. McDonald — Senior PM specializing in AI, FinTech, and HealthTech. Founder of Ascendvent (<ascendvent.life>), the brand powering AOSI - Agent Orchestrated Self Improvement®. Business email: <admin@ascendvent.life>. Personal email: <ryan.mcdonald.us@gmail.com>.

**Primary focus (May 2026):** Job hunting — Senior PM or Head of Product, AI-native companies preferred.
**Secondary:** Building Ascendvent products (Check-In by Ascendvent, SevenSharp) and active side projects.

Default assumptions:

- Company name or role mentioned → job hunt context, use `prep` or `apply`
- Product or technical question → check `projects/index.md` first
- Writing or blog → match voice from `career/voice-and-style.md`

---

## Knowledge base

| Location | Contents |
|----------|----------|
| `career/resume.md` | Canonical resume — source of truth |
| `career/achievements.md` | Wins, metrics, STAR stories |
| `career/voice-and-style.md` | Tone and writing patterns |
| `career/pipeline/` | One `.md` per company being pursued |
| `career/interview-notes/` | Post-interview debriefs |
| `context/` | Persistent memory store — see `context/README.md` |
| `writing/drafts/` | Blog posts and essays in progress |
| `writing/published/` | Archive of published work |
| `writing/ideas.md` | Running idea backlog |
| `projects/index.md` | Active repo summaries |

---

## Active projects

Full context in `projects/index.md`. Quick reference:

| Repo | What it is |
|------|-----------|
| `ascendvent-planning` | Strategy brain for Ascendvent — use FounderOS tools here |
| `ascendvent-home` | Static marketing site for ascendvent.life |
| `SevenSharp` | Voice-first communication training app |
| `founderos` | Published MCP server for product discovery |
| `frompixelstopunk` | Blog: PM as creative discipline |
| `ShaleYeah` | AI-powered oil & gas investment analysis |
| `portfolio` | Personal portfolio site (Astro) |
| `autoresearch` | Automation/research tooling (early stage) |
| `Claude-Cowork` | Claude-related project (early stage) |

---

## BrainOS tools

MCP server registered as `brain-os`. Job hunt workflow detail in `.claude/skills/job-search.md`.

| Tool | What it does |
|------|-------------|
| `daily` | Morning brief — pipeline status, writing queue, focus items |
| `scan` | Proactive opportunity scan — NYC AI/FinTech/HealthTech PM roles |
| `intel` | Company intelligence — funding, NYC presence, PM org, product direction |
| `fit` | Fit scoring across 5 dimensions for a specific company |
| `prep` | Interview/meeting prep for a named company |
| `apply` | Gap analysis + cover letter from a pasted JD |
| `outreach` | LinkedIn DM + email drafts, warm intro paths |
| `proctor` | Mock interview — product, behavioral, metrics, strategy, vibe-coding |
| `diagnose` | Pattern analysis across interview notes — recurring gaps |
| `story_draft` | STAR story mining by theme |
| `loop` | MAANG interview loop reference |
| `remember` | Persist intel, stories, insights, tasks, or session summaries |

If tools aren't responding: `npm run build` inside `brain-os/`, verify registration in `~/.claude/settings.json`.

---

## MCP integrations

| Integration | Status | Use |
|-------------|--------|-----|
| BrainOS | Active | Daily workflow, job hunt automation |
| FounderOS | Active | Product discovery — use in `ascendvent-planning/` |
| Notion | Active | Pipeline tracker, project notes |
| Gmail | Needs OAuth | Application follow-ups |
| Google Calendar | Needs OAuth | Interview scheduling |
| Google Drive | Needs OAuth | Document storage |
| GitHub | Phase 4 | Repo activity across all projects |
| Google Analytics | Phase 4 | Writing performance |

Phase 4: `daily` pulls Calendar + Gmail, `prep`/`apply` writes back to Notion, GitHub MCP for repo health, Analytics for writing insights.

---

## Skills, hooks, agents

| Layer | Location | Status |
|-------|----------|--------|
| Skills | `.claude/skills/` | `job-search.md`, `doc-coauthoring.md` active — see READMEs |
| Hooks | `.claude/rules/` | None configured — see README for examples |
| Agents | `.claude/agents/` | Not started — see README for concept |

Memory: `context/` is written automatically by tools. Phase 5 adds LanceDB semantic search (issue #9).

---

## Working style

- Direct and concise. No preamble, no trailing summaries.
- Job hunt tasks: lead with actionable output, context second.
- Writing: match voice from `career/voice-and-style.md` — don't sanitize it.
- No emoji unless asked.
- Pasted JD → run `apply` workflow automatically.
- Company name alone → assume `prep` workflow.
- Empty career files → ask to fill them, never hallucinate content.
