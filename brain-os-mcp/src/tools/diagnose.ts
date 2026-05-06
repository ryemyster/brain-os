import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";
import { readPatterns, writePatterns } from "../context.js";
import { callModel } from "../llm.js";
import { notion, NOTION_PAGES, NOTION_COLLECTIONS } from "../notion-client.js";

const SYSTEM = `You are an interview performance coach for Ryan K. McDonald. Analyze his interview notes with unsparing honesty — the goal is to surface real patterns, not reassure him.

Produce:
1. Top 3 recurring failure patterns — be specific (e.g., "gives product design answers without anchoring to a user segment" not "needs more specificity")
2. Top 2 recurring strengths — what's consistently landing
3. Question types Ryan avoids or struggles with most
4. Story gaps — question themes that came up but he had no strong story for
5. Missed achievements — strong wins from the achievements file not making it into answers
6. Ranked practice priority list — what to work on first/second/third with specific drill recommendations
7. One-sentence diagnosis: the single most important thing holding back interview performance right now

Write this like feedback from someone who has seen 500 PM interviews. Name the real pattern, not the polite version.`;

export async function runDiagnose(company?: string): Promise<string> {
  const [maangRubric, recruiterActivity, stories] = await Promise.all([
    notion.fetchPage(NOTION_PAGES.maang_behavioral_map),
    notion.queryDatabase(NOTION_COLLECTIONS.recruiter_interview_activity),
    notion.fetchPage(NOTION_PAGES.stories_star),
  ]);

  const companyPage = company ? notion.getCompanyPageId(company) : null;
  const companyContext = companyPage
    ? await notion.fetchPageSafe(companyPage.id)
    : "";

  const notesDir = join(CAREER_DIR, "interview-notes");
  const notes: string[] = [];
  if (existsSync(notesDir)) {
    const files = readdirSync(notesDir).filter((f) => f.endsWith(".md") && f !== ".gitkeep");
    for (const file of files) {
      if (company && !file.toLowerCase().includes(company.toLowerCase())) continue;
      notes.push(`### ${file}\n${readFileSync(join(notesDir, file), "utf-8")}`);
    }
  }

  const achievements = existsSync(join(CAREER_DIR, "achievements.md"))
    ? readFileSync(join(CAREER_DIR, "achievements.md"), "utf-8")
    : "(empty — use Notion Stories (STAR) as fallback)";

  const previousPatterns = readPatterns();

  const staticContext = [
    `## MAANG Behavioral Story Map — Rubric with Gap Scores (Notion)\n${maangRubric}`,
    `## Ryan's Stories — STAR Achievement Bank (Notion)\n${stories}`,
    companyContext ? `## ${company} Prep Page (background — may be outdated)\n${companyContext}` : "",
  ].filter(Boolean).join("\n\n---\n\n");

  const user = [
    `## Analysis Scope: ${company ?? "all interviews"}`,
    `## Recruiter / Interview Activity (Notion)\n${recruiterActivity}`,
    notes.length > 0
      ? `## Local Interview Notes (scope: ${company ?? "all"})\n\n${notes.join("\n\n")}`
      : `## Local Interview Notes\nNo notes found in career/interview-notes/ — rely on Recruiter Activity DB from Notion.`,
    `## Local Achievements (fallback)\n${achievements}`,
    previousPatterns ? `## Previously Identified Patterns\n${previousPatterns}` : "",
  ].filter(Boolean).join("\n\n---\n\n");

  const analysis = await callModel("balanced", SYSTEM, user, staticContext);

  writePatterns(analysis);

  return analysis;
}
