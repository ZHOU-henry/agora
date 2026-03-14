# Public Demo Checklist

## Before Exposing Agora Outside The Machine

1. Use `readonly` preview mode.
2. Set a password.
3. Verify `./scripts/check-preview.sh` returns:
   - `web=ok`
   - `api=ok`
   - `previewReadOnly=true`
4. Confirm the UI can browse but cannot write.
5. Confirm write attempts return a read-only error.

## Current Recommendation

The safest first remote demo pattern is:

- password-gated site access
- read-only preview mode
- only after that, expose the site through a controlled tunnel or private network route

Current helper flow:

```bash
./scripts/start-public-preview.sh [PASSWORD]
./scripts/check-public-preview.sh
```

## What Not To Do

- do not expose the interactive mode publicly
- do not expose the local database publicly
- do not assume “no one will click the button” is a security boundary
