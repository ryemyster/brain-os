import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { runDaily } from "./tools/daily.js";
import { runPrep } from "./tools/prep.js";
import { runApply } from "./tools/apply.js";
import { runScan } from "./tools/scan.js";
import { runFit } from "./tools/fit.js";
import { runIntel } from "./tools/intel.js";
import { runOutreach } from "./tools/outreach.js";
import { runProctor } from "./tools/proctor.js";
import { runDiagnose } from "./tools/diagnose.js";
import { runStoryDraft } from "./tools/story_draft.js";
import { runLoop } from "./tools/loop.js";
import { runRemember } from "./tools/remember.js";

// All tools are context-loaders — return structured JSON task objects for Claude to act on.
// Claude fetches Notion data, assembles context, then generates the final output in-session.
function toolResponse(result: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
}

// Kept for any future direct-generation tools that don't need Notion context.
function generatedResponse(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: "brain-os",
    version: "0.1.0",
  });

  server.tool(
    "daily",
    "Morning brief — loads job pipeline, writing queue, and project context into a structured daily summary. Run this at the start of each day.",
    {},
    () => toolResponse(runDaily())
  );

  server.tool(
    "prep",
    "Interview and meeting prep for a specific company. Loads pipeline notes and achievements, returns a task object with Notion context for Claude to fetch and assemble.",
    {
      company: z.string().describe("Company name to prep for (e.g. 'Stripe'). Matches against career/pipeline/{company-name}.md — use the same slug if the file exists."),
    },
    ({ company }) => toolResponse(runPrep(company))
  );

  server.tool(
    "apply",
    "Application assistant — paste a job description, get a gap analysis against your resume and a cover letter draft in your voice.",
    {
      jd: z.string().describe("Full job description text to analyze against career/resume.md."),
    },
    ({ jd }) => toolResponse(runApply(jd))
  );

  server.tool(
    "scan",
    "Candidate-market fit scan — searches for companies actively hiring PMs that match your profile (AI/FinTech/HealthTech, NYC). Returns a prioritized opportunity list with fit rationale.",
    {
      focus: z.string().optional().describe("Override industry focus (default: AI, FinTech, HealthTech)."),
      stage: z.string().optional().describe("Override company stage filter (default: Series B+)."),
      location: z.string().optional().describe("Override location (default: New York City)."),
    },
    async ({ focus, stage, location }) => toolResponse(runScan({ focus, stage, location }))  // context loader — needs web search
  );

  server.tool(
    "fit",
    "Fit analysis for a specific company — scores how well Ryan matches across domain, industry, technical depth, stage, and leadership level. Returns a task object with Notion context for Claude to fetch and assemble.",
    {
      company: z.string().describe("Company name to analyze fit against (e.g. 'Anthropic', 'Plaid')."),
    },
    ({ company }) => toolResponse(runFit(company))
  );

  server.tool(
    "intel",
    "Company intelligence report — researches NYC presence, org health (funding, hiring pace, layoffs), market strategy, product direction, and PM org structure. Run this before prep or outreach.",
    {
      company: z.string().describe("Company name to research (e.g. 'Ramp', 'Cohere')."),
    },
    async ({ company }) => toolResponse(runIntel(company))  // context loader — needs web search
  );

  server.tool(
    "outreach",
    "Outreach strategy and message drafts — identifies the best angle to contact a company, drafts a LinkedIn DM and email, and suggests warm intro paths. Best used after running intel first.",
    {
      company: z.string().describe("Company to reach out to."),
      target_person: z.string().optional().describe("Specific person to contact (name + title if known). If omitted, the tool will identify the best contact."),
      role: z.string().optional().describe("Specific role you're targeting (e.g. 'Senior PM, Growth'). Sharpens the message angle."),
    },
    ({ company, target_person, role }) => toolResponse(runOutreach(company, target_person, role))
  );

  server.tool(
    "proctor",
    "Mock interview proctor — runs structured practice sessions for product sense, behavioral, metrics, strategy, vibe-coding, or a full mixed interview. Gives per-answer feedback against a rubric. Set difficulty to 'screen', 'panel', or 'final'.",
    {
      interview_type: z
        .enum(["product", "behavioral", "metrics", "strategy", "vibe-coding", "full"])
        .describe("Type of interview to simulate. 'full' runs a mixed session across all types."),
      company: z.string().optional().describe("Company context for the session — tailors question framing."),
      role: z.string().optional().describe("Role being interviewed for (default: Senior PM)."),
      difficulty: z
        .enum(["screen", "panel", "final"])
        .optional()
        .describe("Interview stage — controls number of questions (screen: 3, panel: 5, final: 7)."),
    },
    async ({ interview_type, company, role, difficulty }) =>
      toolResponse(runProctor(interview_type, company, role, difficulty))
  );

  server.tool(
    "diagnose",
    "Interview feedback diagnostics — reads all interview notes in career/interview-notes/ and identifies recurring failure patterns, weak response types, story gaps, and a ranked practice priority list.",
    {
      company: z.string().optional().describe("Filter to a specific company's notes. Omit to analyze all interviews."),
    },
    ({ company }) => toolResponse(runDiagnose(company))
  );

  server.tool(
    "loop",
    "MAANG interview loop reference — returns the full interview loop structure for a company (rounds, what each tests, rubric, deal-breakers) or drills into a specific round for targeted prep. Run this before proctor or prep for any MAANG company.",
    {
      company: z.string().describe("Company name (Meta, Amazon, Netflix, Google, Apple). Aliases work too (e.g., 'FB', 'AWS')."),
      round: z.string().optional().describe("Specific round name or type to drill into (e.g., 'Bar Raiser', 'Product Sense', 'Behavioral'). Omit to get the full loop overview."),
    },
    async ({ company, round }) => toolResponse(runLoop(company, round))
  );

  server.tool(
    "story_draft",
    "Story mining and drafting — interviews Ryan conversationally to surface raw experience, then drafts polished STAR stories in his voice. Pass an existing_story to refine a draft instead of starting from scratch.",
    {
      theme: z
        .enum(["leadership", "failure", "influence", "0to1", "technical", "conflict", "growth", "ai", "all"])
        .describe("Story theme to mine. 'all' queues questions across every theme — best for initial story inventory."),
      existing_story: z
        .string()
        .optional()
        .describe("An existing rough story draft to refine rather than mine from scratch."),
    },
    async ({ theme, existing_story }) => toolResponse(runStoryDraft(theme, existing_story))
  );

  server.tool(
    "remember",
    "Explicitly save something to the context store — company intel, a polished story, an insight, a task, or a session summary. Use this after any session to persist what was learned.",
    {
      type: z.enum(["company", "story", "insight", "task", "session"]).describe("What kind of thing you're saving. 'company' → company file. 'story' → story library. 'insight' / 'task' → insights.md. 'session' → session log."),
      label: z.string().describe("Identifier for this entry — company name, story theme, insight title, etc."),
      content: z.string().describe("The content to save. Write complete markdown — this is stored as-is."),
      notion_sync: z.boolean().optional().describe("Flag for Notion sync (Phase 4 — marks the entry as pending sync). Default false."),
    },
    async ({ type, label, content, notion_sync }) => toolResponse(runRemember(type, label, content, notion_sync ?? false))
  );

  return server;
}
