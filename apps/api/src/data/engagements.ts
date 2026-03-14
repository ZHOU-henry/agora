import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma.js";
import {
  serializeEngagementDetail,
  serializeEngagementRecord
} from "../lib/serialize.js";
import type {
  CustomerConfirmationInput,
  EngagementAgreementInput,
  EngagementDeliverableInput,
  EngagementDeliverableStatusUpdateInput,
  EngagementFeedbackInput,
  EngagementFeedbackStatusUpdateInput,
  EngagementIncidentInput,
  EngagementIncidentStatusUpdateInput,
  EngagementMilestoneInput,
  EngagementReviewInput,
  EngagementStatusUpdateInput
} from "@agora/shared/domain";

const engagementDetailInclude = {
  provider: true,
  taskRequest: {
    include: {
      agent: {
        include: {
          provider: true
        }
      },
      runs: {
        orderBy: {
          createdAt: "desc" as const
        }
      }
    }
  },
  demandResponse: {
    include: {
      provider: true
    }
  },
  milestones: {
    orderBy: {
      createdAt: "asc" as const
    }
  },
  deliverables: {
    orderBy: {
      createdAt: "asc" as const
    }
  },
  reviews: {
    orderBy: {
      createdAt: "asc" as const
    }
  },
  agreement: true,
  customerConfirmation: true,
  feedbackItems: {
    orderBy: {
      createdAt: "desc" as const
    }
  },
  incidents: {
    orderBy: {
      openedAt: "desc" as const
    }
  }
};

