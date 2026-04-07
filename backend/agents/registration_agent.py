from utils.gemini import ask

def registration_agent(profile: dict, language: str = "english") -> str:
    """
    Generates a warm, personalized welcome message after a mother registers.
    Called after save_mother() in the /register endpoint.
    """
    name = profile.get("mother_name", "Amma")
    lmp_date = profile.get("lmp_date", "")
    asha_worker = profile.get("asha_worker", "")
    phone = profile.get("phone", "")
    husband_phone = profile.get("husband_phone", "")

    asha_line = f"ASHA worker: {asha_worker}" if asha_worker else "No ASHA worker linked yet"
    husband_line = f"Husband's number: {husband_phone}" if husband_phone else "No husband number added"

    prompt = f"""
You are Mom2Be, a warm and caring AI pregnancy companion for women in Karnataka.
A new mother just registered on our app. Her details:
- Name: {name}
- LMP Date: {lmp_date}
- {asha_line}
- {husband_line}

Generate a warm, short welcome message (max 6 lines) that:
1. Greets her by name very warmly, like an elder sister
2. Confirms her registration is complete
3. Tells her Mom2Be will be with her every step of the way
4. Mentions she can ask anything — medicines, symptoms, schemes, appointments
5. Ends with one warm encouraging line

Respond in {language} only. Be warm, human, not clinical.
"""
    return ask(prompt)
