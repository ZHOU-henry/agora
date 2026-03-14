import { z } from "zod";

export const AgentStatusSchema = z.enum(["draft", "active"]);
export const ProviderTypeSchema = z.enum([
  "first_party",
  "company",
  "independent"
]);
export const ProvenanceStatusSchema = z.enum([
  "seeded",
  "reviewed_external",
  "mixed"
]);

export const ProviderProfileSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  summary: z.string(),
  description: z.string(),
  type: ProviderTypeSchema,
  website: z.string(),
  tags: z.array(z.string()),
  status: AgentStatusSchema
});

export type ProviderProfile = z.infer<typeof ProviderProfileSchema>;

export const ProviderProfileInputSchema = z.object({
  slug: z.string().min(3).max(80),
  name: z.string().min(2).max(120),
  summary: z.string().min(10).max(240),
  description: z.string().min(10).max(1200),
  type: ProviderTypeSchema,
  website: z.string().max(240).optional().default(""),
  tags: z.array(z.string()).max(8).default([]),
  status: AgentStatusSchema.default("active")
});

export type ProviderProfileInput = z.infer<typeof ProviderProfileInputSchema>;

export const AgentDefinitionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  summary: z.string(),
  description: z.string(),
  providerId: z.string(),
  provider: ProviderProfileSchema,
  provenanceStatus: ProvenanceStatusSchema,
  provenanceSummary: z.string(),
  tags: z.array(z.string()),
  constraints: z.array(z.string()),
  trustSignals: z.array(z.string()),
  status: AgentStatusSchema
});

export type AgentDefinition = z.infer<typeof AgentDefinitionSchema>;

export const AgentDefinitionInputSchema = z.object({
  providerId: z.string().min(1),
  slug: z.string().min(3).max(80),
  name: z.string().min(2).max(120),
  summary: z.string().min(10).max(240),
  description: z.string().min(10).max(1600),
  provenanceStatus: ProvenanceStatusSchema.default("seeded"),
  provenanceSummary: z.string().min(3).max(300),
  tags: z.array(z.string()).max(10).default([]),
  constraints: z.array(z.string()).max(10).default([]),
  trustSignals: z.array(z.string()).max(10).default([]),
  status: AgentStatusSchema.default("active")
});

export type AgentDefinitionInput = z.infer<typeof AgentDefinitionInputSchema>;

export const TaskRequestStatusSchema = z.enum([
  "submitted",
  "running",
  "completed",
  "failed"
]);

export const DemandResponseStatusSchema = z.enum([
  "submitted",
  "shortlisted",
  "accepted",
  "declined"
]);

export const DemandResponseConfidenceSchema = z.enum([
  "high",
  "medium",
  "low"
]);

export const EngagementStatusSchema = z.enum([
  "kickoff",
  "scoping",
  "building",
  "review",
  "delivered"
]);

export const EngagementMilestoneStatusSchema = z.enum([
  "planned",
  "in_progress",
  "completed"
]);

export const EngagementDeliverableStatusSchema = z.enum([
  "planned",
  "in_progress",
  "in_review",
  "approved",
  "needs_work"
]);

export const EngagementReviewVerdictSchema = z.enum([
  "approved",
  "needs_work"
]);

export const EngagementAgreementStatusSchema = z.enum([
  "draft",
  "confirmed"
]);

export const CustomerConfirmationStatusSchema = z.enum([
  "pending",
  "accepted",
  "issues_reported",
  "expansion_requested"
]);

export const EngagementFeedbackCategorySchema = z.enum([
  "field_feedback",
  "environment_change",
  "maintenance_request",
  "expansion_signal"
]);

export const EngagementFeedbackStatusSchema = z.enum([
  "submitted",
  "acknowledged",
  "planned",
  "resolved"
]);

export const EngagementIncidentSeveritySchema = z.enum([
  "low",
  "medium",
  "high",
  "critical"
]);

export const EngagementIncidentStatusSchema = z.enum([
  "open",
  "investigating",
  "mitigated",
  "resolved"
]);

