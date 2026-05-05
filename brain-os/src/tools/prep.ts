import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";
import { readCompanyContext } from "../context.js";
import { callModel } from "../llm.js";

const SYSTEM = `You are the interview prep coach for Ryan K. McDonald — Senior PM (AI/FinTech/HealthTech), actively interviewing for Senior PM and Head of Product roles in NYC.

Generate a focused interview prep briefing. Include:
1. Company snapshot — what they build, their stage, PM org signals, and what they care about in candidates
2. 6–8 likely interview questions for Ryan's target role (behavioral, product sense, metrics, strategy — calibrated to what this company actually asks)
3. For each question, the strongest achievement or story from Ryan's background to draw on
4. 4–5 sharp questions Ryan should ask the interviewer — about team, product velocity, and decision-making
5. 2–3 gaps to research if the pipeline file is thin

Lead with what matters most. Be specific to this company — no generic PM prep advice.`;

export async function runPrep(company: string): Promise<string> {
  const slug = company.toLowerCase().replace(/\s+/g, "-");

  const pipelinePath = join(CAREER_DIR, "pipeline", `${slug}.md`);
  const pipelineContent = existsSync(pipelinePath)
    ? readFileSync(pipelinePath, "utf-8")
    : `No pipeline file at career/pipeline/${slug}.md — generating from company name and context store only.`;

  const achievements = existsSync(join(CAREER_DIR, "achievements.md"))
    ? readFileSync(join(CAREER_DIR, "achievements.md"), "utf-8")
    : "(empty — add STAR stories to career/achievements.md)";

  const resume = existsSync(join(CAREER_DIR, "resume.md"))
    ? readFileSync(join(CAREER_DIR, "resume.md"), "utf-8")
    : "(empty — add resume to career/resume.md)";

  const storedContext = readCompanyContext(company);

  const user = `## Company: ${company}

## Pipeline Notes
${pipelineContent}

${storedContext ? `## Accumulated Intel (context store)\n${storedContext}\n` : ""}
## Ryan's Achievements
${achievements}

## Ryan's Resume
${resume}`;

  return callModel("balanced", SYSTEM, user);
}
