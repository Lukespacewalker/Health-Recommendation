(() => {
  'use strict';
  const slide = (id) => document.getElementById(id);
  const q = (id, selector) => slide(id)?.querySelector(selector) || null;
  const set = (id, selector, html) => { const n = q(id, selector); if (n) n.innerHTML = html; return n; };
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

  function patientBar(id, remember, action, followup) {
    const host = slide(id);
    if (!host || host.querySelector('.patient-guide-strip')) return;
    const n = document.createElement('div');
    n.className = 'patient-guide-strip';
    n.innerHTML = `<article><b>จำไว้</b><span>${remember}</span></article><article><b>ทำอะไรต่อ</b><span>${action}</span></article><article><b>ติดตามเมื่อใด</b><span>${followup}</span></article>`;
    beforeSources(id, n);
  }

  set('vitamins-start', '.lead', 'คนทั่วไปไม่จำเป็นต้องตรวจวิตามินทุกชนิด การตรวจและการเสริมควรตอบคำถามจากอาการ อาหาร ปัจจัยเสี่ยง โรค หรือยาที่ใช้ ไม่ควรตั้งเป้าว่าค่ายิ่งสูงยิ่งดี');

  const sunCopy = q('vitamin-d-sun-dose', '.sun-panel p');
  if (sunCopy) sunCopy.textContent = 'ไม่มีเวลารับแดดที่เหมาะกับทุกคน เพราะสีผิว เวลา เมฆ เสื้อผ้า อายุ และดัชนี UV มีผลมาก หลีกเลี่ยงผิวแดงหรือไหม้ และใช้แหล่งอาหารหรืออาหารเสริมตามข้อบ่งชี้เมื่อจำเป็น';

  note('vitamin-d-sun-dose', 'อย่าเพิ่มขนาดจากตัวเลขเดียว', 'การเสริมวิตามิน D ควรดูผลตรวจ หน่วย โรคร่วม ยา แคลเซียม และความเสี่ยงเฉพาะบุคคล ขนาดสูงเป็นเวลานานอาจเป็นอันตราย', 'warning');
  note('vitamin-c', 'เริ่มจากอาหารและหาสาเหตุของค่าต่ำ', 'คนทั่วไปมักไม่จำเป็นต้องใช้วิตามิน C ขนาดสูง หากผลต่ำจริงหรือมีอาการ ควรทบทวนอาหาร การสูบบุหรี่ การดูดซึม และโรคเรื้อรัง');

  patientBar('bone-followup', 'DXA วัดความหนาแน่นแร่ธาตุ แต่ความเสี่ยงกระดูกหักยังขึ้นกับอายุ การหกล้ม ยา และประวัติกระดูกหัก', 'ออกกำลังลงน้ำหนักและแรงต้าน ดูแลโปรตีนและแคลเซียมจากอาหาร ป้องกันการหกล้ม และทบทวนยา', 'ช่วงตรวจซ้ำและการใช้ยาขึ้นกับผลเดิมและความเสี่ยง ไม่จำเป็นต้องตรวจทุกปีในทุกคน');
})();
