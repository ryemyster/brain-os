# Token Discipline

Use this rule for every BrainOS task unless the user explicitly asks for a broad audit.

## Default Behavior

- Start with `.claude/project-map.md`.
- Follow `.claude/brainos-context-contract.md` before BrainOS MCP tool calls.
- Follow `.claude/rules/security.md`.
- Follow `.claude/rules/repo-boundaries.md` — never edit files outside this repo.
- Identify the task type before reading files.
- Read the smallest set of files that can answer or implement the request.
- Stop expanding once the answer, edit point, or risk is clear.
- Prefer exact file references over broad summaries.

## Exploration Limits

| Task | Default Scope | Ask Before Expanding To |
|------|---------------|-------------------------|
| MCP tool change | Switch to sibling `brain-os-mcp` repo | Do not perform MCP dev work in this repo |
| MCP tool call | `.claude/brainos-context-contract.md`, minimal relevant `context-store/` files | Broad folder dumps or assuming MCP reads local files |
| Claude workflow change | Target `.claude/` file and adjacent README | MCP source, career content, external settings |
| Content update | Target markdown and optional voice guide | MCP code, package files, GitHub |
| Bug fix | Failing file/path and one dependency hop | Whole repo scans or unrelated modules |
| Review | `git diff`, changed files, relevant scripts | Unchanged directories or live services |
| Release check | Package scripts, MCP docs, env docs, changed files | Deploy, push, external health checks |

## Stop Conditions

Stop reading and proceed when:

- The target file and likely edit location are known.
- A question can be answered from the files already opened.
- Additional files would only confirm a pattern already established.
- The next step requires user approval, a live service, a build, or a write.

## High-Token Areas

Treat these as opt-in, not default:

- MCP package code in sibling `brain-os-mcp` repo
- `context-store/career/`
- `context-store/writing/`
- `context-store/sessions/`
- Other repos under `/Users/rmcdonald/Repos/`
- Live Notion, Gmail, Calendar, GitHub, Supabase, Ollama, or Anthropic calls
- Secret-bearing files such as `.env`, `.env.*`, `*.env`, local credential files, and local settings with real tokens

## Commands

Ask before running commands that:

- install dependencies
- build or start a server
- call live external services
- scan multiple repos
- push, deploy, or modify remote state
- mutate settings, secrets, or credentials

Never run commands whose purpose is to discover or print secrets. `.env.example`, `.env.sample`, and `.env.template` are okay to read.

## Output Discipline

- Lead with the operational finding or change.
- Use exact file paths and line references when useful.
- Do not restate full repo maps in final answers.
- When recommending more exploration, name the specific file or command and why it is needed.
