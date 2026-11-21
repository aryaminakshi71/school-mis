#!/usr/bin/env bash
# Generate and apply missing indexes for a Postgres database.
#
# Adds indexes for:
#   - every foreign key column without an index
#   - every organization_id column without an index
#   - created_at on tables that have it (for ORDER BY ... DESC)
#
# Usage: DATABASE_URL=... bash scripts/add-missing-indexes.sh [--apply]
#
# Without --apply it prints the SQL only.

set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

APPLY=0
[ "${1:-}" = "--apply" ] && APPLY=1

SQL=$(psql "$DATABASE_URL" -t -A -F'|' -c "
WITH fk AS (
  SELECT c.conrelid::regclass::text AS tbl, a.attname AS col
  FROM pg_constraint c
  JOIN pg_attribute a ON a.attrelid=c.conrelid AND a.attnum=ANY(c.conkey)
  WHERE c.contype='f'
  AND c.connamespace = 'public'::regnamespace
  AND NOT EXISTS (
    SELECT 1 FROM pg_index i
    WHERE i.indrelid=c.conrelid AND a.attnum=ANY(i.indkey)
  )
),
org AS (
  SELECT c.table_name AS tbl, 'organization_id' AS col
  FROM information_schema.columns c
  WHERE c.table_schema='public' AND c.column_name='organization_id'
  AND NOT EXISTS (
    SELECT 1 FROM pg_indexes i
    WHERE i.schemaname='public' AND i.tablename=c.table_name
    AND i.indexdef ILIKE '%organization_id%'
  )
),
created AS (
  SELECT c.table_name AS tbl, 'created_at' AS col
  FROM information_schema.columns c
  WHERE c.table_schema='public' AND c.column_name='created_at'
  AND NOT EXISTS (
    SELECT 1 FROM pg_indexes i
    WHERE i.schemaname='public' AND i.tablename=c.table_name
    AND i.indexdef ILIKE '%created_at%'
  )
)
SELECT tbl, col FROM fk
UNION
SELECT tbl, col FROM org
UNION
SELECT tbl, col FROM created
ORDER BY 1,2;
")

if [ -z "$SQL" ]; then
  echo "No missing indexes found."
  exit 0
fi

echo "-- Generated $(echo "$SQL" | wc -l | tr -d ' ') indexes"
echo "BEGIN;"
while IFS='|' read -r tbl col; do
  [ -z "$tbl" ] && continue
  # strip schema prefix and quotes for the index name
  clean_tbl=$(echo "$tbl" | sed 's/^[a-z_]*\.//; s/"//g')
  idx="idx_${clean_tbl}_${col}"
  echo "CREATE INDEX IF NOT EXISTS \"$idx\" ON \"$clean_tbl\" (\"$col\");"
done <<< "$SQL"
echo "COMMIT;"

if [ "$APPLY" = "1" ]; then
  echo ""
  echo "Applying…"
  {
    echo "BEGIN;"
    while IFS='|' read -r tbl col; do
      [ -z "$tbl" ] && continue
      clean_tbl=$(echo "$tbl" | sed 's/^[a-z_]*\.//; s/"//g')
      idx="idx_${clean_tbl}_${col}"
      echo "CREATE INDEX IF NOT EXISTS \"$idx\" ON \"$clean_tbl\" (\"$col\");"
    done <<< "$SQL"
    echo "COMMIT;"
  } | psql "$DATABASE_URL" -v ON_ERROR_STOP=1
  echo "Done."
fi
