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

## Context Discipline

- Prefer the narrowest useful tool.
- Do not run the whole lifecycle unless Ryan asks for an end-to-end session.
- Scope `diagnose` to a company or recent notes unless Ryan asks for all interviews.
- Do not read `context-store/career/`, `context-store/sessions/`, or Notion broadly unless the selected tool requires it.
- Summarize large files before passing them into MCP tools.
- Follow `.claude/rules/security.md` and never read real `.env` or secret-bearing files.

## Source Notes

- Notion is primary for several career workflows.
- Local career files are useful fallback/reference:
  - `context-store/career/resume.md`
  - `context-store/career/achievements.md`
  - `context-store/career/voice-and-style.md`
  - `context-store/career/job-criteria.md`
  - `context-store/career/portfolio.md`
- Use `context-store/career/voice-and-style.md` for application, outreach, and public writing tone.
- If a required career file is empty or missing, ask Ryan for the missing content instead of inventing it.

## Output Rules

- Lead with the actionable result.
- Keep context second.
- Use direct language.
- For applications, show gap analysis before cover-letter copy.
- For interview prep, prioritize likely questions, strongest stories, and gaps to research.
- For outreach, keep drafts short and specific.
