# -*- coding: utf-8 -*-
from utils.gemini import ask
from agents.calendar_agent import calculate_pregnancy_info, get_baby_size, BABY_SIZE

# ===== WEEKLY ASSIGNMENTS =====
# From Mom2Be concept PDF - exact assignments per week

WEEKLY_ASSIGNMENTS = {
    # Trimester 1
    4:  {
        "en": "Write a letter to your baby today. Tell them how excited you are!",
        "kn": "ಇಂದು ನಿಮ್ಮ ಮಗುವಿಗೆ ಒಂದು ಪತ್ರ ಬರೆಯಿರಿ. ನಿಮಗೆ ಎಷ್ಟು ಸಂತೋಷವಾಗಿದೆ ಎಂದು ಹೇಳಿ!",
        "hi": "आज अपने बच्चे को एक पत्र लिखें। उन्हें बताएं कि आप कितनी उत्साहित हैं!",
        "ur": "آج اپنے بچے کو ایک خط لکھیں۔ انہیں بتائیں کہ آپ کتنی پرجوش ہیں!",
        "emoji": "✉️"
    },
    6:  {
        "en": "Take a 10-minute walk today. Baby loves the movement!",
        "kn": "ಇಂದು 10 ನಿಮಿಷ ನಡೆಯಿರಿ. ಮಗುವಿಗೆ ಚಲನೆ ಇಷ್ಟ!",
        "hi": "आज 10 मिनट की सैर करें। बच्चे को हलचल बहुत पसंद है!",
        "ur": "آج 10 منٹ کی سیر کریں۔ بچے کو حرکت بہت پسند ہے!",
        "emoji": "🚶‍♀️"
    },
    8:  {
        "en": "Cook your favourite childhood dish. Share it with your husband!",
        "kn": "ನಿಮ್ಮ ನೆಚ್ಚಿನ ಬಾಲ್ಯದ ಅಡುಗೆ ಮಾಡಿ. ನಿಮ್ಮ ಗಂಡನೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ!",
        "hi": "अपना पसंदीदा बचपन का खाना बनाएं। अपने पति के साथ बाँटें!",
        "ur": "اپنا پسندیدہ بچپن کا کھانا پکائیں۔ اپنے شوہر کے ساتھ شیئر کریں!",
        "emoji": "🍳"
    },
    10: {
        "en": "Pick one baby name today and tell your husband. Just for fun — and watch his reaction!",
        "kn": "ಇಂದು ಒಂದು ಮಗುವಿನ ಹೆಸರು ಆರಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಗಂಡನಿಗೆ ಹೇಳಿ. ಅವರ ಪ್ರತಿಕ್ರಿಯೆ ನೋಡಿ!",
        "hi": "आज एक बच्चे का नाम चुनें और अपने पति को बताएं। बस मज़े के लिए — उनकी प्रतिक्रिया देखें!",
        "ur": "آج ایک بچے کا نام چنیں اور اپنے شوہر کو بتائیں۔ بس مزے کے لیے — ان کا ردعمل دیکھیں!",
        "emoji": "👶"
    },
    12: {
        "en": "Your first trimester is almost done! Take a bump photo today — your first memory!",
        "kn": "ನಿಮ್ಮ ಮೊದಲ ತ್ರೈಮಾಸಿಕ ಮುಗಿಯುತ್ತಿದೆ! ಇಂದು ಒಂದು ಬಂಪ್ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ!",
        "hi": "आपका पहला तिमाही लगभग पूरा हो गया! आज एक बंप फोटो लें — आपकी पहली यादगार!",
        "ur": "آپ کی پہلی سہ ماہی تقریباً مکمل ہو گئی! آج ایک بمپ فوٹو لیں — آپ کی پہلی یاد!",
        "emoji": "📸"
    },
    # Trimester 2
    14: {
        "en": "Play your favourite song and dance slowly with your husband!",
        "kn": "ನಿಮ್ಮ ನೆಚ್ಚಿನ ಹಾಡು ಹಾಕಿ ನಿಮ್ಮ ಗಂಡನೊಂದಿಗೆ ನಿಧಾನವಾಗಿ ನೃತ್ಯ ಮಾಡಿ!",
        "hi": "अपना पसंदीदा गाना बजाएं और अपने पति के साथ धीरे-धीरे नाचें!",
        "ur": "اپنا پسندیدہ گانا بجائیں اور اپنے شوہر کے ساتھ آہستہ آہستہ ناچیں!",
        "emoji": "💃"
    },
    16: {
        "en": "Take your first couple photo for the memory album today!",
        "kn": "ಇಂದು ನೆನಪಿನ ಆಲ್ಬಮ್‌ಗಾಗಿ ನಿಮ್ಮ ಮೊದಲ ಜೋಡಿ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ!",
        "hi": "आज मेमोरी एल्बम के लिए अपनी पहली कपल फोटो लें!",
        "ur": "آج میموری البم کے لیے اپنی پہلی کپل فوٹو لیں!",
        "emoji": "👫"
    },
    20: {
        "en": "Read a story out loud to your bump — baby can hear you now!",
        "kn": "ನಿಮ್ಮ ಬಂಪ್‌ಗೆ ಜೋರಾಗಿ ಒಂದು ಕಥೆ ಓದಿ — ಮಗು ಈಗ ಕೇಳಬಲ್ಲದು!",
        "hi": "अपने बंप को ज़ोर से एक कहानी पढ़ें — बच्चा अब सुन सकता है!",
        "ur": "اپنے بمپ کو زور سے ایک کہانی پڑھیں — بچہ اب سن سکتا ہے!",
        "emoji": "📖"
    },
    22: {
        "en": "Write down 3 things you are grateful for this week.",
        "kn": "ಈ ವಾರ ನೀವು ಕೃತಜ್ಞರಾಗಿರುವ 3 ವಿಷಯಗಳನ್ನು ಬರೆಯಿರಿ.",
        "hi": "इस हफ्ते जिन 3 चीज़ों के लिए आप आभारी हैं, उन्हें लिखें।",
        "ur": "اس ہفتے جن 3 چیزوں کے لیے آپ شکرگزار ہیں انہیں لکھیں۔",
        "emoji": "🙏"
    },
    24: {
        "en": "Sing a lullaby to your baby bump today. Baby recognises your voice!",
        "kn": "ಇಂದು ನಿಮ್ಮ ಬಂಪ್‌ಗೆ ಲಾಲಿ ಹಾಡಿ. ಮಗು ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಗುರುತಿಸುತ್ತದೆ!",
        "hi": "आज अपने बेबी बंप को एक लोरी गाएं। बच्चा आपकी आवाज़ पहचानता है!",
        "ur": "آج اپنے بیبی بمپ کو لوری سنائیں۔ بچہ آپ کی آواز پہچانتا ہے!",
        "emoji": "🎵"
    },
    26: {
        "en": "Take a photo of your baby's first things — the tiny clothes, booties, toys!",
        "kn": "ಮಗುವಿನ ಮೊದಲ ವಸ್ತುಗಳ ಫೋಟೋ ತೆಗೆಯಿರಿ — ಪುಟ್ಟ ಬಟ್ಟೆ, ಶೂಗಳು, ಆಟಿಕೆಗಳು!",
        "hi": "बच्चे की पहली चीज़ों की फोटो लें — छोटे कपड़े, बूटी, खिलौने!",
        "ur": "بچے کی پہلی چیزوں کی فوٹو لیں — چھوٹے کپڑے، بوٹیاں، کھلونے!",
        "emoji": "👗"
    },
    # Trimester 3
    28: {
        "en": "Pack your hospital bag this week — here is your checklist! ID, clothes, medicines, snacks.",
        "kn": "ಈ ವಾರ ನಿಮ್ಮ ಆಸ್ಪತ್ರೆ ಚೀಲ ಪ್ಯಾಕ್ ಮಾಡಿ — ID, ಬಟ್ಟೆ, ಔಷಧಿ, ತಿಂಡಿ.",
        "hi": "इस हफ्ते अपना अस्पताल बैग पैक करें — ID, कपड़े, दवाइयाँ, स्नैक्स।",
        "ur": "اس ہفتے اپنا ہسپتال بیگ پیک کریں — ID، کپڑے، دوائیں، اسنیکس۔",
        "emoji": "🎒"
    },
    32: {
        "en": "Have a date night with your husband — your last before baby arrives!",
        "kn": "ನಿಮ್ಮ ಗಂಡನೊಂದಿಗೆ ಡೇಟ್ ನೈಟ್ ಮಾಡಿ — ಮಗು ಬರುವ ಮೊದಲು ಕೊನೆಯದು!",
        "hi": "अपने पति के साथ एक डेट नाइट करें — बच्चे के आने से पहले आखिरी!",
        "ur": "اپنے شوہر کے ساتھ ڈیٹ نائٹ کریں — بچے کے آنے سے پہلے آخری!",
        "emoji": "🌙"
    },
    35: {
        "en": "Write a letter to yourself as a new mother. Open it in 1 year.",
        "kn": "ಹೊಸ ತಾಯಿಯಾಗಿ ನಿಮಗೆ ಒಂದು ಪತ್ರ ಬರೆಯಿರಿ. 1 ವರ್ಷದ ನಂತರ ತೆರೆಯಿರಿ.",
        "hi": "एक नई माँ के रूप में खुद को एक पत्र लिखें। 1 साल बाद खोलें।",
        "ur": "ایک نئی ماں کے طور پر خود کو ایک خط لکھیں۔ 1 سال بعد کھولیں۔",
        "emoji": "💌"
    },
    38: {
        "en": "Rest today. You are almost there Amma. We are so proud of you!",
        "kn": "ಇಂದು ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಿ. ನೀವು ತಲುಪುತ್ತಿದ್ದೀರಿ ಅಮ್ಮ. ನಮಗೆ ನಿಮ್ಮ ಬಗ್ಗೆ ತುಂಬಾ ಹೆಮ್ಮೆ!",
        "hi": "आज आराम करें। आप लगभग वहाँ पहुँच गई हैं अम्मा। हमें आप पर बहुत गर्व है!",
        "ur": "آج آرام کریں۔ آپ قریب ہیں امّا۔ ہمیں آپ پر بہت فخر ہے!",
        "emoji": "💜"
    },
}

