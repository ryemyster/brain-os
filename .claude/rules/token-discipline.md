# Token Discipline

Use this rule for every BrainOS task unless the user explicitly asks for a broad audit.

## Default Behavior

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

## Context Engine — Wave Scanning

Never scan a broad path in one call. Break it into small, targeted waves and stop as soon as the answer is found.

**Wave pattern:**
1. Call the narrowest path that could contain the answer (e.g., `context-store/sessions`)
2. Use `POST /vector-search` to retrieve previously indexed context — stop if the answer is there
3. If not found, expand by one level (e.g., `context-store/context`) — stop if found
4. Continue expanding one subdirectory at a time, never the whole repo

**Never do this:**
```
POST /find {"path": "ryemyster/brain-os", "query": "..."}   ← scans everything
POST /context {"paths": ["ryemyster/brain-os"]}             ← scans everything
```

**Do this instead:**
```
Wave 1: POST /find {"path": "ryemyster/brain-os/context-store/sessions", "query": "..."}
  → stop if found
Wave 2: POST /find {"path": "ryemyster/brain-os/context-store/context", "query": "..."}
  → stop if found
Wave 3: POST /find {"path": "ryemyster/brain-os/context-store/career", "query": "..."}
  → stop if found
```

**Max depth per wave:** one subdirectory. If a wave returns too many results, narrow the query — don't widen the path.

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
