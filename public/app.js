(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const plugins = [window.RevealNotes, window.RevealZoom].filter(Boolean);
  const sectionChip = document.getElementById('section-chip');
  const effectsButton = document.getElementById('effects-toggle');
  const themeButton = document.getElementById('theme-toggle');
  const bootScreen = document.getElementById('boot-screen');
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const navDrawer = document.getElementById('nav-drawer');
  const navBackdrop = document.getElementById('nav-backdrop');
  const drawerList = document.getElementById('drawer-list');
  const drawerCurrent = document.getElementById('drawer-current');
  const chapterTabs = document.getElementById('chapter-tabs');
  const topicSubnav = document.getElementById('topic-subnav');
  const chapterProgress = document.querySelector('#chapter-progress i');

  const GROUPS = {
    home:     { label: 'หน้าแรก', short: 'HOME', color: '#72e0ff' },
    diabetes: { label: '1 เบาหวาน', short: 'DIABETES', color: '#5de4c7' },
    lipids:   { label: '2 ไขมันในเลือด', short: 'LIPIDS', color: '#ffd166' },
    bp:       { label: 'ความดันโลหิต', short: 'BLOOD PRESSURE', color: '#74d9ff' },
    blood:    { label: 'เลือดและ CBC', short: 'BLOOD / CBC', color: '#e88fbd' },
    kidney:   { label: '3 ไต', short: 'KIDNEY', color: '#55d7ff' },
    liver:    { label: 'ตับ', short: 'LIVER', color: '#b8cf63' },
    cvd:      { label: '4 หลอดเลือดหัวใจ', short: 'CVD RISK', color: '#ff8b72' },
    cancer:   { label: '5 มะเร็ง', short: 'CANCER', color: '#ff83c7' },
    vaccines: { label: 'วัคซีนผู้ใหญ่', short: 'VACCINES', color: '#ba9cff' },
    other:    { label: 'ผลตรวจอื่น', short: 'OTHER', color: '#9d8dff' },
    summary:  { label: 'สรุปและอ้างอิง', short: 'SUMMARY', color: '#72e0ff' }
  };
  const GROUP_ORDER = ['home', 'diabetes', 'lipids', 'bp', 'blood', 'kidney', 'liver', 'cvd', 'cancer', 'vaccines', 'other', 'summary'];
  const SLIDE_ORDER = {
    bp: ['bp-start', 'bp-measurement', 'bp-categories', 'bp-confirm', 'bp-action'],
    blood: ['blood-start', 'blood-cbc-map', 'other-anemia', 'blood-iron', 'other-thal', 'blood-eosinophil']
  };
  const params = new URLSearchParams(location.search);
  const resumeRequested = params.get('resume') === '1';

  let effectsEnabled = !prefersReducedMotion;
  let slides = [];
  let slideIndexById = new Map();
  let slidesByGroup = new Map();
  let menuOpen = false;

  function preferredTheme() {
    try {
      const saved = localStorage.getItem('health-deck-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) {}
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme, persist = false) {
    const next = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    if (themeButton) {
      const light = next === 'light';
      themeButton.textContent = light ? 'Dark' : 'Light';
      themeButton.setAttribute('aria-pressed', String(light));
      themeButton.title = light ? 'เปลี่ยนเป็น Dark theme' : 'เปลี่ยนเป็น Light theme';
    }
    if (persist) {
      try { localStorage.setItem('health-deck-theme', next); } catch (_) {}
    }
  }

  function toggleTheme() {
    applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light', true);
  }

  function normalizeGroups() {
    const slideContainer = document.querySelector('.reveal .slides');
    document.querySelectorAll('body > section.slide').forEach((slide) => slideContainer?.appendChild(slide));
    [['other-thal', 'blood'], ['other-anemia', 'blood'], ['bp-measurement', 'bp']].forEach(([id, group]) => {
      const slide = document.getElementById(id);
      if (slide) {
        slide.dataset.group = group;
        slide.dataset.section = GROUPS[group].short;
      }
    });

    const originalPosition = new Map([...slideContainer.children].map((slide, index) => [slide, index]));
    [...slideContainer.children]
      .sort((a, b) => {
        const groupA = a.dataset.group || 'other';
        const groupB = b.dataset.group || 'other';
        const groupDifference = GROUP_ORDER.indexOf(groupA) - GROUP_ORDER.indexOf(groupB);
        if (groupDifference) return groupDifference;
        const preferred = SLIDE_ORDER[groupA];
        if (preferred) {
          const orderA = preferred.indexOf(a.id);
          const orderB = preferred.indexOf(b.id);
          if (orderA !== -1 || orderB !== -1) {
            return (orderA === -1 ? Number.MAX_SAFE_INTEGER : orderA)
              - (orderB === -1 ? Number.MAX_SAFE_INTEGER : orderB);
          }
        }
        if (a.id === `${groupA}-start`) return -1;
        if (b.id === `${groupB}-start`) return 1;
        return originalPosition.get(a) - originalPosition.get(b);
      })
      .forEach((slide) => slideContainer.appendChild(slide));
  }

  function collectSlides() {
    slides = [...document.querySelectorAll('.reveal .slides > section')];
    slideIndexById = new Map();
    slidesByGroup = new Map();
    slides.forEach((slide, index) => {
      if (slide.id) slideIndexById.set(slide.id, index);
      const group = slide.dataset.group || 'other';
      if (!slidesByGroup.has(group)) slidesByGroup.set(group, []);
      slidesByGroup.get(group).push(slide);
    });
    slidesByGroup.forEach((groupSlides, group) => {
      const startIndex = groupSlides.findIndex((slide) => slide.id === `${group}-start`);
      if (startIndex > 0) groupSlides.unshift(groupSlides.splice(startIndex, 1)[0]);
    });
  }

  function groupFor(slide) {
    return slide?.dataset.group || 'home';
  }

  function titleFor(slide) {
    return slide?.dataset.menuTitle || slide?.querySelector('h1, h2')?.textContent?.trim() || 'Slide';
  }

  function slideNumberWithinGroup(slide) {
    const groupSlides = slidesByGroup.get(groupFor(slide)) || [];
    const index = Math.max(0, groupSlides.indexOf(slide));
    return { index, total: groupSlides.length };
  }

  function jumpTo(target) {
    const id = typeof target === 'string' ? target.replace(/^#/, '') : target?.dataset?.jump;
    const index = slideIndexById.get(id);
    if (typeof index !== 'number') return;
    closeMenu();
    window.Reveal?.slide?.(index, 0, 0);
  }

  function jumpToGroup(group) {
    const first = document.getElementById(`${group}-start`) || (slidesByGroup.get(group) || [])[0];
    if (first?.id) jumpTo(first.id);
  }

  function buildDrawer() {
    if (!drawerList) return;
    drawerList.innerHTML = '';
    GROUP_ORDER.forEach((group) => {
      const groupSlides = slidesByGroup.get(group) || [];
      if (!groupSlides.length) return;
      const section = document.createElement('section');
      section.className = 'drawer-group';
      section.dataset.group = group;
      const heading = document.createElement('button');
      heading.type = 'button';
      heading.className = 'drawer-group-title';
      heading.dataset.drawerGroup = group;
      heading.innerHTML = `<span class="drawer-dot"></span><b>${GROUPS[group]?.label || group}</b><small>${groupSlides.length} หน้า</small>`;
      heading.addEventListener('click', () => jumpToGroup(group));
      section.appendChild(heading);

      const list = document.createElement('div');
      list.className = 'drawer-slide-list';
      groupSlides.forEach((slide, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'drawer-slide-link';
        button.dataset.slideId = slide.id;
        button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><b>${titleFor(slide)}</b>`;
        button.addEventListener('click', () => jumpTo(slide.id));
        list.appendChild(button);
      });
      section.appendChild(list);
      drawerList.appendChild(section);
    });
  }

  function buildTopicSubnav(group, activeSlide) {
    if (!topicSubnav) return;
    const groupSlides = slidesByGroup.get(group) || [];
    const show = group !== 'home' && group !== 'summary' && groupSlides.length > 1;
    topicSubnav.hidden = !show;
    topicSubnav.replaceChildren();
    if (!show) return;
    groupSlides.forEach((slide, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'topic-subnav-item';
      button.textContent = `${index + 1}. ${titleFor(slide)}`;
      button.dataset.slideId = slide.id;
      const active = slide === activeSlide;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      button.addEventListener('click', () => jumpTo(slide.id));
      topicSubnav.appendChild(button);
      if (active) requestAnimationFrame(() => button.scrollIntoView({ block: 'nearest', inline: 'center' }));
    });
  }

  function openMenu() {
    if (!navDrawer) return;
    menuOpen = true;
    document.body.classList.add('nav-open');
    navDrawer.setAttribute('aria-hidden', 'false');
    menuToggle?.setAttribute('aria-expanded', 'true');
    setTimeout(() => menuClose?.focus({ preventScroll: true }), 80);
  }

  function closeMenu() {
    if (!navDrawer) return;
    menuOpen = false;
    document.body.classList.remove('nav-open');
    navDrawer.setAttribute('aria-hidden', 'true');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    if (menuOpen) closeMenu();
    else openMenu();
  }

  function restartAnimatedCharts(slide) {
    document.querySelectorAll('[data-animated-chart].is-running').forEach((chart) => chart.classList.remove('is-running'));
    if (!effectsEnabled || prefersReducedMotion || !slide) return;
    slide.querySelectorAll('[data-animated-chart]').forEach((chart) => {
      void chart.offsetWidth;
      chart.classList.add('is-running');
    });
  }

  function updateNavigation(slide) {
    if (!slide) return;
    const group = groupFor(slide);
    const meta = GROUPS[group] || GROUPS.other;
    const sectionLabel = slide.dataset.section || meta.short;
    const position = slideNumberWithinGroup(slide);

    if (sectionChip) sectionChip.textContent = sectionLabel;
    document.documentElement.dataset.section = sectionLabel.toLowerCase().replace(/[^a-z0-9ก-๙]+/g, '-');
    document.documentElement.dataset.group = group;
    document.documentElement.style.setProperty('--chapter-color', meta.color);

    const slideTitle = slide.querySelector('h1, h2')?.textContent?.replace(/\s+/g, ' ').trim();
    if (slideTitle) document.title = `${slideTitle} | Health Check Slides`;

    if (drawerCurrent) {
      drawerCurrent.innerHTML = `<span>${meta.label}</span><b>${titleFor(slide)}</b><small>${position.index + 1} / ${position.total}</small>`;
    }

    document.querySelectorAll('.drawer-slide-link').forEach((button) => {
      const active = button.dataset.slideId === slide.id;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    document.querySelectorAll('.drawer-group').forEach((item) => item.classList.toggle('is-current', item.dataset.group === group));
    chapterTabs?.querySelectorAll('[data-target-group]').forEach((button) => {
      const active = button.dataset.targetGroup === group;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    buildTopicSubnav(group, slide);

    if (chapterProgress) {
      const percent = position.total ? ((position.index + 1) / position.total) * 100 : 0;
      chapterProgress.style.width = `${percent}%`;
      chapterProgress.parentElement?.setAttribute('aria-label', `${meta.label} หน้า ${position.index + 1} จาก ${position.total}`);
    }

    restartAnimatedCharts(slide);
  }

  function applyEffectsState() {
    document.body.classList.toggle('effects-off', !effectsEnabled);
    if (effectsButton) {
      effectsButton.textContent = effectsEnabled ? 'Effects' : 'Effects off';
      effectsButton.setAttribute('aria-pressed', String(effectsEnabled));
    }
    window.ThreeSceneManager?.setEnabled?.(effectsEnabled);
    restartAnimatedCharts(window.Reveal?.getCurrentSlide?.());
  }

  function toggleEffects() {
    effectsEnabled = !effectsEnabled;
    applyEffectsState();
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch (error) {
      console.warn('Fullscreen request was blocked.', error);
    }
  }

  function setupNavigationControls() {
    menuToggle?.addEventListener('click', toggleMenu);
    menuClose?.addEventListener('click', closeMenu);
    navBackdrop?.addEventListener('click', closeMenu);
    chapterTabs?.querySelectorAll('[data-target-group]').forEach((button) => {
      button.addEventListener('click', () => jumpToGroup(button.dataset.targetGroup));
    });
    document.querySelectorAll('[data-jump]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        jumpTo(button.dataset.jump);
      });
    });
  }

  function updateModuleCounts() {
    document.querySelectorAll('[data-count-group]').forEach((node) => {
      const group = node.dataset.countGroup;
      const count = (slidesByGroup.get(group) || []).length;
      node.textContent = `${count} slides`;
    });
  }

  function setupInteractiveControls() {
    document.querySelectorAll('[data-interactive]').forEach((root) => {
      ['pointerdown', 'click', 'wheel'].forEach((eventName) => {
        root.addEventListener(eventName, (event) => event.stopPropagation(), { passive: eventName === 'wheel' });
      });
      root.addEventListener('keydown', (event) => {
        event.stopPropagation();
      });
    });
  }

  function setupEgfrCalculator() {
    const root = document.querySelector('[data-interactive="egfr"]');
    if (!root) return;

    const ageInput = document.getElementById('egfr-age');
    const sexInput = document.getElementById('egfr-sex');
    const creatinineInput = document.getElementById('egfr-creatinine');
    const unitInput = document.getElementById('egfr-unit');
    const uacrInput = document.getElementById('egfr-uacr');
    const resetButton = document.getElementById('egfr-reset');
    const result = document.getElementById('egfr-result');
    const uacrResult = document.getElementById('egfr-uacr-result');
    const gCategory = document.getElementById('egfr-g-category');
    const aCategory = document.getElementById('egfr-a-category');
    const risk = document.getElementById('egfr-risk');
    const riskNote = document.getElementById('egfr-risk-note');
    const eqScr = document.getElementById('eq-scr');
    const eqKappa = document.getElementById('eq-kappa');
    const eqAlpha = document.getElementById('eq-alpha');
    let previousUnit = unitInput?.value || 'mgdl';

    const value = (input, fallback) => {
      const parsed = Number(input?.value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };

    const classifyG = (egfr) => {
      if (egfr >= 90) return 'G1';
      if (egfr >= 60) return 'G2';
      if (egfr >= 45) return 'G3a';
      if (egfr >= 30) return 'G3b';
      if (egfr >= 15) return 'G4';
      return 'G5';
    };

    const classifyA = (uacr) => {
      if (uacr < 30) return 'A1';
      if (uacr <= 300) return 'A2';
      return 'A3';
    };

    const riskSnapshot = (g, a) => {
      const matrix = {
        G1:  { A1: 'low',      A2: 'moderate', A3: 'high' },
        G2:  { A1: 'low',      A2: 'moderate', A3: 'high' },
        G3a: { A1: 'moderate', A2: 'high',     A3: 'very-high' },
        G3b: { A1: 'high',     A2: 'very-high',A3: 'very-high' },
        G4:  { A1: 'very-high',A2: 'very-high',A3: 'very-high' },
        G5:  { A1: 'very-high',A2: 'very-high',A3: 'very-high' }
      };
      return matrix[g]?.[a] || 'moderate';
    };

    const riskLabels = {
      low: 'Low',
      moderate: 'Moderately increased',
      high: 'High',
      'very-high': 'Very high'
    };

    const update = () => {
      const age = Math.max(18, Math.min(110, value(ageInput, 50)));
      const sex = sexInput?.value === 'female' ? 'female' : 'male';
      const rawCreatinine = Math.max(0.05, value(creatinineInput, 1));
      const scr = unitInput?.value === 'umol' ? rawCreatinine / 88.4 : rawCreatinine;
      const uacr = Math.max(0, value(uacrInput, 15));
      const kappa = sex === 'female' ? 0.7 : 0.9;
      const alpha = sex === 'female' ? -0.241 : -0.302;
      const femaleFactor = sex === 'female' ? 1.012 : 1;
      const ratio = scr / kappa;
      const egfr = 142
        * Math.pow(Math.min(ratio, 1), alpha)
        * Math.pow(Math.max(ratio, 1), -1.2)
        * Math.pow(0.9938, age)
        * femaleFactor;
      const rounded = Math.max(1, Math.round(egfr));
      const g = classifyG(egfr);
      const a = classifyA(uacr);
      const level = riskSnapshot(g, a);

      if (result) result.textContent = String(rounded);
      if (uacrResult) uacrResult.textContent = uacr < 10 ? uacr.toFixed(1) : Math.round(uacr).toString();
      if (gCategory) gCategory.textContent = g;
      if (aCategory) aCategory.textContent = a;
      if (risk) {
        risk.textContent = riskLabels[level];
        risk.className = `risk-${level}`;
      }
      if (riskNote) {
        if ((g === 'G1' || g === 'G2') && a === 'A1') {
          riskNote.textContent = 'ถ้าไม่มี marker ของ kidney damage อื่น G1–G2/A1 ยังไม่วินิจฉัย CKD จากสองค่านี้';
        } else {
          riskNote.textContent = 'เป็น risk snapshot จาก G/A category ต้องยืนยันความต่อเนื่อง ≥3 เดือนและตีความร่วมกับบริบท';
        }
      }
      if (eqScr) eqScr.textContent = scr.toFixed(2);
      if (eqKappa) eqKappa.textContent = kappa.toFixed(1);
      if (eqAlpha) eqAlpha.textContent = alpha.toFixed(3).replace('-', '−');
    };

    unitInput?.addEventListener('change', () => {
      const current = Math.max(0.05, value(creatinineInput, 1));
      if (previousUnit !== unitInput.value) {
        if (unitInput.value === 'umol') {
          creatinineInput.value = (current * 88.4).toFixed(1);
          creatinineInput.min = '4';
          creatinineInput.max = '1768';
          creatinineInput.step = '1';
        } else {
          creatinineInput.value = (current / 88.4).toFixed(2);
          creatinineInput.min = '0.05';
          creatinineInput.max = '20';
          creatinineInput.step = '0.01';
        }
        previousUnit = unitInput.value;
      }
      update();
    });

    [ageInput, sexInput, creatinineInput, uacrInput].forEach((input) => {
      input?.addEventListener('input', update);
      input?.addEventListener('change', update);
    });

    resetButton?.addEventListener('click', () => {
      ageInput.value = '50';
      sexInput.value = 'male';
      unitInput.value = 'mgdl';
      previousUnit = 'mgdl';
      creatinineInput.value = '1.00';
      creatinineInput.min = '0.05';
      creatinineInput.max = '20';
      creatinineInput.step = '0.01';
      uacrInput.value = '15';
      update();
    });

    update();
  }

  function setupLipidRatioCalculator() {
    const root = document.querySelector('[data-interactive="lipid-ratios"]');
    if (!root) return;
    const tcInput = document.getElementById('ratio-tc');
    const ldlInput = document.getElementById('ratio-ldl');
    const hdlInput = document.getElementById('ratio-hdl');
    const tgInput = document.getElementById('ratio-tg');
    const resetButton = document.getElementById('ratio-reset');
    const out = {
      tcHdl: document.getElementById('ratio-tc-hdl'),
      ldlHdl: document.getElementById('ratio-ldl-hdl'),
      tgHdl: document.getElementById('ratio-tg-hdl'),
      nonHdl: document.getElementById('ratio-nonhdl'),
      remnant: document.getElementById('ratio-remnant')
    };
    const n = (input, fallback) => {
      const parsed = Number(input?.value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };
    const update = () => {
      const tc = Math.max(0, n(tcInput, 210));
      const ldl = Math.max(0, n(ldlInput, 135));
      const hdl = Math.max(1, n(hdlInput, 45));
      const tg = Math.max(0, n(tgInput, 150));
      out.tcHdl.textContent = (tc / hdl).toFixed(2);
      out.ldlHdl.textContent = (ldl / hdl).toFixed(2);
      out.tgHdl.textContent = (tg / hdl).toFixed(2);
      out.nonHdl.textContent = Math.max(0, Math.round(tc - hdl)).toString();
      out.remnant.textContent = Math.max(0, Math.round(tc - hdl - ldl)).toString();
    };
    [tcInput, ldlInput, hdlInput, tgInput].forEach((input) => {
      input?.addEventListener('input', update);
      input?.addEventListener('change', update);
    });
    resetButton?.addEventListener('click', () => {
      tcInput.value = '210';
      ldlInput.value = '135';
      hdlInput.value = '45';
      tgInput.value = '150';
      update();
    });
    update();
  }

  function setupTumorMap() {
    const root = document.querySelector('[data-interactive="tumor-map"]');
    if (!root) return;
    const data = {
      PSA: {
        title: 'สัมพันธ์กับต่อมลูกหมาก',
        use: 'ใช้ช่วยประเมินโรคของต่อมลูกหมากและติดตามผู้ที่ได้รับการวินิจฉัยแล้ว',
        caution: 'ต่อมลูกหมากโต การอักเสบ และปัจจัยก่อนตรวจบางอย่างอาจทำให้ค่าสูงได้',
        organs: ['prostate']
      },
      AFP: {
        title: 'สัมพันธ์กับตับและเนื้องอกเซลล์สืบพันธุ์',
        use: 'ใช้ช่วยประเมินและติดตามมะเร็งตับหรือเนื้องอกเซลล์สืบพันธุ์เมื่อผลตรวจอื่นสนับสนุน',
        caution: 'โรคตับเรื้อรัง ตับอักเสบ และการตั้งครรภ์อาจทำให้ค่าสูงได้',
        organs: ['liver', 'germ']
      },
      CEA: {
        title: 'สัมพันธ์กับมะเร็งลำไส้ใหญ่และมะเร็งบางชนิด',
        use: 'มักใช้ติดตามผลหลังวินิจฉัย โดยเฉพาะมะเร็งลำไส้ใหญ่',
        caution: 'การสูบบุหรี่ การอักเสบ และโรคตับอาจทำให้ค่าสูงได้เช่นกัน',
        organs: ['colon']
      },
      CA125: {
        title: 'สัมพันธ์กับรังไข่และเยื่อบุช่องท้อง',
        use: 'ใช้ประกอบการประเมินก้อนบริเวณรังไข่และติดตามผู้ที่ได้รับการวินิจฉัยแล้ว',
        caution: 'ประจำเดือน การตั้งครรภ์ เยื่อบุโพรงมดลูกเจริญผิดที่ และการอักเสบในช่องท้องอาจทำให้ค่าสูงได้',
        organs: ['ovary']
      },
      CA153: {
        title: 'สัมพันธ์กับมะเร็งเต้านม',
        use: 'ใช้ประเมินการตอบสนองต่อการรักษาหรือการกลับเป็นซ้ำในผู้ที่ได้รับการวินิจฉัยแล้ว',
        caution: 'หากผลผิดปกติ แพทย์จะดูแนวโน้มและเลือกตรวจเต้านมเพิ่มเติมตามความเหมาะสม',
        organs: ['breast']
      },
      CA199: {
        title: 'สัมพันธ์กับตับอ่อนและทางเดินน้ำดี',
        use: 'มักใช้ติดตามมะเร็งตับอ่อนหรือทางเดินน้ำดี หลังแพทย์พบเหตุให้สงสัยจากข้อมูลอื่น',
        caution: 'ท่อน้ำดีอุดตันหรืออักเสบอาจทำให้ค่าสูงมากได้ และบางคนไม่สร้าง CA 19-9 ตามพันธุกรรม',
        organs: ['pancreas']
      },
      BHCG: {
        title: 'สัมพันธ์กับเนื้องอกเซลล์สืบพันธุ์และเนื้อรก',
        use: 'ใช้ช่วยวินิจฉัย ประเมินความรุนแรง และติดตามผลการรักษา',
        caution: 'การตั้งครรภ์ทำให้ค่านี้สูงตามธรรมชาติ จึงต้องอ่านผลร่วมกับเพศ อายุ และประวัติ',
        organs: ['germ']
      }
    };
    const name = document.getElementById('marker-detail-name');
    const title = document.getElementById('marker-detail-title');
    const use = document.getElementById('marker-detail-use');
    const caution = document.getElementById('marker-detail-caution');
    const buttons = [...root.querySelectorAll('.marker-map-btn')];
    const organs = [...root.querySelectorAll('.organ-hotspot')];

    const select = (marker) => {
      const item = data[marker];
      if (!item) return;
      buttons.forEach((button) => button.classList.toggle('is-active', button.dataset.marker === marker));
      organs.forEach((organ) => organ.classList.toggle('is-active', item.organs.includes(organ.dataset.organ)));
      if (name) name.textContent = marker === 'CA125' ? 'CA-125' : marker === 'CA153' ? 'CA 15-3' : marker === 'CA199' ? 'CA 19-9' : marker === 'BHCG' ? 'β-hCG' : marker;
      if (title) title.textContent = item.title;
      if (use) use.textContent = item.use;
      if (caution) caution.textContent = item.caution;
    };

    buttons.forEach((button) => button.addEventListener('click', () => select(button.dataset.marker)));
    select('PSA');
  }

  function setupKeyboard() {
    document.addEventListener('keydown', (event) => {
      const target = event.target;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      const key = event.key.toLowerCase();
      if (key === 'm') {
        event.preventDefault();
        event.stopImmediatePropagation();
        toggleMenu();
        return;
      }
      if (event.key === 'Escape' && menuOpen) {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeMenu();
        return;
      }
      if (key === 'e') {
        event.preventDefault();
        toggleEffects();
      }
      if (key === 'f') {
        event.preventDefault();
        toggleFullscreen();
      }
    }, true);
  }

  function setupCardDepth() {
    let currentSlide = null;
    const reset = () => {
      if (!currentSlide) return;
      currentSlide.style.setProperty('--tilt-x', '0deg');
      currentSlide.style.setProperty('--tilt-y', '0deg');
    };
    document.addEventListener('pointermove', (event) => {
      if (!effectsEnabled || prefersReducedMotion || menuOpen) return;
      currentSlide = window.Reveal?.getCurrentSlide?.();
      if (!currentSlide) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      currentSlide.style.setProperty('--tilt-x', `${(-y * 0.35).toFixed(2)}deg`);
      currentSlide.style.setProperty('--tilt-y', `${(x * 0.45).toFixed(2)}deg`);
    }, { passive: true });
    document.addEventListener('mouseleave', reset);
  }

  const config = {
    width: 1600,
    height: 900,
    margin: 0.035,
    minScale: 0.2,
    maxScale: 1.65,
    controls: true,
    controlsTutorial: true,
    progress: true,
    slideNumber: 'c/t',
    hash: true,
    history: true,
    center: false,
    touch: true,
    overview: true,
    navigationMode: 'linear',
    transition: prefersReducedMotion ? 'none' : 'fade',
    transitionSpeed: 'default',
    backgroundTransition: prefersReducedMotion ? 'none' : 'fade',
    autoAnimate: !prefersReducedMotion,
    autoAnimateDuration: 0.8,
    autoAnimateEasing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    autoAnimateUnmatched: true,
    viewDistance: 3,
    mobileViewDistance: 2,
    pdfSeparateFragments: false,
    plugins
  };

  normalizeGroups();
  collectSlides();
  updateModuleCounts();
  buildDrawer();
  setupNavigationControls();
  setupInteractiveControls();
  setupEgfrCalculator();
  setupLipidRatioCalculator();
  setupTumorMap();
  setupKeyboard();
  setupCardDepth();
  applyTheme(preferredTheme());
  themeButton?.addEventListener('click', toggleTheme);
  effectsButton?.addEventListener('click', toggleEffects);

  // A normal launch always begins at the cover. Add ?resume=1 to preserve an explicit hash.
  if (!resumeRequested) {
    try { history.replaceState(null, '', `${location.pathname}${location.search}#/0`); } catch (_) {}
  }

  Promise.resolve(window.Reveal.initialize(config))
    .then(async () => {
      if (!resumeRequested) window.Reveal.slide?.(0, 0, 0);
      updateNavigation(window.Reveal.getCurrentSlide?.());
      window.Reveal.on?.('slidechanged', (event) => updateNavigation(event.currentSlide));
      window.Reveal.on?.('ready', (event) => updateNavigation(event.currentSlide));
      window.Reveal.on?.('overviewshown', closeMenu);
      applyEffectsState();

      if (window.ThreeSceneManager) {
        await window.ThreeSceneManager.init(window.Reveal);
        window.ThreeSceneManager.setEnabled(effectsEnabled);
      }

      setTimeout(() => bootScreen?.classList.add('is-hidden'), 120);
      document.body.classList.add('deck-ready');
    })
    .catch((error) => {
      console.error(error);
      if (bootScreen) {
        bootScreen.innerHTML = '<strong>เริ่มสไลด์ไม่สำเร็จ</strong><span>ดู README สำหรับวิธีเปิดผ่าน local server</span>';
      }
    });
})();
