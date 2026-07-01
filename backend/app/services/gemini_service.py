import os
import time

from google import genai


GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY not found.")

client = genai.Client(api_key=GOOGLE_API_KEY)


# Models will be tried in order
MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
]

def generate_finance_response(prompt: str):

    last_error = None

    for model in MODELS:

        for attempt in range(3):

            try:

                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                )

                return response.text

            except Exception as e:

                last_error = e

                print(f"{model}: {e}")

                if "503" in str(e) or "UNAVAILABLE" in str(e):
                    time.sleep(2)
                    continue

                break

    return (
        "⚠️ Gemini is currently busy. "
        "Please try again in a minute."
    )