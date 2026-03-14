#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
STATE_DIR="$ROOT_DIR/.agora-production"
WEB_PID_FILE="$STATE_DIR/web.pid"
API_PID_FILE="$STATE_DIR/api.pid"
WEB_LOG_FILE="${TMPDIR:-/tmp}/agora-production-web.log"
API_LOG_FILE="${TMPDIR:-/tmp}/agora-production-api.log"

WEB_PORT="${AGORA_WEB_PORT:-3000}"
API_PORT="${AGORA_API_PORT:-3001}"
ACCESS_PASSWORD="${AGORA_ACCESS_PASSWORD:-}"
PREVIEW_MODE="${AGORA_PREVIEW_MODE:-}"
NEXT_PREVIEW_MODE="${NEXT_PUBLIC_AGORA_PREVIEW_MODE:-}"
INTERNAL_API_BASE_URL="${AGORA_INTERNAL_API_BASE_URL:-http://127.0.0.1:$API_PORT}"

mkdir -p "$STATE_DIR" "$ROOT_DIR/storage/uploads"

if [[ -f "$WEB_PID_FILE" ]] || [[ -f "$API_PID_FILE" ]]; then
  echo "Production stack state files already exist. Stop it first with ./scripts/stop-production-stack.sh"
  exit 1
fi

cd "$ROOT_DIR/apps/api"
nohup env \
  PORT="$API_PORT" \
  AGORA_PREVIEW_MODE="$PREVIEW_MODE" \
  NEXT_PUBLIC_AGORA_PREVIEW_MODE="$NEXT_PREVIEW_MODE" \
  AGORA_ACCESS_PASSWORD="$ACCESS_PASSWORD" \
  node dist/index.js > "$API_LOG_FILE" 2>&1 < /dev/null &
API_PID=$!
printf '%s\n' "$API_PID" > "$API_PID_FILE"

cd "$ROOT_DIR/apps/web"
nohup env \
  PORT="$WEB_PORT" \
  HOSTNAME="0.0.0.0" \
  AGORA_INTERNAL_API_BASE_URL="$INTERNAL_API_BASE_URL" \
  AGORA_ACCESS_PASSWORD="$ACCESS_PASSWORD" \
  AGORA_PREVIEW_MODE="$PREVIEW_MODE" \
  NEXT_PUBLIC_AGORA_PREVIEW_MODE="$NEXT_PREVIEW_MODE" \
  NEXT_TELEMETRY_DISABLED="1" \
  pnpm exec next start --hostname 0.0.0.0 --port "$WEB_PORT" > "$WEB_LOG_FILE" 2>&1 < /dev/null &
WEB_PID=$!
printf '%s\n' "$WEB_PID" > "$WEB_PID_FILE"

echo "Agora production stack started."
echo "Web: http://127.0.0.1:$WEB_PORT"
echo "API: http://127.0.0.1:$API_PORT"
echo "Web log: $WEB_LOG_FILE"
echo "API log: $API_LOG_FILE"
