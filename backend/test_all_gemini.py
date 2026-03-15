import os
import asyncio
from google import genai
from dotenv import load_dotenv

load_dotenv()

async def run():
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    models_to_test = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite-preview-02-05", # If older aliases exist
        "gemini-flash-latest",
        "gemini-1.5-flash-8b",
        "gemini-1.5-pro",
    ]
    
    print("Testing models to find one strictly without rate limits...")
    for m in models_to_test:
        print(f"\n--- Testing {m} ---")
        try:
            res = await client.aio.models.generate_content(
                model=m,
                contents="Generate a single sentence."
            )
            print("  -> Success!")
        except Exception as e:
            print(f"  -> Error: {e}")

if __name__ == "__main__":
    asyncio.run(run())
