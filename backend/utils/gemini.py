import vertexai
from vertexai.generative_models import GenerativeModel
import os
from dotenv import load_dotenv

load_dotenv()

vertexai.init(
    project=os.getenv("GCP_PROJECT_ID", "ameer-491011"),
    location="us-central1"
)

model = GenerativeModel("gemini-2.5-flash")

def ask(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Sorry, I could not process your request right now. ({str(e)})"