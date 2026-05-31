# BrainOS Configuration Map Archive

This is a historical placeholder for the pre-split BrainOS configuration map.

Do not use this file as current operating guidance.

## Current Configuration Model

BrainOS is now split into two responsibilities:

| Layer | Location | Owns |
|------|----------|------|
| Orchestration workspace | `/Users/rmcdonald/Repos/ryemyster/brain-os` | Claude instructions, skills, agents, rules, local context taxonomy, context selection |
| MCP server | `/Users/rmcdonald/Repos/ryemyster/brain-os-mcp` | MCP schemas, validation, tool execution, configured integrations, operational memory writes |

## Current References

| Need | Current Source |
|------|----------------|
| Repo map | `.claude/project-map.md` |
| Context contract | `.claude/brainos-context-contract.md` |
| MCP server registration | `.claude/MCP-SERVERS.md` |
| Local context docs | `context-store/context/README.md` |
| Skills | `.claude/commands/README.md` |
| Rules and hooks | `.claude/rules/README.md` |

## Archive Note

The original configuration map was intentionally removed because it described the old in-repo MCP server layout and pre-`context-store/` paths.
