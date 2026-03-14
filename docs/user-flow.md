# User Flow

## Core Loop

1. publish a customer demand
2. expose it to the builder side
3. collect and compare builder responses
4. accept one response into a formal engagement
5. run delivery through engagement, run, and deliverable control
6. collect customer confirmation, field feedback, and incidents on the same engagement
7. decide whether to stabilize, remediate, or expand the deployment

## Phase-1 Product Surfaces

### Catalog

- agent name
- summary
- tags
- trust indicators

### Demand Publish

- customer name
- industry context
- demand title
- demand description
- recommended agent direction

### Builder Response

- provider identity
- proposal summary
- delivery approach
- ETA and confidence

### Engagement

- accepted response
- engagement status
- delivery milestones
- deliverables and review
- lightweight commercial frame
- customer confirmation
- feedback threads
- incident tickets
- delivery-health signals

### Task Intake

- task title
- task description
- optional context
- selected agent

### Run Record

- run status
- run timeline
- outputs
- warnings
- operator-accessible execution history
- structured result summary
- structured result payload

### Review

- useful / not useful
- review notes
- rerun / escalate decision

### Queue

- operator queue for active work
- review queue for completed but unreviewed runs
- recent request visibility
- filter by status, review state, or agent

## Current Implementation Status

- catalog list: implemented
- agent detail: implemented
- demand publish: implemented on the demand board
- builder response submit: implemented
- response shortlist / accept / decline: implemented
- accepted response -> engagement sync: implemented
- engagement milestone / deliverable / agreement editing: implemented as a first operations workspace
- customer confirmation: implemented
- engagement feedback: implemented
- engagement incidents: implemented
- accepted response -> delivery run creation: implemented
- role-surface operating signals: implemented
- run detail: implemented
- operator review: implemented as a first minimal verdict flow
- operator queue: implemented
- customer response activity view: implemented
- builder active engagement view: implemented
- ops response decision queue: implemented
- provenance display: implemented as a first seeded-source visibility layer
- result payload: implemented as a first structured execution output
