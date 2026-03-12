# Domain Model

## Core Entities

### AgentDefinition

Represents a cataloged agent capability.

Fields:

- `id`
- `slug`
- `name`
- `summary`
- `status`
- `ownerType`

### CapabilityTag

Describes what an agent is suitable for.

Fields:

- `id`
- `label`
- `category`

### TaskRequest

Represents a user-submitted need before or during execution.

Fields:

- `id`
- `title`
- `description`
- `requestStatus`
- `selectedAgentId`
- `submittedBy`
- `submittedAt`

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

- one `AgentDefinition` has many `CapabilityTag`s
- one `TaskRequest` selects one `AgentDefinition`
- one `TaskRequest` can have many `TaskRun`s
- one `TaskRun` has many `RunEvent`s
- one `TaskRun` can have zero or one `ReviewDecision`
- one `TaskRun` or `AgentDefinition` can have many `ProvenanceRecord`s

## Current Persistence Status

Persisted now:

- `AgentDefinition`
- `TaskRequest`
- `TaskRun`
- `RunEvent`
- `ReviewDecision`

Represented in the operator UI now:

- queue view for active and review-ready runs
- provenance metadata on agents and run surfaces

## Phase-1 Rule

Keep the model centered on:

- discoverability
- task submission
- execution trace
- operator review

Do not add billing, settlement, or generalized marketplace economics to the core model yet.
