# Public Tunnel Guide

## Goal

Expose the Agora web UI to people outside your local network without exposing the
database or enabling write actions.

## Current Public Modes

### Default safer mode

1. `readonly` preview mode
2. password gate at the web layer
3. temporary HTTPS tunnel to the web app only

### Optional interactive mode

For closer-to-real platform operation, you can also run:

- password-gated access
- full interactive writes after login
- automatic database export backup before startup

This is less safe than readonly mode, so use it only with trusted viewers.

## Start

```bash
./scripts/start-public-preview.sh
```

Optional:

```bash
./scripts/start-public-preview.sh YOUR_PASSWORD
./scripts/start-public-preview.sh interactive YOUR_PASSWORD
```

The script will:

- ensure Agora is running in the requested public mode
- keep access behind the password gate
- create a DB export backup before public interactive startup
- start a Cloudflare Quick Tunnel to `http://127.0.0.1:3000`
- print the public URL and the current password

## Check

```bash
./scripts/check-public-preview.sh
```

This verifies:

- local web health
- local API health
- current runtime mode
- tunnel process status
- public `/access` reachability

## Stop

```bash
./scripts/stop-public-preview.sh
```

This stops both the public tunnel and the local read-only preview that backs it.

## Safety Notes

- share the `URL` and `Password` directly with the people you trust
- use `interactive` mode only for trusted users because writes are live
- the tunnel points only to the web app, not to PostgreSQL
- Cloudflare Quick Tunnels are acceptable for temporary demos, not as a durable production ingress
- the protected public mode now adds `no-store` and `noindex` style headers to reduce indexing and caching risk
