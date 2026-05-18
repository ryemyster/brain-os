import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { CAREER_DIR, WRITING_DIR, PROJECTS_DIR } from "../config.js";
import { readRecentSessions, readPatterns } from "../context.js";
import { callModel } from "../llm.js";

const SYSTEM = `You are the decision-focus morning brief assistant for Ryan K. McDonald.

Generate a crisp executive summary, not a data dump. Orientation questions you're answering:
1. Where am I today in the job hunt?
2. What are the 3 critical decisions or actions I need to make TODAY?
3. What's moving (interviews, recruiter interest, offers)?
4. What's stalled or at risk (follow-ups overdue, applications stuck)?
5. Any side projects that need a decision or greenlight?

Output format:
- **Today's Focus**: 3 bullet points — the only decisions/actions that matter today. Lead with interviews, close with projects.
- **Job Pipeline Status**: 1-2 bullet points on where things stand (offers, final rounds, applications in flight).
- **This Week's Deadlines**: if any (interview prep, follow-up response dates, writing deadlines).
- **Repo Health**: 1 bullet per repo that has open issues or blockers worth flagging. Skip repos with 0 issues. If all clean, say so in one line.
- **Stalled / At Risk**: flag anything overdue or waiting on you.
- **One thing to drill**: if interview prep is due, name it. If a project is on fire, name it.

Rules:
- No tables, no long lists. Extreme brevity.
- Use Calendar as source of truth for interviews. Gmail for recruiter signals.
- Notion interview_tracker is source of truth for pipeline state.
- Repo Health comes from Active Projects section — surface open issue counts and any P0 blockers.
- Prioritize what Ryan needs to DO or DECIDE today, not what's backgrounded.
- If nothing is critical today, say so explicitly — don't manufacture urgency.`;

interface DailyOptions {
  calendarEvents?: string;
  gmailThreads?: string;
  notionData?: string;
}

