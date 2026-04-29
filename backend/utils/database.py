import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()

# ─── Mother Profile ───────────────────────────────

def save_mother(session_id: str, profile: dict):
    db.collection("mothers").document(session_id).set(profile)

def get_mother(session_id: str):
    doc = db.collection("mothers").document(session_id).get()
    return doc.to_dict() if doc.exists else None

# ─── Chat History / Sessions ──────────────────────

def save_message(session_id: str, role: str, message: str):
    db.collection("sessions").document(session_id)\
      .collection("messages").add({
          "role": role,
          "message": message,
          "timestamp": firestore.SERVER_TIMESTAMP
      })

def get_history(session_id: str):
    messages = db.collection("sessions").document(session_id)\
                 .collection("messages")\
                 .order_by("timestamp").stream()
    return [{"role": m.to_dict()["role"], 
             "message": m.to_dict()["message"]} for m in messages]

def save_lab_report(session_id: str, report: dict):
    """Save lab report analysis under the mother's document in Firestore."""
    from google.cloud import firestore
    db = firestore.Client()
    
    # Append to lab_reports subcollection
    doc_ref = (
        db.collection("mothers")
        .document(session_id)
        .collection("lab_reports")
        .document()
    )
    doc_ref.set(report)

    # Also update latest snapshot on the mother doc
    db.collection("mothers").document(session_id).update({
        "latest_lab_report": report,
        "latest_lab_risk": report.get("overall_risk", "Unknown"),
    })
    return doc_ref.id


def get_lab_reports(session_id: str):
    from google.cloud import firestore
    db = firestore.Client()
    docs = (
        db.collection("mothers")
        .document(session_id)
        .collection("lab_reports")
        .order_by("analyzed_at", direction=firestore.Query.DESCENDING)
        .stream()
    )
    return [{**d.to_dict(), "id": d.id} for d in docs]