# BrainOS Architecture

System topology and orchestration flows. Use this before designing new workflows or adding context layers.

---

## Topology

```mermaid
graph TD
    subgraph "brain-os/ (this repo)"
        CC["Claude Code\n(Orchestrator)"]
        CS["context-store/\nLocal Markdown"]
        CI["concept-images/\nPNGs — manual only"]
        AC["ai-context/\nAuto-written by context engine"]
    end

    subgraph "local-model/ repo"
        CE["Context Engine\nlocalhost:8088\n(Docker)"]
    end

    subgraph "brain-os-mcp/ repo"
        MCP["BrainOS MCP Server\nstdio/HTTP"]
    end

    subgraph "Local Inference"
        OL["Ollama\nlocalhost:11434\nnomic-embed-text\nqwen2.5-coder:3b/7b"]
    end

    subgraph "Supabase (Cloud)"
        SB1["brain_os_memories\nrecall / remember\n(key-value + pgvector)"]
        SB2["code_embeddings\ncontext engine\n(pgvector)"]
    end

    subgraph "External MCPs (claude.ai)"
        GC["Google Calendar"]
        GM["Gmail"]
        NO["Notion"]
    end

    subgraph "External AI"
        ANT["Anthropic API\nclaude-sonnet-4-6\nclaude-haiku-4-5"]
    end

    CC -->|"reads"| CS
    CC -->|"reads"| AC
    CC -->|"POST /find /context /summarize"| CE
    CC -->|"calls tools"| MCP
    CC -->|"list_events"| GC
    CC -->|"search_threads / get_thread"| GM
    CC -->|"notion-fetch / notion-search"| NO

    CE -->|"embeds via"| OL
    CE -->|"stores/searches"| SB2
    CE -->|"writes markdown to"| AC

    MCP -->|"embeds via"| OL
    MCP -->|"recall / remember"| SB1
    MCP -->|"LLM calls"| ANT
    MCP -->|"reads/writes"| NO

    CI -.->|"never read programmatically"| CC
```

---

## Key Distinctions

| | Context Engine (8088) | BrainOS recall | BrainOS search |
|-|-----------------------|---------------|----------------|
| **Type** | File/code scanner | Key-value lookup | pgvector similarity |
| **Index** | `code_embeddings` | `brain_os_memories` | `brain_os_memories` |
| **Query** | Path + natural language | `type + label + section` | Embedding similarity |
| **Output** | Markdown file to `ai-context/` | Stored markdown content | Ranked memory chunks with score + `updatedAt` |
| **Exposed as tool?** | Yes — via HTTP endpoints | Yes — `recall` tool (also `recall(action="list")` to enumerate labels) | ✅ Yes — `search` tool |
| **Best for** | File search, code analysis, local markdown scan | Exact known entries (company, story, insight) | "Find anything related to X" — discovery before recall |

---

## Sequence Diagrams

### Flow A — Daily Brief / "What's on my plate"

```mermaid
sequenceDiagram
    participant U as User
    participant CC as Claude Code
    participant CE as localhost:8088
    participant R as BrainOS recall
    participant GC as Google Calendar
    participant GM as Gmail
    participant NO as Notion
    participant W as remember()

    U->>CC: "What's on my plate?"
    CC->>CE: POST /find — scan context-store/sessions/ (last 3 sessions)
    CE-->>CC: ai-context/sessions-summary.md
    CC->>R: recall(type=session, label=latest)
    R-->>CC: stored session memory (cross-session state)
    CC->>GC: list_events(today + tomorrow)
    GC-->>CC: calendar events
    CC->>GM: search_threads(job-related, last 7d)
    GM-->>CC: high-signal email threads
    CC->>NO: notion-fetch(pipeline DB) — only if recall miss on company state
    NO-->>CC: pipeline rows
    CC->>U: Briefing output
    CC->>W: remember(type=session, label=date, content=summary)
```

---

### Flow B — Company Research (intel → fit)

