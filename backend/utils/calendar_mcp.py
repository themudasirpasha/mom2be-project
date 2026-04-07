from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from datetime import datetime, timedelta
import logging
import os

logger = logging.getLogger(__name__)

SCOPES = ['https://www.googleapis.com/auth/calendar']

def get_calendar_service():
    creds = None
    token_path = '/app/token.json'
    
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    
    service = build('calendar', 'v3', credentials=creds)
    return service

def create_pregnancy_calendar_events(mother_name: str, lmp_date_str: str, email: str = None) -> dict:
    try:
        service = get_calendar_service()
        lmp = datetime.strptime(lmp_date_str, "%Y-%m-%d")
        events_created = []

        events = [
            {"title": f"🏥 {mother_name} — First ANC Visit", "week": 8, "description": "First Antenatal Checkup — FREE under JSSK!"},
            {"title": f"🔬 {mother_name} — NT Scan Due", "week": 12, "description": "Nuchal Translucency scan — FREE under JSSK!"},
            {"title": f"💉 {mother_name} — Td1 Injection Due", "week": 16, "description": "First Tetanus injection at nearest PHC. FREE under JSSK!"},
            {"title": f"🔬 {mother_name} — Anomaly Scan Due", "week": 20, "description": "Anomaly scan — FREE under JSSK!"},
            {"title": f"🧪 {mother_name} — Glucose Tolerance Test", "week": 24, "description": "Glucose tolerance test — FREE under JSSK!"},
            {"title": f"💉 {mother_name} — Td2 Injection Due", "week": 28, "description": "Second Tetanus injection at nearest PHC. FREE under JSSK!"},
            {"title": f"🔬 {mother_name} — Growth Scan Due", "week": 32, "description": "Growth scan — FREE under JSSK!"},
            {"title": f"🏥 {mother_name} — Weekly Checkups Begin", "week": 36, "description": "Weekly checkups start now!"},
            {"title": f"🎒 {mother_name} — Pack Hospital Bag!", "week": 38, "description": "Time to pack your hospital bag!"},
            {"title": f"👶 {mother_name} — Expected Delivery Date!", "week": 40, "description": "Your Expected Delivery Date! Mom2Be is with you! 💙"}
        ]

        calendar_id = 'primary'

        for event in events:
            event_date = lmp + timedelta(weeks=event["week"])
            event_body = {
                "summary": event["title"],
                "description": event["description"],
                "start": {"date": event_date.strftime("%Y-%m-%d"), "timeZone": "Asia/Kolkata"},
                "end": {"date": event_date.strftime("%Y-%m-%d"), "timeZone": "Asia/Kolkata"},
                "reminders": {
                    "useDefault": False,
                    "overrides": [
                        {"method": "popup", "minutes": 1440},
                        {"method": "popup", "minutes": 180}
                    ]
                }
            }
            service.events().insert(calendarId=calendar_id, body=event_body).execute()
            events_created.append(event["title"])

        return {"success": True, "events_created": events_created, "total": len(events_created)}

    except Exception as e:
        logger.error(f"Calendar MCP error: {e}")
        return {"success": False, "error": str(e)}