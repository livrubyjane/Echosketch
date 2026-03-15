import os
import asyncio
from google import genai
from dotenv import load_dotenv

load_dotenv()

async def run():
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    # Simulate a rapid continuation request right after generation
    print("Sending two requests back-to-back to simulate story + continuation...")
    
    try:
        res1 = await client.aio.models.generate_content(
            model="gemini-flash-latest",
            contents="say hello"
        )
        print("Req 1 Success!")
        
        # Immediate second request
        res2 = await client.aio.models.generate_content(
            model="gemini-flash-latest",
            contents="say world"
        )
        print("Req 2 Success!")
        
    except Exception as e:
        print(f"Error caught: {e}")

if __name__ == "__main__":
    asyncio.run(run())