# ===== FUNNY PREGNANCY JOKES =====

JOKES = {
    "english": [
        "Pregnancy brain is real — I put the phone in the fridge and looked for it for 20 minutes! 😂",
        "My husband asked what I want for dinner. I cried. Then laughed. Then cried again. Hormones! 😅",
        "I can smell my neighbour's cooking from 3 floors away. My superpower is activated! 🦸‍♀️",
        "Baby is the size of a mango but my bladder thinks it's the size of a watermelon! 🍉",
        "Sleep position options: left side, left side, or left side. The glamorous life! 😴",
    ],
    "kannada": [
        "ಗರ್ಭಿಣಿ ಮೆದುಳು ನಿಜ — ನಾನು ಫೋನ್ ಫ್ರಿಜ್‌ನಲ್ಲಿ ಇಟ್ಟು 20 ನಿಮಿಷ ಹುಡುಕಿದೆ! 😂",
        "ನನ್ನ ಗಂಡ ರಾತ್ರಿ ಊಟಕ್ಕೆ ಏನು ಬೇಕು ಎಂದು ಕೇಳಿದರು. ನಾನು ಅತ್ತೆ. ನಂತರ ನಕ್ಕೆ. ಹಾರ್ಮೋನ್ಸ್! 😅",
        "ಮೂರು ಮಹಡಿ ದೂರದಿಂದ ಅಕ್ಕಪಕ್ಕದ ಮನೆಯ ಅಡುಗೆ ವಾಸನೆ ಗೊತ್ತಾಗುತ್ತೆ. ನನ್ನ ಸೂಪರ್‌ಪವರ್! 🦸‍♀️",
        "ಮಗು ಮಾವಿನ ಗಾತ್ರದ್ದು ಆದರೆ ನನ್ನ ಮೂತ್ರಕೋಶಕ್ಕೆ ಕಲ್ಲಂಗಡಿ ಅನ್ನಿಸ್ತಿದೆ! 🍉",
        "ಮಲಗುವ ಆಯ್ಕೆಗಳು: ಎಡಭಾಗ, ಎಡಭಾಗ, ಅಥವಾ ಎಡಭಾಗ. ಗ್ಲಾಮರಸ್ ಜೀವನ! 😴",
    ],
    "hindi": [
        "प्रेगनेंसी ब्रेन सच में होता है — मैंने फोन फ्रिज में रखा और 20 मिनट ढूंढती रही! 😂",
        "पति ने पूछा रात को क्या खाओगी। मैं रो पड़ी। फिर हँसी। फिर रोई। हार्मोन्स! 😅",
        "तीन मंज़िल दूर पड़ोसी के खाने की खुशबू आती है। मेरी सुपरपावर जाग गई! 🦸‍♀️",
        "बच्चा आम के साइज़ का है लेकिन मेरे ब्लैडर को लगता है वो तरबूज़ है! 🍉",
        "सोने की पोज़िशन: बायीं तरफ, बायीं तरफ, या बायीं तरफ। ग्लैमरस ज़िंदगी! 😴",
    ],
    "urdu": [
        "پریگنینسی برین سچ میں ہوتا ہے — میں نے فون فریج میں رکھا اور 20 منٹ ڈھونڈتی رہی! 😂",
        "شوہر نے پوچھا رات کو کیا کھاؤ گی۔ میں رو پڑی۔ پھر ہنسی۔ پھر رو پڑی۔ ہارمونز! 😅",
        "تین منزل دور پڑوسی کے کھانے کی خوشبو آتی ہے۔ میری سپرپاور جاگ گئی! 🦸‍♀️",
        "بچہ آم کے سائز کا ہے لیکن میرے بلیڈر کو لگتا ہے وہ تربوز ہے! 🍉",
        "سونے کی پوزیشن: بائیں طرف، بائیں طرف، یا بائیں طرف۔ گلیمرس زندگی! 😴",
    ],
}

