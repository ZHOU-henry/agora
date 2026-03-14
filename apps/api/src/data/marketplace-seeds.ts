import { prisma } from "../lib/prisma.js";
import { ensureEngagementScaffold } from "./engagement-scaffold.js";

const seededDemands = [
  {
    id: "demand-factory-shift-command",
    runId: "run-demand-factory-shift-command",
    eventId: "event-demand-factory-shift-command",
    agentId: "line-orchestrator",
    title: "Need an agent to coordinate shift handover decisions on a machining line",
    description:
      "A precision manufacturing team wants an agent product that can interpret production interruptions, summarize upstream and downstream impact, and guide shift leaders during handover windows.",
    contextNote:
      "The customer wants a pilot that starts with exception summarization, schedule impact explanation, and operator-facing next-step suggestions.",
    requesterOrg: "Foshan Precision Components",
    industry: "smart manufacturing"
  },
  {
    id: "demand-quality-defect-review",
    runId: "run-demand-quality-defect-review",
    eventId: "event-demand-quality-defect-review",
    agentId: "quality-sentinel",
    title: "Looking for an inspection agent to triage recurring visual defects",
    description:
      "An optics manufacturer needs an agent workflow that helps quality staff cluster defect patterns, explain likely causes, and escalate the right cases to human review faster.",
    contextNote:
      "The first phase should focus on defect-review speed, traceability, and generating cleaner review notes for QA leads.",
    requesterOrg: "Suzhou Optics Assembly",
    industry: "industrial quality"
  },
  {
    id: "demand-warehouse-wave-control",
    runId: "run-demand-warehouse-wave-control",
    eventId: "event-demand-warehouse-wave-control",
    agentId: "warehouse-wave-planner",
    title: "Need a warehouse agent to handle order-wave surges and slotting pressure",
    description:
      "A logistics operator wants an agent product that can interpret wave spikes, suggest slotting adjustments, and help dispatch supervisors respond to labor and staging pressure.",
    contextNote:
      "The team wants visibility into surge reasoning, suggested actions, and a clear operator handoff rather than a black-box optimization result.",
    requesterOrg: "Ningbo Fulfillment Grid",
    industry: "warehouse operations"
  },
  {
    id: "demand-maintenance-copilot",
    runId: "run-demand-maintenance-copilot",
    eventId: "event-demand-maintenance-copilot",
    agentId: "maintenance-copilot",
    title: "Seeking a maintenance copilot for frontline equipment diagnosis and closure notes",
    description:
      "A field maintenance team wants a copilot that retrieves procedures, structures issue interpretation, and shortens the path from incident report to work-order closure.",
    contextNote:
      "The pilot should focus on technician guidance, knowledge retrieval, and more consistent maintenance notes before deeper system integration.",
    requesterOrg: "Delta Utility Services",
    industry: "field maintenance"
  }
] as const;

const seededResponses = [
  {
    taskRequestId: "demand-factory-shift-command",
    providerId: "lingxi-factory-ai",
    status: "accepted" as const,
    headline: "Shift command agent for live manufacturing exception triage",
    proposalSummary:
      "We would package a line-side command agent that summarizes interruptions, explains likely schedule impact, and gives shift leaders structured next steps before handover.",
    deliveryApproach:
      "Pilot with structured event intake, operator summary generation, and shift-ready decision notes for one production line.",
    etaLabel: "2-week pilot",
    confidence: "high" as const
  },
  {
    taskRequestId: "demand-factory-shift-command",
    providerId: "henry-first-party",
    status: "shortlisted" as const,
    headline: "First-party planning + audit lane for manufacturing dispatch workflows",
    proposalSummary:
      "Our seeded first-party stack would approach this as a control and audit problem first, with explicit planning, review, and rollout guardrails before wider line adoption.",
    deliveryApproach:
      "Start with structured shift brief generation and escalation policy checks, then expand toward deeper line-side copilot behavior.",
    etaLabel: "3-week structured pilot",
    confidence: "medium" as const
  },
  {
    taskRequestId: "demand-quality-defect-review",
    providerId: "praxis-quality-lab",
    status: "submitted" as const,
    headline: "Industrial quality triage agent with visual defect review framing",
    proposalSummary:
      "We would deliver a review-first quality agent that groups anomalies, drafts likely-cause notes, and accelerates the human escalation path for defect-heavy shifts.",
    deliveryApproach:
      "Begin with defect clustering, review note generation, and a traceable escalation layer for quality leads.",
    etaLabel: "10-day QA pilot",
    confidence: "high" as const
  },
  {
    taskRequestId: "demand-warehouse-wave-control",
    providerId: "relay-field-systems",
    status: "shortlisted" as const,
    headline: "Warehouse wave and dispatch orchestration copilot",
    proposalSummary:
      "We would package an operations agent focused on wave spikes, slotting tension, and supervisor-visible dispatch recommendations during peak throughput windows.",
    deliveryApproach:
      "Pilot on one warehouse zone with inbound wave summaries, dispatch recommendations, and shift-level operator explanation.",
    etaLabel: "2-week warehouse pilot",
    confidence: "high" as const
  },
  {
    taskRequestId: "demand-maintenance-copilot",
    providerId: "relay-field-systems",
    status: "submitted" as const,
    headline: "Frontline maintenance copilot for knowledge retrieval and closure notes",
    proposalSummary:
      "We would deliver a field-ready maintenance assistant that retrieves procedures, structures diagnosis notes, and helps technicians produce cleaner work-order closure output.",
    deliveryApproach:
      "Start with procedure retrieval and closure-note assistance for a bounded equipment family before deeper integration.",
    etaLabel: "12-day field pilot",
    confidence: "medium" as const
  }
] as const;

