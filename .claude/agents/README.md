# Agents (Multi-Agent Teams)

This directory is reserved for sub-agent definitions — specialized Claude agents that can be spawned for complex, multi-step tasks that benefit from parallelism or role separation.

## What a sub-agent is

A sub-agent is a Claude instance with a focused role, specific tools, and a narrow scope. The orchestration layer (Claude Code) spawns one or more agents, collects their outputs, and synthesizes a result. Each agent gets a role prompt that constrains what it does.

## The concept architecture

The original concept diagram shows a 4-role team for complex research questions:

| Agent | Model | Role |
|-------|-------|------|
| Context Scout | Haiku | Fast — loads relevant files, prior sessions, and company context |
| Investigators | Sonnet | Deep — researches the question from multiple angles |
| Challenger | Sonnet | Critical — pokes holes in the investigators' conclusions |
| Report Writer | Haiku | Fast — synthesizes findings into a clean, structured output |

Flow: `Ground → Investigate → Challenge → Synthesize`

## What's missing

No agents are defined yet. This layer is not a priority right now. Candidate use cases when ready:

- **Deep company research** — spawn Investigators to pull funding history, team signals, product direction, and PM org in parallel, then synthesize into an intel report
- **Interview debrief synthesis** — Context Scout loads all session notes, Investigator identifies patterns, Challenger stress-tests the diagnosis, Report Writer produces a ranked practice plan
- **Article research** — parallel agents research different angles of a topic, Challenger flags weak claims, Report Writer assembles a sourced outline

## How to add an agent

Create a `.md` file here with the agent's role prompt, tool access, and expected output format. Reference it from a skill or MCP tool that spawns it.