# ===== COUNTDOWN MESSAGES (Week 36+) =====

COUNTDOWN_MESSAGES = {
    "english": {
        36: "4 weeks to go! Your baby is fully formed and just getting chubbier — just like you deserve to be! We are praying for your normal delivery every single day. 🙏",
        37: "3 weeks! Your baby has fingernails, hair, and is practicing breathing. And you — you have done EVERYTHING right. We are so proud of you Amma. 💜",
        38: "2 weeks! The whole Mom2Be family is thinking of you today. Your hospital bag is packed, your heart is ready, and we are right here with you. 💜",
        39: "1 week! We are praying for your safe and normal delivery. You are not alone. We are with you every breath of the way. 🙏",
        40: "Today could be the day Amma! Every single mama in Mom2Be is sending you love and prayers right now. Go bring your baby home. We will be waiting to celebrate with you! 💜🎉",
    },
    "kannada": {
        36: "4 ವಾರ ಉಳಿದಿದೆ! ನಿಮ್ಮ ಮಗು ಸಂಪೂರ್ಣ ರೂಪುಗೊಂಡಿದೆ. ನಿಮ್ಮ ಸಹಜ ಹೆರಿಗೆಗಾಗಿ ಪ್ರತಿದಿನ ಪ್ರಾರ್ಥಿಸುತ್ತೇವೆ. 🙏",
        37: "3 ವಾರ! ನಿಮ್ಮ ಮಗುವಿಗೆ ಉಗುರು, ಕೂದಲು ಇದೆ. ನೀವು ಎಲ್ಲವನ್ನೂ ಸರಿಯಾಗಿ ಮಾಡಿದ್ದೀರಿ. ನಮಗೆ ನಿಮ್ಮ ಬಗ್ಗೆ ಹೆಮ್ಮೆ! 💜",
        38: "2 ವಾರ! ಇಡೀ Mom2Be ಕುಟುಂಬ ಇಂದು ನಿಮ್ಮ ಬಗ್ಗೆ ಯೋಚಿಸುತ್ತಿದೆ. ನಾವು ನಿಮ್ಮೊಂದಿಗಿದ್ದೇವೆ. 💜",
        39: "1 ವಾರ! ನಿಮ್ಮ ಸುರಕ್ಷಿತ ಹೆರಿಗೆಗಾಗಿ ಪ್ರಾರ್ಥಿಸುತ್ತೇವೆ. ನೀವು ಒಂಟಿಯಲ್ಲ. 🙏",
        40: "ಇಂದು ಆ ದಿನ ಇರಬಹುದು ಅಮ್ಮ! ಎಲ್ಲ Mom2Be ತಾಯಂದಿರು ನಿಮಗೆ ಪ್ರೀತಿ ಕಳಿಸುತ್ತಿದ್ದಾರೆ. 💜🎉",
    },
    "hindi": {
        36: "4 हफ्ते बाकी! आपका बच्चा पूरी तरह बन गया है। हम हर रोज़ आपकी नॉर्मल डिलीवरी के लिए दुआ करते हैं। 🙏",
        37: "3 हफ्ते! आपके बच्चे के नाखून, बाल हैं। आपने सब कुछ सही किया। हमें आप पर बहुत गर्व है। 💜",
        38: "2 हफ्ते! पूरा Mom2Be परिवार आज आपके बारे में सोच रहा है। हम आपके साथ हैं। 💜",
        39: "1 हफ्ता! हम आपकी सुरक्षित डिलीवरी के लिए दुआ करते हैं। आप अकेली नहीं हैं। 🙏",
        40: "आज वो दिन हो सकता है अम्मा! सभी Mom2Be माँएं आपको प्यार और दुआएं भेज रही हैं। 💜🎉",
    },
    "urdu": {
        36: "4 ہفتے باقی! آپ کا بچہ مکمل بن گیا ہے۔ ہم ہر روز آپ کی نارمل ڈلیوری کے لیے دعا کرتے ہیں۔ 🙏",
        37: "3 ہفتے! آپ کے بچے کے ناخن، بال ہیں۔ آپ نے سب کچھ صحیح کیا۔ ہمیں آپ پر فخر ہے۔ 💜",
        38: "2 ہفتے! پورا Mom2Be خاندان آج آپ کے بارے میں سوچ رہا ہے۔ ہم آپ کے ساتھ ہیں۔ 💜",
        39: "1 ہفتہ! ہم آپ کی محفوظ ڈلیوری کے لیے دعا کرتے ہیں۔ آپ اکیلی نہیں ہیں۔ 🙏",
        40: "آج وہ دن ہو سکتا ہے امّا! تمام Mom2Be مائیں آپ کو محبت اور دعائیں بھیج رہی ہیں۔ 💜🎉",
    },
}

