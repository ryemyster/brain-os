import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";

export function runPrep(company: string): object {
  const slug = company.toLowerCase().replace(/\s+/g, "-");
  const pipelinePath = join(CAREER_DIR, "pipeline", `${slug}.md`);
  const achievementsPath = join(CAREER_DIR, "achievements.md");
  const resumePath = join(CAREER_DIR, "resume.md");

  const pipelineContent = existsSync(pipelinePath)
    ? readFileSync(pipelinePath, "utf-8")
    : null;

  const achievements = existsSync(achievementsPath)
    ? readFileSync(achievementsPath, "utf-8")
    : "(achievements file is empty — add STAR stories to career/achievements.md)";

  const resume = existsSync(resumePath)
    ? readFileSync(resumePath, "utf-8")
    : "(resume file is empty — add resume to career/resume.md)";

  return {
    task: `Generate an interview prep briefing for ${company}.`,
    instructions: [
      "Summarize what we know about this company from the pipeline file (role, team, stage, key people).",
      "Generate 6-8 likely interview questions based on the company type and role context.",
      "For each question, reference the most relevant achievement or story from the achievements file.",
      "Generate 4-5 sharp questions Ryan should ask the interviewer — focused on team, product, and pace.",
      "Flag 2-3 gaps to research before the interview if the pipeline file is thin.",
    ],
    company,
    pipeline_context: pipelineContent ?? `No pipeline file found at career/pipeline/${slug}.md. Generating based on company name only. Create the file to add role details, contacts, and notes.`,
    achievements,
    resume,
  };
}
