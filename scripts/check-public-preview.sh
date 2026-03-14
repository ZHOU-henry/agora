#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/agora-public-preview"
URL_FILE="$STATE_DIR/public-url"
PID_FILE="$STATE_DIR/cloudflared.pid"
PASSWORD_FILE="$STATE_DIR/password"
PUBLIC_STATUS=1
TUNNEL_STATUS=1
LOCAL_STATUS=1

if "$SCRIPT_DIR/check-preview.sh"; then
  LOCAL_STATUS=0
fi

if [[ -f "$PID_FILE" ]]; then
  TUNNEL_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${TUNNEL_PID:-}" ]] && kill -0 "$TUNNEL_PID" 2>/dev/null; then
    echo "tunnel=ok (pid $TUNNEL_PID)"
    TUNNEL_STATUS=0
  else
    echo "tunnel=down"
  fi
else
  echo "tunnel=missing"
fi

if [[ -f "$URL_FILE" ]]; then
  PUBLIC_URL="$(cat "$URL_FILE")"
  echo "public_url=$PUBLIC_URL"
  STATUS_CODE="$(curl -sS -o /dev/null -w '%{http_code}' "$PUBLIC_URL/access" 2>/dev/null || true)"
  if [[ "$STATUS_CODE" =~ ^[23][0-9][0-9]$ ]]; then
    echo "public_access=ok ($STATUS_CODE)"
    PUBLIC_STATUS=0
  else
    echo "public_access=error (${STATUS_CODE:-down})"
  fi
else
  echo "public_url=missing"
fi

if [[ -f "$PASSWORD_FILE" ]]; then
  echo "password_saved=yes"
else
  echo "password_saved=no"
fi

if (( LOCAL_STATUS == 0 && TUNNEL_STATUS == 0 && PUBLIC_STATUS == 0 )); then
  exit 0
fi

exit 1
