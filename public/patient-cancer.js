(() => {
  'use strict';
  const slide = (id) => document.getElementById(id);
  const q = (id, selector) => slide(id)?.querySelector(selector) || null;
  const set = (id, selector, html) => { const n = q(id, selector); if (n) n.innerHTML = html; return n; };
  const moveAfter = (node, anchor) => { if (node && anchor && node !== anchor) anchor.insertAdjacentElement('afterend', node); };
  const beforeSources = (id, node) => { const h = slide(id); if (!h || !node) return; const s = h.querySelector('.source-chips'); s ? h.insertBefore(node, s) : h.appendChild(node); };

  function note(id, title, text, tone = 'info') {
    const host = slide(id);
    if (!host || host.querySelector(`.patient-inline-note[data-note="${tone}"]`)) return;
    const n = document.createElement('div');
    n.className = `patient-inline-note ${tone}`;
    n.dataset.note = tone;
    n.innerHTML = `<b>${title}</b><span>${text}</span>`;
    beforeSources(id, n);
  }

  const biRads = slide('other-birads');
  const falsePositive = slide('tumor-false-positive');
  if (biRads) {
    biRads.dataset.group = 'cancer';
    biRads.dataset.section = 'CANCER / BREAST IMAGING';
    if (falsePositive) moveAfter(biRads, falsePositive);
  }

  slide('tumor-use')?.remove();

  const outline = q('cancer-start', '.chapter-outline');
  if (outline) {
    outline.className = 'chapter-outline patient-outline-five';
    outline.innerHTML = `
      <button class="chapter-outline-card" data-jump="tumor-marker" type="button"><b>08.1</b><span>สารบ่งชี้บอกอะไร</span><small>ผลสูงยังไม่ยืนยันมะเร็ง</small></button>
      <button class="chapter-outline-card" data-jump="tumor-body-map" type="button"><b>08.2</b><span>อวัยวะที่เกี่ยวข้อง</span><small>เป็นความสัมพันธ์ ไม่ใช่ตำแหน่งวินิจฉัย</small></button>
      <button class="chapter-outline-card" data-jump="tumor-marker-table" type="button"><b>08.3</b><span>รายการที่พบบ่อย</span><small>ใช้เพื่ออะไร และอะไรทำให้สูงได้</small></button>
      <button class="chapter-outline-card" data-jump="tumor-false-positive" type="button"><b>08.4</b><span>ขั้นตอนยืนยันผล</span><small>เตรียมรายงาน ผลเดิม อาการ และยา</small></button>
      <button class="chapter-outline-card" data-jump="other-birads" type="button"><b>08.5</b><span>BI-RADS</span><small>อ่านรหัสพร้อมขั้นตอนถัดไป</small></button>`;
  }

  const bodyMap = q('tumor-body-map', '.tumor-map-layout');
  if (bodyMap && !q('tumor-body-map', '.marker-map-warning')) {
    const warning = document.createElement('div');
    warning.className = 'marker-map-warning';
    warning.innerHTML = '<b>แผนภาพนี้ไม่สามารถบอกตำแหน่งมะเร็งได้</b><span>อวัยวะที่ไฮไลต์แสดงเพียงความสัมพันธ์ที่พบได้ หนึ่ง marker อาจสูงจากหลายโรค และโรคที่ไม่ใช่มะเร็งก็ทำให้สูงได้</span>';
    bodyMap.insertAdjacentElement('beforebegin', warning);
  }

  const verify = q('tumor-false-positive', '.verification-flow');
  if (verify && !q('tumor-false-positive', '.patient-prep-checklist')) {
    const checklist = document.createElement('div');
    checklist.className = 'patient-prep-checklist';
    checklist.innerHTML = '<b>เตรียมก่อนพบแพทย์</b><span>รายงานฉบับเต็มและหน่วย</span><span>ผลเดิม</span><span>อาการ</span><span>ยาและอาหารเสริม</span><span>ประวัติการตั้งครรภ์/สูบบุหรี่/โรคตับตามบริบท</span>';
    verify.insertAdjacentElement('afterend', checklist);
  }

  note('tumor-marker', 'อย่าใช้ tumor marker แทนการคัดกรองที่มีหลักฐาน', 'การคัดกรองตามอายุและความเสี่ยง เช่น ปากมดลูก เต้านม หรือลำไส้ใหญ่ มีหลักฐานและขั้นตอนติดตามเฉพาะ ไม่ควรสั่ง marker แบบเหวี่ยงแหเพื่อแทนการคัดกรองเหล่านี้', 'warning');

  const otherOutline = q('other-start', '.chapter-outline');
  if (otherOutline) {
    otherOutline.className = 'chapter-outline';
    otherOutline.innerHTML = `
      <button class="chapter-outline-card" data-jump="other-followup" type="button"><b>14.1</b><span>ผลตรวจอื่นที่พบบ่อย</span><small>น้ำหนัก • ปัสสาวะ • ไทรอยด์ • อุจจาระ</small></button>
      <button class="chapter-outline-card" data-jump="references-tests" type="button"><b>REF</b><span>อ้างอิงต้นทาง</span><small>เปิดแนวทางและข้อมูลสำหรับประชาชน</small></button>`;
  }
  set('other-start', '.lead', 'หมวดนี้รวมผลที่ยังไม่อยู่ในหมวดหลัก เช่น น้ำหนัก ปัสสาวะ ไทรอยด์ และอุจจาระ ให้ทำตามขั้นตอนถัดไปที่ระบุในรายงานและดูอาการร่วม');

  const mapCancer = document.querySelector('.module-card.cancer p');
  if (mapCancer) mapCancer.textContent = 'Tumor markers • การยืนยันผล • BI-RADS';
  const mapOther = document.querySelector('.module-card.other p');
  if (mapOther) mapOther.textContent = 'น้ำหนัก • ปัสสาวะ • ไทรอยด์ • อุจจาระ';
})();
