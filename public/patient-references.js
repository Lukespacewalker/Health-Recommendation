(() => {
  'use strict';
  const REVIEW_DATE = '22 สิงหาคม 2569';
  const refs = {
    home: [['MedlinePlus: อ่านผลแล็บ', 'https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/']],
    diabetes: [['NIDDK: A1C', 'https://www.niddk.nih.gov/health-information/diagnostic-tests/a1c-test']],
    lipids: [['AHA/ACC: ไขมันในเลือด', 'https://professional.heart.org/en/science-news/2026-guideline-on-the-management-of-dyslipidemia/top-things-to-know']],
    bp: [['แนวทางความดันโลหิตสูงไทย 2567', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12919385/']],
    blood: [['NHLBI: Anemia', 'https://www.nhlbi.nih.gov/health/anemia'], ['CDC: Thalassemia', 'https://www.cdc.gov/thalassemia/about/index.html']],
    kidney: [['KDIGO 2024', 'https://kdigo.org/guidelines/ckd-evaluation-and-management/']],
    liver: [['NIDDK: Liver disease', 'https://www.niddk.nih.gov/health-information/liver-disease']],
    cvd: [['AHA PREVENT', 'https://professional.heart.org/en/guidelines-and-statements/about-prevent-calculator']],
    cancer: [['NCI: Tumor markers', 'https://www.cancer.gov/about-cancer/diagnosis-staging/diagnosis/tumor-markers-fact-sheet']],
    vaccines: [['IDAT 2026', 'https://idthai.org/2015/files_upload/files/Recommended%20Adult%20and%20Elderly%20Immunization%202026.pdf']],
    vitamins: [['NIH ODS: Vitamin D', 'https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/']],
    bone: [['NIAMS: Bone density', 'https://www.niams.nih.gov/health-topics/bone-mineral-density-tests-what-numbers-mean']],
    eyes: [['NEI: Presbyopia', 'https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/presbyopia']],
    hearing: [['NIDCD: Hearing loss', 'https://www.nidcd.nih.gov/health/age-related-hearing-loss']],
    other: [['MedlinePlus: อ่านผลแล็บ', 'https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/']],
    summary: [['MedlinePlus: อ่านผลแล็บ', 'https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/']]
  };

  document.querySelectorAll('section.slide').forEach((item) => {
    let chips = item.querySelector('.source-chips');
    if (!chips) {
      chips = document.createElement('div');
      chips.className = 'source-chips';
      chips.setAttribute('aria-label', 'แหล่งอ้างอิงของสไลด์นี้');
      const links = refs[item.dataset.group || 'other'] || refs.other;
      chips.innerHTML = `<span>อ้างอิงต้นทาง</span>${links.map(([label, href]) => `<a href="${href}" rel="noopener noreferrer" target="_blank">${label}</a>`).join('')}`;
      item.appendChild(chips);
    }
    const label = chips.querySelector(':scope > span');
    if (label) label.textContent = 'อ้างอิงต้นทาง';
    chips.querySelectorAll('a').forEach((link) => {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      if (!link.getAttribute('aria-label')) link.setAttribute('aria-label', `เปิด ${link.textContent.trim()} ในแท็บใหม่`);
    });
  });

  const replacements = [
    ['known CVD', 'โรคหัวใจและหลอดเลือดที่วินิจฉัยแล้ว'],
    ['reclassify risk', 'ช่วยปรับระดับความเสี่ยง'],
    ['calcified plaque burden', 'ปริมาณคราบหินปูนในผนังหลอดเลือด'],
    ['noncalcified plaque', 'คราบไขมันที่ยังไม่เป็นหินปูน'],
    ['hemodynamics', 'การไหลเวียนและแรงดันเลือด'],
    ['residual risk', 'ความเสี่ยงที่ยังเหลือ'],
    ['secondary causes', 'สาเหตุจากโรค ยา หรือภาวะอื่น']
  ];
  document.querySelectorAll('.slide h1, .slide h2, .slide h3, .slide p, .slide span, .slide small, .slide li, .slide b').forEach((node) => {
    if (node.children.length) return;
    let text = node.textContent;
    replacements.forEach(([from, to]) => { text = text.replaceAll(from, to); });
    if (text !== node.textContent) node.textContent = text;
  });

  const fixCounts = () => {
    document.querySelectorAll('[data-count-group]').forEach((node) => {
      const next = node.textContent.replace(/\s*slides?\s*$/i, ' หัวข้อ');
      if (next !== node.textContent) node.textContent = next;
    });
  };
  fixCounts();
  const observer = new MutationObserver(fixCounts);
  observer.observe(document.body, { subtree: true, childList: true, characterData: true });
  setTimeout(() => observer.disconnect(), 4000);

  const final = document.querySelector('.final-line');
  if (final) final.textContent = `จัดทำโดย Suttisak Denduangchai • คู่มือประกอบการอธิบายผลตรวจสุขภาพ • ไม่ใช้แทนคำแนะนำเฉพาะบุคคล • ทบทวน ${REVIEW_DATE}`;
})();
