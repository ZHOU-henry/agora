import type { Prisma } from "@prisma/client";
import type {
  AgentDefinition,
  CustomerConfirmationRecord,
  EngagementAgreementRecord,
  DemandBoardItem,
  DemandResponseRecord,
  EngagementDetail,
  EngagementDeliverableRecord,
  EngagementFeedbackRecord,
  EngagementIncidentRecord,
  EngagementMilestoneRecord,
  EngagementRecord,
  EngagementReviewRecord,
  ProviderAgentReference,
  ProviderEngagementReference,
  ProviderProfile,
  ProviderProfileDetail,
  ProviderResponseReference,
  TaskRequestDetail,
  TaskRunDetail,
  TaskRunRecord
} from "@agora/shared/domain";

type DbAgent = Prisma.AgentDefinitionGetPayload<Record<string, never>>;
type DbProvider = Prisma.ProviderProfileGetPayload<Record<string, never>>;
type DbDemandResponse = Prisma.DemandResponseGetPayload<Record<string, never>>;
type DbEngagement = Prisma.EngagementGetPayload<Record<string, never>>;
type DbEngagementMilestone = Prisma.EngagementMilestoneGetPayload<Record<string, never>>;
type DbEngagementDeliverable = Prisma.EngagementDeliverableGetPayload<Record<string, never>>;
type DbEngagementReview = Prisma.EngagementReviewGetPayload<Record<string, never>>;
type DbEngagementAgreement = Prisma.EngagementAgreementGetPayload<Record<string, never>>;
type DbEngagementCustomerConfirmation =
  Prisma.EngagementCustomerConfirmationGetPayload<Record<string, never>>;
type DbEngagementFeedback = Prisma.EngagementFeedbackGetPayload<Record<string, never>>;
type DbEngagementIncident = Prisma.EngagementIncidentGetPayload<Record<string, never>>;
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
  provider: DbProvider & {
    agents: DbAgent[];
    engagements: Array<
      DbEngagement & {
        provider: DbProvider;
        taskRequest: DbTaskRequest & {
          agent: DbAgent;
        };
      }
    >;
    responses: Array<
      DbDemandResponse & {
        provider: DbProvider;
        taskRequest: DbTaskRequest;
      }
    >;
  }
): ProviderProfileDetail {
  return {
    ...serializeProviderProfile(provider),
    agents: provider.agents.map(serializeProviderAgentReference),
    responses: provider.responses.map(serializeProviderResponseReference),
    engagements: provider.engagements.map(serializeProviderEngagementReference)
  };
}

export function serializeDemandResponseRecord(
  response: DbDemandResponse & { provider: DbProvider }
): DemandResponseRecord {
  return {
    id: response.id,
    taskRequestId: response.taskRequestId,
    providerId: response.providerId,
    provider: serializeProviderProfile(response.provider),
    status: response.status as DemandResponseRecord["status"],
    headline: response.headline,
    proposalSummary: response.proposalSummary,
    deliveryApproach: response.deliveryApproach ?? "",
    etaLabel: response.etaLabel ?? "",
    confidence: response.confidence as DemandResponseRecord["confidence"],
    createdAt: response.createdAt.toISOString(),
    updatedAt: response.updatedAt.toISOString()
  };
}

export function serializeProviderResponseReference(
  response: DbDemandResponse & { provider: DbProvider; taskRequest: DbTaskRequest }
): ProviderResponseReference {
  return {
    ...serializeDemandResponseRecord(response),
    taskRequestTitle: response.taskRequest.title,
    taskRequestStatus:
      response.taskRequest.status as ProviderResponseReference["taskRequestStatus"],
    industry: response.taskRequest.industry ?? "",
    requesterOrg: response.taskRequest.requesterOrg ?? ""
  };
}

export function serializeProviderEngagementReference(
  engagement: DbEngagement & {
    provider: DbProvider;
    taskRequest: DbTaskRequest & {
      agent: DbAgent;
    };
  }
): ProviderEngagementReference {
  return {
    ...serializeEngagementRecord(engagement),
    agent: serializeProviderAgentReference(engagement.taskRequest.agent),
    taskRequestTitle: engagement.taskRequest.title,
    industry: engagement.taskRequest.industry ?? "",
    requesterOrg: engagement.taskRequest.requesterOrg ?? ""
  };
}

