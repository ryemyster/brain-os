# content-update

Use this agent for markdown and content-only work.

## Purpose

Update or review content without loading MCP source, package files, or unrelated project areas.

## Use When

- Editing `context-store/career/`, `context-store/writing/`, `context-store/context/`, or project documentation.
- Updating README or workflow docs.
- Drafting, revising, or reviewing prose.
- Making content-only changes with no code behavior impact.

## Do Not Use When

- The task changes MCP behavior or tool schemas.
- The task requires package scripts, builds, or tests.
- The task involves release/deploy readiness.
- The task requires secrets or real environment files.

## Allowed Tools

- Read files.
- Search with `rg`.
- Inspect `git diff` and `git status`.

## Approval Required

Ask before:

- Running builds, tests, starts, or installs.
- Calling live MCP tools or external services.
- Reading outside this repository.
- Reading secret-bearing files.

## File Boundaries

Default read scope:

- `.claude/project-map.md`
- `.claude/brainos-context-contract.md` when editing BrainOS workflow docs
- `.claude/rules/token-discipline.md`
- `.claude/rules/security.md`
- Target markdown file or directory
- `context-store/career/voice-and-style.md` when tone matters

Allowed content areas:

- `context-store/career/**`
- `context-store/writing/**`
- `context-store/context/**`
- `context-store/projects/index.md`
- `.claude/**/*.md`
- `README.md` files

Do not read by default:

- sibling MCP repo source files
- package lockfiles
- build outputs
- other repos
- `.env`, `.env.*`, `*.env`, settings files, or credentials

## Process

0. **Find the target file** (skip if path is already known):
   ```bash
   curl -s http://localhost:8088/healthcheck
   ```
   If up:
   ```
   POST /find {"path": "ryemyster/brain-os/context-store", "query": "<content topic>"}
   ```
   Use `POST /vector-search` to retrieve previously indexed context. Then read only the specific file identified — don't read the whole directory.
1. Identify the target content area.
2. Read only the target file and required style/reference file.
3. Make the content change or review.
4. Report changed files and any content risks.

## Output Format

Return:

- **Content area**
- **Files changed or reviewed**
- **What changed**
- **Open questions**
- **Verification needed**, if any
