(() => {
  'use strict';

  const qs = (selector, root = document) => root.querySelector(selector);
  const slide = (id) => document.getElementById(id);
  const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));

  const sources = {
    bmiThai: 'https://www.dmthai.org/new/index.php/sara-khwam-ru/sahrab-bukhkhl-thawpi/evaluation-form',
    bpThai: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12919385/',
    cleanUrine: 'https://medlineplus.gov/ency/article/007487.htm',
    hematuria: 'https://www.niddk.nih.gov/health-information/urologic-diseases/hematuria-blood-urine',
    uacr: 'https://medlineplus.gov/lab-tests/microalbumin-creatinine-ratio/',
    fobt: 'https://medlineplus.gov/lab-tests/fecal-occult-blood-test-fobt/',
    fit: 'https://medlineplus.gov/ency/patientinstructions/000704.htm',
    thyroid: 'https://www.niddk.nih.gov/health-information/diagnostic-tests/thyroid',
    hypothyroid: 'https://www.niddk.nih.gov/health-information/endocrine-diseases/hypothyroidism',
    hyperthyroid: 'https://www.niddk.nih.gov/health-information/endocrine-diseases/hyperthyroidism',
    biotin: 'https://www.thyroid.org/patient-thyroid-information/ct-for-patients/january-2022/vol-15-issue-1-p-7-8/'
  };

  function sourceChips(items) {
    return `<div aria-label="แหล่งอ้างอิงของสไลด์นี้" class="source-chips"><span>อ้างอิงต้นทาง</span>${items.map(([label, href]) => `<a aria-label="เปิด ${escapeHtml(label)} ในแท็บใหม่" href="${href}" rel="noopener noreferrer" target="_blank">${escapeHtml(label)}</a>`).join('')}</div>`;
  }

  function makeSlide(id, group, menuTitle, section, inner, extraClass = '') {
    const node = document.createElement('section');
    node.id = id;
    node.className = `slide ${extraClass}`.trim();
    node.dataset.group = group;
    node.dataset.menuTitle = menuTitle;
    node.dataset.section = section;
    node.dataset.transition = 'fade';
    node.innerHTML = inner;
    return node;
  }

  function insertAfter(node, anchor) {
    if (node && anchor) anchor.insertAdjacentElement('afterend', node);
  }

  function replaceChapterNumber(id, number) {
    const host = slide(id);
    const numberNode = host?.querySelector('.chapter-number');
    if (numberNode) numberNode.textContent = number;
  }

  function replaceOutlinePrefix(id, number) {
    slide(id)?.querySelectorAll('.chapter-outline-card > b').forEach((node) => {
      if (/^\d{1,2}\./.test(node.textContent.trim())) {
        node.textContent = node.textContent.trim().replace(/^\d{1,2}(?=\.)/, String(Number(number)));
      }
    });
  }

  function replaceKickerNumber(group, number) {
    document.querySelectorAll(`section.slide[data-group="${group}"] .slide-kicker`).forEach((node) => {
      node.textContent = node.textContent.replace(/\b\d{1,2}(?=\.\d+)/g, String(Number(number)));
    });
  }

  function rebuildTopNavigation() {
    const nav = document.getElementById('chapter-tabs');
    if (!nav) return;
    const chapters = [
      ['home', 'หน้าแรก'],
      ['diabetes', '01 เบาหวาน'],
      ['lipids', '02 ไขมัน'],
      ['bp', '03 น้ำหนัก/ความดัน'],
      ['blood', '04 เลือด'],
      ['kidney', '05 ไต'],
      ['other', '06 ปัสสาวะ/อุจจาระ'],
      ['liver', '07 ตับ'],
      ['thyroid', '08 ไทรอยด์'],
      ['cvd', '09 หัวใจ'],
      ['cancer', '10 มะเร็ง'],
      ['vaccines', '11 วัคซีน'],
      ['vitamins', '12 วิตามิน'],
      ['bone', '13 มวลกระดูก'],
      ['eyes', '14 ตา'],
      ['hearing', '15 หู']
    ];
    nav.innerHTML = chapters.map(([group, label]) => `<button data-target-group="${group}" type="button">${label}</button>`).join('');
  }

  function rebuildModuleMap() {
    const map = qs('#map .module-map');
    if (!map) return;
    map.className = 'module-map module-map-fifteen';
    const cards = [
      ['diabetes', 'diabetes-start', '01', 'เบาหวาน', 'HbA1c • GI/GL • อาหาร'],
      ['lipids', 'lipids-start', '02', 'ไขมันในเลือด', 'LDL-C • TG • ApoB • Lp(a)'],
      ['bp', 'bp-start', '03', 'น้ำหนักและความดัน', 'น้ำหนัก • BMI • รอบเอว • BP'],
      ['blood', 'blood-start', '04', 'เลือดและ CBC', 'โลหิตจาง • ธาตุเหล็ก • ธาลัสซีเมีย'],
      ['kidney', 'kidney-start', '05', 'ไต', 'eGFR • uACR • นิ่วในไต'],
      ['other', 'other-start', '06', 'ปัสสาวะและอุจจาระ', 'Urinalysis • FIT/FOBT • การเก็บตัวอย่าง'],
      ['liver', 'liver-start', '07', 'ตับและถุงน้ำดี', 'ค่าตับ • MASLD • HBV • แอลกอฮอล์'],
      ['thyroid', 'thyroid-start', '08', 'ไทรอยด์', 'TSH • FT4 • รูปแบบผล • การติดตาม'],
      ['cvd', 'cvd-start', '09', 'หัวใจและหลอดเลือด', 'Risk score • CAC • EST • Echo • PAD'],
      ['cancer', 'cancer-start', '10', 'มะเร็งและการคัดกรอง', 'Tumor markers • BI-RADS • การยืนยันผล'],
      ['vaccines', 'vaccines-start', '11', 'วัคซีนผู้ใหญ่', 'วัคซีนพื้นฐาน • อายุ • โรคร่วม'],
      ['vitamins', 'vitamins-start', '12', 'วิตามิน', 'วิตามิน D • วิตามิน C • ข้อควรระวัง'],
      ['bone', 'bone-start', '13', 'มวลกระดูก', 'DXA • T-score • Z-score • ความเสี่ยงหัก'],
      ['eyes', 'eyes-start', '14', 'ตา', 'สายตายาวตามวัย • การมองสี'],
      ['hearing', 'hearing-start', '15', 'หูและการได้ยิน', 'หูตึงตามวัย • เสียงดัง • Audiogram']
    ];
    map.innerHTML = cards.map(([group, target, number, title, description]) => `
      <button class="module-card ${group}" data-jump="${target}" data-readable-card="" type="button">
        <b>${number}</b><h3>${title}</h3><p>${description}</p><span data-count-group="${group}">กำลังนับหัวข้อ</span>
      </button>`).join('');
  }

  function buildBodyAndBloodPressureChapter() {
    const start = slide('bp-start');
    if (!start) return;
    start.dataset.menuTitle = 'น้ำหนักตัว รอบเอว และความดันโลหิต';
    start.dataset.section = 'น้ำหนัก รอบเอว และความดัน';
    replaceChapterNumber('bp-start', '03');
    const title = start.querySelector('h2');
    const lead = start.querySelector('.lead');
    if (title) title.textContent = 'น้ำหนักตัว รอบเอว และความดันโลหิต';
    if (lead) lead.textContent = 'อ่านแนวโน้มน้ำหนักและรอบเอวร่วมกับความดัน น้ำตาล และไขมัน เพราะตัวเลขแต่ละค่าเป็นเครื่องมือคัดกรอง ไม่ใช่คำตัดสินสุขภาพเพียงค่าเดียว';
    const outline = start.querySelector('.chapter-outline');
    if (outline) {
      outline.className = 'chapter-outline chapter-outline-six patient-outline-six';
      outline.innerHTML = `
        <button class="chapter-outline-card" data-jump="body-bmi" type="button"><b>03.1</b><span>น้ำหนักและ BMI</span><small>สูตร ช่วงอ้างอิง และข้อจำกัด</small></button>
        <button class="chapter-outline-card" data-jump="body-waist" type="button"><b>03.2</b><span>รอบเอว</span><small>ไขมันหน้าท้องและวิธีวัด</small></button>
        <button class="chapter-outline-card" data-jump="bp-measurement" type="button"><b>03.3</b><span>วัดความดันให้แม่น</span><small>พัก ท่านั่ง cuff และวัดซ้ำ</small></button>
        <button class="chapter-outline-card" data-jump="bp-categories" type="button"><b>03.4</b><span>ระดับความดัน</span><small>ใช้เกณฑ์ไทยและดูค่าที่สูงกว่า</small></button>
        <button class="chapter-outline-card" data-jump="bp-confirm" type="button"><b>03.5</b><span>ยืนยันผล</span><small>ค่าที่บ้านและเครื่องวัด 24 ชั่วโมง</small></button>
        <button class="chapter-outline-card" data-jump="bp-action" type="button"><b>03.6</b><span>ทำอะไรต่อ</span><small>ปรับพฤติกรรม นัดติดตาม และอาการฉุกเฉิน</small></button>`;
    }

    if (!slide('body-bmi')) {
      const bmi = makeSlide('body-bmi', 'bp', 'น้ำหนักและ BMI', 'BODY MEASUREMENTS', `
        <div class="slide-kicker">BODY MEASUREMENTS • 03.1</div>
        <h2>น้ำหนักและ BMI <small>ดูแนวโน้ม มากกว่าตัดสินจากเลขครั้งเดียว</small></h2>
        <p class="lead">BMI ช่วยคัดกรองความเสี่ยงจากน้ำหนักเมื่อเทียบกับส่วนสูง แต่ไม่สามารถบอกสัดส่วนไขมัน กล้ามเนื้อ หรือสุขภาพของแต่ละคนได้ทั้งหมด</p>
        <div class="body-metrics-layout">
          <div class="bmi-formula panel"><span>BMI</span><strong>น้ำหนัก (kg) ÷ ส่วนสูง² (m²)</strong><p>ชั่งด้วยเครื่องเดิม เวลาใกล้เคียงกัน และดูแนวโน้มหลายครั้ง</p></div>
          <div class="bmi-bands panel">
            <article><b>&lt;18.5</b><span>น้ำหนักต่ำ</span></article>
            <article><b>18.5–22.9</b><span>ช่วงอ้างอิงที่ใช้บ่อยในผู้ใหญ่เอเชีย</span></article>
            <article><b>23.0–24.9</b><span>ความเสี่ยงเมตาบอลิกเริ่มเพิ่ม</span></article>
            <article><b>≥25</b><span>เข้ากลุ่มอ้วนตามเกณฑ์เอเชีย/ไทยที่ใช้บ่อย</span></article>
          </div>
        </div>
        <div class="patient-guide-strip"><article><b>จำไว้</b><span>BMI เป็นเครื่องมือคัดกรอง ไม่ใช่คะแนนคุณค่าหรือคำวินิจฉัย</span></article><article><b>ดูร่วมกับ</b><span>รอบเอว ความดัน HbA1c ไขมัน การนอน ยา และแนวโน้มน้ำหนัก</span></article><article><b>ควรประเมินเพิ่มเมื่อ</b><span>น้ำหนักเปลี่ยนเร็วโดยไม่ตั้งใจ บวม อ่อนแรง หรือกินได้ลดลง</span></article></div>
        ${sourceChips([['สมาคมโรคเบาหวานฯ: แบบประเมินความเสี่ยง', sources.bmiThai]])}`);
      insertAfter(bmi, start);
    }

    if (!slide('body-waist')) {
      const waist = makeSlide('body-waist', 'bp', 'รอบเอวและไขมันหน้าท้อง', 'BODY MEASUREMENTS', `
        <div class="slide-kicker">BODY MEASUREMENTS • 03.2</div>
        <h2>รอบเอว <small>ช่วยมองไขมันสะสมบริเวณช่องท้อง</small></h2>
        <p class="lead">รอบเอวช่วยเสริมข้อมูลจาก BMI โดยเฉพาะเมื่อ BMI ดูไม่สูงมากแต่มีไขมันสะสมบริเวณหน้าท้อง</p>
        <div class="waist-layout">
          <div class="waist-how panel"><h3>วัดอย่างไร</h3><ol><li>ยืนตรง เท้าห่างเล็กน้อย</li><li>วางสายวัดรอบเอวในแนวราบ ไม่รัดผิว</li><li>วัดหลังหายใจออกตามปกติ</li><li>ใช้ตำแหน่งเดียวกันทุกครั้งและบันทึกหน่วยเซนติเมตร</li></ol></div>
          <div class="waist-thresholds panel"><h3>จุดที่ควรใส่ใจในผู้ใหญ่ไทย</h3><article class="male"><span>ผู้ชาย</span><b>≥90 cm</b></article><article class="female"><span>ผู้หญิง</span><b>≥80 cm</b></article><p>ใช้เป็นสัญญาณให้ทบทวนความดัน น้ำตาล ไขมัน การนอน และกิจกรรมทางกาย ไม่ใช่คำวินิจฉัยจากสายวัดเพียงครั้งเดียว</p></div>
        </div>
        <div class="patient-inline-note info"><b>เป้าหมายที่มีความหมาย</b><span>การลดรอบเอวและน้ำหนักเพียงบางส่วนอย่างต่อเนื่องมักมีประโยชน์กว่าการลดเร็วแล้วกลับขึ้นใหม่</span></div>
        ${sourceChips([['สมาคมโรคเบาหวานฯ: รอบเอวและ BMI', sources.bmiThai], ['แนวทางความดันไทย 2567', sources.bpThai]])}`);
      insertAfter(waist, slide('body-bmi') || start);
    }
  }

  function buildUrineAndStoolChapter() {
    const start = slide('other-start');
    const collection = slide('other-followup');
    if (!start || !collection) return;

    start.dataset.menuTitle = 'ผลตรวจปัสสาวะและอุจจาระ';
    start.dataset.section = 'ปัสสาวะและอุจจาระ';
    replaceChapterNumber('other-start', '06');
    const title = start.querySelector('h2');
    const lead = start.querySelector('.lead');
    if (title) title.textContent = 'ผลตรวจปัสสาวะและอุจจาระ';
    if (lead) lead.textContent = 'ทั้งสองเป็นผลจากสิ่งส่งตรวจที่เก็บได้ง่าย แต่ตอบคนละระบบ จึงรวมไว้ในหมวดเดียวเพื่อค้นหาได้สะดวกและแยกการอธิบายเป็นคนละหัวข้อ';
    const outline = start.querySelector('.chapter-outline');
    if (outline) {
      outline.className = 'chapter-outline';
      outline.innerHTML = `
        <button class="chapter-outline-card" data-jump="other-followup" type="button"><b>06.1</b><span>เก็บตัวอย่างให้ถูก</span><small>ลดการปนเปื้อนและผลคลาดเคลื่อน</small></button>
        <button class="chapter-outline-card" data-jump="urinalysis" type="button"><b>06.2</b><span>ผลตรวจปัสสาวะ</span><small>เลือด โปรตีน เม็ดเลือดขาว nitrite น้ำตาล</small></button>
        <button class="chapter-outline-card" data-jump="stool-tests" type="button"><b>06.3</b><span>ผลตรวจอุจจาระ</span><small>FIT/FOBT เลือดแฝง และการตรวจตามอาการ</small></button>`;
    }

    collection.dataset.menuTitle = 'เก็บตัวอย่างปัสสาวะและอุจจาระ';
    collection.dataset.section = 'URINE & STOOL';
    collection.innerHTML = `
      <div class="slide-kicker">URINE & STOOL • 06.1</div>
      <h2>เก็บตัวอย่างให้ถูก <small>ลดการปนเปื้อนก่อนแปลผล</small></h2>
      <p class="lead">ผลผิดปกติเล็กน้อยอาจมาจากวิธีเก็บตัวอย่าง ประจำเดือน การออกกำลังหนัก ภาวะขาดน้ำ หรือการเก็บไม่ตรงคำแนะนำ</p>
      <div class="sample-collection-grid">
        <article class="panel"><h3>ปัสสาวะกลางสาย</h3><ol><li>ล้างมือและทำความสะอาดบริเวณปัสสาวะ</li><li>ปล่อยปัสสาวะช่วงแรกลงโถ</li><li>เก็บช่วงกลางโดยไม่ให้ภาชนะสัมผัสร่างกาย</li><li>ปิดฝาและส่งตามเวลาที่กำหนด</li></ol></article>
        <article class="panel"><h3>อุจจาระ</h3><ol><li>ทำตามชุดตรวจของห้องปฏิบัติการ</li><li>หลีกเลี่ยงการปนกับปัสสาวะ น้ำ หรือสารทำความสะอาด</li><li>เก็บจากตำแหน่งที่กำหนดและปิดภาชนะให้สนิท</li><li>ส่งภายในเวลาที่ระบุ เพราะการตรวจแต่ละชนิดต่างกัน</li></ol></article>
      </div>
      <div class="patient-inline-note warning"><b>แจ้งก่อนเก็บ</b><span>มีประจำเดือน เลือดออกจากริดสีดวง ใช้ยาต้านการแข็งตัวของเลือด มีไข้ ปวดเอว ปัสสาวะแสบขัด หรือถ่ายเป็นเลือด</span></div>
      ${sourceChips([['MedlinePlus: Clean-catch urine', sources.cleanUrine], ['MedlinePlus: FOBT', sources.fobt]])}`;

    if (!slide('urinalysis')) {
      const urine = makeSlide('urinalysis', 'other', 'อ่านผลตรวจปัสสาวะ', 'URINE & STOOL', `
        <div class="slide-kicker">URINE & STOOL • 06.2</div>
        <h2>ผลตรวจปัสสาวะบอกอะไร <small>หนึ่งช่องผิดปกติยังไม่บอกสาเหตุทั้งหมด</small></h2>
        <p class="lead">Urinalysis เป็นการคัดกรองหลายอย่างพร้อมกัน ผลต้องอ่านร่วมกับอาการ วิธีเก็บตัวอย่าง และการตรวจยืนยัน</p>
        <div class="urine-result-grid">
          <article><b>เลือด</b><span>อาจมาจากการปนเปื้อน การติดเชื้อ นิ่ว การออกกำลัง หรือโรคทางเดินปัสสาวะและไต</span></article>
          <article><b>โปรตีน</b><span>dipstick เป็นการคัดกรอง หากพบต่อเนื่องอาจต้องตรวจ uACR หรือการตรวจเฉพาะอื่น</span></article>
          <article><b>เม็ดเลือดขาว / nitrite</b><span>อาจสนับสนุนการติดเชื้อ แต่ต้องดูอาการและคุณภาพตัวอย่าง</span></article>
          <article><b>Glucose / ketone</b><span>อาจสัมพันธ์กับระดับน้ำตาล ยา การอดอาหาร หรือภาวะอื่น ไม่ใช้แทนการตรวจเลือด</span></article>
        </div>
        <div class="patient-guide-strip warning"><article><b>ทำอะไรต่อ</b><span>ถ้าผิดปกติเล็กน้อยและไม่มีอาการ แพทย์อาจให้เก็บตัวอย่างสะอาดซ้ำก่อนตรวจต่อ</span></article><article><b>เชื่อมกับหมวดไต</b><span>โปรตีนรั่วควรดู uACR และ eGFR ร่วมกัน</span></article><article><b>ไม่ควรรอเมื่อ</b><span>ปัสสาวะเป็นเลือดชัด ไข้ร่วมกับปวดเอว ปัสสาวะไม่ออก หรือปวดรุนแรง</span></article></div>
        ${sourceChips([['NIDDK: เลือดในปัสสาวะ', sources.hematuria], ['MedlinePlus: uACR', sources.uacr], ['MedlinePlus: Clean-catch urine', sources.cleanUrine]])}`);
      insertAfter(urine, collection);
    }

    if (!slide('stool-tests')) {
      const stool = makeSlide('stool-tests', 'other', 'อ่านผลตรวจอุจจาระ', 'URINE & STOOL', `
        <div class="slide-kicker">URINE & STOOL • 06.3</div>
        <h2>ผลตรวจอุจจาระ <small>FIT/FOBT กับการตรวจหาเชื้อหรือพยาธิตอบคนละคำถาม</small></h2>
        <p class="lead">ชื่อการตรวจสำคัญมาก เพราะผล “เลือดแฝง” ไม่ใช่การตรวจชนิดเดียวกับการตรวจเชื้อ พยาธิ หรือเม็ดเลือดขาวในอุจจาระ</p>
        <div class="stool-test-grid">
          <article class="panel"><h3>FIT / FOBT</h3><p>ค้นหาเลือดที่มองไม่เห็นด้วยตา ผลบวกหมายถึงมีเลือดออกที่ต้องหาสาเหตุ ไม่ได้ยืนยันมะเร็ง</p><strong>ขั้นถัดไปมักเป็นการประเมินลำไส้ใหญ่ตามแนวทาง ไม่ควรตรวจซ้ำเองเพื่อหวังให้ผลลบ</strong></article>
          <article class="panel"><h3>Stool examination</h3><p>อาจดูพยาธิ เม็ดเลือด การอักเสบ หรือเชื้อตามอาการและความเสี่ยง ตัวอย่างเพียงครั้งเดียวอาจไม่ตอบทุกสาเหตุ</p><strong>เลือกตรวจตามอาการ การเดินทาง อาหาร น้ำ และระยะเวลาที่มีอาการ</strong></article>
        </div>
        <div class="patient-guide-strip warning"><article><b>จำไว้</b><span>FIT/FOBT เป็นการคัดกรองหรือค้นหาเลือด ไม่ใช่คำวินิจฉัยมะเร็ง</span></article><article><b>ทำอะไรต่อ</b><span>ทำตามขั้นตอนที่ระบุในรายงานและแจ้งยาที่เพิ่มความเสี่ยงเลือดออก</span></article><article><b>ไม่ควรรอเมื่อ</b><span>ถ่ายดำ ถ่ายเป็นเลือด น้ำหนักลด ปวดท้องต่อเนื่อง ไข้สูง หรือมีภาวะขาดน้ำ</span></article></div>
        ${sourceChips([['MedlinePlus: FOBT', sources.fobt], ['MedlinePlus: FIT', sources.fit]])}`);
      insertAfter(stool, slide('urinalysis') || collection);
    }
  }

  function buildThyroidChapter() {
    if (slide('thyroid-start')) return;
    const anchor = slide('liver-gallstone') || slide('alcohol-calculator') || slide('liver-start');
    if (!anchor) return;

    const start = makeSlide('thyroid-start', 'thyroid', 'ไทรอยด์', 'ไทรอยด์', `
      <div class="chapter-number">08</div>
      <div class="chapter-copy"><div class="slide-kicker">CHAPTER 08</div><h2>ไทรอยด์</h2><p class="lead">อ่าน TSH คู่กับ FT4 และบริบท เช่น อาการ การตั้งครรภ์ ยา ความเจ็บป่วยเฉียบพลัน และอาหารเสริม ไม่ควรปรับยาเองจากผลเพียงครั้งเดียว</p></div>
      <div class="chapter-outline">
        <button class="chapter-outline-card" data-jump="thyroid-basics" type="button"><b>08.1</b><span>TSH และ FT4</span><small>สัญญาณควบคุมกับฮอร์โมนจากต่อมไทรอยด์</small></button>
        <button class="chapter-outline-card" data-jump="thyroid-patterns" type="button"><b>08.2</b><span>รูปแบบผลที่พบบ่อย</span><small>ใช้เป็นแนวคิดเบื้องต้น ไม่ใช่การวินิจฉัยเอง</small></button>
        <button class="chapter-outline-card" data-jump="thyroid-followup" type="button"><b>08.3</b><span>ติดตามอย่างไร</span><small>ยา biotin การตั้งครรภ์ และอาการเตือน</small></button>
      </div>
      ${sourceChips([['NIDDK: Thyroid tests', sources.thyroid]])}`, 'chapter-slide chapter-thyroid');

    const basics = makeSlide('thyroid-basics', 'thyroid', 'TSH และ FT4', 'THYROID', `
      <div class="slide-kicker">THYROID • 08.1</div>
      <h2>TSH และ FT4 ต่างกันอย่างไร</h2>
      <p class="lead">TSH เป็นสัญญาณจากต่อมใต้สมองที่บอกต่อมไทรอยด์ให้สร้างฮอร์โมน ส่วน FT4 คือฮอร์โมนไทรอยด์ที่พร้อมเข้าสู่เนื้อเยื่อ</p>
      <div class="thyroid-feedback-layout">
        <div class="thyroid-axis panel"><div class="pituitary">ต่อมใต้สมอง<br><b>TSH</b></div><i>สั่งการ ↓</i><div class="thyroid-gland">ต่อมไทรอยด์<br><b>FT4 / T3</b></div><i>↖ feedback</i></div>
        <div class="thyroid-copy panel"><article><b>TSH สูง</b><span>มักหมายถึงร่างกายกำลังกระตุ้นต่อมไทรอยด์มากขึ้น</span></article><article><b>TSH ต่ำ</b><span>มักหมายถึงสัญญาณกระตุ้นถูกลดลง เพราะฮอร์โมนสูงหรือมีปัจจัยอื่น</span></article><article><b>FT4</b><span>ช่วยบอกระดับฮอร์โมนที่พร้อมใช้ และทำให้แปล TSH ได้ชัดขึ้น</span></article></div>
      </div>
      <div class="patient-inline-note info"><b>อาการอย่างเดียวไม่พอ</b><span>เหนื่อย น้ำหนักเปลี่ยน ใจสั่น หนาวง่าย หรือร้อนง่ายพบได้จากหลายสาเหตุ จึงต้องใช้ผลเลือดและการประเมินร่วมกัน</span></div>
      ${sourceChips([['NIDDK: Thyroid tests', sources.thyroid]])}`);

    const patterns = makeSlide('thyroid-patterns', 'thyroid', 'รูปแบบผลไทรอยด์', 'THYROID', `
      <div class="slide-kicker">THYROID • 08.2</div>
      <h2>รูปแบบ TSH และ FT4 ที่พบบ่อย <small>เป็นภาพรวม ไม่ใช่คำวินิจฉัยจากตาราง</small></h2>
      <div class="thyroid-pattern-grid">
        <article class="low"><b>TSH สูง + FT4 ต่ำ</b><span>มักเข้ากับไทรอยด์ทำงานต่ำ</span></article>
        <article class="high"><b>TSH ต่ำ + FT4 สูง</b><span>มักเข้ากับไทรอยด์ทำงานเกิน</span></article>
        <article><b>TSH สูง + FT4 ปกติ</b><span>อาจเป็นภาวะระยะเริ่มต้นหรือผลชั่วคราว ต้องดูอาการและตรวจซ้ำ</span></article>
        <article><b>TSH ต่ำ + FT4 ปกติ</b><span>อาจเป็นภาวะระยะเริ่มต้น ยา การตั้งครรภ์ หรือความเจ็บป่วยอื่น</span></article>
        <article class="complex"><b>TSH และ FT4 ไม่เข้ารูปแบบ</b><span>อาจเกิดจากยา การเจ็บป่วยเฉียบพลัน ปัญหาต่อมใต้สมอง หรือการรบกวนของการตรวจ</span></article>
      </div>
      <div class="patient-inline-note warning"><b>อย่าใช้ตารางปรับยาเอง</b><span>ช่วงอ้างอิงต่างกันตามห้องปฏิบัติการ อายุ การตั้งครรภ์ และสถานการณ์ทางคลินิก แพทย์อาจตรวจ T3, antibody หรือการตรวจอื่นเพิ่ม</span></div>
      ${sourceChips([['NIDDK: Thyroid tests', sources.thyroid], ['NIDDK: Hypothyroidism', sources.hypothyroid], ['NIDDK: Hyperthyroidism', sources.hyperthyroid]])}`);

    const followup = makeSlide('thyroid-followup', 'thyroid', 'การติดตามผลไทรอยด์', 'THYROID', `
      <div class="slide-kicker">THYROID • 08.3</div>
      <h2>เมื่อผลไทรอยด์ผิดปกติ ควรทำอะไรต่อ</h2>
      <div class="thyroid-followup-grid">
        <article><b>ทบทวนยาและอาหารเสริม</b><span>แจ้ง levothyroxine, amiodarone, steroid, iodine/สาหร่าย และ biotin โดยเฉพาะผลิตภัณฑ์ผมและเล็บ</span></article>
        <article><b>ดูเวลาตรวจและการกินยา</b><span>บันทึกว่าเจาะเลือดก่อนหรือหลังยาประจำ และทำตามวิธีของสถานพยาบาลในการตรวจครั้งถัดไป</span></article>
        <article><b>ตรวจซ้ำตามช่วงที่เหมาะสม</b><span>การเปลี่ยนขนาดยาใช้เวลาหลายสัปดาห์กว่าจะสะท้อนใน TSH จึงไม่ควรตรวจถี่หรือปรับยาเอง</span></article>
        <article><b>Ultrasound ตอบคนละคำถาม</b><span>ใช้ดูขนาดและก้อนของต่อมไทรอยด์ ไม่ได้ใช้แทน TSH/FT4 ในการบอกการทำงาน</span></article>
      </div>
      <div class="patient-guide-strip warning"><article><b>จำไว้</b><span>Biotin อาจทำให้ผล TSH และฮอร์โมนไทรอยด์ผิดไปจากจริงในบางวิธีตรวจ</span></article><article><b>ทำอะไรต่อ</b><span>แจ้งทุกยาและอาหารเสริม ไม่หยุดหรือเพิ่มยาไทรอยด์เอง</span></article><article><b>ไม่ควรรอเมื่อ</b><span>ใจสั่นรุนแรง เจ็บหน้าอก หอบ เป็นลม สับสน หรือคอโตเร็วและกดเบียด</span></article></div>
      ${sourceChips([['NIDDK: Thyroid tests', sources.thyroid], ['American Thyroid Association: Biotin', sources.biotin]])}`);

    insertAfter(start, anchor);
    insertAfter(basics, start);
    insertAfter(patterns, basics);
    insertAfter(followup, patterns);
  }

  function reorderAndRenumber() {
    const slidesContainer = qs('.reveal .slides');
    if (!slidesContainer) return;

    const groupNumber = {
      liver: '07', thyroid: '08', cvd: '09', cancer: '10', vaccines: '11', vitamins: '12', bone: '13', eyes: '14', hearing: '15'
    };
    Object.entries(groupNumber).forEach(([group, number]) => {
      const start = slide(`${group}-start`);
      if (start) replaceChapterNumber(`${group}-start`, number);
      replaceOutlinePrefix(`${group}-start`, number);
      replaceKickerNumber(group, number);
    });

    ['other-pad', 'other-abi', 'other-cavi', 'cardiac-test-matrix'].forEach((id) => {
      const node = slide(id);
      if (node) { node.dataset.group = 'cvd'; node.dataset.section = 'CARDIOVASCULAR'; }
    });
    const birads = slide('other-birads');
    if (birads) { birads.dataset.group = 'cancer'; birads.dataset.section = 'CANCER / BREAST IMAGING'; }

    const chapterTitles = {
      'liver-start': ['07', 'ตับ ถุงน้ำดี และแอลกอฮอล์'],
      'thyroid-start': ['08', 'ไทรอยด์'],
      'cvd-start': ['09', 'ความเสี่ยงหัวใจและหลอดเลือด'],
      'cancer-start': ['10', 'มะเร็งและการคัดกรอง'],
      'vaccines-start': ['11', 'วัคซีนผู้ใหญ่'],
      'vitamins-start': ['12', 'วิตามิน'],
      'bone-start': ['13', 'มวลกระดูก'],
      'eyes-start': ['14', 'สุขภาพตา'],
      'hearing-start': ['15', 'สุขภาพหูและการได้ยิน']
    };
    Object.entries(chapterTitles).forEach(([id, [number]]) => replaceChapterNumber(id, number));

    let anchor = slide('kidney-start');
    ['other-start', 'liver-start', 'thyroid-start', 'cvd-start', 'cancer-start', 'vaccines-start', 'vitamins-start', 'bone-start', 'eyes-start', 'hearing-start'].forEach((id) => {
      const node = slide(id);
      if (anchor && node && anchor.parentElement === node.parentElement) {
        insertAfter(node, anchor);
        anchor = node;
      }
    });
  }

  rebuildTopNavigation();
  buildBodyAndBloodPressureChapter();
  buildUrineAndStoolChapter();
  buildThyroidChapter();
  reorderAndRenumber();
  rebuildModuleMap();

  window.HealthDeckStructure = {
    groups: {
      bp: { label: '03 น้ำหนัก รอบเอว และความดัน', short: 'WEIGHT / WAIST / BP', color: '#74d9ff' },
      blood: { label: '04 เลือดและ CBC', short: 'BLOOD / CBC', color: '#e88fbd' },
      kidney: { label: '05 ไต', short: 'KIDNEY', color: '#55d7ff' },
      other: { label: '06 ปัสสาวะและอุจจาระ', short: 'URINE & STOOL', color: '#8ad5c2' },
      liver: { label: '07 ตับ ถุงน้ำดี และแอลกอฮอล์', short: 'LIVER', color: '#b8cf63' },
      thyroid: { label: '08 ไทรอยด์', short: 'THYROID', color: '#d39cff' },
      cvd: { label: '09 หัวใจและหลอดเลือด', short: 'CVD RISK', color: '#ff8b72' },
      cancer: { label: '10 มะเร็งและการคัดกรอง', short: 'CANCER', color: '#ff83c7' },
      vaccines: { label: '11 วัคซีนผู้ใหญ่', short: 'VACCINES', color: '#ba9cff' },
      vitamins: { label: '12 วิตามิน', short: 'VITAMINS', color: '#e6c65d' },
      bone: { label: '13 มวลกระดูก', short: 'BONE DENSITY', color: '#d49a70' },
      eyes: { label: '14 ตา', short: 'EYE HEALTH', color: '#66c8ff' },
      hearing: { label: '15 หู', short: 'HEARING', color: '#ff9f6e' }
    },
    order: ['home', 'diabetes', 'lipids', 'bp', 'blood', 'kidney', 'other', 'liver', 'thyroid', 'cvd', 'cancer', 'vaccines', 'vitamins', 'bone', 'eyes', 'hearing', 'summary']
  };
})();