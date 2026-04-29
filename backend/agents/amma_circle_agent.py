from utils.gemini import ask
from utils.database import db
from firebase_admin import firestore

def post_community_message(session_id: str, message: str, trimester: str, taluk: str, language: str = "english"):
    try:
        doc_ref = db.collection("amma_circle_chat").add({
            "session_id": session_id,
            "message": message,
            "trimester": trimester,
            "taluk": taluk,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "language": language,
            "sender": "mama"
        })

        keywords = ["pain", "help", "scared", "bleeding", "fever",
                    "headache", "swelling", "dard", "darr",
                    "ನೋವು", "ಸಹಾಯ", "दर्द", "डर"]

        needs_ai = any(word in message.lower() for word in keywords)

        if needs_ai:
            prompt = f"""
You are Mom2Be in an Amma Circle group chat.
A mama in {trimester} trimester from {taluk} said:
"{message}"
Respond briefly as Mom2Be — warm helpful advice.
Sign as "Mom2Be 💙"
Respond in {language} only.
"""
            ai_response = ask(prompt)
            db.collection("amma_circle_chat").add({
                "session_id": "mom2be_ai",
                "message": ai_response,
                "trimester": trimester,
                "taluk": taluk,
                "timestamp": firestore.SERVER_TIMESTAMP,
                "language": language,
                "sender": "Mom2Be 💙"
            })

        return {
            "status": "posted",
            "message_id": doc_ref[1].id,
            "mom2be_responded": needs_ai
        }
    except Exception as e:
        return {"error": str(e)}
        
        

def get_community_messages(trimester: str = None, taluk: str = None, limit: int = 20):
    """
    Fetch community messages filtered by trimester and/or taluk
    """
    try:
        query = db.collection("amma_circle_chat")
        
        # Apply filters if provided
        if trimester:
            query = query.where("trimester", "==", trimester)
        if taluk:
            query = query.where("taluk", "==", taluk)
        
        # Get last 20 messages, newest first
        messages = query.order_by("timestamp", direction=firestore.Query.DESCENDING)\
                        .limit(limit)\
                        .stream()
        
        result = []
        for msg in messages:
            data = msg.to_dict()
            result.append({
                "message_id": msg.id,
                "trimester": data.get("trimester", "T1"),
                "taluk": data.get("taluk", "Unknown"),
                "message": data.get("message", ""),
                "timestamp": data.get("timestamp"),
                "language": data.get("language", "english")
            })
        
        return {"messages": result, "count": len(result)}
    except Exception as e:
        return {"error": str(e), "messages": []}


def post_baby_name(session_id: str, baby_name: str, language: str = "english"):
    """
    Post baby name suggestion to community voting
    """
    try:
        # Save to Firestore
        doc_ref = db.collection("amma_circle_names").add({
            "session_id": session_id,
            "baby_name": baby_name,
            "vote_count": 0,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "language": language
        })
        
        # Generate funny AI reaction
        prompt = f"""
You are Mom2Be. A mother just suggested the baby name "{baby_name}" in Amma Circle.

Respond in {language} with a funny, warm reaction. Examples:
- "Husband said no to Zayan? His loss! Let the ammas decide!"
- "Aarav? Beta, there are 12 Aaravs in every classroom already! But still cute 💕"
- "Lakshmi? Classic! Never goes out of style!"

Keep it playful, supportive, and brief.
"""
        response = ask(prompt)
        return {
            "status": "posted",
            "name_id": doc_ref[1].id,
            "baby_name": baby_name,
            "ai_reaction": response
        }
    except Exception as e:
        return {"error": str(e)}


