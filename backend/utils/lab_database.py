from firebase_admin import firestore
from utils.database import db

# ─── Lab Reports ──────────────────────────────────

def save_lab_report(session_id: str, report_data: dict):
    db.collection("lab_reports").add({
        "session_id": session_id,
        "report_type": report_data.get("report_type", "Unknown"),
        "uploaded_at": firestore.SERVER_TIMESTAMP,
        "extracted_values": report_data.get("extracted_values", {}),
        "analysis": report_data.get("analysis", ""),
        "risk_level": report_data.get("risk_level", "low"),
        "language": report_data.get("language", "english"),
        "alert_sent": report_data.get("alert_sent", False),
        "issues": report_data.get("issues", [])
    })

def get_lab_reports(session_id: str):
    reports = db.collection("lab_reports")\
                .where("session_id", "==", session_id)\
                .order_by("uploaded_at", direction=firestore.Query.DESCENDING)\
                .stream()
    return [{**r.to_dict(), "id": r.id} for r in reports]