from utils.gemini import ask

def scheme_agent(user_profile: dict, language: str = "english"):
    prompt = f"""
You are a government scheme advisor for pregnant women in Karnataka, India.
Mother profile: {user_profile}

List relevant schemes she can apply for:
- JSY (Janani Suraksha Yojana)
- PMMVY (Pradhan Mantri Matru Vandana Yojana)
- JSSK (Janani Shishu Suraksha Karyakram)
- Bhagyalakshmi
- Matrupurna (Free daily nutritious meals at Anganwadi centre during pregnancy and 6 months after delivery)

For each scheme explain:
1. What benefit she gets
2. How to apply
3. Documents needed

Respond in {language} only. Keep it simple.
"""
    return ask(prompt)