# AGENTS.md

## Health recommendation content

When generating or editing Thai patient-facing health-check recommendations in this repository:

1. Use `reference/คำแนะนำผลตรวจสุขภาพ_ภาษาไทย.md` as the canonical clinical/content source.
2. Use `reference/PATIENT_OUTPUT_STYLE_TH.md` as the rendering and wording guide for patient-facing output.
3. Do not replace, override, or silently broaden clinical conditions from the canonical source.
4. Prefer concise Thai wording. Do not repeat raw laboratory values unless the value is needed to explain severity, a threshold, or a trend.
5. Preserve useful actionable modules. If the canonical entry includes food, exercise, follow-up, medication-safety, or warning-sign guidance, do not collapse them into vague phrases such as “ควบคุมอาหาร” or “ออกกำลังกายสม่ำเสมอ”.
6. Use Thai terminology first, with English in parentheses only when useful or when it is the recognizable name of a test or clinical term.
7. Merge duplicated lifestyle guidance across related abnormalities, but keep condition-specific exceptions from the canonical source.
8. For urgent/red-flag findings, urgency takes priority over brevity or lifestyle counseling.

The canonical source determines **what is medically appropriate to say**. The output style guide determines **how to say it concisely and usefully**.
