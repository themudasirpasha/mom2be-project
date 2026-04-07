from utils.gemini import ask
from agents.symptom_agent import symptom_agent
from agents.medicine_agent import medicine_agent
from agents.scheme_agent import scheme_agent
from agents.injection_agent import injection_agent
from agents.anganwadi_agent import anganwadi_agent
from agents.calendar_agent import calculate_pregnancy_info
from agents.alert_agent import alert_agent

def detect_intent(user_input: str) -> str:
    """Detect what the mother needs using Gemini."""
    prompt = f"""
Classify this pregnancy-related message into ONE category only:
Message: "{user_input}"

Categories:
- SYMPTOM (headache, swelling, bleeding, pain, fever, vomiting, dizziness)
- MEDICINE (medicine, tablet, iron, folic acid, calcium, dose)
- INJECTION (injection, tetanus, Td1, Td2, TT, vaccine)
- SCHEME (JSY, PMMVY, JSSK, scheme, benefit, money, government)
- ANGANWADI (anganwadi, nutrition, kit, food, ration, Matrupurna)
- BABY (baby size, baby growth, baby development, how big)
- APPOINTMENT (scan, ANC, visit, hospital, checkup, appointment)
- GENERAL (anything else)

Reply with ONLY the category name. Nothing else.
"""
    return ask(prompt).strip().upper()

def orchestrator_agent(user_input: str, language: str = "english", history: str = "", mother_data: dict = {}):
    """
    Main orchestrator — detects intent and calls the right sub-agent.
    """
    intent = detect_intent(user_input)
    week = 20  # default
    mother_name = mother_data.get("mother_name", "Amma")
    anganwadi_name = mother_data.get("anganwadi_name", "")
    anganwadi_phone = mother_data.get("anganwadi_phone", "")
    lmp = mother_data.get("lmp_date")

    if lmp:
        try:
            info = calculate_pregnancy_info(lmp)
            week = info["current_week"]
        except:
            pass

    # Route to correct sub-agent
    if intent == "SYMPTOM":
        return symptom_agent(user_input, language)

    elif intent == "MEDICINE":
        return medicine_agent(week, language)

    elif intent == "INJECTION":
        return injection_agent(week, mother_name, language)

    elif intent == "SCHEME":
        return scheme_agent(mother_data, language)

    elif intent == "ANGANWADI":
        return anganwadi_agent(mother_name, anganwadi_name, anganwadi_phone, language)

    elif intent == "BABY":
        from agents.calendar_agent import get_baby_size
        baby_size = get_baby_size(week)
        prompt = f"""
You are Mom2Be talking to {mother_name}.
She is in Week {week} of pregnancy.
{baby_size}
Tell her warmly about her baby this week in 3 lines.
Respond in {language} only.
"""
        return ask(prompt)

    elif intent == "APPOINTMENT":
        from agents.alert_agent import MILESTONES
        upcoming = []
        for milestone_week, milestone_text in MILESTONES.items():
            if week <= milestone_week <= week + 4:
                upcoming.append(f"Week {milestone_week}: {milestone_text}")
        upcoming_str = "\n".join(upcoming) if upcoming else "No major appointments in next 4 weeks"
        prompt = f"""
You are Mom2Be talking to {mother_name}.
She is in Week {week} of pregnancy.
Upcoming appointments:
{upcoming_str}
Tell her warmly about upcoming appointments.
Respond in {language} only.
"""
        return ask(prompt)

    else:
        # GENERAL — fall back to Gemini with context
        prompt = f"""
You are Mom2Be, a warm and caring AI pregnancy companion for women in Karnataka.
Mother name: {mother_name}
Pregnancy week: {week}
A pregnant woman said: "{user_input}"
Previous conversation:
{history}

Respond warmly like an elder sister in {language} only.
"""
        return ask(prompt)