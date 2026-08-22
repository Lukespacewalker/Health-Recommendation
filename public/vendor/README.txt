Place the pinned offline libraries in this folder:

- reveal.css
- reveal.js
- notes.js
- zoom.js
- three.module.min.js

Run `npm run offline:setup` on Windows or `bash scripts/setup-offline.sh` on macOS/Linux once to download them.
The deck first checks this folder, then falls back to the pinned CDN versions.
