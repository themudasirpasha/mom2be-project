from utils.gemini import ask

def asha_agent(mother_name: str, symptoms: str, week: int, language: str = "english"):
    prompt = f"""
You are generating a health brief for an ASHA worker.
Mother name: {mother_name}
Pregnancy week: {week}
Reported symptoms: {symptoms}

Generate a short, clear briefing for the ASHA worker including:
1. Mother's current status
2. Symptoms to watch
3. Recommended action
4. Urgency level

Respond in {language} only.
"""
    return ask(prompt)
