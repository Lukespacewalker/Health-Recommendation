# Clinical errata — คำแนะนำผลตรวจสุขภาพภาษาไทย

Clinical review date: 2026-08-22

เอกสารนี้เป็น correction overlay สำหรับ `reference/คำแนะนำผลตรวจสุขภาพ_ภาษาไทย.md` ซึ่งเป็นคลังข้อความเดิมและตั้งใจเก็บถ้อยคำจากต้นฉบับไว้เป็นหลัก ไม่ควรตีความว่าทุกข้อความเป็นคำแนะนำเวชปฏิบัติปัจจุบัน

รายการด้านล่างให้ถือว่า **supersede** ข้อความเดิมตามรหัสที่ระบุ จนกว่าจะนำกลับไปแก้ในไฟล์คลังต้นฉบับโดยตรง

## 1) THY-TH-002 — การแปลผล TSH ต่ำ

### ปัญหา

ข้อความเดิมตีความ `TSH ต่ำ` ว่า “น่าจะมีภาวะไทรอยด์ทำงานน้อยกว่าปกติ (Hypothyroidism)” จากอาการผิวแห้งและความดันต่ำ ซึ่งไม่ถูกต้องในกรณีทั่วไป เพราะ TSH ต่ำมักพบใน hyperthyroidism; หาก TSH ต่ำร่วมกับ FT4 ต่ำจึงค่อยพิจารณา central hypothyroidism หรือสาเหตุอื่น

### Replacement wording

```text
ระดับ Thyroid stimulating hormone (TSH) ต่ำกว่าปกติ ไม่ควรสรุปว่าเป็นภาวะไทรอยด์ทำงานต่ำจากค่า TSH หรืออาการเพียงอย่างเดียว โดยทั่วไป TSH ต่ำมักสัมพันธ์กับภาวะไทรอยด์ทำงานมากกว่าปกติ แต่ควรตรวจ Free T4 และอาจตรวจ T3 ร่วมเพื่อแปลผล หาก TSH ต่ำร่วมกับ Free T4 ต่ำจึงพิจารณาสาเหตุจากต่อมใต้สมองหรือภาวะอื่นเพิ่มเติม แนะนำปรึกษาอายุรแพทย์ระบบต่อมไร้ท่อเพื่อตรวจยืนยันและทบทวนยา/อาหารเสริมที่อาจรบกวนผลตรวจ
```

## 2) CBC-TH-001 — Microcytic anemia และการให้ folic acid

### ปัญหา

ข้อความเดิมมีการแนะนำอาหาร folate สูงหรือ folic acid supplementation เป็นส่วนหลัก แม้รูปแบบเป็นโลหิตจางร่วมกับเม็ดเลือดแดงขนาดเล็ก ซึ่งควรแยก iron deficiency และ thalassemia ก่อน การให้ iron หรือ folate supplement ไม่ควรเป็น routine recommendation โดยยังไม่ทราบสาเหตุ

### Replacement wording

```text
พบภาวะโลหิตจางร่วมกับเม็ดเลือดแดงขนาดเล็ก (Microcytic anemia) ซึ่งอาจเกิดได้จากหลายสาเหตุ โดยที่พบบ่อย ได้แก่ ภาวะขาดธาตุเหล็กและพาหะธาลัสซีเมีย และอาจพบทั้งสองภาวะร่วมกันได้ แนะนำปรึกษาอายุรแพทย์ระบบโลหิตเพื่อตรวจเพิ่มเติม เช่น Ferritin, Serum iron, TIBC/Transferrin saturation และอาจตรวจ Hemoglobin typing ตามความเหมาะสม เพื่อหาสาเหตุและให้การรักษาที่เหมาะสม ไม่แนะนำซื้อธาตุเหล็กหรือกรดโฟลิกเสริมมารับประทานเองจากค่า MCV ต่ำเพียงอย่างเดียว

ในระหว่างนี้สามารถรับประทานอาหารให้ครบหมู่และเลือกอาหารที่มีธาตุเหล็กตามธรรมชาติ เช่น เนื้อสัตว์ไม่ติดมัน ปลา ไข่ ถั่ว งา เมล็ดธัญพืช และผักใบเขียว โดยรับประทานร่วมกับอาหารที่มีวิตามินซี เช่น ฝรั่ง ส้ม มะเขือเทศ หรือพริกหวาน เพื่อช่วยการดูดซึมธาตุเหล็ก และควรหลีกเลี่ยงชา กาแฟ หรือเครื่องดื่มที่มีแทนนินพร้อมมื้ออาหารหรือใกล้มื้ออาหารมากเกินไป ทั้งนี้อาหารดังกล่าวเป็นส่วนหนึ่งของอาหารสมดุล ไม่ได้ใช้แทนการตรวจหาสาเหตุหรือการรักษาภาวะขาดธาตุเหล็กหากตรวจพบ
```

