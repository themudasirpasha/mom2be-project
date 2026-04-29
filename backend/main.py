import uuid
from agents.joy_agent import joy_agent
from fastapi import FastAPI, Request, File, UploadFile, Form
from pydantic import BaseModel
from utils.gemini import ask, ask_with_image
from utils.database import save_mother, get_mother, save_message, get_history
from agents.orchestrator import orchestrator_agent
from agents.symptom_agent import symptom_agent
from agents.medicine_agent import medicine_agent
from agents.scheme_agent import scheme_agent
from agents.alert_agent import alert_agent
from agents.anganwadi_agent import anganwadi_agent
from agents.injection_agent import injection_agent
from agents.calendar_agent import calculate_pregnancy_info, get_baby_size
from agents.amma_circle_agent import (
    post_community_message,
    get_community_messages,
    post_baby_name,
    vote_for_name,
    post_prayer_wall,
    react_to_prayer,
    post_birth_announcement,
    get_celebration_wall,
    get_top_baby_names
)
from fastapi.middleware.cors import CORSMiddleware
from agents.registration_agent import registration_agent
from agents.asha_agent import asha_agent
from agents.language_agent import language_agent
from utils.gmail_mcp import send_welcome_email
from utils.calendar_mcp import create_pregnancy_calendar_events
from utils.whatsapp import send_whatsapp
from scheduler import (
    start_scheduler,
    run_morning_alerts,
    run_weekly_baby_update,
    run_injection_reminder,
    run_anganwadi_reminder,
    run_anganwadi_followup
)