# ===== LANG KEY HELPER =====

def _lang_key(language: str) -> str:
    mapping = {
        "kannada": "kn",
        "hindi": "hi",
        "urdu": "ur",
        "english": "en",
    }
    return mapping.get(language.lower(), "en")


def _joke_of_the_day(week: int, language: str) -> str:
    lang = language.lower() if language.lower() in JOKES else "english"
    jokes = JOKES[lang]
    return jokes[week % len(jokes)]


# ===== MAIN FUNCTIONS =====

def get_daily_joy(week: int, language: str, mother_name: str) -> dict:
    """
    Returns baby size update + motivational message + joke.
    Uses Gemini for the warm motivational message only.
    """
    lang = language.lower()

    # Baby size from existing BABY_SIZE dict
    size_data = BABY_SIZE.get(week, ("little one", "growing", "👶"))
    baby_fruit = size_data[0]
    baby_size_cm = size_data[1]
    baby_emoji = size_data[2]

    # Gemini prompt for warm daily message
    prompt = f"""
You are Mom2Be, a warm pregnancy companion.
Mother name: {mother_name}
Pregnancy week: {week}
Baby size this week: {baby_emoji} {baby_fruit} — {baby_size_cm}

Write a warm, joyful, 3-line morning message for her.
Line 1: About her baby size this week — warm and fun
Line 2: One encouraging line about how amazing she is
Line 3: One thing to look forward to today

Keep it short, emotional, like a caring elder sister.
Respond in {lang} only. No headers, just 3 warm lines.
"""
    daily_message = ask(prompt)
    joke = _joke_of_the_day(week, lang)

    return {
        "baby_emoji": baby_emoji,
        "baby_fruit": baby_fruit,
        "baby_size_cm": baby_size_cm,
        "daily_message": daily_message,
        "joke": joke,
    }


