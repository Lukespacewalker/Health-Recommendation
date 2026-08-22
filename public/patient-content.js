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

  function setText(id, selector, text) {
    const node = query(id, selector);
    if (node) node.textContent = text;
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

  function refineCoverAndNavigation() {
    const subtitle = document.querySelector('#home .cover-subtitle');
    if (subtitle) subtitle.textContent = 'เลือกอ่านเฉพาะผลที่เกี่ยวข้อง • เข้าใจความหมาย • รู้ว่าควรทำอะไรต่อ';

    const pills = document.querySelector('#home .cover-pills');
    if (pills) {
      pills.innerHTML = `
        <span class="fragment fade-up">เริ่มจากค่าที่ผิดปกติ</span>
        <span class="fragment fade-up">ดูแนวโน้ม ไม่ดูค่าเดียว</span>
        <span class="fragment fade-up">แยกผลที่ควรติดตามเร็ว</span>
        <span class="fragment fade-up">เปิดหลักฐานต้นทางได้</span>`;
    }

    const coverNote = document.querySelector('#home .cover-note');
    if (coverNote) coverNote.innerHTML = `คู่มือประกอบการอธิบายผลตรวจสุขภาพ • ไม่ใช้แทนการวินิจฉัยหรือแผนรักษารายบุคคล • ทบทวนเนื้อหาล่าสุด ${REVIEW_DATE}`;

    setHtml('map', '.lead', 'เลือกหมวดจากผลที่อยู่ในรายงานของคุณ ไม่จำเป็นต้องอ่านทุกหน้า แต่ละหัวข้อจะตอบว่า <b>ค่านี้คืออะไร • ควรทำอะไรต่อ • เมื่อใดไม่ควรรอ</b>');
  }

  function refineDiabetes() {
    setHtml('hba1c-interpretation', '.lead', 'เกณฑ์ด้านล่างใช้สำหรับผู้ใหญ่ทั่วไป หากผลเข้าเกณฑ์เบาหวานครั้งแรกและไม่มีอาการชัดเจน มักต้องยืนยันด้วยการตรวจซ้ำหรือการตรวจน้ำตาลชนิดอื่น');
    addPatientBar(
      'hba1c-interpretation',
      'HbA1c เป็นภาพรวมน้ำตาลหลายสัปดาห์ จึงไม่แสดงยอดขึ้นลงทุกช่วงของวัน',
      'ดูผลร่วมกับน้ำตาลขณะอดอาหาร อาการ ยาที่ใช้ และผลเดิม',
      'หากผลไม่ตรงกับระดับน้ำตาล หรือมีธาลัสซีเมีย โลหิตจาง เสียเลือด ฟอกไต หรือเคยรับเลือด ให้แจ้งแพทย์ก่อนสรุปผล'
    );
  }

  function refineLipids() {
    const medication = document.querySelector('#ldl-control .control-column article:last-child p');
    if (medication) medication.textContent = 'แพทย์อาจพิจารณายาลดไขมันตามระดับความเสี่ยง ผลตอบสนอง โรคร่วม และผลข้างเคียง ไม่ควรเริ่ม เปลี่ยน หรือหยุดยาเองจากตัวเลขเพียงครั้งเดียว';

    setHtml('lipid-ratios', 'h2', 'ค่าคำนวณเสริมของไขมัน <small>ช่วยมองภาพรวม แต่ไม่ใช่เป้าหมายรักษาหลัก</small>');
    setHtml('lipid-ratios', '.lead', 'ใส่ค่าจากรายงานเพื่อดู non-HDL-C, remnant-C โดยประมาณ และอัตราส่วนต่าง ๆ ให้ใช้ค่าหลักและความเสี่ยงรวมเป็นตัวนำ ส่วน ratio ใช้เป็นข้อมูลประกอบเท่านั้น');

    addPatientBar(
      'lipid-targets',
      'ไม่มีค่า LDL-C เป้าหมายเดียวที่เหมาะกับทุกคน',
      'เริ่มจาก LDL-C, non-HDL-C และ TG แล้วประเมินความเสี่ยงหัวใจ เบาหวาน โรคไต และประวัติครอบครัว',
      'LDL-C ≥190 mg/dL หรือ TG ≥500 mg/dL ควรนัดประเมินเร็ว ไม่ควรรอให้มีอาการ',
      { tone: 'warning' }
    );
  }

  function rebuildThaiBloodPressureSlide() {
    const host = slide('bp-categories');
    if (!host) return;
    host.dataset.menuTitle = 'ระดับความดันตามแนวทางไทย 2567';
    host.innerHTML = `
      <div class="slide-kicker">BLOOD PRESSURE • 03.2</div>
      <h2>ความดันอยู่ระดับไหน <small>ใช้เกณฑ์แนวทางสมาคมความดันโลหิตสูงแห่งประเทศไทย พ.ศ. 2567</small></h2>
      <p class="lead">ใช้ค่าที่สูงกว่าระหว่างตัวบนและตัวล่าง แต่การวินิจฉัยไม่ควรอาศัยการวัดครั้งเดียว ควรวัดอย่างถูกวิธีและยืนยันด้วยค่าหลายครั้งหรือการวัดนอกสถานพยาบาลเมื่อเหมาะสม</p>
      <div class="thai-bp-grid">
        <article class="optimal"><b>เหมาะสมที่สุด</b><strong>&lt;120 และ &lt;80</strong></article>
        <article class="normal"><b>ปกติ</b><strong>120–129 และ &lt;80</strong></article>
        <article class="atrisk"><b>กลุ่มเสี่ยง</b><strong>130–139 หรือ 80–89</strong></article>
        <article class="grade1"><b>ความดันสูงระดับ 1</b><strong>140–159 หรือ 90–99</strong></article>
        <article class="grade2"><b>ความดันสูงระดับ 2</b><strong>160–179 หรือ 100–109</strong></article>
        <article class="grade3"><b>ความดันสูงระดับ 3</b><strong>≥180 หรือ ≥110</strong></article>
      </div>
      <div class="bp-patient-logic">
        <article><b>ยังไม่สรุปจากครั้งเดียว</b><span>ความเครียด คาเฟอีน การเดินเร็ว อาการปวด และผ้าพันแขนไม่พอดีทำให้ค่าสูงหลอกได้</span></article>
        <article><b>ยืนยันนอกคลินิกเมื่อเหมาะสม</b><span>ค่าที่บ้านหรือเครื่องวัด 24 ชั่วโมงช่วยค้นหา white-coat และ masked hypertension</span></article>
        <article><b>อาการสำคัญกว่าป้ายระดับ</b><span>ถ้าความดันสูงมากร่วมกับเจ็บหน้าอก หอบ อ่อนแรง ชา พูดไม่ชัด สับสน หรือมองเห็นผิดปกติ ให้ขอความช่วยเหลือฉุกเฉิน</span></article>
      </div>
      <div class="source-chips"><span>อ้างอิงต้นทาง</span><a href="${sources.bpThai}" rel="noopener noreferrer" target="_blank">Thai Hypertension Guideline 2024</a><a href="${sources.bpHome}" rel="noopener noreferrer" target="_blank">AHA: วัดความดันที่บ้าน</a></div>`;
  }

  function refineBlood() {
    const cbc = slide('blood-cbc-map');
    if (cbc && !cbc.querySelector('.lead')) {
      const lead = document.createElement('p');
      lead.className = 'lead';
      lead.textContent = 'CBC เป็นภาพรวมของเม็ดเลือดแดง เม็ดเลือดขาว และเกล็ดเลือด ค่าที่ผิดปกติหนึ่งค่าไม่สามารถบอกสาเหตุได้ทันที ต้องดูแนวโน้ม จำนวนจริง อาการ และผลตรวจประกอบ';
      cbc.querySelector('h2')?.insertAdjacentElement('afterend', lead);
    }

    addInlineNote('blood-iron', 'อย่าเริ่มธาตุเหล็กจาก MCV ต่ำอย่างเดียว', 'ควรยืนยันภาวะขาดธาตุเหล็กและหาสาเหตุของการเสียเลือดหรือการดูดซึมผิดปกติก่อนรับประทานต่อเนื่อง', 'warning');

    const inheritance = query('other-thal', '.inheritance');
    if (inheritance && !inheritance.querySelector('.thal-inheritance-note')) {
      const note = document.createElement('small');
      note.className = 'thal-inheritance-note';
      note.textContent = 'ภาพ 25/50/25 เป็นภาพจำของการถ่ายทอดแบบยีนด้อยบางคู่ ความเสี่ยงจริงของ alpha/beta thalassemia ขึ้นกับชนิดยีนของทั้งสองคน จึงควรตรวจคู่สมรสและรับคำปรึกษาเมื่อวางแผนมีบุตร';
      inheritance.appendChild(note);
    }
  }

  function refineKidney() {
    addInlineNote('kidney-egfr-uacr', 'อ่านสองค่าเป็นคู่', 'eGFR บอกกำลังกรองโดยประมาณ ส่วน uACR บอกโปรตีนรั่ว ผลผิดปกติครั้งเดียวไม่เท่ากับโรคไตเรื้อรัง', 'info');

    const calculator = query('kidney-calculator', '.egfr-calculator');
    if (calculator && !query('kidney-calculator', '.calculator-safety-note')) {
      const warning = document.createElement('div');
      warning.className = 'calculator-safety-note';
      warning.innerHTML = '<b>ก่อนลองคำนวณ:</b><span>ใช้เพื่อทำความเข้าใจเท่านั้น ไม่ใช้ในภาวะไตเปลี่ยนแปลงเฉียบพลัน ไม่ใช้ปรับยาเอง และอาจคลาดเคลื่อนเมื่อมวลกล้ามเนื้อสูงหรือต่ำมาก</span>';
      calculator.insertAdjacentElement('beforebegin', warning);
    }

    setText('kidney-calculator', '.egfr-risk-card > span', 'ภาพรวมจาก eGFR × uACR');
  }

  function refineLiverAndAlcohol() {
    setHtml('liver-panel', 'h2', 'ค่าตรวจตับแต่ละตัวบอกอะไร <small>ไม่ใช่ทุกค่าคือ “การทำงานของตับ”</small>');
    if (!query('liver-panel', '.lead')) {
      const lead = document.createElement('p');
      lead.className = 'lead';
      lead.textContent = 'ALT และ AST สะท้อนการบาดเจ็บของเซลล์มากกว่า “กำลังทำงาน” ของตับ ส่วน bilirubin, albumin และ INR ตอบคำถามคนละด้าน จึงต้องอ่านเป็นชุด';
      query('liver-panel', 'h2')?.insertAdjacentElement('afterend', lead);
    }

    setHtml('alcohol-guide', 'h2', 'แอลกอฮอล์: ยิ่งน้อยยิ่งลดความเสี่ยง <small>เลข 2/1 เป็นเพดาน ไม่ใช่โควตา</small>');
    setHtml('alcohol-guide', '.lead', 'ทางเลือกที่มีความเสี่ยงต่ำที่สุดคือไม่ดื่ม หากผู้ใหญ่เลือกดื่ม CDC ใช้เพดานไม่เกิน 2 U.S. standard drinks ในวันที่ดื่มสำหรับผู้ชาย และไม่เกิน 1 สำหรับผู้หญิง แต่แม้อยู่ต่ำกว่าเพดานก็ยังมีความเสี่ยง โดยเฉพาะมะเร็ง');
    setHtml('alcohol-guide', '.daily-limit-panel h3', 'เรียงจากทางเลือกที่เสี่ยงต่ำกว่า <small>U.S. standard drink = เอทานอล 14 กรัม</small>');

    const grid = query('alcohol-guide', '.daily-limit-grid');
    const zero = query('alcohol-guide', '.daily-limit-grid .less');
    if (grid && zero) grid.prepend(zero);

    setHtml('alcohol-calculator', 'h2', 'คำนวณปริมาณเอทานอล <small>กรัมเป็นค่าหลัก ส่วน “ดื่มมาตรฐาน” ขึ้นกับนิยามที่ใช้</small>');
    setHtml('alcohol-calculator', '.lead', 'เครื่องมือนี้ประมาณปริมาณเอทานอลจากปริมาตร ความเข้มข้น และจำนวนภาชนะ ไม่ได้คำนวณระดับแอลกอฮอล์ในเลือด ไม่ใช้ตัดสินว่าสามารถขับรถได้ และไม่รับรองความปลอดภัยเฉพาะบุคคล');

    const calculator = query('alcohol-calculator', '.alcohol-calculator');
    if (calculator && !query('alcohol-calculator', '.calculator-privacy-note')) {
      const privacy = document.createElement('div');
      privacy.className = 'calculator-privacy-note';
      privacy.innerHTML = '<b>ข้อมูลที่กรอก:</b><span>คำนวณในเบราว์เซอร์และไม่ได้ใช้เพื่อวินิจฉัย</span>';
      calculator.insertAdjacentElement('beforebegin', privacy);
    }

    const sexLabel = document.getElementById('alcohol-sex')?.closest('label')?.querySelector(':scope > span');
    if (sexLabel) sexLabel.textContent = 'เพดานอ้างอิงที่ใช้เปรียบเทียบ';

    const normalizeAlcoholOutput = () => {
      const drinks = Number(document.getElementById('alcohol-us-drinks')?.textContent || 0);
      const sex = document.getElementById('alcohol-sex')?.value === 'female' ? 'ผู้หญิง' : 'ผู้ชาย';
      const limit = sex === 'ผู้หญิง' ? 1 : 2;
      const headline = document.getElementById('alcohol-limit-headline');
      const copy = document.getElementById('alcohol-limit-copy');
      const status = document.getElementById('alcohol-limit-status');
      if (headline) {
        headline.textContent = drinks <= limit
          ? `ต่ำกว่าเพดานอ้างอิง ${sex} (${limit} U.S. drinks/วัน)`
          : `เกินเพดานอ้างอิง ${sex} (${limit} U.S. drinks/วัน)`;
      }
      if (copy) copy.textContent = 'ต่ำกว่าเพดานไม่ได้แปลว่าปลอดภัย ไม่ควรสะสมโควตาไปดื่มรวดเดียว และตัวเลขนี้ไม่ใช้ตัดสินการขับรถ';
      status?.classList.toggle('patient-over-limit', drinks > limit);
      status?.classList.toggle('patient-under-limit', drinks <= limit);
    };

    document.querySelectorAll('#alcohol-calculator input, #alcohol-calculator select, #alcohol-calculator button').forEach((node) => {
      node.addEventListener('input', () => setTimeout(normalizeAlcoholOutput, 0));
      node.addEventListener('change', () => setTimeout(normalizeAlcoholOutput, 0));
      node.addEventListener('click', () => setTimeout(normalizeAlcoholOutput, 0));
    });
    setTimeout(normalizeAlcoholOutput, 0);
  }

  refineCoverAndNavigation();
  refineDiabetes();
  refineLipids();
  rebuildThaiBloodPressureSlide();
  refineBlood();
  refineKidney();
  refineLiverAndAlcohol();
})();
