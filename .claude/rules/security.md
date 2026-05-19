# Security Rules

Use this rule for every BrainOS task.

## Secrets And Environment Files

Never read, print, summarize, search inside, or copy contents from secret-bearing files.

Allowed:

- `.env.example`
- `.env.sample`
- `.env.template`
- documented placeholder examples with fake values

Forbidden unless the user explicitly names a specific file and confirms the action:

- `.env`
- `.env.*`
- `*.env`
- files containing real API keys, tokens, credentials, private keys, OAuth secrets, service-role keys, or database URLs
- shell history files
- local Claude settings that contain secrets
- local machine credential/config files

If a task appears to require a secret:

1. Do not inspect the secret file.
2. Ask the user to confirm the variable name only, not the value.
3. Use placeholder names like `NOTION_TOKEN` or `SUPABASE_SERVICE_ROLE_KEY`.
4. Recommend `.env.example` updates instead of reading real env files.

## Search Discipline

Do not run broad searches that intentionally discover secret files.

Avoid patterns like:

- finding all `.env` files
- grepping for token values
- reading machine-level settings for credentials

If checking configuration shape, search only for placeholder names in tracked docs or examples.

## Output Discipline

- Never include secret values in chat.
- If a secret appears in tool output, do not repeat it.
- Recommend rotation if a secret appears to be committed, printed, or exposed.
