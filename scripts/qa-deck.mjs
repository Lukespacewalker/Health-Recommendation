import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.DECK_URL || 'http://127.0.0.1:8765/?fallback=1';
const outDir = process.env.QA_OUTPUT || 'qa-artifacts';
await fs.mkdir(outDir, { recursive: true });

const viewports = [
  { name: 'desktop-1600x900', width: 1600, height: 900 },
  { name: 'laptop-1366x768', width: 1366, height: 768 },
  { name: 'mobile-390x844', width: 390, height: 844 }
];

const requiredIds = [
  'body-bmi', 'body-waist',
  'other-start', 'other-followup', 'urinalysis', 'stool-tests',
  'thyroid-start', 'thyroid-basics', 'thyroid-patterns', 'thyroid-followup'
];

const screenshotIds = ['map', 'bp-start', 'body-bmi', 'body-waist', 'other-start', 'urinalysis', 'stool-tests', 'thyroid-start', 'thyroid-patterns'];
const report = { baseUrl, runs: [], failures: [] };
const browser = await chromium.launch({ headless: true });

async function captureBootDiagnostics(page, viewport, consoleErrors, consoleWarnings, error) {
  const diagnostics = await page.evaluate(() => ({
    title: document.title,
    bodyClasses: document.body.className,
    bootText: document.getElementById('boot-screen')?.textContent?.replace(/\s+/g, ' ').trim() || '',
    revealType: typeof window.Reveal,
    revealMethods: window.Reveal ? Object.keys(window.Reveal).filter((key) => typeof window.Reveal[key] === 'function').slice(0, 30) : [],
    patientAppReady: typeof window.PatientAppReady,
    structureReady: Boolean(window.HealthDeckStructure),
    slidesInDom: document.querySelectorAll('.reveal .slides > section').length,
    scripts: [...document.scripts].map((script) => script.src || 'inline').slice(-15)
  }));
  const item = {
    viewport,
    initializationError: error?.message || String(error),
    consoleErrors,
    consoleWarnings,
    diagnostics
  };
  report.runs.push(item);
  report.failures.push({ viewport: viewport.name, errors: [`deck initialization failed: ${item.initializationError}`, ...consoleErrors] });
  await page.screenshot({ path: path.join(outDir, `${viewport.name}-boot-failure.png`), fullPage: false });
  await fs.writeFile(path.join(outDir, 'qa-report.json'), JSON.stringify(report, null,2));
  console.error(JSON.stringify(item, null, 2));
}

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
    const consoleErrors = [];
    const consoleWarnings = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
      if (message.type() === 'warning' && !/WebGL|swiftshader|GPU stall/i.test(message.text())) consoleWarnings.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));

    await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 90_000 });
    try {
      await page.waitForFunction(() => {
        const slideCount = document.querySelectorAll('.reveal .slides > section').length;
        return document.body.classList.contains('deck-ready')
          && window.Reveal
          && typeof window.Reveal.slide === 'function'
          && slideCount > 0;
      }, null, { timeout: 20_000 });
    } catch (error) {
      await captureBootDiagnostics(page, viewport, consoleErrors, consoleWarnings, error);
      await page.close();
      continue;
    }

    const audit = await page.evaluate((ids) => {
      const allIds = [...document.querySelectorAll('[id]')].map((node) => node.id);
      const duplicateIds = [...new Set(allIds.filter((id, index) => allIds.indexOf(id) !== index))];
      const slides = [...document.querySelectorAll('.reveal .slides > section')];
      const missingReferences = slides.filter((node) => !node.querySelector('.source-chips a[href]')).map((node) => node.id || node.dataset.menuTitle || 'untitled');
      const groupCounts = slides.reduce((acc, node) => {
        const group = node.dataset.group || 'unknown';
        acc[group] = (acc[group] || 0) + 1;
        return acc;
      }, {});
      return {
        chapterTabs: document.querySelectorAll('#chapter-tabs [data-target-group]').length,
        missingIds: ids.filter((id) => !document.getElementById(id)),
        duplicateIds,
        missingReferences,
        groupCounts,
        otherSlideIds: slides.filter((node) => node.dataset.group === 'other').map((node) => node.id),
        thyroidSlideIds: slides.filter((node) => node.dataset.group === 'thyroid').map((node) => node.id),
        totalSlides: slides.length,
        fallbackMode: document.body.classList.contains('fallback-reveal')
      };
    }, requiredIds);

    const errors = [];
    if (audit.chapterTabs !== 16) errors.push(`expected 16 chapter tabs including Home, found ${audit.chapterTabs}`);
    if (audit.missingIds.length) errors.push(`missing required slide IDs: ${audit.missingIds.join(', ')}`);
    if (audit.duplicateIds.length) errors.push(`duplicate IDs: ${audit.duplicateIds.join(', ')}`);
    if (audit.missingReferences.length) errors.push(`slides without clickable reference: ${audit.missingReferences.join(', ')}`);
    if (audit.groupCounts.thyroid !== 4) errors.push(`expected 4 thyroid slides, found ${audit.groupCounts.thyroid || 0}`);
    if (audit.groupCounts.other !== 4) errors.push(`expected 4 urine/stool slides, found ${audit.groupCounts.other || 0}`);
    if (consoleErrors.length) errors.push(`console errors: ${consoleErrors.join(' | ')}`);

    for (const id of screenshotIds) {
      const exists = await page.$(`#${id}`);
      if (!exists) continue;
      await page.evaluate((slideId) => {
        const target = document.getElementById(slideId);
        const slides = [...document.querySelectorAll('.reveal .slides > section')];
        const index = slides.indexOf(target);
        if (index >= 0) window.Reveal.slide(index, 0, 0);
      }, id);
      await page.waitForTimeout(850);
      await page.screenshot({ path: path.join(outDir, `${viewport.name}-${id}.png`), fullPage: false });
    }

    const overflow = await page.evaluate((ids) => ids.map((id) => {
      const node = document.getElementById(id);
      if (!node) return { id, missing: true };
      return {
        id,
        scrollHeight: node.scrollHeight,
        clientHeight: node.clientHeight,
        scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth,
        verticalOverflow: node.scrollHeight > node.clientHeight + 8,
        horizontalOverflow: node.scrollWidth > node.clientWidth + 8
      };
    }), screenshotIds);

    report.runs.push({ viewport, audit, overflow, consoleErrors, consoleWarnings, errors });
    if (errors.length) report.failures.push({ viewport: viewport.name, errors });
    await page.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(path.join(outDir, 'qa-report.json'), JSON.stringify(report, null, 2));
if (report.failures.length) {
  console.error(JSON.stringify(report.failures, null, 2));
  process.exit(1);
}
console.log('Deck QA passed for all configured viewports.');