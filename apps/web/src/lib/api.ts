import {
  agentDefinitions,
  AgentDefinitionListSchema,
  AgentDefinitionSchema,
  TaskRequestDetailListSchema,
  TaskRequestDetailSchema,
  TaskRunDetailSchema,
  TaskRunSummaryListSchema,
  findAgentBySlug
} from "@agora/shared/domain";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_AGORA_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:3001";

async function tryFetchJson(path: string) {
  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export async function getAgentCatalog() {
  const payload = (await tryFetchJson("/agents")) as
    | { items?: unknown[] }
    | null;

  if (!payload?.items) {
    return agentDefinitions;
  }

  const parsed = AgentDefinitionListSchema.safeParse(payload.items);

  return parsed.success && parsed.data.length > 0 ? parsed.data : agentDefinitions;
}

export async function getAgentDetail(slug: string) {
  const payload = (await tryFetchJson(`/agents/${slug}`)) as
    | { item?: unknown }
    | null;

  if (!payload?.item) {
    return findAgentBySlug(slug);
  }

  const parsed = AgentDefinitionSchema.safeParse(payload.item);
  return parsed.success ? parsed.data : findAgentBySlug(slug);
}

export async function getTaskRequests() {
  const payload = (await tryFetchJson("/task-requests")) as
    | { items?: unknown[] }
    | null;

  if (!payload?.items) {
    return [];
  }

  const parsed = TaskRequestDetailListSchema.safeParse(payload.items);
  return parsed.success ? parsed.data : [];
}

export async function getTaskRequest(id: string) {
  const payload = (await tryFetchJson(`/task-requests/${id}`)) as
    | { item?: unknown }
    | null;

  if (!payload?.item) {
    return null;
  }

  const parsed = TaskRequestDetailSchema.safeParse(payload.item);
  return parsed.success ? parsed.data : null;
}

export async function getTaskRun(id: string) {
  const payload = (await tryFetchJson(`/task-runs/${id}`)) as
    | { item?: unknown }
    | null;

  if (!payload?.item) {
    return null;
  }

  const parsed = TaskRunDetailSchema.safeParse(payload.item);
  return parsed.success ? parsed.data : null;
}

export async function getTaskRuns() {
  const payload = (await tryFetchJson("/task-runs")) as
    | { items?: unknown[] }
    | null;

  if (!payload?.items) {
    return [];
  }

  const parsed = TaskRunSummaryListSchema.safeParse(payload.items);
  return parsed.success ? parsed.data : [];
}

export { apiBaseUrl };
