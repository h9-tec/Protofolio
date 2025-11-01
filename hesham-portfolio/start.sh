#!/usr/bin/env bash
set -euo pipefail

# Allow running from mono-repo root where app lives in ./hesham-portfolio
if [ -d "hesham-portfolio" ] && [ -f "hesham-portfolio/package.json" ]; then
  cd hesham-portfolio
fi

# Ensure pnpm via corepack (falls back to npm if needed)
if command -v pnpm >/dev/null 2>&1; then
  PM="pnpm"
else
  if command -v corepack >/dev/null 2>&1; then
    corepack enable >/dev/null 2>&1 || true
    corepack prepare pnpm@10.4.1 --activate >/dev/null 2>&1 || true
  fi
  if command -v pnpm >/dev/null 2>&1; then
    PM="pnpm"
  else
    PM="npm"
  fi
fi

echo "Using package manager: ${PM}"

# Install dependencies (prefer frozen lock if pnpm)
if [ "${PM}" = "pnpm" ]; then
  pnpm install --frozen-lockfile
else
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi
fi

# Build client and server
if [ "${PM}" = "pnpm" ]; then
  pnpm run build
else
  npm run build
fi

# Start production server
if [ "${PM}" = "pnpm" ]; then
  exec pnpm run start
else
  exec npm run start
fi


