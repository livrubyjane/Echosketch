import asyncio
import os
from google import genai
from huggingface_hub import AsyncInferenceClient
from dotenv import load_dotenv

load_dotenv()

async def run_tests():
    print("--- Testing API Keys ---")
    gemini_key = os.environ.get("GEMINI_API_KEY")
    hf_token = os.environ.get("HF_TOKEN")
    
    print(f"Gemini Key Present: {bool(gemini_key)}")
    print(f"HF Token Present: {bool(hf_token)}")

    print("\n--- Testing Gemini AI Studio ---")
    try:
        client = genai.Client(api_key=gemini_key)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents='Return the exact string "Hello World".'
        )
        print(f"[SUCCESS] Gemini: {response.text}")
    except Exception as e:
        print(f"[FAILED] Gemini: {e}")

    print("\n--- Testing HuggingFace Inference API ---")
    try:
        client = AsyncInferenceClient(token=hf_token.strip())
        image = await client.text_to_image(
            "A cute brave anime cat exploring a library, highly detailed, Studio Ghibli style",
            model="stabilityai/stable-diffusion-xl-base-1.0"
        )
        print(f"[SUCCESS] HuggingFace: Generated Image {image.width}x{image.height}")
    except Exception as e:
        print(f"[FAILED] HuggingFace: {e}")

if __name__ == "__main__":
    asyncio.run(run_tests())
