---
name: job-search
description: Full job hunt workflow for Ryan K. McDonald. Use this skill to understand when and how to chain BrainOS tools across the job search lifecycle — from discovering opportunities to closing offers. Invoke when Ryan asks about companies, roles, applications, interviews, outreach, or career strategy.
---

# Job Search Workflow

Ryan is actively seeking Senior PM or Head of Product roles at AI-native companies, primarily in Denver, CO but open to relocation. This skill defines how to orchestrate BrainOS tools across the full job hunt lifecycle.

## The lifecycle

```
DISCOVER → RESEARCH → QUALIFY → PURSUE → INTERVIEW → LEARN
```

Each stage has specific tools. They chain — output from one feeds the next.

---

## Stage 1: Discover

**Goal:** Find companies worth pursuing that Ryan hasn't identified yet.

**Tool:** `scan`

**When to run:**

- Ryan asks "what should I be applying to?" or "find me companies"
- No specific company has been named
- Weekly — pipeline can go stale fast

**What it does:** Searches for active PM openings at AI/FinTech/HealthTech companies in NYC, tiers results by fit, flags urgency signals (recent funding, growth push).

**Output feeds:** Company names worth moving into Stage 2.

---

## Stage 2: Research

**Goal:** Understand a specific company before investing time pursuing it.

**Tool:** `intel`

**When to run:**

- A company name is mentioned without context
- Before `fit`, `prep`, `apply`, or `outreach`
- Ryan asks "what do you know about X?"

**What it does:** Researches NYC presence, org health (funding, layoffs, hiring pace), market strategy, product direction, and PM org structure. Writes findings to `context/companies/{slug}.md`.

**Output feeds:** `fit` scoring, `prep` talking points, `outreach` angle.

---

## Stage 3: Qualify

**Goal:** Decide whether to actively pursue a company.

**Tool:** `fit`

**When to run:**

- After `intel` for any strong-signal company
- Ryan asks "is X a good fit for me?"

**What it does:** Scores Ryan against the company across domain fit, industry match, technical depth, stage fit, and leadership level. Returns a verdict with strongest angles and likely objections.

**Decision gate:** Green → move to Stage 4. Yellow → monitor. Red → pass.

---

## Stage 4: Pursue

**Goal:** Get into the pipeline — via application or warm outreach.

**Tools:** `apply`, `outreach`

**`apply` — when Ryan pastes a JD:**

1. Gap analysis against `career/resume.md` and `career/achievements.md`
2. Cover letter draft in Ryan's voice (`career/voice-and-style.md`)
3. Always lead with gap analysis before drafting

**`outreach` — when no open role or wants a warm path:**

1. Identifies best contact angle (hiring manager, PM lead, warm intro)
2. Drafts LinkedIn DM and email
3. Suggests warm intro paths from network
4. Logs to `context/outreach-log.md` and `context/companies/{slug}.md`

Run `intel` first if not already done — outreach angle depends on company context.

---

## Stage 5: Interview

**Goal:** Prepare and perform well across all interview formats.

**Tools:** `prep`, `proctor`, `loop`, `story_draft`

**`prep`** — before any call or interview:

- Loads pipeline notes and achievements
- Returns tailored talking points and likely questions for that company

**`loop`** — for MAANG companies:

- Returns full loop structure (rounds, rubrics, deal-breakers)
- Run before `proctor` to calibrate difficulty

**`proctor`** — for practice:

- Runs structured mock sessions: product, behavioral, metrics, strategy, vibe-coding, or full
- Gives per-answer feedback against a rubric
- Writes session summary to `context/sessions/`

**`story_draft`** — for story gaps:

- Mines experience conversationally by theme (leadership, failure, 0to1, conflict, etc.)
- Run when `proctor` exposes a weak story

---

## Stage 6: Learn

**Goal:** Get smarter after every interview, not just move on.

**Tools:** `diagnose`, `remember`

**`diagnose`** — after interviews accumulate:

- Reads all session notes in `career/interview-notes/` and `context/sessions/`
- Identifies recurring failure patterns, weak response types, story gaps
- Returns a ranked practice priority list
- Writes updated patterns to `context/patterns.md`

**`remember`** — after any session worth preserving:

- Explicit save of company intel, polished stories, insights, or session summaries
- Use when something important came up in conversation that a tool didn't capture

---

## Daily routine

Start each day with `daily`:

- Pipeline status (companies in flight, next actions)
- Writing queue
- 3 focus items

This gives orientation without needing to ask what to work on.

---

## Recommended chains

| Situation | Tool sequence |
|-----------|--------------|
| New company name mentioned | `intel` → `fit` → `prep` or `outreach` |
| Pasted JD | `apply` (reads resume automatically) |
| Upcoming interview | `prep` → `proctor` → `story_draft` if gaps |
| MAANG interview | `loop` → `prep` → `proctor` |
| Post-interview debrief | log to `career/interview-notes/` → `diagnose` |
| Feeling stuck on pipeline | `scan` → review `daily` |
| Want to warm a company | `intel` → `outreach` |

---

## Memory hygiene

The context store only learns if tools are used. Key habits:

- After real interviews: log notes to `career/interview-notes/` and run `diagnose`
- After `intel` or `outreach`: findings write automatically — no extra step needed
- After story work: run `remember type=story` to persist the polished version
- After any significant session: run `remember type=session` to capture what was learned