```mermaid
sequenceDiagram
    participant U as User
    participant CC as Claude Code
    participant R as BrainOS recall
    participant MCP as BrainOS MCP
    participant W as remember()

    U->>CC: "Research Fivetran"
    CC->>R: recall(action="list", listType="company") — enumerate stored company keys
    R-->>CC: [charter-communications, fivetran, huntress, seed-health]
    alt Label found in list
        CC->>R: recall(type=company, label=fivetran) — load all sections
        R-->>CC: stored Intel + Fit + Notes (with updatedAt)
        alt updatedAt < 30d
            CC->>U: Summary from stored intel
        else stale (>30d) or major company event
            CC->>MCP: intel(company=Fivetran, pipelineNotes=stored context)
            MCP-->>CC: updated TaskSpec brief
            Note over CC: Drive research from sections.*.research_questions
            CC->>W: remember(type=company, label=fivetran, section=Intel)
        end
    else Label not in list
        CC->>R: search(query="Fivetran PM role", type="company") — semantic check
        R-->>CC: ranked matches (may hit adjacent context)
        CC->>MCP: intel(company=Fivetran, pipelineNotes=search hits)
        MCP-->>CC: TaskSpec brief (context loader + research questions)
        Note over CC: Drive research from sections.*.research_questions
        CC->>W: remember(type=company, label=fivetran, section=Intel)
        CC->>MCP: fit(company=Fivetran, ...)
        MCP-->>CC: fit score + rationale
        CC->>W: remember(type=company, label=fivetran, section=Fit)
        CC->>U: Intel + Fit output
    end
```

---

### Flow C — Code / MCP Dev Task

```mermaid
sequenceDiagram
    participant U as User
    participant CC as Claude Code
    participant CE as localhost:8088
    participant FS as brain-os-mcp/ files

    U->>CC: "Change the recall tool schema"
    CC->>CE: POST /healthcheck
    CE-->>CC: ok
    CC->>CE: POST /context (path=brain-os-mcp/)
    CE-->>CC: ai-context/context-bundle.md
    CC->>FS: Read specific tool file (src/tools/recall.ts)
    FS-->>CC: file content
    CC->>FS: Edit in brain-os-mcp/ (NOT brain-os/)
    Note over CC: Never edit brain-os-mcp from brain-os session
```

---

### Flow D — Interview Prep

```mermaid
sequenceDiagram
    participant U as User
    participant CC as Claude Code
    participant CE as localhost:8088
    participant R as BrainOS recall
    participant MCP as BrainOS MCP
    participant W as remember()

    U->>CC: "Prep me for Fivetran"
    CC->>R: recall(type=company, label=fivetran) — all sections
    R-->>CC: Intel + Fit + prior Prep (if any)
    CC->>CE: POST /find — scan context-store/career/achievements.md
    CE-->>CC: relevant achievements + STAR stories
    CC->>MCP: prep(company=Fivetran, session_notes=synthesized context)
    MCP-->>CC: prep output (questions, anchor stories, talking points)
    CC->>W: remember(type=company, label=fivetran, section=Prep)
    CC->>U: Prep output
```

---

## Freshness Reference

| Data Type | Primary Source | Hit External When | Staleness Rule |
|-----------|---------------|-------------------|----------------|
| Calendar events | Google Calendar MCP | **Always** — never cache | Live only |
| Gmail | Gmail MCP | **Always** — filter last 7–14d | Live only |
| Notion pipeline | `recall(type=company)` → Notion | recall miss OR feels stale | Re-query if >7d since last `remember` |
| Company intel | `recall(type=company, section=Intel)` | recall miss OR major company event | Re-run `intel()` if >30d old |
| Session history | `context-store/sessions/` (local) | Never — always local | Read last 3 sessions; recall for older |
| Career docs | `context-store/career/` (local) | Never — always local | Stable; manual edits only |
| Code context | localhost:8088 `/context` or `/find` | On task start for code tasks | Re-scan if files changed since last scan |
| Stories / STAR | `recall(type=story)` | Never — always in recall | Updated manually via `remember` |
| Patterns / insights | `recall(type=insight)` | Never — always in recall | Updated via `diagnose` tool |

---

## concept-images/

Three PNGs — private visual reference only. No programmatic pipeline. Never read, quoted, passed to tools, or embedded in outputs. Purely for manual inspiration when designing UX or positioning.

---

## What's Not Yet Built

| Gap | Impact | Priority |
|-----|--------|----------|
| localhost:8088 not wired into daily brief flow | Sessions and career docs scanned manually, not automatically on session start | Low |
| concept-images/ has no pipeline | Images unused by any tool or workflow | Low (by design) |
| PostToolUse/Stop hooks not configured | Persist reminders and session-write.sh are manual | Medium |

## Recently Fixed (2026-05-24)

| Gap | Fix |
|-----|-----|
| `searchMemory()` not exposed | ✅ `search` MCP tool live — semantic discovery across `brain_os_memories` |
| `recall` returns `updated_at` in prose only | ✅ `recall` now returns `{ content, updatedAt, label, type }` — machine-readable |
| No label discovery for cold-start | ✅ `recall(action="list", listType="company")` enumerates stored labels |
| `intel.ts` doc said LLM-driven | ✅ JSDoc + mcp-map.md corrected: intel() is a brief generator; orchestrator drives research |
