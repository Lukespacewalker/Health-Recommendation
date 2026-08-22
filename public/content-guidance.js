(() => {
  'use strict';

  const sources = {
    prevent: 'https://professional.heart.org/en/guidelines-and-statements/about-prevent-calculator',
    thaiRisk: 'https://www.rama.mahidol.ac.th/th/node/8154',
    cac: 'https://www.heart.org/en/health-topics/heart-attack/diagnosing-a-heart-attack/cac-test',
    lipidGuideline: 'https://professional.heart.org/en/science-news/2026-guideline-on-the-management-of-dyslipidemia/top-things-to-know',
    cdcModerate: 'https://www.cdc.gov/alcohol/about-alcohol-use/moderate-alcohol-use.html',
    cdcCancer: 'https://www.cdc.gov/cancer/risk-factors/alcohol.html',
    niaaaStandard: 'https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink',
    niaaaCalculator: 'https://rethinkingdrinking.niaaa.nih.gov/tools/calculators/alcohol-drink-size-calculator',
    whoAlcohol: 'https://www.who.int/azerbaijan/news/item/04-01-2023-no-level-of-alcohol-consumption-is-safe-for-our-health',
    thaiAudit: 'https://happyworkplace.thaihealth.or.th/eval_tool/999c003b-2682-4f50-bef0-688976d6fcdd'
  };

  function mergeRiskScoreSlides() {
    const scoreSlide = document.getElementById('cvd-risk-score');
    const toolsSlide = document.getElementById('risk-tools');
    if (!scoreSlide || !toolsSlide) return;

    scoreSlide.dataset.menuTitle = 'CVD Risk Score และการเลือกเครื่องมือ';
    scoreSlide.dataset.transition = 'fade';
    scoreSlide.innerHTML = `
      <div class="slide-kicker">CARDIOVASCULAR RISK • 07.1</div>
      <h2>คะแนนความเสี่ยงหัวใจและหลอดเลือด <small>เข้าใจความหมาย แล้วเลือกเครื่องมือให้เหมาะ</small></h2>
      <p class="lead">Risk score ประเมินโอกาสเกิดเหตุการณ์ในอนาคตจากคนที่มีลักษณะใกล้เคียงกัน ไม่ได้บอกว่าหลอดเลือดของบุคคลนั้นตีบกี่เปอร์เซ็นต์ และไม่ใช้แทนการประเมินอาการเจ็บหน้าอก</p>

      <div class="cvd-score-combined">
        <div class="risk-concept-panel panel">
          <div class="risk-dial compact" data-risk-dial="">
            <div class="dial-ring"><i></i><div class="dial-center"><b>10-year</b><span>Risk</span></div></div>
            <div class="risk-input-cloud"><span>อายุ</span><span>SBP</span><span>Smoking</span><span>Diabetes</span><span>TC / HDL</span><span>eGFR</span></div>
          </div>
          <div class="risk-meaning-list">
            <article><b>Score ตอบว่า</b><span>คนกลุ่มที่คล้ายกันมีโอกาสเกิด CVD ประมาณเท่าไร</span></article>
            <article><b>Score ไม่ได้ตอบว่า</b><span>หลอดเลือดของคนนี้ตีบอยู่กี่เปอร์เซ็นต์</span></article>
            <article><b>ต้องปรับตามบริบท</b><span>ประวัติครอบครัว Lp(a), CKD, inflammatory disease และ CAC อาจเปลี่ยนการตัดสินใจ</span></article>
          </div>
        </div>

        <div class="risk-tool-comparison">
          <article class="risk-tool-card thai panel">
            <div class="tool-badge">TH</div>
            <div><h3>Thai CV Risk</h3><p>พัฒนาสำหรับประชากรไทย ประเมินความเสี่ยง CVD ระยะ 10 ปี เหมาะเมื่อสถานพยาบาลใช้สูตรและตัวแปรรุ่นเดียวกัน</p></div>
          </article>
          <article class="risk-tool-card prevent panel">
            <div class="tool-badge">AHA</div>
            <div><h3>PREVENT</h3><p>สำหรับอายุ 30–79 ปีที่ยังไม่มี known CVD ประเมิน 10 และ 30 ปี โดยรวม cardiovascular, kidney และ metabolic factors</p></div>
          </article>
          <div class="prevent-categories compact">
            <span class="low"><b>&lt;3%</b> Low</span>
            <span class="border"><b>3–&lt;5%</b> Borderline</span>
            <span class="inter"><b>5–&lt;10%</b> Intermediate</span>
            <span class="high"><b>≥10%</b> High</span>
          </div>
          <div class="tool-caution"><b>อย่าปะปนเกณฑ์:</b> ใช้เครื่องมือและ threshold ที่แนวทางของสถานพยาบาลรองรับ แล้วหารือผลร่วมกับแพทย์</div>
        </div>
      </div>

      <div aria-label="แหล่งอ้างอิงของสไลด์นี้" class="source-chips">
        <span>อ้างอิง</span>
        <a href="${sources.prevent}" rel="noopener noreferrer" target="_blank">AHA PREVENT</a>
        <a href="${sources.thaiRisk}" rel="noopener noreferrer" target="_blank">Thai CV Risk</a>
      </div>`;

    toolsSlide.remove();
  }

  function mergeCacSlides() {
    const cacSlide = document.getElementById('cac');
    const interpretationSlide = document.getElementById('cac-interpretation');
    if (!cacSlide || !interpretationSlide) return;

    cacSlide.dataset.menuTitle = 'CT Calcium Score: หลักการและการแปลผล';
    cacSlide.dataset.transition = 'fade';
    cacSlide.innerHTML = `
      <div class="slide-kicker">CARDIOVASCULAR RISK • 07.2</div>
      <h2>CT Coronary Calcium Score <small>เห็น calcified plaque และแปลผลในหน้าเดียว</small></h2>
      <p class="lead">CAC อาจช่วยปรับระดับความเสี่ยงในผู้ไม่มีอาการที่ยังไม่แน่ใจเรื่องการป้องกัน เช่น การเริ่ม statin ไม่ใช่การตรวจฉุกเฉินและไม่บอกเปอร์เซ็นต์การตีบแบบ CCTA</p>

      <div class="cac-combined-layout">
        <div class="three-stage cac-stage panel" data-three-host="">
          <canvas aria-label="หลอดเลือดหัวใจที่มี calcified plaque" data-three-scene="cac"></canvas>
          <div class="three-fallback cac-fallback"><div class="cac-artery"><i class="calc c1"></i><i class="calc c2"></i><i class="calc c3"></i></div><div class="scan-ring"></div></div>
        </div>

        <div class="cac-combined-copy">
          <div class="cac-key-grid">
            <article><b>เห็นอะไร</b><span>ภาระ calcified plaque</span></article>
            <article><b>ช่วยอะไร</b><span>reclassify risk เมื่อผลจะเปลี่ยนแผนป้องกัน</span></article>
            <article><b>ไม่เห็นทั้งหมด</b><span>อาจมี noncalcified plaque แม้คะแนนเป็น 0</span></article>
            <article><b>มี radiation</b><span>ปริมาณต่ำ แต่ควรมีเหตุผลในการตรวจ</span></article>
          </div>
          <div class="cac-spectrum compact">
            <div class="cac-zone z0"><b>0</b><span>ไม่พบหินปูน</span><small>ลด estimated short-term risk ในบางคน แต่ไม่เท่ากับไม่มี plaque ทุกชนิด</small></div>
            <div class="cac-zone z1"><b>1–99</b><span>มี plaque</span><small>ดูอายุและ percentile ร่วมด้วย</small></div>
            <div class="cac-zone z2"><b>≥100</b><span>burden ชัด</span><small>มักสนับสนุนการป้องกันที่เข้มขึ้น</small></div>
            <div class="cac-zone z3"><b>≥1000</b><span>extensive</span><small>ความเสี่ยงสูงมาก ต้องจัดการ risk factors จริงจัง</small></div>
          </div>
        </div>
      </div>

      <div class="cac-use-row">
        <article class="panel"><b>เหมาะเมื่อ</b><span>ไม่มีอาการ มี borderline/intermediate risk และผลจะช่วยตัดสินใจ</span></article>
        <article class="panel"><b>มักใช้การตรวจอื่นก่อน</b><span>กำลังเจ็บหน้าอก มี known CAD เคย MI ใส่ stent หรือผ่าตัด bypass</span></article>
      </div>

      <div aria-label="แหล่งอ้างอิงของสไลด์นี้" class="source-chips">
        <span>อ้างอิง</span>
        <a href="${sources.cac}" rel="noopener noreferrer" target="_blank">AHA: CAC</a>
        <a href="${sources.lipidGuideline}" rel="noopener noreferrer" target="_blank">AHA/ACC 2026</a>
      </div>`;

    interpretationSlide.remove();
  }

  function updateCvdOutline() {
    const riskCard = document.querySelector('#cvd-start [data-jump="cvd-risk-score"] small');
    const cacCard = document.querySelector('#cvd-start [data-jump="cac"] small');
    if (riskCard) riskCard.textContent = 'ความหมายของ score • Thai CV Risk • PREVENT';
    if (cacCard) cacCard.textContent = 'หลักการ • ช่วงคะแนน • ใช้เมื่อใด';
  }

  function buildAlcoholGuideSlide() {
    const slide = document.createElement('section');
    slide.className = 'slide alcohol-guide-slide';
    slide.dataset.group = 'liver';
    slide.dataset.menuTitle = 'แอลกอฮอล์: เพดานและดื่มมาตรฐาน';
    slide.dataset.section = 'LIVER / ALCOHOL';
    slide.dataset.transition = 'fade';
    slide.id = 'alcohol-guide';
    slide.innerHTML = `
      <div class="slide-kicker">LIVER • ALCOHOL 06.6</div>
      <h2>แอลกอฮอล์: “ไม่เกิน” ไม่ได้แปลว่า “ปลอดภัย”</h2>
      <p class="lead">สำหรับผู้ใหญ่ที่เลือกดื่ม CDC ใช้เพดานไม่เกิน 2 U.S. standard drinks ในวันหนึ่งสำหรับผู้ชาย และไม่เกิน 1 สำหรับผู้หญิง แต่การดื่มน้อยกว่าหรือไม่ดื่มลดความเสี่ยงได้มากกว่า และไม่ควรเริ่มดื่มเพื่อหวังผลต่อสุขภาพ</p>

      <div class="alcohol-limit-layout">
        <div class="daily-limit-panel panel">
          <h3>เพดานต่อวันเมื่อ “เลือกดื่ม” <small>U.S. standard drink = 14 g ethanol</small></h3>
          <div class="daily-limit-grid">
            <article class="male"><span>ผู้ชาย</span><b>≤2</b><small>ดื่มมาตรฐานในวันหนึ่ง</small></article>
            <article class="female"><span>ผู้หญิง</span><b>≤1</b><small>ดื่มมาตรฐานในวันหนึ่ง</small></article>
            <article class="less"><span>ทางเลือกที่เสี่ยงต่ำกว่า</span><b>0</b><small>ไม่ดื่ม หรือดื่มน้อยลง</small></article>
          </div>
          <div class="not-a-quota"><b>ไม่ใช่โควตา:</b> ไม่ต้องดื่มให้ครบ ไม่ควรสะสม quota ไปดื่มรวดเดียว และไม่มีปริมาณที่รับประกันว่าไม่เพิ่มความเสี่ยงมะเร็ง</div>
        </div>

        <div class="standard-drink-panel panel">
          <h3>หนึ่ง “ดื่มมาตรฐาน” ต้องดูทั้งปริมาตรและ ABV</h3>
          <div class="drink-example-grid">
            <article><b>เบียร์</b><span>330 mL • 5%</span><strong>≈0.93 drink</strong><small>13.0 g ethanol</small></article>
            <article><b>คราฟต์เบียร์</b><span>330 mL • 8%</span><strong>≈1.49 drinks</strong><small>20.8 g ethanol</small></article>
            <article><b>ไวน์ 1 แก้ว</b><span>150 mL • 12%</span><strong>≈1.01 drink</strong><small>14.2 g ethanol</small></article>
            <article><b>ไวน์ 1 ขวด</b><span>750 mL • 12%</span><strong>≈5.07 drinks</strong><small>71.0 g ethanol</small></article>
            <article><b>สุรากลั่น 1 shot</b><span>45 mL • 40%</span><strong>≈1.01 drink</strong><small>14.2 g ethanol</small></article>
            <article><b>โซจู 1 ขวด</b><span>360 mL • 16.5%</span><strong>≈3.35 drinks</strong><small>46.9 g ethanol</small></article>
          </div>
        </div>
      </div>

      <div class="alcohol-definition-note"><b>ระวังนิยามต่างประเทศ:</b> U.S. standard drink = 14 g ethanol ส่วนเครื่องมือ AUDIT ที่ใช้ในไทยมักนับ 1 ดื่มมาตรฐาน ≈10 g จึงห้ามนำเลข 2/1 ไปใช้กับนิยาม 10 g โดยไม่แปลงหน่วย</div>
      <div class="alcohol-abstain-row"><span>ควรงดทั้งหมดเมื่อ:</span><b>ตั้งครรภ์/วางแผนตั้งครรภ์</b><b>ต้องขับรถหรือใช้เครื่องจักร</b><b>อายุต่ำกว่าเกณฑ์กฎหมาย</b><b>มีโรค/ยาที่ห้ามดื่ม</b><b>ควบคุมปริมาณไม่ได้</b></div>

      <div aria-label="แหล่งอ้างอิงของสไลด์นี้" class="source-chips">
        <span>อ้างอิง</span>
        <a href="${sources.cdcModerate}" rel="noopener noreferrer" target="_blank">CDC: Moderate drinking</a>
        <a href="${sources.niaaaStandard}" rel="noopener noreferrer" target="_blank">NIAAA: Standard drink</a>
        <a href="${sources.whoAlcohol}" rel="noopener noreferrer" target="_blank">WHO: No safe amount</a>
        <a href="${sources.thaiAudit}" rel="noopener noreferrer" target="_blank">ThaiHealth: 10 g drink</a>
      </div>`;
    return slide;
  }

  function buildAlcoholCalculatorSlide() {
    const slide = document.createElement('section');
    slide.className = 'slide interactive-slide alcohol-calculator-slide';
    slide.dataset.group = 'liver';
    slide.dataset.menuTitle = 'คำนวณปริมาณแอลกอฮอล์';
    slide.dataset.section = 'LIVER / ALCOHOL';
    slide.dataset.transition = 'fade';
    slide.id = 'alcohol-calculator';
    slide.innerHTML = `
      <div class="slide-kicker">LIVER • ALCOHOL 06.7</div>
      <h2>คำนวณดื่มมาตรฐาน <small>เปลี่ยนปริมาตร ABV และจำนวนภาชนะได้</small></h2>
      <p class="lead">เครื่องมือนี้ประมาณปริมาณเอทานอล ไม่ได้คำนวณระดับแอลกอฮอล์ในเลือด ความสามารถในการขับรถ หรือความปลอดภัยเฉพาะบุคคล</p>

      <div class="alcohol-calculator" data-interactive="alcohol">
        <div class="alcohol-input-panel panel">
          <div class="alcohol-presets" aria-label="ตัวอย่างเครื่องดื่ม">
            <button type="button" data-alcohol-preset="330,5">เบียร์ 330 mL • 5%</button>
            <button type="button" data-alcohol-preset="330,8">คราฟต์ 330 mL • 8%</button>
            <button type="button" data-alcohol-preset="150,12">ไวน์ 150 mL • 12%</button>
            <button type="button" data-alcohol-preset="45,40">สุรา 45 mL • 40%</button>
            <button type="button" data-alcohol-preset="360,16.5">โซจู 360 mL • 16.5%</button>
          </div>
          <label><span>ปริมาตรต่อภาชนะ</span><div><input id="alcohol-volume" min="1" max="5000" step="1" type="number" value="330"/><em>mL</em></div></label>
          <label><span>Alcohol by volume</span><div><input id="alcohol-abv" min="0" max="100" step="0.1" type="number" value="5"/><em>% ABV</em></div></label>
          <label><span>จำนวนภาชนะ/แก้ว</span><div><input id="alcohol-count" min="0" max="30" step="0.25" type="number" value="1"/><em>servings</em></div></label>
          <label><span>เพดานที่ใช้เปรียบเทียบ</span><select id="alcohol-sex"><option value="male">ผู้ชาย • 2 U.S. drinks/day</option><option value="female">ผู้หญิง • 1 U.S. drink/day</option></select></label>
          <button id="alcohol-reset" type="button">คืนค่าตัวอย่าง</button>
        </div>

        <div class="alcohol-output-panel">
          <div class="alcohol-equation panel">
            <span>สมการประมาณ</span>
            <code>กรัมเอทานอล = mL × (ABV ÷ 100) × 0.789 × จำนวน</code>
            <small>0.789 g/mL คือความหนาแน่นโดยประมาณของเอทานอล</small>
          </div>
          <div class="alcohol-results" aria-live="polite">
            <article><span>เอทานอลบริสุทธิ์</span><b id="alcohol-grams">13.0</b><small>กรัม</small></article>
            <article><span>U.S. standard drinks</span><b id="alcohol-us-drinks">0.93</b><small>หารด้วย 14 g</small></article>
            <article><span>Thai/AUDIT drinks</span><b id="alcohol-thai-drinks">1.30</b><small>หารด้วย 10 g</small></article>
          </div>
          <div class="alcohol-limit-status panel within" id="alcohol-limit-status">
            <span>เทียบกับเพดานต่อวัน</span>
            <b id="alcohol-limit-headline">ประมาณ 47% ของเพดานผู้ชาย</b>
            <p id="alcohol-limit-copy">ตัวเลขต่ำกว่าเพดานไม่ได้แปลว่าปลอดภัย และไม่ใช้ตัดสินว่าสามารถขับรถได้</p>
          </div>
        </div>
      </div>

      <div class="alcohol-calc-notes"><span><b>สูตรผสม:</b> cocktail อาจมีสุรามากกว่า 1 shot</span><span><b>เทจริง:</b> แก้วใหญ่และการรินเองมักเกิน serving มาตรฐาน</span><span><b>เช็กฉลาก:</b> ABV ของ craft beer, wine และ soju ต่างกันมาก</span></div>

      <div aria-label="แหล่งอ้างอิงของสไลด์นี้" class="source-chips">
        <span>อ้างอิง</span>
        <a href="${sources.niaaaCalculator}" rel="noopener noreferrer" target="_blank">NIAAA: Drink calculator</a>
        <a href="${sources.niaaaStandard}" rel="noopener noreferrer" target="_blank">NIAAA: 14 g definition</a>
        <a href="${sources.thaiAudit}" rel="noopener noreferrer" target="_blank">ThaiHealth: 10 g definition</a>
        <a href="${sources.cdcCancer}" rel="noopener noreferrer" target="_blank">CDC: Alcohol and cancer</a>
      </div>`;
    return slide;
  }

  function addAlcoholSlides() {
    if (document.getElementById('alcohol-guide') || document.getElementById('alcohol-calculator')) return;
    const anchor = document.getElementById('liver-gallstone')
      || document.getElementById('liver-hbv')
      || document.getElementById('liver-masld')
      || document.getElementById('liver-start');
    if (!anchor) return;

    const guide = buildAlcoholGuideSlide();
    const calculator = buildAlcoholCalculatorSlide();
    anchor.insertAdjacentElement('afterend', guide);
    guide.insertAdjacentElement('afterend', calculator);

    const outline = document.querySelector('#liver-start .chapter-outline');
    if (outline) {
      outline.classList.add('liver-outline-expanded');
      if (!outline.querySelector('[data-jump="alcohol-guide"]')) {
        outline.insertAdjacentHTML('beforeend', `
          <button class="chapter-outline-card" data-jump="alcohol-guide" data-readable-card="" type="button"><b>06.6</b><span>แอลกอฮอล์</span><small>เพดาน 2/1 drinks และตัวอย่างปริมาณจริง</small></button>
          <button class="chapter-outline-card" data-jump="alcohol-calculator" data-readable-card="" type="button"><b>06.7</b><span>Alcohol Calculator</span><small>คำนวณจาก mL, ABV และจำนวนภาชนะ</small></button>`);
      }
    }
  }

  function setupAlcoholCalculator() {
    const root = document.querySelector('[data-interactive="alcohol"]');
    if (!root) return;

    const volume = document.getElementById('alcohol-volume');
    const abv = document.getElementById('alcohol-abv');
    const count = document.getElementById('alcohol-count');
    const sex = document.getElementById('alcohol-sex');
    const reset = document.getElementById('alcohol-reset');
    const gramsOutput = document.getElementById('alcohol-grams');
    const usOutput = document.getElementById('alcohol-us-drinks');
    const thaiOutput = document.getElementById('alcohol-thai-drinks');
    const status = document.getElementById('alcohol-limit-status');
    const headline = document.getElementById('alcohol-limit-headline');
    const copy = document.getElementById('alcohol-limit-copy');

    const numberValue = (element, fallback, min, max) => {
      const parsed = Number(element?.value);
      if (!Number.isFinite(parsed)) return fallback;
      return Math.max(min, Math.min(max, parsed));
    };

    const update = () => {
      const volumeMl = numberValue(volume, 330, 0, 5000);
      const alcoholPercent = numberValue(abv, 5, 0, 100);
      const servings = numberValue(count, 1, 0, 30);
      const grams = volumeMl * (alcoholPercent / 100) * 0.789 * servings;
      const usDrinks = grams / 14;
      const thaiDrinks = grams / 10;
      const male = sex?.value !== 'female';
      const ceiling = male ? 2 : 1;
      const percent = ceiling > 0 ? (usDrinks / ceiling) * 100 : 0;

      if (gramsOutput) gramsOutput.textContent = grams.toFixed(1);
      if (usOutput) usOutput.textContent = usDrinks.toFixed(2);
      if (thaiOutput) thaiOutput.textContent = thaiDrinks.toFixed(2);

      if (status && headline && copy) {
        status.classList.remove('within', 'at-limit', 'over-limit');
        if (usDrinks > ceiling + 0.01) {
          status.classList.add('over-limit');
          headline.textContent = `ประมาณ ${percent.toFixed(0)}% ของเพดาน ${male ? 'ผู้ชาย' : 'ผู้หญิง'} • เกินเพดานต่อวัน`;
          copy.textContent = 'ลดปริมาณหรือหยุดดื่มในวันนี้ เพดานนี้ไม่ควรถูกเฉลี่ยหรือสะสมไปวันอื่น';
        } else if (usDrinks >= ceiling * 0.9 && usDrinks > 0) {
          status.classList.add('at-limit');
          headline.textContent = `ประมาณ ${percent.toFixed(0)}% ของเพดาน ${male ? 'ผู้ชาย' : 'ผู้หญิง'} • ใกล้เต็มเพดาน`;
          copy.textContent = 'ไม่จำเป็นต้องดื่มเพิ่ม การดื่มน้อยลงหรือไม่ดื่มลดความเสี่ยงได้มากกว่า';
        } else {
          status.classList.add('within');
          headline.textContent = `ประมาณ ${percent.toFixed(0)}% ของเพดาน ${male ? 'ผู้ชาย' : 'ผู้หญิง'}`;
          copy.textContent = 'ต่ำกว่าเพดานไม่ได้แปลว่าปลอดภัย และไม่ใช้ตัดสินว่าสามารถขับรถหรือใช้เครื่องจักรได้';
        }
      }
    };

    root.querySelectorAll('[data-alcohol-preset]').forEach((button) => {
      button.addEventListener('click', () => {
        const [presetVolume, presetAbv] = button.dataset.alcoholPreset.split(',').map(Number);
        if (volume && Number.isFinite(presetVolume)) volume.value = String(presetVolume);
        if (abv && Number.isFinite(presetAbv)) abv.value = String(presetAbv);
        if (count) count.value = '1';
        update();
      });
    });

    [volume, abv, count, sex].forEach((element) => {
      element?.addEventListener('input', update);
      element?.addEventListener('change', update);
    });

    reset?.addEventListener('click', () => {
      if (volume) volume.value = '330';
      if (abv) abv.value = '5';
      if (count) count.value = '1';
      if (sex) sex.value = 'male';
      update();
    });

    update();
  }

  mergeRiskScoreSlides();
  mergeCacSlides();
  updateCvdOutline();
  addAlcoholSlides();
  setupAlcoholCalculator();
})();