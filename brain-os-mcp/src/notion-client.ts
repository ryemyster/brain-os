import { Client } from "@notionhq/client";
import type {
  BlockObjectResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints.js";

// Page IDs — source of truth for all static Notion pages
export const NOTION_PAGES = {
  resume: "34f7328f2da5801590a9feafb793b31d",
  stories_star: "1e67328f2da580fca80dc586dfc12246",
  core_why: "33c7328f2da580a89497c942b2253d71",
  maang_behavioral_map: "3427328f2da580f5a368de198b799303",
  recruiter_vetting_checklist: "3457328f2da5803fa78cc953dbf981ae",
  rates_discovery: "3327328f2da58032b6e7c2117584ff5e",
  land_a_role_plan: "3327328f2da580fda5e7e3328d062b36",
  interview_tracker_page: "20a7328f2da580738d08d57847e09875",
} as const;

// Database IDs — plain UUIDs (collection:// prefix stripped)
export const NOTION_COLLECTIONS = {
  interview_tracker: "3497328f-2da5-8027-8b46-000bb6527328",
  recruiter_interview_activity: "3497328f-2da5-814a-a567-000b61706a70",
  unemployment_activities: "33c5dfaf-439b-47dc-985c-0a2f2c29a70b",
  weekly_unemployment_tracker: "bef6377c-8d16-401c-b753-3f4d0a82ce67",
  prep_materials_work: "c0199274-36c6-4a71-9ec3-a876673e7067",
} as const;

// Per-company prep pages — stale braindumps, use as background context only
export const NOTION_COMPANY_PAGES: Record<string, { id: string; status: string }> = {
  "charter-communications": { id: "3497328f2da580e0afb2ffb8a6e29035", status: "First Round" },
  "fan-duel": { id: "21e7328f2da5807a8191f8e10307b84d", status: "In Progress" },
  "mntn": { id: "20f7328f2da5804f8affc13260a449ae", status: "In Progress" },
  "delta-stars": { id: "2147328f2da58054b8a2f90b0570970f", status: "In Progress" },
  "charter": { id: "2537328f2da5808fb2a1cd3702b5ffaa", status: "In Progress" },
  "clarvos": { id: "26b7328f2da5805e9546c7236dc517e2", status: "In Progress" },
  "bank-of-america-contract": { id: "2727328f2da58037ac6ee7cdee069238", status: "In Progress" },
  "toyota-connected": { id: "1e27328f2da58063920ee5132d2c8456", status: "Rejected" },
  "amazon": { id: "1dc7328f2da5809a8b66c130e7f85c44", status: "Rejected" },
};

// Per-company narrative pages nested under MAANG Behavioral Story Map
export const NOTION_NARRATIVE_PAGES: Record<string, string> = {
  "yahoo": "1f77328f2da580d19cd9dade63e88e3e",
  "splunk": "1f77328f2da58044a69af2ed18bf314e",
  "cognizant": "2027328f2da580dbbe64c38428ed85e0",
  "bank-of-america": "3427328f2da58083af24f9edcd13bdc7",
  "ascendvent": "3427328f2da580429bb6f33481e48c24",
};

function slugify(company: string): string {
  return company.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// Extract plain text from a Notion block
function blockToText(block: BlockObjectResponse | PartialBlockObjectResponse): string {
  if (!("type" in block)) return "";
  const b = block as BlockObjectResponse;

  const richTextToStr = (rich: Array<{ plain_text: string }>) =>
    rich.map((t) => t.plain_text).join("");

  switch (b.type) {
    case "paragraph":
      return richTextToStr(b.paragraph.rich_text);
    case "heading_1":
      return `# ${richTextToStr(b.heading_1.rich_text)}`;
    case "heading_2":
      return `## ${richTextToStr(b.heading_2.rich_text)}`;
    case "heading_3":
      return `### ${richTextToStr(b.heading_3.rich_text)}`;
    case "bulleted_list_item":
      return `- ${richTextToStr(b.bulleted_list_item.rich_text)}`;
    case "numbered_list_item":
      return `1. ${richTextToStr(b.numbered_list_item.rich_text)}`;
    case "toggle":
      return richTextToStr(b.toggle.rich_text);
    case "quote":
      return `> ${richTextToStr(b.quote.rich_text)}`;
    case "callout":
      return richTextToStr(b.callout.rich_text);
    case "code":
      return `\`\`\`\n${richTextToStr(b.code.rich_text)}\n\`\`\``;
    case "divider":
      return "---";
    default:
      return "";
  }
}

// Extract a readable string from a Notion property value
function propertyToString(prop: PageObjectResponse["properties"][string]): string {
  switch (prop.type) {
    case "title":
      return prop.title.map((t) => t.plain_text).join("");
    case "rich_text":
      return prop.rich_text.map((t) => t.plain_text).join("");
    case "select":
      return prop.select?.name ?? "";
    case "multi_select":
      return prop.multi_select.map((s) => s.name).join(", ");
    case "date":
      return prop.date?.start ?? "";
    case "checkbox":
      return prop.checkbox ? "Yes" : "No";
    case "number":
      return prop.number?.toString() ?? "";
    case "url":
      return prop.url ?? "";
    case "email":
      return prop.email ?? "";
    case "phone_number":
      return prop.phone_number ?? "";
    case "status":
      return prop.status?.name ?? "";
    default:
      return "";
  }
}

const UNAVAILABLE = "(Notion unavailable — set NOTION_TOKEN)";

export class NotionService {
  private client!: Client;
  private available: boolean;

  constructor() {
    const token = process.env.NOTION_TOKEN;
    this.available = !!token;
    if (token) this.client = new Client({ auth: token });
  }

  isAvailable(): boolean {
    return this.available;
  }

  // Fetch a page's block content as plain text
  async fetchPage(pageId: string): Promise<string> {
    if (!this.available) return UNAVAILABLE;
    try {
      const blocks = await this.client.blocks.children.list({ block_id: pageId, page_size: 100 });
      const lines = blocks.results.map(blockToText).filter(Boolean);
      return lines.join("\n") || "(page is empty)";
    } catch (err: any) {
      return `(Notion fetch failed: ${err?.message ?? "unknown error"})`;
    }
  }

  // Safe version — never throws, returns fallback string on any error
  async fetchPageSafe(pageId: string): Promise<string> {
    if (!this.available) return "(unavailable)";
    try {
      return await this.fetchPage(pageId);
    } catch {
      return "(unavailable)";
    }
  }

  // Query a database, return rows as a readable markdown list
  async queryDatabase(databaseId: string, filter?: object): Promise<string> {
    if (!this.available) return UNAVAILABLE;
    try {
      const params: any = { database_id: databaseId, page_size: 50 };
      if (filter) params.filter = filter;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await (this.client.databases as any).query(params);

      if (!response.results || response.results.length === 0) return "(no results)";

      const rows = (response.results as any[])
        .filter((r: any) => "properties" in r)
        .map((page: any) => {
          const props = Object.entries(page.properties as Record<string, any>)
            .map(([key, val]) => {
              const str = propertyToString(val as PageObjectResponse["properties"][string]);
              return str ? `**${key}:** ${str}` : null;
            })
            .filter(Boolean)
            .join(" | ");
          return `- ${props}`;
        });

      return rows.join("\n");
    } catch (err: any) {
      return `(Notion query failed: ${err?.message ?? "unknown error"})`;
    }
  }

  getCompanyPageId(company: string): { id: string; status: string } | null {
    return NOTION_COMPANY_PAGES[slugify(company)] ?? null;
  }

  getNarrativePageId(company: string): string | null {
    return NOTION_NARRATIVE_PAGES[slugify(company)] ?? null;
  }
}

export const notion = new NotionService();
