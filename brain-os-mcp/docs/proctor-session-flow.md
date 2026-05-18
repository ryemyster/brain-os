# Proctor Session Flow

The `proctor` tool is the only stateful tool in BrainOS. Every other tool is a single-shot call. Proctor runs a multi-turn mock interview loop — question → answer → feedback → next question — across as many calls as the session has questions.

This document explains how session state is managed, how conversation history is kept bounded, and where rolling summarization fires.

---

## Key design choices

| Choice | Reason |
|--------|--------|
| State lives in Supabase, not the caller | MCP tools are stateless. The caller (Claude Code) only needs to pass `session_id` — it doesn't carry the history. |
| Rolling summarization via Haiku | Long sessions would overflow Sonnet's context. Haiku compresses old turns cheaply, preserving structure without blowing cost. |
| Structured JSON summary (not prose) | Sonnet reasons more reliably over `{ key_facts, decisions, outputs, open_items }` than over a paragraph summary. |
| Nudge suffix stripped before saving | The `[ask next question: "..."]` hint sent to Sonnet is a model hint only — it never enters the canonical history. |

---

## Sequence: New Session

```mermaid
sequenceDiagram
    actor Ryan
    participant CC as Claude Code
    participant P as proctor.ts
    participant LLM as llm.ts
    participant Sonnet as Sonnet (balanced)
    participant Haiku as Haiku (fast)
    participant Ollama
    participant SB as Supabase

    Ryan->>CC: "Run me through a behavioral interview"
    CC->>P: runProctor("behavioral")

    P->>P: pickQuestions() → 5 questions
    P->>P: read resume.md (snippet)
    P->>P: build setupMessage (questions, rubric, resume)

    P->>LLM: callModelConversation("balanced", system, [setupMessage])
    LLM->>Sonnet: messages=[{role:"user", content:setupMessage}]
    Sonnet-->>LLM: opening message + Q1
    LLM-->>P: openingMessage

    P->>P: build SessionState { session_id, turns:[setup,opening], asked_count:1 }

    P->>Ollama: embed(JSON.stringify(state))
    Ollama-->>P: 768-dim vector
    P->>SB: upsert(type="proctor_session", label=session_id, content, embedding)
    SB-->>P: ok

    P-->>CC: { session_id, message: openingMessage, progress:{asked:0,total:5}, complete:false }
    CC-->>Ryan: displays Q1
```

---

## Sequence: Answer Pass (no compression)

Turns are below the compression threshold (≤ 8). History is sent as-is.

```mermaid
sequenceDiagram
    actor Ryan
    participant CC as Claude Code
    participant P as proctor.ts
    participant LLM as llm.ts
    participant Sonnet as Sonnet (balanced)
    participant Ollama
    participant SB as Supabase

    Ryan->>CC: "My answer is..."
    CC->>P: runProctor(..., session_id, answer)

    P->>SB: getMemory("proctor_session", session_id)
    SB-->>P: SessionState (turns, asked_count, questions, config)

    P->>P: append { role:"user", content:answer } to turns
    Note over P: turns.length ≤ 8 — skip compression

    P->>P: build turnsForCall (answer + "[ask Q2]" nudge on last turn)
    P->>LLM: callModelConversation("balanced", system, turnsForCall)
    LLM->>Sonnet: messages=[...turns, answer+nudge]
    Sonnet-->>LLM: feedback on Q1 + Q2
    LLM-->>P: response

    P->>P: append { role:"assistant", content:response } to turns
    P->>P: asked_count++ → 2

    P->>Ollama: embed(JSON.stringify(updatedState))
    Ollama-->>P: vector
    P->>SB: upsert(updated state)
    SB-->>P: ok

    P-->>CC: { session_id, message: response, progress:{asked:2,total:5}, complete:false }
    CC-->>Ryan: displays feedback + Q2
```

---

## Sequence: Answer Pass (with rolling summarization)

Fires when `turns.length > 8` — typically after the 4th or 5th exchange in a longer session.

