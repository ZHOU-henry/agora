#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$ROOT_DIR/apps/api/.env"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
OUTPUT_PATH="${1:-$ROOT_DIR/infra/agora_dev_${TIMESTAMP}.sql}"

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  echo "Usage: ./scripts/export-db.sh [OUTPUT_SQL_PATH]"
  exit 0
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE"
  exit 1
fi

source "$ENV_FILE"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is not set."
  exit 1
fi

DB_URL_NO_SCHEMA="${DATABASE_URL%%\?schema=*}"
mkdir -p "$(dirname "$OUTPUT_PATH")"

pg_dump "$DB_URL_NO_SCHEMA" > "$OUTPUT_PATH"

echo "Exported Agora database to $OUTPUT_PATH"
