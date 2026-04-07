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