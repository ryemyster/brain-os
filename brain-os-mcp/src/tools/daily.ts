import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR, WRITING_DIR, PROJECTS_DIR } from "../config.js";
import { readRecentSessions, readPatterns } from "../context.js";
import { NOTION_PAGES, NOTION_COLLECTIONS, buildNotionContext } from "../notion.js";

const SYSTEM = `You are the personal morning brief assistant for Ryan K. McDonald — Senior PM (AI/FinTech/HealthTech), actively job hunting for Senior PM or Head of Product roles.

Generate a scannable morning brief. Rules:
- Short bullets only, no paragraphs
- Lead with job pipeline and today's 3 priority actions
- Surface upcoming interviews, stale follow-ups, or deadlines first
- Flag writing ideas marked drafting or ready-to-publish
- If there are recent practice sessions, surface one thing to work on
- If there are known patterns from past interviews, include one drill for today
- End with an optional one-liner on any active project that needs attention
- Notion data is the source of truth for pipeline status; local files are fallback only`;

export function runDaily(): object {
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

  const projectsPath = join(PROJECTS_DIR, "index.md");
  const projects = existsSync(projectsPath) ? readFileSync(projectsPath, "utf-8") : "(no projects index)";

  const recentSessions = readRecentSessions(3);
  const patterns = readPatterns();

  const localContext = [
    `## Local Pipeline Files (fallback)\n${pipeline.length > 0 ? pipeline.join("\n\n") : "Empty — no companies in career/pipeline/ yet."}`,
    `## Writing Ideas\n${ideas}`,
    `## Active Projects\n${projects}`,
    recentSessions.length > 0
      ? `## Recent Practice Sessions\n${recentSessions.map((s) => `**${s.filename}**\n${s.content}`).join("\n\n")}`
      : "",
    patterns ? `## Interview Patterns on File\n${patterns}` : "",
  ]
    .filter(Boolean)
    .join("\n\n---\n\n");

  return {
    task: "Generate a scannable morning brief for Ryan K. McDonald.",
    system_prompt: SYSTEM,
    instructions: [
      "Fetch each item in notion_context using the Notion MCP fetch/query tools.",
      "Interview Tracker DB is the source of truth for pipeline status — use it to surface active roles, next actions, and stale items.",
      "Recruiter Activity shows recent conversations — surface any that need follow-up.",
      "Weekly Unemployment Tracker shows whether this week's claim has been filed.",
      "Land a Role Plan gives the operating goals and weekly cadence to check against.",
      "After fetching Notion data, assemble all context and generate the brief per the system_prompt.",
      "Local context is provided as fallback if Notion data is unavailable.",
    ],
    notion_context: buildNotionContext([
      {
        label: "Interview Tracker (live pipeline)",
        id: NOTION_COLLECTIONS.interview_tracker,
        type: "collection",
      },
      {
        label: "Recruiter / Interview Activity (recent conversations)",
        id: NOTION_COLLECTIONS.recruiter_interview_activity,
        type: "collection",
      },
      {
        label: "Weekly Unemployment Filing Status",
        id: NOTION_COLLECTIONS.weekly_unemployment_tracker,
        type: "collection",
      },
      {
        label: "Prep / Materials Work Log",
        id: NOTION_COLLECTIONS.prep_materials_work,
        type: "collection",
      },
      {
        label: "Land a Role Plan of Action (operating goals)",
        id: NOTION_PAGES.land_a_role_plan,
        type: "page",
      },
    ]),
    local_context: localContext,
  };
}
