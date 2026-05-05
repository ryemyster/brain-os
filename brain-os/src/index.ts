import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
import { BRAIN_ROOT } from "./config.js";

async function main(): Promise<void> {
  console.error(`[brain-os] root: ${BRAIN_ROOT}`);
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("[brain-os] fatal:", err);
  process.exit(1);
});
