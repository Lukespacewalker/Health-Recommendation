# Chapter structure refinement

This change restructures the clinician-led health-check deck around where a patient would naturally look for a result.

## New chapter order

1. เบาหวานและระดับน้ำตาล
2. ไขมันในเลือด
3. น้ำหนักตัว รอบเอว และความดันโลหิต
4. เลือดและ CBC
5. ไต
6. ผลตรวจปัสสาวะและอุจจาระ
7. ตับ ถุงน้ำดี และแอลกอฮอล์
8. ไทรอยด์
9. หัวใจและหลอดเลือด
10. มะเร็งและการคัดกรอง
11. วัคซีนผู้ใหญ่
12. วิตามิน
13. มวลกระดูก
14. ตา
15. หูและการได้ยิน

## Why BMI, waist circumference, and blood pressure are grouped

These measurements are commonly available during a health-check visit and are best interpreted together with glucose and lipid results. The chapter adds:

- weight trend and BMI formula
- Asian/Thai screening reference points
- BMI limitations
- waist-measurement instructions
- Thai waist-attention thresholds of 90 cm for men and 80 cm for women
- existing standardized blood-pressure measurement and follow-up guidance

BMI is presented as a screening tool, not a diagnosis or a judgment about health by itself.

## Why urine and stool are grouped

They share specimen-collection issues and are commonly returned in health-check packages, but the content remains separated inside the chapter:

- clean-catch urine and stool collection
- urinalysis: blood, protein, leukocytes/nitrite, glucose and ketones
- the relationship between urine protein, uACR and eGFR
- FIT/FOBT versus other stool examinations
- urgent symptoms that should not wait for routine follow-up

The chapter explicitly states that a positive FIT/FOBT does not diagnose cancer and should not be repeated independently to try to obtain a negative result.

## Why thyroid is a separate chapter

Thyroid results have their own interpretation logic and do not belong in a catch-all chapter. The new chapter covers:

- the TSH–FT4 feedback relationship
- common result patterns
- reasons results may not fit a simple pattern
- medication, pregnancy, acute illness and supplement context
- biotin interference
- why ultrasound answers a structural question rather than a hormone-function question
- warnings against changing thyroid medication independently

## Navigation changes

- Added a thyroid group to the Reveal.js navigation configuration
- Rebuilt the top chapter tabs and 15-card dashboard
- Reordered the navigation drawer and chapter progress
- Updated chapter numbering after the new urine/stool and thyroid chapters
- Removed the patient-facing “Other results” catch-all label

## Primary sources

- Diabetes Association of Thailand risk-assessment information for Asian/Thai BMI and waist thresholds
- Thai Hypertension Society 2024 guideline
- MedlinePlus clean-catch urine, uACR, FIT and FOBT information
- NIDDK hematuria and thyroid testing information
- American Thyroid Association biotin-interference information

## Validation completed

- `app-patient.js` passes JavaScript syntax checking
- `patient-structure.js` passes JavaScript syntax checking
- `loader.js` passes JavaScript syntax checking
- the app-source patch patterns were checked against the current `main` version of `public/app.js`
- the branch is based directly on current `main`

A full visual regression remains required before production deployment, especially for 1600×900, 1366×768, mobile portrait, 200% text scaling, light/dark themes and reduced-motion mode.
