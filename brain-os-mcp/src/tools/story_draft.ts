import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { CAREER_DIR, EXTERNAL_URLS } from "../config.js";
import { fetchUrl } from "../fetch.js";
import { writeStory, readStory } from "../context.js";
import { notion, NOTION_PAGES, NOTION_NARRATIVE_PAGES } from "../notion-client.js";

const PORTFOLIO_URL = "https://ryankmcdonald.netlify.app/";

type StoryTheme =
  | "leadership"
  | "failure"
  | "influence"
  | "0to1"
  | "technical"
  | "conflict"
  | "growth"
  | "ai"
  | "all";

const MINING_QUESTIONS: Record<string, string[]> = {
  leadership: [
    "Tell me about a time you had to lead a team through significant uncertainty — what was the situation and what did you actually do?",
    "What's the hardest people decision you've had to make as a PM? What made it hard, and how did you handle it?",
    "Describe a moment where you had to set direction for a team when leadership above you wasn't aligned. What happened?",
  ],
  failure: [
    "What product or feature have you shipped that you're least proud of? Not the one that sounds humble — the real one.",
    "Tell me about a time a bet you made didn't pan out. What specifically went wrong, and what's your honest take on why?",
    "What's a decision you made under pressure that you'd make differently now? What did you learn?",
  ],
  influence: [
    "Tell me about a time you changed the direction of something significant without having the authority to mandate it. How did you actually do it?",
    "Describe a situation where engineering or design pushed back hard on your direction. How did you navigate it?",
    "Give me an example of when you had to win over a skeptical executive or stakeholder. What was your approach?",
  ],
  "0to1": [
    "Walk me through the most 'zero to one' thing you've built — from first idea to something a real user touched. What was your process?",
    "What's the fastest you've ever gone from problem identification to shipped solution? What shortcuts did you make and would you make them again?",
    "Tell me about a time you had to build something with almost no resources, no team, or no precedent. How did you approach it?",
  ],
  technical: [
    "What's the most technically complex product decision you've made? How did you make it without being the technical expert?",
    "Describe a time you had to deeply understand a technical system to make a good product call. How did you get up to speed?",
    "Tell me about a time you worked on AI/ML features. What decisions did you own, and how did you navigate model uncertainty in the product?",
  ],
  conflict: [
    "Tell me about a time you had a real conflict with a peer PM, engineering lead, or designer — not a disagreement, an actual conflict. What happened?",
    "Describe a situation where you had to deliver feedback to someone more senior than you. What did you say and how did it go?",
    "Give me an example of when you had to hold your ground on a product decision under significant pressure. What was at stake?",
  ],
  growth: [
    "Tell me about a time you had to move a core product metric that wasn't moving. What was your approach and what happened?",
    "Describe the most impact you've ever had on a growth or activation problem. What specifically did you do?",
    "Walk me through a time you designed or ran an experiment that changed your team's understanding of users. What did you find?",
  ],
  ai: [
    "Tell me about a product you built or shaped that used AI as a core capability — not a feature, but central to the value. What decisions did you make?",
    "How have you thought about the problem of AI trust in a product you've worked on? What did you build or decide?",
    "Describe a time when an AI model behaving unexpectedly changed your product roadmap. How did you respond?",
  ],
};

