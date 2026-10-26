#!/usr/bin/env bash
# Copy the shared engine, fonts and sound effects into every video project.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
for d in "$ROOT"/videos/*/; do
  mkdir -p "$d/assets"
  rm -rf "$d/assets/lib" "$d/assets/fonts" "$d/assets/sfx"
  cp -r "$ROOT/shared/lib" "$ROOT/shared/fonts" "$ROOT/shared/sfx" "$d/assets/"
done
echo "synced shared/ into $(ls -d "$ROOT"/videos/*/ | wc -l) project(s)"
