import type { Prisma } from "@prisma/client";
import type {
  AgentDefinition,
  ProviderAgentReference,
  ProviderProfile,
  ProviderProfileDetail,
  TaskRequestDetail,
  TaskRunDetail,
  TaskRunRecord
} from "@agora/shared/domain";

type DbAgent = Prisma.AgentDefinitionGetPayload<Record<string, never>>;
type DbProvider = Prisma.ProviderProfileGetPayload<Record<string, never>>;
type DbTaskRequest = Prisma.TaskRequestGetPayload<Record<string, never>>;
type DbTaskRun = Prisma.TaskRunGetPayload<Record<string, never>>;
type DbRunEvent = Prisma.RunEventGetPayload<Record<string, never>>;
type DbReviewDecision = Prisma.ReviewDecisionGetPayload<Record<string, never>>;

export function serializeProviderProfile(provider: DbProvider): ProviderProfile {
  return {
    id: provider.id,
    slug: provider.slug,
    name: provider.name,
    summary: provider.summary,
    description: provider.description,
    type: provider.type as ProviderProfile["type"],
    website: provider.website ?? "",
    tags: provider.tags,
    status: provider.status as ProviderProfile["status"]
  };
}

export function serializeProviderAgentReference(
  agent: DbAgent
): ProviderAgentReference {
  return {
    id: agent.id,
    slug: agent.slug,
    name: agent.name,
    summary: agent.summary,
    status: agent.status as ProviderAgentReference["status"]
  };
}

export function serializeProviderProfileDetail(
  provider: DbProvider & { agents: DbAgent[] }
): ProviderProfileDetail {
  return {
    ...serializeProviderProfile(provider),
    agents: provider.agents.map(serializeProviderAgentReference)
  };
}

export function serializeAgentDefinition(
  agent: DbAgent & { provider: DbProvider | null }
): AgentDefinition {
  return {
    id: agent.id,
    slug: agent.slug,
    name: agent.name,
    summary: agent.summary,
    description: agent.description,
    providerId: agent.providerId ?? "",
    provider: agent.provider
      ? serializeProviderProfile(agent.provider)
      : {
          id: "",
          slug: "unknown-provider",
          name: "Unknown provider",
          summary: "Provider data is unavailable for this agent.",
          description:
            "Provider data is unavailable for this agent. Refresh the catalog sync before relying on this record.",
          type: "company",
          website: "",
          tags: [],
          status: "draft"
        },
    provenanceStatus: agent.provenanceStatus as AgentDefinition["provenanceStatus"],
    provenanceSummary: agent.provenanceSummary,
    tags: agent.tags,
    constraints: agent.constraints,
    trustSignals: agent.trustSignals,
    status: agent.status as AgentDefinition["status"]
  };
}

export function serializeTaskRunRecord(run: DbTaskRun): TaskRunRecord {
  return {
    id: run.id,
    taskRequestId: run.taskRequestId,
    status: run.status as TaskRunRecord["status"],
    latestMessage: run.latestMessage,
    resultSummary: run.resultSummary,
    resultPayload:
      run.resultPayload && typeof run.resultPayload === "object"
        ? (run.resultPayload as Record<string, unknown>)
        : null,
    createdAt: run.createdAt.toISOString(),
    updatedAt: run.updatedAt.toISOString(),
    startedAt: run.startedAt?.toISOString() ?? null,
    completedAt: run.completedAt?.toISOString() ?? null
  };
}

export function serializeTaskRequestDetail(taskRequest: DbTaskRequest & {
  agent: DbAgent & { provider: DbProvider | null };
  runs: DbTaskRun[];
}): TaskRequestDetail {
  return {
    id: taskRequest.id,
    title: taskRequest.title,
    description: taskRequest.description,
    contextNote: taskRequest.contextNote ?? "",
    status: taskRequest.status as TaskRequestDetail["status"],
    createdAt: taskRequest.createdAt.toISOString(),
    updatedAt: taskRequest.updatedAt.toISOString(),
    agentId: taskRequest.agentId,
    agent: serializeAgentDefinition(taskRequest.agent),
    runs: taskRequest.runs.map(serializeTaskRunRecord)
  };
}

export function serializeTaskRunDetail(taskRun: DbTaskRun & {
  taskRequest: DbTaskRequest & {
    agent: DbAgent & { provider: DbProvider | null };
  };
  events: DbRunEvent[];
  reviewDecision: DbReviewDecision | null;
}): TaskRunDetail {
  return {
    ...serializeTaskRunRecord(taskRun),
    taskRequest: {
      id: taskRun.taskRequest.id,
      title: taskRun.taskRequest.title,
      description: taskRun.taskRequest.description,
      contextNote: taskRun.taskRequest.contextNote ?? "",
      status: taskRun.taskRequest.status as TaskRunDetail["taskRequest"]["status"],
      createdAt: taskRun.taskRequest.createdAt.toISOString(),
      updatedAt: taskRun.taskRequest.updatedAt.toISOString(),
      agentId: taskRun.taskRequest.agentId
    },
    agent: serializeAgentDefinition(taskRun.taskRequest.agent),
    events: taskRun.events.map((event) => ({
      id: event.id,
      taskRunId: event.taskRunId,
      eventType: event.eventType as TaskRunDetail["events"][number]["eventType"],
      message: event.message,
      createdAt: event.createdAt.toISOString()
    })),
    reviewDecision: taskRun.reviewDecision
      ? {
          id: taskRun.reviewDecision.id,
          taskRunId: taskRun.reviewDecision.taskRunId,
          verdict:
            taskRun.reviewDecision.verdict as NonNullable<
              TaskRunDetail["reviewDecision"]
            >["verdict"],
          notes: taskRun.reviewDecision.notes ?? "",
          reviewedAt: taskRun.reviewDecision.reviewedAt.toISOString(),
          createdAt: taskRun.reviewDecision.createdAt.toISOString(),
          updatedAt: taskRun.reviewDecision.updatedAt.toISOString()
        }
      : null
  };
}

export function serializeTaskRunSummary(taskRun: DbTaskRun & {
  taskRequest: DbTaskRequest & {
    agent: DbAgent & { provider: DbProvider | null };
  };
  reviewDecision: DbReviewDecision | null;
}) {
  return {
    ...serializeTaskRunRecord(taskRun),
    taskTitle: taskRun.taskRequest.title,
    agent: serializeAgentDefinition(taskRun.taskRequest.agent),
    reviewDecision: taskRun.reviewDecision
      ? {
          id: taskRun.reviewDecision.id,
          taskRunId: taskRun.reviewDecision.taskRunId,
          verdict:
            taskRun.reviewDecision.verdict as NonNullable<
              TaskRunDetail["reviewDecision"]
            >["verdict"],
          notes: taskRun.reviewDecision.notes ?? "",
          reviewedAt: taskRun.reviewDecision.reviewedAt.toISOString(),
          createdAt: taskRun.reviewDecision.createdAt.toISOString(),
          updatedAt: taskRun.reviewDecision.updatedAt.toISOString()
        }
      : null
  };
}
