# Patient-counseling content review

Reviewed against `main` at commit `143adf4df30ed7a069ee523e3546cfdd9731768d`.

## Intended use

The deck is used by a clinician while explaining health-check results. The patient may later revisit the same educational material, but this change does **not** implement patient-specific sharing, generated summaries, QR codes, or personal health information in URLs.

The content should help answer three practical questions:

1. What does this result mean?
2. What should the patient do next?
3. When should the patient not wait for a routine follow-up?

## Content principles applied

- Put the patient-facing message before mechanism and advanced terminology.
- Use Thai explanations before English clinical terms.
- Separate general reference values from individualized treatment goals.
- Avoid implying that a screening result, calculator, or single measurement is a diagnosis.
- Avoid wording that could encourage self-prescribing, self-adjusting medication, or unnecessary testing.
- Keep red flags concise and prominent only where they matter.
- Keep primary-source links available on every slide.

## Major changes

### Diabetes

- Clarified that HbA1c reflects a multi-week average rather than every glucose fluctuation.
- Added a practical next-step strip.
- Highlighted conditions that can make HbA1c misleading, including thalassemia, anemia, blood loss, dialysis, and transfusion.

### Lipids

- Reframed lipid ratios as supplemental calculations rather than treatment targets.
- Removed drug-name shopping language from the LDL-C action slide.
- Added clear attention flags for LDL-C at least 190 mg/dL and triglycerides at least 500 mg/dL.

### Blood pressure

- Replaced the AHA 2025 category slide with the 2024 Thai Hypertension Society classification.
- Emphasized standardized repeat measurement, home monitoring, and symptom-based emergency action.

### CBC and thalassemia

- Added a warning not to infer iron deficiency from low MCV alone.
- Added a caveat that the 25/50/25 inheritance graphic is only a simplified model and that actual thalassemia risk depends on the variants in both partners.

### Kidney

- Reinforced that eGFR and uACR should be read together and that one abnormal result does not establish chronic kidney disease.
- Added an upfront calculator warning about acute kidney injury, medication adjustment, and extreme muscle mass.

### Liver and alcohol

- Clarified that ALT and AST mainly reflect cell injury and are not a complete measure of liver function.
- Reordered the alcohol message so that not drinking appears first.
- Described the 2/1 U.S. standard-drink limits as ceilings rather than quotas or safe levels.
- Made grams of ethanol the primary calculator output and kept U.S./Thai standard-drink units secondary.
- Kept calculator status visually neutral below the ceiling rather than labelling it safe.

### Cardiovascular tests

- Moved the test-selection matrix to the beginning of the chapter.
- Grouped PAD, ABI, and CAVI with cardiovascular content.
- Added explicit cautions that EST is not routine screening for every asymptomatic low-risk person and that Echo is not a coronary-plaque scan.
- Reframed CAVI as supplemental arterial-stiffness information rather than proof of arterial obstruction.

### Cancer and breast imaging

- Moved BI-RADS into the cancer and screening chapter.
- Added a persistent warning that the tumor-marker body map shows associations, not the location of cancer.
- Consolidated the redundant tumor-marker preparation slide into the abnormal-result follow-up slide.
- Added a warning not to substitute broad tumor-marker panels for evidence-based cancer screening.

### Vitamins and bone health

- Added an opening warning that healthy adults do not need every vitamin test and that higher values are not automatically better.
- Removed a prescriptive universal sun-exposure duration.
- Added cautions against increasing vitamin doses from one laboratory value alone.
- Added a patient-facing bone-health action strip covering exercise, food, fall prevention, and individualized follow-up.

### Navigation and references

- Simplified the residual “Other” chapter after moving cardiovascular and breast-imaging topics to their clinical homes.
- Ensured each slide has at least one clickable primary-source reference.
- Relabelled slide sources as “อ้างอิงต้นทาง”.
- Added a visible clinical review date.

## Explicitly deferred

The following were intentionally not implemented in this change:

- patient-specific result pages
- shareable topic bundles
- QR-code generation
- personal result summaries
- names, laboratory values, or personal health information in URLs
- a separate long-form reading mode

## Validation performed

- `patient-content.js` passes `node --check`.
- `patient-content-extended.js` passes `node --check`.
- The loader order places both content scripts before Three.js and the application initializes navigation.
- Selector access is defensive, so a missing optional slide does not stop the deck.

## Remaining validation before production release

A full browser visual regression is still needed against the complete deployed deck, particularly at:

- 1600 × 900 presentation mode
- 1366 × 768 presentation mode
- iPhone and Android portrait widths
- 200% text scaling
- light and dark themes
- Three.js enabled and disabled
- reduced-motion mode

This review changes educational content and presentation hierarchy. It does not replace independent clinical review before publication.
