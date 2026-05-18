import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";
import { getCompanyLoop } from "../data/maang.js";
import { writeSession } from "../context.js";
import { callModelConversation, compressHistory, ConversationTurn } from "../llm.js";
import { upsertMemory, getMemory } from "../memory.js";

const COMPRESS_THRESHOLD = 8;

type InterviewType = "product" | "behavioral" | "metrics" | "strategy" | "vibe-coding" | "full";
type Difficulty = "screen" | "panel" | "final";

interface SessionState {
  session_id: string;
  config: { type: InterviewType; difficulty: Difficulty; company: string; role: string };
  questions: Array<{ type: string; text: string; rubric: string[] }>;
  asked_count: number; // questions asked so far (1 after opening)
  turns: ConversationTurn[];
  complete: boolean;
}

export interface ProctoringResponse {
  session_id: string;
  message: string;
  progress: { asked: number; total: number };
  complete: boolean;
}

const QUESTION_BANKS: Record<string, string[]> = {
  product: [
    "Design an AI-native feature for a FinTech app that helps users understand their spending without them having to ask.",
    "Your team's core feature has 40% activation but 80% retention among activated users. What do you do?",
    "How would you improve the onboarding experience for a B2B product where the buyer and the user are different people?",
    "You're a PM at an AI company. The model powering your product just got 3x better. What changes in your roadmap and why?",
    "Design a product that helps first-generation professionals navigate corporate environments.",
    "How would you decide whether to build, buy, or partner for an AI capability your product needs?",
    "Walk me through how you'd define the MVP for an AI coaching product targeting busy executives.",
  ],
  behavioral: [
    "Tell me about a time you shipped something you personally disagreed with. What happened, and what did you do?",
    "Describe a product you built that failed. What would you do differently?",
    "Tell me about a time you had to influence a major decision without direct authority.",
    "Give me an example of when you had to say no to a high-priority stakeholder. How did you handle it?",
    "Tell me about a time you identified a product opportunity that no one else had noticed. How did you validate it?",
    "Describe the most technically complex product decision you've made. How did you make it?",
    "Tell me about a time you had to rapidly change your product strategy based on new information.",
    "Give me an example of when you built alignment across a fragmented team or org.",
  ],
  metrics: [
    "Your product's DAU dropped 20% in 48 hours. Walk me through your investigation. What do you check and in what order?",
    "How would you measure the success of an AI feature that gives users recommendations they may not act on immediately?",
    "You're launching a new B2B onboarding flow. Define your success metrics and the leading indicators you'd watch.",
    "What's the difference between a vanity metric and an actionable metric? Give me an example from a product you've worked on.",
    "How would you design an A/B test for a major pricing page change when you have low traffic?",
    "Your NPS dropped from 42 to 28 after a major release. What's your process?",
    "How do you think about the relationship between engagement metrics and revenue metrics for an AI product?",
  ],
  strategy: [
    "An AI company enters your market with a model that's significantly better than yours. What's your response?",
    "Should a FinTech startup with strong consumer traction move into B2B? Walk me through your framework.",
    "What's the biggest strategic risk facing AI product companies right now, and how would you build against it?",
    "How do you think about building a durable moat in an AI-native product when the underlying models are commoditizing?",
    "You're a CPO at a Series B AI company. Your board wants you to pick one of three markets to expand into. How do you decide?",
    "When does it make sense to compete on distribution vs. product quality? Give me an example.",
    "How would you evaluate a potential acquisition target from a product strategy perspective?",
  ],
  "vibe-coding": [
    "You have 15 minutes and access to Claude Code and any public APIs. Build a working prototype that shows a user their top 3 financial risks based on a bank statement they paste in. Walk me through what you'd build and why.",
    "Write a system prompt for an AI coach that helps a first-time manager navigate their first 30 days. It should feel like a trusted senior peer, not a chatbot.",
    "Design the API contract for a feature that allows coaches to set automated AI check-ins for their clients. What endpoints, what data model, what are the edge cases?",
    "Given this user story: 'As a job seeker, I want AI to help me understand how well I fit a role before I apply.' Prompt-engineer a solution. Show me the actual prompt you'd use.",
    "You're pair-programming with an AI. Walk me through how you'd use it to build a proof-of-concept for a new product idea in under an hour. What's your workflow?",
    "A user says your AI feature gave them wrong advice and they made a bad decision. Design the system that prevents this — what guardrails, what escalation paths, what you'd actually build.",
    "Build a quick CLI tool that reads a job description and returns the top 5 skills required. Show your approach — tools, prompts, how you'd iterate.",
  ],
};

