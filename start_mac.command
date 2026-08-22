#!/bin/bash
cd "$(dirname "$0")"
if command -v node >/dev/null 2>&1; then
  node server.mjs &
else
  python3 -m http.server 8765 &
fi
PID=$!
sleep 1
open "http://127.0.0.1:8765"
wait $PID
