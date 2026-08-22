# Health Check Clinical Modules

Interactive HTML slide deck โดย **Suttisak Denduangchai**

- Presentation framework: Reveal.js
- Selective 3D/animation: Three.js และ CSS/SVG fallbacks
- จำนวน: 53 สไลด์
- ภาษา: ไทย พร้อมคำศัพท์ทางการแพทย์ภาษาอังกฤษที่จำเป็น
- อัปเดต: สิงหาคม 2026

> ชุดนี้จัดทำเพื่อการให้ความรู้ ไม่ใช้แทนการวินิจฉัย การรักษา หรือคำแนะนำเฉพาะบุคคล

## หมวดเนื้อหา

1. **เบาหวานและระดับน้ำตาล**
   - HbA1c และข้อจำกัด
   - Glycemic Index / Glycemic Load
   - ตารางอาหารและกราฟน้ำตาลแบบ animation
2. **ไขมันในเลือด**
   - Cholesterol ต่างจาก triglyceride อย่างไร
   - TC, LDL-C, HDL-C, TG
   - VLDL → IDL → LDL และบทบาทของ HDL
   - LDL ต่างจาก LDL-C อย่างไร
   - สาเหตุและการควบคุม LDL-C / triglyceride สูง
   - non-HDL-C, remnant-C, ApoB, Lipoprotein(a)
   - Interactive lipid ratios / derived values
3. **ไต**
   - eGFR และ uACR
   - Interactive CKD-EPI Creatinine Equation 2021
   - G category, A category และ risk snapshot
   - Kidney stone mechanism และการลดการเกิดซ้ำ
4. **ความเสี่ยงหัวใจและหลอดเลือด**
   - CVD risk score
   - CT coronary calcium score
   - Exercise stress test
   - Echocardiography
5. **มะเร็งและ tumor markers**
   - หลักการใช้ tumor markers
   - Interactive body map
   - ตัวอย่าง marker ที่พบบ่อย
   - False-positive และ pre-test probability
6. **ผลตรวจสุขภาพอื่น**
   - การได้ยิน สายตา BI-RADS โลหิตจาง ธาลัสซีเมีย ความดัน การมองสี PAD ABI และ CAVI

## เปิดใช้งาน

### Windows

แตก ZIP แล้วดับเบิลคลิก:

```text
start_windows.bat
```

### macOS

คลิกขวา `start_mac.command` แล้วเลือก **Open** ในครั้งแรก

### Linux

```bash
./start_linux.sh
```

Browser จะเปิดที่:

```text
http://127.0.0.1:8765
```

การเปิดผ่าน local server เหมาะกว่าการดับเบิลคลิก `index.html` โดยตรง โดยเฉพาะ Speaker View และ module loading

## Navigation

| ปุ่ม | การทำงาน |
|---|---|
| `Space`, `→`, `↓` | แสดง fragment ถัดไปหรือไปหน้าถัดไป |
| `←`, `↑` | ย้อน fragment หรือย้อนหน้า |
| `M` | เปิดสารบัญแบบแบ่งหมวด |
| `O` หรือ `Esc` | Overview |
| `S` | Speaker View |
| `F` | Fullscreen |
| `E` | เปิดหรือปิด animation / Three.js |
| `B` | หน้าจอดำชั่วคราวใน Reveal.js |

ใช้ chapter tabs ด้านบนเพื่อข้ามหมวดได้ทันที และ reference links ในแต่ละหน้าสามารถคลิกเปิดแหล่งข้อมูลต้นทางได้

## Interactive eGFR Calculator

ใช้สมการ **CKD-EPI Creatinine Equation 2021** สำหรับผู้ใหญ่อายุอย่างน้อย 18 ปี:

```text
eGFR = 142 × min(Scr/κ,1)^α × max(Scr/κ,1)^−1.200
       × 0.9938^Age × 1.012 [ถ้าเป็นหญิง]
```

- κ = 0.9 สำหรับชาย และ 0.7 สำหรับหญิง
- α = −0.302 สำหรับชาย และ −0.241 สำหรับหญิง
- รองรับ serum creatinine ทั้ง `mg/dL` และ `µmol/L`
- แสดง G category, A category และ risk snapshot จาก eGFR/uACR

Calculator เป็นเครื่องมือสาธิตทางการศึกษา ไม่ควรใช้แทน clinical judgment โดยเฉพาะใน AKI, pregnancy, extreme muscle mass หรือการกำหนดขนาดยาเฉพาะทาง

## Interactive Lipid Calculator

คำนวณสดจาก TC, LDL-C, HDL-C และ TG:

- TC / HDL-C
- LDL-C / HDL-C
- TG / HDL-C
- non-HDL-C = TC − HDL-C
- remnant-C estimate = TC − HDL-C − LDL-C

Ratio ไม่มี universal treatment target ที่ใช้แทน absolute risk, LDL-C, non-HDL-C หรือ ApoB ได้ จึงแสดงพร้อมคำเตือนในสไลด์

## ใช้งานแบบ Offline เต็มรูปแบบ

Deck จะลองใช้ library ในโฟลเดอร์ `vendor/` ก่อน แล้วจึงใช้ CDN ที่ pin version ไว้

ดาวน์โหลด library ลงเครื่องครั้งเดียวด้วย:

- Windows: `setup_offline_windows.bat`
- macOS/Linux: `./setup_offline_unix.sh`

หลังจากนั้น deck ใช้งานโดยไม่ต้องเชื่อมต่ออินเทอร์เน็ตได้

## โหมดสำรอง

บังคับใช้ fallback navigation และภาพนิ่ง โดยไม่โหลด Reveal.js หรือ Three.js:

```text
http://127.0.0.1:8765/?fallback=1
```

บังคับใช้เฉพาะ library ใน `vendor/` และไม่เรียก CDN:

```text
http://127.0.0.1:8765/?offline=1
```

ต้องการรักษา hash/deep link ที่ระบุไว้ แทนการเริ่มจากหน้าแรก:

```text
http://127.0.0.1:8765/?resume=1#/23
```

โดยปกติ deck จะเริ่มที่หน้าแรกเสมอ เพื่อไม่ให้เปิดมาแล้วอยู่กลางหมวด

## Export เป็น PDF

1. เปิด deck ผ่าน local server
2. เปิด URL:

```text
http://127.0.0.1:8765/?print-pdf
```

3. Print จาก Chrome หรือ Edge
4. เลือก Landscape, Margins = None และ Background graphics = On

## โครงสร้างไฟล์

```text
index.html                 เนื้อหาและโครงสร้าง 53 สไลด์
app.js                     navigation, calculators และ interactions
three-scenes.js            selective Three.js scenes
fallback-reveal.js         presentation controller สำรอง
loader.js                  โหลด local library, CDN หรือ fallback
theme.css                  visual system, cards, diagrams และ responsive layout
server.mjs                 local server แบบไม่ต้องติดตั้ง dependency
start_*                    launcher สำหรับ Windows/macOS/Linux
setup_offline_*            ดาวน์โหลด library ที่ pin version ไว้
vendor/                    ตำแหน่ง library สำหรับ offline use
preview.png                ภาพรวมหน้าสำคัญของ deck
QA_REPORT.md               ผลการตรวจสอบเชิงเทคนิคและ interactive tests
RELEASE_NOTES.md           สรุปการเปลี่ยนแปลงในรุ่นนี้
```

## Library versions

- Reveal.js 6.0.1
- Three.js 0.184.0

ดู license เพิ่มเติมใน `THIRD_PARTY_NOTICES.md`
