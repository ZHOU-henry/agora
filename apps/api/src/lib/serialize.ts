import type {
  AgentDefinition,
  TaskRequestDetail,
  TaskRunDetail,
  TaskRunRecord
} from "@agora/shared/domain";

type DbAgent = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  provenanceStatus: string;
  provenanceSummary: string;
  tags: string[];
  constraints: string[];
  trustSignals: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type DbTaskRequest = {
  id: string;
  title: string;
  description: string;
  contextNote: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  agentId: string;
};

type DbTaskRun = {
  id: string;
  taskRequestId: string;
  status: string;
  latestMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
};

type DbRunEvent = {
  id: string;
  taskRunId: string;
  eventType: string;
  message: string;
  createdAt: Date;
};

type DbReviewDecision = {
  id: string;
  taskRunId: string;
  verdict: string;
  notes: string | null;
  reviewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeAgentDefinition(agent: DbAgent): AgentDefinition {
  return {
    id: agent.id,
    slug: agent.slug,
    name: agent.name,
    summary: agent.summary,
    description: agent.description,
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
    createdAt: run.createdAt.toISOString(),
    updatedAt: run.updatedAt.toISOString(),
    startedAt: run.startedAt?.toISOString() ?? null,
    completedAt: run.completedAt?.toISOString() ?? null
  };
}

export function serializeTaskRequestDetail(taskRequest: DbTaskRequest & {
  agent: DbAgent;
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
  taskRequest: DbTaskRequest & { agent: DbAgent };
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
  taskRequest: DbTaskRequest & { agent: DbAgent };
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