const RUBRICS: Record<string, string[]> = {
  product: [
    "Structured problem decomposition — did they clarify before jumping to solutions?",
    "User empathy — did they identify a specific user segment and their real need?",
    "Prioritization reasoning — how did they decide what to focus on?",
    "AI-specific thinking — did they consider model limitations, latency, trust, hallucination?",
    "Concrete specificity — were solutions specific or generic?",
  ],
  behavioral: [
    "STAR structure — was the situation, task, action, and result clearly articulated?",
    "Specific ownership — did they say 'I' or hide behind 'we'?",
    "Result quality — was the outcome quantified and meaningful?",
    "Reflection — did they show what they learned or would do differently?",
    "Relevance — does this story map to what the interviewer was probing for?",
  ],
  metrics: [
    "Hypothesis-driven — did they start with a hypothesis before looking at data?",
    "Segmentation — did they think about breaking down the metric by cohort, platform, geography?",
    "Leading vs lagging — did they distinguish between leading indicators and lagging outcomes?",
    "Counter-metrics — did they flag unintended consequences?",
    "Decision clarity — did they connect the metric analysis to a clear product decision?",
  ],
  strategy: [
    "Framework selection — did they pick the right lens for the question?",
    "External factors — did they consider market, competition, timing?",
    "Tradeoffs — did they name what they're giving up with each choice?",
    "Defensibility — did they think about moats and long-term position?",
    "Conviction — did they take a stance or hedge everything?",
  ],
  "vibe-coding": [
    "Speed of orientation — did they quickly identify the right tool/approach without overthinking?",
    "Prompt quality — are their prompts specific, scoped, and iteratable?",
    "System thinking — did they consider edge cases, failure modes, and trust issues?",
    "Product judgment under constraints — did they make smart tradeoffs given the time limit?",
    "Communication — could they explain what they built and why to a non-technical stakeholder?",
  ],
};

function pickQuestions(type: string, count: number): string[] {
  const bank = QUESTION_BANKS[type] ?? [];
  return [...bank].sort(() => Math.random() - 0.5).slice(0, count);
}

function buildSystemPrompt(config: SessionState["config"]): string {
  return `You are a rigorous PM interview proctor for Ryan K. McDonald. You are conducting a ${config.type} interview at the ${config.difficulty} level${config.company !== "general" ? ` for ${config.company}` : ""}.

Role: ${config.role}

Rules:
- One question at a time. Never reveal upcoming questions.
- After each answer: score each rubric criterion 1–5, name one specific strength, name one specific improvement with a concrete revision example.
- Do not soften feedback. Name what's missing.
- After the final answer: deliver a session summary — overall score, top pattern (positive or negative), one thing to work on before next session.`;
}

async function saveSession(state: SessionState): Promise<void> {
  await upsertMemory("proctor_session", state.session_id, JSON.stringify(state));
}

async function loadSession(sessionId: string): Promise<SessionState | null> {
  const record = await getMemory("proctor_session", sessionId);
  if (!record) return null;
  return JSON.parse(record.content) as SessionState;
}

