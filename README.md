# Health Recommendation

Interactive Thai health-check education deck by Suttisak Denduangchai. It uses Reveal.js, selective Three.js scenes, and client-side calculators. The content is educational and is not a diagnosis, treatment plan, or personal medical advice.

## Health recommendation references

Thai health-check recommendation content is maintained separately from presentation rendering rules:

- `reference/คำแนะนำผลตรวจสุขภาพ_ภาษาไทย.md` is the **canonical clinical/content source**.
- `reference/PATIENT_OUTPUT_STYLE_TH.md` defines the **patient-facing output style**: concise Thai wording, minimal repetition of raw lab values, concrete food advice, specific exercise guidance, and practical follow-up wording.
- `AGENTS.md` instructs AI/Codex agents to use both files together and to let the canonical source override the style guide if there is any clinical conflict.

This separation keeps medical conditions and recommendation modules stable while allowing the final wording used in health-check reports to remain short and practical.

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
reference/              Canonical Thai recommendations and output-style guidance
  คำแนะนำผลตรวจสุขภาพ_ภาษาไทย.md  Canonical clinical/content source
  PATIENT_OUTPUT_STYLE_TH.md       Patient-facing rendering and wording rules
AGENTS.md               Instructions for AI/Codex use of recommendation sources
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

The default screen is **Clinic Mode**, a searchable consultation view with short patient-facing explanations, next steps, urgent warning signs, and a teach-back prompt. It does not request or store patient identifiers. Use `?clinic=kidney` (or another clinic topic key) to share a specific Clinic Mode topic.

Choose **เปิดเนื้อหาเต็ม 84 หน้า** to enter Learn Mode. Direct slide URLs such as `#/kidney-calculator` now open the requested slide without being reset to the cover. Use **โหมดตรวจ** in the slide toolbar to return to Clinic Mode.

- `Space`, arrow keys: navigate
- `M`: table of contents
- `O` or `Esc`: overview
- `S`: speaker view
- `F`: fullscreen
- `E`: enable or disable animation / Three.js
- `Light` / `Dark`: switch the presentation theme; the selected theme is remembered locally

The top navigation has two levels: chapter tabs on the first row and a contextual, horizontally scrollable topic row for jumping within the active chapter.

The eGFR calculator applies the adult CKD-EPI creatinine equation (2021), while lipid ratios are provided for education only and do not replace clinical assessment or treatment targets. Both calculators require explicit calculation and reject missing or out-of-range inputs instead of silently substituting values.
