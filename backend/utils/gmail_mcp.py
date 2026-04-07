from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import base64
import os
import logging

logger = logging.getLogger(__name__)

SCOPES = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/gmail.send'
]

def get_gmail_service():
    creds = None
    token_path = '/app/token.json'
    
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    
    service = build('gmail', 'v1', credentials=creds)
    return service

def send_welcome_email(mother_name: str, email: str) -> bool:
    try:
        service = get_gmail_service()

        message = MIMEMultipart('alternative')
        message['Subject'] = "You're In, Amma! 💙"
        message['From'] = 'thepashas786@gmail.com'
        message['To'] = email

        html = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
            <div style="max-width: 500px; margin: auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <h1 style="color: #e91e8c; text-align: center;">Mom2Be 💙</h1>
                <h2 style="color: #333; text-align: center;">You're In, Amma!</h2>
                <p style="color: #555; font-size: 16px;">Dear <strong>{mother_name}</strong>,</p>
                <p style="color: #555; font-size: 16px;">Your Mom2Be registration is complete! 💙</p>
                <p style="color: #555; font-size: 16px;">We're with you every step of this beautiful journey — medicines, appointments, reminders — everything taken care of.</p>
                <p style="color: #555; font-size: 16px;">Welcome to the family, Amma. 🌸</p>
                <br>
                <p style="color: #e91e8c; font-size: 14px; text-align: center;"><em>"Amma Jothe, Prathi Hejje" — With Mother, Every Step</em></p>
                <p style="color: #999; font-size: 13px; text-align: center;">Mom2Be Family 💙</p>
            </div>
        </body>
        </html>
        """

        part = MIMEText(html, 'html')
        message.attach(part)

        raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
        service.users().messages().send(userId='me', body={'raw': raw}).execute()
        logger.info(f"Welcome email sent to {email}")
        return True

    except Exception as e:
        logger.error(f"Gmail MCP error: {e}")
        return False