## 3) KID-TH-001 — eGFR 60–89 และคำว่าโรคไต

### ปัญหา

ข้อความเดิมอาจทำให้ผู้อ่านเข้าใจว่า eGFR 60–89 เท่ากับโรคไต และให้คำแนะนำดื่มน้ำวันละ 2 ลิตรแบบตายตัว ปัจจุบัน CKD ต้องอาศัยความผิดปกติที่คงอยู่อย่างน้อย 3 เดือน และ eGFR 60–89 เพียงอย่างเดียวโดยไม่มี marker of kidney damage ไม่เพียงพอสำหรับการวินิจฉัย CKD

### Replacement wording

```text
ค่า eGFR อยู่ในช่วง 60–89 ml/min/1.73 m² ซึ่งเป็นระดับลดลงเล็กน้อย แต่ค่า eGFR ในช่วงนี้เพียงอย่างเดียวยังไม่เพียงพอที่จะสรุปว่าเป็นโรคไตเรื้อรัง ควรพิจารณาร่วมกับผลย้อนหลัง ปัจจัยเสี่ยง และตัวบ่งชี้ความผิดปกติของไต เช่น Urine albumin-to-creatinine ratio (uACR) หากพบค่าผิดปกติโดยบังเอิญควรตรวจติดตามเพื่อยืนยัน ระมัดระวังการใช้ยา NSAIDs โดยไม่จำเป็น และดื่มน้ำตามความต้องการของร่างกาย/คำแนะนำของแพทย์ ไม่จำเป็นต้องกำหนด 2 ลิตรต่อวันในทุกคน
```

## 4) URIC-TH-001 และข้อความที่ชวนเริ่มยาจาก hyperuricemia อย่างเดียว

### ปัญหา

ข้อความเดิม `URIC-TH-001` แนะนำปรึกษาอายุรแพทย์เพื่อพิจารณาการรักษาด้วยยาเมื่อ uric acid สูง โดยไม่ได้แยกว่าเคยมี gout flare, tophus หรือ urolithiasis หรือไม่ แนวทาง ACR ไม่สนับสนุนการเริ่ม urate-lowering therapy เป็น routine ใน asymptomatic hyperuricemia

### Replacement wording

```text
กรดยูริก (Uric acid) ในเลือดสูงกว่าปกติ เพิ่มโอกาสเกิดโรคเกาต์ในอนาคต แต่หากยังไม่เคยมีข้ออักเสบจากเกาต์ ก้อนโทฟัส หรือนิ่วบางชนิด โดยทั่วไปยังไม่จำเป็นต้องเริ่มยาลดกรดยูริกจากค่าที่สูงเพียงอย่างเดียว แนะนำควบคุมน้ำหนัก ลดเครื่องดื่มแอลกอฮอล์โดยเฉพาะเบียร์ ลดเครื่องดื่มที่มีน้ำตาลฟรุกโตสสูง และไม่รับประทานอาหารพิวรีนสูงมากเป็นประจำ หากมีอาการข้อปวด บวม แดง ร้อน หรือมีประวัตินิ่วในไต ควรปรึกษาแพทย์เพื่อประเมินเพิ่มเติม
```

หมายเหตุ: รายการ `URIC-TH-005` ที่ระบุ “สูงมาก” ควรเพิ่มบริบทว่าการตัดสินใจใช้ยาขึ้นกับประวัติ gout/tophus/urolithiasis, ระดับ urate และโรคร่วม ไม่ควรใช้ตัวเลขเพียงค่าเดียวเป็น trigger อัตโนมัติ

