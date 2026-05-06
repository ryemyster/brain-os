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

export function tierInfo(): Record<ModelTier, string> {
  return { ...TIER_MODELS };
}
