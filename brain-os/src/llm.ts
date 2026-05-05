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

export async function callModel(
  tier: ModelTier,
  system: string,
  user: string,
  maxTokens?: number
): Promise<string> {
  const model = TIER_MODELS[tier];
  const response = await client().messages.create({
    model,
    max_tokens: maxTokens ?? TIER_MAX_TOKENS[tier],
    system,
    messages: [{ role: "user", content: user }],
  });
  const block = response.content[0];
  if (block.type !== "text") throw new Error(`Unexpected response type from ${model}: ${block.type}`);
  return block.text;
}

export function tierInfo(): Record<ModelTier, string> {
  return { ...TIER_MODELS };
}
