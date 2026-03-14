import { Prisma } from "@prisma/client";
import {
  TaskRunListQuerySchema,
  type ReviewDecisionInput,
  type RunStatusUpdateInput,
  type TaskRequestInput
} from "@agora/shared/domain";
import { canReviewRun, canTransitionRun } from "../lib/run-state.js";
import { prisma } from "../lib/prisma.js";
import {
  serializeTaskRequestDetail,
  serializeTaskRunDetail,
  serializeTaskRunSummary
} from "../lib/serialize.js";
import { getAgentById } from "./agents.js";

function normalizeResultPayload(
  payload: RunStatusUpdateInput["resultPayload"] | DbJsonLike
) {
  if (payload === undefined) {
    return undefined;
  }

  if (payload === null) {
    return Prisma.JsonNull;
  }

  return payload as Prisma.InputJsonValue;
}

type DbJsonLike =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | Prisma.JsonArray
  | null;

export async function listTaskRequests() {
  const rows = await prisma.taskRequest.findMany({
    include: {
      agent: true,
      runs: {
        orderBy: {
          createdAt: "desc"
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return rows.map(serializeTaskRequestDetail);
}

export async function getTaskRequestById(id: string) {
  const row = await prisma.taskRequest.findUnique({
    where: { id },
    include: {
      agent: true,
      runs: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  return row ? serializeTaskRequestDetail(row) : null;
}

export async function createTaskRequest(input: TaskRequestInput) {
  const agent = await getAgentById(input.agentId);

  if (!agent) {
    return {
      error: "AGENT_NOT_FOUND" as const,
      agentId: input.agentId
    };
  }

  const row = await prisma.taskRequest.create({
    data: {
      agentId: input.agentId,
      title: input.title,
      description: input.description,
      contextNote: input.contextNote,
      status: "submitted",
      runs: {
        create: {
          status: "submitted",
          latestMessage: "Task request submitted and initial run created.",
          events: {
            create: {
              eventType: "submitted",
              message: "Task request submitted."
            }
          }
        }
      }
    },
    include: {
      agent: true,
      runs: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  return serializeTaskRequestDetail(row);
}

export async function getTaskRunById(id: string) {
  const row = await prisma.taskRun.findUnique({
    where: { id },
    include: {
      taskRequest: {
        include: {
          agent: true
        }
      },
      events: {
        orderBy: {
          createdAt: "asc"
        }
      },
      reviewDecision: true
    }
  });

  return row ? serializeTaskRunDetail(row) : null;
}

export async function listTaskRuns(rawFilters: unknown = {}) {
  const filters = TaskRunListQuerySchema.parse(rawFilters);
  const rows = await prisma.taskRun.findMany({
    where: {
      status: filters.status,
      taskRequest: filters.agentSlug
        ? {
            agent: {
              slug: filters.agentSlug
            }
          }
        : undefined,
      reviewDecision:
        filters.reviewState === "pending"
          ? null
          : filters.reviewState === "reviewed"
            ? { isNot: null }
            : undefined
    },
    include: {
      taskRequest: {
        include: {
          agent: true
        }
      },
      reviewDecision: true
    },
    orderBy: {
      createdAt: filters.sort === "oldest" ? "asc" : "desc"
    }
  });

  const serialized = rows.map(serializeTaskRunSummary);

  if (filters.sort === "review-priority") {
    return serialized.sort((a, b) => {
      const aPending = a.reviewDecision === null ? 1 : 0;
      const bPending = b.reviewDecision === null ? 1 : 0;
      return bPending - aPending;
    });
  }

  return serialized;
}

export async function updateTaskRunStatus(
  id: string,
  input: RunStatusUpdateInput
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.taskRun.findUnique({
      where: { id }
    });

    if (!existing) {
      return null;
    }

    if (!canTransitionRun(existing.status, input.status)) {
      return {
        error: "INVALID_TRANSITION" as const,
        currentStatus: existing.status
      };
    }

    const now = new Date();
    const updated = await tx.taskRun.update({
      where: { id },
      data: {
        status: input.status,
        latestMessage: input.message || existing.latestMessage,
        resultSummary: input.resultSummary || existing.resultSummary,
        resultPayload: normalizeResultPayload(
          input.resultPayload !== undefined
            ? input.resultPayload
            : ((existing.resultPayload as DbJsonLike | undefined) ?? undefined)
        ),
        startedAt:
          input.status === "running" ? existing.startedAt ?? now : existing.startedAt,
        completedAt:
          input.status === "completed" || input.status === "failed"
            ? now
            : existing.completedAt
      }
    });

    await tx.taskRequest.update({
      where: { id: existing.taskRequestId },
      data: {
        status: input.status
      }
    });

    await tx.runEvent.create({
      data: {
        taskRunId: id,
        eventType: "status_changed",
        message: input.message || `Run status changed to ${input.status}.`
      }
    });

    const row = await tx.taskRun.findUnique({
      where: { id: updated.id },
      include: {
        taskRequest: {
          include: {
            agent: true
          }
        },
        events: {
          orderBy: {
            createdAt: "asc"
          }
        },
        reviewDecision: true
      }
    });

    return row ? serializeTaskRunDetail(row) : null;
  });
}

export async function submitReviewDecision(
  id: string,
  input: ReviewDecisionInput
) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.taskRun.findUnique({
      where: { id }
    });

    if (!existing) {
      return null;
    }

    if (!canReviewRun(existing.status)) {
      return {
        error: "REVIEW_NOT_ALLOWED" as const,
        currentStatus: existing.status
      };
    }

    await tx.reviewDecision.upsert({
      where: {
        taskRunId: id
      },
      update: {
        verdict: input.verdict,
        notes: input.notes,
        reviewedAt: new Date()
      },
      create: {
        taskRunId: id,
        verdict: input.verdict,
        notes: input.notes
      }
    });

    await tx.runEvent.create({
      data: {
        taskRunId: id,
        eventType: "review_submitted",
        message: input.notes
          ? `Review submitted with verdict ${input.verdict}: ${input.notes}`
          : `Review submitted with verdict ${input.verdict}.`
      }
    });

    const row = await tx.taskRun.findUnique({
      where: { id },
      include: {
        taskRequest: {
          include: {
            agent: true
          }
        },
        events: {
          orderBy: {
            createdAt: "asc"
          }
        },
        reviewDecision: true
      }
    });

    return row ? serializeTaskRunDetail(row) : null;
  });
}
