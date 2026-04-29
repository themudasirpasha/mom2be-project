from apscheduler.schedulers.background import BackgroundScheduler
from agents.injection_agent import get_upcoming_injection, injection_agent
from utils.database import db, save_message
from agents.alert_agent import alert_agent
from agents.medicine_agent import medicine_agent
from agents.anganwadi_agent import anganwadi_agent
from agents.calendar_agent import calculate_pregnancy_info, get_baby_size
from utils.gemini import ask
from utils.whatsapp import send_whatsapp          # ← NEW
import logging

logger = logging.getLogger(__name__)


def run_morning_alerts():
    logger.info("Running morning alerts for all mothers...")
    try:
        mothers = db.collection("mothers").stream()
        for doc in mothers:
            data = doc.to_dict()
            session_id = doc.id
            lmp = data.get("lmp_date")
            language = data.get("language", "english")
            phone = data.get("phone", "")              # ← NEW
            mother_name = data.get("mother_name", "Amma")  # ← NEW
            if not lmp:
                continue
            try:
                alert = alert_agent(lmp, language)
                save_message(session_id, "assistant", alert)

                info = calculate_pregnancy_info(lmp)
                week = info["current_week"]
                reminder = medicine_agent(week, language)
                save_message(session_id, "assistant", reminder)

                # ── WhatsApp: send medicine reminder ──────────────────────
                if phone:
                    wa_message = _medicine_whatsapp_message(mother_name, language)
                    send_whatsapp(phone, wa_message)
                # ─────────────────────────────────────────────────────────

                logger.info(f"Morning alert + medicine reminder sent for session {session_id}")
            except Exception as e:
                logger.error(f"Error processing session {session_id}: {e}")
    except Exception as e:
        logger.error(f"Scheduler error: {e}")


def run_weekly_baby_update():
    logger.info("Running weekly baby size update for all mothers...")
    try:
        mothers = db.collection("mothers").stream()
        for doc in mothers:
            data = doc.to_dict()
            session_id = doc.id
            lmp = data.get("lmp_date")
            language = data.get("language", "english")
            mother_name = data.get("mother_name", "Amma")
            phone = data.get("phone", "")              # ← NEW
            if not lmp:
                continue
            try:
                info = calculate_pregnancy_info(lmp)
                week = info["current_week"]
                baby_size = get_baby_size(week)

                prompt = f"""
You are Mom2Be sending a warm weekly baby update to {mother_name}.
She is in Week {week} of pregnancy.
{baby_size}

Send her a short, joyful, emotional 3 line message about her baby this week.
Include the baby size comparison warmly.
End with one encouraging line.
Respond in {language} only.
"""
                message = ask(prompt)
                save_message(session_id, "assistant", message)

                # ── WhatsApp: send the same baby update ───────────────────
                if phone:
                    send_whatsapp(phone, message)
                # ─────────────────────────────────────────────────────────

                logger.info(f"Weekly baby update sent for session {session_id}")
            except Exception as e:
                logger.error(f"Error sending baby update for {session_id}: {e}")
    except Exception as e:
        logger.error(f"Weekly baby update error: {e}")


def run_anganwadi_reminder():
    logger.info("Running monthly Anganwadi reminder...")
    try:
        mothers = db.collection("mothers").stream()
        for doc in mothers:
            data = doc.to_dict()
            session_id = doc.id
            language = data.get("language", "english")
            mother_name = data.get("mother_name", "Amma")
            anganwadi_name = data.get("anganwadi_name", "")
            anganwadi_phone = data.get("anganwadi_phone", "")
            try:
                reminder = anganwadi_agent(mother_name, anganwadi_name, anganwadi_phone, language)
                save_message(session_id, "assistant", reminder)
                phone = data.get("phone", "")
                if phone:
                    send_whatsapp(phone, reminder)
                logger.info(f"Anganwadi reminder sent for session {session_id}")
            except Exception as e:
                logger.error(f"Error sending Anganwadi reminder for {session_id}: {e}")
    except Exception as e:
        logger.error(f"Anganwadi scheduler error: {e}")


