import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";
import { readPatterns, writePatterns } from "../context.js";
import { callModel } from "../llm.js";

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
  const notesDir = join(CAREER_DIR, "interview-notes");
  const notes: string[] = [];

  if (existsSync(notesDir)) {
    const files = readdirSync(notesDir).filter((f) => f.endsWith(".md") && f !== ".gitkeep");
    for (const file of files) {
      if (company && !file.toLowerCase().includes(company.toLowerCase())) continue;
      notes.push(`### ${file}\n${readFileSync(join(notesDir, file), "utf-8")}`);
    }
  }

  if (notes.length === 0) {
    return [
      company
        ? `No interview notes found for ${company}.`
        : "No interview notes found in career/interview-notes/.",
      "",
      "Add a file after each interview — one file per company. Template:",
      "",
      "```",
      "# Interview Notes — [Company]",
      "",
      "**Date:** YYYY-MM-DD",
      "**Round:** Phone screen / Panel / Final / Take-home",
      "**Interviewer(s):** Name, role if known",
      "",
      "## Questions asked",
      "",
      "1. [Question] — My answer: [What I said] — Their reaction: [How it landed]",
      "",
      "## Feedback received",
      "",
      "## My assessment",
      "",
      "**What went well:**",
      "**What felt weak:**",
      "**Questions I couldn't answer well:**",
      "**Overall vibe:**",
      "```",
    ].join("\n");
  }

  const achievements = existsSync(join(CAREER_DIR, "achievements.md"))
    ? readFileSync(join(CAREER_DIR, "achievements.md"), "utf-8")
    : "(empty)";

  const previousPatterns = readPatterns();

  const user = [
    `## Interview Notes (scope: ${company ?? "all"})`,
    notes.join("\n\n"),
    `## Ryan's Achievements\n${achievements}`,
    previousPatterns ? `## Previously Identified Patterns\n${previousPatterns}` : "",
  ]
    .filter(Boolean)
    .join("\n\n---\n\n");

  const analysis = await callModel("balanced", SYSTEM, user);

  // Auto-save patterns so daily can surface them
  writePatterns(analysis);

  return analysis;
}
