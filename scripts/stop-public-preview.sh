#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/agora-public-preview"
PID_FILE="$STATE_DIR/cloudflared.pid"
URL_FILE="$STATE_DIR/public-url"

if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${PID:-}" ]] && kill -0 "$PID" 2>/dev/null; then
    kill "$PID" >/dev/null 2>&1 || true
    sleep 1
    kill -0 "$PID" >/dev/null 2>&1 && kill -9 "$PID" >/dev/null 2>&1 || true
  fi
  rm -f "$PID_FILE"
fi

rm -f "$URL_FILE"
"$SCRIPT_DIR/stop-preview.sh"

echo "Agora public preview stopped."
