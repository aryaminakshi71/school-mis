#!/usr/bin/env bash
# Add updated_at triggers to every table that has an updated_at column.
#
# Keeps updated_at accurate without relying on every write path to set it.
#
# Usage: DATABASE_URL=... bash scripts/add-updated-at-triggers.sh [--apply]

set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

APPLY=0
[ "${1:-}" = "--apply" ] && APPLY=1

SQL=$(psql "$DATABASE_URL" -t -A -c "
SELECT table_name
FROM information_schema.columns
WHERE table_schema='public' AND column_name='updated_at'
ORDER BY table_name;
")

if [ -z "$SQL" ]; then
  echo "No tables with updated_at found."
  exit 0
fi

OUT="CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS \$\$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql;"

while IFS= read -r tbl; do
  [ -z "$tbl" ] && continue
  OUT+=$'\n'"DROP TRIGGER IF EXISTS trg_${tbl}_updated_at ON \"${tbl}\";"
  OUT+=$'\n'"CREATE TRIGGER trg_${tbl}_updated_at BEFORE UPDATE ON \"${tbl}\" FOR EACH ROW EXECUTE FUNCTION set_updated_at();"
done <<< "$SQL"

echo "$OUT"

if [ "$APPLY" = "1" ]; then
  echo ""
  echo "Applying…"
  echo "$OUT" | psql "$DATABASE_URL" -v ON_ERROR_STOP=1 >/dev/null
  echo "Done."
fi
