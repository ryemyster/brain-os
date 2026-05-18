import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const OLLAMA_EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface Memory {
  id: string;
  type: string;
  label: string;
  section: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export async function embed(text: string): Promise<number[]> {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: OLLAMA_EMBED_MODEL, prompt: text }),
  });
  if (!res.ok) throw new Error(`Ollama embed failed: ${res.status}`);
  const data = (await res.json()) as { embedding: number[] };
  return data.embedding;
}

// Upsert by type+label+section — for companies, stories, insights, patterns.
export async function upsertMemory(
  type: string,
  label: string,
  content: string,
  section = "",
  metadata: Record<string, unknown> = {}
): Promise<void> {
  const embedding = await embed(content);
  const now = new Date().toISOString();

  const { error } = await supabase.from("brain_os_memories").upsert(
    { type, label, section, content, embedding, metadata, updated_at: now },
    { onConflict: "type,label,section" }
  );
  if (error) throw new Error(`upsertMemory failed: ${error.message}`);
}

// Insert only — for sessions (each is a distinct record).
export async function insertMemory(
  type: string,
  label: string,
  content: string,
  section = "",
  metadata: Record<string, unknown> = {}
): Promise<void> {
  const embedding = await embed(content);

  const { error } = await supabase
    .from("brain_os_memories")
    .insert({ type, label, section, content, embedding, metadata });
  if (error) throw new Error(`insertMemory failed: ${error.message}`);
}

export async function getMemoriesByTypeAndLabel(
  type: string,
  label: string
): Promise<Memory[]> {
  const { data, error } = await supabase
    .from("brain_os_memories")
    .select("*")
    .eq("type", type)
    .eq("label", label)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(`getMemoriesByTypeAndLabel failed: ${error.message}`);
  return (data ?? []) as Memory[];
}

export async function getMemory(
  type: string,
  label: string,
  section = ""
): Promise<Memory | null> {
  const { data, error } = await supabase
    .from("brain_os_memories")
    .select("*")
    .eq("type", type)
    .eq("label", label)
    .eq("section", section)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(`getMemory failed: ${error.message}`);
  return data as Memory | null;
}

export async function getRecentMemories(
  type: string,
  limit = 5
): Promise<Memory[]> {
  const { data, error } = await supabase
    .from("brain_os_memories")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`getRecentMemories failed: ${error.message}`);
  return (data ?? []) as Memory[];
}

export async function searchMemory(
  query: string,
  type?: string,
  limit = 5
): Promise<Memory[]> {
  const embedding = await embed(query);
  const { data, error } = await supabase.rpc("search_brain_os_memories", {
    query_embedding: embedding,
    match_type: type ?? null,
    match_count: limit,
  });
  if (error) throw new Error(`searchMemory failed: ${error.message}`);
  return (data ?? []) as Memory[];
}
