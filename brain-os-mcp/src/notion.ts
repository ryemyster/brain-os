// Notion page and database IDs — source of truth for all Notion-backed context.
// These are fetched at tool invocation time by Claude using the Notion MCP connector.
// brain-os tools return task objects with notion_context arrays; Claude executes the fetches.

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

export const NOTION_COLLECTIONS = {
  interview_tracker: "collection://3497328f-2da5-8027-8b46-000bb6527328",
  recruiter_interview_activity: "collection://3497328f-2da5-814a-a567-000b61706a70",
  unemployment_activities: "collection://33c5dfaf-439b-47dc-985c-0a2f2c29a70b",
  weekly_unemployment_tracker: "collection://bef6377c-8d16-401c-b753-3f4d0a82ce67",
  prep_materials_work: "collection://c0199274-36c6-4a71-9ec3-a876673e7067",
} as const;

// Per-company prep pages — stale braindumps, load as background context only
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

export type NotionFetchItem = {
  label: string;
  id: string;
  type: "page" | "collection";
  background_only?: boolean;
  note?: string;
};

// Helper: build the notion_context array for a given tool's needs
export function buildNotionContext(items: NotionFetchItem[]): NotionFetchItem[] {
  return items;
}

// Resolve a company slug to its Notion prep page if one exists
export function getCompanyPageId(company: string): { id: string; status: string } | null {
  const slug = company.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return NOTION_COMPANY_PAGES[slug] ?? null;
}

// Resolve a company slug to its narrative page if one exists
export function getNarrativePageId(company: string): string | null {
  const slug = company.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return NOTION_NARRATIVE_PAGES[slug] ?? null;
}