export async function syncSeededMarketplaceData() {
  for (const demand of seededDemands) {
    await prisma.taskRequest.upsert({
      where: { id: demand.id },
      update: {
        agentId: demand.agentId,
        title: demand.title,
        description: demand.description,
        contextNote: demand.contextNote,
        requesterOrg: demand.requesterOrg,
        industry: demand.industry,
        status: "submitted"
      },
      create: {
        id: demand.id,
        agentId: demand.agentId,
        title: demand.title,
        description: demand.description,
        contextNote: demand.contextNote,
        requesterOrg: demand.requesterOrg,
        industry: demand.industry,
        status: "submitted"
      }
    });

    await prisma.taskRun.upsert({
      where: { id: demand.runId },
      update: {
        status: "submitted",
        latestMessage: "Demand published to the builder board."
      },
      create: {
        id: demand.runId,
        taskRequestId: demand.id,
        status: "submitted",
        latestMessage: "Demand published to the builder board."
      }
    });

    await prisma.runEvent.upsert({
      where: { id: demand.eventId },
      update: {
        eventType: "submitted",
        message: "Demand published to the builder board."
      },
      create: {
        id: demand.eventId,
        taskRunId: demand.runId,
        eventType: "submitted",
        message: "Demand published to the builder board."
      }
    });
  }

  for (const response of seededResponses) {
    await prisma.demandResponse.upsert({
      where: {
        providerId_taskRequestId: {
          providerId: response.providerId,
          taskRequestId: response.taskRequestId
      }
    },
    update: {
        status: response.status,
        headline: response.headline,
        proposalSummary: response.proposalSummary,
        deliveryApproach: response.deliveryApproach,
        etaLabel: response.etaLabel,
        confidence: response.confidence
      },
      create: {
        providerId: response.providerId,
        taskRequestId: response.taskRequestId,
        status: response.status,
        headline: response.headline,
        proposalSummary: response.proposalSummary,
        deliveryApproach: response.deliveryApproach,
        etaLabel: response.etaLabel,
        confidence: response.confidence
      }
    });
  }

  await prisma.engagement.deleteMany({
    where: {
      demandResponse: {
        taskRequestId: {
          in: seededResponses.map((response) => response.taskRequestId)
        }
      }
    }
  });

  for (const response of seededResponses.filter((item) => item.status === "accepted")) {
    const existingResponse = await prisma.demandResponse.findUnique({
      where: {
        providerId_taskRequestId: {
          providerId: response.providerId,
          taskRequestId: response.taskRequestId
        }
      }
    });

    if (!existingResponse) {
      continue;
    }

    const engagement = await prisma.engagement.upsert({
      where: {
        taskRequestId: response.taskRequestId
      },
      update: {
        providerId: response.providerId,
        demandResponseId: existingResponse.id,
        status: "kickoff",
        title: response.headline,
        summary: response.proposalSummary
      },
      create: {
        taskRequestId: response.taskRequestId,
        providerId: response.providerId,
        demandResponseId: existingResponse.id,
        status: "kickoff",
        title: response.headline,
        summary: response.proposalSummary
      }
    });

    await ensureEngagementScaffold(prisma, {
      engagementId: engagement.id,
      taskRequestId: response.taskRequestId,
      mode: "demo"
    });
  }
}