```mermaid
sequenceDiagram
    actor Ryan
    participant CC as Claude Code
    participant P as proctor.ts
    participant LLM as llm.ts
    participant Haiku as Haiku (fast)
    participant Sonnet as Sonnet (balanced)
    participant Ollama
    participant SB as Supabase

    Ryan->>CC: "My answer is..."
    CC->>P: runProctor(..., session_id, answer)

    P->>SB: getMemory("proctor_session", session_id)
    SB-->>P: SessionState

    P->>P: append { role:"user", content:answer }
    Note over P: turns.length > 8 — compress

    P->>LLM: compressHistory(turns, keepRecent=6)

    LLM->>LLM: split: old=turns[0..n-7], recent=turns[-6..]
    LLM->>LLM: build transcript from old turns

    LLM->>Haiku: "Extract structured state from this transcript"
    Haiku-->>LLM: { key_facts:[...], decisions:[...], outputs:[...], open_items:[...] }

    LLM->>LLM: build summaryTurn + ackTurn
    LLM-->>P: [summaryTurn, ackTurn, ...recent 6 turns]

    P->>P: replace state.turns with compressed history
    P->>P: build turnsForCall (compressed + nudge on last turn)

    P->>LLM: callModelConversation("balanced", system, turnsForCall)
    LLM->>Sonnet: messages=[summary, ack, ...recent, answer+nudge]
    Sonnet-->>LLM: feedback + next question
    LLM-->>P: response

    P->>P: append assistant response, asked_count++
    P->>Ollama: embed(JSON.stringify(updatedState))
    Ollama-->>P: vector
    P->>SB: upsert(compressed state)
    SB-->>P: ok

    P-->>CC: { session_id, message: response, progress, complete:false }
    CC-->>Ryan: displays feedback + next question
```

---

## Sequence: Final Answer

Same as a regular answer pass, but `asked_count >= questions.length` triggers the final summary path.

```mermaid
sequenceDiagram
    actor Ryan
    participant CC as Claude Code
    participant P as proctor.ts
    participant LLM as llm.ts
    participant Sonnet as Sonnet (balanced)
    participant Ctx as context.ts
    participant SB as Supabase

    Ryan->>CC: "My answer to the last question..."
    CC->>P: runProctor(..., session_id, answer)

    P->>SB: getMemory("proctor_session", session_id)
    SB-->>P: SessionState

    P->>P: append answer
    Note over P: asked_count >= questions.length → isLastQuestion=true
    P->>P: suffix = "[That was the last question. Deliver final summary.]"

    P->>LLM: callModelConversation("balanced", system, turns+suffix)
    LLM->>Sonnet: messages with final summary nudge
    Sonnet-->>LLM: per-answer feedback + session summary
    LLM-->>P: response

    P->>P: complete = true
    P->>Ctx: writeSession(company, type, response)
    Ctx->>SB: insertMemory("session", label, summary)

    P->>SB: upsert(final state, complete:true)

    P-->>CC: { session_id, message: response, progress:{asked:N,total:N}, complete:true }
    CC-->>Ryan: displays final feedback + session summary
```

---

## State shape

Each Supabase row stores the full `SessionState` as a JSON string:

```typescript
interface SessionState {
  session_id: string;
  config: { type, difficulty, company, role };
  questions: Array<{ type, text, rubric[] }>;
  asked_count: number;   // questions asked so far
  turns: ConversationTurn[];  // compressed history
  complete: boolean;
}
```

**Note on embedding:** Every `saveSession` call embeds the full JSON via Ollama. For proctor sessions, the vector is never used — retrieval is always by exact `session_id`. This is a known inefficiency inherited from routing everything through `upsertMemory`. A future `insertRaw` path in `memory.ts` would skip the embed step for session-keyed lookups.

---

## Compression budget

| Metric | Value |
|--------|-------|
| Compression threshold | `turns.length > 8` (4 exchanges) |
| Turns kept verbatim | 6 (last 3 exchanges) |
| Model used to compress | Haiku (`claude-haiku-4-5-20251001`) |
| Max tokens for summary | 1024 |
| Output format | Structured JSON |
