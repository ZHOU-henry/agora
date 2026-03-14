import Fastify from "fastify";
import {
  CustomerConfirmationInputSchema,
  EngagementAgreementInputSchema,
  EngagementDeliverableInputSchema,
  AgentDefinitionInputSchema,
  DemandBoardPublishInputSchema,
  DemandResponseInputSchema,
  DemandResponseStatusUpdateInputSchema,
  EngagementDeliverableStatusUpdateInputSchema,
  EngagementFeedbackInputSchema,
  EngagementFeedbackStatusUpdateInputSchema,
  EngagementIncidentInputSchema,
  EngagementIncidentStatusUpdateInputSchema,
  EngagementMilestoneInputSchema,
  EngagementReviewInputSchema,
  EngagementStatusUpdateInputSchema,
  ProviderProfileInputSchema,
  ReviewDecisionInputSchema,
  RunStatusUpdateInputSchema,
  TaskRequestInputSchema
} from "@agora/shared/domain";
import {
  createAgentDefinition,
  getAgentBySlug,
  listAgents,
  syncAgentDefinitions
} from "./data/agents.js";
import {
  addEngagementFeedback,
  addEngagementIncident,
  addEngagementDeliverable,
  addEngagementMilestone,
  getEngagementById,
  listEngagements,
  submitEngagementReview,
  updateEngagementFeedbackStatus,
  updateEngagementIncidentStatus,
  upsertEngagementAgreement,
  upsertEngagementCustomerConfirmation,
  updateEngagementDeliverableStatus,
  updateEngagementStatus
} from "./data/engagements.js";
import { syncSeededMarketplaceData } from "./data/marketplace-seeds.js";
import {
  createProviderProfile,
  getProviderById,
  getProviderDetailBySlug,
  listProviders,
  syncProviderProfiles
} from "./data/providers.js";
import {
  createTaskRequest,
  getTaskRequestById,
  getTaskRunById,
  listDemandBoard,
  listTaskRuns,
  listTaskRequests,
  submitDemandResponse,
  submitReviewDecision,
  updateDemandResponseStatus,
  updateTaskRunStatus
} from "./data/task-requests.js";
import { prisma } from "./lib/prisma.js";
import { isReadOnlyPreviewMode } from "./lib/runtime-mode.js";
import { badRequest, conflict, notFound } from "./lib/respond.js";

const server = Fastify({
  logger: true
});

server.get("/health", async () => {
  return {
    status: "ok",
    service: "agora-api",
    previewReadOnly: isReadOnlyPreviewMode()
  };
});

server.get("/runtime", async () => {
  return {
    previewReadOnly: isReadOnlyPreviewMode()
  };
});

server.get("/agents", async () => {
  return {
    items: await listAgents()
  };
});

server.get("/providers", async () => {
  return {
    items: await listProviders()
  };
});

server.post("/providers", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const parsed = ProviderProfileInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid provider profile", parsed.error.flatten());
  }

  const item = await createProviderProfile(parsed.data);

  return reply.code(201).send({
    item
  });
});

server.get("/providers/:slug", async (request, reply) => {
  const { slug } = request.params as { slug: string };
  const provider = await getProviderDetailBySlug(slug);

  if (!provider) {
    return notFound(reply, "Provider not found");
  }

  return {
    item: provider
  };
});

server.get("/engagements", async () => {
  return {
    items: await listEngagements()
  };
});

server.get("/engagements/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const engagement = await getEngagementById(id);

  if (!engagement) {
    return notFound(reply, "Engagement not found");
  }

  return {
    item: engagement
  };
});

server.patch("/engagements/:id/status", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = EngagementStatusUpdateInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid engagement status update", parsed.error.flatten());
  }

  const engagement = await updateEngagementStatus(id, parsed.data);

  if (!engagement) {
    return notFound(reply, "Engagement not found");
  }

  return {
    item: engagement
  };
});

