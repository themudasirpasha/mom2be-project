from utils.gemini import ask
from datetime import datetime

def anganwadi_agent(mother_name: str, anganwadi_name: str, anganwadi_phone: str, language: str = "english") -> str:
    anganwadi_line = f"Anganwadi centre contact: {anganwadi_name} — {anganwadi_phone}" if anganwadi_phone else "Contact your nearest Anganwadi centre"
    
    today = datetime.now()
    date_str = today.strftime("%d %B %Y")

    prompt = f"""
You are Mom2Be sending an Anganwadi reminder to a pregnant woman.
Mother name: {mother_name}
{anganwadi_line}
Today's date: {date_str}

Generate a short, warm reminder (max 5 lines) that:
1. Greets her warmly by name
2. Reminds her to collect her free nutrition kit from Anganwadi this month
3. Mentions Matrupurna scheme — free nutritious food every day
4. If she hasn't collected — tells her to call her Anganwadi madam with the number
5. Ends with warm encouragement

Respond in {language} only.
"""
    return ask(prompt)