# Token Audit

Audit a repo's CLAUDE.md and rules files to reduce redundancy and cut token load per session.

## Steps

1. Read `CLAUDE.md` (project root), all files in `.claude/rules/`, and any other auto-loaded context files (e.g. `.claude/brainos-context-contract.md`, `.claude/project-map.md`) that exist.

2. Map every piece of content to one of these categories:
   - **Behavioral rule** — tells Claude how to act (keep)
   - **Pointer to another file** — just says "follow X.md" (cut if X is already auto-loaded)
   - **Reference/docs** — API examples, curl commands, schema details retrievable elsewhere (cut or move to on-demand doc)
   - **Duplicate** — same rule or fact stated in multiple files (consolidate to one)

3. Propose specific edits: what to cut, what to consolidate, and where the canonical home for each rule should be. Don't apply yet — show me the plan first.

**Goal:** same decisions made by Claude, fewer tokens loaded per session.
