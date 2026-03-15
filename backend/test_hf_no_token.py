import asyncio
import httpx
import io
from PIL import Image

async def run():
    API_URL = "https://router.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
    headers = {} # Notice NO authorization header is sent
    
    print("Testing unauthenticated HF request...")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(API_URL, headers=headers, json={"inputs": "A glowing magical orb sitting on an ancient pedestal"}, timeout=60.0)
            if response.status_code == 200:
                print(f"Success! Got {len(response.content)} bytes of image data.")
            else:
                print(f"Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Connection Failed: {e}")

if __name__ == "__main__":
    asyncio.run(run())
