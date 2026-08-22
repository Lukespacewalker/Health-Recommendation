# Lipid content review and slide consolidation

Reviewed against the `main` branch at commit `7d0b8d3ed757d06d39b478ad5bbfb70640014fc2`.

## Goal

Make the lipid chapter useful to a person reading a health-check report. The chapter should answer:

1. What does each lipid value measure?
2. What values usually prompt attention?
3. Why do treatment goals differ by cardiovascular risk?
4. What should the reader discuss with a clinician next?

## Added: lipid values and risk-based goals

A new slide, `lipid-targets`, separates general screening values from treatment goals.

### General health-check values

- Total cholesterol `<200 mg/dL`: commonly described as desirable for screening, but total cholesterol is not the primary treatment target.
- Triglycerides `<150 mg/dL`: usually considered normal.
- LDL-C `<100 mg/dL`: a commonly encountered reference point, but not a universal goal.
- HDL-C: no universal treatment target. It is a risk marker and should not be interpreted alone.

### 2026 ACC/AHA risk-based treatment goals

- Borderline/intermediate primary-prevention risk when lipid-lowering therapy is initiated: LDL-C `<100 mg/dL`, non-HDL-C `<130 mg/dL`.
- High primary-prevention risk when therapy is initiated: LDL-C `<70 mg/dL`, non-HDL-C `<100 mg/dL`.
- Very-high-risk clinical ASCVD: LDL-C `<55 mg/dL`, non-HDL-C `<85 mg/dL`.

### Values that warrant extra attention

- LDL-C `≥190 mg/dL`: evaluate severe hypercholesterolemia and possible familial hypercholesterolemia.
- Triglycerides `≥500 mg/dL`: prompt clinical review; at `≥1000 mg/dL`, pancreatitis prevention becomes a major priority.
- Lp(a) `≥125 nmol/L` or `≥50 mg/dL`: risk-enhancing factor; `≥250 nmol/L` or `≥100 mg/dL` is associated with at least approximately twofold higher estimated ASCVD risk.
- ApoB: use selectively, particularly when triglycerides are elevated, diabetes/CKM risk is present, LDL-C is already low, or residual particle-related risk is suspected.

## Slides consolidated now

The following four slides were removed because their main messages were already present elsewhere:

| Removed slide | Why it was redundant | Information retained in |
|---|---|---|
| `lipoprotein-transport` | Cargo-versus-particle explanation repeated the VLDL/IDL/LDL/HDL slide and its LDL vs LDL-C vs ApoB strip | `lipoprotein-family`, `apob`, `lipid-ratios` |
| `lipid-factors` | General causes repeated the more actionable LDL-C and triglyceride cause/control slides | `ldl-control`, `tg-control` |
| `nonhdl-remnant` | Formulas and interpretation already appear in the interactive calculator | `lipid-ratios` |
| `lipid-extra-tests` | ApoB, Lp(a), non-HDL-C and repeat-testing indications repeated their dedicated slides and the final reading flow | `apob`, `lpa`, `lipid-ratios`, `lipid-flow` |

One new values slide was added, producing a net reduction of three lipid slides and reducing the chapter from 13 to 10 topics.

## Pairs reviewed but intentionally kept separate

- `lipid-basics` and `lipoprotein-family`: one distinguishes cholesterol from triglyceride; the other explains their transport particles.
- `ldl-control` and `ldl-plaque-hdl`: one is practical cause/control guidance; the other explains plaque biology and the limitations of interpreting HDL-C alone.
- `apob` and `lpa`: both are advanced biomarkers, but they answer different questions and use different units.
- `kidney-egfr-uacr`, `kidney-risk-matrix`, and `kidney-calculator`: definition, prognosis matrix, and interactive calculation are different user tasks.
- `cac` and `cac-interpretation`: these could be combined in an abbreviated edition, but retaining separate slides prevents the 3D explanation and interpretation thresholds from becoming overcrowded.
- CVD risk-score concept and risk-tool comparison: one explains what a probability score means; the other compares Thai CV Risk with PREVENT. They are related but not duplicates.

## Possible future compact edition

For a shorter public talk, consider these optional merges:

1. Merge `cac` with `cac-interpretation`.
2. Merge the general CVD-risk explanation with the Thai CV Risk/PREVENT comparison.
3. Move the full 40-item GI/GL food table to an appendix or searchable web page, while keeping a shorter representative table in the main presentation.

These are not applied in this change because they would materially increase density on the remaining slides.

## Thai patient-counseling recommendation audit (2026-08)

The legacy Thai recommendation archive has now been reviewed separately from the educational slide deck. Detailed replacement wording is in `reference/LIPID_RECOMMENDATION_AUDIT_TH_2026-08.md`.

Key operational decisions:

- Keep `LDL-C <100 mg/dL` as the practical counseling reference for a **general health-check case** when no high-risk condition is supplied.
- Switch to disease/risk-specific targets when DM, established ASCVD, CKD, LDL-C `>=190 mg/dL`, or another high-risk condition is explicitly present.
- Treat HDL-C as a **risk marker, not a treatment target**; do not counsel patients to chase HDL `>60 mg/dL`.
- Do not blacklist whole fruit for elevated triglycerides. Prioritize reduction of sugar-sweetened beverages, added sugars, refined carbohydrates, excess alcohol, and excess weight.
- Replace saturated fat with unsaturated fat rather than simply advising patients to “eat less fat.” Do not imply olive oil is the only acceptable cooking oil.
- LDL-C `>=190 mg/dL` warrants prompt clinical assessment for severe hypercholesterolemia/FH and should not wait for a 3-4 month lifestyle-only trial before medical review.
- EST is not a routine screening test for isolated dyslipidemia; CAC is selective when risk/treatment decisions remain uncertain.

## Primary references

- [2026 ACC/AHA Multisociety Guideline on the Management of Dyslipidemia](https://www.jacc.org/doi/10.1016/j.jacc.2025.11.016)
- [2026 Dyslipidemia Guideline-at-a-Glance](https://www.jacc.org/doi/10.1016/j.jacc.2026.02.4872)
- [AHA: What Your Cholesterol Levels Mean](https://www.heart.org/en/health-topics/cholesterol/about-cholesterol/what-your-cholesterol-levels-mean)
- [AHA 2026 Dietary Guidance to Improve Cardiovascular Health](https://professional.heart.org/en/science-news/2026-dietary-guidance-to-improve-cardiovascular-health/top-things-to-know)
