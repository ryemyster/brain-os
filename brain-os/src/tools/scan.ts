import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";

export function runScan(filters?: { focus?: string; stage?: string; location?: string }): object {
  const resumePath = join(CAREER_DIR, "resume.md");
  const criteriaPath = join(CAREER_DIR, "job-criteria.md");
  const achievementsPath = join(CAREER_DIR, "achievements.md");

  const resume = existsSync(resumePath) ? readFileSync(resumePath, "utf-8") : "(empty — add resume to career/resume.md)";
  const criteria = existsSync(criteriaPath) ? readFileSync(criteriaPath, "utf-8") : "(empty — add criteria to career/job-criteria.md)";
  const achievements = existsSync(achievementsPath) ? readFileSync(achievementsPath, "utf-8") : "(empty)";

  const focusAreas = filters?.focus ?? "AI, FinTech, HealthTech";
  const location = filters?.location ?? "New York City";

  return {
    task: "Find companies actively hiring for PM roles that match this candidate's profile. Execute the search queries below, then synthesize findings into a prioritized opportunity list.",
    instructions: [
      "Run each search query and collect 15-20 distinct companies with open PM roles.",
      "For each company: extract role title, seniority, whether AI is core to the product, and any signals about team culture or PM org strength.",
      "Group results into tiers: Strong Fit (≥7/10), Worth Exploring (5-6/10), Pass (<5/10).",
      "For each Strong Fit company: write one sentence on why Ryan's background is specifically relevant.",
      "Flag any companies where the Ascendvent/AOSI founder angle or FounderOS MCP background is a differentiator.",
      "Note if any company recently raised, launched, or is in a growth push — these are the highest-urgency targets.",
    ],
    search_queries: [
      `"senior product manager" OR "head of product" AI fintech healthtech "${location}" site:greenhouse.io OR site:lever.co`,
      `"senior PM" OR "principal product manager" AI startup "${location}" -junior -associate`,
      `"product manager" AI "New York" fintech 2026 job opening`,
      `site:linkedin.com/jobs "senior product manager" AI New York`,
      `"head of product" OR "director of product" AI-native company NYC 2026`,
    ],
    candidate_profile: {
      target_roles: ["Senior PM", "Staff PM", "Head of Product", "Director of Product"],
      focus_areas: focusAreas,
      location,
      differentiators: "AI/FinTech/HealthTech PM, founder experience, built and shipped MCP server (FounderOS), agent orchestration and LLM product design background",
    },
    resume,
    job_criteria: criteria,
    achievements,
  };
}
