#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$ROOT_DIR/apps/api/.env"
INPUT_PATH="${1:-}"

if [[ "$INPUT_PATH" == "-h" || "$INPUT_PATH" == "--help" ]]; then
  echo "Usage: ./scripts/import-db.sh PATH_TO_SQL_DUMP"
  exit 0
fi

if [[ -z "$INPUT_PATH" ]]; then
  echo "Usage: ./scripts/import-db.sh PATH_TO_SQL_DUMP"
  exit 1
fi

if [[ ! -f "$INPUT_PATH" ]]; then
  echo "SQL dump not found: $INPUT_PATH"
  exit 1
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

psql "$DB_URL_NO_SCHEMA" < "$INPUT_PATH"

echo "Imported Agora database from $INPUT_PATH"