export async function listEngagements() {
  const rows = await prisma.engagement.findMany({
    include: {
      provider: true,
      taskRequest: {
        include: {
          runs: true
        }
      },
      customerConfirmation: true,
      feedbackItems: true,
      incidents: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return rows.map(serializeEngagementRecord);
}

export async function getEngagementById(id: string) {
  const row = await prisma.engagement.findUnique({
    where: { id },
    include: engagementDetailInclude
  });

  return row ? serializeEngagementDetail(row) : null;
}

async function fetchEngagementDetail(id: string) {
  const row = await prisma.engagement.findUnique({
    where: { id },
    include: engagementDetailInclude
  });

  return row ? serializeEngagementDetail(row) : null;
}

export async function updateEngagementStatus(
  id: string,
  input: EngagementStatusUpdateInput
) {
  const existing = await prisma.engagement.findUnique({
    where: { id },
    include: {
      customerConfirmation: true
    }
  });

  if (!existing) {
    return null;
  }

  await prisma.engagement.update({
    where: { id },
    data: {
      status: input.status
    }
  });

  if (input.status === "delivered") {
    await prisma.engagementCustomerConfirmation.upsert({
      where: {
        engagementId: id
      },
      update:
        existing.customerConfirmation?.status === "accepted"
          ? {}
          : {
              status: "pending",
              summary: "Delivery is ready for customer validation.",
              notes:
                "The builder marked delivery as complete. The customer now needs to validate rollout quality and confirm whether field issues remain.",
              nextStep: "Customer validation pending.",
              confirmedAt: null
            },
      create: {
        engagementId: id,
        status: "pending",
        summary: "Delivery is ready for customer validation.",
        notes:
          "The builder marked delivery as complete. The customer now needs to validate rollout quality and confirm whether field issues remain.",
        nextStep: "Customer validation pending.",
        confirmedAt: null
      }
    });
  }

  return fetchEngagementDetail(id);
}

export async function updateEngagementDeliverableStatus(
  id: string,
  input: EngagementDeliverableStatusUpdateInput
) {
  const existing = await prisma.engagementDeliverable.findUnique({
    where: { id }
  });

  if (!existing) {
    return null;
  }

  await prisma.engagementDeliverable.update({
    where: { id },
    data: {
      status: input.status
    }
  });

  return fetchEngagementDetail(existing.engagementId);
}

export async function submitEngagementReview(
  engagementId: string,
  input: EngagementReviewInput
) {
  const existing = await prisma.engagement.findUnique({
    where: { id: engagementId }
  });

  if (!existing) {
    return null;
  }

  await prisma.engagementReview.create({
    data: {
      engagementId,
      verdict: input.verdict,
      notes: input.notes,
      deliverableId: input.deliverableId ?? null
    }
  });

  return fetchEngagementDetail(engagementId);
}

export async function addEngagementMilestone(
  engagementId: string,
  input: EngagementMilestoneInput
) {
  const existing = await prisma.engagement.findUnique({
    where: { id: engagementId }
  });

  if (!existing) {
    return null;
  }

  await prisma.engagementMilestone.create({
    data: {
      id: randomUUID(),
      engagementId,
      title: input.title,
      summary: input.summary,
      dueLabel: input.dueLabel,
      status: input.status
    }
  });

  return fetchEngagementDetail(engagementId);
}

export async function addEngagementDeliverable(
  engagementId: string,
  input: EngagementDeliverableInput
) {
  const existing = await prisma.engagement.findUnique({
    where: { id: engagementId }
  });

  if (!existing) {
    return null;
  }

  await prisma.engagementDeliverable.create({
    data: {
      id: randomUUID(),
      engagementId,
      title: input.title,
      summary: input.summary,
      artifactType: input.artifactType,
      status: input.status
    }
  });

  return fetchEngagementDetail(engagementId);
}

export async function upsertEngagementAgreement(
  engagementId: string,
  input: EngagementAgreementInput
) {
  const existing = await prisma.engagement.findUnique({
    where: { id: engagementId }
  });

  if (!existing) {
    return null;
  }

  await prisma.engagementAgreement.upsert({
    where: {
      engagementId
    },
    update: {
      status: input.status,
      engagementMode: input.engagementMode,
      billingModel: input.billingModel,
      budgetLabel: input.budgetLabel,
      startWindow: input.startWindow,
      notes: input.notes
    },
    create: {
      engagementId,
      status: input.status,
      engagementMode: input.engagementMode,
      billingModel: input.billingModel,
      budgetLabel: input.budgetLabel,
      startWindow: input.startWindow,
      notes: input.notes
    }
  });

  return fetchEngagementDetail(engagementId);
}

export async function upsertEngagementCustomerConfirmation(
  engagementId: string,
  input: CustomerConfirmationInput
) {
  const existing = await prisma.engagement.findUnique({
    where: { id: engagementId }
  });

  if (!existing) {
    return null;
  }

  const confirmedAt = input.status === "pending" ? null : new Date();

  await prisma.engagementCustomerConfirmation.upsert({
    where: {
      engagementId
    },
    update: {
      status: input.status,
      summary: input.summary,
      notes: input.notes,
      nextStep: input.nextStep || null,
      confirmedAt
    },
    create: {
      engagementId,
      status: input.status,
      summary: input.summary,
      notes: input.notes,
      nextStep: input.nextStep || null,
      confirmedAt
    }
  });

  return fetchEngagementDetail(engagementId);
}

export async function addEngagementFeedback(
  engagementId: string,
  input: EngagementFeedbackInput
) {
  const existing = await prisma.engagement.findUnique({
    where: { id: engagementId }
  });

  if (!existing) {
    return null;
  }

  await prisma.engagementFeedback.create({
    data: {
      id: randomUUID(),
      engagementId,
      title: input.title,
      details: input.details,
      category: input.category,
      status: "submitted",
      authorRole: "customer"
    }
  });

  return fetchEngagementDetail(engagementId);
}

export async function updateEngagementFeedbackStatus(
  id: string,
  input: EngagementFeedbackStatusUpdateInput
) {
  const existing = await prisma.engagementFeedback.findUnique({
    where: { id }
  });

  if (!existing) {
    return null;
  }

  await prisma.engagementFeedback.update({
    where: { id },
    data: {
      status: input.status,
      responseNote: input.responseNote || existing.responseNote
    }
  });

  return fetchEngagementDetail(existing.engagementId);
}

export async function addEngagementIncident(
  engagementId: string,
  input: EngagementIncidentInput
) {
  const existing = await prisma.engagement.findUnique({
    where: { id: engagementId }
  });

  if (!existing) {
    return null;
  }

  await prisma.engagementIncident.create({
    data: {
      id: randomUUID(),
      engagementId,
      title: input.title,
      summary: input.summary,
      severity: input.severity,
      status: "open",
      authorRole: "customer"
    }
  });

  return fetchEngagementDetail(engagementId);
}

export async function updateEngagementIncidentStatus(
  id: string,
  input: EngagementIncidentStatusUpdateInput
) {
  const existing = await prisma.engagementIncident.findUnique({
    where: { id }
  });

  if (!existing) {
    return null;
  }

  await prisma.engagementIncident.update({
    where: { id },
    data: {
      status: input.status,
      responseNote: input.responseNote || existing.responseNote,
      resolvedAt: input.status === "resolved" ? new Date() : null
    }
  });

  return fetchEngagementDetail(existing.engagementId);
}
