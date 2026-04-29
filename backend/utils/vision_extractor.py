import json
import re
from utils.gemini import ask_with_image

# ─── Extraction Prompt ─────────────────────────────

EXTRACTION_PROMPT = """
You are reading a printed pregnancy lab report. THIS IS A MULTI-PAGE PDF — you MUST scan ALL pages carefully and find these specific values, which may appear scattered across different pages and different sections.

VALUES TO FIND (search every page):

1. **Hemoglobin** — Look for: "Hemoglobin", "Hb", "HGB", or inside the "Complete Blood Count" / "CBC" / "Haematology" section. Value is in g/dL (typically 8-15).

2. **Fasting Blood Sugar** — Look for: "Fasting Blood Sugar", "FBS", "Fasting Glucose", "Fasting Plasma Glucose", "FPG", or inside "Glucose" / "Diabetes" / "Biochemistry" section. Value is in mg/dL (typically 70-200). If multiple glucose values exist (random, post-prandial, fasting), pick ONLY the FASTING one.

3. **TSH** — Look for: "TSH", "Thyroid Stimulating Hormone", or inside "Thyroid Function Test" / "Thyroid Profile" / "TFT" section. Value is in mIU/L or µIU/mL (typically 0.1-10).

4. **HIV** — Look for: "HIV", "HIV I & II", "HIV 1 & 2", "Anti-HIV", or inside "Serology" / "Infectious Disease" section. Result is qualitative.

5. **HBsAg** — Look for: "HBsAg", "Hepatitis B Surface Antigen", "Hepatitis B", "HBV", or inside "Serology" section. Result is qualitative.

CONVERSION RULES (very important):
- "Non Reactive", "Non-Reactive", "Nonreactive", "NR" → return "Negative"
- "Reactive", "R" → return "Positive"
- "Negative", "Neg", "-ve" → return "Negative"
- "Positive", "Pos", "+ve" → return "Positive"
- Numbers must be plain numbers WITHOUT units (e.g., 11.5 not "11.5 g/dL")
- Use null ONLY if the value is truly absent on every page

OUTPUT FORMAT — return ONLY valid JSON, no markdown, no explanation, no code fences:

EXAMPLE OUTPUT:
{
  "report_type": "Antenatal Routine Panel",
  "extracted_values": {
    "HIV": "Negative",
    "HBsAg": "Negative",
    "TSH": 2.45,
    "FastingBloodSugar": 88,
    "Hemoglobin": 11.2
  }
}

ANOTHER EXAMPLE (when some values missing):
{
  "report_type": "Complete Blood Count",
  "extracted_values": {
    "HIV": null,
    "HBsAg": null,
    "TSH": null,
    "FastingBloodSugar": null,
    "Hemoglobin": 10.4
  }
}

Now scan the entire document page by page and extract the values. Output JSON only.
"""

# ─── Extractor ─────────────────────────────────────

def extract_lab_values(file_bytes: bytes, content_type: str = "image/jpeg") -> dict:
    """Extract structured lab values from a printed lab report (image/PDF) using Gemini."""
    mime = content_type if content_type else "image/jpeg"

    print(f"[vision_extractor] Calling Gemini with mime={mime}, bytes={len(file_bytes)}")
    raw = ask_with_image(EXTRACTION_PROMPT, file_bytes, mime)

    # 🔍 Log raw Gemini response BEFORE parsing
    print("=" * 60)
    print("[vision_extractor] RAW GEMINI RESPONSE:")
    print(raw)
    print("=" * 60)

    if not raw or raw.startswith("Sorry, I could not"):
        print("[vision_extractor] ❌ Gemini call failed or returned error message")
        return {
            "report_type": "Pregnancy Lab Panel",
            "extracted_values": {}
        }

    # Strip ```json ... ``` fences if Gemini added them
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw.strip(), flags=re.MULTILINE).strip()

    # Extract JSON object if Gemini added prose around it
    json_match = re.search(r"\{[\s\S]*\}", cleaned)
    if json_match:
        cleaned = json_match.group(0)

    print(f"[vision_extractor] CLEANED JSON STRING:\n{cleaned}")

    try:
        data = json.loads(cleaned)
        report_type = data.get("report_type") or "Pregnancy Lab Panel"
        extracted_values = data.get("extracted_values") or {}

        # Drop null values so downstream agent sees only real readings
        extracted_values = {k: v for k, v in extracted_values.items() if v is not None and v != ""}

        print(f"[vision_extractor] ✅ Parsed {len(extracted_values)} values: {extracted_values}")
        return {
            "report_type": report_type,
            "extracted_values": extracted_values
        }
    except Exception as e:
        print(f"[vision_extractor] ❌ JSON parse failed: {e}")
        print(f"[vision_extractor] Failed string was:\n{cleaned}")
        return {
            "report_type": "Pregnancy Lab Panel",
            "extracted_values": {}
        }