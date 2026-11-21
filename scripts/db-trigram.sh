#!/usr/bin/env bash
# Add pg_trgm GIN indexes for ILIKE '%search%' columns.
#
# B-tree indexes cannot serve leading-wildcard ILIKE queries. Trigram GIN
# indexes make them fast once tables grow past a few thousand rows.
#
# Usage: DATABASE_URL=... bash scripts/add-trigram-indexes.sh [--apply]

set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

APPLY=0
[ "${1:-}" = "--apply" ] && APPLY=1

# table|column pairs used in ILIKE searches
PAIRS=(
  "teachers|first_name"
  "teachers|last_name"
  "teachers|email"
  "students|first_name"
  "students|last_name"
  "students|admission_number"
  "patients|first_name"
  "patients|last_name"
  "patients|mrn"
  "patients|phone"
  "test_catalog|name"
  "test_catalog|code"
  "contacts|first_name"
  "contacts|last_name"
  "contacts|email"
  "leads|first_name"
  "leads|last_name"
  "leads|email"
  "deals|name"
)

SQL="CREATE EXTENSION IF NOT EXISTS pg_trgm;"
for pair in "${PAIRS[@]}"; do
  tbl="${pair%%|*}"
  col="${pair##*|}"
  SQL+=$'\n'"CREATE INDEX IF NOT EXISTS \"idx_trgm_${tbl}_${col}\" ON \"${tbl}\" USING gin (\"${col}\" gin_trgm_ops);"
done

echo "$SQL"

if [ "$APPLY" = "1" ]; then
  echo ""
  echo "Applying (skipping tables that don't exist)…"
  while IFS= read -r stmt; do
    [ -z "$stmt" ] && continue
    psql "$DATABASE_URL" -v ON_ERROR_STOP=0 -c "$stmt" >/dev/null 2>&1 || true
  done <<< "$SQL"
  echo "Done."
fi
