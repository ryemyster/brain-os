import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";

export function runFit(company: string): object {
  const slug = company.toLowerCase().replace(/\s+/g, "-");

  const resumePath = join(CAREER_DIR, "resume.md");
  const achievementsPath = join(CAREER_DIR, "achievements.md");
  const criteriaPath = join(CAREER_DIR, "job-criteria.md");
  const pipelinePath = join(CAREER_DIR, "pipeline", `${slug}.md`);

  const resume = existsSync(resumePath) ? readFileSync(resumePath, "utf-8") : "(empty — add resume to career/resume.md)";
  const achievements = existsSync(achievementsPath) ? readFileSync(achievementsPath, "utf-8") : "(empty)";
  const criteria = existsSync(criteriaPath) ? readFileSync(criteriaPath, "utf-8") : "(empty)";
  const pipelineContext = existsSync(pipelinePath) ? readFileSync(pipelinePath, "utf-8") : null;

  return {
    task: `Score how well Ryan fits ${company} as a PM candidate. Research the company first, then analyze fit against the profile below.`,
    instructions: [
      `Research ${company}: what they build, what problems they solve, their PM org structure, and any open PM roles.`,
      "Score fit across these dimensions (1-5 each): Domain Expertise, Industry Match, Technical Depth, Company Stage Fit, Leadership Level Match.",
      "For each dimension: mark Strong (4-5), Partial (2-3), or Gap (1) and explain the rating in one sentence.",
      "Overall fit score out of 10 with a one-paragraph rationale.",
      "Identify the 2-3 angles where Ryan's background is uniquely relevant — be specific to this company.",
      "Identify the 1-2 most likely objections a hiring manager would have and suggest how to preempt them.",
      "Verdict: Prioritize, Worth Pursuing, or Pass — with one sentence of reasoning.",
    ],
    company,
    pipeline_context: pipelineContext ?? `No pipeline file yet for ${company}. Create career/pipeline/${slug}.md to add notes as you learn more.`,
    resume,
    achievements,
    job_criteria: criteria,
  };
}
