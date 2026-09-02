(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const plugins = [window.RevealNotes, window.RevealZoom].filter(Boolean);
  const sectionChip = document.getElementById('section-chip');
  const effectsButton = document.getElementById('effects-toggle');
  const themeButton = document.getElementById('theme-toggle');
  const bootScreen = document.getElementById('boot-screen');
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const navDrawer = document.getElementById('nav-drawer');
  const navBackdrop = document.getElementById('nav-backdrop');
  const drawerList = document.getElementById('drawer-list');
  const drawerCurrent = document.getElementById('drawer-current');
  const chapterTabs = document.getElementById('chapter-tabs');
  const topicSubnav = document.getElementById('topic-subnav');
  const chapterProgress = document.querySelector('#chapter-progress i');
  const clinicRoot = document.getElementById('clinic-mode');
  const clinicSearch = document.getElementById('clinic-search');
  const clinicFilters = document.getElementById('clinic-filters');
  const clinicTopicList = document.getElementById('clinic-topic-list');
  const clinicResultCount = document.getElementById('clinic-result-count');
  const clinicEmpty = document.getElementById('clinic-empty');
  const clinicThemeButton = document.getElementById('clinic-theme-toggle');
  const openClinicButton = document.getElementById('open-clinic-mode');
  const openLearnButton = document.getElementById('open-learn-mode');
  const clinicDetailButton = document.getElementById('clinic-open-detail');
  const clinicPrintButton = document.getElementById('clinic-print');
  const skipLink = document.querySelector('.skip-link');

  const CLINIC_TOPICS = [
    {
      key:'bp', category:'หัวใจและหลอดเลือด', icon:'BP', code:'03.4', title:'ความดันโลหิตสูง',
      aliases:'ความดัน bp hypertension หน้ามืด 180 120', slideId:'bp-action',
      summary:'เริ่มจากยืนยันว่าค่าวัดถูกต้อง แล้วแยกการติดตามทั่วไปออกจากภาวะฉุกเฉิน',
      meaning:'ค่าครั้งเดียวอาจเปลี่ยนตามความเครียด การพัก ท่าวัด ขนาดผ้าพันแขน และยา จึงควรดูค่าเฉลี่ยและอาการร่วม',
      actions:['ทบทวนวิธีวัดและค่าที่บ้านหลายวัน','ตรวจยาที่ใช้ ความสม่ำเสมอ และอาการข้างเคียง','ตกลงเป้าหมายและช่วงเวลานัดติดตามร่วมกัน'],
      urgent:'หากความดันมากกว่า 180/120 mmHg ร่วมกับเจ็บหน้าอก หอบ อ่อนแรง ชา พูดไม่ชัด สับสน หรือมองเห็นผิดปกติ ให้ขอความช่วยเหลือฉุกเฉิน',
      teachback:'“กลับบ้านแล้วจะวัดความดันเวลาไหน และมีอาการอะไรที่ต้องไปฉุกเฉินทันที?”'
    },
    {
      key:'glucose', category:'น้ำตาลและเมตาบอลิก', icon:'A1', code:'01.2', title:'น้ำตาลสะสม (HbA1c)',
      aliases:'เบาหวาน น้ำตาล glucose hba1c a1c fasting sugar', slideId:'hba1c-interpretation',
      summary:'อธิบายแนวโน้มน้ำตาลย้อนหลัง และตรวจว่ามีภาวะใดทำให้ผลคลาดเคลื่อนหรือไม่',
      meaning:'น้ำตาลสะสม (HbA1c) สะท้อนระดับน้ำตาลเฉลี่ยประมาณ 2–3 เดือน ควรอ่านร่วมกับค่าน้ำตาล อาการ และภาวะที่กระทบเม็ดเลือดแดง',
      actions:['เทียบผลเดิมและดูว่าตรวจครั้งแรกหรือไม่','ทบทวนอาหาร ยา การออกกำลัง และอาการน้ำตาลสูงหรือต่ำ','กำหนดว่าจะยืนยันผลหรือปรับแผนเมื่อไร'],
      urgent:'HbA1c เพียงตัวเดียวไม่บอกภาวะฉุกเฉิน หากมีซึม สับสน อาเจียนมาก หายใจลึกเร็ว หรือขาดน้ำมาก ควรประเมินเร่งด่วน',
      teachback:'“ผลนี้บอกแนวโน้มช่วงกี่เดือน และสิ่งแรกที่เราตกลงว่าจะทำคืออะไร?”'
    },
    {
      key:'lipids', category:'น้ำตาลและเมตาบอลิก', icon:'LDL', code:'02.14', title:'ไขมันในเลือด',
      aliases:'ไขมัน cholesterol ldl hdl triglyceride tg apob non-hdl', slideId:'lipid-flow',
      summary:'อ่านค่าไขมันหลัก ได้แก่ ไขมันคอเลสเตอรอลชนิดไม่ดี (LDL-cholesterol) คอเลสเตอรอลที่ไม่ใช่ HDL (non-HDL-C) และอะโพไลโปโปรตีนบี (ApoB) ร่วมกับความเสี่ยงโดยรวม',
      meaning:'ผลไขมันแต่ละค่าบอกข้อมูลต่างกัน จึงไม่ควรตัดสินจากสีแดงในใบแล็บหรืออัตราส่วนเพียงค่าเดียว เป้าหมายขึ้นกับความเสี่ยงของแต่ละคน',
      actions:['ยืนยันหน่วย ภาวะอดอาหาร และผลเดิม','ทบทวนเบาหวาน ไทรอยด์ ไต ตับ ยา แอลกอฮอล์ และประวัติครอบครัว','ตกลงเป้าหมายตามความเสี่ยง ไม่ไล่ตามอัตราส่วนเพียงค่าเดียว'],
      urgent:'ไขมันไตรกลีเซอไรด์ (Triglyceride) สูงมากร่วมกับปวดท้องรุนแรงหรืออาเจียน ควรได้รับการประเมินโดยเร็ว',
      teachback:'“วันนี้เราจะให้ความสำคัญกับค่าใด และเพราะเหตุใด?”'
    },
    {
      key:'kidney', category:'ไตและตับ', icon:'G/A', code:'05.4', title:'การกรองไต (eGFR) และโปรตีนรั่ว (uACR)',
      aliases:'ไต kidney egfr creatinine uacr albuminuria โปรตีนรั่ว', slideId:'kidney-calculator',
      summary:'ดูการกรองไตและโปรตีนรั่วคู่กัน และติดตามอย่างน้อย 3 เดือนก่อนสรุปโรคไตเรื้อรัง (CKD)',
      meaning:'อัตราการกรองของไตโดยประมาณ (eGFR) คำนวณจากครีอะตินีน (Creatinine) อายุ และเพศ ส่วนอัตราส่วนอัลบูมินต่อครีอะตินีนในปัสสาวะ (uACR) บอกภาวะโปรตีนรั่ว',
      actions:['เทียบกับผลเดิมและดูว่าค่าเปลี่ยนเร็วหรือไม่','ทบทวนภาวะขาดน้ำ ยา อาหารเสริม มวลกล้ามเนื้อ และการเจ็บป่วยเฉียบพลัน','กำหนดการตรวจซ้ำ การตรวจปัสสาวะ หรือการส่งต่อเมื่อเหมาะสม'],
      urgent:'ปัสสาวะลดลงมาก บวมร่วมกับหอบ ซึม สับสน หรือผลไตแย่ลงเร็ว ควรประเมินเร่งด่วน',
      teachback:'“ทำไมเราต้องดูทั้ง eGFR และ uACR และจะตรวจซ้ำเมื่อไร?”'
    },
    {
      key:'cbc', category:'เลือด', icon:'CBC', code:'04', title:'ความสมบูรณ์ของเลือด (CBC)',
      aliases:'เลือด cbc anemia โลหิตจาง hb hct mcv ferritin iron platelet wbc', slideId:'blood-cbc-map',
      summary:'เริ่มจากดูว่าเม็ดเลือดแดง เม็ดเลือดขาว หรือเกล็ดเลือดผิดปกติ แล้วหาสาเหตุจากแนวโน้มและอาการ',
      meaning:'การตรวจความสมบูรณ์ของเลือด (CBC) เป็นข้อมูลเบื้องต้น ไม่ใช่คำวินิจฉัยสุดท้าย ต้องดูจำนวนและขนาดเซลล์ ผลเดิม และอาการร่วมกัน',
      actions:['ระบุว่าส่วนใดผิดปกติและมากน้อยเพียงใด','ทบทวนเลือดออก การติดเชื้อ ยา อาหาร โรคเรื้อรัง และประวัติครอบครัว','เลือกการตรวจยืนยัน เช่น ธาตุเหล็กสะสม (Ferritin) หรือการดูรูปร่างเม็ดเลือด (Blood smear) ตามรูปแบบที่พบ'],
      urgent:'เหนื่อยมาก เจ็บหน้าอก เป็นลม เลือดออกไม่หยุด มีจุดเลือดออกมาก หรือมีไข้ร่วมกับเม็ดเลือดขาวต่ำ ควรประเมินเร่งด่วน',
      teachback:'“CBC ส่วนไหนที่เรากำลังติดตาม และขั้นต่อไปคือการตรวจอะไรหรือเมื่อไร?”'
    },
    {
      key:'liver', category:'ไตและตับ', icon:'LFT', code:'06.2', title:'ค่าตรวจตับผิดปกติ',
      aliases:'ตับ liver lft ast alt alp ggt bilirubin albumin inr ไขมันพอกตับ', slideId:'liver-followup',
      summary:'แยกรูปแบบเซลล์ตับ ท่อน้ำดี บิลิรูบิน และการสร้างโปรตีน พร้อมทบทวนยาและแอลกอฮอล์',
      meaning:'การตรวจการทำงานของตับ (Liver function tests: LFT) แต่ละค่าบอกข้อมูลต่างกัน ระดับและรูปแบบที่พบร่วมกันสำคัญกว่าคำว่า “สูง” เพียงค่าเดียว',
      actions:['ดูผลเดิม หน่วย และช่วงอ้างอิง','ทบทวนยาแก้ปวด ยาอื่น สมุนไพร อาหารเสริม แอลกอฮอล์ และการออกกำลัง','พิจารณาตรวจซ้ำ อัลตราซาวด์ ไวรัสตับอักเสบ หรือพังผืดตามบริบท'],
      urgent:'ตัวเหลืองร่วมกับสับสนหรือเลือดออก ปวดชายโครงขวารุนแรงมีไข้ หรือผลแย่ลงเร็ว ควรพบแพทย์เร็ว',
      teachback:'“มีสิ่งใดที่ควรงดหรือแจ้งก่อนตรวจซ้ำ และอาการใดที่ต้องกลับมาเร็ว?”'
    },
    {
      key:'cvd', category:'หัวใจและหลอดเลือด', icon:'CVD', code:'07', title:'ความเสี่ยงหัวใจและหลอดเลือด',
      aliases:'หัวใจ cvd risk score prevent cac calcium score est echo', slideId:'cvd-start',
      summary:'ใช้คะแนนความเสี่ยงเพื่อคุยทางเลือก ไม่ใช้แทนประวัติ อาการ การตรวจร่างกาย หรือการตัดสินใจร่วมกัน',
      meaning:'คะแนนนี้รวมหลายปัจจัยเพื่อประมาณโอกาสเกิดเหตุการณ์ในอนาคต จึงขึ้นกับประชากรและข้อมูลที่ใช้คำนวณ',
      actions:['ตรวจว่าคะแนนและช่วงอายุเหมาะกับเครื่องมือหรือไม่','อธิบายความเสี่ยงเป็นจำนวนคนและช่วงเวลา แทนการบอกเพียงว่าเสี่ยงสูง','ตกลงปัจจัยที่เปลี่ยนได้และการตรวจเพิ่มเฉพาะเมื่อผลจะเปลี่ยนแผน'],
      urgent:'เจ็บหรือแน่นหน้าอก หอบ เหงื่อแตก เป็นลม หรืออ่อนแรงครึ่งซีกแบบเฉียบพลัน ต้องประเมินฉุกเฉิน ไม่รอคำนวณคะแนน',
      teachback:'“คะแนนนี้ช่วยตัดสินใจเรื่องใด และมีอาการอะไรที่ไม่ควรรอดูนัด?”'
    },
    {
      key:'cancer', category:'คัดกรองและป้องกัน', icon:'TM', code:'08', title:'สารบ่งชี้มะเร็ง (Tumor markers)',
      aliases:'มะเร็ง tumor marker psa afp cea ca125 ca19-9 ca15-3', slideId:'tumor-use',
      summary:'ย้ำว่าค่าสูงไม่เท่ากับเป็นมะเร็ง และค่าปกติไม่ตัดมะเร็ง ต้องยืนยันตามอวัยวะและบริบท',
      meaning:'สารบ่งชี้มะเร็ง (Tumor marker) หลายชนิดใช้ช่วยประเมินหรือติดตามในสถานการณ์เฉพาะ ไม่เหมาะสำหรับใช้คัดกรองคนทั่วไปเพียงค่าเดียว',
      actions:['ดูชื่อการตรวจ หน่วย ช่วงอ้างอิง และแนวโน้ม','ทบทวนสาเหตุไม่ใช่มะเร็งที่ทำให้ค่าสูง','วางแผนยืนยันด้วยประวัติ ตรวจร่างกาย ภาพถ่าย หรือชิ้นเนื้อตามข้อบ่งชี้'],
      urgent:'ค่าสารบ่งชี้มะเร็งเพียงอย่างเดียวไม่ใช่เหตุฉุกเฉิน ต้องประเมินจากอาการและอวัยวะที่เกี่ยวข้อง',
      teachback:'“ผลสูงแปลว่าเป็นมะเร็งเลยหรือไม่ และขั้นยืนยันต่อไปคืออะไร?”'
    },
    {
      key:'vaccines', category:'คัดกรองและป้องกัน', icon:'VAX', code:'09', title:'วัคซีนผู้ใหญ่',
      aliases:'วัคซีน vaccine influenza covid tdap shingles pneumococcal rsv hpv', slideId:'vaccines-core',
      summary:'เลือกวัคซีนจากอายุ ประวัติเดิม โรคร่วม การตั้งครรภ์ ภูมิคุ้มกัน อาชีพ และการเดินทาง',
      meaning:'ตารางอายุเป็นจุดเริ่มต้น กำหนดการฉีดจริงอาจเปลี่ยนตามวัคซีนที่เคยได้รับและข้อห้ามเฉพาะบุคคล',
      actions:['ตรวจสมุดหรือรูปประวัติวัคซีน','ทบทวนการแพ้รุนแรง การตั้งครรภ์ ภูมิคุ้มกัน และยากดภูมิ','ระบุชื่อวัคซีน เข็มถัดไป และวันนัดให้ชัด'],
      urgent:'หลังฉีด หากหายใจลำบาก หน้าหรือคอบวม หน้ามืดมาก หรือมีอาการแพ้รุนแรง ให้ขอความช่วยเหลือฉุกเฉิน',
      teachback:'“วันนี้ได้รับวัคซีนอะไร และเข็มถัดไปควรมาวันไหน?”'
    },
    {
      key:'bone', category:'คัดกรองและป้องกัน', icon:'DXA', code:'11', title:'มวลกระดูก',
      aliases:'กระดูก bone dxa t-score z-score osteoporosis osteopenia frax', slideId:'bone-followup',
      summary:'เลือกใช้คะแนนเทียบผู้ใหญ่สุขภาพดี (T-score) หรือคะแนนเทียบคนวัยเดียวกัน (Z-score) ให้ตรงกลุ่ม พร้อมดูประวัติกระดูกหักและความเสี่ยงหกล้ม',
      meaning:'เอกซเรย์วัดความหนาแน่นมวลกระดูก (DXA) ไม่ได้บอกคุณภาพกระดูกทั้งหมด จึงต้องตีความร่วมกับอายุ ยา โรคร่วม และตำแหน่งที่วัด',
      actions:['ยืนยันว่าควรใช้ T-score หรือ Z-score','ทบทวนกระดูกหักเดิม การหกล้ม สเตียรอยด์ และสาเหตุรอง','ตกลงเรื่องการออกกำลัง แคลเซียม/วิตามิน D ยา และช่วงตรวจซ้ำตามความเสี่ยง'],
      urgent:'ปวดรุนแรงหลังล้ม เดินลงน้ำหนักไม่ได้ หรือสงสัยกระดูกสะโพกหรือกระดูกสันหลังหัก ควรประเมินเร็ว',
      teachback:'“ผลนี้ใช้คะแนนชนิดใด และเราจะลดโอกาสหกล้มอย่างไรหนึ่งข้อ?”'
    },
    {
      key:'eyes', category:'ประสาทสัมผัส', icon:'EYE', code:'12', title:'สายตาและการมองเห็น',
      aliases:'ตา eye vision presbyopia color blindness สายตายาว มองสี', slideId:'other-vision',
      summary:'แยกการเปลี่ยนตามวัยออกจากอาการเฉียบพลันที่อาจต้องรักษาเร็ว',
      meaning:'มองใกล้ลำบากตามวัยมักค่อยเป็นค่อยไป แต่อาการทันทีทันใด ข้างเดียว หรือร่วมกับปวดไม่ควรเหมารวมว่าเป็นอายุ',
      actions:['ถามว่าเริ่มเมื่อไร เป็นข้างเดียวหรือสองข้าง และมีปวดหรือไม่','ทบทวนเบาหวาน ความดัน ยา และอุบัติเหตุ','นัดตรวจสายตาหรือส่งจักษุแพทย์ตามรูปแบบอาการ'],
      urgent:'ตามัวหรือสูญเสียการมองเห็นทันที เห็นม่านบัง แสงแฟลชร่วมกับจุดลอยมาก หรือปวดตารุนแรง ควรประเมินเร่งด่วน',
      teachback:'“อาการแบบใดที่ต้องไปพบแพทย์ทันทีแทนการรอนัดตรวจสายตา?”'
    },
    {
      key:'hearing', category:'ประสาทสัมผัส', icon:'EAR', code:'13', title:'การได้ยิน',
      aliases:'หู hearing audiogram tinnitus หูตึง เสียงดัง', slideId:'hearing-noise',
      summary:'ดูรูปแบบกราฟ ความต่างระหว่างสองข้าง และการเปลี่ยนจากค่าเดิม พร้อมลดเสียงที่เป็นอันตราย',
      meaning:'หูตึงตามวัยมักค่อย ๆ ทำให้ได้ยินเสียงความถี่สูงลดลงทั้งสองข้าง ส่วนการได้ยินลดลงฉับพลันหรือไม่เท่ากันต้องประเมินต่างออกไป',
      actions:['ถามเวลาเริ่ม อาการข้างเดียว หูอื้อ เวียนศีรษะ และการสัมผัสเสียง','ทบทวนการใช้อุปกรณ์ป้องกันเสียงและลดเวลาสัมผัสเสียงดัง','นัดตรวจยืนยันหรือส่งพบแพทย์หู คอ จมูกตามลักษณะอาการ'],
      urgent:'การได้ยินลดลงฉับพลัน โดยเฉพาะข้างเดียว หรือร่วมกับอาการทางระบบประสาท ควรพบแพทย์เร็ว',
      teachback:'“คุณจะลดการสัมผัสเสียงดังหรือป้องกันหูอย่างไร และอาการใดต้องมาตรวจเร็ว?”'
    }
  ];

  const GROUPS = {
    home:     { label: 'หน้าแรก', short: 'HOME', color: '#72e0ff' },
    diabetes: { label: '01 เบาหวาน', short: 'DIABETES', color: '#5de4c7' },
    lipids:   { label: '02 ไขมันในเลือด', short: 'LIPIDS', color: '#ffd166' },
    bp:       { label: '03 ความดันโลหิต', short: 'BLOOD PRESSURE', color: '#74d9ff' },
    blood:    { label: '04 เลือดและ CBC', short: 'BLOOD / CBC', color: '#e88fbd' },
    kidney:   { label: '05 ไต', short: 'KIDNEY', color: '#55d7ff' },
    liver:    { label: '06 ตับ', short: 'LIVER', color: '#b8cf63' },
    cvd:      { label: '07 หัวใจและหลอดเลือด', short: 'CVD RISK', color: '#ff8b72' },
    cancer:   { label: '08 มะเร็ง', short: 'CANCER', color: '#ff83c7' },
    vaccines: { label: '09 วัคซีนผู้ใหญ่', short: 'VACCINES', color: '#ba9cff' },
    vitamins: { label: '10 วิตามิน', short: 'VITAMINS', color: '#e6c65d' },
    bone:     { label: '11 มวลกระดูก', short: 'BONE DENSITY', color: '#d49a70' },
    eyes:     { label: '12 ตา', short: 'EYE HEALTH', color: '#66c8ff' },
    hearing:  { label: '13 หู', short: 'HEARING', color: '#ff9f6e' },
    other:    { label: '14 ผลตรวจอื่น', short: 'OTHER', color: '#9d8dff' },
    summary:  { label: 'สรุปและอ้างอิง', short: 'SUMMARY', color: '#72e0ff' }
  };
  const LIGHT_GROUP_COLORS = {
    home:'#087b9c', diabetes:'#087f6c', lipids:'#9a6800', bp:'#087b9c',
    blood:'#a93270', kidney:'#087b9c', liver:'#657d0a', cvd:'#b4561c',
    cancer:'#b93678', vaccines:'#6654bc', vitamins:'#806900', bone:'#9a512a',
    eyes:'#087b9c', hearing:'#a94d1e', other:'#6654bc', summary:'#087b9c'
  };
  const GROUP_ORDER = ['home', 'diabetes', 'lipids', 'bp', 'blood', 'kidney', 'liver', 'cvd', 'cancer', 'vaccines', 'vitamins', 'bone', 'eyes', 'hearing', 'other', 'summary'];
  const SLIDE_ORDER = {
    bp: ['bp-start', 'bp-measurement', 'bp-categories', 'bp-confirm', 'bp-action'],
    blood: ['blood-start', 'blood-cbc-map', 'other-anemia', 'blood-iron', 'other-thal', 'blood-eosinophil'],
    liver: ['liver-start', 'liver-panel', 'liver-followup', 'liver-masld', 'liver-hbv', 'liver-gallstone'],
    vaccines: ['vaccines-start', 'vaccines-core', 'vaccines-age-special', 'vaccines-catchup'],
    vitamins: ['vitamins-start', 'vitamin-d-types', 'vitamin-d-sun-dose', 'vitamin-c'],
    bone: ['bone-start', 'bone-scores', 'bone-followup'],
    eyes: ['eyes-start', 'other-vision', 'other-color'],
    hearing: ['hearing-start', 'other-hearing', 'hearing-noise']
  };
  const params = new URLSearchParams(location.search);
  const hashHasTopic = /^#\/(?!0(?:\/|$)|home(?:\/|$))/.test(location.hash);
  const clinicRequested = params.get('mode') === 'clinic' || params.has('clinic');
  const initialMode = clinicRequested ? 'clinic' : ((params.get('mode') === 'learn' || params.get('learn') === '1' || hashHasTopic) ? 'learn' : 'clinic');

  let effectsEnabled = false;
  let slides = [];
  let slideIndexById = new Map();
  let slidesByGroup = new Map();
  let menuOpen = false;
  let appMode = initialMode;
  let clinicCategory = 'ทั้งหมด';
  let clinicTopicKey = params.get('clinic') || 'bp';
  let threeInitialized = false;

  function preferredTheme() {
    try {
      const saved = localStorage.getItem('health-deck-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) {}
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme, persist = false) {
    const next = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    const currentGroup = document.documentElement.dataset.group || 'home';
    const currentMeta = GROUPS[currentGroup] || GROUPS.other;
    document.documentElement.style.setProperty('--chapter-color', next === 'light' ? LIGHT_GROUP_COLORS[currentGroup] || LIGHT_GROUP_COLORS.other : currentMeta.color);
    if (themeButton) {
      const light = next === 'light';
      themeButton.textContent = light ? 'Dark' : 'Light';
      themeButton.setAttribute('aria-pressed', String(light));
      themeButton.title = light ? 'เปลี่ยนเป็น Dark theme' : 'เปลี่ยนเป็น Light theme';
    }
    if (clinicThemeButton) {
      const light = next === 'light';
      clinicThemeButton.textContent = light ? 'โหมดมืด' : 'โหมดสว่าง';
      clinicThemeButton.setAttribute('aria-pressed', String(!light));
    }
    if (persist) {
      try { localStorage.setItem('health-deck-theme', next); } catch (_) {}
    }
  }

  function toggleTheme() {
    applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light', true);
  }

  function setElementInert(element, value) {
    if (!element) return;
    element.inert = Boolean(value);
  }

  async function ensureThreeScenes() {
    if (threeInitialized || !window.ThreeSceneManager || !window.Reveal) return;
    threeInitialized = Boolean(await window.ThreeSceneManager.init(window.Reveal));
    window.ThreeSceneManager.setEnabled(appMode === 'learn' && effectsEnabled);
  }

  function updateModeUrl(mode) {
    const url = new URL(location.href);
    url.searchParams.delete('learn');
    url.searchParams.set('mode', mode);
    if (mode === 'clinic') url.searchParams.set('clinic', clinicTopicKey);
    else url.searchParams.delete('clinic');
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }

  function setAppMode(mode, { focus = true, updateUrl = true } = {}) {
    appMode = mode === 'learn' ? 'learn' : 'clinic';
    const clinicActive = appMode === 'clinic';
    document.body.classList.toggle('mode-clinic', clinicActive);
    document.body.classList.toggle('mode-learn', !clinicActive);
    if (clinicRoot) {
      clinicRoot.hidden = !clinicActive;
      setElementInert(clinicRoot, !clinicActive);
    }
    if (skipLink) skipLink.hidden = !clinicActive;
    ['.deck-chrome', '#topic-subnav', '.reveal'].forEach((selector) => setElementInert(document.querySelector(selector), clinicActive));
    if (clinicActive) {
      closeMenu(false);
      window.ThreeSceneManager?.setEnabled?.(false);
      if (focus) requestAnimationFrame(() => clinicSearch?.focus({ preventScroll:true }));
    } else {
      if (effectsEnabled) ensureThreeScenes();
      else window.ThreeSceneManager?.setEnabled?.(false);
      requestAnimationFrame(() => window.Reveal?.layout?.());
      if (focus) requestAnimationFrame(() => openClinicButton?.focus({ preventScroll:true }));
    }
    if (updateUrl) updateModeUrl(appMode);
  }

  function clinicSearchText(topic) {
    return `${topic.title} ${topic.category} ${topic.aliases} ${topic.summary}`.toLocaleLowerCase('th');
  }

  function renderClinicFilters() {
    if (!clinicFilters) return;
    const categories = ['ทั้งหมด', ...new Set(CLINIC_TOPICS.map((topic) => topic.category))];
    clinicFilters.replaceChildren(...categories.map((category) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'clinic-filter';
      button.textContent = category;
      button.classList.toggle('is-active', category === clinicCategory);
      button.setAttribute('aria-pressed', String(category === clinicCategory));
      button.addEventListener('click', () => {
        clinicCategory = category;
        renderClinicFilters();
        renderClinicTopics();
      });
      return button;
    }));
  }

  function selectClinicTopic(key, { updateUrl = true } = {}) {
    const topic = CLINIC_TOPICS.find((item) => item.key === key) || CLINIC_TOPICS[0];
    clinicTopicKey = topic.key;
    const setText = (id, value) => {
      const node = document.getElementById(id);
      if (node) node.textContent = value;
    };
    setText('clinic-guidance-category', topic.category);
    setText('clinic-guidance-title', topic.title);
    setText('clinic-guidance-summary', topic.summary);
    setText('clinic-guidance-code', topic.code);
    setText('clinic-guidance-meaning', topic.meaning);
    setText('clinic-guidance-urgent-text', topic.urgent);
    setText('clinic-guidance-teachback', topic.teachback);
    setText('clinic-announcer', `เปิดคำแนะนำเรื่อง ${topic.title}`);
    const actions = document.getElementById('clinic-guidance-actions');
    if (actions) actions.replaceChildren(...topic.actions.map((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      return li;
    }));
    clinicDetailButton.dataset.slideId = topic.slideId;
    document.querySelectorAll('.clinic-topic-button').forEach((button) => {
      const active = button.dataset.topicKey === topic.key;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (updateUrl && appMode === 'clinic') updateModeUrl('clinic');
  }

  function renderClinicTopics() {
    if (!clinicTopicList) return;
    const query = clinicSearch?.value.trim().toLocaleLowerCase('th') || '';
    const filtered = CLINIC_TOPICS.filter((topic) => {
      const categoryMatches = clinicCategory === 'ทั้งหมด' || topic.category === clinicCategory;
      return categoryMatches && (!query || clinicSearchText(topic).includes(query));
    });
    clinicTopicList.replaceChildren(...filtered.map((topic) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'clinic-topic-button';
      button.dataset.topicKey = topic.key;
      button.setAttribute('aria-pressed', String(topic.key === clinicTopicKey));
      button.classList.toggle('is-active', topic.key === clinicTopicKey);
      const icon = document.createElement('span');
      icon.className = 'clinic-topic-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = topic.icon;
      const copy = document.createElement('span');
      copy.className = 'clinic-topic-copy';
      const title = document.createElement('b');
      title.textContent = topic.title;
      const subtitle = document.createElement('small');
      subtitle.textContent = topic.category;
      copy.append(title, subtitle);
      const arrow = document.createElement('span');
      arrow.className = 'clinic-topic-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '›';
      button.append(icon, copy, arrow);
      button.addEventListener('click', () => selectClinicTopic(topic.key));
      return button;
    }));
    if (clinicResultCount) clinicResultCount.textContent = `${filtered.length} หัวข้อ`;
    if (clinicEmpty) clinicEmpty.hidden = filtered.length > 0;
    if (filtered.length && !filtered.some((topic) => topic.key === clinicTopicKey)) selectClinicTopic(filtered[0].key);
  }

  function setupClinicMode() {
    renderClinicFilters();
    renderClinicTopics();
    selectClinicTopic(clinicTopicKey, { updateUrl:false });
    clinicSearch?.addEventListener('input', renderClinicTopics);
    clinicSearch?.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && clinicSearch.value) {
        clinicSearch.value = '';
        renderClinicTopics();
      }
    });
    clinicThemeButton?.addEventListener('click', toggleTheme);
    openClinicButton?.addEventListener('click', () => setAppMode('clinic'));
    openLearnButton?.addEventListener('click', () => setAppMode('learn'));
    clinicDetailButton?.addEventListener('click', () => {
      const slideId = clinicDetailButton.dataset.slideId;
      setAppMode('learn', { focus:false });
      jumpTo(slideId);
    });
    clinicPrintButton?.addEventListener('click', () => window.print());
  }

  function normalizeGroups() {
    const slideContainer = document.querySelector('.reveal .slides');
    document.querySelectorAll('body > section.slide').forEach((slide) => slideContainer?.appendChild(slide));
    [
      ['other-thal', 'blood'],
      ['other-anemia', 'blood'],
      ['bp-measurement', 'bp'],
      ['other-vision', 'eyes'],
      ['other-color', 'eyes'],
      ['other-hearing', 'hearing']
    ].forEach(([id, group]) => {
      const slide = document.getElementById(id);
      if (slide) {
        slide.dataset.group = group;
        slide.dataset.section = GROUPS[group].short;
      }
    });

    const originalPosition = new Map([...slideContainer.children].map((slide, index) => [slide, index]));
    [...slideContainer.children]
      .sort((a, b) => {
        const groupA = a.dataset.group || 'other';
        const groupB = b.dataset.group || 'other';
        const groupDifference = GROUP_ORDER.indexOf(groupA) - GROUP_ORDER.indexOf(groupB);
        if (groupDifference) return groupDifference;
        const preferred = SLIDE_ORDER[groupA];
        if (preferred) {
          const orderA = preferred.indexOf(a.id);
          const orderB = preferred.indexOf(b.id);
          if (orderA !== -1 || orderB !== -1) {
            return (orderA === -1 ? Number.MAX_SAFE_INTEGER : orderA)
              - (orderB === -1 ? Number.MAX_SAFE_INTEGER : orderB);
          }
        }
        if (a.id === `${groupA}-start`) return -1;
        if (b.id === `${groupB}-start`) return 1;
        return originalPosition.get(a) - originalPosition.get(b);
      })
      .forEach((slide) => slideContainer.appendChild(slide));
  }

  function collectSlides() {
    slides = [...document.querySelectorAll('.reveal .slides > section')];
    slideIndexById = new Map();
    slidesByGroup = new Map();
    slides.forEach((slide, index) => {
      if (slide.id) slideIndexById.set(slide.id, index);
      const group = slide.dataset.group || 'other';
      if (!slidesByGroup.has(group)) slidesByGroup.set(group, []);
      slidesByGroup.get(group).push(slide);
    });
    slidesByGroup.forEach((groupSlides, group) => {
      const startIndex = groupSlides.findIndex((slide) => slide.id === `${group}-start`);
      if (startIndex > 0) groupSlides.unshift(groupSlides.splice(startIndex, 1)[0]);
    });
  }

  function groupFor(slide) {
    return slide?.dataset.group || 'home';
  }

  function titleFor(slide) {
    return slide?.dataset.menuTitle || slide?.querySelector('h1, h2')?.textContent?.trim() || 'Slide';
  }

  function slideNumberWithinGroup(slide) {
    const groupSlides = slidesByGroup.get(groupFor(slide)) || [];
    const index = Math.max(0, groupSlides.indexOf(slide));
    return { index, total: groupSlides.length };
  }

  function jumpTo(target) {
    const id = typeof target === 'string' ? target.replace(/^#/, '') : target?.dataset?.jump;
    const index = slideIndexById.get(id);
    if (typeof index !== 'number') return;
    closeMenu();
    window.Reveal?.slide?.(index, 0, 0);
  }

  function jumpToGroup(group) {
    const first = document.getElementById(`${group}-start`) || (slidesByGroup.get(group) || [])[0];
    if (first?.id) jumpTo(first.id);
  }

  function buildDrawer() {
    if (!drawerList) return;
    drawerList.innerHTML = '';
    GROUP_ORDER.forEach((group) => {
      const groupSlides = slidesByGroup.get(group) || [];
      if (!groupSlides.length) return;
      const section = document.createElement('section');
      section.className = 'drawer-group';
      section.dataset.group = group;
      const heading = document.createElement('button');
      heading.type = 'button';
      heading.className = 'drawer-group-title';
      heading.dataset.drawerGroup = group;
      heading.innerHTML = `<span class="drawer-dot"></span><b>${GROUPS[group]?.label || group}</b><small>${groupSlides.length} หน้า</small>`;
      section.appendChild(heading);

      const list = document.createElement('div');
      list.className = 'drawer-slide-list';
      const expanded = group === 'home';
      list.hidden = !expanded;
      heading.setAttribute('aria-expanded', String(expanded));
      heading.addEventListener('click', () => {
        const nextExpanded = heading.getAttribute('aria-expanded') !== 'true';
        heading.setAttribute('aria-expanded', String(nextExpanded));
        list.hidden = !nextExpanded;
      });
      groupSlides.forEach((slide, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'drawer-slide-link';
        button.dataset.slideId = slide.id;
        button.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span><b>${titleFor(slide)}</b>`;
        button.addEventListener('click', () => jumpTo(slide.id));
        list.appendChild(button);
      });
      section.appendChild(list);
      drawerList.appendChild(section);
    });
  }

  function buildTopicSubnav(group, activeSlide) {
    if (!topicSubnav) return;
    const groupSlides = slidesByGroup.get(group) || [];
    const show = group !== 'home' && group !== 'summary' && groupSlides.length > 1;
    topicSubnav.hidden = !show;
    topicSubnav.replaceChildren();
    if (!show) return;
    groupSlides.forEach((slide, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'topic-subnav-item';
      button.textContent = `${index + 1}. ${titleFor(slide)}`;
      button.dataset.slideId = slide.id;
      const active = slide === activeSlide;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      button.addEventListener('click', () => jumpTo(slide.id));
      topicSubnav.appendChild(button);
      if (active) requestAnimationFrame(() => button.scrollIntoView({ block: 'nearest', inline: 'center' }));
    });
  }

  function openMenu() {
    if (!navDrawer) return;
    menuOpen = true;
    document.body.classList.add('nav-open');
    navDrawer.inert = false;
    navDrawer.setAttribute('aria-hidden', 'false');
    menuToggle?.setAttribute('aria-expanded', 'true');
    setTimeout(() => menuClose?.focus({ preventScroll: true }), 80);
  }

  function closeMenu(restoreFocus = false) {
    if (!navDrawer) return;
    const wasOpen = menuOpen;
    menuOpen = false;
    document.body.classList.remove('nav-open');
    navDrawer.setAttribute('aria-hidden', 'true');
    navDrawer.inert = true;
    menuToggle?.setAttribute('aria-expanded', 'false');
    if (restoreFocus && wasOpen) menuToggle?.focus({ preventScroll:true });
  }

  function toggleMenu() {
    if (menuOpen) closeMenu(true);
    else openMenu();
  }

  function restartAnimatedCharts(slide) {
    document.querySelectorAll('[data-animated-chart].is-running').forEach((chart) => chart.classList.remove('is-running'));
    if (!effectsEnabled || prefersReducedMotion || !slide) return;
    slide.querySelectorAll('[data-animated-chart]').forEach((chart) => {
      void chart.offsetWidth;
      chart.classList.add('is-running');
    });
  }

  function updateNavigation(slide) {
    if (!slide) return;
    const group = groupFor(slide);
    const meta = GROUPS[group] || GROUPS.other;
    const sectionLabel = slide.dataset.section || meta.short;
    const position = slideNumberWithinGroup(slide);

    if (sectionChip) sectionChip.textContent = sectionLabel;
    document.documentElement.dataset.section = sectionLabel.toLowerCase().replace(/[^a-z0-9ก-๙]+/g, '-');
    document.documentElement.dataset.group = group;
    document.documentElement.style.setProperty('--chapter-color', document.documentElement.dataset.theme === 'light' ? LIGHT_GROUP_COLORS[group] || LIGHT_GROUP_COLORS.other : meta.color);

    const slideTitle = slide.querySelector('h1, h2')?.textContent?.replace(/\s+/g, ' ').trim();
    if (slideTitle) document.title = `${slideTitle} | Health Check Slides`;

    if (drawerCurrent) {
      drawerCurrent.innerHTML = `<span>${meta.label}</span><b>${titleFor(slide)}</b><small>${position.index + 1} / ${position.total}</small>`;
    }

    document.querySelectorAll('.drawer-slide-link').forEach((button) => {
      const active = button.dataset.slideId === slide.id;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    document.querySelectorAll('.drawer-group').forEach((item) => {
      const current = item.dataset.group === group;
      item.classList.toggle('is-current', current);
      const heading = item.querySelector('.drawer-group-title');
      const list = item.querySelector('.drawer-slide-list');
      heading?.setAttribute('aria-expanded', String(current));
      if (list) list.hidden = !current;
    });
    chapterTabs?.querySelectorAll('[data-target-group]').forEach((button) => {
      const active = button.dataset.targetGroup === group;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    buildTopicSubnav(group, slide);

    if (chapterProgress) {
      const percent = position.total ? ((position.index + 1) / position.total) * 100 : 0;
      chapterProgress.style.width = `${percent}%`;
      chapterProgress.parentElement?.setAttribute('aria-label', `${meta.label} หน้า ${position.index + 1} จาก ${position.total}`);
    }

    restartAnimatedCharts(slide);
  }

  function applyEffectsState() {
    document.body.classList.toggle('effects-off', !effectsEnabled);
    if (effectsButton) {
      effectsButton.textContent = effectsEnabled ? 'Effects' : 'Effects off';
      effectsButton.setAttribute('aria-pressed', String(effectsEnabled));
    }
    if (effectsEnabled && appMode === 'learn') ensureThreeScenes();
    else window.ThreeSceneManager?.setEnabled?.(false);
    restartAnimatedCharts(window.Reveal?.getCurrentSlide?.());
  }

  function toggleEffects() {
    effectsEnabled = !effectsEnabled;
    applyEffectsState();
  }

  async function toggleFullscreen() {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch (error) {
      console.warn('Fullscreen request was blocked.', error);
    }
  }

  function setupNavigationControls() {
    menuToggle?.addEventListener('click', toggleMenu);
    menuClose?.addEventListener('click', () => closeMenu(true));
    navBackdrop?.addEventListener('click', () => closeMenu(true));
    chapterTabs?.querySelectorAll('[data-target-group]').forEach((button) => {
      button.addEventListener('click', () => jumpToGroup(button.dataset.targetGroup));
    });
    document.querySelectorAll('[data-jump]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        jumpTo(button.dataset.jump);
      });
    });
  }

  function updateModuleCounts() {
    document.querySelectorAll('[data-count-group]').forEach((node) => {
      const group = node.dataset.countGroup;
      const count = (slidesByGroup.get(group) || []).length;
      node.textContent = `${count} slides`;
    });
  }

  function setupInteractiveControls() {
    document.querySelectorAll('[data-interactive]').forEach((root) => {
      ['pointerdown', 'click', 'wheel'].forEach((eventName) => {
        root.addEventListener(eventName, (event) => event.stopPropagation(), { passive: eventName === 'wheel' });
      });
      root.addEventListener('keydown', (event) => {
        event.stopPropagation();
      });
    });
  }

  function setupEgfrCalculator() {
    const root = document.querySelector('[data-interactive="egfr"]');
    if (!root) return;

    const ageInput = document.getElementById('egfr-age');
    const sexInput = document.getElementById('egfr-sex');
    const creatinineInput = document.getElementById('egfr-creatinine');
    const unitInput = document.getElementById('egfr-unit');
    const uacrInput = document.getElementById('egfr-uacr');
    const resetButton = document.getElementById('egfr-reset');
    const calculateButton = document.getElementById('egfr-calculate');
    const status = document.getElementById('egfr-status');
    const error = document.getElementById('egfr-error');
    const result = document.getElementById('egfr-result');
    const uacrResult = document.getElementById('egfr-uacr-result');
    const gCategory = document.getElementById('egfr-g-category');
    const aCategory = document.getElementById('egfr-a-category');
    const risk = document.getElementById('egfr-risk');
    const riskNote = document.getElementById('egfr-risk-note');
    const eqScr = document.getElementById('eq-scr');
    const eqKappa = document.getElementById('eq-kappa');
    const eqAlpha = document.getElementById('eq-alpha');
    let previousUnit = unitInput?.value || 'mgdl';

    const inputs = [ageInput, sexInput, creatinineInput, unitInput, uacrInput].filter(Boolean);

    const markStale = () => {
      if (status) {
        status.textContent = 'ข้อมูลถูกแก้ไขแล้ว · กด “คำนวณผล” เพื่ออัปเดต';
        status.classList.add('is-stale');
      }
      if (result) result.textContent = '—';
      if (uacrResult) uacrResult.textContent = '—';
      if (gCategory) gCategory.textContent = '—';
      if (aCategory) aCategory.textContent = '—';
      if (risk) {
        risk.textContent = 'รอคำนวณ';
        risk.className = '';
      }
      if (riskNote) riskNote.textContent = 'ตรวจข้อมูลและหน่วย แล้วกดคำนวณผล';
    };

    const validate = () => {
      const numericInputs = [ageInput, creatinineInput, uacrInput];
      numericInputs.forEach((input) => input?.removeAttribute('aria-invalid'));
      const invalid = numericInputs.find((input) => !input || input.value === '' || !input.validity.valid || !Number.isFinite(Number(input.value)));
      if (!invalid) {
        if (error) error.textContent = '';
        return true;
      }
      invalid.setAttribute('aria-invalid', 'true');
      const label = invalid.closest('label')?.querySelector('span')?.textContent || 'ข้อมูล';
      const range = invalid.min !== '' && invalid.max !== '' ? ` (${invalid.min}–${invalid.max})` : '';
      if (error) error.textContent = `กรุณาตรวจ ${label} ให้เป็นค่าที่อยู่ในช่วงที่รองรับ${range}`;
      invalid.focus({ preventScroll:true });
      return false;
    };

    const classifyG = (egfr) => {
      if (egfr >= 90) return 'G1';
      if (egfr >= 60) return 'G2';
      if (egfr >= 45) return 'G3a';
      if (egfr >= 30) return 'G3b';
      if (egfr >= 15) return 'G4';
      return 'G5';
    };

    const classifyA = (uacr) => {
      if (uacr < 30) return 'A1';
      if (uacr <= 300) return 'A2';
      return 'A3';
    };

    const riskSnapshot = (g, a) => {
      const matrix = {
        G1:  { A1: 'low',      A2: 'moderate', A3: 'high' },
        G2:  { A1: 'low',      A2: 'moderate', A3: 'high' },
        G3a: { A1: 'moderate', A2: 'high',     A3: 'very-high' },
        G3b: { A1: 'high',     A2: 'very-high',A3: 'very-high' },
        G4:  { A1: 'very-high',A2: 'very-high',A3: 'very-high' },
        G5:  { A1: 'very-high',A2: 'very-high',A3: 'very-high' }
      };
      return matrix[g]?.[a] || 'moderate';
    };

    const riskLabels = {
      low: 'ความเสี่ยงต่ำ',
      moderate: 'ความเสี่ยงเพิ่มปานกลาง',
      high: 'ความเสี่ยงสูง',
      'very-high': 'ความเสี่ยงสูงมาก'
    };

    const update = ({ example = false } = {}) => {
      if (!validate()) return false;
      const age = Number(ageInput.value);
      const sex = sexInput?.value === 'female' ? 'female' : 'male';
      const rawCreatinine = Number(creatinineInput.value);
      const scr = unitInput?.value === 'umol' ? rawCreatinine / 88.4 : rawCreatinine;
      const uacr = Number(uacrInput.value);
      const kappa = sex === 'female' ? 0.7 : 0.9;
      const alpha = sex === 'female' ? -0.241 : -0.302;
      const femaleFactor = sex === 'female' ? 1.012 : 1;
      const ratio = scr / kappa;
      const egfr = 142
        * Math.pow(Math.min(ratio, 1), alpha)
        * Math.pow(Math.max(ratio, 1), -1.2)
        * Math.pow(0.9938, age)
        * femaleFactor;
      const rounded = Math.max(1, Math.round(egfr));
      const g = classifyG(egfr);
      const a = classifyA(uacr);
      const level = riskSnapshot(g, a);

      if (result) result.textContent = String(rounded);
      if (uacrResult) uacrResult.textContent = uacr < 10 ? uacr.toFixed(1) : Math.round(uacr).toString();
      if (gCategory) gCategory.textContent = g;
      if (aCategory) aCategory.textContent = a;
      if (risk) {
        risk.textContent = riskLabels[level];
        risk.className = `risk-${level}`;
      }
      if (riskNote) {
        if ((g === 'G1' || g === 'G2') && a === 'A1') {
          riskNote.textContent = 'ถ้าไม่มี marker ของ kidney damage อื่น G1–G2/A1 ยังไม่วินิจฉัย CKD จากสองค่านี้';
        } else {
          riskNote.textContent = 'เป็น risk snapshot จาก G/A category ต้องยืนยันความต่อเนื่อง ≥3 เดือนและตีความร่วมกับบริบท';
        }
      }
      if (eqScr) eqScr.textContent = scr.toFixed(2);
      if (eqKappa) eqKappa.textContent = kappa.toFixed(1);
      if (eqAlpha) eqAlpha.textContent = alpha.toFixed(3).replace('-', '−');
      if (status) {
        status.textContent = example ? 'กำลังแสดงข้อมูลตัวอย่าง · แก้ค่าแล้วกดคำนวณ' : 'คำนวณจากข้อมูลที่แสดงอยู่ · ตรวจหน่วยและบริบทก่อนใช้';
        status.classList.remove('is-stale');
      }
      return true;
    };

    unitInput?.addEventListener('change', () => {
      const current = Number(creatinineInput.value);
      if (previousUnit !== unitInput.value) {
        if (unitInput.value === 'umol') {
          if (Number.isFinite(current)) creatinineInput.value = (current * 88.4).toFixed(1);
          creatinineInput.min = '4';
          creatinineInput.max = '1768';
          creatinineInput.step = '1';
        } else {
          if (Number.isFinite(current)) creatinineInput.value = (current / 88.4).toFixed(2);
          creatinineInput.min = '0.1';
          creatinineInput.max = '20';
          creatinineInput.step = '0.01';
        }
        previousUnit = unitInput.value;
      }
      markStale();
    });

    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        input.removeAttribute('aria-invalid');
        markStale();
      });
      if (input !== unitInput) input.addEventListener('change', markStale);
    });

    calculateButton?.addEventListener('click', () => update());

    resetButton?.addEventListener('click', () => {
      ageInput.value = '50';
      sexInput.value = 'male';
      unitInput.value = 'mgdl';
      previousUnit = 'mgdl';
      creatinineInput.value = '1.00';
      creatinineInput.min = '0.1';
      creatinineInput.max = '20';
      creatinineInput.step = '0.01';
      uacrInput.value = '15';
      update({ example:true });
    });

    update({ example:true });
  }

  function setupLipidRatioCalculator() {
    const root = document.querySelector('[data-interactive="lipid-ratios"]');
    if (!root) return;
    const tcInput = document.getElementById('ratio-tc');
    const ldlInput = document.getElementById('ratio-ldl');
    const hdlInput = document.getElementById('ratio-hdl');
    const tgInput = document.getElementById('ratio-tg');
    const resetButton = document.getElementById('ratio-reset');
    const calculateButton = document.getElementById('ratio-calculate');
    const status = document.getElementById('ratio-status');
    const error = document.getElementById('ratio-error');
    const out = {
      tcHdl: document.getElementById('ratio-tc-hdl'),
      ldlHdl: document.getElementById('ratio-ldl-hdl'),
      tgHdl: document.getElementById('ratio-tg-hdl'),
      nonHdl: document.getElementById('ratio-nonhdl'),
      remnant: document.getElementById('ratio-remnant')
    };
    const inputs = [tcInput, ldlInput, hdlInput, tgInput].filter(Boolean);
    const markStale = () => {
      if (status) {
        status.textContent = 'ข้อมูลถูกแก้ไขแล้ว · กด “คำนวณผล” เพื่ออัปเดต';
        status.classList.add('is-stale');
      }
      Object.values(out).forEach((node) => { if (node) node.textContent = '—'; });
    };
    const validate = () => {
      inputs.forEach((input) => input.removeAttribute('aria-invalid'));
      const invalid = inputs.find((input) => input.value === '' || !input.validity.valid || !Number.isFinite(Number(input.value)));
      if (!invalid) {
        if (error) error.textContent = '';
        return true;
      }
      invalid.setAttribute('aria-invalid', 'true');
      const label = invalid.closest('label')?.querySelector('span')?.textContent || 'ข้อมูลไขมัน';
      if (error) error.textContent = `กรุณาตรวจ ${label} ให้เป็นค่าที่อยู่ในช่วง ${invalid.min}–${invalid.max} mg/dL`;
      invalid.focus({ preventScroll:true });
      return false;
    };
    const update = ({ example = false } = {}) => {
      if (!validate()) return false;
      const tc = Number(tcInput.value);
      const ldl = Number(ldlInput.value);
      const hdl = Number(hdlInput.value);
      const tg = Number(tgInput.value);
      out.tcHdl.textContent = (tc / hdl).toFixed(2);
      out.ldlHdl.textContent = (ldl / hdl).toFixed(2);
      out.tgHdl.textContent = (tg / hdl).toFixed(2);
      out.nonHdl.textContent = Math.max(0, Math.round(tc - hdl)).toString();
      out.remnant.textContent = Math.max(0, Math.round(tc - hdl - ldl)).toString();
      if (status) {
        status.textContent = example ? 'กำลังแสดงข้อมูลตัวอย่าง · แก้ค่าแล้วกดคำนวณ' : 'คำนวณจากข้อมูลที่แสดงอยู่ · ใช้ประกอบการอ่านผล ไม่ใช้แทนเป้าหมายการรักษา';
        status.classList.remove('is-stale');
      }
      return true;
    };
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        input.removeAttribute('aria-invalid');
        markStale();
      });
    });
    calculateButton?.addEventListener('click', () => update());
    resetButton?.addEventListener('click', () => {
      tcInput.value = '210';
      ldlInput.value = '135';
      hdlInput.value = '45';
      tgInput.value = '150';
      update({ example:true });
    });
    update({ example:true });
  }

  function setupTumorMap() {
    const root = document.querySelector('[data-interactive="tumor-map"]');
    if (!root) return;
    const data = {
      PSA: {
        title: 'สัมพันธ์กับต่อมลูกหมาก',
        use: 'ใช้ช่วยประเมินโรคของต่อมลูกหมากและติดตามผู้ที่ได้รับการวินิจฉัยแล้ว',
        caution: 'ต่อมลูกหมากโต การอักเสบ และปัจจัยก่อนตรวจบางอย่างอาจทำให้ค่าสูงได้',
        organs: ['prostate']
      },
      AFP: {
        title: 'สัมพันธ์กับตับและเนื้องอกเซลล์สืบพันธุ์',
        use: 'ใช้ช่วยประเมินและติดตามมะเร็งตับหรือเนื้องอกเซลล์สืบพันธุ์เมื่อผลตรวจอื่นสนับสนุน',
        caution: 'โรคตับเรื้อรัง ตับอักเสบ และการตั้งครรภ์อาจทำให้ค่าสูงได้',
        organs: ['liver', 'germ']
      },
      CEA: {
        title: 'สัมพันธ์กับมะเร็งลำไส้ใหญ่และมะเร็งบางชนิด',
        use: 'มักใช้ติดตามผลหลังวินิจฉัย โดยเฉพาะมะเร็งลำไส้ใหญ่',
        caution: 'การสูบบุหรี่ การอักเสบ และโรคตับอาจทำให้ค่าสูงได้เช่นกัน',
        organs: ['colon']
      },
      CA125: {
        title: 'สัมพันธ์กับรังไข่และเยื่อบุช่องท้อง',
        use: 'ใช้ประกอบการประเมินก้อนบริเวณรังไข่และติดตามผู้ที่ได้รับการวินิจฉัยแล้ว',
        caution: 'ประจำเดือน การตั้งครรภ์ เยื่อบุโพรงมดลูกเจริญผิดที่ และการอักเสบในช่องท้องอาจทำให้ค่าสูงได้',
        organs: ['ovary']
      },
      CA153: {
        title: 'สัมพันธ์กับมะเร็งเต้านม',
        use: 'ใช้ประเมินการตอบสนองต่อการรักษาหรือการกลับเป็นซ้ำในผู้ที่ได้รับการวินิจฉัยแล้ว',
        caution: 'หากผลผิดปกติ แพทย์จะดูแนวโน้มและเลือกตรวจเต้านมเพิ่มเติมตามความเหมาะสม',
        organs: ['breast']
      },
      CA199: {
        title: 'สัมพันธ์กับตับอ่อนและทางเดินน้ำดี',
        use: 'มักใช้ติดตามมะเร็งตับอ่อนหรือทางเดินน้ำดี หลังแพทย์พบเหตุให้สงสัยจากข้อมูลอื่น',
        caution: 'ท่อน้ำดีอุดตันหรืออักเสบอาจทำให้ค่าสูงมากได้ และบางคนไม่สร้าง CA 19-9 ตามพันธุกรรม',
        organs: ['pancreas']
      },
      BHCG: {
        title: 'สัมพันธ์กับเนื้องอกเซลล์สืบพันธุ์และเนื้อรก',
        use: 'ใช้ช่วยวินิจฉัย ประเมินความรุนแรง และติดตามผลการรักษา',
        caution: 'การตั้งครรภ์ทำให้ค่านี้สูงตามธรรมชาติ จึงต้องอ่านผลร่วมกับเพศ อายุ และประวัติ',
        organs: ['germ']
      }
    };
    const name = document.getElementById('marker-detail-name');
    const title = document.getElementById('marker-detail-title');
    const use = document.getElementById('marker-detail-use');
    const caution = document.getElementById('marker-detail-caution');
    const buttons = [...root.querySelectorAll('.marker-map-btn')];
    const organs = [...root.querySelectorAll('.organ-hotspot')];

    const select = (marker) => {
      const item = data[marker];
      if (!item) return;
      buttons.forEach((button) => button.classList.toggle('is-active', button.dataset.marker === marker));
      organs.forEach((organ) => organ.classList.toggle('is-active', item.organs.includes(organ.dataset.organ)));
      if (name) name.textContent = marker === 'CA125' ? 'CA-125' : marker === 'CA153' ? 'CA 15-3' : marker === 'CA199' ? 'CA 19-9' : marker === 'BHCG' ? 'β-hCG' : marker;
      if (title) title.textContent = item.title;
      if (use) use.textContent = item.use;
      if (caution) caution.textContent = item.caution;
    };

    buttons.forEach((button) => button.addEventListener('click', () => select(button.dataset.marker)));
    select('PSA');
  }

  function setupKeyboard() {
    document.addEventListener('keydown', (event) => {
      const target = event.target;
      if (appMode === 'clinic') {
        if (event.key === '/' && target !== clinicSearch) {
          event.preventDefault();
          clinicSearch?.focus();
        }
        return;
      }
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      const key = event.key.toLowerCase();
      if (key === 'm') {
        event.preventDefault();
        event.stopImmediatePropagation();
        toggleMenu();
        return;
      }
      if (event.key === 'Escape' && menuOpen) {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeMenu(true);
        return;
      }
      if (key === 'e') {
        event.preventDefault();
        toggleEffects();
      }
      if (key === 'f') {
        event.preventDefault();
        toggleFullscreen();
      }
    }, true);
  }

  function setupCardDepth() {
    let currentSlide = null;
    const reset = () => {
      if (!currentSlide) return;
      currentSlide.style.setProperty('--tilt-x', '0deg');
      currentSlide.style.setProperty('--tilt-y', '0deg');
    };
    document.addEventListener('pointermove', (event) => {
      if (!effectsEnabled || prefersReducedMotion || menuOpen) return;
      currentSlide = window.Reveal?.getCurrentSlide?.();
      if (!currentSlide) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      currentSlide.style.setProperty('--tilt-x', `${(-y * 0.35).toFixed(2)}deg`);
      currentSlide.style.setProperty('--tilt-y', `${(x * 0.45).toFixed(2)}deg`);
    }, { passive: true });
    document.addEventListener('mouseleave', reset);
  }

  const config = {
    width: 1600,
    height: 900,
    margin: 0.035,
    minScale: 0.2,
    maxScale: 1.65,
    controls: true,
    controlsTutorial: true,
    progress: true,
    slideNumber: 'c/t',
    hash: true,
    history: true,
    center: false,
    touch: true,
    overview: true,
    navigationMode: 'linear',
    transition: prefersReducedMotion ? 'none' : 'fade',
    transitionSpeed: 'default',
    backgroundTransition: prefersReducedMotion ? 'none' : 'fade',
    autoAnimate: !prefersReducedMotion,
    autoAnimateDuration: 0.8,
    autoAnimateEasing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    autoAnimateUnmatched: true,
    viewDistance: 3,
    mobileViewDistance: 2,
    pdfSeparateFragments: false,
    plugins
  };

  normalizeGroups();
  collectSlides();
  updateModuleCounts();
  buildDrawer();
  setupNavigationControls();
  setupInteractiveControls();
  setupEgfrCalculator();
  setupLipidRatioCalculator();
  setupTumorMap();
  setupKeyboard();
  setupCardDepth();
  setupClinicMode();
  applyTheme(preferredTheme());
  themeButton?.addEventListener('click', toggleTheme);
  effectsButton?.addEventListener('click', toggleEffects);

  Promise.resolve(window.Reveal.initialize(config))
    .then(async () => {
      updateNavigation(window.Reveal.getCurrentSlide?.());
      window.Reveal.on?.('slidechanged', (event) => updateNavigation(event.currentSlide));
      window.Reveal.on?.('ready', (event) => updateNavigation(event.currentSlide));
      window.Reveal.on?.('overviewshown', closeMenu);
      applyEffectsState();
      setAppMode(initialMode, { focus:false, updateUrl:false });
      if (initialMode === 'learn' && effectsEnabled) await ensureThreeScenes();

      setTimeout(() => {
        bootScreen?.classList.add('is-hidden');
        bootScreen?.setAttribute('aria-hidden', 'true');
      }, 120);
      document.body.classList.add('deck-ready');
    })
    .catch((error) => {
      console.error(error);
      if (bootScreen) {
        bootScreen.innerHTML = '<strong>เริ่มสไลด์ไม่สำเร็จ</strong><span>ดู README สำหรับวิธีเปิดผ่าน local server</span>';
      }
    });
})();
