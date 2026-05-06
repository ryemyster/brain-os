# BrainOS

BrainOS is your personal command center inside Claude. It gives Claude a set of tools — called an MCP server — that know who you are, what you're working on, and what you need help with. Instead of explaining yourself every session, Claude already knows.

---

## What It Does

BrainOS gives Claude 11 tools it can use on your behalf:

| Tool | What it does |
|------|-------------|
| `daily` | Morning brief — your job pipeline, writing queue, and 3 focus items |
| `prep` | Interview or meeting prep for a specific company |
| `apply` | Gap analysis + cover letter draft when you paste a job description |
| `scan` | Finds companies hiring PMs that match your profile |
| `fit` | Scores how well you match a specific company |
| `intel` | Research brief on a company before you reach out |
| `outreach` | Drafts a LinkedIn DM and email to a specific person or company |
| `proctor` | Runs a mock interview and gives feedback after each answer |
| `diagnose` | Reads your interview notes and finds patterns in what's going wrong |
| `story_draft` | Interviews you to surface and polish your STAR stories |
| `loop` | Shows the full interview loop for any MAANG company, or drills into one round |

---

## How to Use It

You don't call these tools yourself. Claude calls them automatically when you ask for something.

**Examples of things you can say:**

- *"Give me my morning brief"* → Claude calls `daily`
- *"Prep me for my Stripe interview tomorrow"* → Claude calls `prep`
- *"Here's a job description, help me apply"* → Claude calls `apply`
- *"Run me through a mock behavioral interview for Google"* → Claude calls `proctor` + `loop`
- *"What's Meta's interview loop look like?"* → Claude calls `loop`
- *"Help me write my leadership story"* → Claude calls `story_draft`

Claude decides which tool to use. You just talk.

---

## How to Set It Up

### Step 1 — Install dependencies

Open a terminal, go into the `brain-os` folder, and run:

```bash
cd /Users/rmcdonald/Repos/my-brain/brain-os
npm install
```

### Step 2 — Build it

```bash
npm run build
```

This compiles the TypeScript code into JavaScript that Node can run. You'll see a `dist/` folder appear. That's the built version.

### Step 3 — Tell Claude where it lives

BrainOS is already registered in Claude Code at `~/.claude/settings.json`. It points to the built file at `dist/index.js` and tells it where your brain files live via `BRAIN_ROOT`.

If you ever need to check or fix this registration, open `~/.claude/settings.json` and look for the `brain-os` entry:

```json
"brain-os": {
  "type": "stdio",
  "command": "node",
  "args": ["/Users/rmcdonald/Repos/my-brain/brain-os/dist/index.js"],
  "env": {
    "BRAIN_ROOT": "/Users/rmcdonald/Repos/my-brain"
  }
}
```

### Step 4 — Fill in your files

BrainOS reads from files in the `career/` folder. Until you fill these in, it will tell you they're empty rather than guessing.

| File | What to put in it |
|------|------------------|
| `career/resume.md` | Your full resume, pasted as plain text |
| `career/achievements.md` | Your biggest wins with numbers — STAR format |
| `career/voice-and-style.md` | How you write: tone, words you use, things you avoid |
| `career/job-criteria.md` | What you're looking for in a role |
| `career/portfolio.md` | Projects and products you've shipped |

For companies you're pursuing, create one file per company:

```
career/pipeline/stripe.md
career/pipeline/anthropic.md
```

After each interview, write notes here:

```
career/interview-notes/stripe-phone-screen.md
```

---

## How It Works (the simple version)

When you ask Claude something, Claude calls a BrainOS tool. The tool reads your files, packages them up with instructions, and hands them back to Claude. Claude then uses that information to answer you.

BrainOS itself is not smart — it just knows where your files are and how to organize them. Claude is the smart part. BrainOS just makes sure Claude has the right context before it starts.

```
You ask Claude something
  → Claude calls a BrainOS tool
    → Tool reads your career/ files
    → Tool returns structured context to Claude
      → Claude answers using your actual information
```

---

## How to Maintain It

### Rebuilding after changes

Any time a new version of BrainOS is pulled or you make changes to the `src/` files, rebuild:

```bash
cd /Users/rmcdonald/Repos/my-brain/brain-os
npm run build
```

Then restart your Claude Code session so it picks up the new build.

### Keeping your files current

BrainOS is only as good as what's in your `career/` files. The two most important habits:

1. **After every interview** — add a note to `career/interview-notes/`. Even a few bullet points. The `diagnose` tool reads all of these to find patterns.
2. **When something changes in your job search** — update `career/pipeline/` for that company. Add a file when you apply, update it as rounds progress.

### Adding a new company to pipeline

Create a new file:

```bash
touch /Users/rmcdonald/Repos/my-brain/career/pipeline/company-name.md
```

Open it and write what you know: the role, who you talked to, where you are in the process, any notes on their culture or interview style.

### Checking if it's working

If BrainOS tools stop responding, run this to test it directly:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | \
  BRAIN_ROOT=/Users/rmcdonald/Repos/my-brain \
  node /Users/rmcdonald/Repos/my-brain/brain-os/dist/index.js 2>/dev/null
```

You should see a list of 11 tools. If you get an error, rebuild with `npm run build` first.

### Branch workflow

| Branch | Purpose |
|--------|---------|
| `main` | Stable, working version |
| `develop` | Where new tools and changes get built and tested |

New work goes on `develop`. When it's tested and working, merge to `main`.

---

## Folder Map

```
brain-os/
├── src/
│   ├── index.ts          ← entry point (starts the server)
│   ├── server.ts         ← registers all 11 tools
│   ├── config.ts         ← paths and environment variables
│   ├── data/
│   │   └── maang.ts      ← MAANG interview loop data
│   └── tools/
│       ├── daily.ts
│       ├── prep.ts
│       ├── apply.ts
│       ├── scan.ts
│       ├── fit.ts
│       ├── intel.ts
│       ├── outreach.ts
│       ├── proctor.ts
│       ├── diagnose.ts
│       ├── story_draft.ts
│       └── loop.ts
├── dist/                 ← built output (don't edit, auto-generated)
├── package.json
├── tsconfig.json
└── README.md             ← you are here
```

---

## Phase 4 Integrations (not yet built)

These are planned for a future phase:

- **GitHub MCP** — repo activity and status across all projects
- **Google Analytics MCP** — writing performance for the blog and portfolio
- **Google Calendar** — pull interview dates and deadlines into `daily`
- **Gmail** — surface job-related threads in `daily`
- **Notion** — write application activity back to the job pipeline database
