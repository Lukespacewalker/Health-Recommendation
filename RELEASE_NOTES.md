# Release Notes

## Unreleased: Patient-counseling content refinement

### Scope

- Refined the existing deck for clinician-led explanation of health-check results
- Did not add patient-specific sharing, QR codes, generated personal summaries, or personal data in URLs
- Added a visible content review date: 22 August 2026

### Patient-facing content

- Added concise “remember / what to do / when to follow up” guidance to selected high-priority topics
- Replaced or explained dense clinical jargon in the first layer of the slides
- Added clearer warnings against diagnosing from one result or changing medication and supplements independently
- Added or normalized clickable primary-source references on every slide

### Clinical safety and interpretation

- Updated blood-pressure categories to the 2024 Thai Hypertension Society guideline
- Strengthened HbA1c limitations, iron-deficiency confirmation, eGFR calculator limitations, alcohol-unit cautions, tumor-marker limitations, vitamin-dose cautions, and CAVI limitations
- Reframed the alcohol 2/1 limits as ceilings rather than quotas or safe levels
- Clarified that EST is not routine screening for every asymptomatic low-risk adult and that Echo does not image coronary plaque

### Content organization

- Moved the cardiovascular test-selection matrix to the beginning of its chapter
- Moved PAD, ABI, and CAVI into the cardiovascular chapter
- Moved BI-RADS into the cancer and screening chapter
- Consolidated the redundant tumor-marker preparation slide into the abnormal-result follow-up slide
- Replaced the remaining catch-all “Other” chapter with a focused urine-and-stool chapter
- Expanded Chapter 03 to **Weight, Waist and Blood Pressure** with BMI and waist-circumference guidance
- Added a dedicated **Thyroid** chapter covering TSH, FT4, result patterns, biotin interference and follow-up
- Renumbered later chapters so the deck now has 15 clinical chapters plus Home and Summary

### New chapter map

1. Diabetes and glucose
2. Blood lipids
3. Weight, waist and blood pressure
4. Blood and CBC
5. Kidney
6. Urine and stool tests
7. Liver, gallbladder and alcohol
8. Thyroid
9. Cardiovascular health
10. Cancer and screening
11. Adult vaccines
12. Vitamins
13. Bone density
14. Eye health
15. Hearing health

### Validation

- `patient-content.js` passes JavaScript syntax checking
- `patient-content-extended.js` passes JavaScript syntax checking
- `patient-structure.js` passes JavaScript syntax checking
- Loader order applies content and chapter refinements before navigation initialization
- Added a Chromium workflow covering desktop, laptop and mobile viewports
- The workflow checks required slide IDs, chapter counts, duplicate IDs, references and browser errors
- Full visual regression still requires review of the uploaded workflow screenshots before production release

See `CONTENT_REVIEW_PATIENT_COUNSELING.md` for the detailed rationale and deferred scope.

---

## v2.0

### Navigation and identity

- Added a dedicated home state so a normal launch always starts on the cover
- Added top-level chapter tabs and menu grouping for Diabetes, Lipids, Kidney, Cardiovascular Risk, Cancer, and Other Health Checks
- Added author credit: **Suttisak Denduangchai**
- Added direct, clickable source links throughout the deck

### Readability

- Increased module-card, chapter-card, and dense explanatory-card font sizes
- Corrected browser button font inheritance that previously made card text unexpectedly small
- Rebalanced dense lipid and tumor-marker layouts to preserve the 16:9 presentation frame

### Kidney module

- Added eGFR and uACR explanation
- Added an interactive CKD-EPI 2021 creatinine calculator
- Added live unit conversion between mg/dL and µmol/L
- Added live G category, A category, and educational risk snapshot
- Added the displayed equation and variable definitions
- Added kidney-stone formation and prevention content

### Lipid module

- Added cholesterol versus triglyceride comparison
- Added VLDL, IDL, LDL, and HDL transport pathway
- Clarified LDL particle versus LDL-C cargo versus ApoB particle count
- Added causes and control strategies for high LDL-C
- Added causes and control strategies for high triglycerides
- Added interactive TC/HDL-C, LDL-C/HDL-C, TG/HDL-C, non-HDL-C, and estimated remnant-C calculations
- Added contextual reference values and warnings against replacing absolute cardiovascular risk with ratios alone

### Tumor-marker module

- Added an interactive body map
- Added marker-specific organ associations and benign-condition caveats
- Expanded the false-positive and pre-test probability explanation

### Historical quality assurance

- 53 slides checked in the v2.0 build
- JavaScript syntax passed
- No duplicate HTML IDs in that build
- 81 external source links configured to open in a new tab
- eGFR and lipid calculator test cases passed
- Selected slides rendered for visual inspection at 1600 × 900