server.patch("/engagement-deliverables/:id/status", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = EngagementDeliverableStatusUpdateInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid deliverable status update", parsed.error.flatten());
  }

  const engagement = await updateEngagementDeliverableStatus(id, parsed.data);

  if (!engagement) {
    return notFound(reply, "Engagement deliverable not found");
  }

  return {
    item: engagement
  };
});

server.post("/engagements/:id/milestones", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = EngagementMilestoneInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid engagement milestone", parsed.error.flatten());
  }

  const engagement = await addEngagementMilestone(id, parsed.data);

  if (!engagement) {
    return notFound(reply, "Engagement not found");
  }

  return reply.code(201).send({
    item: engagement
  });
});

server.post("/engagements/:id/deliverables", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = EngagementDeliverableInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid engagement deliverable", parsed.error.flatten());
  }

  const engagement = await addEngagementDeliverable(id, parsed.data);

  if (!engagement) {
    return notFound(reply, "Engagement not found");
  }

  return reply.code(201).send({
    item: engagement
  });
});

server.put("/engagements/:id/agreement", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = EngagementAgreementInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid engagement agreement", parsed.error.flatten());
  }

  const engagement = await upsertEngagementAgreement(id, parsed.data);

  if (!engagement) {
    return notFound(reply, "Engagement not found");
  }

  return {
    item: engagement
  };
});

server.put("/engagements/:id/customer-confirmation", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = CustomerConfirmationInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(
      reply,
      "Invalid customer confirmation update",
      parsed.error.flatten()
    );
  }

  const engagement = await upsertEngagementCustomerConfirmation(id, parsed.data);

  if (!engagement) {
    return notFound(reply, "Engagement not found");
  }

  return {
    item: engagement
  };
});

server.post("/engagements/:id/feedback", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = EngagementFeedbackInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid engagement feedback", parsed.error.flatten());
  }

  const engagement = await addEngagementFeedback(id, parsed.data);

  if (!engagement) {
    return notFound(reply, "Engagement not found");
  }

  return reply.code(201).send({
    item: engagement
  });
});

server.patch("/engagement-feedback/:id/status", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = EngagementFeedbackStatusUpdateInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(
      reply,
      "Invalid engagement feedback status update",
      parsed.error.flatten()
    );
  }

  const engagement = await updateEngagementFeedbackStatus(id, parsed.data);

  if (!engagement) {
    return notFound(reply, "Engagement feedback not found");
  }

  return {
    item: engagement
  };
});

server.post("/engagements/:id/incidents", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = EngagementIncidentInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid engagement incident", parsed.error.flatten());
  }

  const engagement = await addEngagementIncident(id, parsed.data);

  if (!engagement) {
    return notFound(reply, "Engagement not found");
  }

  return reply.code(201).send({
    item: engagement
  });
});

server.patch("/engagement-incidents/:id/status", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = EngagementIncidentStatusUpdateInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(
      reply,
      "Invalid engagement incident status update",
      parsed.error.flatten()
    );
  }

  const engagement = await updateEngagementIncidentStatus(id, parsed.data);

  if (!engagement) {
    return notFound(reply, "Engagement incident not found");
  }

  return {
    item: engagement
  };
});

server.post("/engagements/:id/reviews", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = EngagementReviewInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid engagement review", parsed.error.flatten());
  }

  const engagement = await submitEngagementReview(id, parsed.data);

  if (!engagement) {
    return notFound(reply, "Engagement not found");
  }

  return reply.code(201).send({
    item: engagement
  });
});

server.get("/agents/:slug", async (request, reply) => {
  const { slug } = request.params as { slug: string };
  const agent = await getAgentBySlug(slug);

  if (!agent) {
    return notFound(reply, "Agent not found");
  }

  return {
    item: agent
  };
});

