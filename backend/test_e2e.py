import asyncio
from httpx import AsyncClient
from main import app # import our fastapi app directly to test it without uvicorn

async def run_e2e():
    print("--- Running End-to-End Story Generation Test ---")
    async with AsyncClient(app=app, base_url="http://test") as ac:
        try:
            response = await ac.post(
                "/generate-story-arc",
                json={
                    "text": "A tiny grey mouse wearing a wizard hat finds a magical block of cheese.",
                    "genre": "Fantasy",
                    "art_style": "Disney / Pixar"
                },
                timeout=60.0 # Give it 60s for the 5 parallel image generations
            )
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"Story ID Generated: {data.get('story_id')}")
                panels = data.get('panels', [])
                print(f"Number of Panels Generated: {len(panels)}")
                for i, p in enumerate(panels):
                    img = p.get('image_url', '')
                    is_base64 = img.startswith('data:image/jpeg;base64,')
                    print(f"Panel {i+1}: Valid Base64 Image Generated: {is_base64} (Length: {len(img)})")
                    print(f"Panel {i+1} Narration: {p.get('narration')[:50]}...")
                print("\n[E2E SUCCESS] The full pipeline works perfectly.")
            else:
                print(f"[E2E FAILED] {response.text}")

        except Exception as e:
            print(f"[E2E CRITICAL FAILURE] Exception: {e}")

if __name__ == "__main__":
    asyncio.run(run_e2e())
