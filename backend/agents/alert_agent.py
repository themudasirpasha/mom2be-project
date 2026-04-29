from agents.calendar_agent import calculate_pregnancy_info
from utils.gemini import ask

# Key pregnancy milestones
MILESTONES = {
    8:  "First ANC visit due",
    12: "First trimester complete — NT scan due",
    16: "Td1 injection due",
    20: "Anomaly scan due",
    24: "Glucose tolerance test due",
    28: "Third trimester starting — Td2 injection due",
    32: "Growth scan due",
    36: "Weekly checkups begin now",
    38: "Pack your hospital bag!",
    40: "Due date approaching!"
}

def alert_agent(lmp_date_str: str, language: str = "english") -> str:
    info = calculate_pregnancy_info(lmp_date_str)
    week = info["current_week"]
    upcoming = []

    for milestone_week, milestone_text in MILESTONES.items():
        if week <= milestone_week <= week + 2:
            upcoming.append(f"Week {milestone_week}: {milestone_text}")

    upcoming_str = "\n".join(upcoming) if upcoming else "No major milestones in next 2 weeks"

    prompt = f"""
You are Mom2Be sending a proactive morning alert to a pregnant woman.
She is in Week {week} of pregnancy.
Upcoming milestones in next 2 weeks:
{upcoming_str}

Generate a short, warm morning alert (max 5 lines) that:
1. Greets her warmly
2. Tells her what week she is in
3. Reminds her of upcoming milestone if any
4. Gives one health tip for this week
5. Ends with encouragement

Respond in {language} only.
"""
    return ask(prompt)
