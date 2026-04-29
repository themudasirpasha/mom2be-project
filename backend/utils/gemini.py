import vertexai
from vertexai.generative_models import GenerativeModel, Part
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
        clean_prompt = prompt + "\n\nIMPORTANT: Do NOT use markdown formatting. No **, no ##, no *, no ---, no bullet points with *. Use plain sentences and emojis instead. Keep response warm, short and friendly."
        response = model.generate_content(clean_prompt)
        text = response.text
        # Clean any remaining markdown
        import re
        text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # Remove **bold**
        text = re.sub(r'\*(.*?)\*', r'\1', text)       # Remove *italic*
        text = re.sub(r'#{1,6}\s', '', text)            # Remove ### headings
        text = re.sub(r'---+', '', text)                # Remove ---
        return text.strip()
    except Exception as e:
        return f"Sorry, I could not process your request right now. ({str(e)})"
        
def ask_with_image(prompt: str, image_bytes: bytes, mime_type: str = "image/jpeg") -> str:
    try:
        image_part = Part.from_data(data=image_bytes, mime_type=mime_type)
        response = model.generate_content([prompt, image_part])
        return response.text
    except Exception as e:
        return f"Sorry, I could not read the report right now. ({str(e)})"
