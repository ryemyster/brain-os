import { supabase } from "../memory.js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? "";

function getPackageVersion(): string {
  try {
    const pkgPath = join(dirname(fileURLToPath(import.meta.url)), "../../package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8")) as { version: string };
    return pkg.version;
  } catch {
    return "unknown";
  }
}

export function runGetVersion() {
  return {
    name: "brain-os",
    version: getPackageVersion(),
    node: process.version,
    transport: process.env.MCP_TRANSPORT ?? "stdio",
    model_generator: process.env.MODEL_GENERATOR ?? "unset",
    model_evaluator: process.env.MODEL_EVALUATOR ?? "unset",
    uptime_seconds: Math.floor(process.uptime()),
  };
}

async function checkDatabase(): Promise<{ ok: boolean; latency_ms: number; error?: string }> {
  const start = Date.now();
  try {
    const { error } = await supabase.from("brain_os_memories").select("id").limit(1);
    if (error) return { ok: false, latency_ms: Date.now() - start, error: error.message };
    return { ok: true, latency_ms: Date.now() - start };
  } catch (err) {
    return { ok: false, latency_ms: Date.now() - start, error: String(err) };
  }
}

async function checkOllama(): Promise<{ ok: boolean; latency_ms: number; model?: string; error?: string }> {
  const start = Date.now();
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return { ok: false, latency_ms: Date.now() - start, error: `HTTP ${res.status}` };
    const data = (await res.json()) as { models?: { name: string }[] };
    const model = process.env.OLLAMA_EMBED_MODEL ?? "nomic-embed-text";
    const loaded = data.models?.some((m) => m.name.startsWith(model)) ?? false;
    return {
      ok: true,
      latency_ms: Date.now() - start,
      model: loaded ? model : `${model} (not pulled)`,
    };
  } catch (err) {
    return { ok: false, latency_ms: Date.now() - start, error: String(err) };
  }
}

async function checkAnthropic(): Promise<{ ok: boolean; latency_ms: number; error?: string }> {
  const start = Date.now();
  if (!ANTHROPIC_API_KEY) return { ok: false, latency_ms: 0, error: "ANTHROPIC_API_KEY not set" };
  try {
    const res = await fetch("https://api.anthropic.com/v1/models", {
      headers: { "x-api-key": ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return { ok: false, latency_ms: Date.now() - start, error: `HTTP ${res.status}` };
    return { ok: true, latency_ms: Date.now() - start };
  } catch (err) {
    return { ok: false, latency_ms: Date.now() - start, error: String(err) };
  }
}

export async function runServerStatus() {
  const [database, ollama, anthropic] = await Promise.all([
    checkDatabase(),
    checkOllama(),
    checkAnthropic(),
  ]);

  const allOk = database.ok && ollama.ok && anthropic.ok;

  return {
    status: allOk ? "healthy" : "degraded",
    version: getPackageVersion(),
    uptime_seconds: Math.floor(process.uptime()),
    checks: { database, ollama, anthropic },
  };
}