export function serializeEngagementRecord(
  engagement: DbEngagement & {
    provider: DbProvider;
    taskRequest?: DbTaskRequest & {
      runs?: DbTaskRun[];
    };
    customerConfirmation?: DbEngagementCustomerConfirmation | null;
    feedbackItems?: DbEngagementFeedback[];
    incidents?: DbEngagementIncident[];
  }
): EngagementRecord {
  const feedbackItems = engagement.feedbackItems ?? [];
  const incidents = engagement.incidents ?? [];

  return {
    id: engagement.id,
    taskRequestId: engagement.taskRequestId,
    demandResponseId: engagement.demandResponseId,
    provider: serializeProviderProfile(engagement.provider),
    status: engagement.status as EngagementRecord["status"],
    title: engagement.title,
    summary: engagement.summary,
    taskRunCount: engagement.taskRequest?.runs?.length ?? 0,
    feedbackCount: feedbackItems.length,
    unresolvedFeedbackCount: feedbackItems.filter(
      (item) => item.status !== "resolved"
    ).length,
    incidentCount: incidents.length,
    openIncidentCount: incidents.filter((item) => item.status !== "resolved").length,
    customerConfirmationStatus: engagement.customerConfirmation?.status
      ? (engagement.customerConfirmation.status as EngagementRecord["customerConfirmationStatus"])
      : null,
    createdAt: engagement.createdAt.toISOString(),
    updatedAt: engagement.updatedAt.toISOString()
  };
}

export function serializeEngagementMilestoneRecord(
  milestone: DbEngagementMilestone
): EngagementMilestoneRecord {
  return {
    id: milestone.id,
    engagementId: milestone.engagementId,
    title: milestone.title,
    summary: milestone.summary,
    status: milestone.status as EngagementMilestoneRecord["status"],
    dueLabel: milestone.dueLabel ?? "",
    createdAt: milestone.createdAt.toISOString(),
    updatedAt: milestone.updatedAt.toISOString()
  };
}

export function serializeEngagementDeliverableRecord(
  deliverable: DbEngagementDeliverable
): EngagementDeliverableRecord {
  return {
    id: deliverable.id,
    engagementId: deliverable.engagementId,
    title: deliverable.title,
    summary: deliverable.summary,
    artifactType: deliverable.artifactType,
    status: deliverable.status as EngagementDeliverableRecord["status"],
    createdAt: deliverable.createdAt.toISOString(),
    updatedAt: deliverable.updatedAt.toISOString()
  };
}

export function serializeEngagementReviewRecord(
  review: DbEngagementReview
): EngagementReviewRecord {
  return {
    id: review.id,
    engagementId: review.engagementId,
    verdict: review.verdict as EngagementReviewRecord["verdict"],
    notes: review.notes,
    createdAt: review.createdAt.toISOString(),
    deliverableId: review.deliverableId ?? null
  };
}

export function serializeEngagementAgreementRecord(
  agreement: DbEngagementAgreement
): EngagementAgreementRecord {
  return {
    id: agreement.id,
    engagementId: agreement.engagementId,
    status: agreement.status as EngagementAgreementRecord["status"],
    engagementMode: agreement.engagementMode,
    billingModel: agreement.billingModel,
    budgetLabel: agreement.budgetLabel,
    startWindow: agreement.startWindow,
    notes: agreement.notes,
    createdAt: agreement.createdAt.toISOString(),
    updatedAt: agreement.updatedAt.toISOString()
  };
}

export function serializeCustomerConfirmationRecord(
  confirmation: DbEngagementCustomerConfirmation
): CustomerConfirmationRecord {
  return {
    id: confirmation.id,
    engagementId: confirmation.engagementId,
    status: confirmation.status as CustomerConfirmationRecord["status"],
    summary: confirmation.summary,
    notes: confirmation.notes,
    nextStep: confirmation.nextStep ?? null,
    confirmedAt: confirmation.confirmedAt?.toISOString() ?? null,
    createdAt: confirmation.createdAt.toISOString(),
    updatedAt: confirmation.updatedAt.toISOString()
  };
}

export function serializeEngagementFeedbackRecord(
  feedback: DbEngagementFeedback
): EngagementFeedbackRecord {
  return {
    id: feedback.id,
    engagementId: feedback.engagementId,
    title: feedback.title,
    details: feedback.details,
    category: feedback.category as EngagementFeedbackRecord["category"],
    status: feedback.status as EngagementFeedbackRecord["status"],
    authorRole: feedback.authorRole,
    responseNote: feedback.responseNote ?? null,
    createdAt: feedback.createdAt.toISOString(),
    updatedAt: feedback.updatedAt.toISOString()
  };
}

