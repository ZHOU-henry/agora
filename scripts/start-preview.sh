#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
MODE="${1:-readonly}"
PASSWORD="${2:-}"
PID_FILE="$ROOT_DIR/.agora-preview.pid"
LOG_FILE="${TMPDIR:-/tmp}/agora-preview.log"

get_lan_ip() {
  python3 - <<'PY'
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
try:
    s.connect(("8.8.8.8", 80))
    print(s.getsockname()[0])
except Exception:
    print("")
finally:
    s.close()
PY
}

if [[ "$MODE" != "readonly" && "$MODE" != "interactive" ]]; then
  echo "Usage: ./scripts/start-preview.sh [readonly|interactive] [password]"
  exit 1
fi

if [[ "$MODE" == "readonly" && -z "$PASSWORD" ]]; then
  echo "Readonly preview requires a password argument."
  exit 1
fi

if [[ -f "$PID_FILE" ]]; then
  OLD_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${OLD_PID}" ]] && kill -0 "$OLD_PID" 2>/dev/null; then
    echo "Preview already running with PID $OLD_PID"
    exit 1
  fi
  rm -f "$PID_FILE"
fi

if [[ "$MODE" == "readonly" ]]; then
  export AGORA_PREVIEW_MODE=readonly
  export NEXT_PUBLIC_AGORA_PREVIEW_MODE=readonly
  export AGORA_ACCESS_PASSWORD="$PASSWORD"
else
  unset AGORA_PREVIEW_MODE || true
  unset NEXT_PUBLIC_AGORA_PREVIEW_MODE || true
  if [[ -n "$PASSWORD" ]]; then
    export AGORA_ACCESS_PASSWORD="$PASSWORD"
  else
    unset AGORA_ACCESS_PASSWORD || true
  fi
fi

cd "$ROOT_DIR"
if command -v setsid >/dev/null 2>&1; then
  nohup setsid pnpm dev > "$LOG_FILE" 2>&1 < /dev/null &
else
  nohup pnpm dev > "$LOG_FILE" 2>&1 < /dev/null &
fi
PREVIEW_PID=$!
echo "$PREVIEW_PID" > "$PID_FILE"

echo "Agora preview started."
echo "Mode: $MODE"
echo "PID: $PREVIEW_PID"
echo "Log: $LOG_FILE"
echo "Web: http://localhost:3000"
LAN_IP="$(get_lan_ip)"
if [[ -n "$LAN_IP" ]]; then
  echo "LAN: http://$LAN_IP:3000/access"
fi
echo "Queue: http://localhost:3000/queue"