def run_injection_reminder():
    logger.info("Checking injection reminders...")
    try:
        mothers = db.collection("mothers").stream()
        for doc in mothers:
            data = doc.to_dict()
            session_id = doc.id
            lmp = data.get("lmp_date")
            language = data.get("language", "english")
            mother_name = data.get("mother_name", "Amma")
            phone = data.get("phone", "")              # ← NEW
            if not lmp:
                continue
            try:
                info = calculate_pregnancy_info(lmp)
                week = info["current_week"]
                upcoming = get_upcoming_injection(week)
                if upcoming["due"]:
                    reminder = injection_agent(week, mother_name, language)
                    save_message(session_id, "assistant", reminder)

                    # ── WhatsApp: send injection reminder ─────────────────
                    if phone:
                        send_whatsapp(phone, reminder)
                    # ─────────────────────────────────────────────────────

                    logger.info(f"Injection reminder sent for session {session_id}")
            except Exception as e:
                logger.error(f"Error sending injection reminder for {session_id}: {e}")
    except Exception as e:
        logger.error(f"Injection scheduler error: {e}")


def run_anganwadi_followup():
    logger.info("Running Anganwadi follow-up question...")
    try:
        mothers = db.collection("mothers").stream()
        for doc in mothers:
            data = doc.to_dict()
            session_id = doc.id
            language = data.get("language", "english")
            mother_name = data.get("mother_name", "Amma")
            try:
                prompt = f"""
You are Mom2Be sending a follow-up message to {mother_name}.
She was reminded this morning to collect her free Matrupurna nutrition kit from Anganwadi.

Send a short warm message (3 lines max) asking:
1. Did she collect her nutrition kit today?
2. Tell her to reply YES if collected or NO if not collected
3. Warm encouraging tone

Respond in {language} only.
"""
                message = ask(prompt)
                save_message(session_id, "assistant", message)
                phone = data.get("phone", "")
                if phone:
                    send_whatsapp(phone, message)
                logger.info(f"Anganwadi follow-up sent for session {session_id}")
            except Exception as e:
                logger.error(f"Error sending follow-up for {session_id}: {e}")
    except Exception as e:
        logger.error(f"Anganwadi follow-up error: {e}")


def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(run_morning_alerts,    'cron', hour=8,  minute=0)
    scheduler.add_job(run_weekly_baby_update,'cron', day_of_week='mon', hour=8, minute=30)
    scheduler.add_job(run_anganwadi_reminder,'cron', day=1,   hour=9,  minute=0)
    scheduler.add_job(run_injection_reminder,'cron', day_of_week='mon', hour=9, minute=0)
    scheduler.add_job(run_anganwadi_followup,'cron', day=1,   hour=18, minute=0)
    scheduler.start()
    logger.info("Scheduler started!")
    return scheduler


# ── WhatsApp message templates (used by run_morning_alerts) ──────────────────

def _medicine_whatsapp_message(name: str, language: str) -> str:
    templates = {
        "kannada": (
            f"🌅 ಶುಭೋದಯ {name} ಅಮ್ಮ!\n\n"
            "ಇಂದಿನ ಔಷಧಿಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳಲು ಮರೆಯಬೇಡಿ 💊\n"
            "✅ Iron tablet\n"
            "✅ Folic Acid\n"
            "✅ Calcium\n\n"
            "ನಿಮ್ಮ ಮಗುವಿಗಾಗಿ ಆರೋಗ್ಯವಾಗಿರಿ! 🤱\n"
            "— Mom2Be 💜"
        ),
        "hindi": (
            f"🌅 सुप्रभात {name} अम्मा!\n\n"
            "आज की दवाइयाँ लेना मत भूलें 💊\n"
            "✅ Iron tablet\n"
            "✅ Folic Acid\n"
            "✅ Calcium\n\n"
            "अपने बच्चे के लिए स्वस्थ रहें! 🤱\n"
            "— Mom2Be 💜"
        ),
        "urdu": (
            f"🌅 صبح بخیر {name} امّا!\n\n"
            "آج کی دوائیں لینا مت بھولیں 💊\n"
            "✅ Iron tablet\n"
            "✅ Folic Acid\n"
            "✅ Calcium\n\n"
            "اپنے بچے کے لیے صحت مند رہیں! 🤱\n"
            "— Mom2Be 💜"
        ),
        "english": (
            f"🌅 Good morning {name}!\n\n"
            "Don't forget today's medicines 💊\n"
            "✅ Iron tablet\n"
            "✅ Folic Acid\n"
            "✅ Calcium\n\n"
            "Stay healthy for your baby! 🤱\n"
            "— Mom2Be 💜"
        ),
    }
    return templates.get(language.lower(), templates["english"])