def get_weekly_assignment(week: int, language: str, mother_name: str) -> dict:
    """
    Returns this week's mini assignment.
    Uses hardcoded assignments from PDF + Gemini for nearby weeks.
    """
    lang_key = _lang_key(language)

    # Find closest assignment week
    assignment_weeks = sorted(WEEKLY_ASSIGNMENTS.keys())
    closest_week = min(assignment_weeks, key=lambda w: abs(w - week))
    assignment_data = WEEKLY_ASSIGNMENTS[closest_week]

    task = assignment_data.get(lang_key, assignment_data["en"])
    emoji = assignment_data["emoji"]

    return {
        "assignment_week": closest_week,
        "task": task,
        "emoji": emoji,
    }


def get_countdown(week: int, days_remaining: int, language: str, mother_name: str) -> dict:
    """
    Returns countdown message for week 36+ mothers.
    Before week 36 returns a general encouragement.
    """
    lang = language.lower() if language.lower() in COUNTDOWN_MESSAGES else "english"

    if week >= 36:
        # Use exact countdown messages from PDF
        countdown_week = min(week, 40)
        message = COUNTDOWN_MESSAGES[lang].get(
            countdown_week,
            COUNTDOWN_MESSAGES[lang][40]
        )
        is_countdown = True
    else:
        # General encouragement before week 36
        weeks_to_go = 40 - week
        encouragements = {
            "english": f"{weeks_to_go} weeks to go! You are doing amazing Amma. Every day you are getting closer to meeting your baby! 💜",
            "kannada": f"{weeks_to_go} ವಾರ ಉಳಿದಿದೆ! ನೀವು ಅದ್ಭುತವಾಗಿ ಮಾಡುತ್ತಿದ್ದೀರಿ ಅಮ್ಮ. ಪ್ರತಿದಿನ ನಿಮ್ಮ ಮಗುವನ್ನು ನೋಡುವ ಕ್ಷಣ ಹತ್ತಿರ ಬರುತ್ತಿದೆ! 💜",
            "hindi": f"{weeks_to_go} हफ्ते बाकी! आप बहुत अच्छा कर रही हैं अम्मा। हर दिन आप अपने बच्चे से मिलने के करीब हो रही हैं! 💜",
            "urdu": f"{weeks_to_go} ہفتے باقی! آپ بہت اچھا کر رہی ہیں امّا۔ ہر دن آپ اپنے بچے سے ملنے کے قریب ہو رہی ہیں! 💜",
        }
        message = encouragements.get(lang, encouragements["english"])
        is_countdown = False

    return {
        "is_countdown": is_countdown,
        "days_remaining": days_remaining,
        "message": message,
    }


def joy_agent(session_id: str, mother_data: dict) -> dict:
    """
    Main Joy Agent — returns complete Joy Corner data in one call.
    Called by GET /joy/{session_id}
    """
    language = mother_data.get("language", "english")
    mother_name = mother_data.get("mother_name", "Amma")
    lmp = mother_data.get("lmp_date")

    # Calculate week
    week = 20  # default
    days_remaining = 140
    if lmp:
        try:
            info = calculate_pregnancy_info(lmp)
            week = info["current_week"]
            days_remaining = info["days_remaining"]
        except:
            pass

    # Get all 3 parts
    daily = get_daily_joy(week, language, mother_name)
    assignment = get_weekly_assignment(week, language, mother_name)
    countdown = get_countdown(week, days_remaining, language, mother_name)

    return {
        "week": week,
        "days_remaining": days_remaining,
        "daily": daily,
        "assignment": assignment,
        "countdown": countdown,
    }
