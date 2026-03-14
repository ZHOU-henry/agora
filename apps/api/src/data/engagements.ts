import { prisma } from "../lib/prisma.js";
import {
  serializeEngagementDetail,
  serializeEngagementRecord
} from "../lib/serialize.js";

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
      }
    }
  });

  return row ? serializeEngagementDetail(row) : null;
}
