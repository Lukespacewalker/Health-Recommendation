(() => {
  'use strict';

  function replaceRequired(source, pattern, replacement, label) {
    const next = source.replace(pattern, replacement);
    if (next === source) throw new Error(`Unable to patch app.js: ${label}`);
    return next;
  }

  window.PatientAppReady = (async () => {
    const response = await fetch('app.js', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Unable to fetch app.js (${response.status})`);
    let source = await response.text();

    source = replaceRequired(
      source,
      /bp:\s*\{ label: '03 ความดันโลหิต', short: 'BLOOD PRESSURE', color: '#74d9ff' \}/,
      "bp:       { label: '03 น้ำหนัก รอบเอว และความดัน', short: 'WEIGHT / WAIST / BP', color: '#74d9ff' }",
      'bp group metadata'
    );

    source = replaceRequired(
      source,
      /other:\s*\{ label: '14 ผลตรวจอื่น', short: 'OTHER', color: '#9d8dff' \}/,
      "other:    { label: '06 ปัสสาวะและอุจจาระ', short: 'URINE & STOOL', color: '#8ad5c2' }",
      'urine and stool group metadata'
    );

    source = replaceRequired(
      source,
      /liver:\s*\{ label: '06 ตับ', short: 'LIVER', color: '#b8cf63' \},\s*\n\s*cvd:\s*\{ label: '07 หัวใจและหลอดเลือด', short: 'CVD RISK', color: '#ff8b72' \},/,
      "liver:    { label: '07 ตับ ถุงน้ำดี และแอลกอฮอล์', short: 'LIVER', color: '#b8cf63' },\n    thyroid:  { label: '08 ไทรอยด์', short: 'THYROID', color: '#d39cff' },\n    cvd:      { label: '09 หัวใจและหลอดเลือด', short: 'CVD RISK', color: '#ff8b72' },",
      'liver, thyroid, and CVD group metadata'
    );

    const groupUpdates = [
      ["cancer:   { label: '08 มะเร็ง', short: 'CANCER', color: '#ff83c7' }", "cancer:   { label: '10 มะเร็งและการคัดกรอง', short: 'CANCER', color: '#ff83c7' }"],
      ["vaccines: { label: '09 วัคซีนผู้ใหญ่', short: 'VACCINES', color: '#ba9cff' }", "vaccines: { label: '11 วัคซีนผู้ใหญ่', short: 'VACCINES', color: '#ba9cff' }"],
      ["vitamins: { label: '10 วิตามิน', short: 'VITAMINS', color: '#e6c65d' }", "vitamins: { label: '12 วิตามิน', short: 'VITAMINS', color: '#e6c65d' }"],
      ["bone:     { label: '11 มวลกระดูก', short: 'BONE DENSITY', color: '#d49a70' }", "bone:     { label: '13 มวลกระดูก', short: 'BONE DENSITY', color: '#d49a70' }"],
      ["eyes:     { label: '12 ตา', short: 'EYE HEALTH', color: '#66c8ff' }", "eyes:     { label: '14 ตา', short: 'EYE HEALTH', color: '#66c8ff' }"],
      ["hearing:  { label: '13 หู', short: 'HEARING', color: '#ff9f6e' }", "hearing:  { label: '15 หู', short: 'HEARING', color: '#ff9f6e' }"],
    ];
    groupUpdates.forEach(([from, to]) => {
      source = replaceRequired(source, from, to, `group metadata ${from.split(':')[0]}`);
    });

    source = replaceRequired(
      source,
      /const GROUP_ORDER = \[[^\]]+\];/,
      "const GROUP_ORDER = ['home', 'diabetes', 'lipids', 'bp', 'blood', 'kidney', 'other', 'liver', 'thyroid', 'cvd', 'cancer', 'vaccines', 'vitamins', 'bone', 'eyes', 'hearing', 'summary'];",
      'group order'
    );

    source = replaceRequired(
      source,
      /const SLIDE_ORDER = \{\s*/,
      "const SLIDE_ORDER = {\n    other: ['other-start', 'other-followup', 'urinalysis', 'stool-tests'],\n    thyroid: ['thyroid-start', 'thyroid-basics', 'thyroid-patterns', 'thyroid-followup'],\n    cvd: ['cvd-start', 'cardiac-test-matrix', 'cvd-risk-score', 'cac', 'est', 'echo', 'other-pad', 'other-abi', 'other-cavi'],\n    cancer: ['cancer-start', 'tumor-marker', 'tumor-body-map', 'tumor-marker-table', 'tumor-false-positive', 'other-birads'],\n    ",
      'slide-order additions'
    );

    source = replaceRequired(
      source,
      /bp: \['bp-start', 'bp-measurement', 'bp-categories', 'bp-confirm', 'bp-action'\],/,
      "bp: ['bp-start', 'body-bmi', 'body-waist', 'bp-measurement', 'bp-categories', 'bp-confirm', 'bp-action'],",
      'body-measurement slide order'
    );

    source = replaceRequired(
      source,
      /liver: \['liver-start', 'liver-panel', 'liver-followup', 'liver-masld', 'liver-hbv', 'liver-gallstone'\],/,
      "liver: ['liver-start', 'liver-panel', 'liver-followup', 'liver-masld', 'liver-hbv', 'liver-gallstone', 'alcohol-guide', 'alcohol-calculator'],",
      'liver slide order'
    );

    source += '\n//# sourceURL=app.patient-patched.js\n';
    const blob = new Blob([source], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    try {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.async = false;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Unable to execute patched app.js'));
        document.body.appendChild(script);
      });
    } finally {
      URL.revokeObjectURL(url);
    }
  })();
})();
