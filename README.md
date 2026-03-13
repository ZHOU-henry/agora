# Agora - AI Agent Platform

Open-source MVP for an AI Agent platform and operator workspace.

Chinese shorthand: `AI Agent 平台`

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

## Commands

```bash
pnpm install
pnpm --filter @agora/api prisma:generate
pnpm --filter @agora/api prisma:push
pnpm dev
pnpm lint
pnpm typecheck
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

## Local Database

- local PostgreSQL is the current development system of record
- API env file: `apps/api/.env`
- example env file: `apps/api/.env.example`

## License And Provenance

- This repository is licensed under `Apache-2.0`.
- Any imported third-party code or assets must have a clear compatible license and preserved attribution.
- No code from "no license" repositories should be copied into this project.
- See `THIRD_PARTY_CODE_POLICY.md`.
