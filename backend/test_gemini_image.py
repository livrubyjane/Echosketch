import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
try:
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    result = client.models.generate_images(
        model='imagen-4.0-fast-generate-001',
        prompt='A cute dog',
        config=dict(
            number_of_images=1,
            aspect_ratio="1:1"
        )
    )
    for generated_image in result.generated_images:
        # It's an Image object. We need to save it or convert to base64.
        print("Success!", type(generated_image.image))
except Exception as e:
    print(f"Error: {e}")
