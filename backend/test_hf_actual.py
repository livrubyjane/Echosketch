import asyncio
import os
from dotenv import load_dotenv
from huggingface_hub import AsyncInferenceClient

load_dotenv()

async def run():
    hf_token = os.environ.get("HF_TOKEN")
    if not hf_token:
        print("NO HF_TOKEN")
        return
    client = AsyncInferenceClient(token=hf_token.strip())
    
    print("Testing stable-diffusion-xl-base-1.0...")
    try:
        image = await client.text_to_image("A cute cat", model="stabilityai/stable-diffusion-xl-base-1.0")
        print("Success for SDXL!")
    except Exception as e:
        print(f"SDXL Failed: {e}")

    print("Testing cagliostrolab/animagine-xl-3.1...")
    try:
        image = await client.text_to_image("A cute cat", model="cagliostrolab/animagine-xl-3.1")
        print("Success for Animagine!")
    except Exception as e:
        print(f"Animagine Failed: {e}")

if __name__ == "__main__":
    asyncio.run(run())
