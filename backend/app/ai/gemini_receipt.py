import json
from PIL import Image
from google import genai

from app.config import GOOGLE_API_KEY
from app.ai.prompts.receipt_prompt import RECEIPT_PROMPT

client = genai.Client(api_key=GOOGLE_API_KEY)


def analyze_receipt(image_path: str):
    image = Image.open(image_path)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            RECEIPT_PROMPT,
            image
        ]
    )

    text = response.text.strip()

    # Remove markdown if Gemini returns it
    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)