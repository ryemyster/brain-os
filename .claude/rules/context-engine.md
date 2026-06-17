# Context Engine — Brain-OS Path Config

Path prefix for this repo: `ryemyster/brain-os`

**Primary transport: MCP** — server name `context-engine` at `http://127.0.0.1:8089/mcp`. Never call the REST API directly from Claude. `engine_down` = fall back to direct file reading.

Note: `/index` is the only operation that requires a direct REST call (no MCP equivalent). Everything else goes through MCP tools.

## MCP Tool Decision Table

| Situation | Tool | Mode |
|-----------|------|------|
| Open-ended investigation or multi-step exploration | `investigate_codebase` (primary) | `context_safe` |
| Bounded pre-task context before a known task | `load_context` | `context_safe` |
| Semantic recall (after `/index` has run) | `vector_search` (direct) | `context_safe` |
| Locate a concept (mechanical lookup) | `find_in_code` (direct) | `context_safe` |
| Inventory one scoped directory | `scan_directory` (direct) | `context_safe` |
| Understand one known file | `summarize_file` (direct) | — |
| Review a git diff | `review_diff` | — |
| Evidence-based issue triage | `audit_issue` | — |

**Always use `mode=context_safe` unless exact implementation detail is required.** Prefer `investigate_codebase` over chaining direct tools.

## Recommended Workflow

`discover → narrow → read → act → refresh`

1. **Discover** — `/find`, `/vector-search`, `/scan`. Identify candidate artifacts; do not load content yet.
2. **Narrow** — Use scores, summaries, paths, and metadata. Select only the most relevant items.
3. **Read** — Load only selected artifacts. Prefer summary mode; use full mode only when implementation requires exact detail.
4. **Act** — Perform work using the minimal required context. Verify cited source files before making changes.
5. **Refresh** — Repeat discovery if context becomes stale. Do not preload repositories.

## Two-Call Fallback

If a `mode=context_safe` discovery result is thin (too few hits, low-content summaries, insufficient evidence to narrow the next read), make **one** re-call without the mode flag before broadening reads. Do not skip straight to reading whole directories.

## Wave Scan Order for Brain-OS

Start narrow, expand one level at a time, stop when found:

1. `vector_search(query="...", mode="context_safe")` — stop if found; if thin, retry once without mode flag
2. `load_context(paths=["ryemyster/brain-os/context-store/sessions"], mode="context_safe")` — stop if found
3. `load_context(paths=["ryemyster/brain-os/context-store/context"], mode="context_safe")` — stop if found
4. `load_context(paths=["ryemyster/brain-os/context-store/career"], mode="context_safe")` — stop if found

Never pass `"ryemyster/brain-os"` as the path — scans the whole repo.

## Model Routing & Timing

Three-tier model stack (all inference via the context-engine MCP server, backed by Ollama):

| Tier | Model | Used for | Wall time | Timeout |
|------|-------|----------|-----------|---------|
| Default / interactive | `qwen2.5-coder:3b` | `/scan`, `/find`, `/dependencies`, pattern matching, grep synthesis | <1s–123s | 150s |
| Architecture review | `qwen3:4b` | `investigate_codebase`, structural analysis, agent runs | 10s–563s | 650s |
| Deep reasoning | `qwen3.5:9b` | `/diff-summary`, risk analysis, governance reasoning | 1s–520s | 600s |
| Embeddings | `nomic-embed-text` | Vector index, `/vector-search` | 2–5s (+30s cold) | — |

**Key timing notes:**
- Wall time can shift 2–3× due to thermal state, memory pressure, or model-swap overhead.
- Cold start on first call of a session adds 20–60s.
- Budget an extra 30s before calling `/vector-search` if a code model was just used (embed model needs to swap in).
- Always poll async endpoints (`/agents/*`); never assume synchronous completion.
- If a call returns `stopped_reason: timeout` (HTTP 504), retry — do not increase client timeout.

## After Any Agent Call

Check before acting on `final_answer`:
- `stopped_reason`: `"final_answer"` | `"max_iterations"` | `"timeout"` | `"verification_failed"`
- `verification.passed`: `false` → engine auto-runs repair passes (up to 3)
- `tool_calls_made`: non-empty = real exploration happened

## Error Recovery

| error_type | Action |
|------------|--------|
| `needs_confirmation` | Retry with a path from `candidates` |
| `path_rejected` | Use a narrower path within the prefix |
| `engine_down` | Fall back to direct `Read` |

Artifact paths and full endpoint reference (for `/index` and admin ops only): `GET http://localhost:8088/setup`
