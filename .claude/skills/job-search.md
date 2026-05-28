---
name: job-search
description: Router for Ryan K. McDonald's job-search workflows. Use when Ryan asks about companies, roles, applications, interviews, outreach, recruiter follow-up, career positioning, or job-search strategy.
---

# Job Search Router

Ryan is pursuing Senior PM or Head of Product roles, with AI-native companies preferred. Use this skill to choose the right BrainOS tool chain without loading unnecessary context.

Before calling BrainOS MCP tools, read only the minimum relevant files from `context-store/` and pass concise context explicitly. The MCP server should not be expected to read this repo directly.

## Routing

| Situation | Action |
|-----------|--------|
| No company named; Ryan wants opportunities | Run `scan` |
| Company name only | Run `intel`, then ask whether to continue to `fit`, `prep`, or `outreach` |
| “Is this company worth it?” | Run `fit`; use `intel` first if company context is missing |
| Pasted job description | Run `apply` |
| Warm outreach or networking | Run `intel` if needed, then `outreach` |
| Upcoming interview or meeting | Run `prep`; use `/prep-loop` for intel + fit + prep |
| MAANG interview | Run `loop`, then `prep` or `proctor` |
| Mock interview practice | Run `proctor` |
| Need a stronger story | Run `story_draft` with the specific theme |
| Post-interview learning | Save notes, then run `diagnose` scoped to company or recent notes when possible |
| End of substantive session | Run `remember` or `/sync-context` |

## Context Lookup Order

Before any MCP tool call, check in this order:

1. **localhost:8088** — scan local files (healthcheck first; if `ai-context/find-*.md` already covers this topic, read it — don't re-call)
   - `POST /find {"path": "ryemyster/brain-os/context-store", "query": "<company or topic>"}` → read `ai-context/` output
   - Use `/find` for discovery; escalate to `/context` only if you need a full bundle across multiple paths
   - Full integration protocol: `GET http://localhost:8088/setup`
   - Use for: session history, company notes, career docs, prior outreach
2. **`recall` + `search`** — check BrainOS Supabase memory
   - `recall(action="list", listType="company")` — enumerate stored company labels first (cold-start check)
   - `recall(type=company, label=<slug>)` — load exact entry; check `updatedAt` for staleness
   - `search(query="<company or topic>", type?="company")` — semantic discovery when label is unknown
   - Always call before `intel`, `fit`, `prep`, `apply`, `outreach`
   - If stored context is recent (company intel <30d, pipeline state <7d), skip or abbreviate the tool call
3. **External APIs** (Notion, Gmail, Calendar) — only for live data not in layers 1–2
4. **`remember`** — write back after any substantive output

See `.claude/ARCHITECTURE.md` for full sequence diagrams per flow.

## Context Discipline

- Prefer the narrowest useful tool.
- Do not run the whole lifecycle unless Ryan asks for an end-to-end session.
- Scope `diagnose` to a company or recent notes unless Ryan asks for all interviews.
- Do not read `context-store/career/`, `context-store/sessions/`, or Notion broadly unless the selected tool requires it.
- Summarize large files before passing them into MCP tools.
- Follow `.claude/rules/security.md` and never read real `.env` or secret-bearing files.

## Source Notes

- `context-store/career/` is the primary local source — check via localhost:8088 before hitting Notion.
- Key files:
  - `context-store/career/resume.md` — resume fallback
  - `context-store/career/achievements.md` — wins, metrics, STAR stories
  - `context-store/career/voice-and-style.md` — tone for all outward-facing writing
  - `context-store/career/job-criteria.md` — role preferences
  - `context-store/career/portfolio.md` — project portfolio
- Notion is supplementary for live pipeline state (interview tracker, unemployment tracker).
- If a required career file is empty or missing, ask Ryan for the missing content instead of inventing it.

## Output Rules

- Lead with the actionable result.
- Keep context second.
- Use direct language.
- For applications, show gap analysis before cover-letter copy.
- For interview prep, prioritize likely questions, strongest stories, and gaps to research.
- For outreach, keep drafts short and specific.
