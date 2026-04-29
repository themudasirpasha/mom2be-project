from utils.gemini import ask

INJECTION_SCHEDULE = {
    16: ("Td1", "First Tetanus injection"),
    28: ("Td2", "Second Tetanus injection"),
    36: ("TT Booster", "Tetanus Booster if needed"),
}

def get_upcoming_injection(week: int) -> dict:
    for injection_week, (name, description) in INJECTION_SCHEDULE.items():
        if week <= injection_week <= week + 2:
            return {
                "due": True,
                "injection_name": name,
                "description": description,
                "due_week": injection_week
            }
    return {"due": False}

def injection_agent(week: int, mother_name: str, language: str = "english") -> str:
    upcoming = get_upcoming_injection(week)

    if not upcoming["due"]:
        prompt = f"""
You are Mom2Be talking to {mother_name}.
She is in Week {week} of pregnancy.
No injection is due in the next 2 weeks.

Send her a short warm message:
1. Tell her no injection is due right now
2. Tell her next injection schedule — Td1 at Week 16, Td2 at Week 28
3. Encourage her to stay on track
Respond in {language} only.
"""
    else:
        prompt = f"""
You are Mom2Be talking to {mother_name}.
She is in Week {week} of pregnancy.
Upcoming injection: {upcoming["injection_name"]} — {upcoming["description"]}
Due at: Week {upcoming["due_week"]}

Send her a warm reminder (max 5 lines):
1. Tell her {upcoming["injection_name"]} injection is due soon
2. Tell her to visit her nearest government hospital or PHC (Primary Health Centre)
3. Tell her this injection is completely FREE under JSSK scheme
4. Tell her to inform her ASHA worker to accompany her
5. End with warm encouragement
Respond in {language} only.
"""
    return ask(prompt)