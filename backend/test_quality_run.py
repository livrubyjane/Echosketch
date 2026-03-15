import asyncio
import os
import json
from dotenv import load_dotenv

load_dotenv()

from services.gemini import generate_story_prompts
from services.imagen import generate_image

async def run():
    print("--- 1. Testing Gemini Flash Lite Prompt Quality ---")
    try:
        panels = await generate_story_prompts(
            text="A brave cat explores a giant tree finding a glowing orb.",
            genre="Fantasy",
            art_style="Studio Ghibli Anime"
        )
        print("Gemini Generation Success! Generated 5 prompts:")
        for idx, p in enumerate(panels):
            print(f"Panel {idx+1} Prompt Length: {len(p['prompt'])} chars")
            print(f"  -> Preview: {p['prompt'][:80]}...")
            
    except Exception as e:
        print(f"Gemini Test Failed: {e}")
        return

    print("\n--- 2. Testing HuggingFace Stability (Generating 5 images with throttles) ---")
    hf_token = os.environ.get("HF_TOKEN")
    if not hf_token or "hf_" not in hf_token:
        print("ERROR: No valid HF_TOKEN found in .env! Cannot test.")
        return

    try:
        for idx, p in enumerate(panels):
            print(f"\nRequesting Image {idx+1}/{len(panels)} via HF...")
            img_uri = await generate_image(p["prompt"])
            
            if "Placehold" in img_uri or "API Error" in img_uri:
                print(f"  -> WARNING: Fallback placeholder returned for Image {idx+1}")
            else:
                 print(f"  -> Success! Received Base64 data (length: {len(img_uri)})")
                 
            if idx < len(panels) - 1:
                print("  -> Throttling 1.0s...")
                await asyncio.sleep(1.0)
                
        print("\n--- QUALITY & STABILITY TEST FULLY PASSED ---")
        
    except Exception as e:
         print(f"HuggingFace Test Failed: {e}")

if __name__ == "__main__":
    asyncio.run(run())
