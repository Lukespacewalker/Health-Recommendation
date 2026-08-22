(() => {
  'use strict';

  const handlers = new Map();
  let slides = [];
  let current = 0;
  let overview = false;
  let progressFill;
  let initialized = false;

  function emit(name, detail = {}) {
    const list = handlers.get(name) || [];
    const payload = {
      indexh: current,
      indexv: 0,
      currentSlide: slides[current],
      previousSlide: detail.previousSlide || null,
      fragment: detail.fragment || null
    };
    list.forEach((fn) => {
      try { fn(payload); } catch (error) { console.error(error); }
    });
  }

  function fragmentsFor(slide) {
    return [...slide.querySelectorAll('.fragment')];
  }

  function nextHiddenFragment() {
    return fragmentsFor(slides[current]).find((item) => !item.classList.contains('visible')) || null;
  }

  function lastVisibleFragment() {
    return fragmentsFor(slides[current]).filter((item) => item.classList.contains('visible')).at(-1) || null;
  }

  function setHash() {
    if (history.replaceState) history.replaceState(null, '', `#/${current}`);
  }

  function updateClasses(previousSlide = null) {
    slides.forEach((slide, index) => {
      slide.classList.toggle('present', index === current);
      slide.classList.toggle('past', index < current);
      slide.classList.toggle('future', index > current);
      slide.setAttribute('aria-hidden', String(index !== current));
    });
    if (progressFill) progressFill.style.width = `${((current + 1) / slides.length) * 100}%`;
    setHash();
    emit('slidechanged', { previousSlide });
  }

  function goTo(index) {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    if (target === current) return;
    const previousSlide = slides[current];
    current = target;
    updateClasses(previousSlide);
  }

  function next() {
    if (overview) return;
    const fragment = nextHiddenFragment();
    if (fragment) {
      fragment.classList.add('visible', 'current-fragment');
      emit('fragmentshown', { fragment });
      return;
    }
    goTo(current + 1);
  }

  function prev() {
    if (overview) return;
    const fragment = lastVisibleFragment();
    if (fragment) {
      fragment.classList.remove('visible', 'current-fragment');
      emit('fragmenthidden', { fragment });
      return;
    }
    goTo(current - 1);
  }

  function toggleOverview(force) {
    overview = typeof force === 'boolean' ? force : !overview;
    document.body.classList.toggle('fallback-overview', overview);
    emit(overview ? 'overviewshown' : 'overviewhidden');
  }

  function makeControls() {
    const controls = document.createElement('div');
    controls.className = 'fallback-controls';
    controls.innerHTML = '<button type="button" aria-label="Previous slide">←</button><button type="button" aria-label="Next slide">→</button>';
    controls.children[0].addEventListener('click', prev);
    controls.children[1].addEventListener('click', next);
    document.body.appendChild(controls);

    const progress = document.createElement('div');
    progress.className = 'fallback-progress';
    progress.innerHTML = '<i></i>';
    progressFill = progress.firstElementChild;
    document.body.appendChild(progress);

    const badge = document.createElement('div');
    badge.className = 'fallback-badge';
    badge.textContent = 'Fallback mode • Reveal.js assets unavailable';
    document.body.appendChild(badge);
  }

  function onKeydown(event) {
    const key = event.key;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(key)) {
      event.preventDefault(); next();
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(key)) {
      event.preventDefault(); prev();
    } else if (key === 'Home') {
      event.preventDefault(); goTo(0);
    } else if (key === 'End') {
      event.preventDefault(); goTo(slides.length - 1);
    } else if (key.toLowerCase() === 'o' || key === 'Escape') {
      event.preventDefault(); toggleOverview(key === 'Escape' ? false : undefined);
    }
  }

  function initFromHash() {
    const match = location.hash.match(/#\/(\d+)/);
    if (match) current = Math.max(0, Math.min(slides.length - 1, Number(match[1])));
  }

  window.Reveal = {
    initialize() {
      if (initialized) return Promise.resolve();
      initialized = true;
      slides = [...document.querySelectorAll('.reveal .slides > section')];
      initFromHash();
      slides.forEach((slide) => {
        fragmentsFor(slide).forEach((fragment) => fragment.classList.remove('visible', 'current-fragment'));
        slide.addEventListener('click', () => {
          if (overview) {
            current = slides.indexOf(slide);
            toggleOverview(false);
            updateClasses();
          }
        });
      });
      makeControls();
      document.addEventListener('keydown', onKeydown);
      updateClasses();
      emit('ready');
      return Promise.resolve();
    },
    on(name, callback) {
      if (!handlers.has(name)) handlers.set(name, []);
      handlers.get(name).push(callback);
    },
    off(name, callback) {
      const list = handlers.get(name) || [];
      handlers.set(name, list.filter((fn) => fn !== callback));
    },
    next,
    prev,
    slide(index) { goTo(index); },
    toggleOverview,
    getCurrentSlide() { return slides[current] || null; },
    getIndices() { return { h: current, v: 0, f: undefined }; },
    getTotalSlides() { return slides.length; },
    isOverview() { return overview; },
    layout() {},
    sync() {},
    configure() {}
  };
})();
