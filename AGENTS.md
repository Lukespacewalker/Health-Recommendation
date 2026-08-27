# AGENTS.md

## Health recommendation content

When generating or editing Thai patient-facing health-check recommendations in this repository:

1. Use `reference/คำแนะนำผลตรวจสุขภาพ_ภาษาไทย.md` as the canonical clinical/content source.
2. Use `reference/PATIENT_OUTPUT_STYLE_TH.md` as the rendering and wording guide for patient-facing output.
3. For low Total WBC or low absolute lymphocyte count, also apply `reference/CBC_LOW_WBC_LYMPHOCYTE_GUIDANCE_TH.md` until that reviewed guidance is consolidated into the canonical source.
4. Do not replace, override, or silently broaden clinical conditions from the canonical source.
5. Prefer concise Thai wording. Raw laboratory values are normally displayed elsewhere in the report, so do not repeat numbers or units in patient-facing recommendation text unless a value is necessary to explain urgency, a clinically important threshold, or a trend.
6. Preserve useful actionable modules. If the canonical entry includes food, exercise, follow-up, medication-safety, or warning-sign guidance, do not collapse them into vague phrases such as “ควบคุมอาหาร” or “ออกกำลังกายสม่ำเสมอ”.
7. Use Thai terminology first, with English in parentheses only when useful or when it is the recognizable name of a test or clinical term. On the first patient-facing mention of LDL, prefer “ไขมันคอเลสเตอรอลชนิดไม่ดี (LDL-cholesterol)”; later references may use “ไขมัน LDL” or “LDL”.
8. Merge duplicated lifestyle guidance across related abnormalities, but keep condition-specific exceptions from the canonical source.
9. Treat weight status as case input. Do not infer overweight or obesity from lipid, glucose, liver, blood-pressure, or other findings. Add weight-loss counseling only when the case explicitly provides an overweight/obesity assessment or sufficient weight-status information. Preserve the distinction between “น้ำหนักเกิน” and “อ้วน/โรคอ้วน”.
10. Do not append “ควบคุมน้ำหนัก” or “ลดน้ำหนัก” automatically to an LDL or other lifestyle recommendation when weight status is not provided. If weight advice is relevant, merge it with existing diet/exercise guidance instead of repeating the same lifestyle paragraph.
11. For CBC patterns with low MCV/MCH but Hemoglobin not low, describe the red cells as small but do not call the patient anemic. Preserve appropriate iron-rich food guidance while avoiding a diagnosis of iron deficiency before confirmation.
12. For mildly low WBC/lymphocyte findings, do not automatically prescribe Zinc, Vitamin B12, alcohol restriction, or supplements. Use those only when the case provides a relevant deficiency, nutritional, medication, liver, or alcohol context. Consider the laboratory reference range, CBC differential, ANC, symptoms, and trend together.
13. For urgent/red-flag findings, urgency takes priority over brevity or lifestyle counseling.

The canonical source determines **what is medically appropriate to say**. The output style guide determines **how to say it concisely and usefully**. The focused CBC supplement provides reviewed rules for low WBC/lymphocyte findings that are not yet represented as dedicated canonical entries.
