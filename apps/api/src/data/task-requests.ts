import type {
  ReviewDecisionInput,
  RunStatusUpdateInput,
  TaskRequestInput
} from "@agora/shared/domain";
import { prisma } from "../lib/prisma.js";
import {
  serializeTaskRequestDetail,
  serializeTaskRunDetail,
  serializeTaskRunSummary
} from "../lib/serialize.js";

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

export async function listTaskRuns() {
  const rows = await prisma.taskRun.findMany({
    include: {
      taskRequest: {
        include: {
          agent: true
        }
      },
      reviewDecision: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return rows.map(serializeTaskRunSummary);
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

    const now = new Date();
    const updated = await tx.taskRun.update({
      where: { id },
      data: {
        status: input.status,
        latestMessage: input.message || existing.latestMessage,
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