export async function runStoryDraft(theme: StoryTheme, existingStory?: string): Promise<object> {
  const themes = theme === "all" ? Object.keys(MINING_QUESTIONS) : [theme];
  const storedStories: Record<string, string> = {};
  await Promise.all(
    themes.map(async (t) => {
      const stored = await readStory(t);
      if (stored) storedStories[t] = stored;
    })
  );
  if (!existingStory && themes.length === 1) {
    await writeStory(themes[0], `Mining session initiated. Story pending.`);
  }

  const resumePath = join(CAREER_DIR, "resume.md");
  const achievementsPath = join(CAREER_DIR, "achievements.md");

  const voicePath = join(CAREER_DIR, "voice-and-style.md");

  const resume = existsSync(resumePath) ? readFileSync(resumePath, "utf-8") : "(empty)";
  const achievements = existsSync(achievementsPath) ? readFileSync(achievementsPath, "utf-8") : "(empty)";
  const portfolio = await fetchUrl(EXTERNAL_URLS.portfolio, "(portfolio unavailable)");
  const voice = existsSync(voicePath) ? readFileSync(voicePath, "utf-8") : "(empty)";

  // Fetch Notion narrative pages — background context for story mining
  const [starStories, yahooNarrative, splunkNarrative, cognizantNarrative, boaNarrative, ascendventNarrative] =
    await Promise.all([
      notion.fetchPageSafe(NOTION_PAGES.stories_star),
      notion.fetchPageSafe(NOTION_NARRATIVE_PAGES["yahoo"]),
      notion.fetchPageSafe(NOTION_NARRATIVE_PAGES["splunk"]),
      notion.fetchPageSafe(NOTION_NARRATIVE_PAGES["cognizant"]),
      notion.fetchPageSafe(NOTION_NARRATIVE_PAGES["bank-of-america"]),
      notion.fetchPageSafe(NOTION_NARRATIVE_PAGES["ascendvent"]),
    ]);

  const questions =
    theme === "all"
      ? Object.entries(MINING_QUESTIONS).flatMap(([t, qs]) => qs.map((q) => ({ theme: t, question: q })))
      : (MINING_QUESTIONS[theme] ?? []).map((q) => ({ theme, question: q }));

  return {
    task: existingStory
      ? "Refine and sharpen this existing story into a crisp, interview-ready STAR narrative."
      : `Conduct a story mining session on the theme: "${theme}". Interview Ryan to surface raw experience, then draft a polished STAR story.`,

    how_to_run: existingStory
      ? [
          "Read the existing story below and the candidate's full context.",
          "Identify what's working: the strongest element of the story.",
          "Identify what's weak: vague language, unclear ownership, missing metric, or soft result.",
          "Ask one targeted follow-up question to fill the biggest gap.",
          "After Ryan answers, draft the refined STAR story in Ryan's voice (see voice guide).",
          "The final story should be speakable in 90-120 seconds — concise, specific, memorable.",
        ]
      : [
          "Tell Ryan you're going to do a story mining session on the theme of: " + (theme === "all" ? "all major themes" : theme) + ".",
          "Ask the first question below. Wait for Ryan's full, unfiltered answer — let them ramble if needed.",
          "After the answer: ask ONE follow-up to get specificity. The most common gaps are: missing metric, 'we' instead of 'I', vague outcome, or skipped action detail.",
          "Once you have enough raw material from that story, draft it as a STAR story in Ryan's voice.",
          "Show the draft. Ask Ryan: 'Is this accurate? What's off?' Refine until it feels true and speakable.",
          "Then move to the next question — don't do all questions in one session, pick the 1-2 with the strongest story potential.",
        ],

    story_format: {
      situation: "1-2 sentences. Context only — no fluff. What was the state of play?",
      task: "1 sentence. What was your specific responsibility or the decision you faced?",
      action: "3-5 sentences. What YOU did, step by step. Use 'I', not 'we'. Be concrete.",
      result: "1-2 sentences. Quantified outcome + one sentence on broader impact or what it taught you.",
      target_length: "90-120 seconds when spoken aloud — roughly 200-250 words.",
    },

    mining_questions: questions,
    existing_story: existingStory ?? null,
    stored_stories: Object.keys(storedStories).length > 0 ? storedStories : null,

    candidate_context: {
      resume,
      achievements,
      portfolio,
      voice_guide: voice,
      star_stories_notion: starStories,
      yahoo_narrative: yahooNarrative,
      splunk_narrative: splunkNarrative,
      cognizant_narrative: cognizantNarrative,
      bank_of_america_narrative: boaNarrative,
      ascendvent_narrative: ascendventNarrative,
      note: "Draft all stories in Ryan's voice — match the tone, rhythm, and word choices from the voice guide. Don't sanitize or make it sound like a press release. Per-company narratives are background — stale braindumps, use for raw material only.",
    },
  };
}
