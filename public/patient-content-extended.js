(() => {
  'use strict';

  const REVIEW_DATE = '22 สิงหาคม 2569';
  const sources = {
    general: 'https://medlineplus.gov/lab-tests/how-to-understand-your-lab-results/',
    diabetes: 'https://www.niddk.nih.gov/health-information/diagnostic-tests/a1c-test',
    lipids: 'https://professional.heart.org/en/science-news/2026-guideline-on-the-management-of-dyslipidemia/top-things-to-know',
    bpThai: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12919385/',
    bpHome: 'https://www.heart.org/en/health-topics/high-blood-pressure/understanding-blood-pressure-readings/monitoring-your-blood-pressure-at-home',
    blood: 'https://www.nhlbi.nih.gov/health/anemia',
    thal: 'https://www.cdc.gov/thalassemia/about/index.html',
    kidney: 'https://kdigo.org/guidelines/ckd-evaluation-and-management/',
    liver: 'https://www.niddk.nih.gov/health-information/liver-disease',
    hbv: 'https://www.cdc.gov/hepatitis-b/hcp/diagnosis-testing/index.html',
    cvd: 'https://professional.heart.org/en/guidelines-and-statements/about-prevent-calculator',
    cac: 'https://www.heart.org/en/health-topics/heart-attack/diagnosing-a-heart-attack/cac-test',
    est: 'https://www.uspreventiveservicestaskforce.org/uspstf/document/RecommendationStatementFinal/cardiovascular-disease-risk-screening-with-electrocardiography',
    cancer: 'https://www.cancer.gov/about-cancer/diagnosis-staging/diagnosis/tumor-markers-fact-sheet',
    birads: 'https://www.acr.org/Clinical-Resources/Clinical-Tools-and-Reference/Reporting-and-Data-Systems/BI-RADS',
    vaccines: 'https://idthai.org/2015/files_upload/files/Recommended%20Adult%20and%20Elderly%20Immunization%202026.pdf',
    vitaminD: 'https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/',
    vitaminC: 'https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/',
    bone: 'https://www.niams.nih.gov/health-topics/bone-mineral-density-tests-what-numbers-mean',
    eyes: 'https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/presbyopia',
    hearing: 'https://www.nidcd.nih.gov/health/age-related-hearing-loss',
    pad: 'https://professional.heart.org/en/science-news/2024-guideline-for-the-management-of-lower-extremity-peripheral-artery-disease',
    alcohol: 'https://www.cdc.gov/alcohol/about-alcohol-use/moderate-alcohol-use.html'
  };

  const slide = (id) => document.getElementById(id);
  const query = (id, selector) => slide(id)?.querySelector(selector) || null;

  function setHtml(id, selector, html) {
    const node = query(id, selector);
    if (node) node.innerHTML = html;
    return node;
  }

  function insertBeforeSources(id, node) {
    const host = slide(id);
    if (!host || !node) return;
    const sourcesNode = host.querySelector('.source-chips');
    if (sourcesNode) host.insertBefore(node, sourcesNode);
    else host.appendChild(node);
  }

  function addPatientBar(id, remember, action, followup, options = {}) {
    const host = slide(id);
    if (!host || host.querySelector('.patient-guide-strip')) return;
    const bar = document.createElement('div');
    bar.className = `patient-guide-strip ${options.tone || ''}`.trim();
    bar.setAttribute('aria-label', 'สรุปสำหรับผู้รับผลตรวจ');
    bar.innerHTML = `
      <article><b>จำไว้</b><span>${remember}</span></article>
      <article><b>ทำอะไรต่อ</b><span>${action}</span></article>
      <article><b>${options.followupLabel || 'ติดตามเมื่อใด'}</b><span>${followup}</span></article>`;
    insertBeforeSources(id, bar);
  }

  function addInlineNote(id, title, text, tone = 'info') {
    const host = slide(id);
    if (!host || host.querySelector(`.patient-inline-note[data-note="${tone}"]`)) return;
    const note = document.createElement('div');
    note.className = `patient-inline-note ${tone}`;
    note.dataset.note = tone;
    note.innerHTML = `<b>${title}</b><span>${text}</span>`;
    insertBeforeSources(id, note);
  }

  function moveAfter(node, anchor) {
    if (node && anchor && node !== anchor) anchor.insertAdjacentElement('afterend', node);
  }

  function setGroup(id, group, section) {
    const node = slide(id);
    if (!node) return null;
    node.dataset.group = group;
    node.dataset.section = section;
    return node;
  }

  function reorganizeCardiovascularAndCancer() {
    const cvdStart = slide('cvd-start');
    const matrix = setGroup('cardiac-test-matrix', 'cvd', 'CARDIOVASCULAR');
    if (cvdStart && matrix) moveAfter(matrix, cvdStart);

    const risk = slide('cvd-risk-score');
    if (matrix && risk) moveAfter(risk, matrix);
    const cac = slide('cac');
    if (risk && cac) moveAfter(cac, risk);
    const est = slide('est');
    if (cac && est) moveAfter(est, cac);
    const echo = slide('echo');
    if (est && echo) moveAfter(echo, est);

    let anchor = echo || cac || matrix;
    ['other-pad', 'other-abi', 'other-cavi'].forEach((id) => {
      const node = setGroup(id, 'cvd', 'CARDIOVASCULAR');
      if (node && anchor) {
        moveAfter(node, anchor);
        anchor = node;
      }
    });

    const cvdOutline = query('cvd-start', '.chapter-outline');
    if (cvdOutline) {
      cvdOutline.className = 'chapter-outline chapter-outline-six patient-outline-six';
      cvdOutline.innerHTML = `
        <button class="chapter-outline-card" data-jump="cardiac-test-matrix" type="button"><b>07.1</b><span>เลือกการตรวจให้ตรงคำถาม</span><small>Risk score • CAC • EST • Echo ต่างกันอย่างไร</small></button>
        <button class="chapter-outline-card" data-jump="cvd-risk-score" type="button"><b>07.2</b><span>คะแนนความเสี่ยง</span><small>Thai CV Risk และ PREVENT</small></button>
        <button class="chapter-outline-card" data-jump="cac" type="button"><b>07.3</b><span>CT Calcium Score</span><small>คราบหินปูนและการแปลผล</small></button>
        <button class="chapter-outline-card" data-jump="est" type="button"><b>07.4</b><span>EST</span><small>ดูหัวใจขณะออกแรงเมื่อมีข้อบ่งชี้</small></button>
        <button class="chapter-outline-card" data-jump="echo" type="button"><b>07.5</b><span>Echo</span><small>ดูโครงสร้าง การบีบตัว และลิ้นหัวใจ</small></button>
        <button class="chapter-outline-card" data-jump="other-pad" type="button"><b>07.6</b><span>หลอดเลือดขา</span><small>PAD • ABI • CAVI</small></button>`;
    }

    setHtml('cardiac-test-matrix', '.lead', 'เริ่มจากคำถามทางคลินิกก่อนเลือกการตรวจ ผลปกติของการตรวจชนิดหนึ่งไม่สามารถใช้แทนอีกชนิดได้');
    setHtml('cardiac-test-matrix', '.bottom-banner', '<b>สำหรับผู้ตรวจสุขภาพที่ไม่มีอาการ:</b> เริ่มจากควบคุมความดัน ไขมัน น้ำตาล บุหรี่ และประเมินความเสี่ยง ส่วน EST, Echo หรือภาพถ่ายหัวใจควรทำเมื่อผลจะตอบคำถามหรือเปลี่ยนแผนดูแล');

    setHtml('cvd-risk-score', '.lead', 'คะแนนความเสี่ยงประมาณโอกาสเกิดโรคหัวใจและหลอดเลือดในอนาคตจากข้อมูลหลายด้าน ไม่ได้บอกว่าหลอดเลือดตีบกี่เปอร์เซ็นต์ และไม่ใช้แทนการประเมินอาการ');
    setHtml('cvd-risk-score', '.risk-meaning-list article:nth-child(1) span', 'คนกลุ่มที่มีข้อมูลใกล้เคียงกันมีโอกาสเกิดโรคประมาณเท่าไร');
    setHtml('cvd-risk-score', '.risk-meaning-list article:nth-child(2) span', 'หลอดเลือดของบุคคลนี้ตีบอยู่ตรงไหนหรือกี่เปอร์เซ็นต์');
    setHtml('cvd-risk-score', '.risk-meaning-list article:nth-child(3) span', 'ประวัติครอบครัว Lp(a) โรคไต โรคอักเสบเรื้อรัง และ CAC อาจทำให้แพทย์ปรับการตีความ');

    setHtml('cac', '.lead', 'CAC ใช้ดูปริมาณคราบหินปูนในผนังหลอดเลือดหัวใจ เพื่อช่วยปรับระดับความเสี่ยงในผู้ไม่มีอาการบางราย ไม่ใช่การตรวจฉุกเฉิน และไม่บอกเปอร์เซ็นต์การตีบแบบ CT coronary angiography');
    setHtml('cac', '.cac-key-grid article:nth-child(1) span', 'ปริมาณคราบหินปูนในผนังหลอดเลือด');
    setHtml('cac', '.cac-key-grid article:nth-child(2) span', 'ช่วยปรับระดับความเสี่ยงเมื่อผลจะเปลี่ยนแผนป้องกัน');
    setHtml('cac', '.cac-key-grid article:nth-child(3) span', 'คะแนน 0 ยังไม่ตัดคราบไขมันที่ยังไม่เป็นหินปูน');
    setHtml('cac', '.cac-key-grid article:nth-child(4) span', 'ใช้รังสีปริมาณต่ำ จึงควรตรวจเมื่อมีเหตุผล');

    addInlineNote('est', 'ไม่ใช่การตรวจคัดกรองประจำสำหรับทุกคน', 'ในผู้ไม่มีอาการและมีความเสี่ยงต่ำ การทำ exercise ECG เป็น routine อาจนำไปสู่ผลบวกลวงและการตรวจต่อที่ไม่จำเป็น ควรเลือกเมื่อมีคำถามทางคลินิกชัดเจน', 'warning');
    addInlineNote('echo', 'Echo ไม่ใช่ภาพหลอดเลือดหัวใจ', 'ผล Echo ปกติไม่ได้ตัดคราบไขมันในหลอดเลือดหัวใจ และ EF ปกติไม่ได้ตัดภาวะหัวใจล้มเหลวทุกชนิด', 'info');

    setHtml('other-cavi', 'h2', 'CAVI: ข้อมูลเสริมเรื่องความแข็งของหลอดเลือด <small>ไม่ใช่การตรวจยืนยันว่าหลอดเลือดตีบ</small>');
    setHtml('other-cavi', '.lead', 'CAVI เป็นตัวชี้วัดเสริมเกี่ยวกับความแข็งของหลอดเลือด ค่าอ้างอิงอาจต่างตามอายุ เครื่องมือ และประชากร จึงควรใช้เพื่อทบทวนปัจจัยเสี่ยงมาตรฐาน ไม่ใช้ค่าเดียวกำหนดการรักษา');
    const caviCopy = query('other-cavi', '.cavi-copy');
    if (caviCopy && !caviCopy.querySelector('.cavi-threshold-label')) {
      const label = document.createElement('div');
      label.className = 'cavi-threshold-label';
      label.textContent = 'ตัวอย่างช่วงที่ใช้ในระบบ CAVI บางแห่ง';
      caviCopy.prepend(label);
    }

    addPatientBar('other-pad', 'PAD อาจเป็นสัญญาณของหลอดเลือดแข็งทั้งระบบ ไม่ใช่ปัญหาเฉพาะขา', 'หยุดบุหรี่ คุมไขมัน ความดันและเบาหวาน ดูแลเท้า และออกกำลังตามคำแนะนำ', 'ขาซีด เย็น ชา อ่อนแรง หรือปวดฉับพลัน ให้ประเมินฉุกเฉิน', { tone: 'warning', followupLabel: 'ไม่ควรรอเมื่อ' });

    const biRads = setGroup('other-birads', 'cancer', 'CANCER / BREAST IMAGING');
    const falsePositive = slide('tumor-false-positive');
    if (biRads && falsePositive) moveAfter(biRads, falsePositive);

    slide('tumor-use')?.remove();

    const cancerOutline = query('cancer-start', '.chapter-outline');
    if (cancerOutline) {
      cancerOutline.className = 'chapter-outline patient-outline-five';
      cancerOutline.innerHTML = `
        <button class="chapter-outline-card" data-jump="tumor-marker" type="button"><b>08.1</b><span>สารบ่งชี้บอกอะไร</span><small>ผลสูงยังไม่ยืนยันมะเร็ง</small></button>
        <button class="chapter-outline-card" data-jump="tumor-body-map" type="button"><b>08.2</b><span>อวัยวะที่เกี่ยวข้อง</span><small>เป็นความสัมพันธ์ ไม่ใช่ตำแหน่งวินิจฉัย</small></button>
        <button class="chapter-outline-card" data-jump="tumor-marker-table" type="button"><b>08.3</b><span>รายการที่พบบ่อย</span><small>ใช้เพื่ออะไร และอะไรทำให้สูงได้</small></button>
        <button class="chapter-outline-card" data-jump="tumor-false-positive" type="button"><b>08.4</b><span>ขั้นตอนยืนยันผล</span><small>เตรียมรายงาน ผลเดิม อาการ และยา</small></button>
        <button class="chapter-outline-card" data-jump="other-birads" type="button"><b>08.5</b><span>BI-RADS</span><small>อ่านรหัสพร้อมขั้นตอนถัดไป</small></button>`;
    }

    const bodyMap = query('tumor-body-map', '.tumor-map-layout');
    if (bodyMap && !query('tumor-body-map', '.marker-map-warning')) {
      const warning = document.createElement('div');
      warning.className = 'marker-map-warning';
      warning.innerHTML = '<b>แผนภาพนี้ไม่สามารถบอกตำแหน่งมะเร็งได้</b><span>อวัยวะที่ไฮไลต์แสดงเพียงความสัมพันธ์ที่พบได้ หนึ่ง marker อาจสูงจากหลายโรค และโรคที่ไม่ใช่มะเร็งก็ทำให้สูงได้</span>';
      bodyMap.insertAdjacentElement('beforebegin', warning);
    }

    const verify = query('tumor-false-positive', '.verification-flow');
    if (verify && !query('tumor-false-positive', '.patient-prep-checklist')) {
      const checklist = document.createElement('div');
      checklist.className = 'patient-prep-checklist';
      checklist.innerHTML = '<b>เตรียมก่อนพบแพทย์</b><span>รายงานฉบับเต็มและหน่วย</span><span>ผลเดิม</span><span>อาการ</span><span>ยาและอาหารเสริม</span><span>ประวัติการตั้งครรภ์/สูบบุหรี่/โรคตับตามบริบท</span>';
      verify.insertAdjacentElement('afterend', checklist);
    }

    addInlineNote('tumor-marker', 'อย่าใช้ tumor marker แทนการคัดกรองที่มีหลักฐาน', 'การคัดกรองตามอายุและความเสี่ยง เช่น ปากมดลูก เต้านม หรือลำไส้ใหญ่ มีหลักฐานและขั้นตอนติดตามเฉพาะ ไม่ควรสั่ง marker แบบเหวี่ยงแหเพื่อแทนการคัดกรองเหล่านี้', 'warning');

    const otherOutline = query('other-start', '.chapter-outline');
    if (otherOutline) {
      otherOutline.className = 'chapter-outline';
      otherOutline.innerHTML = `
        <button class="chapter-outline-card" data-jump="other-followup" type="button"><b>14.1</b><span>ผลตรวจอื่นที่พบบ่อย</span><small>น้ำหนัก • ปัสสาวะ • ไทรอยด์ • อุจจาระ</small></button>
        <button class="chapter-outline-card" data-jump="references-tests" type="button"><b>REF</b><span>อ้างอิงต้นทาง</span><small>เปิดแนวทางและข้อมูลสำหรับประชาชน</small></button>`;
    }
    setHtml('other-start', '.lead', 'หมวดนี้รวมผลที่ยังไม่อยู่ในหมวดหลัก เช่น น้ำหนัก ปัสสาวะ ไทรอยด์ และอุจจาระ ให้ทำตามขั้นตอนถัดไปที่ระบุในรายงานและดูอาการร่วม');

    const mapCvd = document.querySelector('.module-card.cvd p');
    if (mapCvd) mapCvd.textContent = 'Risk score • Calcium score • EST • Echo • PAD/ABI/CAVI';
    const mapCancer = document.querySelector('.module-card.cancer p');
    if (mapCancer) mapCancer.textContent = 'Tumor markers • การยืนยันผล • BI-RADS';
    const mapOther = document.querySelector('.module-card.other p');
    if (mapOther) mapOther.textContent = 'น้ำหนัก • ปัสสาวะ • ไทรอยด์ • อุจจาระ';
  }

  function refineVitaminsAndBone() {
    setHtml('vitamins-start', '.lead', 'คนทั่วไปไม่จำเป็นต้องตรวจวิตามินทุกชนิด การตรวจและการเสริมควรตอบคำถามจากอาการ อาหาร ปัจจัยเสี่ยง โรค หรือยาที่ใช้ ไม่ควรตั้งเป้าว่าค่ายิ่งสูงยิ่งดี');

    const sunCopy = query('vitamin-d-sun-dose', '.sun-panel p');
    if (sunCopy) sunCopy.textContent = 'ไม่มีเวลารับแดดที่เหมาะกับทุกคน เพราะสีผิว เวลา เมฆ เสื้อผ้า อายุ และดัชนี UV มีผลมาก หลีกเลี่ยงผิวแดงหรือไหม้ และใช้แหล่งอาหารหรืออาหารเสริมตามข้อบ่งชี้เมื่อจำเป็น';

    addInlineNote('vitamin-d-sun-dose', 'อย่าเพิ่มขนาดจากตัวเลขเดียว', 'การเสริมวิตามิน D ควรดูผลตรวจ หน่วย โรคร่วม ยา แคลเซียม และความเสี่ยงเฉพาะบุคคล ขนาดสูงเป็นเวลานานอาจเป็นอันตราย', 'warning');
    addInlineNote('vitamin-c', 'เริ่มจากอาหารและหาสาเหตุของค่าต่ำ', 'คนทั่วไปมักไม่จำเป็นต้องใช้วิตามิน C ขนาดสูง หากผลต่ำจริงหรือมีอาการ ควรทบทวนอาหาร การสูบบุหรี่ การดูดซึม และโรคเรื้อรัง', 'info');

    addPatientBar('bone-followup', 'DXA วัดความหนาแน่นแร่ธาตุ แต่ความเสี่ยงกระดูกหักยังขึ้นกับอายุ การหกล้ม ยา และประวัติกระดูกหัก', 'ออกกำลังลงน้ำหนักและแรงต้าน ดูแลโปรตีนและแคลเซียมจากอาหาร ป้องกันการหกล้ม และทบทวนยา', 'ช่วงตรวจซ้ำและการใช้ยาขึ้นกับผลเดิมและความเสี่ยง ไม่จำเป็นต้องตรวจทุกปีในทุกคน');
  }

  function ensureReferencesOnEverySlide() {
    const byGroup = {
      home: [['MedlinePlus: อ่านผลแล็บ', sources.general]],
      diabetes: [['NIDDK: A1C', sources.diabetes]],
      lipids: [['AHA/ACC: ไขมันในเลือด', sources.lipids]],
      bp: [['แนวทางความดันโลหิตสูงไทย 2567', sources.bpThai]],
      blood: [['NHLBI: Anemia', sources.blood], ['CDC: Thalassemia', sources.thal]],
      kidney: [['KDIGO 2024', sources.kidney]],
      liver: [['NIDDK: Liver disease', sources.liver]],
      cvd: [['AHA PREVENT', sources.cvd]],
      cancer: [['NCI: Tumor markers', sources.cancer]],
      vaccines: [['IDAT 2026', sources.vaccines]],
      vitamins: [['NIH ODS: Vitamin D', sources.vitaminD]],
      bone: [['NIAMS: Bone density', sources.bone]],
      eyes: [['NEI: Presbyopia', sources.eyes]],
      hearing: [['NIDCD: Hearing loss', sources.hearing]],
      other: [['MedlinePlus: อ่านผลแล็บ', sources.general]],
      summary: [['MedlinePlus: อ่านผลแล็บ', sources.general]]
    };

    document.querySelectorAll('section.slide').forEach((item) => {
      let chips = item.querySelector('.source-chips');
      if (!chips) {
        chips = document.createElement('div');
        chips.className = 'source-chips';
        chips.setAttribute('aria-label', 'แหล่งอ้างอิงของสไลด์นี้');
        const links = byGroup[item.dataset.group || 'other'] || byGroup.other;
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
  }

  function normalizeVisibleLanguage() {
    const replacements = [
      ['known CVD', 'โรคหัวใจและหลอดเลือดที่วินิจฉัยแล้ว'],
      ['reclassify risk', 'ช่วยปรับระดับความเสี่ยง'],
      ['calcified plaque burden', 'ปริมาณคราบหินปูนในผนังหลอดเลือด'],
      ['noncalcified plaque', 'คราบไขมันที่ยังไม่เป็นหินปูน'],
      ['hemodynamics', 'การไหลเวียนและแรงดันเลือด'],
      ['residual risk', 'ความเสี่ยงที่ยังเหลือ'],
      ['secondary causes', 'สาเหตุจากโรค ยา หรือภาวะอื่น'],
      ['patient-guidance', 'คำแนะนำสำหรับผู้รับผลตรวจ']
    ];

    document.querySelectorAll('.slide h1, .slide h2, .slide h3, .slide p, .slide span, .slide small, .slide li, .slide b').forEach((node) => {
      if (node.children.length) return;
      let text = node.textContent;
      replacements.forEach(([from, to]) => { text = text.replaceAll(from, to); });
      if (text !== node.textContent) node.textContent = text;
    });
  }

  function keepThaiModuleCounts() {
    const fix = () => {
      document.querySelectorAll('[data-count-group]').forEach((node) => {
        const next = node.textContent.replace(/\s*slides?\s*$/i, ' หัวข้อ');
        if (next !== node.textContent) node.textContent = next;
      });
    };
    fix();
    const observer = new MutationObserver(fix);
    observer.observe(document.body, { subtree: true, childList: true, characterData: true });
    setTimeout(() => observer.disconnect(), 4000);
  }

  function addReviewMetadata() {
    const final = document.querySelector('.final-line');
    if (final) final.textContent = `จัดทำโดย Suttisak Denduangchai • คู่มือประกอบการอธิบายผลตรวจสุขภาพ • ไม่ใช้แทนคำแนะนำเฉพาะบุคคล • ทบทวน ${REVIEW_DATE}`;
  }

  reorganizeCardiovascularAndCancer();
  refineVitaminsAndBone();
  normalizeVisibleLanguage();
  ensureReferencesOnEverySlide();
  keepThaiModuleCounts();
  addReviewMetadata();
})();
