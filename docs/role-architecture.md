# Role Architecture

Agora phase-1 is intentionally role-scoped. The point is not to give every signed-in person every screen.

## Roles

### Customer

What this role is for:

- publish demand
- inspect builder responses
- monitor accepted delivery progress

Primary surfaces:

- `/customer`
- `/demand`
- `/requests/[id]`
- `/engagements`
- `/engagements/[id]`
- read-only inspection of `/providers` and `/agents/[slug]`

Write actions allowed:

- `POST /demand-board`
- `POST /task-requests`

Not allowed:

- builder studio actions
- response submission
- response acceptance / decline decisions
- run controls
- engagement operations controls
- ops queue and ops dashboard

### Builder

What this role is for:

- inspect public demand
- publish builder-side supply
- submit responses to demand
- inspect accepted engagements

Primary surfaces:

- `/builders`
- `/builders/studio`
- `/demand`
- `/requests/[id]`
- `/providers`
- `/providers/[slug]`
- `/engagements`
- `/engagements/[id]`

Write actions allowed:

- `POST /providers`
- `POST /agents`
- `POST /task-requests/:id/responses`

Not allowed:

- demand publishing
- response acceptance / decline decisions
- run controls
- engagement operations controls
- ops queue and ops dashboard

### Ops

What this role is for:

- monitor demand and response flow
- make platform response decisions
- control execution and review
- move engagements forward after acceptance

Primary surfaces:

- `/ops`
- `/queue`
- `/requests/[id]`
- `/runs/[id]`
- `/engagements`
- `/engagements/[id]`
- read-only inspection of `/demand`, `/providers`, and `/agents/[slug]`

Write actions allowed:

- `PATCH /demand-responses/:id/status`
- `PATCH /task-runs/:id/status`
- `POST /task-runs/:id/review`
- `PATCH /engagements/:id/status`
- `PATCH /engagement-deliverables/:id/status`
- `POST /engagements/:id/milestones`
- `POST /engagements/:id/deliverables`
- `PUT /engagements/:id/agreement`
- `POST /engagements/:id/reviews`

Not allowed:

- customer demand publishing
- builder supply creation

## Current Rule

Role affects three layers:

1. header navigation
2. route access / redirect behavior
3. write-path authorization in the web proxy layer

This is still phase-1 role gating, not full tenant or identity isolation.
