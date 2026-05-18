import Anthropic from "@anthropic-ai/sdk";

export type ModelTier = "fast" | "balanced" | "powerful";

// Single source of truth — update these when new models release
const TIER_MODELS: Record<ModelTier, string> = {
  fast: "claude-haiku-4-5-20251001",
  balanced: "claude-sonnet-4-6",
  powerful: "claude-opus-4-7",
};

const TIER_MAX_TOKENS: Record<ModelTier, number> = {
  fast: 2048,
  balanced: 4096,
  powerful: 8192,
};

let _client: Anthropic | null = null;

function client(): Anthropic {
  if (!_client) _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return _client;
}

// staticContext: large content that rarely changes (resume, achievements, voice guide)
// — cached for 5 min, costs ~10% of normal input tokens on cache hit
// user: task-specific content (JD, company name, pipeline notes) — always fresh
export async function callModel(
  tier: ModelTier,
  system: string,
  user: string,
  staticContext?: string,
  maxTokens?: number
): Promise<string> {
  const model = TIER_MODELS[tier];

  const userContent: Anthropic.MessageParam["content"] = staticContext
    ? [
        { type: "text" as const, text: staticContext, cache_control: { type: "ephemeral" } },
        { type: "text" as const, text: user },
      ]
    : user;

  const response = await client().messages.create({
    model,
    max_tokens: maxTokens ?? TIER_MAX_TOKENS[tier],
    system: [{ type: "text" as const, text: system, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userContent }],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error(`Unexpected response type from ${model}: ${block.type}`);
  return block.text;
}

// --- Multi-turn conversation support with rolling summarization ---

export type ConversationTurn = {
  role: "user" | "assistant";
  content: string;
};

const SUMMARIZE_SYSTEM = `You are a conversation compressor. Given a sequence of conversation turns, extract the essential state into structured JSON. Be ruthlessly concise — preserve decisions, outputs, and facts. Drop pleasantries and redundant context.

Respond with JSON only:
{
  "key_facts": ["..."],      // specific facts, names, scores established
  "decisions": ["..."],      // conclusions reached, choices made
  "outputs": ["..."],        // artifacts produced (answers given, drafts written, scores assigned)
  "open_items": ["..."]      // unresolved questions or next steps
}`;

// Compresses a sequence of turns into structured JSON using Haiku.
export async function summarizeExchanges(turns: ConversationTurn[]): Promise<string> {
  const transcript = turns
    .map((t) => `${t.role.toUpperCase()}: ${t.content}`)
    .join("\n\n");

  return callModel("fast", SUMMARIZE_SYSTEM, transcript, undefined, 1024);
}

// Rolling summarization: summarize turns older than keepRecent, return compressed history.
// Result: [synthetic user turn carrying the summary, ...keepRecent recent turns]
export async function compressHistory(
  turns: ConversationTurn[],
  keepRecent = 4
): Promise<ConversationTurn[]> {
  if (turns.length <= keepRecent) return turns;

  const old = turns.slice(0, turns.length - keepRecent);
  const recent = turns.slice(turns.length - keepRecent);

  const summary = await summarizeExchanges(old);

  const summaryTurn: ConversationTurn = {
    role: "user",
    content: `[Summary of earlier conversation]\n${summary}`,
  };
  const ackTurn: ConversationTurn = {
    role: "assistant",
    content: "Understood — I have that context from earlier in our session.",
  };

  return [summaryTurn, ackTurn, ...recent];
}

// Multi-turn call. Caller is responsible for managing history length via compressHistory.
export async function callModelConversation(
  tier: ModelTier,
  system: string,
  turns: ConversationTurn[],
  maxTokens?: number
): Promise<string> {
  const model = TIER_MODELS[tier];

  const messages: Anthropic.MessageParam[] = turns.map((t) => ({
    role: t.role,
    content: t.content,
  }));

  const response = await client().messages.create({
    model,
    max_tokens: maxTokens ?? TIER_MAX_TOKENS[tier],
    system: [{ type: "text" as const, text: system, cache_control: { type: "ephemeral" } }],
    messages,
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error(`Unexpected response type from ${model}: ${block.type}`);
  return block.text;
}

export function tierInfo(): Record<ModelTier, string> {
  return { ...TIER_MODELS };
}
