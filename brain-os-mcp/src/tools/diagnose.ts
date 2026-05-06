import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";
import { readPatterns } from "../context.js";
import { NOTION_PAGES, NOTION_COLLECTIONS, buildNotionContext, getCompanyPageId } from "../notion.js";

const SYSTEM = `You are an interview performance coach for Ryan K. McDonald. Analyze his interview notes with unsparing honesty — the goal is to surface real patterns, not reassure him.

Produce:
1. Top 3 recurring failure patterns — be specific (e.g., "gives product design answers without anchoring to a user segment" not "needs more specificity")
2. Top 2 recurring strengths — what's consistently landing
3. Question types Ryan avoids or struggles with most
4. Story gaps — question themes that came up but he had no strong story for
5. Missed achievements — strong wins from the achievements file not making it into answers
6. Ranked practice priority list — what to work on first/second/third with specific drill recommendations
7. One-sentence diagnosis: the single most important thing holding back interview performance right now

Write this like feedback from someone who has seen 500 PM interviews. Name the real pattern, not the polite version.

After generating the analysis, call mcp__brain-os__remember with type=insight, label="interview-patterns", content=<full analysis> to persist the patterns for daily briefings.`;

export function runDiagnose(company?: string): object {
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

  const localContext = [
    notes.length > 0
      ? `## Local Interview Notes (scope: ${company ?? "all"})\n\n${notes.join("\n\n")}`
      : `## Local Interview Notes\nNo notes found in career/interview-notes/ — rely on Recruiter Activity DB from Notion.`,
    `## Local Achievements (fallback)\n${achievements}`,
    previousPatterns ? `## Previously Identified Patterns\n${previousPatterns}` : "",
  ].filter(Boolean).join("\n\n---\n\n");

  const companyPage = company ? getCompanyPageId(company) : null;

  const notionItems: any[] = [
    {
      label: "MAANG Behavioral Story Map — rubric with gap scores",
      id: NOTION_PAGES.maang_behavioral_map,
      type: "page" as const,
      note: "Contains actual gap scores across behavioral themes — primary input for identifying story gaps.",
    },
    {
      label: "Recruiter / Interview Activity — full activity history",
      id: NOTION_COLLECTIONS.recruiter_interview_activity,
      type: "collection" as const,
      note: company ? `Filter by company: "${company}" if possible.` : "Fetch all recent entries.",
    },
    {
      label: "Stories (STAR) — achievement bank",
      id: NOTION_PAGES.stories_star,
      type: "page" as const,
    },
  ];

  if (companyPage) {
    notionItems.push({
      label: `${company} prep page (background context — may be outdated or unrefined)`,
      id: companyPage.id,
      type: "page" as const,
      background_only: true,
      note: "Contains postmortem and prep notes — useful for per-company pattern analysis.",
    });
  }

  return {
    task: `Diagnose interview performance patterns for Ryan K. McDonald${company ? ` — company scope: ${company}` : " — all interviews"}.`,
    system_prompt: SYSTEM,
    instructions: [
      "Fetch each item in notion_context using the Notion MCP fetch/query tools.",
      "MAANG Behavioral Story Map has gap scores — use these to identify themes with missing or weak stories.",
      "Recruiter Activity DB has interview outcomes and recruiter feedback — surface patterns from that history.",
      "After fetching Notion data, combine with local_context notes and generate the full diagnosis per system_prompt.",
      "After generating the analysis, save it using mcp__brain-os__remember (type=insight, label=interview-patterns) so daily briefings can surface it.",
    ],
    notion_context: buildNotionContext(notionItems),
    local_context: localContext,
  };
}