export async function runProctor(
  interviewType: InterviewType,
  company?: string,
  role?: string,
  difficulty?: Difficulty,
  sessionId?: string,
  answer?: string
): Promise<ProctoringResponse> {

  // --- Continuation: process an answer ---
  if (sessionId && answer) {
    const state = await loadSession(sessionId);
    if (!state) throw new Error(`Session ${sessionId} not found.`);

    if (state.complete) {
      return {
        session_id: sessionId,
        message: "This session is already complete. Start a new one to keep practicing.",
        progress: { asked: state.asked_count, total: state.questions.length },
        complete: true,
      };
    }

    state.turns.push({ role: "user", content: answer });

    if (state.turns.length > COMPRESS_THRESHOLD) {
      state.turns = await compressHistory(state.turns, 6);
    }

    const isLastQuestion = state.asked_count >= state.questions.length;
    const nextQuestion = !isLastQuestion ? state.questions[state.asked_count] : null;

    const suffix = isLastQuestion
      ? "\n\n[That was the last question. After giving feedback, deliver the final session summary.]"
      : `\n\n[After giving feedback, ask the next question: "${nextQuestion!.text}"]`;

    const turnsForCall: ConversationTurn[] = [
      ...state.turns.slice(0, -1),
      { role: "user", content: answer + suffix },
    ];

    const response = await callModelConversation(
      "balanced",
      buildSystemPrompt(state.config),
      turnsForCall
    );

    state.turns.push({ role: "assistant", content: response });
    state.asked_count++;

    if (isLastQuestion) {
      state.complete = true;
      await writeSession(state.config.company, state.config.type, response);
    }

    await saveSession(state);

    return {
      session_id: sessionId,
      message: response,
      progress: { asked: state.asked_count, total: state.questions.length },
      complete: state.complete,
    };
  }

  // --- New session ---
  const level = difficulty ?? "panel";
  const questionCount = level === "screen" ? 3 : level === "panel" ? 5 : 7;
  const resolvedCompany = company ?? "general";
  const resolvedRole = role ?? "Senior PM";

  let allQuestions: SessionState["questions"];

  if (interviewType === "full") {
    allQuestions = [
      ...pickQuestions("behavioral", 2).map(q => ({ type: "behavioral", text: q, rubric: RUBRICS.behavioral })),
      ...pickQuestions("product", 2).map(q => ({ type: "product", text: q, rubric: RUBRICS.product })),
      ...pickQuestions("metrics", 1).map(q => ({ type: "metrics", text: q, rubric: RUBRICS.metrics })),
      ...pickQuestions("strategy", 1).map(q => ({ type: "strategy", text: q, rubric: RUBRICS.strategy })),
      ...pickQuestions("vibe-coding", 1).map(q => ({ type: "vibe-coding", text: q, rubric: RUBRICS["vibe-coding"] })),
    ];
  } else {
    allQuestions = pickQuestions(interviewType, questionCount).map(q => ({
      type: interviewType,
      text: q,
      rubric: RUBRICS[interviewType] ?? [],
    }));
  }

  const newSessionId = randomUUID();
  const config: SessionState["config"] = {
    type: interviewType,
    difficulty: level,
    company: resolvedCompany,
    role: resolvedRole,
  };

  const resumePath = join(CAREER_DIR, "resume.md");
  const resume = existsSync(resumePath) ? readFileSync(resumePath, "utf-8") : "(empty)";

  const maangLoop = company ? getCompanyLoop(company) : null;
  const companyNotes = maangLoop
    ? `\nCompany emphasis: ${maangLoop.unique_emphasis}. Deal-breakers: ${maangLoop.deal_breakers.join("; ")}.`
    : "";

  const rubricLines = [...new Set(allQuestions.flatMap(q => q.rubric))].map(r => `- ${r}`).join("\n");
  const questionList = allQuestions.map((q, i) => `${i + 1}. [${q.type}] ${q.text}`).join("\n");

  const setupMessage = `Session: ${interviewType} / ${level}${companyNotes}

Rubric:
${rubricLines}

Candidate background (use when giving specific feedback):
${resume.slice(0, 2000)}

Questions (do NOT reveal the list — ask one at a time):
${questionList}

Begin the session. Brief intro, then ask question 1.`;

  const openingMessage = await callModelConversation(
    "balanced",
    buildSystemPrompt(config),
    [{ role: "user", content: setupMessage }]
  );

  const state: SessionState = {
    session_id: newSessionId,
    config,
    questions: allQuestions,
    asked_count: 1,
    turns: [
      { role: "user", content: setupMessage },
      { role: "assistant", content: openingMessage },
    ],
    complete: false,
  };

  await saveSession(state);

  return {
    session_id: newSessionId,
    message: openingMessage,
    progress: { asked: 0, total: allQuestions.length },
    complete: false,
  };
}
