import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR } from "../config.js";
import { getCompanyLoop } from "../data/maang.js";

type InterviewType = "product" | "behavioral" | "metrics" | "strategy" | "vibe-coding" | "full";
type Difficulty = "screen" | "panel" | "final";

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
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function runProctor(
  interviewType: InterviewType,
  company?: string,
  role?: string,
  difficulty?: Difficulty
): object {
  const resumePath = join(CAREER_DIR, "resume.md");
  const achievementsPath = join(CAREER_DIR, "achievements.md");
  const portfolioPath = join(CAREER_DIR, "portfolio.md");
  const voicePath = join(CAREER_DIR, "voice-and-style.md");

  const resume = existsSync(resumePath) ? readFileSync(resumePath, "utf-8") : "(empty)";
  const achievements = existsSync(achievementsPath) ? readFileSync(achievementsPath, "utf-8") : "(empty)";
  const portfolio = existsSync(portfolioPath) ? readFileSync(portfolioPath, "utf-8") : "(empty)";

  const level = difficulty ?? "panel";
  const questionCount = level === "screen" ? 3 : level === "panel" ? 5 : 7;

  let questions: { type: string; questions: string[]; rubric: string[] }[] = [];

  if (interviewType === "full") {
    questions = [
      { type: "behavioral", questions: pickQuestions("behavioral", 2), rubric: RUBRICS.behavioral },
      { type: "product", questions: pickQuestions("product", 2), rubric: RUBRICS.product },
      { type: "metrics", questions: pickQuestions("metrics", 1), rubric: RUBRICS.metrics },
      { type: "strategy", questions: pickQuestions("strategy", 1), rubric: RUBRICS.strategy },
      { type: "vibe-coding", questions: pickQuestions("vibe-coding", 1), rubric: RUBRICS["vibe-coding"] },
    ];
  } else {
    questions = [{
      type: interviewType,
      questions: pickQuestions(interviewType, questionCount),
      rubric: RUBRICS[interviewType] ?? [],
    }];
  }

  const maangLoop = company ? getCompanyLoop(company) : null;

  let maangRoundContext: object | null = null;
  if (maangLoop && interviewType !== "full") {
    const stageMap: Record<string, string[]> = {
      product: ["product sense", "product design", "product vision"],
      behavioral: ["behavioral", "leadership", "bar raiser", "collaboration"],
      metrics: ["execution", "analytical", "product analysis"],
      strategy: ["strategy", "vision"],
      "vibe-coding": ["vibe-coding", "technical fluency", "take-home"],
    };
    const targetStages = stageMap[interviewType] ?? [];
    const matchedRounds = maangLoop.rounds.filter((r) =>
      targetStages.some((s) => r.name.toLowerCase().includes(s) || r.tests.some((t) => t.toLowerCase().includes(s)))
    );
    if (matchedRounds.length > 0) {
      maangRoundContext = {
        company_name: maangLoop.company,
        unique_emphasis: maangLoop.unique_emphasis,
        framework: maangLoop.framework,
        deal_breakers: maangLoop.deal_breakers,
        ai_specific_notes: maangLoop.ai_specific_notes,
        relevant_rounds: matchedRounds.map((r) => ({
          name: r.name,
          what_they_actually_want: r.what_they_actually_want,
          rubric: r.rubric,
          great_signals: r.great_signals,
          weak_signals: r.weak_signals,
          notes: r.notes,
        })),
      };
    }
  }

  return {
    task: `Run a mock ${interviewType} interview${company ? ` for ${company}` : ""}${role ? ` — ${role} role` : ""}. Conduct one question at a time. After each answer, give feedback before moving to the next.`,
    session_config: {
      type: interviewType,
      difficulty: level,
      company: company ?? "general",
      role: role ?? "Senior PM",
    },
    how_to_run: [
      "Start by setting the scene: tell Ryan which type of interview this is and that you'll give feedback after each answer.",
      "Ask the first question. Wait for Ryan's full response before continuing.",
      "After each answer: score it against the rubric (1-5 per criterion), give one specific strength, one specific improvement, and a revised version of the weak part.",
      "Do not give the next question until feedback on the current one is acknowledged.",
      "After all questions: give an overall session score, the top pattern you observed (positive or negative), and the one thing to work on before the next session.",
      "For vibe-coding questions: let Ryan actually build or write — give them time, don't rush to feedback.",
      ...(maangRoundContext
        ? [
            `This is a ${company} interview — use the company-specific rubric and deal-breakers from the maang_context field. Flag deal-breakers explicitly when Ryan's answer triggers one.`,
          ]
        : []),
    ],
    questions,
    ...(maangRoundContext ? { maang_context: maangRoundContext } : {}),
    candidate_context: {
      resume,
      achievements,
      portfolio,
      note: "Use this context to make feedback specific — reference Ryan's actual experience when suggesting how to improve an answer.",
    },
  };
}
