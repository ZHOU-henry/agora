import { prisma } from "../lib/prisma.js";
import {
  serializeEngagementDetail,
  serializeEngagementRecord
} from "../lib/serialize.js";
import type {
  EngagementDeliverableStatusUpdateInput,
  EngagementReviewInput,
  EngagementStatusUpdateInput
} from "@agora/shared/domain";

export async function listEngagements() {
  const rows = await prisma.engagement.findMany({
    include: {
      provider: true
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
    include: {
      provider: true,
      taskRequest: {
        include: {
          agent: {
            include: {
              provider: true
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
          createdAt: "asc"
        }
      },
      deliverables: {
        orderBy: {
          createdAt: "asc"
        }
      },
      reviews: {
        orderBy: {
          createdAt: "asc"
        }
      },
      agreement: true
    }
  });

  return row ? serializeEngagementDetail(row) : null;
}

async function fetchEngagementDetail(id: string) {
  const row = await prisma.engagement.findUnique({
    where: { id },
    include: {
      provider: true,
      taskRequest: {
        include: {
          agent: {
            include: {
              provider: true
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
          createdAt: "asc"
        }
      },
      deliverables: {
        orderBy: {
          createdAt: "asc"
        }
      },
      reviews: {
        orderBy: {
          createdAt: "asc"
        }
      },
      agreement: true
    }
  });

  return row ? serializeEngagementDetail(row) : null;
}

export async function updateEngagementStatus(
  id: string,
  input: EngagementStatusUpdateInput
) {
  const existing = await prisma.engagement.findUnique({
    where: { id }
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
