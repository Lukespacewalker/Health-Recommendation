(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const forceFallback = params.has('fallback');
  const forceOffline = params.has('offline');
  const CDN = {
    revealCss: 'https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/reveal.css',
    revealJs: 'https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/reveal.js',
    notes: 'https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/notes.js',
    zoom: 'https://cdn.jsdelivr.net/npm/reveal.js@6.0.1/dist/plugin/zoom.js'
  };

  const local = {
    revealCss: 'vendor/reveal.css',
    revealJs: 'vendor/reveal.js',
    notes: 'vendor/notes.js',
    zoom: 'vendor/zoom.js'
  };

  function loadStyle(href, timeout = 4500) {
    return new Promise((resolve) => {
      const link = document.createElement('link');
      let settled = false;
      const done = (ok) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (!ok) link.remove();
        resolve(ok);
      };
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => done(true);
      link.onerror = () => done(false);
      document.head.appendChild(link);
      const timer = setTimeout(() => done(false), timeout);
    });
  }

  function loadScript(src, timeout = 6500) {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      let settled = false;
      const done = (ok) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (!ok) script.remove();
        resolve(ok);
      };
      script.src = src;
      script.async = false;
      script.onload = () => done(true);
      script.onerror = () => done(false);
      document.body.appendChild(script);
      const timer = setTimeout(() => done(false), timeout);
    });
  }

  async function firstSuccessful(loader, urls) {
    for (const url of urls) {
      if (!url) continue;
      try {
        if (await loader(url)) return true;
      } catch (_) {
        // Continue to the next source.
      }
    }
    return false;
  }

  async function boot() {
    const remoteCss = (forceFallback || forceOffline) ? [] : [CDN.revealCss];
    if (!forceFallback) await firstSuccessful(loadStyle, [local.revealCss, ...remoteCss]);

    const contentCssLoaded = await loadStyle('content-2026.css', 2500);
    if (!contentCssLoaded) console.warn('Content refinement styles did not load; base styles will be used.');

    const guidanceCssLoaded = await loadStyle('content-guidance.css', 2500);
    if (!guidanceCssLoaded) console.warn('CVD and alcohol guidance styles did not load; base styles will be used.');

    const patientCssLoaded = await loadStyle('patient-content.css', 2500);
    if (!patientCssLoaded) console.warn('Patient-counseling styles did not load; base styles will be used.');

    const revealSources = forceOffline ? [local.revealJs] : [local.revealJs, CDN.revealJs];
    const revealReady = !forceFallback
      && await firstSuccessful(loadScript, revealSources)
      && typeof window.Reveal !== 'undefined';

    if (revealReady) {
      document.body.classList.add('actual-reveal');
      const noteSources = forceOffline ? [local.notes] : [local.notes, CDN.notes];
      const zoomSources = forceOffline ? [local.zoom] : [local.zoom, CDN.zoom];
      await Promise.all([
        firstSuccessful(loadScript, noteSources),
        firstSuccessful(loadScript, zoomSources)
      ]);
    } else {
      document.body.classList.add('fallback-reveal');
      const ok = await loadScript('fallback-reveal.js', 2500);
      if (!ok || typeof window.Reveal === 'undefined') {
        throw new Error('Unable to load reveal.js or fallback controller.');
      }
    }

    const contentLoaded = await loadScript('content-2026.js', 3000);
    if (!contentLoaded) console.warn('Content refinements did not load; the original slide structure will be used.');

    const guidanceLoaded = await loadScript('content-guidance.js', 3000);
    if (!guidanceLoaded) console.warn('CVD consolidation and alcohol guidance did not load; the original slide structure will be used.');

    const patientContentLoaded = await loadScript('patient-content.js', 3000);
    if (!patientContentLoaded) console.warn('Patient-counseling content refinements did not load.');

    const patientExtendedLoaded = await loadScript('patient-content-extended.js', 3000);
    if (!patientExtendedLoaded) console.warn('Extended patient-counseling refinements did not load.');

    const scenesLoaded = await loadScript('three-scenes.js', 3000);
    if (!scenesLoaded) console.warn('Three.js scene manager did not load; static diagrams will remain visible.');

    const appLoaded = await loadScript('app.js', 3000);
    if (!appLoaded) throw new Error('Application script did not load.');
  }

  boot().catch((error) => {
    console.error(error);
    const bootScreen = document.getElementById('boot-screen');
    if (bootScreen) {
      bootScreen.innerHTML = '<strong>เปิดสไลด์ไม่สำเร็จ</strong><span>กรุณารัน npm start หรือดู README</span>';
    }
  });
})();
