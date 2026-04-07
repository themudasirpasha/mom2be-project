from utils.gemini import ask

def symptom_agent(symptoms: str, language: str = "english"):
    prompt = f"""
You are a medical symptom checker for pregnant women.
Symptoms reported: "{symptoms}"

Analyze and respond with:
1. Risk level: LOW / MEDIUM / HIGH
2. What this symptom could mean in simple words
3. Immediate action to take
4. Whether to call 108 emergency or not

Be warm, not scary. Respond in {language} only.
"""
    return ask(prompt)
