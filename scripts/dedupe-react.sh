#!/usr/bin/env bash
# Ensure the web app uses the same React instance as the rest of the monorepo.
#
# Bun's isolated install can place a second copy of react/react-dom under
# apps/web/node_modules, which breaks hooks at SSR time
# ("Cannot read properties of null (reading 'useContext')").
# Re-point them at the hoisted root copies after every install.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WEB="$ROOT/apps/web/node_modules"

if [ -d "$ROOT/node_modules/react" ] && [ -d "$WEB" ]; then
  rm -rf "$WEB/react" "$WEB/react-dom"
  ln -s ../../../node_modules/react "$WEB/react"
  ln -s ../../../node_modules/react-dom "$WEB/react-dom"
  echo "[dedupe-react] linked apps/web react + react-dom to root copies"
fi
