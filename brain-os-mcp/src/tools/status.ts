import { supabase } from "../memory.js";
import { readFileSync, statSync, readdirSync, existsSync } from "fs";
import { join, dirname, relative } from "path";
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

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "sessions", ".claude"]);

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function walkTree(dir: string, prefix = "", lines: string[] = [], depth = 0): string[] {
  if (depth > 6) return lines;

  let entries: string[];
  try {
    entries = readdirSync(dir).sort();
  } catch {
    return lines;
  }

  // dirs first, then files
  const sorted = [
    ...entries.filter(e => { try { return statSync(join(dir, e)).isDirectory(); } catch { return false; } }),
    ...entries.filter(e => { try { return statSync(join(dir, e)).isFile(); } catch { return false; } }),
  ];

  sorted.forEach((entry, i) => {
    if (entry.startsWith(".") && entry !== ".env.example") return;
    const isLast = i === sorted.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const childPrefix = isLast ? "    " : "│   ";
    const fullPath = join(dir, entry);

    try {
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        if (SKIP_DIRS.has(entry)) {
          lines.push(`${prefix}${connector}${entry}/ [skipped]`);
        } else {
          lines.push(`${prefix}${connector}${entry}/`);
          walkTree(fullPath, prefix + childPrefix, lines, depth + 1);
        }
      } else {
        const size = formatBytes(stat.size);
        const mtime = stat.mtime.toISOString().split("T")[0];
        lines.push(`${prefix}${connector}${entry} (${size}, ${mtime})`);
      }
    } catch {
      lines.push(`${prefix}${connector}${entry} [unreadable]`);
    }
  });

  return lines;
}

export function runCheckBrainRoot(): object {
  const brainRoot = process.env.BRAIN_ROOT;

  if (!brainRoot) {
    return {
      ok: false,
      error: "BRAIN_ROOT is not set. Add it to the MCP server env config in ~/.claude/settings.json.",
      brain_root: null,
      taxonomy: null,
    };
  }

  if (!existsSync(brainRoot)) {
    return {
      ok: false,
      error: `BRAIN_ROOT is set to "${brainRoot}" but that path does not exist.`,
      brain_root: brainRoot,
      taxonomy: null,
    };
  }

  const lines = [`${brainRoot}/`];
  walkTree(brainRoot, "", lines);

  return {
    ok: true,
    brain_root: brainRoot,
    taxonomy: lines.join("\n"),
  };
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