## 5) LIP-TH-011, LIP-TH-012, LIP-TH-013, LIP-TH-041 — LDL-C counseling ใน health check ทั่วไป

### ปัญหาและหลักการใช้งาน

ในบริบทการตรวจสุขภาพทั่วไป สามารถใช้ `LDL-cholesterol <100 mg/dL` เป็นระดับที่แนะนำสำหรับคำแนะนำผู้รับบริการทั่วไปได้ เพราะเข้าใจง่ายและเหมาะกับ patient counseling อย่างไรก็ตาม ไม่ควรตีความว่า `<100 mg/dL` เป็น treatment target เดียวสำหรับทุกคน หากผู้รับบริการมีเบาหวาน (DM), established ASCVD, CKD หรือภาวะเสี่ยงสูงอื่น ควรใช้เป้าหมายที่เหมาะกับโรคและระดับความเสี่ยงนั้นแทน

### Replacement wording สำหรับคนทั่วไป

```text
ไขมันคอเลสเตอรอลชนิดหนาแน่นต่ำ (LDL-cholesterol) สูงกว่าระดับที่แนะนำ โดยทั่วไปแนะนำว่าระดับ LDL-cholesterol ควรต่ำกว่า 100 mg/dL ควรลดการรับประทานอาหารที่มีไขมันอิ่มตัวสูง เช่น ไขมันสัตว์ เนื้อสัตว์ติดมัน หนังสัตว์ หมูกรอบ หมูสามชั้น เบคอน เนื้อสัตว์แปรรูป กะทิ เนย นมไขมันเต็มส่วน อาหารผัด/ทอด และไขมันทรานส์ เช่น Bakery, fast food, แครกเกอร์ คุกกี้ และขนมขบเคี้ยว หากทำอาหารทานเองควรเลือกอาหารประเภทต้ม นึ่ง หรืออาหารที่ใช้น้ำมันน้อย และควรออกกำลังกายอย่างสม่ำเสมอ เพื่อลดระดับ LDL และลดความเสี่ยงโรคหลอดเลือดหัวใจ
```

สำหรับ `LDL-C >150 mg/dL` สามารถคงคำแนะนำตรวจระดับไขมันติดตามประมาณ 6 เดือนได้ตามบริบทของ health check

### ข้อยกเว้น

- หากระบุว่าเป็น **DM** ให้ใช้เป้าหมายและคำแนะนำสำหรับผู้ป่วยเบาหวานตามความเสี่ยง ไม่ใช้ข้อความคนทั่วไปโดยอัตโนมัติ
- หากระบุว่าเป็น **ASCVD** หรือมีประวัติโรคหลอดเลือดหัวใจ/สมอง/หลอดเลือดส่วนปลาย ให้ใช้ secondary-prevention target ตาม guideline
- หาก `LDL-C >=190 mg/dL` ให้ประเมิน severe hypercholesterolemia/familial hypercholesterolemia และพิจารณาการรักษาโดยแพทย์
- ในผู้ที่มีความเสี่ยงสูงอื่น เช่น CKD หรือ risk enhancers หลายอย่าง สามารถปรับเป้าหมายตาม clinical context ได้

## 6) LIV-TH-009 — HCC surveillance ใน chronic hepatitis B

### ปัญหา

ข้อความเดิมแนะนำ ultrasound ช่องท้องส่วนบน “ปีละครั้ง” แบบกว้าง ๆ ปัจจุบันผู้ป่วย chronic HBV ที่เข้าเกณฑ์ HCC surveillance ควรได้รับ surveillance ประมาณทุก 6 เดือน และไม่ได้หมายความว่าผู้ป่วย HBV ทุกคนต้องใช้ schedule เดียวกัน

### Replacement wording

