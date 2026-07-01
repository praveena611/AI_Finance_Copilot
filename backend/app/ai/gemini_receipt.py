import json
import time

from PIL import Image
from google import genai

from app.config import GOOGLE_API_KEY
from app.ai.prompts.receipt_prompt import RECEIPT_PROMPT


client = genai.Client(api_key=GOOGLE_API_KEY)

# Stable models (tries in order)
MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
]


def analyze_receipt(image_path: str):
    image = Image.open(image_path)

    last_error = None

    for model_name in MODELS:

        for attempt in range(3):

            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=[
                        RECEIPT_PROMPT,
                        image,
                    ],
                )

                text = response.text.strip()

                if text.startswith("```"):
                    text = (
                        text.replace("```json", "")
                        .replace("```", "")
                        .strip()
                    )

                return json.loads(text)

            except Exception as e:
                last_error = e

                print(
                    f"[Gemini] {model_name} | Attempt {attempt + 1}/3 failed:"
                )
                print(e)

                time.sleep(2)

        print(f"Switching to fallback model...")

    raise Exception(
        f"Gemini failed after trying all models.\n{last_error}"
    )