import { z } from "zod";

export const AgentStatusSchema = z.enum(["draft", "active"]);
export const ProvenanceStatusSchema = z.enum([
  "seeded",
  "reviewed_external",
  "mixed"
]);

export const AgentDefinitionSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  summary: z.string(),
  description: z.string(),
  provenanceStatus: ProvenanceStatusSchema,
  provenanceSummary: z.string(),
  tags: z.array(z.string()),
  constraints: z.array(z.string()),
  trustSignals: z.array(z.string()),
  status: AgentStatusSchema
});

export type AgentDefinition = z.infer<typeof AgentDefinitionSchema>;

export const TaskRequestStatusSchema = z.enum([
  "submitted",
  "running",
  "completed",
  "failed"
]);

export const TaskRequestInputSchema = z.object({
  agentId: z.string().min(1),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  contextNote: z.string().max(1000).optional().default("")
});

export type TaskRequestInput = z.infer<typeof TaskRequestInputSchema>;

export const TaskRequestRecordSchema = TaskRequestInputSchema.extend({
  id: z.string(),
  status: TaskRequestStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

export type TaskRequestRecord = z.infer<typeof TaskRequestRecordSchema>;

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
  runs: z.array(TaskRunRecordSchema)
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

export const AgentDefinitionListSchema = z.array(AgentDefinitionSchema);
export const TaskRequestDetailListSchema = z.array(TaskRequestDetailSchema);
export const TaskRunSummaryListSchema = z.array(TaskRunSummarySchema);

export const TaskRunListQuerySchema = z.object({
  agentSlug: z.string().optional(),
  status: TaskRunStatusSchema.optional(),
  reviewState: z.enum(["pending", "reviewed"]).optional(),
  sort: z.enum(["newest", "oldest", "review-priority"]).optional()
});

export const agentDefinitions: AgentDefinition[] = [
  {
    id: "athena",
    slug: "athena",
    name: "Athena",
    summary: "Project-control intelligence focused on scope, sequencing, and execution clarity.",
    description:
      "Athena helps operators choose direction, structure work, and keep an agent program aligned to real milestones rather than narrative drift.",
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
  }
];

export function findAgentBySlug(slug: string) {
  return agentDefinitions.find((agent) => agent.slug === slug) ?? null;
}