app = FastAPI(title="Mom2Be API", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
start_scheduler()

# ===== PYDANTIC MODELS =====

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
    email: str = ""
    taluk: str = ""
    district: str = "Karnataka"

class AmmaChatPostInput(BaseModel):
    session_id: str
    message: str
    language: str = "english"

class AmmaChatGetInput(BaseModel):
    trimester: str = None
    taluk: str = None
    limit: int = 20

class BabyNamePostInput(BaseModel):
    session_id: str
    baby_name: str
    language: str = "english"

class NameVoteInput(BaseModel):
    name_id: str
    session_id: str

class PrayerPostInput(BaseModel):
    session_id: str
    language: str = "english"

class PrayerReactInput(BaseModel):
    prayer_id: str
    session_id: str
    language: str = "english"

class BirthAnnouncementInput(BaseModel):
    session_id: str
    baby_gender: str = ""
    language: str = "english"

# ===== ROUTES =====

@app.get("/")
def home():
    return {
        "app": "Mom2Be",
        "tagline": "Karnataka's AI-powered pregnancy companion",
        "status": "running"
    }

@app.post("/register")
async def register_mother(profile: MotherProfile):
    """Register a new mother"""
    session_id = str(uuid.uuid4())

    profile_data = {
        "mother_name": profile.mother_name,
        "lmp_date": profile.lmp_date,
        "language": profile.language,
        "phone": profile.phone,
        "asha_worker": profile.asha_worker,
        "husband_phone": profile.husband_phone,
        "anganwadi_name": profile.anganwadi_name,
        "anganwadi_phone": profile.anganwadi_phone,
        "email": profile.email,
        "taluk": profile.taluk,
        "district": profile.district
    }

    save_mother(session_id, profile_data)

    welcome_message = registration_agent(profile_data, profile.language)
    save_message(session_id, "user", "Registration completed")
    save_message(session_id, "assistant", welcome_message)

    # WhatsApp welcome message
    if profile.phone:
        welcome_messages = {
            "kannada": f"💜 Mom2Be ಗೆ ಸ್ವಾಗತ {profile.mother_name} ಅಮ್ಮ!\n\nನಿಮ್ಮ ಪಯಣ ಶುರುವಾಗಿದೆ! ನಾವು ಪ್ರತಿ ಹೆಜ್ಜೆಯಲ್ಲೂ ನಿಮ್ಮೊಂದಿಗಿದ್ದೇವೆ 💜\n\n✅ ಪ್ರತಿದಿನ ಔಷಧಿ ರಿಮೈಂಡರ್\n✅ ಮಗುವಿನ ಅಪ್ಡೇಟ್\n✅ ಇಂಜೆಕ್ಷನ್ ರಿಮೈಂಡರ್\n✅ ಸರ್ಕಾರಿ ಯೋಜನೆ alerts\n\nಎಲ್ಲವೂ WhatsApp ನಲ್ಲಿ — ಸಂಪೂರ್ಣ ಉಚಿತ!\n\n— Mom2Be 💜\nAmma Jothe, Prathi Hejje 🌸",
            "hindi": f"💜 Mom2Be में आपका स्वागत है {profile.mother_name} अम्मा!\n\nआपकी यह खूबसूरत यात्रा शुरू हो गई है!\nहम आपके साथ हैं — हर सुबह, हर रात, हर कदम पर 💜\n\n✅ Daily medicine reminders\n✅ Weekly baby updates\n✅ Injection reminders\n✅ Government scheme alerts\n\nसब कुछ WhatsApp पर मिलेगा — बिल्कुल मुफ्त!\n\n— Mom2Be 💜\nAmma Jothe, Prathi Hejje 🌸",
            "urdu": f"💜 Mom2Be میں خوش آمدید {profile.mother_name} امّا!\n\nآپ کا یہ خوبصورت سفر شروع ہو گیا!\nہم آپ کے ساتھ ہیں — ہر صبح، ہر رات، ہر قدم پر 💜\n\n✅ روزانہ medicine reminders\n✅ ہفتہ وار baby updates\n✅ Injection reminders\n✅ سرکاری اسکیم alerts\n\nسب WhatsApp پر ملے گا — بالکل مفت!\n\n— Mom2Be 💜\nAmma Jothe, Prathi Hejje 🌸",
            "english": f"💜 Welcome to Mom2Be {profile.mother_name}!\n\nYour beautiful journey begins today!\nWe are with you — every morning, every night, every single step 💜\n\n✅ Daily medicine reminders\n✅ Weekly baby updates\n✅ Injection reminders\n✅ Government scheme alerts\n\nEverything on WhatsApp — completely free!\n\n— Mom2Be 💜\nAmma Jothe, Prathi Hejje 🌸",
        }
        welcome_wa = welcome_messages.get(profile.language, welcome_messages["english"])
        send_whatsapp(profile.phone, welcome_wa)

    email_status = "not_sent"
    if profile.email:
        try:
            send_welcome_email(profile.mother_name, profile.email)
            email_status = "sent"
        except:
            email_status = "failed"

    calendar_status = "not_created"
    if profile.email and profile.lmp_date:
        try:
            create_pregnancy_calendar_events(profile.mother_name, profile.lmp_date, profile.email)
            calendar_status = "created"
        except:
            calendar_status = "failed"

    return {
        "status": "registered",
        "session_id": session_id,
        "message": f"Welcome {profile.mother_name}!",
        "welcome_message": welcome_message,
        "email_status": email_status,
        "calendar_status": calendar_status
    }


@app.post("/chat")
async def chat(user_input: UserInput):
    """Main chat endpoint"""
    session_id = user_input.session_id
    message = user_input.message
    language = user_input.language

    mother_data = get_mother(session_id) or {}
    history = get_history(session_id)
    history_text = "\n".join([f"{h['role']}: {h['message']}" for h in history[-5:]])

    save_message(session_id, "user", message)

    response = orchestrator_agent(
        user_input=message,
        language=language,
        history=history_text,
        mother_data=mother_data
    )
    save_message(session_id, "assistant", response)

    return {"response": response}


@app.post("/symptom-check")
async def symptom_check(user_input: UserInput):
    """Check symptoms"""
    response = symptom_agent(user_input.message, user_input.language)
    return {"response": response}


@app.post("/schemes")
async def get_schemes(user_input: UserInput):
    """Get government schemes"""
    mother_data = get_mother(user_input.session_id) or {}
    response = scheme_agent(mother_data, user_input.language)
    return {"response": response}


@app.post("/asha-brief")
async def asha_brief(user_input: UserInput):
    """ASHA worker briefing"""
    mother_data = get_mother(user_input.session_id) or {}
    history = get_history(user_input.session_id)

    mother_name = mother_data.get("mother_name", "Mother")
    week = user_input.week
    lmp = mother_data.get("lmp_date")

    if lmp:
        try:
            info = calculate_pregnancy_info(lmp)
            week = info["current_week"]
        except:
            pass

    recent_concerns = [h['message'] for h in history if h['role'] == 'user'][-3:]

    prompt = f"""
You are generating an ASHA worker briefing in {user_input.language}.

Mother: {mother_name}
Week: {week}
Recent concerns: {', '.join(recent_concerns) if recent_concerns else 'None'}

Provide:
1. Current pregnancy status
2. Key concerns to address
3. Action items for ASHA worker
4. Red flags to monitor

Keep it brief and actionable.
"""
    response = ask(prompt)
    return {"briefing": response}


@app.post("/translate")
async def translate(user_input: UserInput):
    """Translate text"""
    prompt = f"Translate this to {user_input.language}: {user_input.message}"
    response = ask(prompt)
    return {"translated_text": response}


@app.post("/medicine-reminder")
async def medicine_reminder(user_input: UserInput):
    """Medicine reminders"""
    response = medicine_agent(user_input.week, user_input.language)
    return {"response": response}


@app.post("/injection-reminder")
async def injection_reminder(user_input: UserInput):
    """TT injection reminder"""
    mother_data = get_mother(user_input.session_id) or {}
    mother_name = mother_data.get("mother_name", user_input.mother_name)

    week = user_input.week
    lmp = mother_data.get("lmp_date")
    if lmp:
        try:
            info = calculate_pregnancy_info(lmp)
            week = info["current_week"]
        except:
            pass

    response = injection_agent(week, mother_name, user_input.language)
    return {"response": response}


@app.post("/anganwadi-reminder")
async def anganwadi_reminder(user_input: UserInput):
    """Anganwadi visit reminder"""
    mother_data = get_mother(user_input.session_id) or {}
    mother_name = mother_data.get("mother_name", user_input.mother_name)
    anganwadi_name = mother_data.get("anganwadi_name", "your Anganwadi center")
    anganwadi_phone = mother_data.get("anganwadi_phone", "")

    response = anganwadi_agent(
        mother_name,
        anganwadi_name,
        anganwadi_phone,
        user_input.language
    )
    return {"response": response}


@app.post("/anganwadi-collected")
async def anganwadi_collected(user_input: UserInput):
    """Mark Anganwadi items as collected"""
    prompt = f"""
You are Mom2Be. The mother just collected her supplies from the Anganwadi.

Respond warmly in {user_input.language}:
- Congratulate her for taking care of nutrition
- Remind her what to do with the supplies
- Encourage her to visit regularly

Keep it brief and encouraging.
"""
    response = ask(prompt)
    return {"response": response}


@app.get("/calendar/{session_id}")
async def pregnancy_calendar(session_id: str):
    """Get pregnancy calendar"""
    mother_data = get_mother(session_id)
    if not mother_data:
        return {"error": "Mother not found"}

    lmp_date = mother_data.get("lmp_date")
    if not lmp_date:
        return {"error": "LMP date not found"}

    try:
        info = calculate_pregnancy_info(lmp_date)
        return info
    except Exception as e:
        return {"error": str(e)}


@app.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    """Get conversation history"""
    history = get_history(session_id)
    return {"history": history, "count": len(history)}


@app.get("/profile/{session_id}")
async def get_profile(session_id: str):
    """Get mother's profile"""
    mother_data = get_mother(session_id)
    if mother_data:
        return {"profile": mother_data}
    else:
        return {"error": "Profile not found"}


@app.get("/alerts/{session_id}")
async def get_alerts(session_id: str):
    """Get critical alerts"""
    mother_data = get_mother(session_id) or {}
    language = mother_data.get("language", "english")
    lmp_date = mother_data.get("lmp_date", "")
    response = alert_agent(lmp_date, language)
    return {"alerts": response}


@app.post("/upload-lab-report")
async def upload_lab_report(
    session_id: str = Form(...),
    language: str = Form("english"),
    file: UploadFile = File(...)
):
    """Upload and analyze lab report"""
    try:
        image_bytes = await file.read()
        mime_type = file.content_type or "image/jpeg"

        prompt = f"""
You are Mom2Be analyzing a pregnancy lab report.

Analyze this lab report and provide in {language}:
1. Key findings (Hemoglobin, Blood Sugar, etc.)
2. What's normal and what needs attention
3. Simple advice for the mother
4. Whether she should consult a doctor urgently

Keep it warm and reassuring, but honest about any concerns.
"""
        response = ask_with_image(prompt, image_bytes, mime_type)

        save_message(session_id, "user", "[Uploaded lab report]")
        save_message(session_id, "assistant", response)

        return {"analysis": response, "language": language}
    except Exception as e:
        return {"error": str(e)}


@app.get("/lab-reports/{session_id}")
async def get_lab_reports(session_id: str):
    """Get lab report history"""
    history = get_history(session_id)
    lab_reports = [
        h for h in history
        if h['role'] == 'user' and '[Uploaded lab report]' in h['message']
    ]
    return {"reports": lab_reports, "count": len(lab_reports)}


# ===== AMMA CIRCLE ROUTES =====

@app.post("/amma-circle/chat/post")
async def amma_circle_post_message(data: AmmaChatPostInput):
    """Post anonymous message to Amma Circle community chat"""
    try:
        mother_data = get_mother(data.session_id) or {}
        lmp = mother_data.get("lmp_date")
        taluk = mother_data.get("taluk", "Unknown")

        week = 20
        if lmp:
            try:
                info = calculate_pregnancy_info(lmp)
                week = info["current_week"]
            except:
                pass

        if week <= 12:
            trimester = "T1"
        elif week <= 28:
            trimester = "T2"
        else:
            trimester = "T3"

        result = post_community_message(data.session_id, data.message, trimester, taluk, data.language)
        return result
    except Exception as e:
        return {"error": str(e)}


@app.post("/amma-circle/chat/messages")
async def amma_circle_get_messages(data: AmmaChatGetInput):
    """Get community messages filtered by trimester/taluk"""
    try:
        result = get_community_messages(data.trimester, data.taluk, data.limit)
        return result
    except Exception as e:
        return {"error": str(e)}


@app.post("/amma-circle/name/post")
async def amma_circle_post_name(data: BabyNamePostInput):
    """Post baby name suggestion for community voting"""
    try:
        result = post_baby_name(data.session_id, data.baby_name, data.language)
        return result
    except Exception as e:
        return {"error": str(e)}


@app.post("/amma-circle/name/vote")
async def amma_circle_vote_name(data: NameVoteInput):
    """Vote for a baby name"""
    try:
        result = vote_for_name(data.name_id, data.session_id)
        return result
    except Exception as e:
        return {"error": str(e)}


@app.get("/amma-circle/name/top")
async def amma_circle_top_names(limit: int = 10):
    """Get top voted baby names"""
    try:
        result = get_top_baby_names(limit)
        return result
    except Exception as e:
        return {"error": str(e)}


@app.post("/amma-circle/prayer/post")
async def amma_circle_post_prayer(data: PrayerPostInput):
    """Post to prayer wall (Week 36+ only)"""
    try:
        mother_data = get_mother(data.session_id) or {}
        lmp = mother_data.get("lmp_date")

        week = 20
        if lmp:
            try:
                info = calculate_pregnancy_info(lmp)
                week = info["current_week"]
            except:
                pass

        result = post_prayer_wall(data.session_id, week, data.language)
        return result
    except Exception as e:
        return {"error": str(e)}


@app.post("/amma-circle/prayer/react")
async def amma_circle_react_prayer(data: PrayerReactInput):
    """Send prayer reaction to another mother's prayer"""
    try:
        result = react_to_prayer(data.prayer_id, data.session_id, data.language)
        return result
    except Exception as e:
        return {"error": str(e)}


@app.post("/amma-circle/birth-announcement")
async def amma_circle_birth_announcement(data: BirthAnnouncementInput):
    """Post birth announcement to celebration wall"""
    try:
        result = post_birth_announcement(data.session_id, data.baby_gender, data.language)
        return result
    except Exception as e:
        return {"error": str(e)}


@app.get("/amma-circle/celebration-wall")
async def amma_circle_celebration_wall(limit: int = 20):
    """Get recent birth announcements from celebration wall"""
    try:
        result = get_celebration_wall(limit)
        return result
    except Exception as e:
        return {"error": str(e)}

@app.get("/joy/{session_id}")
async def get_joy(session_id: str):
    """Joy Corner — daily motivation, baby update, assignment, countdown"""
    mother_data = get_mother(session_id) or {}
    if not mother_data:
        return {"error": "Mother not found"}
    result = joy_agent(session_id, mother_data)
    return result

@app.post("/run-morning-alerts")
async def trigger_morning_alerts():
    run_morning_alerts()
    return {"status": "done"}

@app.post("/run-weekly-update")
async def trigger_weekly_update():
    run_weekly_baby_update()
    return {"status": "done"}

@app.post("/run-anganwadi-reminder")
async def trigger_anganwadi():
    run_anganwadi_reminder()
    return {"status": "done"}

@app.post("/run-injection-reminder")
async def trigger_injection():
    run_injection_reminder()
    return {"status": "done"}

# ===== SERVER =====

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
