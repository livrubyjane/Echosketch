import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
try:
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    result = client.models.generate_images(
        model='imagen-3.0-generate-002',
        prompt='A cute dog',
        config=dict(
            number_of_images=1,
            aspect_ratio="1:1"
        )
    )
    print("IMAGE GENERATED SUCCESS")
except Exception as e:
    print(f"FAILED: {e}")
