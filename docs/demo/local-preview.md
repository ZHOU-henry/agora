# Local Preview Guide

## Goal

Start and stop Agora quickly in either interactive mode or safer read-only preview mode.

## Start Interactive Preview

```bash
./scripts/start-preview.sh interactive
```

Use this when you want to test write actions locally.

## Start Read-Only Preview

```bash
./scripts/start-preview.sh readonly YOUR_PASSWORD
```

Use this when you want a safer demo:

- the site is password-gated
- the UI disables write actions
- the API rejects write requests
- after startup, the script also prints a LAN URL such as `http://192.168.x.x:3000/access` for phone testing on the same Wi-Fi

## Stop Preview

```bash
./scripts/stop-preview.sh
```

## Check Status

```bash
./scripts/check-preview.sh
```

## Phone Access

Use the LAN URL printed by `start-preview.sh`, not `localhost`.

Example:

```bash
http://192.168.x.x:3000/access
```

Requirements:

- phone and computer must be on the same local network
- the access page is the correct entry when password protection is enabled
- if the phone still cannot connect while the computer can, the likely cause is network isolation on the router / Wi-Fi rather than Agora itself
