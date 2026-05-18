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
import { runGetVersion, runServerStatus } from "./tools/status.js";
import { notion } from "./notion-client.js";

function generatedResponse(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

function toolResponse(result: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
}

async function logged<T>(name: string, fn: () => Promise<T>): Promise<T> {
  console.error(`[tool] ${name} called`);
  const start = Date.now();
  try {
    const result = await fn();
    console.error(`[tool] ${name} ok (${Date.now() - start}ms)`);
    return result;
  } catch (err) {
    console.error(`[tool] ${name} error (${Date.now() - start}ms):`, err);
    throw err;
  }
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: "brain-os",
    version: "0.1.0",
  });

  server.tool(
    "daily",
    "Morning brief — loads job pipeline, writing queue, and project context into a structured daily summary. Run this at the start of each day. Before calling, pre-fetch in parallel: (1) calendar events for the next 7 days via mcp__claude_ai_Google_Calendar__list_events, (2) job-related Gmail threads via mcp__claude_ai_Gmail__search_threads (last 7 days), (3) Notion pipeline data via mcp__claude_ai_Notion__notion-search or notion-fetch for the interview_tracker database (ID: 3497328f-2da5-8049-87f2-f580e48c03c5), recruiter_interview_activity database (ID: 3497328f-2da5-80ae-897d-c84d8ddb61f4), and land_a_role_plan page (ID: 3327328f2da580fda5e7e3328d062b36). Pass results as calendarEvents, gmailThreads, and notionData.",
    {
      calendarEvents: z.string().optional().describe("Serialized calendar events for the next 7 days from Google Calendar MCP (JSON string or formatted list)."),
      gmailThreads: z.string().optional().describe("Serialized job-related email threads from Gmail MCP (JSON string or formatted list)."),
      notionData: z.string().optional().describe("Serialized Notion pipeline data pre-fetched via Notion MCP — include interview_tracker rows, recruiter_interview_activity rows, and land_a_role_plan page content."),
    },
    async ({ calendarEvents, gmailThreads, notionData }) => logged("daily", async () => generatedResponse(await runDaily({ calendarEvents, gmailThreads, notionData })))
  );

  server.tool(
    "prep",
    "Interview and meeting prep for a specific company. Loads pipeline notes and achievements, returns a task object with Notion context for Claude to fetch and assemble.",
    {
      company: z.string().describe("Company name to prep for (e.g. 'Stripe'). Matches against career/pipeline/{company-name}.md — use the same slug if the file exists."),
    },
    async ({ company }) => logged("prep", async () => generatedResponse(await runPrep(company)))
  );

  server.tool(
    "apply",
    "Application assistant — paste a job description, get a gap analysis against your resume and a cover letter draft in your voice.",
    {
      jd: z.string().describe("Full job description text to analyze against career/resume.md."),
    },
    async ({ jd }) => logged("apply", async () => generatedResponse(await runApply(jd)))
  );

  server.tool(
    "scan",
    "Candidate-market fit scan — searches for companies actively hiring PMs that match your profile (AI/FinTech/HealthTech, NYC). Returns a prioritized opportunity list with fit rationale.",
    {
      focus: z.string().optional().describe("Override industry focus (default: AI, FinTech, HealthTech)."),
      stage: z.string().optional().describe("Override company stage filter (default: Series B+)."),
      location: z.string().optional().describe("Override location (default: New York City)."),
    },
    async ({ focus, stage, location }) => logged("scan", async () => toolResponse(runScan({ focus, stage, location })))
  );

  server.tool(
    "fit",
    "Fit analysis for a specific company — scores how well Ryan matches across domain, industry, technical depth, stage, and leadership level. Returns a task object with Notion context for Claude to fetch and assemble.",
    {
      company: z.string().describe("Company name to analyze fit against (e.g. 'Anthropic', 'Plaid')."),
    },
    async ({ company }) => logged("fit", async () => generatedResponse(await runFit(company)))
  );

  server.tool(
    "intel",
    "Company intelligence report — researches NYC presence, org health (funding, hiring pace, layoffs), market strategy, product direction, and PM org structure. Run this before prep or outreach.",
    {
      company: z.string().describe("Company name to research (e.g. 'Ramp', 'Cohere')."),
    },
    async ({ company }) => logged("intel", async () => toolResponse(await runIntel(company)))
  );

  server.tool(
    "outreach",
    "Outreach strategy and message drafts — identifies the best angle to contact a company, drafts a LinkedIn DM and email, and suggests warm intro paths. Best used after running intel first.",
    {
      company: z.string().describe("Company to reach out to."),
      target_person: z.string().optional().describe("Specific person to contact (name + title if known). If omitted, the tool will identify the best contact."),
      role: z.string().optional().describe("Specific role you're targeting (e.g. 'Senior PM, Growth'). Sharpens the message angle."),
    },
    async ({ company, target_person, role }) => logged("outreach", async () => generatedResponse(await runOutreach(company, target_person, role)))
  );

  server.tool(
    "proctor",
    "Mock interview proctor — runs structured practice sessions for product sense, behavioral, metrics, strategy, vibe-coding, or a full mixed interview. Gives per-answer feedback against a rubric. First call starts a session and returns the opening question + a session_id. Subsequent calls pass session_id + your answer to get feedback and the next question.",
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
      session_id: z.string().optional().describe("Session ID returned by the first proctor call. Pass this on every subsequent call to continue the session."),
      answer: z.string().optional().describe("Your answer to the current question. Required when continuing a session (session_id provided)."),
    },
    async ({ interview_type, company, role, difficulty, session_id, answer }) =>
      logged("proctor", async () => toolResponse(await runProctor(interview_type, company, role, difficulty, session_id, answer)))
  );

  server.tool(
    "diagnose",
    "Interview feedback diagnostics — reads all interview notes in career/interview-notes/ and identifies recurring failure patterns, weak response types, story gaps, and a ranked practice priority list.",
    {
      company: z.string().optional().describe("Filter to a specific company's notes. Omit to analyze all interviews."),
    },
    async ({ company }) => logged("diagnose", async () => generatedResponse(await runDiagnose(company)))
  );

  server.tool(
    "loop",
    "MAANG interview loop reference — returns the full interview loop structure for a company (rounds, what each tests, rubric, deal-breakers) or drills into a specific round for targeted prep. Run this before proctor or prep for any MAANG company.",
    {
      company: z.string().describe("Company name (Meta, Amazon, Netflix, Google, Apple). Aliases work too (e.g., 'FB', 'AWS')."),
      round: z.string().optional().describe("Specific round name or type to drill into (e.g., 'Bar Raiser', 'Product Sense', 'Behavioral'). Omit to get the full loop overview."),
    },
    async ({ company, round }) => logged("loop", async () => toolResponse(await runLoop(company, round)))
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
    async ({ theme, existing_story }) => logged("story_draft", async () => toolResponse(await runStoryDraft(theme, existing_story)))
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
    async ({ type, label, content, notion_sync }) => logged("remember", async () => generatedResponse(await runRemember(type, label, content, notion_sync ?? false)))
  );

  server.tool(
    "test-notion",
    "Test Notion integration — verifies the API token works and can access databases.",
    {},
    async () => logged("test-notion", async () => generatedResponse(await notion.testConnection()))
  );

  server.tool(
    "get_version",
    "Returns server version, Node.js version, active transport, configured models, and process uptime.",
    {},
    async () => logged("get_version", async () => toolResponse(runGetVersion()))
  );

  server.tool(
    "server_status",
    "Health check — pings Supabase, Ollama, and the Anthropic API and returns latency + ok/error for each. Use this to verify all dependencies are reachable after deploys or when tools are behaving unexpectedly.",
    {},
    async () => logged("server_status", async () => toolResponse(await runServerStatus()))
  );

  return server;
}
