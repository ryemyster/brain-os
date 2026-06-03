# Rule: This Repo Only — No Cross-Repo Reads or Edits

**Applies to every task in this session, no exceptions.**

## The Rule

Anything inside `/Users/rmcdonald/Repos/ryemyster/brain-os/` is fair game. Everything else is off the table.

Claude Code in `brain-os` must **never read, edit, run, build, commit, or push files in any other repository.**

This includes:
- `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp`
- `/Users/rmcdonald/Repos/ascendvent/founderos`
- Any other repo under `/Users/rmcdonald/Repos/`
- Any path outside `/Users/rmcdonald/Repos/ryemyster/brain-os/`

**External infrastructure is also off limits.** Never apply Supabase migrations, create tables, or modify database schema for tables owned by another repo. If the table doesn't exist and it should, the fix belongs in the repo that owns that schema — generate a handoff prompt and stop.

**Do not read sibling repo source to diagnose a bug.** You don't need to see the code — you experienced the error. Report what you experienced.

## When a Bug Is Hit in Another Repo

Stop. Do not cd, read, or inspect the other repo.

Write a bug handoff using this exact format:

---

**🐛 Bug Handoff — [tool or system name]**

**What I experienced:**
[The exact error message or unexpected behavior — copy from tool output]

**Use case and flow I was executing:**
[Step by step: what I was trying to do, what tool/command I called, what I expected to happen]

**Impact to my needs:**
[What I could not do as a result — be specific about the workflow that broke]

**Prompt to paste into the [repo-name] Claude Code instance:**

```
Context: I'm Ryan McDonald. The brain-os Claude Code instance hit a bug
while [doing X]. Here is the error:

[paste exact error]

Use case: [paste use case and flow]

Please:
1. Find the root cause in this codebase
2. Plan a fix OR explain why the flow should change instead
3. If a fix: show the exact file/line/change needed
4. If a flow change: tell me what brain-os should do differently
   and I'll update its workflow
```

---

## Why This Format

- Brain-os Claude has no business reading MCP or FounderOS source — it's a consumer, not a maintainer
- The error message contains enough signal; reading source is over-reach
- The handoff prompt lets the correct repo's Claude instance plan the fix with full context
- The "refuse and change flow" option means sometimes the fix is on brain-os's side, not the other repo

## Related
- `~/.claude/rules/founderos-read-only.md` (global rule) — same principle applied specifically to FounderOS
- `token-discipline.md` — MCP tool changes route to sibling repo
