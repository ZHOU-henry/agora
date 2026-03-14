#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
STATE_DIR="${XDG_STATE_HOME:-$HOME/.local/state}/agora-public-preview"
BIN_DIR="$HOME/.local/bin"
PASSWORD_FILE="$STATE_DIR/password"
URL_FILE="$STATE_DIR/public-url"
LOG_FILE="$STATE_DIR/cloudflared.log"
PID_FILE="$STATE_DIR/cloudflared.pid"
PASSWORD="${1:-}"

usage() {
  cat <<'EOF'
Usage:
  ./scripts/start-public-preview.sh [PASSWORD]

Starts Agora in read-only mode with a password gate, then exposes the web app
through a temporary HTTPS Cloudflare Quick Tunnel.

If PASSWORD is omitted:
  - reuse the last saved password if present
  - otherwise generate a strong random one
EOF
}

if [[ "$PASSWORD" == "-h" || "$PASSWORD" == "--help" ]]; then
  usage
  exit 0
fi

mkdir -p "$STATE_DIR" "$BIN_DIR"

ensure_cloudflared() {
  if command -v cloudflared >/dev/null 2>&1; then
    return 0
  fi

  local arch
  case "$(uname -m)" in
    x86_64)
      arch="amd64"
      ;;
    aarch64|arm64)
      arch="arm64"
      ;;
    *)
      echo "Unsupported machine architecture for automatic cloudflared install: $(uname -m)"
      exit 1
      ;;
  esac

  local download_url="https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-${arch}"
  local temp_path="$STATE_DIR/cloudflared.download"

  echo "Installing cloudflared from $download_url"
  curl -fsSL "$download_url" -o "$temp_path"
  mv "$temp_path" "$BIN_DIR/cloudflared"
  chmod 0755 "$BIN_DIR/cloudflared"
}

generate_password() {
  openssl rand -base64 24 | tr -d '\n' | tr '/+=' 'xyz' | cut -c1-24
}

if [[ -z "$PASSWORD" ]]; then
  if [[ -f "$PASSWORD_FILE" ]]; then
    PASSWORD="$(cat "$PASSWORD_FILE")"
  else
    PASSWORD="$(generate_password)"
  fi
fi

printf '%s\n' "$PASSWORD" > "$PASSWORD_FILE"
chmod 0600 "$PASSWORD_FILE"

ensure_cloudflared
export PATH="$BIN_DIR:$PATH"

if [[ -f "$PID_FILE" ]]; then
  OLD_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "$OLD_PID" ]] && kill -0 "$OLD_PID" 2>/dev/null; then
    echo "A public preview tunnel is already running with PID $OLD_PID"
    echo "Stop it first with ./scripts/stop-public-preview.sh"
    exit 1
  fi
  rm -f "$PID_FILE"
fi

rm -f "$URL_FILE" "$LOG_FILE"

"$SCRIPT_DIR/stop-preview.sh" >/dev/null 2>&1 || true
"$SCRIPT_DIR/start-preview.sh" readonly "$PASSWORD"

for _ in $(seq 1 45); do
  if "$SCRIPT_DIR/check-preview.sh" >/dev/null 2>&1; then
    if curl -fsS http://127.0.0.1:3001/runtime 2>/dev/null | grep -q '"previewReadOnly":true'; then
      break
    fi
  fi
  sleep 2
done

if ! curl -fsS http://127.0.0.1:3001/runtime 2>/dev/null | grep -q '"previewReadOnly":true'; then
  echo "Readonly Agora preview did not become healthy in time."
  exit 1
fi

nohup cloudflared tunnel --url http://127.0.0.1:3000 --no-autoupdate > "$LOG_FILE" 2>&1 < /dev/null &
TUNNEL_PID=$!
printf '%s\n' "$TUNNEL_PID" > "$PID_FILE"

PUBLIC_URL=""
for _ in $(seq 1 60); do
  if ! kill -0 "$TUNNEL_PID" 2>/dev/null; then
    echo "cloudflared exited unexpectedly. Log:"
    sed -n '1,200p' "$LOG_FILE" 2>/dev/null || true
    exit 1
  fi

  PUBLIC_URL="$(grep -oE 'https://[-a-z0-9]+\.trycloudflare\.com' "$LOG_FILE" | head -n 1 || true)"
  if [[ -n "$PUBLIC_URL" ]]; then
    break
  fi
  sleep 1
done

if [[ -z "$PUBLIC_URL" ]]; then
  echo "Could not discover the public tunnel URL."
  sed -n '1,200p' "$LOG_FILE" 2>/dev/null || true
  exit 1
fi

printf '%s\n' "$PUBLIC_URL" > "$URL_FILE"
chmod 0600 "$URL_FILE"

echo "Agora public preview is live."
echo "URL: $PUBLIC_URL"
echo "Password: $PASSWORD"
echo "Tunnel log: $LOG_FILE"
echo "State dir: $STATE_DIR"
