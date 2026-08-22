# Third-party notices

This project is designed for:

- **Reveal.js 6.0.1**, MIT License, Hakim El Hattab and contributors
- **Three.js r184 / npm 0.184.0**, MIT License, Three.js authors

Pinned copies of these libraries are kept in `public/vendor/` and are deployed with the deck. `public/loader.js` loads those local copies first, then falls back to the matching jsDelivr versions only if a local file is unavailable. The setup scripts refresh the local copies for offline use.
