# Public Tunnel Guide

## Goal

Expose the Agora web UI to people outside your local network without exposing the
database or enabling write actions.

## Current Safe Demo Pattern

Use all three layers together:

1. `readonly` preview mode
2. password gate at the web layer
3. temporary HTTPS tunnel to the web app only

## Start

```bash
./scripts/start-public-preview.sh
```

Optional:

```bash
./scripts/start-public-preview.sh YOUR_PASSWORD
```

The script will:

- ensure Agora is running in read-only mode
- keep write actions blocked in both UI and API
- start a Cloudflare Quick Tunnel to `http://127.0.0.1:3000`
- print the public URL and the current password

## Check

```bash
./scripts/check-public-preview.sh
```

This verifies:

- local web health
- local API health
- readonly runtime mode
- tunnel process status
- public `/access` reachability

## Stop

```bash
./scripts/stop-public-preview.sh
```

This stops both the public tunnel and the local read-only preview that backs it.

## Safety Notes

- share the `URL` and `Password` directly with the people you trust
- do not expose interactive preview mode publicly
- the tunnel points only to the web app, not to PostgreSQL
- Cloudflare Quick Tunnels are acceptable for temporary demos, not as a durable production ingress