def vote_for_name(name_id: str, voter_session_id: str):
    """
    Vote for a baby name suggestion
    """
    try:
        # Check if already voted (optional - prevents double voting)
        vote_check = db.collection("amma_circle_votes")\
                       .where("name_id", "==", name_id)\
                       .where("voter_session_id", "==", voter_session_id)\
                       .limit(1)\
                       .stream()
        
        if len(list(vote_check)) > 0:
            return {"status": "already_voted", "message": "You already voted for this name!"}
        
        # Record the vote
        db.collection("amma_circle_votes").add({
            "name_id": name_id,
            "voter_session_id": voter_session_id,
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        
        # Increment vote count
        name_ref = db.collection("amma_circle_names").document(name_id)
        name_ref.update({
            "vote_count": firestore.Increment(1)
        })
        
        # Get updated count
        name_doc = name_ref.get()
        if name_doc.exists:
            data = name_doc.to_dict()
            baby_name = data.get("baby_name", "this name")
            vote_count = data.get("vote_count", 1)
            
            return {
                "status": "voted",
                "baby_name": baby_name,
                "vote_count": vote_count,
                "message": f"{baby_name} is winning with {vote_count} votes! 🎉"
            }
        
        return {"status": "voted"}
    except Exception as e:
        return {"error": str(e)}


def post_prayer_wall(session_id: str, week: int, language: str = "english"):
    """
    Post to prayer wall (only Week 36+)
    """
    try:
        if week < 36:
            return {
                "status": "blocked",
                "message": f"Prayer Wall opens at Week 36. You're at Week {week}. Soon, amma! 🙏"
            }
        
        # Get mother's trimester for context
        mother_doc = db.collection("mothers").document(session_id).get()
        mother_name = "Amma"
        if mother_doc.exists:
            mother_name = mother_doc.to_dict().get("mother_name", "Amma")
        
        # Save to prayer wall
        doc_ref = db.collection("amma_circle_prayers").add({
            "session_id": session_id,
            "week": week,
            "prayer_count": 0,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "language": language
        })
        
        # Generate warm prayer message
        prompt = f"""
You are Mom2Be. {mother_name} is at Week {week} and just posted to the Prayer Wall.
Thousands of mothers across Karnataka will send prayers.

Write a warm, emotional prayer message in {language}. Include:
- Acknowledgment of her journey
- Strength for delivery
- Blessing for safe birth

Keep it brief but deeply moving.
"""
        response = ask(prompt)
        return {
            "status": "posted",
            "prayer_id": doc_ref[1].id,
            "ai_prayer": response
        }
    except Exception as e:
        return {"error": str(e)}


def react_to_prayer(prayer_id: str, reactor_session_id: str, language: str = "english"):
    """
    Send prayer reaction to another mother's prayer wall post
    """
    try:
        # Record the prayer reaction
        db.collection("amma_circle_prayer_reactions").add({
            "prayer_id": prayer_id,
            "reactor_session_id": reactor_session_id,
            "timestamp": firestore.SERVER_TIMESTAMP
        })
        
        # Increment prayer count
        prayer_ref = db.collection("amma_circle_prayers").document(prayer_id)
        prayer_ref.update({
            "prayer_count": firestore.Increment(1)
        })
        
        # Get updated count
        prayer_doc = prayer_ref.get()
        if prayer_doc.exists:
            prayer_count = prayer_doc.to_dict().get("prayer_count", 1)
            
            return {
                "status": "prayed",
                "prayer_count": prayer_count,
                "message": f"{prayer_count} mothers are praying for her safe delivery 🙏"
            }
        
        return {"status": "prayed"}
    except Exception as e:
        return {"error": str(e)}


def post_birth_announcement(session_id: str, baby_gender: str = "", language: str = "english"):
    """
    Post birth announcement to celebration wall
    """
    try:
        # Get mother profile
        mother_doc = db.collection("mothers").document(session_id).get()
        mother_data = mother_doc.to_dict() if mother_doc.exists else {}
        mother_name = mother_data.get("mother_name", "Amma")
        
        # Save announcement
        doc_ref = db.collection("amma_circle_announcements").add({
            "session_id": session_id,
            "baby_gender": baby_gender,
            "celebration_count": 0,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "language": language
        })
        
        # Generate emotional celebration message
        prompt = f"""
You are Mom2Be. {mother_name} just gave birth and posted her announcement to Amma Circle.

Write a powerful, emotional celebration message in {language}. Include:
- "9 months ago you were scared. Today you are a MOTHER!"
- Acknowledge her strength and journey
- Welcome to motherhood
- Celebrate with the whole Karnataka Amma community

Make it deeply moving and empowering. Brief but unforgettable.
"""
        response = ask(prompt)
        return {
            "status": "announced",
            "announcement_id": doc_ref[1].id,
            "ai_celebration": response
        }
    except Exception as e:
        return {"error": str(e)}


def get_celebration_wall(limit: int = 20):
    """
    Get recent birth announcements from celebration wall
    """
    try:
        announcements = db.collection("amma_circle_announcements")\
                          .order_by("timestamp", direction=firestore.Query.DESCENDING)\
                          .limit(limit)\
                          .stream()
        
        result = []
        for announcement in announcements:
            data = announcement.to_dict()
            result.append({
                "announcement_id": announcement.id,
                "baby_gender": data.get("baby_gender", ""),
                "celebration_count": data.get("celebration_count", 0),
                "timestamp": data.get("timestamp"),
                "language": data.get("language", "english")
            })
        
        return {"announcements": result, "count": len(result)}
    except Exception as e:
        return {"error": str(e), "announcements": []}


def get_top_baby_names(limit: int = 10):
    """
    Get top voted baby names
    """
    try:
        names = db.collection("amma_circle_names")\
                  .order_by("vote_count", direction=firestore.Query.DESCENDING)\
                  .limit(limit)\
                  .stream()
        
        result = []
        for name in names:
            data = name.to_dict()
            result.append({
                "name_id": name.id,
                "baby_name": data.get("baby_name", ""),
                "vote_count": data.get("vote_count", 0),
                "timestamp": data.get("timestamp")
            })
        
        return {"names": result, "count": len(result)}
    except Exception as e:
        return {"error": str(e), "names": []}