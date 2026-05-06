// Fetch a public URL and return its text content.
// Returns a fallback string on any error — never throws.
export async function fetchUrl(url: string, fallback = "(fetch unavailable)"): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "brain-os-mcp/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return `(fetch failed: HTTP ${res.status})`;
    return await res.text();
  } catch (err: any) {
    return `${fallback}: ${err?.message ?? "unknown error"}`;
  }
}
