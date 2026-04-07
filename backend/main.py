from agents.calendar_agent import calendar_agent
from agents.alert_agent import alert_agent
from agents.registration_agent import registration_agent
from scheduler import start_scheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.gmail_mcp import send_welcome_email
from pydantic import BaseModel
from dotenv import load_dotenv
from agents.orchestrator import orchestrator_agent
from scheduler import run_morning_alerts, run_weekly_baby_update, run_injection_reminder, run_anganwadi_reminder
from scheduler import run_morning_alerts, run_weekly_baby_update, run_injection_reminder, run_anganwadi_reminder, run_anganwadi_followup
from agents.symptom_agent import symptom_agent
from agents.scheme_agent import scheme_agent
from utils.calendar_mcp import create_pregnancy_calendar_events
from agents.anganwadi_agent import anganwadi_agent
from agents.asha_agent import asha_agent
from agents.language_agent import language_agent
from agents.injection_agent import injection_agent
from agents.medicine_agent import medicine_agent
from utils.database import save_mother, get_mother, save_message, get_history
import uuid

load_dotenv()

app = FastAPI(title="When I'm With You - Mom2Be API")
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
start_scheduler()

class UserInput(BaseModel):
    message: str = ""
    language: str = "english"
    mother_name: str = "Amma"
    week: int = 20
    session_id: str = ""

class MotherProfile(BaseModel):
    mother_name: str
    lmp_date: str
    language: str = "english"
    phone: str = ""
    asha_worker: str = ""
    husband_phone: str = ""
    anganwadi_name: str = ""
    anganwadi_phone: str = ""
    email: str = ""    # ADD THIS

@app.get("/")
def root():
    return {"message": "Welcome to Mom2Be — When I'm With You 💙"}


@app.post("/register")
def register(profile: MotherProfile):
    session_id = str(uuid.uuid4())
    profile_dict = profile.dict()
    save_mother(session_id, profile_dict)

    # Generate warm welcome message via registration agent
    welcome_message = registration_agent(profile_dict, profile.language)
    save_message(session_id, "assistant", welcome_message)

    # Send welcome email
    if profile.email:
        send_welcome_email(profile.mother_name, profile.email)

    # Create Google Calendar events for all pregnancy milestones
    calendar_result = create_pregnancy_calendar_events(
        profile.mother_name,
        profile.lmp_date,
        profile.email
    )
    return {
        "session_id": session_id,
        "message": welcome_message,
        "calendar_events_created": calendar_result.get("total", 0),
        "calendar_status": "✅ Pregnancy calendar created!" if calendar_result["success"] else "⚠️ Calendar setup pending"
    }

@app.post("/chat")
def chat(data: UserInput):
    history = get_history(data.session_id) if data.session_id else []
    history_text = "\n".join(
        [f"{m['role'].upper()}: {m['message']}" for m in history[-6:]]
    ) if history else "No previous conversation."

    # Get mother profile for context
    mother_data = get_mother(data.session_id) or {}

    save_message(data.session_id, "user", data.message)
    response = orchestrator_agent(data.message, data.language, history_text, mother_data)
    save_message(data.session_id, "assistant", response)
    return {"response": response, "session_id": data.session_id}

@app.post("/symptom-check")
def check_symptom(data: UserInput):
    save_message(data.session_id, "user", f"SYMPTOM: {data.message}")
    response = symptom_agent(data.message, data.language)
    save_message(data.session_id, "assistant", response)
    return {"response": response}

@app.post("/schemes")
def get_schemes(data: UserInput):
    mother = get_mother(data.session_id) or {"name": data.mother_name, "week": data.week}
    response = scheme_agent(mother, data.language)
    return {"response": response}

@app.post("/asha-brief")
def asha_brief(data: UserInput):
    mother = get_mother(data.session_id) or {}
    name = mother.get("mother_name", data.mother_name)
    week = mother.get("week", data.week)
    response = asha_agent(name, data.message, week, data.language)
    return {"response": response}

@app.post("/translate")
def translate(data: UserInput):
    response = language_agent(data.message, data.language)
    return {"response": response}

@app.post("/medicine-reminder")
def medicine_reminder(data: UserInput):
    mother = get_mother(data.session_id) or {}
    week = mother.get("week", data.week)
    response = medicine_agent(week, data.language)
    return {"response": response}

@app.get("/history/{session_id}")
def chat_history(session_id: str):
    history = get_history(session_id)
    return {"history": history}

@app.get("/profile/{session_id}")
def get_profile(session_id: str):
    mother = get_mother(session_id)
    return {"profile": mother}

