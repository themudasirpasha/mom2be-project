from utils.gemini import ask

def anganwadi_agent(mother_name: str, anganwadi_name: str, anganwadi_phone: str, language: str = "english") -> str:
    anganwadi_line = f"Anganwadi centre contact: {anganwadi_name} — {anganwadi_phone}" if anganwadi_phone else "Contact your nearest Anganwadi centre"

    prompt = f"""
You are Mom2Be sending a monthly Anganwadi reminder to a pregnant woman.
Mother name: {mother_name}
{anganwadi_line}

Generate a short, warm monthly reminder (max 5 lines) that:
1. Greets her warmly by name
2. Reminds her it is the 1st of the month — time to collect her free nutrition kit from Anganwadi
3. Mentions Matrupurna scheme — free nutritious food every day
4. If she hasn't collected — tells her to call her Anganwadi madam with the number
5. Ends with warm encouragement

Respond in {language} only.
"""
    return ask(prompt)