export const TaskRequestInputSchema = z.object({
  agentId: z.string().min(1),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  contextNote: z.string().max(1000).optional().default(""),
  requesterOrg: z.string().max(160).optional().default(""),
  industry: z.string().max(120).optional().default("")
});

export type TaskRequestInput = z.infer<typeof TaskRequestInputSchema>;

export const DemandBoardPublishInputSchema = TaskRequestInputSchema.extend({
  requesterOrg: z.string().min(2).max(160),
  industry: z.string().min(2).max(120)
});

export type DemandBoardPublishInput = z.infer<
  typeof DemandBoardPublishInputSchema
>;

export const TaskRequestRecordSchema = TaskRequestInputSchema.extend({
  id: z.string(),
  status: TaskRequestStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

export type TaskRequestRecord = z.infer<typeof TaskRequestRecordSchema>;

export const DemandResponseInputSchema = z.object({
  providerId: z.string().min(1),
  headline: z.string().min(3).max(120),
  proposalSummary: z.string().min(10).max(1200),
  deliveryApproach: z.string().max(1200).optional().default(""),
  etaLabel: z.string().max(120).optional().default(""),
  confidence: DemandResponseConfidenceSchema.optional().default("medium")
});

export type DemandResponseInput = z.infer<typeof DemandResponseInputSchema>;

export const DemandResponseStatusUpdateInputSchema = z.object({
  status: DemandResponseStatusSchema
});

export type DemandResponseStatusUpdateInput = z.infer<
  typeof DemandResponseStatusUpdateInputSchema
>;

export const DemandResponseRecordSchema = DemandResponseInputSchema.extend({
  id: z.string(),
  taskRequestId: z.string(),
  provider: ProviderProfileSchema,
  status: DemandResponseStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

export type DemandResponseRecord = z.infer<typeof DemandResponseRecordSchema>;

export const EngagementRecordSchema = z.object({
  id: z.string(),
  taskRequestId: z.string(),
  demandResponseId: z.string(),
  provider: ProviderProfileSchema,
  status: EngagementStatusSchema,
  title: z.string(),
  summary: z.string(),
  taskRunCount: z.number(),
  feedbackCount: z.number(),
  unresolvedFeedbackCount: z.number(),
  incidentCount: z.number(),
  openIncidentCount: z.number(),
  customerConfirmationStatus: CustomerConfirmationStatusSchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type EngagementRecord = z.infer<typeof EngagementRecordSchema>;

export const EngagementMilestoneRecordSchema = z.object({
  id: z.string(),
  engagementId: z.string(),
  title: z.string(),
  summary: z.string(),
  status: EngagementMilestoneStatusSchema,
  dueLabel: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type EngagementMilestoneRecord = z.infer<
  typeof EngagementMilestoneRecordSchema
>;

export const EngagementStatusUpdateInputSchema = z.object({
  status: EngagementStatusSchema
});

export type EngagementStatusUpdateInput = z.infer<
  typeof EngagementStatusUpdateInputSchema
>;

export const EngagementMilestoneInputSchema = z.object({
  title: z.string().min(3).max(120),
  summary: z.string().min(10).max(600),
  dueLabel: z.string().max(120).optional().default(""),
  status: EngagementMilestoneStatusSchema.optional().default("planned")
});

export type EngagementMilestoneInput = z.infer<
  typeof EngagementMilestoneInputSchema
>;

export const EngagementDeliverableRecordSchema = z.object({
  id: z.string(),
  engagementId: z.string(),
  title: z.string(),
  summary: z.string(),
  artifactType: z.string(),
  status: EngagementDeliverableStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

export type EngagementDeliverableRecord = z.infer<
  typeof EngagementDeliverableRecordSchema
>;

export const EngagementDeliverableStatusUpdateInputSchema = z.object({
  status: EngagementDeliverableStatusSchema
});

export type EngagementDeliverableStatusUpdateInput = z.infer<
  typeof EngagementDeliverableStatusUpdateInputSchema
>;

export const EngagementDeliverableInputSchema = z.object({
  title: z.string().min(3).max(120),
  summary: z.string().min(10).max(600),
  artifactType: z.string().min(2).max(80),
  status: EngagementDeliverableStatusSchema.optional().default("planned")
});

export type EngagementDeliverableInput = z.infer<
  typeof EngagementDeliverableInputSchema
>;

export const EngagementReviewRecordSchema = z.object({
  id: z.string(),
  engagementId: z.string(),
  verdict: EngagementReviewVerdictSchema,
  notes: z.string(),
  createdAt: z.string(),
  deliverableId: z.string().nullable().optional()
});

export type EngagementReviewRecord = z.infer<
  typeof EngagementReviewRecordSchema
>;

export const EngagementAgreementRecordSchema = z.object({
  id: z.string(),
  engagementId: z.string(),
  status: EngagementAgreementStatusSchema,
  engagementMode: z.string(),
  billingModel: z.string(),
  budgetLabel: z.string(),
  startWindow: z.string(),
  notes: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type EngagementAgreementRecord = z.infer<
  typeof EngagementAgreementRecordSchema
>;

export const EngagementAgreementInputSchema = z.object({
  status: EngagementAgreementStatusSchema,
  engagementMode: z.string().min(2).max(120),
  billingModel: z.string().min(2).max(120),
  budgetLabel: z.string().min(2).max(120),
  startWindow: z.string().min(2).max(120),
  notes: z.string().min(3).max(1000)
});

export type EngagementAgreementInput = z.infer<
  typeof EngagementAgreementInputSchema
>;

export const CustomerConfirmationRecordSchema = z.object({
  id: z.string(),
  engagementId: z.string(),
  status: CustomerConfirmationStatusSchema,
  summary: z.string(),
  notes: z.string(),
  nextStep: z.string().nullable().optional(),
  confirmedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type CustomerConfirmationRecord = z.infer<
  typeof CustomerConfirmationRecordSchema
>;

export const CustomerConfirmationInputSchema = z.object({
  status: CustomerConfirmationStatusSchema,
  summary: z.string().min(3).max(240),
  notes: z.string().min(3).max(1000),
  nextStep: z.string().max(240).optional().default("")
});

export type CustomerConfirmationInput = z.infer<
  typeof CustomerConfirmationInputSchema
>;

export const EngagementFeedbackRecordSchema = z.object({
  id: z.string(),
  engagementId: z.string(),
  title: z.string(),
  details: z.string(),
  category: EngagementFeedbackCategorySchema,
  status: EngagementFeedbackStatusSchema,
  authorRole: z.string(),
  responseNote: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type EngagementFeedbackRecord = z.infer<
  typeof EngagementFeedbackRecordSchema
>;

export const EngagementFeedbackInputSchema = z.object({
  title: z.string().min(3).max(120),
  details: z.string().min(10).max(1200),
  category: EngagementFeedbackCategorySchema
});

export type EngagementFeedbackInput = z.infer<
  typeof EngagementFeedbackInputSchema
>;

export const EngagementFeedbackStatusUpdateInputSchema = z.object({
  status: EngagementFeedbackStatusSchema,
  responseNote: z.string().max(1000).optional().default("")
});

export type EngagementFeedbackStatusUpdateInput = z.infer<
  typeof EngagementFeedbackStatusUpdateInputSchema
>;

export const EngagementIncidentRecordSchema = z.object({
  id: z.string(),
  engagementId: z.string(),
  title: z.string(),
  summary: z.string(),
  severity: EngagementIncidentSeveritySchema,
  status: EngagementIncidentStatusSchema,
  authorRole: z.string(),
  responseNote: z.string().nullable().optional(),
  openedAt: z.string(),
  resolvedAt: z.string().nullable().optional(),
  updatedAt: z.string()
});

export type EngagementIncidentRecord = z.infer<
  typeof EngagementIncidentRecordSchema
>;

export const EngagementIncidentInputSchema = z.object({
  title: z.string().min(3).max(120),
  summary: z.string().min(10).max(1200),
  severity: EngagementIncidentSeveritySchema
});

export type EngagementIncidentInput = z.infer<
  typeof EngagementIncidentInputSchema
>;

export const EngagementIncidentStatusUpdateInputSchema = z.object({
  status: EngagementIncidentStatusSchema,
  responseNote: z.string().max(1000).optional().default("")
});

export type EngagementIncidentStatusUpdateInput = z.infer<
  typeof EngagementIncidentStatusUpdateInputSchema
>;

export const EngagementReviewInputSchema = z.object({
  verdict: EngagementReviewVerdictSchema,
  notes: z.string().min(3).max(1000),
  deliverableId: z.string().optional().nullable()
});

export type EngagementReviewInput = z.infer<typeof EngagementReviewInputSchema>;

export const TaskRunStatusSchema = z.enum([
  "submitted",
  "running",
  "completed",
  "failed"
]);

export const RunEventTypeSchema = z.enum([
  "submitted",
  "status_changed",
  "review_submitted"
]);

export const ReviewVerdictSchema = z.enum([
  "approved",
  "needs_work",
  "rejected"
]);

export type ReviewVerdict = z.infer<typeof ReviewVerdictSchema>;

export const RunEventRecordSchema = z.object({
  id: z.string(),
  taskRunId: z.string(),
  eventType: RunEventTypeSchema,
  message: z.string(),
  createdAt: z.string()
});

export type RunEventRecord = z.infer<typeof RunEventRecordSchema>;

export const ReviewDecisionInputSchema = z.object({
  verdict: ReviewVerdictSchema,
  notes: z.string().max(1000).optional().default("")
});

export type ReviewDecisionInput = z.infer<typeof ReviewDecisionInputSchema>;

export const ReviewDecisionRecordSchema = ReviewDecisionInputSchema.extend({
  id: z.string(),
  taskRunId: z.string(),
  reviewedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type ReviewDecisionRecord = z.infer<typeof ReviewDecisionRecordSchema>;

export const RunStatusUpdateInputSchema = z.object({
  status: TaskRunStatusSchema,
  message: z.string().max(300).optional().default(""),
  resultSummary: z.string().max(1000).optional().default(""),
  resultPayload: z.record(z.string(), z.unknown()).optional().nullable()
});

export type RunStatusUpdateInput = z.infer<typeof RunStatusUpdateInputSchema>;
export type TaskRunStatus = z.infer<typeof TaskRunStatusSchema>;

export const TaskRunRecordSchema = z.object({
  id: z.string(),
  taskRequestId: z.string(),
  status: TaskRunStatusSchema,
  latestMessage: z.string().nullable().optional(),
  resultSummary: z.string().nullable().optional(),
  resultPayload: z.record(z.string(), z.unknown()).nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  startedAt: z.string().nullable().optional(),
  completedAt: z.string().nullable().optional()
});

export type TaskRunRecord = z.infer<typeof TaskRunRecordSchema>;

export const TaskRequestDetailSchema = TaskRequestRecordSchema.extend({
  agent: AgentDefinitionSchema,
  runs: z.array(TaskRunRecordSchema),
  responses: z.array(DemandResponseRecordSchema),
  engagement: EngagementRecordSchema.nullable()
});

export type TaskRequestDetail = z.infer<typeof TaskRequestDetailSchema>;

export const TaskRunDetailSchema = TaskRunRecordSchema.extend({
  taskRequest: TaskRequestRecordSchema,
  agent: AgentDefinitionSchema,
  events: z.array(RunEventRecordSchema),
  reviewDecision: ReviewDecisionRecordSchema.nullable()
});

export type TaskRunDetail = z.infer<typeof TaskRunDetailSchema>;

export const TaskRunSummarySchema = TaskRunRecordSchema.extend({
  taskTitle: z.string(),
  agent: AgentDefinitionSchema,
  reviewDecision: ReviewDecisionRecordSchema.nullable()
});

export type TaskRunSummary = z.infer<typeof TaskRunSummarySchema>;

export const ProviderAgentReferenceSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  summary: z.string(),
  status: AgentStatusSchema
});

export type ProviderAgentReference = z.infer<typeof ProviderAgentReferenceSchema>;

export const ProviderResponseReferenceSchema = DemandResponseRecordSchema.extend({
  taskRequestTitle: z.string(),
  taskRequestStatus: TaskRequestStatusSchema,
  industry: z.string(),
  requesterOrg: z.string()
});

export type ProviderResponseReference = z.infer<
  typeof ProviderResponseReferenceSchema
>;

export const ProviderEngagementReferenceSchema = EngagementRecordSchema.extend({
  agent: ProviderAgentReferenceSchema,
  taskRequestTitle: z.string(),
  industry: z.string(),
  requesterOrg: z.string()
});

export type ProviderEngagementReference = z.infer<
  typeof ProviderEngagementReferenceSchema
>;

export const ProviderProfileDetailSchema = ProviderProfileSchema.extend({
  agents: z.array(ProviderAgentReferenceSchema),
  responses: z.array(ProviderResponseReferenceSchema),
  engagements: z.array(ProviderEngagementReferenceSchema)
});

export type ProviderProfileDetail = z.infer<typeof ProviderProfileDetailSchema>;

export const EngagementDetailSchema = EngagementRecordSchema.extend({
  taskRequest: TaskRequestRecordSchema,
  agent: AgentDefinitionSchema,
  demandResponse: DemandResponseRecordSchema,
  taskRuns: z.array(TaskRunRecordSchema),
  milestones: z.array(EngagementMilestoneRecordSchema),
  deliverables: z.array(EngagementDeliverableRecordSchema),
  reviews: z.array(EngagementReviewRecordSchema),
  agreement: EngagementAgreementRecordSchema.nullable(),
  customerConfirmation: CustomerConfirmationRecordSchema.nullable(),
  feedbackItems: z.array(EngagementFeedbackRecordSchema),
  incidents: z.array(EngagementIncidentRecordSchema)
});

export type EngagementDetail = z.infer<typeof EngagementDetailSchema>;

export const DemandBoardItemSchema = TaskRequestRecordSchema.extend({
  agent: AgentDefinitionSchema,
  responseCount: z.number(),
  latestResponseAt: z.string().nullable().optional()
});

export type DemandBoardItem = z.infer<typeof DemandBoardItemSchema>;

export const AgentDefinitionListSchema = z.array(AgentDefinitionSchema);
export const ProviderProfileListSchema = z.array(ProviderProfileSchema);
export const DemandBoardListSchema = z.array(DemandBoardItemSchema);
export const EngagementListSchema = z.array(EngagementRecordSchema);
export const TaskRequestDetailListSchema = z.array(TaskRequestDetailSchema);
export const TaskRunSummaryListSchema = z.array(TaskRunSummarySchema);

export const TaskRunListQuerySchema = z.object({
  agentSlug: z.string().optional(),
  status: TaskRunStatusSchema.optional(),
  reviewState: z.enum(["pending", "reviewed"]).optional(),
  sort: z.enum(["newest", "oldest", "review-priority"]).optional()
});

const henryFirstPartyProvider: ProviderProfile = {
  id: "henry-first-party",
  slug: "henry-first-party",
  name: "Henry First-Party Operators",
  summary:
    "The seeded first-party builder cohort behind Agora's initial launch catalog.",
  description:
    "This provider profile represents Henry's own operator stack and the first-party agents used to launch Agora before outside builders join the supply side.",
  type: "first_party",
  website: "",
  tags: ["seeded", "launch-cohort", "operators"],
  status: "active"
};

const lingxiFactoryProvider: ProviderProfile = {
  id: "lingxi-factory-ai",
  slug: "lingxi-factory-ai",
  name: "Lingxi Factory AI",
  summary:
    "Industrial-agent studio focused on manufacturing scheduling, plant command, and line-side decision support.",
  description:
    "Lingxi Factory AI represents a specialized builder that turns production planning, exception handling, and shift coordination into agent products for manufacturing teams.",
  type: "company",
  website: "",
  tags: ["manufacturing", "operations", "industrial"],
  status: "active"
};

const praxisQualityProvider: ProviderProfile = {
  id: "praxis-quality-lab",
  slug: "praxis-quality-lab",
  name: "Praxis Quality Lab",
  summary:
    "Builder profile centered on industrial vision inspection, traceability, and defect-review workflows.",
  description:
    "Praxis Quality Lab models a supply-side team that packages industrial inspection expertise into deployable agent products for factories and quality teams.",
  type: "company",
  website: "",
  tags: ["quality", "vision", "inspection"],
  status: "active"
};

const relayFieldProvider: ProviderProfile = {
  id: "relay-field-systems",
  slug: "relay-field-systems",
  name: "Relay Field Systems",
  summary:
    "Operations-focused builder working on warehouse flow, field maintenance, and frontline copilot agents.",
  description:
    "Relay Field Systems represents the kind of builder that adapts agent products to logistics throughput, maintenance routines, and real-world operational constraints.",
  type: "independent",
  website: "",
  tags: ["warehouse", "field", "maintenance"],
  status: "active"
};

export const providerProfiles: ProviderProfile[] = [
  henryFirstPartyProvider,
  lingxiFactoryProvider,
  praxisQualityProvider,
  relayFieldProvider
];

export const agentDefinitions: AgentDefinition[] = [
  {
    id: "athena",
    slug: "athena",
    name: "Athena",
    summary: "Project-control intelligence focused on scope, sequencing, and execution clarity.",
    description:
      "Athena helps operators choose direction, structure work, and keep an agent program aligned to real milestones rather than narrative drift.",
    providerId: henryFirstPartyProvider.id,
    provider: henryFirstPartyProvider,
    provenanceStatus: "seeded",
    provenanceSummary:
      "Seeded by the Agora team from internal role definitions and execution architecture decisions.",
    tags: ["planning", "strategy", "portfolio"],
    constraints: [
      "Best when the task needs prioritization and decomposition",
      "Not the right surface for raw implementation work"
    ],
    trustSignals: [
      "Clear role boundary",
      "Structured planning output",
      "Issue-first operating model"
    ],
    status: "active"
  },
  {
    id: "hermes",
    slug: "hermes",
    name: "Hermes",
    summary: "Research and intelligence agent for source-backed market and technical analysis.",
    description:
      "Hermes helps operators validate market, product, and technical claims using reliable sources and explicit uncertainty notes.",
    providerId: henryFirstPartyProvider.id,
    provider: henryFirstPartyProvider,
    provenanceStatus: "seeded",
    provenanceSummary:
      "Seeded by the Agora team from the internal research role and source-discipline operating model.",
    tags: ["research", "sources", "analysis"],
    constraints: [
      "Best when source quality matters",
      "Not a replacement for direct implementation"
    ],
    trustSignals: [
      "Source-backed output",
      "Explicit dates and links",
      "Inference separated from fact"
    ],
    status: "active"
  },
  {
    id: "hephaestus",
    slug: "hephaestus",
    name: "Hephaestus",
    summary: "Engineering agent for implementation, scaffolding, and delivery mechanics.",
    description:
      "Hephaestus turns validated plans into working code, repeatable tooling, and maintainable system structure.",
    providerId: henryFirstPartyProvider.id,
    provider: henryFirstPartyProvider,
    provenanceStatus: "seeded",
    provenanceSummary:
      "Seeded by the Agora team from the internal engineering role and implementation workflow model.",
    tags: ["code", "delivery", "systems"],
    constraints: [
      "Best when scope and architecture are clear enough to build",
      "Should not self-approve risky work without audit"
    ],
    trustSignals: [
      "Typechecked code paths",
      "Reproducible repo structure",
      "Explicit implementation boundaries"
    ],
    status: "active"
  },
  {
    id: "themis",
    slug: "themis",
    name: "Themis",
    summary: "Audit and quality intelligence for review gates, release judgment, and execution risk control.",
    description:
      "Themis helps operators inspect completed work, challenge weak evidence, and keep launches honest before risky work is accepted or reused.",
    providerId: henryFirstPartyProvider.id,
    provider: henryFirstPartyProvider,
    provenanceStatus: "seeded",
    provenanceSummary:
      "Seeded by the Agora team from the internal audit role, provenance gate, and review workflow model.",
    tags: ["audit", "review", "governance"],
    constraints: [
      "Best when the task needs challenge, verification, or release judgment",
      "Not the right first surface for greenfield strategy or raw implementation"
    ],
    trustSignals: [
      "Explicit review gate",
      "Constructive adversarial posture",
      "High emphasis on quality, risk, and provenance"
    ],
    status: "active"
  },
  {
    id: "line-orchestrator",
    slug: "line-orchestrator",
    name: "Line Orchestrator",
    summary:
      "Factory-floor agent for production pacing, schedule conflicts, and exception coordination.",
    description:
      "Line Orchestrator helps manufacturing teams interpret live disruptions, rebalance priorities, and keep production plans coherent when the line gets noisy.",
    providerId: lingxiFactoryProvider.id,
    provider: lingxiFactoryProvider,
    provenanceStatus: "seeded",
    provenanceSummary:
      "Seeded demo agent used to model how outside industrial builders can publish scenario-specific agents onto Agora.",
    tags: ["manufacturing", "scheduling", "industrial"],
    constraints: [
      "Best when production context and plant constraints are already captured",
      "Not a replacement for actual control-system automation"
    ],
    trustSignals: [
      "Scenario-specific industrial fit",
      "Operator-facing explanation layer",
      "Built around exception handling rather than generic chat"
    ],
    status: "active"
  },
  {
    id: "quality-sentinel",
    slug: "quality-sentinel",
    name: "Quality Sentinel",
    summary:
      "Vision-led quality agent for defect triage, escalation notes, and review workflow support.",
    description:
      "Quality Sentinel packages industrial inspection workflows into an agent product that helps teams review anomalies, explain likely causes, and route issues quickly.",
    providerId: praxisQualityProvider.id,
    provider: praxisQualityProvider,
    provenanceStatus: "seeded",
    provenanceSummary:
      "Seeded demo agent used to represent third-party industrial quality builders on the platform.",
    tags: ["quality", "vision", "inspection"],
    constraints: [
      "Works best with clear image or defect inputs",
      "Does not replace certified human signoff in regulated environments"
    ],
    trustSignals: [
      "Inspection-first workflow framing",
      "Escalation-ready output style",
      "Built for traceability-sensitive teams"
    ],
    status: "active"
  },
  {
    id: "warehouse-wave-planner",
    slug: "warehouse-wave-planner",
    name: "Warehouse Wave Planner",
    summary:
      "Operations agent for warehouse waves, slotting tension, and dispatch prioritization.",
    description:
      "Warehouse Wave Planner helps logistics teams reason about throughput spikes, staging pressure, and short-horizon dispatch choices without losing operational context.",
    providerId: relayFieldProvider.id,
    provider: relayFieldProvider,
    provenanceStatus: "seeded",
    provenanceSummary:
      "Seeded demo agent representing an outside logistics-focused builder on Agora.",
    tags: ["warehouse", "logistics", "operations"],
    constraints: [
      "Best used with current demand and slotting context",
      "Not a direct replacement for WMS or transport execution systems"
    ],
    trustSignals: [
      "Throughput-aware recommendations",
      "Built for operational supervisors",
      "Focused on short-cycle routing decisions"
    ],
    status: "active"
  },
  {
    id: "maintenance-copilot",
    slug: "maintenance-copilot",
    name: "Maintenance Copilot",
    summary:
      "Field and maintenance agent for diagnostic support, procedural recall, and work-order closure.",
    description:
      "Maintenance Copilot helps frontline teams retrieve the right operational context faster, structure repair notes, and shorten the path from issue report to closed loop.",
    providerId: relayFieldProvider.id,
    provider: relayFieldProvider,
    provenanceStatus: "seeded",
    provenanceSummary:
      "Seeded demo agent representing a field-operations builder on Agora.",
    tags: ["maintenance", "field", "operations"],
    constraints: [
      "Best when equipment context is available",
      "Does not replace qualified engineering approval for high-risk procedures"
    ],
    trustSignals: [
      "Frontline workflow fit",
      "Structured closure support",
      "Designed around procedural recall and note quality"
    ],
    status: "active"
  }
];

export function findAgentBySlug(slug: string) {
  return agentDefinitions.find((agent) => agent.slug === slug) ?? null;
}

export function findProviderBySlug(slug: string) {
  return providerProfiles.find((provider) => provider.slug === slug) ?? null;
}
