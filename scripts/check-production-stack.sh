#!/usr/bin/env bash
set -euo pipefail

WEB_PORT="${AGORA_WEB_PORT:-3000}"
API_PORT="${AGORA_API_PORT:-3001}"

check_endpoint() {
  local url="$1"
  local label="$2"
  local status_code

  if status_code="$(curl -sS -o /dev/null -w '%{http_code}' "$url" 2>/dev/null)"; then
    if [[ "$status_code" =~ ^[23][0-9][0-9]$ ]]; then
      echo "${label}=ok (${status_code})"
      return 0
    fi
    echo "${label}=error (${status_code})"
    return 1
  fi

  echo "${label}=down"
  return 1
}

WEB_OK=0
API_OK=0

WEB_STATUS="$(check_endpoint "http://127.0.0.1:${WEB_PORT}" "web")" || WEB_OK=$?
API_STATUS="$(check_endpoint "http://127.0.0.1:${API_PORT}/health" "api")" || API_OK=$?
RUNTIME="$(curl -fsS "http://127.0.0.1:${API_PORT}/runtime" 2>/dev/null || echo '{}')"

echo "$WEB_STATUS"
echo "$API_STATUS"
echo "runtime=$RUNTIME"

if (( WEB_OK == 0 && API_OK == 0 )); then
  exit 0
fi

exit 1