```text
มีประวัติติดเชื้อไวรัสตับอักเสบบีเรื้อรัง แนะนำติดตามรักษากับแพทย์อย่างต่อเนื่องและไม่หยุดยาด้วยตนเอง ควรติดตามค่าการทำงานของตับและปริมาณไวรัสตามแผนการรักษา สำหรับผู้ที่มีความเสี่ยงถึงเกณฑ์เฝ้าระวังมะเร็งตับ แนะนำตรวจ Ultrasound ตับร่วมกับ AFP ประมาณทุก 6 เดือน หรือตามแนวทางและนัดหมายของแพทย์ผู้รักษา
```

## 7) UA-TH-001 / UA-TH-002 — contamination และ asymptomatic bacteriuria

### ปัญหา

`UA-TH-001` เรื่อง squamous epithelial cell สอดคล้องกับ contamination แต่ควรระบุ clean-catch midstream ให้ชัดกว่าเดิม ส่วน `UA-TH-002` ควรย้ำว่า leukocyte esterase/pyuria/bacteria ในคนไม่มีอาการไม่เท่ากับ UTI และไม่ใช่เหตุให้ใช้ antibiotic โดยอัตโนมัติ

### Replacement wording

```text
พบ Squamous epithelial cells มากกว่า 5 cells/HPF ซึ่งอาจบ่งว่าตัวอย่างปัสสาวะปนเปื้อนจากบริเวณผิวหนังหรืออวัยวะเพศภายนอก การตรวจครั้งถัดไปควรเก็บปัสสาวะแบบ clean-catch midstream โดยทำความสะอาดบริเวณภายนอก ปัสสาวะช่วงแรกทิ้ง แล้วเก็บปัสสาวะช่วงกลาง หากพบเม็ดเลือดขาวหรือแบคทีเรียเล็กน้อยร่วมด้วย แต่ไม่มีอาการปัสสาวะแสบขัด ปัสสาวะบ่อยผิดปกติ ปวดท้องน้อย หรือมีไข้ ยังไม่ควรสรุปว่าเป็นการติดเชื้อทางเดินปัสสาวะหรือเริ่มยาปฏิชีวนะจากผล urinalysis เพียงอย่างเดียว หากมีอาการควรตรวจปัสสาวะซ้ำและพิจารณา urine culture ตามความเหมาะสม
```

ข้อยกเว้นสำคัญ: pregnancy และผู้ที่จะเข้ารับ invasive urologic procedure มีแนวทางการคัดกรอง/รักษา asymptomatic bacteriuria ต่างจาก healthy nonpregnant adults

## Primary references

- American Thyroid Association. Thyroid Function Tests: https://www.thyroid.org/thyroid-function-tests/
- American Thyroid Association. Thyroid Nodules: https://www.thyroid.org/thyroid-nodules/
- AGA iron deficiency anemia quality indicators / ferritin testing: https://gastro.org/practice-resources/quality-and-performance-measures/
- American Family Physician. Evaluation of Microcytosis: https://www.aafp.org/pubs/afp/issues/2010/1101/p1117.html
- KDIGO 2024 CKD Guideline: https://kdigo.org/wp-content/uploads/2024/03/KDIGO-2024-CKD-Guideline.pdf
- 2020 American College of Rheumatology Guideline for the Management of Gout: https://pmc.ncbi.nlm.nih.gov/articles/PMC10563586/
- 2026 ACC/AHA Guideline on the Management of Dyslipidemia: https://professional.heart.org/en/science-news/2026-guideline-on-the-management-of-dyslipidemia
- AASLD/IDSA Practice Guideline on Treatment of Chronic Hepatitis B: https://www.idsociety.org/link/d400d5de79fb44008cd5b65dfaa64d1e.aspx
- American Family Physician. Office-Based Urinalysis: https://www.aafp.org/pubs/afp/issues/2022/0700/office-based-urinalysis.html
- IDSA 2019 Asymptomatic Bacteriuria Guideline: https://www.idsociety.org/practice-guideline/asymptomatic-bacteriuria/

## Scope note

การ audit รอบนี้เน้นรายการที่ถูกใช้/พบระหว่างสองเคสล่าสุดและหัวข้อที่เกี่ยวข้องโดยตรง ยังไม่ถือเป็น line-by-line clinical revalidation ของคลังทั้งไฟล์