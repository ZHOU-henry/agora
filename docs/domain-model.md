# Domain Model

## Core Entities

### ProviderProfile

Represents a builder or developer-side supply profile.

Fields:

- `id`
- `slug`
- `name`
- `summary`
- `description`
- `type`
- `website`
- `status`

### AgentDefinition

Represents a cataloged agent capability.

Fields:

- `id`
- `slug`
- `name`
- `summary`
- `status`
- `providerId`

### CapabilityTag

Describes what an agent is suitable for.

Fields:

- `id`
- `label`
- `category`

### TaskRequest

Represents the market-side demand object.

Fields:

- `id`
- `title`
- `description`
- `requestStatus`
- `selectedAgentId`
- `submittedBy`
- `submittedAt`

### DemandResponse

Represents a builder-side response to a visible customer demand.

Fields:

- `id`
- `taskRequestId`
- `providerId`
- `headline`
- `proposalSummary`
- `deliveryApproach`
- `etaLabel`
- `confidence`
- `status`

### Engagement

Represents the formal work object created once one builder response is accepted.

Fields:

- `id`
- `taskRequestId`
- `demandResponseId`
- `providerId`
- `status`
- `title`
- `summary`

### EngagementCustomerConfirmation

Represents the customer-side validation state after delivery.

Fields:

- `id`
- `engagementId`
- `status`
- `summary`
- `notes`
- `nextStep`
- `confirmedAt`

### EngagementFeedback

Represents post-delivery feedback that stays attached to the same engagement.

Fields:

- `id`
- `engagementId`
- `title`
- `details`
- `category`
- `status`
- `authorRole`
- `responseNote`

### EngagementIncident

Represents a field issue or deployment incident that requires handling.

Fields:

- `id`
- `engagementId`
- `title`
- `summary`
- `severity`
- `status`
- `authorRole`
- `responseNote`
- `openedAt`
- `resolvedAt`

### TaskRun

Represents a concrete execution attempt.

Fields:

- `id`
- `taskRequestId`
- `agentId`
- `runStatus`
- `startedAt`
- `completedAt`
- `outcomeSummary`

### RunEvent

Represents execution record entries.

Fields:

- `id`
- `taskRunId`
- `eventType`
- `message`
- `createdAt`

### ReviewDecision

Represents operator judgment after a run.

Fields:

- `id`
- `taskRunId`
- `verdict`
- `notes`
- `reviewedAt`

### Result Payload

Represented on `TaskRun` as:

- `resultSummary`
- `resultPayload`

### ProvenanceRecord

Represents the source and trust metadata of reused or referenced material.

Fields:

- `id`
- `relatedEntityType`
- `relatedEntityId`
- `sourceUrl`
- `license`
- `noticeRequired`
- `status`

## Relationships

- one `ProviderProfile` can have many `AgentDefinition`s
- one `AgentDefinition` has many `CapabilityTag`s
- one `TaskRequest` selects one `AgentDefinition`
- one `TaskRequest` can have many `DemandResponse`s
- one `TaskRequest` can have zero or one `Engagement`
- one accepted-response engagement can bootstrap one or more `TaskRun`s through the linked `TaskRequest`
- one `DemandResponse` belongs to one `ProviderProfile`
- one accepted `DemandResponse` can become one `Engagement`
- one `Engagement` can have zero or one `EngagementCustomerConfirmation`
- one `Engagement` can have many `EngagementFeedback` items
- one `Engagement` can have many `EngagementIncident` items
- one `TaskRun` has many `RunEvent`s
- one `TaskRun` can have zero or one `ReviewDecision`
- one `TaskRun` or `AgentDefinition` can have many `ProvenanceRecord`s

## Current Persistence Status

Persisted now:

- `ProviderProfile`
- `AgentDefinition`
- `TaskRequest`
- `DemandResponse`
- `Engagement`
- `EngagementMilestone`
- `EngagementDeliverable`
- `EngagementReview`
- `EngagementAgreement`
- `EngagementCustomerConfirmation`
- `EngagementFeedback`
- `EngagementIncident`
- `TaskRun`
- `RunEvent`
- `ReviewDecision`

Represented in the operator UI now:

- demand board publishing and browsing
- builder response submission and decision flow
- engagement list and engagement detail surfaces
- queue view for active and review-ready runs
- provenance metadata on agents and run surfaces

## Phase-1 Rule

Keep the model centered on:

- discoverability
- demand publishing
- response selection
- engagement tracking
- execution trace
- post-delivery customer validation
- feedback and incident closure
- operator review

Do not add billing, settlement, or generalized marketplace economics to the core model yet.
