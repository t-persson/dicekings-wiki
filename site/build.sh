#!/usr/bin/env bash
set -euo pipefail

wiki="$(cd "${WIKI_REPO:-../wiki}" && pwd)"
temp="$(mktemp -d)"
trap 'rm -rf -- "$temp"' EXIT

cp "$wiki/quartz.config.ts" quartz.config.ts
cp "$wiki/site/quartz.layout.ts" quartz.layout.ts
cp "$wiki/site/SessionSelector.tsx" quartz/components/SessionSelector.tsx
cp "$wiki/site/sessionSelector.inline.ts" quartz/components/scripts/sessionSelector.inline.ts

tags="$(git -C "$wiki" tag --list 'Session-*')"
mapfile -t sessions < <(printf '%s\n' "$tags" | grep -E '^Session-[0-9]+$' | sort -V || true)
export WIKI_SESSIONS
WIKI_SESSIONS="$(printf '%s\n' "${sessions[@]}" | node -e 'let s=""; process.stdin.on("data", c => s += c); process.stdin.on("end", () => console.log(JSON.stringify(s.trim() ? s.trim().split("\n") : [])))')"

mkdir "$temp/current"
cp "$wiki/index.md" "$temp/current/index.md"
cp -R "$wiki/05-Player-Facing" "$temp/current/"
WIKI_SESSION="" npx quartz build -d "$temp/current" -o public

for session in "${sessions[@]}"; do
  mkdir "$temp/$session"
  git -C "$wiki" archive "$session" index.md 05-Player-Facing |
    tar -x -C "$temp/$session"
  WIKI_SESSION="$session" npx quartz build -d "$temp/$session" -o "public/sessions/$session"
done
