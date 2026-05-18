import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "./server.js";
import { BRAIN_ROOT } from "./config.js";
import * as http from "node:http";
import { randomUUID } from "node:crypto";

async function main(): Promise<void> {
  console.error(`[brain-os] root: ${BRAIN_ROOT}`);
  const server = createServer();

  if (process.env.MCP_TRANSPORT === "http") {
    const port = parseInt(process.env.MCP_PORT ?? "5556", 10);
    const sessions = new Map<string, StreamableHTTPServerTransport>();

    const httpServer = http.createServer(async (req, res) => {
      console.error(`[http] ${req.method} ${req.url}`);
      if (req.url === "/mcp") {
        try {
          const sessionId = req.headers["mcp-session-id"] as string | undefined;

          if (sessionId && sessions.has(sessionId)) {
            await sessions.get(sessionId)!.handleRequest(req, res);
          } else if (!sessionId) {
            const transport: StreamableHTTPServerTransport = new StreamableHTTPServerTransport({
              sessionIdGenerator: () => randomUUID(),
              onsessioninitialized: (id) => { sessions.set(id, transport); },
              onsessionclosed: (id) => { sessions.delete(id); },
            });
            const mcpServer = createServer();
            await mcpServer.connect(transport);
            await transport.handleRequest(req, res);
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unknown session" }));
          }
        } catch (err) {
          console.error(`[http] /mcp error:`, err);
          if (!res.headersSent) {
            res.writeHead(500);
            res.end();
          }
        }
      } else if (req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok" }));
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    httpServer.listen(port, () =>
      console.error(`[mcp] http://localhost:${port}/mcp`)
    );
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
}

main().catch((err) => {
  console.error("[brain-os] fatal:", err);
  process.exit(1);
});
