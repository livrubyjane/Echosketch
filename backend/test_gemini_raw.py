import os
import asyncio
from google import genai
from dotenv import load_dotenv

load_dotenv()

async def run():
    key = os.environ.get("GEMINI_API_KEY")
    if not key or key == "AIzaSy...":
        print("NO VALID GEMINI KEY FOUND IN .ENV")
        return

    print(f"Testing Gemini Key starting with: {key[:10]}...")
    client = genai.Client(api_key=key)

    try:
        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash",
            contents="Say hello testing."
        )
        print(f"Success! Gemini responded: {response.text}")
    except Exception as e:
        print(f"Gemini API Error: {e}")

if __name__ == "__main__":
    asyncio.run(run())
