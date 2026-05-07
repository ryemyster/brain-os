import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { CAREER_DIR, WRITING_DIR, PROJECTS_DIR } from "../config.js";
import { readRecentSessions, readPatterns } from "../context.js";
import { callModel } from "../llm.js";
import { notion, NOTION_COLLECTIONS, NOTION_PAGES } from "../notion-client.js";

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
- **Stalled / At Risk**: flag anything overdue or waiting on you.
- **One thing to drill**: if interview prep is due, name it. If a project is on fire, name it.

Rules:
- No tables, no long lists. Extreme brevity.
- Use Calendar as source of truth for interviews. Gmail for recruiter signals.
- Notion interview_tracker is source of truth for pipeline state.
- Prioritize what Ryan needs to DO or DECIDE today, not what's backgrounded.
- If nothing is critical today, say so explicitly — don't manufacture urgency.`;

interface DailyOptions {
  calendarEvents?: string;
  gmailThreads?: string;
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

  // Fetch live issue counts for each project (13 total)
  const projects = [
    { name: "checkin-ascendvent", repo: "ascendvent/checkin-ascendvent" },
    { name: "brain-os", repo: "ryemyster/brain-os" },
    { name: "portfolio", repo: "ryemyster/portfolio" },
    { name: "frompixelstopunk", repo: "ryemyster/frompixelstopunk" },
    { name: "techyeet-gaming", repo: "ryemyster/techyeet-gaming" },
    { name: "vscode-themes-vibecoded", repo: "ryemyster/vscode-themes-vibecoded" },
    { name: "ascendvent-home", repo: "ascendvent/ascendvent-home" },
    { name: "founderos", repo: "ascendvent/founderos" },
    { name: "SevenSharp", repo: "ascendvent/SevenSharp" },
    { name: "ascendvent-planning", repo: "ascendvent/ascendvent-planning" },
    { name: "ShaleYeah", repo: "ryemyster/ShaleYeah" },
    { name: "small-language-models-for-pms", repo: "ryemyster/small-language-models-for-pms" },
    { name: "autoresearch", repo: "ryemyster/autoresearch" },
  ];

  const liveStatus: string[] = [];
  for (const proj of projects) {
    try {
      const output = execSync(
        `.claude/scripts/gh-brain-os.sh issue list --repo ${proj.repo} --state open --json number --jq length`,
        { encoding: "utf-8", cwd: "/Users/rmcdonald/Repos/ryemyster/brain-os" }
      ).trim();
      const count = parseInt(output, 10) || 0;
      liveStatus.push(`- **${proj.name}**: ${count} open issues`);
    } catch (e) {
      liveStatus.push(`- **${proj.name}**: (unable to fetch)`);
    }
  }

  return `${statusTable}\n\n### Live Issue Counts\n${liveStatus.join("\n")}`;
}

export async function runDaily(options: DailyOptions = {}): Promise<string> {
  const { calendarEvents, gmailThreads } = options;
  const [tracker, recruiterActivity, unemploymentStatus, landARolePlan, projectStatus, focusScorecard] = await Promise.all([
    notion.queryDatabase(NOTION_COLLECTIONS.interview_tracker),
    notion.queryDatabase(NOTION_COLLECTIONS.recruiter_interview_activity),
    notion.queryDatabase(NOTION_COLLECTIONS.weekly_unemployment_tracker),
    notion.fetchPage(NOTION_PAGES.land_a_role_plan),
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
    `## Interview Tracker (Notion) — Source of Truth\n${tracker}`,
    `## Recruiter Activity (Notion)\n${recruiterActivity}`,
    calendarEvents ? `## Calendar — This Week's Interviews\n${calendarEvents}` : "",
    gmailThreads ? `## Gmail — Recent Recruiter Messages\n${gmailThreads}` : "",
    `## Current Decisions on the Table\n${landARolePlan}`,
    `## Focus Alignment\n${focusScorecard}`,
    `## Active Projects\n${projectStatus}`,
  ]
    .filter(Boolean)
    .join("\n\n---\n\n");

  return callModel("fast", SYSTEM, user);
}
