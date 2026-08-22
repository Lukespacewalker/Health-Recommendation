(() => {
  'use strict';
  const slide = (id) => document.getElementById(id);
  const q = (id, selector) => slide(id)?.querySelector(selector) || null;
  const set = (id, selector, html) => { const n = q(id, selector); if (n) n.innerHTML = html; return n; };
  const moveAfter = (node, anchor) => { if (node && anchor && node !== anchor) anchor.insertAdjacentElement('afterend', node); };
  const setGroup = (id, group, section) => { const n = slide(id); if (!n) return null; n.dataset.group = group; n.dataset.section = section; return n; };
  const beforeSources = (id, node) => { const h = slide(id); if (!h || !node) return; const s = h.querySelector('.source-chips'); s ? h.insertBefore(node, s) : h.appendChild(node); };

  function note(id, title, text, tone = 'info') {
    const h = slide(id);
    if (!h || h.querySelector(`.patient-inline-note[data-note="${tone}"]`)) return;
    const n = document.createElement('div');
    n.className = `patient-inline-note ${tone}`;
    n.dataset.note = tone;
    n.innerHTML = `<b>${title}</b><span>${text}</span>`;
    beforeSources(id, n);
  }

  function patientBar(id, remember, action, followup) {
    const h = slide(id);
    if (!h || h.querySelector('.patient-guide-strip')) return;
    const n = document.createElement('div');
    n.className = 'patient-guide-strip warning';
    n.innerHTML = `<article><b>จำไว้</b><span>${remember}</span></article><article><b>ทำอะไรต่อ</b><span>${action}</span></article><article><b>ไม่ควรรอเมื่อ</b><span>${followup}</span></article>`;
    beforeSources(id, n);
  }

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
    if (node && anchor) { moveAfter(node, anchor); anchor = node; }
  });

  const outline = q('cvd-start', '.chapter-outline');
  if (outline) {
    outline.className = 'chapter-outline chapter-outline-six patient-outline-six';
    outline.innerHTML = `
      <button class="chapter-outline-card" data-jump="cardiac-test-matrix" type="button"><b>07.1</b><span>เลือกการตรวจให้ตรงคำถาม</span><small>Risk score • CAC • EST • Echo ต่างกันอย่างไร</small></button>
      <button class="chapter-outline-card" data-jump="cvd-risk-score" type="button"><b>07.2</b><span>คะแนนความเสี่ยง</span><small>Thai CV Risk และ PREVENT</small></button>
      <button class="chapter-outline-card" data-jump="cac" type="button"><b>07.3</b><span>CT Calcium Score</span><small>คราบหินปูนและการแปลผล</small></button>
      <button class="chapter-outline-card" data-jump="est" type="button"><b>07.4</b><span>EST</span><small>ดูหัวใจขณะออกแรงเมื่อมีข้อบ่งชี้</small></button>
      <button class="chapter-outline-card" data-jump="echo" type="button"><b>07.5</b><span>Echo</span><small>ดูโครงสร้าง การบีบตัว และลิ้นหัวใจ</small></button>
      <button class="chapter-outline-card" data-jump="other-pad" type="button"><b>07.6</b><span>หลอดเลือดขา</span><small>PAD • ABI • CAVI</small></button>`;
  }

  set('cardiac-test-matrix', '.lead', 'เริ่มจากคำถามทางคลินิกก่อนเลือกการตรวจ ผลปกติของการตรวจชนิดหนึ่งไม่สามารถใช้แทนอีกชนิดได้');
  set('cardiac-test-matrix', '.bottom-banner', '<b>สำหรับผู้ตรวจสุขภาพที่ไม่มีอาการ:</b> เริ่มจากควบคุมความดัน ไขมัน น้ำตาล บุหรี่ และประเมินความเสี่ยง ส่วน EST, Echo หรือภาพถ่ายหัวใจควรทำเมื่อผลจะตอบคำถามหรือเปลี่ยนแผนดูแล');

  set('cvd-risk-score', '.lead', 'คะแนนความเสี่ยงประมาณโอกาสเกิดโรคหัวใจและหลอดเลือดในอนาคตจากข้อมูลหลายด้าน ไม่ได้บอกว่าหลอดเลือดตีบกี่เปอร์เซ็นต์ และไม่ใช้แทนการประเมินอาการ');
  set('cvd-risk-score', '.risk-meaning-list article:nth-child(1) span', 'คนกลุ่มที่มีข้อมูลใกล้เคียงกันมีโอกาสเกิดโรคประมาณเท่าไร');
  set('cvd-risk-score', '.risk-meaning-list article:nth-child(2) span', 'หลอดเลือดของบุคคลนี้ตีบอยู่ตรงไหนหรือกี่เปอร์เซ็นต์');
  set('cvd-risk-score', '.risk-meaning-list article:nth-child(3) span', 'ประวัติครอบครัว Lp(a) โรคไต โรคอักเสบเรื้อรัง และ CAC อาจทำให้แพทย์ปรับการตีความ');

  set('cac', '.lead', 'CAC ใช้ดูปริมาณคราบหินปูนในผนังหลอดเลือดหัวใจ เพื่อช่วยปรับระดับความเสี่ยงในผู้ไม่มีอาการบางราย ไม่ใช่การตรวจฉุกเฉิน และไม่บอกเปอร์เซ็นต์การตีบแบบ CT coronary angiography');
  set('cac', '.cac-key-grid article:nth-child(1) span', 'ปริมาณคราบหินปูนในผนังหลอดเลือด');
  set('cac', '.cac-key-grid article:nth-child(2) span', 'ช่วยปรับระดับความเสี่ยงเมื่อผลจะเปลี่ยนแผนป้องกัน');
  set('cac', '.cac-key-grid article:nth-child(3) span', 'คะแนน 0 ยังไม่ตัดคราบไขมันที่ยังไม่เป็นหินปูน');
  set('cac', '.cac-key-grid article:nth-child(4) span', 'ใช้รังสีปริมาณต่ำ จึงควรตรวจเมื่อมีเหตุผล');

  note('est', 'ไม่ใช่การตรวจคัดกรองประจำสำหรับทุกคน', 'ในผู้ไม่มีอาการและมีความเสี่ยงต่ำ การทำ exercise ECG เป็น routine อาจนำไปสู่ผลบวกลวงและการตรวจต่อที่ไม่จำเป็น ควรเลือกเมื่อมีคำถามทางคลินิกชัดเจน', 'warning');
  note('echo', 'Echo ไม่ใช่ภาพหลอดเลือดหัวใจ', 'ผล Echo ปกติไม่ได้ตัดคราบไขมันในหลอดเลือดหัวใจ และ EF ปกติไม่ได้ตัดภาวะหัวใจล้มเหลวทุกชนิด');

  set('other-cavi', 'h2', 'CAVI: ข้อมูลเสริมเรื่องความแข็งของหลอดเลือด <small>ไม่ใช่การตรวจยืนยันว่าหลอดเลือดตีบ</small>');
  set('other-cavi', '.lead', 'CAVI เป็นตัวชี้วัดเสริมเกี่ยวกับความแข็งของหลอดเลือด ค่าอ้างอิงอาจต่างตามอายุ เครื่องมือ และประชากร จึงควรใช้เพื่อทบทวนปัจจัยเสี่ยงมาตรฐาน ไม่ใช้ค่าเดียวกำหนดการรักษา');
  const caviCopy = q('other-cavi', '.cavi-copy');
  if (caviCopy && !caviCopy.querySelector('.cavi-threshold-label')) {
    const n = document.createElement('div');
    n.className = 'cavi-threshold-label';
    n.textContent = 'ตัวอย่างช่วงที่ใช้ในระบบ CAVI บางแห่ง';
    caviCopy.prepend(n);
  }

  patientBar('other-pad', 'PAD อาจเป็นสัญญาณของหลอดเลือดแข็งทั้งระบบ ไม่ใช่ปัญหาเฉพาะขา', 'หยุดบุหรี่ คุมไขมัน ความดันและเบาหวาน ดูแลเท้า และออกกำลังตามคำแนะนำ', 'ขาซีด เย็น ชา อ่อนแรง หรือปวดฉับพลัน ให้ประเมินฉุกเฉิน');

  const mapCvd = document.querySelector('.module-card.cvd p');
  if (mapCvd) mapCvd.textContent = 'Risk score • Calcium score • EST • Echo • PAD/ABI/CAVI';
})();
