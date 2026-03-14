# Agora - AI Agent Platform

Open-source MVP for an AI Agent platform and operator workspace.

Chinese shorthand: `AI Agent 平台`

## Visual Preview

![Agora Control Theater](apps/web/public/media/control-theater-loop.svg)

Agora is being shaped as a customer-demand + builder-supply platform, not just a static agent catalog.

![Builder Network](apps/web/public/media/builder-network-loop.svg)

The launch cohort starts with seeded first-party supply, but the long-term platform shape is open to outside agent developers and companies.

![Demand Board](apps/web/public/media/execution-reel-loop.svg)

The newest product slice adds a seeded demand board and builder response layer, so the platform starts to behave like a market instead of a one-way showcase.

## Stage

Stage 1: executable monorepo with persisted task requests, first run record lifecycle, and operator review foundations.

## Stack

- `pnpm workspaces`
- `Turborepo`
- `Next.js 16`
- `Fastify`
- `PostgreSQL`
- `Prisma`

## Workspace

- `apps/web/`
- `apps/api/`
- `packages/shared/`
- `infra/`
- `docs/`

## Current Product Slice

- seeded four-agent catalog aligned to Athena, Hermes, Hephaestus, and Themis
- seeded builder/provider profile layer for the launch cohort
- seeded demand board and builder response layer
- bilingual Chinese / English product experience
- industry showcase visuals for manufacturing, quality, warehouse, and maintenance scenarios
- agent catalog
- agent detail
- task intake
- persisted task requests
- first run record lifecycle
- first operator review flow
- operator queue
- provenance visibility for seeded agents
- result payload display
- queue filters for review state and status

## Newest Direction

- `Demand Board`: customer demand is visible to the builder side instead of staying trapped inside one catalog route
- `Builder Responses`: providers can respond to concrete demand with an offer, approach, and timeline
- `Bilingual UX`: Chinese is now the default public-facing experience, with English preserved for parity
- `Industry-first Visuals`: the GitHub and web surfaces now share the same scene language across manufacturing, quality, warehouse, and maintenance workflows

## Product Scenes

### Smart Manufacturing

![Factory Command](apps/web/public/media/factory-command-loop.svg)

### Industrial Quality

![Quality Vision](apps/web/public/media/quality-vision-loop.svg)

### Warehouse Operations

![Warehouse Orchestration](apps/web/public/media/warehouse-orchestration-loop.svg)

### Field Maintenance

![Maintenance Copilot](apps/web/public/media/maintenance-copilot-loop.svg)

## Commands

```bash
pnpm install
pnpm --filter @agora/api prisma:generate
pnpm --filter @agora/api prisma:push
pnpm dev
pnpm lint
pnpm typecheck
pnpm db:export
pnpm db:import /path/to/dump.sql
```

## Read-Only Preview Mode

For a safer demo-only preview, use:

```bash
AGORA_PREVIEW_MODE=readonly NEXT_PUBLIC_AGORA_PREVIEW_MODE=readonly pnpm dev
```

In this mode:

- browsing stays enabled
- write actions are blocked at the API layer
- the UI shows a read-only preview banner and disables operator write controls

## Preview Helpers

```bash
./scripts/start-preview.sh interactive
./scripts/start-preview.sh readonly YOUR_PASSWORD
./scripts/start-public-preview.sh [PASSWORD]
./scripts/check-public-preview.sh
./scripts/stop-public-preview.sh
./scripts/check-preview.sh
./scripts/stop-preview.sh
```

See:

- `docs/demo/local-preview.md`
- `docs/demo/public-demo-checklist.md`

## Local Database

- local PostgreSQL is the current development system of record
- API env file: `apps/api/.env`
- example env file: `apps/api/.env.example`

## License And Provenance

- This repository is licensed under `Apache-2.0`.
- Any imported third-party code or assets must have a clear compatible license and preserved attribution.
- No code from "no license" repositories should be copied into this project.
- See `THIRD_PARTY_CODE_POLICY.md`.
