from utils.gemini import ask

# ─── Pregnancy Reference Ranges ────────────────────

TSH_T1 = (0.1, 2.5)         # mIU/L — first trimester
TSH_T2_T3 = (0.2, 3.0)      # mIU/L — second/third trimester
FBS_RANGE = (70, 95)        # mg/dL — fasting blood sugar
HB_MIN = 11.0               # g/dL — hemoglobin minimum

# ─── Abnormality Detection ────────────────────────

def detect_abnormalities(values: dict, week: int = 20) -> list:
    """Compare extracted values to pregnancy reference ranges."""
    issues = []
    trimester = 1 if week <= 13 else (2 if week <= 27 else 3)

    # HIV
    hiv = values.get("HIV")
    if hiv and "negative" not in str(hiv).lower():
        issues.append({
            "test": "HIV",
            "value": hiv,
            "expected": "Negative",
            "severity": "high",
            "note": "HIV result is not negative — urgent follow-up required."
        })

    # HBsAg
    hbsag = values.get("HBsAg")
    if hbsag and "negative" not in str(hbsag).lower():
        issues.append({
            "test": "HBsAg",
            "value": hbsag,
            "expected": "Negative",
            "severity": "high",
            "note": "Hepatitis B surface antigen is positive — follow-up required."
        })

    # TSH
    tsh = values.get("TSH")
    if tsh is not None:
        try:
            v = float(tsh)
            lo, hi = TSH_T1 if trimester == 1 else TSH_T2_T3
            if v < lo or v > hi:
                status = "low" if v < lo else "high"
                issues.append({
                    "test": "TSH",
                    "value": v,
                    "expected": f"{lo}-{hi} mIU/L",
                    "severity": "medium",
                    "note": f"TSH is {status} — thyroid review recommended."
                })
        except (TypeError, ValueError):
            pass

    # Fasting Blood Sugar
    fbs = values.get("FastingBloodSugar")
    if fbs is not None:
        try:
            v = float(fbs)
            lo, hi = FBS_RANGE
            if v < lo:
                issues.append({
                    "test": "Fasting Blood Sugar",
                    "value": v,
                    "expected": f"{lo}-{hi} mg/dL",
                    "severity": "medium",
                    "note": "Blood sugar is low — please discuss with your doctor."
                })
            elif v > hi:
                severity = "high" if v >= 110 else "medium"
                issues.append({
                    "test": "Fasting Blood Sugar",
                    "value": v,
                    "expected": f"{lo}-{hi} mg/dL",
                    "severity": severity,
                    "note": "Blood sugar is high — gestational diabetes screening recommended."
                })
        except (TypeError, ValueError):
            pass

    # Hemoglobin
    hb = values.get("Hemoglobin")
    if hb is not None:
        try:
            v = float(hb)
            if v < 7:
                issues.append({
                    "test": "Hemoglobin",
                    "value": v,
                    "expected": f">{HB_MIN} g/dL",
                    "severity": "high",
                    "note": "Severe anemia — urgent medical attention needed."
                })
            elif v < 9:
                issues.append({
                    "test": "Hemoglobin",
                    "value": v,
                    "expected": f">{HB_MIN} g/dL",
                    "severity": "high",
                    "note": "Moderate anemia — treatment required."
                })
            elif v < HB_MIN:
                issues.append({
                    "test": "Hemoglobin",
                    "value": v,
                    "expected": f">{HB_MIN} g/dL",
                    "severity": "medium",
                    "note": "Mild anemia — iron-rich diet and supplements recommended."
                })
        except (TypeError, ValueError):
            pass

    return issues

# ─── Risk Roll-up & Alert Builder ──────────────────

def compute_risk_level(issues: list) -> str:
    if any(i["severity"] == "high" for i in issues):
        return "high"
    if any(i["severity"] == "medium" for i in issues):
        return "medium"
    return "low"

def build_asha_alert(report_type: str, issues: list) -> str:
    high = [i for i in issues if i["severity"] == "high"]
    if not high:
        return ""
    summary = ", ".join(f"{i['test']} ({i['value']})" for i in high)
    return f"⚠️ Lab Alert: {report_type} - {summary} - Contact ASHA worker immediately"

# ─── Main Agent ────────────────────────────────────

def lab_report_agent(extracted_values: dict,
                     report_type: str = "Pregnancy Lab Panel",
                     language: str = "english",
                     week: int = 20,
                     mother_name: str = "Amma") -> dict:
    """
    Analyse lab values and generate a warm mother-friendly explanation.
    Returns: {analysis, risk_level, issues, asha_alert}
    """
    issues = detect_abnormalities(extracted_values, week)
    risk_level = compute_risk_level(issues)
    asha_alert = build_asha_alert(report_type, issues) if risk_level == "high" else ""

    values_text = "\n".join(
        f"- {k}: {v}" for k, v in extracted_values.items() if v is not None
    ) or "No values could be read."

    issues_text = "\n".join(
        f"- {i['test']}: value={i['value']}, expected={i['expected']} ({i['note']})"
        for i in issues
    ) or "All values look normal."

    prompt = f"""
You are Mom2Be, a warm caring pregnancy companion talking to {mother_name}.
She is in Week {week} of pregnancy and has just received her {report_type} results.

Lab values:
{values_text}

Findings:
{issues_text}

Overall risk level: {risk_level}

Write a warm, simple explanation in 4-6 short lines that:
1. Greets her warmly by name
2. Explains what the results mean in simple words (no medical jargon)
3. If anything is abnormal, gently tells her to contact her ASHA worker or doctor
4. If everything is normal, congratulates her warmly
5. Ends with encouragement

Respond in {language} only.
"""
    analysis = ask(prompt)

    return {
        "analysis": analysis,
        "risk_level": risk_level,
        "issues": issues,
        "asha_alert": asha_alert
    }