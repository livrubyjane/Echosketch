import os
import asyncio
from google import genai
from dotenv import load_dotenv

load_dotenv()

async def run():
    key = os.environ.get("GEMINI_API_KEY")
    client = genai.Client(api_key=key)
    print("Available Gemini Models:")
    try:
        models = await client.aio.models.list()
        for m in models:
             print(m.name)
    except Exception as e:
        print(e)

if __name__ == "__main__":
    asyncio.run(run())
