import os
import logging
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException

logger = logging.getLogger(__name__)

# These are loaded from your existing load_dotenv() call in main.py
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN  = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_FROM = os.getenv("TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886")


def send_whatsapp(phone: str, message: str) -> bool:
    """
    Sends a WhatsApp message via Twilio Sandbox.

    Args:
        phone:   Mother's phone number, e.g. "+919876543210" or "919876543210"
        message: The text to send (supports emoji and multilingual text)

    Returns:
        True if sent successfully, False otherwise (never raises — safe to call in scheduler loops)
    """
    if not phone:
        logger.warning("send_whatsapp called with empty phone — skipping")
        return False

    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        logger.warning("Twilio credentials not set in .env — WhatsApp not sent")
        return False

    # Normalize phone number
    phone = phone.strip().replace(" ", "")
    if not phone.startswith("+"):
        phone = "+" + phone
    to = f"whatsapp:{phone}"

    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        msg = client.messages.create(
            from_=TWILIO_WHATSAPP_FROM,
            to=to,
            body=message,
        )
        logger.info(f"WhatsApp sent to {phone} | SID: {msg.sid}")
        return True
    except TwilioRestException as e:
        logger.error(f"Twilio error sending to {phone}: {e}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error sending WhatsApp to {phone}: {e}")
        return False
