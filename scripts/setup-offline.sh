#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p public/vendor
curl -L --fail --retry 3 -o public/vendor/reveal.css "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/reveal.css"
curl -L --fail --retry 3 -o public/vendor/reveal.js "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/reveal.js"
curl -L --fail --retry 3 -o public/vendor/notes.js "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/notes.js"
curl -L --fail --retry 3 -o public/vendor/zoom.js "https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/zoom.js"
curl -L --fail --retry 3 -o public/vendor/three.module.min.js "https://cdn.jsdelivr.net/npm/three@0.184.0/build/three.module.min.js"
echo "Offline libraries installed successfully."
