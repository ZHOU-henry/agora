import {
  agentDefinitions,
  AgentDefinitionListSchema,
  AgentDefinitionSchema,
  TaskRequestDetailListSchema,
  TaskRequestDetailSchema,
  TaskRunDetailSchema,
  TaskRunListQuerySchema,
  TaskRunSummaryListSchema,
  findAgentBySlug
} from "@agora/shared/domain";
import { browserApiBasePath } from "./api-config";

const apiBaseUrl = process.env.AGORA_INTERNAL_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:3001";

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

export async function getTaskRuns(rawQuery: unknown = {}) {
  const query = TaskRunListQuerySchema.parse(rawQuery);
  const params = new URLSearchParams();

  if (query.agentSlug) params.set("agentSlug", query.agentSlug);
  if (query.status) params.set("status", query.status);
  if (query.reviewState) params.set("reviewState", query.reviewState);
  if (query.sort) params.set("sort", query.sort);

  const suffix = params.size > 0 ? `?${params.toString()}` : "";

  const payload = (await tryFetchJson(`/task-runs${suffix}`)) as
    | { items?: unknown[] }
    | null;

  if (!payload?.items) {
    return [];
  }

  const parsed = TaskRunSummaryListSchema.safeParse(payload.items);
  return parsed.success ? parsed.data : [];
}

export { apiBaseUrl };
export { browserApiBasePath };
