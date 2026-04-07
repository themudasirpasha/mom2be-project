from datetime import datetime, date, timedelta
from utils.gemini import ask

BABY_SIZE = {
    4: ("poppy seed", "0.1 cm", "🌱"),
    5: ("sesame seed", "0.2 cm", "🌱"),
    6: ("blueberry", "0.6 cm", "🫐"),
    7: ("blueberry", "1 cm", "🫐"),
    8: ("kidney bean", "1.6 cm", "🫘"),
    9: ("grape", "2.3 cm", "🍇"),
    10: ("kumquat", "3.1 cm", "🍊"),
    11: ("fig", "4.1 cm", "🍈"),
    12: ("lemon", "5.4 cm", "🍋"),
    13: ("peach", "7.4 cm", "🍑"),
    14: ("apple", "8.7 cm", "🍎"),
    15: ("apple", "10.1 cm", "🍎"),
    16: ("avocado", "11.6 cm", "🥑"),
    17: ("pear", "13 cm", "🍐"),
    18: ("sweet potato", "14.2 cm", "🍠"),
    19: ("mango", "15.3 cm", "🥭"),
    20: ("banana", "16.4 cm", "🍌"),
    21: ("carrot", "26.7 cm", "🥕"),
    22: ("papaya", "27.8 cm", "🍈"),
    23: ("grapefruit", "28.9 cm", "🍊"),
    24: ("corn", "30 cm", "🌽"),
    25: ("cauliflower", "34.6 cm", "🥦"),
    26: ("lettuce", "35.6 cm", "🥬"),
    27: ("cabbage", "36.6 cm", "🥬"),
    28: ("eggplant", "37.6 cm", "🍆"),
    29: ("butternut squash", "38.6 cm", "🎃"),
    30: ("cucumber", "39.9 cm", "🥒"),
    31: ("coconut", "41.1 cm", "🥥"),
    32: ("pineapple", "42.4 cm", "🍍"),
    33: ("pineapple", "43.7 cm", "🍍"),
    34: ("cantaloupe", "45 cm", "🍈"),
    35: ("honeydew melon", "46.2 cm", "🍈"),
    36: ("lettuce head", "47.4 cm", "🥬"),
    37: ("swiss chard", "48.6 cm", "🌿"),
    38: ("leek", "49.8 cm", "🌿"),
    39: ("watermelon", "50.7 cm", "🍉"),
    40: ("small pumpkin", "51.2 cm", "🎃"),
}

def get_baby_size(week: int) -> str:
    size = BABY_SIZE.get(week, ("little one", "growing", "👶"))
    return f"Your baby is the size of a {size[2]} {size[0]} — {size[1]} long!"

def calculate_pregnancy_info(lmp_date_str: str) -> dict:
    lmp = datetime.strptime(lmp_date_str, "%Y-%m-%d").date()
    today = date.today()
    days_pregnant = (today - lmp).days
    current_week = min(days_pregnant // 7, 42)
    edd = lmp + timedelta(days=280)
    days_remaining = (edd - today).days

    if current_week <= 12:
        trimester = 1
    elif current_week <= 26:
        trimester = 2
    else:
        trimester = 3

    return {
        "current_week": current_week,
        "trimester": trimester,
        "edd": edd.strftime("%d %B %Y"),
        "days_remaining": max(days_remaining, 0),
        "lmp": lmp_date_str,
        "baby_size": get_baby_size(current_week)
    }

def calendar_agent(lmp_date_str: str, language: str = "english") -> dict:
    info = calculate_pregnancy_info(lmp_date_str)
    week = info["current_week"]
    trimester = info["trimester"]
    edd = info["edd"]
    days_remaining = info["days_remaining"]
    baby_size = info["baby_size"]

    prompt = f"""
You are Mom2Be, a warm pregnancy companion for women in Karnataka.
This mother is currently in Week {week} of pregnancy (Trimester {trimester}).
Her Expected Delivery Date is {edd} — {days_remaining} days remaining.
Baby size this week: {baby_size}

Give her a warm, caring weekly update including:
1. 👶 Baby size this week — {baby_size} — mention this warmly
2. 💊 What medicines she must take this week
3. 🏥 Any ANC visit, injection or scan due this week or next 2 weeks
4. ⚠️ What symptoms to watch for at Week {week}
5. 💙 One warm encouraging line for her

Keep it short, warm, like an elder sister. Respond in {language} only.
"""
    message = ask(prompt)
    return {**info, "weekly_update": message}