@app.get("/calendar/{session_id}")
def get_calendar(session_id: str):
    mother = get_mother(session_id)
    if not mother:
        return {"error": "Mother not found"}
    lmp = mother.get("lmp_date")
    language = mother.get("language", "english")
    return calendar_agent(lmp, language)

@app.get("/alerts/{session_id}")
def get_alerts(session_id: str):
    history = get_history(session_id)
    alerts = [m for m in history if m["role"] == "assistant"]
    return {"alerts": alerts[-5:]}  # Last 5 alerts

@app.post("/anganwadi-reminder")
def anganwadi_reminder(data: UserInput):
    mother = get_mother(data.session_id) or {}
    name = mother.get("mother_name", data.mother_name)
    anganwadi_name = mother.get("anganwadi_name", "")
    anganwadi_phone = mother.get("anganwadi_phone", "")
    language = mother.get("language", data.language)
    response = anganwadi_agent(name, anganwadi_name, anganwadi_phone, language)
    save_message(data.session_id, "assistant", response)
    return {"response": response}


@app.post("/injection-reminder")
def injection_reminder(data: UserInput):
    mother = get_mother(data.session_id) or {}
    week = mother.get("week", data.week)
    name = mother.get("mother_name", data.mother_name)
    language = mother.get("language", data.language)
    
    # Calculate week from LMP if available
    from agents.calendar_agent import calculate_pregnancy_info
    lmp = mother.get("lmp_date")
    if lmp:
        info = calculate_pregnancy_info(lmp)
        week = info["current_week"]
    
    response = injection_agent(week, name, language)
    save_message(data.session_id, "assistant", response)
    return {"response": response}

@app.post("/trigger-morning-alerts")
def trigger_morning_alerts():
    from scheduler import run_morning_alerts
    run_morning_alerts()
    return {"message": "Morning alerts triggered!"}

@app.post("/trigger-weekly-baby")
def trigger_weekly_baby():
    from scheduler import run_weekly_baby_update
    run_weekly_baby_update()
    return {"message": "Weekly baby update triggered!"}

@app.post("/trigger-injection")
def trigger_injection():
    from scheduler import run_injection_reminder
    run_injection_reminder()
    return {"message": "Injection reminders triggered!"}

@app.post("/trigger-anganwadi")
def trigger_anganwadi():
    from scheduler import run_anganwadi_reminder
    run_anganwadi_reminder()
    return {"message": "Anganwadi reminders triggered!"}

@app.post("/anganwadi-collected")
def anganwadi_collected(data: UserInput):
    mother = get_mother(data.session_id) or {}
    name = mother.get("mother_name", data.mother_name)
    language = mother.get("language", data.language)
    anganwadi_name = mother.get("anganwadi_name", "Anganwadi Centre")
    anganwadi_phone = mother.get("anganwadi_phone", "")
    week = mother.get("week", data.week)

    # Calculate week from LMP
    from agents.calendar_agent import calculate_pregnancy_info
    lmp = mother.get("lmp_date")
    if lmp:
        info = calculate_pregnancy_info(lmp)
        week = info["current_week"]

    collected = data.message.strip().lower()

    if collected in ["yes", "collected", "got it", "haan", "हाँ", "ಹೌದು"]:
        response = f"That's wonderful {name}! 💙 So happy to hear you collected your nutrition kit! Eat well, stay strong for your baby!"
        save_message(data.session_id, "user", "Anganwadi kit: COLLECTED ✅")
        save_message(data.session_id, "assistant", response)
        return {
            "response": response,
            "collected": True,
            "alert_sent": False
        }
    else:
        # Simulate alert to Anganwadi
        alert_message = f"Dear {anganwadi_name}, {name} (Week {week}) has not collected her Matrupurna nutrition kit this month. Request you to kindly follow up with her. Thank you!"

        response = f"Don't worry {name}! 💙 We have notified your Anganwadi madam. She will contact you soon and make sure you get your nutrition kit!"
        save_message(data.session_id, "user", "Anganwadi kit: NOT COLLECTED ❌")
        save_message(data.session_id, "assistant", response)

        return {
            "response": response,
            "collected": False,
            "alert_sent": True,
            "alert_sent_to": f"{anganwadi_name} — {anganwadi_phone}",
            "alert_message": alert_message
        }

@app.post("/trigger-anganwadi-followup")
def trigger_anganwadi_followup():
    from scheduler import run_anganwadi_followup
    run_anganwadi_followup()
    return {"message": "Anganwadi follow-up triggered!"}