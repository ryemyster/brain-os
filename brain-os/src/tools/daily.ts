import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR, WRITING_DIR, PROJECTS_DIR } from "../config.js";
import { readRecentSessions, readPatterns } from "../context.js";

export function runDaily(): object {
  const pipelineDir = join(CAREER_DIR, "pipeline");
  const pipeline: Array<{ company: string; content: string }> = [];

  if (existsSync(pipelineDir)) {
    for (const file of readdirSync(pipelineDir).filter((f) => f.endsWith(".md"))) {
      pipeline.push({
        company: file.replace(".md", ""),
        content: readFileSync(join(pipelineDir, file), "utf-8"),
      });
    }
  }

  const ideasPath = join(WRITING_DIR, "ideas.md");
  const ideas = existsSync(ideasPath) ? readFileSync(ideasPath, "utf-8") : "(no ideas file yet)";

  const projectsPath = join(PROJECTS_DIR, "index.md");
  const projects = existsSync(projectsPath) ? readFileSync(projectsPath, "utf-8") : "(no projects index yet)";

  const recentSessions = readRecentSessions(3);
  const patterns = readPatterns();

  return {
    task: "Generate a morning brief from the context below.",
    instructions: [
      "Job pipeline: list each company, their last known status, and the next action needed.",
      "Identify 3 priority focus items for today — surface any upcoming interviews, deadlines, or stale follow-ups first.",
      "Writing queue: note any ideas marked as 'drafting' or 'ready-to-publish'.",
      "If any active projects need attention based on the index, flag them briefly.",
      "If recent_sessions is non-empty, surface the last practice session and one thing to work on from it.",
      "If patterns is non-empty, include the top pattern to practice today as a one-liner.",
      "Keep the brief scannable — use short bullets, no paragraphs.",
    ],
    pipeline: pipeline.length > 0 ? pipeline : [{ company: "(empty)", content: "No companies in pipeline yet. Add files to career/pipeline/{company-name}.md." }],
    ideas,
    projects,
    recent_sessions: recentSessions.length > 0 ? recentSessions : null,
    patterns: patterns || null,
  };
}