server.post("/agents", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const parsed = AgentDefinitionInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid agent definition", parsed.error.flatten());
  }

  const provider = await getProviderById(parsed.data.providerId);

  if (!provider) {
    return badRequest(reply, "Selected provider is not available", {
      error: "PROVIDER_NOT_FOUND",
      providerId: parsed.data.providerId
    });
  }

  const item = await createAgentDefinition(parsed.data);

  return reply.code(201).send({
    item
  });
});

server.get("/task-requests", async () => {
  return {
    items: await listTaskRequests()
  };
});

server.post("/demand-board", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const parsed = DemandBoardPublishInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid demand board submission", parsed.error.flatten());
  }

  const record = await createTaskRequest(parsed.data);

  if ("error" in record) {
    return badRequest(reply, "Selected agent is not available", record);
  }

  return reply.code(201).send({
    item: record
  });
});

server.get("/demand-board", async () => {
  return {
    items: await listDemandBoard()
  };
});

server.get("/task-requests/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const taskRequest = await getTaskRequestById(id);

  if (!taskRequest) {
    return notFound(reply, "Task request not found");
  }

  return {
    item: taskRequest
  };
});

server.post("/task-requests", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const parsed = TaskRequestInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid task request", parsed.error.flatten());
  }

  const record = await createTaskRequest(parsed.data);

  if ("error" in record) {
    return badRequest(reply, "Selected agent is not available", record);
  }

  return reply.code(201).send({
    item: record
  });
});

server.post("/task-requests/:id/responses", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = DemandResponseInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid demand response", parsed.error.flatten());
  }

  const provider = await getProviderById(parsed.data.providerId);

  if (!provider) {
    return badRequest(reply, "Selected provider is not available", {
      error: "PROVIDER_NOT_FOUND",
      providerId: parsed.data.providerId
    });
  }

  const result = await submitDemandResponse(id, parsed.data);

  if (!result) {
    return notFound(reply, "Task request not found");
  }

  return reply.code(201).send({
    item: result
  });
});

server.patch("/demand-responses/:id/status", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = DemandResponseStatusUpdateInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid demand response status update", parsed.error.flatten());
  }

  const result = await updateDemandResponseStatus(id, parsed.data);

  if (!result) {
    return notFound(reply, "Demand response not found");
  }

  return {
    item: result
  };
});

server.get("/task-runs/:id", async (request, reply) => {
  const { id } = request.params as { id: string };
  const taskRun = await getTaskRunById(id);

  if (!taskRun) {
    return notFound(reply, "Task run not found");
  }

  return {
    item: taskRun
  };
});

server.get("/task-runs", async (request) => {
  return {
    items: await listTaskRuns(request.query)
  };
});

server.patch("/task-runs/:id/status", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = RunStatusUpdateInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid status update", parsed.error.flatten());
  }

  const taskRun = await updateTaskRunStatus(id, parsed.data);

  if (!taskRun) {
    return notFound(reply, "Task run not found");
  }

  if ("error" in taskRun) {
    return conflict(reply, "Invalid run transition", taskRun);
  }

  return {
    item: taskRun
  };
});

server.post("/task-runs/:id/review", async (request, reply) => {
  if (isReadOnlyPreviewMode()) {
    return conflict(reply, "Preview mode is read-only");
  }

  const { id } = request.params as { id: string };
  const parsed = ReviewDecisionInputSchema.safeParse(request.body);

  if (!parsed.success) {
    return badRequest(reply, "Invalid review submission", parsed.error.flatten());
  }

  const taskRun = await submitReviewDecision(id, parsed.data);

  if (!taskRun) {
    return notFound(reply, "Task run not found");
  }

  if ("error" in taskRun) {
    return conflict(reply, "Review not allowed for current run state", taskRun);
  }

  return {
    item: taskRun
  };
});

const port = Number(process.env.PORT ?? 3001);

async function start() {
  await syncProviderProfiles();
  await syncAgentDefinitions();
  await syncSeededMarketplaceData();

  try {
    await server.listen({ port, host: "0.0.0.0" });
  } catch (error) {
    server.log.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

void start();
