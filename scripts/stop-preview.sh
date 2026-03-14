#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
PID_FILE="$ROOT_DIR/.agora-preview.pid"

if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ -n "${PID}" ]] && kill -0 "$PID" 2>/dev/null; then
    PGID="$(ps -o pgid= -p "$PID" 2>/dev/null | tr -d ' ' || true)"
    if [[ -n "$PGID" ]]; then
      kill -- "-$PGID" >/dev/null 2>&1 || true
      sleep 1
      kill -0 "$PID" >/dev/null 2>&1 && kill -9 -- "-$PGID" >/dev/null 2>&1 || true
    else
      kill "$PID" >/dev/null 2>&1 || true
    fi
  fi
  rm -f "$PID_FILE"
fi

echo "Agora preview stopped."
