import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";
import { readCompanyContext } from "../context.js";
import { NOTION_PAGES, NOTION_COLLECTIONS, buildNotionContext, getCompanyPageId, getNarrativePageId } from "../notion.js";

const SYSTEM = `You are the interview prep coach for Ryan K. McDonald — Senior PM (AI/FinTech/HealthTech), actively interviewing for Senior PM and Head of Product roles in NYC.

Generate a focused interview prep briefing. Include:
1. Company snapshot — what they build, their stage, PM org signals, and what they care about in candidates
2. 6–8 likely interview questions for Ryan's target role (behavioral, product sense, metrics, strategy — calibrated to what this company actually asks)
3. For each question, the strongest achievement or story from Ryan's background to draw on
4. 4–5 sharp questions Ryan should ask the interviewer — about team, product velocity, and decision-making
5. 2–3 gaps to research if the pipeline file is thin

Lead with what matters most. Be specific to this company — no generic PM prep advice.

Notion data is the source of truth — use the Interview Tracker for real pipeline status, stories from the STAR page for answer material.`;

export function runPrep(company: string): object {
  const slug = company.toLowerCase().replace(/\s+/g, "-");

  const pipelinePath = join(CAREER_DIR, "pipeline", `${slug}.md`);
  const pipelineContent = existsSync(pipelinePath)
    ? readFileSync(pipelinePath, "utf-8")
    : `No pipeline file at career/pipeline/${slug}.md — use Notion Interview Tracker as source of truth.`;

  const achievements = existsSync(join(CAREER_DIR, "achievements.md"))
    ? readFileSync(join(CAREER_DIR, "achievements.md"), "utf-8")
    : "(empty — use Notion Stories (STAR) page as fallback)";

  const resume = existsSync(join(CAREER_DIR, "resume.md"))
    ? readFileSync(join(CAREER_DIR, "resume.md"), "utf-8")
    : "(empty — use Notion Resume page as fallback)";

  const storedContext = readCompanyContext(company);

  const localContext = [
    `## Local Pipeline Notes (fallback)\n${pipelineContent}`,
    `## Local Resume (fallback)\n${resume}`,
    `## Local Achievements (fallback)\n${achievements}`,
    storedContext ? `## Accumulated Intel (context store)\n${storedContext}` : "",
  ].filter(Boolean).join("\n\n---\n\n");

  const companyPage = getCompanyPageId(company);
  const narrativePage = getNarrativePageId(company);

  const notionItems = [
    {
      label: "Interview Tracker — filter to this company",
      id: NOTION_COLLECTIONS.interview_tracker,
      type: "collection" as const,
      note: `Filter by company name: "${company}". Source of truth for status, interview date, recruiter, salary range.`,
    },
    {
      label: "Ryan's Resume",
      id: NOTION_PAGES.resume,
      type: "page" as const,
    },
    {
      label: "Stories (STAR) — achievement bank",
      id: NOTION_PAGES.stories_star,
      type: "page" as const,
    },
    {
      label: "Core Why — positioning and narrative",
      id: NOTION_PAGES.core_why,
      type: "page" as const,
    },
    {
      label: "MAANG Behavioral Story Map — interview rubric and gap scores",
      id: NOTION_PAGES.maang_behavioral_map,
      type: "page" as const,
    },
  ];

  if (companyPage) {
    notionItems.push({
      label: `${company} prep page (background context — may be outdated or unrefined)`,
      id: companyPage.id,
      type: "page" as const,
      background_only: true,
      note: "Stale braindump — use for enrichment only, not as source of truth.",
    } as any);
  }

  if (narrativePage) {
    notionItems.push({
      label: `${company} narrative page (background context — may be outdated or unrefined)`,
      id: narrativePage,
      type: "page" as const,
      background_only: true,
      note: "Per-company STAR narrative — enrich but verify against current stories.",
    } as any);
  }

  return {
    task: `Generate a focused interview prep briefing for Ryan K. McDonald — company: ${company}.`,
    system_prompt: SYSTEM,
    instructions: [
      "Fetch each item in notion_context using the Notion MCP fetch/query tools.",
      `For the Interview Tracker collection, filter or search for entries matching company name "${company}".`,
      "Use the Notion Resume and Stories (STAR) page as primary source for Ryan's background — prefer over local fallback.",
      "Background-only pages are stale braindumps — use for enrichment signal, not authoritative facts.",
      "After fetching Notion data, assemble all context and generate the prep briefing per the system_prompt.",
    ],
    notion_context: buildNotionContext(notionItems),
    local_context: localContext,
  };
}
