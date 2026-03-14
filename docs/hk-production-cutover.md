# Hong Kong Production Cutover

## Goal

Prepare Agora for a move from the temporary local demo stack to:

- `.com` domain
- Cloudflare DNS / proxy
- Hong Kong cloud server
- production-mode runtime

This document stops before the final irreversible switch.

## Architecture

- domain: `yourdomain.com`
- public hostname: `agora.yourdomain.com`
- DNS / TLS / edge proxy: Cloudflare
- origin: Hong Kong cloud server
- web app: Next.js production server
- API: Fastify production server
- database: PostgreSQL on the same server in the first stage
- uploads: local disk first, R2 later

## Pre-Cutover Checklist

### 1. Domain

- buy the `.com`
- move authoritative DNS to Cloudflare
- keep a dedicated subdomain for Agora

### 2. Server

- provision the Hong Kong server
- create deploy user
- install:
  - Node.js
  - pnpm
  - PostgreSQL
  - nginx
- clone the repo

### 3. Build And Runtime

- run `./scripts/build-production.sh`
- use `./scripts/start-production-stack.sh`
- verify with `./scripts/check-production-stack.sh`

### 4. Services

- adapt:
  - `infra/systemd/agora-api.service.example`
  - `infra/systemd/agora-web.service.example`
- install and enable both systemd units

### 5. Reverse Proxy

- adapt `infra/nginx/agora.conf.example`
- point nginx at local web `:3000`

### 6. Data Safety

- export local database before final migration
- restore into server PostgreSQL
- verify file-upload storage path exists:
  - `storage/uploads/`

### 7. Search And Access Hygiene

- keep `.com`
- avoid blocked third-party frontend resources
- keep public pages indexable only when you are ready
- keep preview / demo hosts on `noindex` if needed

## Smoke Test Before Final Switch

Use a temporary server-side port / host test before pointing the public domain:

1. `./scripts/build-production.sh`
2. `AGORA_WEB_PORT=3200 AGORA_API_PORT=3201 ./scripts/start-production-stack.sh`
3. `AGORA_WEB_PORT=3200 AGORA_API_PORT=3201 ./scripts/check-production-stack.sh`
4. open:
   - `http://server-ip:3200`
   - `http://server-ip:3200/access`
5. verify:
   - login
   - role switching
   - demand publish
   - builder response
   - file upload

## Stop Point

Stop here before:

- changing DNS records to the new origin
- retiring the current local public demo
- making the new domain the public primary
