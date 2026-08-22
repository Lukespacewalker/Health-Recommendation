(() => {
  'use strict';

  const redundantSlideIds = [
    'lipoprotein-transport',
    'lipid-factors',
    'nonhdl-remnant',
    'lipid-extra-tests'
  ];

  redundantSlideIds.forEach((id) => document.getElementById(id)?.remove());

  const basicsSlide = document.getElementById('lipid-basics');
  if (basicsSlide && !document.getElementById('lipid-targets')) {
    const targetSlide = document.createElement('section');
    targetSlide.className = 'slide lipid-targets-slide';
    targetSlide.dataset.group = 'lipids';
    targetSlide.dataset.menuTitle = 'ค่าไขมันที่ควรรู้และเป้าหมายตามความเสี่ยง';
    targetSlide.dataset.section = 'LIPIDS';
    targetSlide.dataset.transition = 'fade';
    targetSlide.id = 'lipid-targets';
    targetSlide.innerHTML = `
      <div class="slide-kicker">LIPIDS • VALUES</div>
      <h2>ค่าไขมันที่ควรรู้ <small>แยก “ค่าคัดกรอง” ออกจาก “เป้าหมายการรักษา”</small></h2>
      <p class="lead">อย่าตีความว่าทุกคนต้องได้เลขเดียวกัน ค่า LDL-C และ non-HDL-C ที่เหมาะสมขึ้นกับความเสี่ยงโรคหัวใจและหลอดเลือดของแต่ละคน</p>

      <div class="lipid-values-layout">
        <div class="lipid-screening-panel panel">
          <h3>ค่าที่มักใช้ประกอบการตรวจสุขภาพ <small>mg/dL</small></h3>
          <div class="lipid-screening-grid">
            <article>
              <span>Total cholesterol</span>
              <b>&lt;200</b>
              <p>ระดับที่มักเรียกว่า desirable สำหรับการคัดกรอง แต่ไม่ใช่เป้าหมายรักษาหลัก</p>
            </article>
            <article>
              <span>Triglycerides</span>
              <b>&lt;150</b>
              <p>โดยทั่วไปถือว่าอยู่ในช่วงปกติ ควรดูภาวะอดอาหารและสาเหตุรองร่วมด้วย</p>
            </article>
            <article>
              <span>LDL-C</span>
              <b>&lt;100*</b>
              <p>เป็นค่าที่พบได้บ่อยในคนทั่วไป แต่ *ไม่ใช่เป้าหมายเดียวสำหรับทุกคน</p>
            </article>
            <article>
              <span>HDL-C</span>
              <b>ไม่มี target</b>
              <p>ใช้ประกอบการประเมินความเสี่ยง ไม่ควรไล่เพิ่มตัวเลขด้วยยา และ HDL สูงไม่หักล้าง LDL/ApoB สูง</p>
            </article>
          </div>
        </div>

        <div class="lipid-risk-targets panel">
          <h3>เป้าหมายเมื่อแพทย์เริ่มลดไขมัน <small>ACC/AHA 2026</small></h3>
          <div class="lipid-target-row level-one">
            <div><b>Borderline / Intermediate risk</b><span>เมื่อมีการเริ่มยาเพื่อลดความเสี่ยง</span></div>
            <strong>LDL-C &lt;100</strong>
            <em>non-HDL-C &lt;130</em>
          </div>
          <div class="lipid-target-row level-two">
            <div><b>High risk</b><span>เช่น PREVENT-ASCVD 10 ปี ≥10% เมื่อเริ่มรักษา</span></div>
            <strong>LDL-C &lt;70</strong>
            <em>non-HDL-C &lt;100</em>
          </div>
          <div class="lipid-target-row level-three">
            <div><b>Very-high-risk ASCVD</b><span>เคยมีโรคหลอดเลือดและเสี่ยงเกิดซ้ำสูง</span></div>
            <strong>LDL-C &lt;55</strong>
            <em>non-HDL-C &lt;85</em>
          </div>
        </div>
      </div>

      <div class="lipid-alert-strip">
        <article><b>LDL-C ≥190</b><span>ควรประเมิน severe hypercholesterolemia และ familial hypercholesterolemia</span></article>
        <article><b>TG ≥500</b><span>ควรนัดประเมินเร็ว และถ้า ≥1000 ต้องให้ความสำคัญกับการป้องกันตับอ่อนอักเสบ</span></article>
        <article><b>Lp(a) ≥125 nmol/L หรือ ≥50 mg/dL</b><span>เป็น risk-enhancing factor และควรคุมปัจจัยเสี่ยงอื่นให้เข้มขึ้น</span></article>
      </div>

      <div class="lipid-values-note"><b>ApoB:</b> ใช้แบบเลือกตามบริบท โดยเฉพาะ TG สูง เบาหวาน หรือเมื่อ LDL-C/non-HDL-C ถึงเป้าแล้วแต่ยังสงสัย residual risk ไม่ใช่การตรวจที่ทุกคนต้องสั่งซ้ำเป็นประจำ</div>

      <div aria-label="แหล่งอ้างอิงของสไลด์นี้" class="source-chips">
        <span>อ้างอิง</span>
        <a aria-label="เปิด AHA: What Your Cholesterol Levels Mean ในแท็บใหม่" href="https://www.heart.org/en/health-topics/cholesterol/about-cholesterol/what-your-cholesterol-levels-mean" rel="noopener noreferrer" target="_blank">AHA: Cholesterol levels</a>
        <a aria-label="เปิด 2026 Dyslipidemia Guideline-at-a-Glance ในแท็บใหม่" href="https://www.jacc.org/doi/10.1016/j.jacc.2026.02.4872" rel="noopener noreferrer" target="_blank">JACC: 2026 Guideline-at-a-Glance</a>
        <a aria-label="เปิด AHA/ACC 2026 Dyslipidemia Key Points ในแท็บใหม่" href="https://professional.heart.org/en/science-news/2026-guideline-on-the-management-of-dyslipidemia/top-things-to-know" rel="noopener noreferrer" target="_blank">AHA/ACC 2026: Key Points</a>
      </div>`;
    basicsSlide.insertAdjacentElement('afterend', targetSlide);
  }

  const outline = document.querySelector('#lipids-start .chapter-outline');
  if (outline) {
    outline.className = 'chapter-outline chapter-outline-six lipid-outline-compact';
    outline.innerHTML = `
      <button class="chapter-outline-card" data-jump="lipid-basics" data-readable-card="" type="button"><b>2.1</b><span>Cholesterol vs TG</span><small>วัสดุก่อสร้างกับพลังงานสำรอง</small></button>
      <button class="chapter-outline-card" data-jump="lipid-targets" data-readable-card="" type="button"><b>2.2</b><span>ค่าที่ควรรู้</span><small>ค่าคัดกรองและเป้าหมายตามความเสี่ยง</small></button>
      <button class="chapter-outline-card" data-jump="lipoprotein-family" data-readable-card="" type="button"><b>2.3</b><span>VLDL • IDL • LDL • HDL</span><small>อนุภาค ของที่บรรทุก และ ApoB</small></button>
      <button class="chapter-outline-card" data-jump="ldl-control" data-readable-card="" type="button"><b>2.4</b><span>LDL-C และ TG สูง</span><small>สาเหตุ วิธีควบคุม และสัญญาณเตือน</small></button>
      <button class="chapter-outline-card" data-jump="apob" data-readable-card="" type="button"><b>2.5</b><span>ApoB &amp; Lp(a)</span><small>ความเสี่ยงที่ standard panel อาจมองไม่ครบ</small></button>
      <button class="chapter-outline-card" data-jump="lipid-ratios" data-readable-card="" type="button"><b>2.6</b><span>Derived values &amp; Flow</span><small>non-HDL-C, remnant-C, ratios และลำดับการอ่าน</small></button>`;
  }

  const mapCount = document.querySelector('[data-count-group="lipids"]');
  if (mapCount) mapCount.textContent = '10 หัวข้อ';

  const kickerUpdates = {
    'lipoprotein-family': 'LIPIDS • 2.3',
    'ldl-control': 'LIPIDS • 2.4',
    'tg-control': 'LIPIDS • 2.4',
    'apob': 'LIPIDS • 2.5',
    'lpa': 'LIPIDS • 2.5',
    'lipid-ratios': 'LIPIDS • 2.6',
    'lipid-flow': 'LIPIDS • SUMMARY'
  };
  Object.entries(kickerUpdates).forEach(([id, label]) => {
    const kicker = document.querySelector(`#${id} .slide-kicker`);
    if (kicker) kicker.textContent = label;
  });

  const ratioSlide = document.getElementById('lipid-ratios');
  const ratioReference = ratioSlide?.querySelector('.ratio-reference');
  if (ratioReference) {
    ratioReference.innerHTML = `
      <h3>ให้ค่าหลักนำหน้า ratio</h3>
      <div><b>ใช้ก่อน</b><span>ประเมินความเสี่ยงรวม แล้วดู LDL-C, non-HDL-C, TG และ ApoB เมื่อมีข้อบ่งชี้</span></div>
      <div><b>ใช้ ratio เป็นข้อมูลประกอบ</b><span>TC/HDL-C, LDL-C/HDL-C และ TG/HDL-C ไม่มี treatment target สากลในแนวทางปัจจุบัน</span></div>
      <button class="inline-jump" data-jump="lipid-targets" type="button">ย้อนดูค่าเป้าหมายตามความเสี่ยง</button>`;
  }

  const lipidFlowBanner = document.querySelector('#lipid-flow .bottom-banner');
  if (lipidFlowBanner) {
    lipidFlowBanner.innerHTML = '<b>ตรวจเพิ่มแบบมีเหตุผล:</b> คำนวณ non-HDL-C ได้จากผลเดิม • วัด Lp(a) อย่างน้อยหนึ่งครั้งในวัยผู้ใหญ่ • ใช้ ApoB แบบเลือกตามบริบท • advanced particle tests ไม่จำเป็นสำหรับคนทั่วไปทุกคน';
  }
})();