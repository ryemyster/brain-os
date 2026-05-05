import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR, WRITING_DIR, PROJECTS_DIR } from "../config.js";
import { readRecentSessions, readPatterns } from "../context.js";
import { callModel } from "../llm.js";

const SYSTEM = `You are the personal morning brief assistant for Ryan K. McDonald — Senior PM (AI/FinTech/HealthTech), actively job hunting in NYC for Senior PM or Head of Product roles.

Generate a scannable morning brief. Rules:
- Short bullets only, no paragraphs
- Lead with job pipeline and today's 3 priority actions
- Surface upcoming interviews, stale follow-ups, or deadlines first
- Flag writing ideas marked drafting or ready-to-publish
- If there are recent practice sessions, surface one thing to work on
- If there are known patterns from past interviews, include one drill for today
- End with an optional one-liner on any active project that needs attention`;

export async function runDaily(): Promise<string> {
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

  const user = [
    `## Job Pipeline\n${pipeline.length > 0 ? pipeline.join("\n\n") : "Empty — no companies in career/pipeline/ yet."}`,
    `## Writing Ideas\n${ideas}`,
    `## Active Projects\n${projects}`,
    recentSessions.length > 0
      ? `## Recent Practice Sessions\n${recentSessions.map((s) => `**${s.filename}**\n${s.content}`).join("\n\n")}`
      : "",
    patterns ? `## Interview Patterns on File\n${patterns}` : "",
  ]
    .filter(Boolean)
    .join("\n\n---\n\n");

  return callModel("fast", SYSTEM, user);
}
