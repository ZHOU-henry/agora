import type {
  EngagementDetail,
  EngagementRecord,
  ProviderProfileDetail,
  TaskRequestDetail,
  TaskRunSummary
} from "@agora/shared/domain";

type EngagementLike = Pick<
  EngagementRecord,
  | "status"
  | "taskRunCount"
  | "feedbackCount"
  | "unresolvedFeedbackCount"
  | "incidentCount"
  | "openIncidentCount"
  | "customerConfirmationStatus"
>;

export type EngagementHealth = "stable" | "watch" | "blocked" | "expansion";

export function getEngagementHealth(engagement: EngagementLike): EngagementHealth {
  if (
    engagement.customerConfirmationStatus === "expansion_requested" &&
    engagement.openIncidentCount === 0
  ) {
    return "expansion";
  }

  if (
    engagement.openIncidentCount > 0 ||
    engagement.customerConfirmationStatus === "issues_reported"
  ) {
    return "blocked";
  }

  if (
    engagement.unresolvedFeedbackCount > 0 ||
    engagement.customerConfirmationStatus === "pending" ||
    engagement.status === "review"
  ) {
    return "watch";
  }

  return "stable";
}

export function summarizePlatformOperations(
  requests: TaskRequestDetail[],
  engagements: EngagementRecord[],
  runs: TaskRunSummary[]
) {
  const waitingForResponse = requests.filter((item) => item.responses.length === 0).length;
  const awaitingDecision = requests.filter(
    (item) => item.responses.length > 0 && item.engagement === null
  ).length;
  const activeRuns = runs.filter(
    (run) => run.status === "submitted" || run.status === "running"
  ).length;
  const reviewQueue = runs.filter(
    (run) =>
      (run.status === "completed" || run.status === "failed") &&
      run.reviewDecision === null
  ).length;
  const blockedEngagements = engagements.filter(
    (item) => getEngagementHealth(item) === "blocked"
  ).length;
  const watchEngagements = engagements.filter(
    (item) => getEngagementHealth(item) === "watch"
  ).length;
  const expansionSignals = engagements.filter(
    (item) => item.customerConfirmationStatus === "expansion_requested"
  ).length;

  return {
    waitingForResponse,
    awaitingDecision,
    activeRuns,
    reviewQueue,
    blockedEngagements,
    watchEngagements,
    expansionSignals
  };
}

export function summarizeProviderOperatingMetrics(provider: ProviderProfileDetail) {
  const activeEngagements = provider.engagements.filter(
    (item) => item.status !== "delivered"
  ).length;
  const deliveredEngagements = provider.engagements.filter(
    (item) => item.status === "delivered"
  ).length;
  const blockedEngagements = provider.engagements.filter(
    (item) => getEngagementHealth(item) === "blocked"
  ).length;
  const expansionSignals = provider.engagements.filter(
    (item) => item.customerConfirmationStatus === "expansion_requested"
  ).length;
  const openIncidents = provider.engagements.reduce(
    (sum, item) => sum + item.openIncidentCount,
    0
  );

  return {
    activeEngagements,
    deliveredEngagements,
    blockedEngagements,
    expansionSignals,
    openIncidents,
    responseCount: provider.responses.length
  };
}

export function summarizeCustomerPortfolio(engagements: EngagementRecord[]) {
  const delivered = engagements.filter((item) => item.status === "delivered").length;
  const confirmationPending = engagements.filter(
    (item) => item.customerConfirmationStatus === "pending"
  ).length;
  const issuesReported = engagements.filter(
    (item) => item.customerConfirmationStatus === "issues_reported"
  ).length;
  const accepted = engagements.filter(
    (item) => item.customerConfirmationStatus === "accepted"
  ).length;
  const expansionSignals = engagements.filter(
    (item) => item.customerConfirmationStatus === "expansion_requested"
  ).length;
  const openIncidents = engagements.reduce((sum, item) => sum + item.openIncidentCount, 0);

  return {
    delivered,
    confirmationPending,
    issuesReported,
    accepted,
    expansionSignals,
    openIncidents
  };
}

export function getEngagementDetailOperatingMetrics(engagement: EngagementDetail) {
  const unresolvedFeedbackCount = engagement.feedbackItems.filter(
    (item) => item.status !== "resolved"
  ).length;
  const openIncidentCount = engagement.incidents.filter(
    (item) => item.status !== "resolved"
  ).length;

  return {
    health: getEngagementHealth({
      status: engagement.status,
      taskRunCount: engagement.taskRuns.length,
      feedbackCount: engagement.feedbackItems.length,
      unresolvedFeedbackCount,
      incidentCount: engagement.incidents.length,
      openIncidentCount,
      customerConfirmationStatus: engagement.customerConfirmation?.status ?? null
    }),
    unresolvedFeedbackCount,
    openIncidentCount,
    completedDeliverables: engagement.deliverables.filter(
      (item) => item.status === "approved"
    ).length
  };
}
