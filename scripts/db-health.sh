#!/usr/bin/env bash
# Database health report.
#
# Usage: DATABASE_URL=... bash scripts/db-health.sh
#
# Reports: table sizes, unused indexes, cache hit ratio, connection count,
# and the slowest queries when pg_stat_statements is available.

set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required" >&2
  exit 1
fi

q() { psql "$DATABASE_URL" -P pager=off -c "$1"; }

echo "=== Database size ==="
q "SELECT pg_size_pretty(pg_database_size(current_database())) AS size;"

echo ""
echo "=== Top 10 tables by size ==="
q "SELECT relname AS table,
          pg_size_pretty(pg_total_relation_size(relid)) AS total,
          n_live_tup AS rows
   FROM pg_stat_user_tables
   ORDER BY pg_total_relation_size(relid) DESC
   LIMIT 10;"

echo ""
echo "=== Cache hit ratio (should be > 99%) ==="
q "SELECT
     round(sum(blks_hit) * 100.0 / nullif(sum(blks_hit + blks_read), 0), 2) AS cache_hit_pct
   FROM pg_stat_database
   WHERE datname = current_database();"

echo ""
echo "=== Connections ==="
q "SELECT count(*) AS total,
          count(*) FILTER (WHERE state = 'active') AS active,
          count(*) FILTER (WHERE state = 'idle') AS idle
   FROM pg_stat_activity
   WHERE datname = current_database();"

echo ""
echo "=== Unused indexes (0 scans since stats reset) ==="
q "SELECT relname AS table, indexrelname AS index, idx_scan
   FROM pg_stat_user_indexes
   WHERE idx_scan = 0
   ORDER BY pg_relation_size(indexrelid) DESC
   LIMIT 15;"

echo ""
echo "=== Slowest queries (pg_stat_statements) ==="
if psql "$DATABASE_URL" -t -c "SELECT 1 FROM pg_extension WHERE extname='pg_stat_statements';" 2>/dev/null | grep -q 1; then
  q "SELECT round(mean_exec_time::numeric, 2) AS avg_ms,
            calls,
            left(query, 90) AS query
     FROM pg_stat_statements
     WHERE query NOT ILIKE '%pg_stat_statements%'
     ORDER BY mean_exec_time DESC
     LIMIT 10;"
else
  echo "pg_stat_statements is not installed."
  echo "Enable it in the Neon dashboard (or shared_preload_libraries) to see query stats."
fi