export function serializeEngagementIncidentRecord(
  incident: DbEngagementIncident
): EngagementIncidentRecord {
  return {
    id: incident.id,
    engagementId: incident.engagementId,
    title: incident.title,
    summary: incident.summary,
    severity: incident.severity as EngagementIncidentRecord["severity"],
    status: incident.status as EngagementIncidentRecord["status"],
    authorRole: incident.authorRole,
    responseNote: incident.responseNote ?? null,
    openedAt: incident.openedAt.toISOString(),
    resolvedAt: incident.resolvedAt?.toISOString() ?? null,
    updatedAt: incident.updatedAt.toISOString()
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
  responses: Array<DbDemandResponse & { provider: DbProvider }>;
  engagement: (DbEngagement & { provider: DbProvider }) | null;
}): TaskRequestDetail {
  return {
    id: taskRequest.id,
    title: taskRequest.title,
    description: taskRequest.description,
    contextNote: taskRequest.contextNote ?? "",
    requesterOrg: taskRequest.requesterOrg ?? "",
    industry: taskRequest.industry ?? "",
    status: taskRequest.status as TaskRequestDetail["status"],
    createdAt: taskRequest.createdAt.toISOString(),
    updatedAt: taskRequest.updatedAt.toISOString(),
    agentId: taskRequest.agentId,
    agent: serializeAgentDefinition(taskRequest.agent),
    runs: taskRequest.runs.map(serializeTaskRunRecord),
    responses: taskRequest.responses.map(serializeDemandResponseRecord),
    engagement: taskRequest.engagement
      ? serializeEngagementRecord(taskRequest.engagement)
      : null
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
      requesterOrg: taskRun.taskRequest.requesterOrg ?? "",
      industry: taskRun.taskRequest.industry ?? "",
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

export function serializeDemandBoardItem(
  taskRequest: DbTaskRequest & {
    agent: DbAgent & { provider: DbProvider | null };
    responses: DbDemandResponse[];
  }
): DemandBoardItem {
  return {
    id: taskRequest.id,
    agentId: taskRequest.agentId,
    title: taskRequest.title,
    description: taskRequest.description,
    contextNote: taskRequest.contextNote ?? "",
    requesterOrg: taskRequest.requesterOrg ?? "",
    industry: taskRequest.industry ?? "",
    status: taskRequest.status as DemandBoardItem["status"],
    createdAt: taskRequest.createdAt.toISOString(),
    updatedAt: taskRequest.updatedAt.toISOString(),
    agent: serializeAgentDefinition(taskRequest.agent),
    responseCount: taskRequest.responses.length,
    latestResponseAt:
      taskRequest.responses
        .map((response) => response.updatedAt)
        .sort((a, b) => b.getTime() - a.getTime())[0]
        ?.toISOString() ?? null
  };
}

export function serializeEngagementDetail(
  engagement: DbEngagement & {
    provider: DbProvider;
    taskRequest: DbTaskRequest & {
      agent: DbAgent & { provider: DbProvider | null };
      runs: DbTaskRun[];
    };
    demandResponse: DbDemandResponse & { provider: DbProvider };
    milestones: DbEngagementMilestone[];
    deliverables: DbEngagementDeliverable[];
    reviews: DbEngagementReview[];
    agreement: DbEngagementAgreement | null;
    customerConfirmation: DbEngagementCustomerConfirmation | null;
    feedbackItems: DbEngagementFeedback[];
    incidents: DbEngagementIncident[];
  }
): EngagementDetail {
  return {
    ...serializeEngagementRecord(engagement),
    taskRequest: {
      id: engagement.taskRequest.id,
      title: engagement.taskRequest.title,
      description: engagement.taskRequest.description,
      contextNote: engagement.taskRequest.contextNote ?? "",
      requesterOrg: engagement.taskRequest.requesterOrg ?? "",
      industry: engagement.taskRequest.industry ?? "",
      status:
        engagement.taskRequest.status as EngagementDetail["taskRequest"]["status"],
      createdAt: engagement.taskRequest.createdAt.toISOString(),
      updatedAt: engagement.taskRequest.updatedAt.toISOString(),
      agentId: engagement.taskRequest.agentId
    },
    agent: serializeAgentDefinition(engagement.taskRequest.agent),
    demandResponse: serializeDemandResponseRecord(engagement.demandResponse),
    taskRuns: engagement.taskRequest.runs.map(serializeTaskRunRecord),
    milestones: engagement.milestones.map(serializeEngagementMilestoneRecord),
    deliverables: engagement.deliverables.map(serializeEngagementDeliverableRecord),
    reviews: engagement.reviews.map(serializeEngagementReviewRecord),
    agreement: engagement.agreement
      ? serializeEngagementAgreementRecord(engagement.agreement)
      : null,
    customerConfirmation: engagement.customerConfirmation
      ? serializeCustomerConfirmationRecord(engagement.customerConfirmation)
      : null,
    feedbackItems: engagement.feedbackItems.map(serializeEngagementFeedbackRecord),
    incidents: engagement.incidents.map(serializeEngagementIncidentRecord)
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
