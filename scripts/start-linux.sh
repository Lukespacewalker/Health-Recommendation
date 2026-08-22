#!/bin/bash
cd "$(dirname "$0")/.."
if command -v node >/dev/null 2>&1; then
  node scripts/serve.mjs &
else
  python3 -m http.server 8765 --directory public &
fi
PID=$!
sleep 1
xdg-open "http://127.0.0.1:8765" >/dev/null 2>&1 || true
wait $PID