function getFocusScorecard(): string {
  const sessionsDir = "/Users/rmcdonald/Repos/ryemyster/brain-os/context/sessions";
  if (!existsSync(sessionsDir)) return "(no session history)";

  // Read last 5 sessions to analyze focus
  const sessions = readdirSync(sessionsDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse()
    .slice(0, 5);

  if (sessions.length === 0) return "(no sessions on file)";

  // Extract focus keywords from session notes
  const focusKeywords = {
    jobHunt: ["interview", "recruiter", "apply", "prep", "pipeline", "offer"],
    ascendvent: ["ascendvent", "checkin", "sevensharp", "aosi"],
    writing: ["blog", "publish", "draft", "frompixel"],
    sideProject: ["shale", "autoresearch", "cowork", "portfolio"],
  };

  const focusCounts = {
    jobHunt: 0,
    ascendvent: 0,
    writing: 0,
    sideProject: 0,
  };

  for (const session of sessions) {
    const content = readFileSync(`${sessionsDir}/${session}`, "utf-8").toLowerCase();
    Object.entries(focusKeywords).forEach(([area, keywords]) => {
      if (keywords.some((kw) => content.includes(kw))) {
        focusCounts[area as keyof typeof focusCounts]++;
      }
    });
  }

  // Calculate focus allocation
  const total = Object.values(focusCounts).reduce((a, b) => a + b, 0) || 1;
  const allocation = Object.entries(focusCounts).map(
    ([area, count]) => `- ${area}: ${Math.round((count / total) * 100)}%`
  );

  return `### Focus Over Last 5 Sessions\n${allocation.join("\n")}\n\n### Intended Focus (from operating goals)\n- Job hunt: 70%\n- Ascendvent: 20%\n- Writing: 5%\n- Side projects: 5%\n\n### Analysis\nCompare actual vs intended. Areas where you're drifting will show up here on the next daily run.`;
}

function getProjectStatus(): string {
  const projectsPath = join(PROJECTS_DIR, "index.md");
  if (!existsSync(projectsPath)) return "(no projects index)";

  const content = readFileSync(projectsPath, "utf-8");
  const lines = content.split("\n");

  // Extract quick status table (lines 5-21 in the index)
  const tableStart = lines.findIndex((l) => l.includes("| Project |"));
  if (tableStart === -1) return "(no status table found)";

  const tableLines: string[] = [lines[tableStart]];
  for (let i = tableStart + 1; i < lines.length; i++) {
    if (lines[i].startsWith("|")) {
      tableLines.push(lines[i]);
    } else {
      break;
    }
  }
  const statusTable = tableLines.join("\n");

  const projects = [
    { name: "checkin-ascendvent", repo: "ascendvent/checkin-ascendvent", localPath: null },
    { name: "brain-os", repo: "ryemyster/brain-os", localPath: "/Users/rmcdonald/Repos/ryemyster/brain-os" },
    { name: "portfolio", repo: "ryemyster/portfolio", localPath: "/Users/rmcdonald/Repos/ryemyster/portfolio" },
    { name: "frompixelstopunk", repo: "ryemyster/frompixelstopunk", localPath: "/Users/rmcdonald/Repos/ryemyster/frompixelstopunk" },
    { name: "techyeet-gaming", repo: "ryemyster/techyeet-gaming", localPath: "/Users/rmcdonald/Repos/ryemyster/techyeet-gaming" },
    { name: "vscode-themes-vibecoded", repo: "ryemyster/vscode-themes-vibecoded", localPath: "/Users/rmcdonald/Repos/ryemyster/vscode-themes-vibecoded" },
    { name: "ascendvent-home", repo: "ascendvent/ascendvent-home", localPath: "/Users/rmcdonald/Repos/ascendvent/ascendvent-home" },
    { name: "founderos", repo: "ascendvent/founderos", localPath: "/Users/rmcdonald/Repos/ascendvent/founderos" },
    { name: "SevenSharp", repo: "ascendvent/SevenSharp", localPath: "/Users/rmcdonald/Repos/ascendvent/SevenSharp" },
    { name: "ascendvent-planning", repo: "ascendvent/ascendvent-planning", localPath: "/Users/rmcdonald/Repos/ascendvent/ascendvent-planning" },
    { name: "ShaleYeah", repo: "ryemyster/ShaleYeah", localPath: "/Users/rmcdonald/Repos/ryemyster/ShaleYeah" },
    { name: "small-language-models-for-pms", repo: "ryemyster/small-language-models-for-pms", localPath: "/Users/rmcdonald/Repos/ryemyster/small-language-models-for-pms" },
    { name: "autoresearch", repo: "ryemyster/autoresearch", localPath: "/Users/rmcdonald/Repos/ryemyster/autoresearch" },
    { name: "Claude-Cowork", repo: "ryemyster/Claude-Cowork", localPath: "/Users/rmcdonald/Repos/Claude-Cowork" },
  ];

  const liveStatus: string[] = [];
  for (const proj of projects) {
    const parts: string[] = [`- **${proj.name}**`];

    // GitHub open issue count
    try {
      const output = execSync(
        `.claude/scripts/gh-brain-os.sh issue list --repo ${proj.repo} --state open --json number --jq length`,
        { encoding: "utf-8", cwd: "/Users/rmcdonald/Repos/ryemyster/brain-os" }
      ).trim();
      const count = parseInt(output, 10) || 0;
      parts.push(`${count} open issues`);
    } catch (e) {
      parts.push("(issues unavailable)");
    }

    // Last 5 commits from local repo
    if (proj.localPath && existsSync(proj.localPath)) {
      try {
        const log = execSync(
          `git log --oneline -5`,
          { encoding: "utf-8", cwd: proj.localPath }
        ).trim();
        if (log) {
          parts.push(`\n  Recent commits:\n${log.split("\n").map(l => `    ${l}`).join("\n")}`);
        }
      } catch (e) {
        // not a git repo or no commits
      }
    }

    liveStatus.push(parts.join(" | "));
  }

  return `${statusTable}\n\n### Live Issue Counts\n${liveStatus.join("\n")}`;
}

export async function runDaily(options: DailyOptions = {}): Promise<string> {
  const { calendarEvents, gmailThreads, notionData } = options;

  const [projectStatus, focusScorecard] = await Promise.all([
    Promise.resolve(getProjectStatus()),
    Promise.resolve(getFocusScorecard()),
  ]);

  const pipelineDir = join(CAREER_DIR, "pipeline");
  const pipeline: string[] = [];
  if (existsSync(pipelineDir)) {
    for (const file of readdirSync(pipelineDir).filter((f) => f.endsWith(".md") && f !== ".gitkeep")) {
      const company = file.replace(".md", "");
      const content = readFileSync(join(pipelineDir, file), "utf-8");
      pipeline.push(`### ${company}\n${content}`);
    }
  }

  const ideasPath = join(WRITING_DIR, "ideas.md");
  const ideas = existsSync(ideasPath) ? readFileSync(ideasPath, "utf-8") : "(no ideas file)";

  const patterns = readPatterns();

  const user = [
    notionData ? `## Notion Pipeline Data — Source of Truth\n${notionData}` : `## Notion Pipeline Data\n(not provided — pipeline state unknown)`,
    calendarEvents ? `## Calendar — This Week's Interviews\n${calendarEvents}` : "",
    gmailThreads ? `## Gmail — Recent Recruiter Messages\n${gmailThreads}` : "",
    pipeline.length > 0 ? `## Company Pipeline Files\n${pipeline.join("\n\n")}` : "",
    `## Focus Alignment\n${focusScorecard}`,
    `## Active Projects\n${projectStatus}`,
    patterns ? `## Recurring Patterns\n${patterns}` : "",
  ]
    .filter(Boolean)
    .join("\n\n---\n\n");

  return callModel("fast", SYSTEM, user);
}
