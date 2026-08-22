# Health Recommendation

Interactive Thai health-check education deck by Suttisak Denduangchai. It uses Reveal.js, selective Three.js scenes, and client-side calculators. The content is educational and is not a diagnosis, treatment plan, or personal medical advice.

## Deploy to Cloudflare Workers

This repository uses [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/). `public/` is the only directory uploaded and served at Cloudflare's edge; no server-side Node runtime or legacy Workers Sites configuration is needed.

1. Install dependencies with `npm install`.
2. Sign in once, if needed: `npx wrangler login`.
3. Change `name` in `wrangler.jsonc` if you want a different Worker name.
4. Deploy with `npm run deploy`.

For local Cloudflare-compatible development, run `npm run dev`. The local static server is also available through `npm start` at `http://127.0.0.1:8765`.

## Repository layout

```text
public/                 Files uploaded to and served by Cloudflare
  index.html            Slide content and structure
  app.js                Navigation, calculators, and interactions
  three-scenes.js       Optional Three.js scenes
  fallback-reveal.js    Fallback presentation controller
  loader.js             Local/CDN/fallback library loader
  theme.css             Theme and responsive styles
  vendor/               Optional pinned libraries for offline use
scripts/                Local development and offline helper scripts
  serve.mjs             Dependency-free local static server
  setup-offline.*       Download optional local copies of third-party libraries
wrangler.jsonc          Cloudflare Worker deployment configuration
package.json            Development and deployment commands
```

## Offline libraries

The deck first checks `public/vendor/` and otherwise loads its pinned CDN versions. To bundle local copies for offline demonstrations:

- Windows: `npm run offline:setup`
- macOS/Linux: `bash scripts/setup-offline.sh`

Then use `?offline=1` to prevent CDN requests. Use `?fallback=1` to bypass Reveal.js and Three.js entirely. These optional libraries remain inside `public/`, so they are also included in a Cloudflare deployment once downloaded.

## Navigation and calculators

- `Space`, arrow keys: navigate
- `M`: table of contents
- `O` or `Esc`: overview
- `S`: speaker view
- `F`: fullscreen
- `E`: enable or disable animation / Three.js

The eGFR calculator applies the adult CKD-EPI creatinine equation (2021), while lipid ratios are provided for education only and do not replace clinical assessment or treatment targets.
