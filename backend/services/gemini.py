import json
import os
import asyncio
from google import genai
from google.genai import types
from fastapi import HTTPException

# Initialize the modern google-genai client
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY", ""))

MODEL_ID = "gemini-flash-lite-latest"

STORY_DIRECTOR_PROMPT = """
You are the 'Story Director' for EchoSketch, an AI storytelling platform.
Your task is to take a simple user sentence, a requested Genre, and an Art Style, and expand them into a structured 5-panel narrative arc.

CRITICAL RULES:
1. Output MUST be valid JSON, containing an array named "panels".
2. VISUAL CONTINUITY: Describe the main character(s) exactly the same way in all 5 'prompt' fields (e.g., "A small golden retriever wearing a red bandana").
3. DYNAMIC SCENES: DO NOT create static scenes. Each of the 5 panels MUST have completely different camera angles (close-up, wide-shot, dramatic angle), distinct actions, and changing backgrounds. Show a genuine story progression (e.g. Panel 1: discovering, Panel 2: traveling, Panel 3: conflict, Panel 4: climax, Panel 5: resolution).
4. ART STYLE & GENRE ADHERENCE: You MUST heavily emphasize BOTH the User's Art Style AND the requested Genre in EVERY 'prompt' field. Pre-pend both to the prompt (e.g., "In the style of 90s vintage anime, Cyberpunk Sci-Fi setting:" or "In a highly detailed Vintage Comic style, dark Mystery atmosphere:"). 
5. "prompt" is the detailed highly-descriptive instruction for the Image Generator. Include lighting, mood, camera angle, action, the strict art style, and strong genre elements (like futuristic tech for Sci-Fi, or castles for Fantasy).
6. "caption" is a short 1-sentence summary displayed on the UI.
7. "narration" is a longer, engaging description (15-30 words) to be read aloud via TTS.

Example Output format:
{
  "panels": [
    {
      "prompt": "In the style of 90s vintage anime: A wide sweeping shot of a brave little orange cat with a red collar bounding energetically through a dense, glowing mystical forest. High quality, masterpiece, cel-shaded.",
      "caption": "The journey begins.",
      "narration": "Oliver, a brave little orange cat, took his first steps into the whispering woods."
    }
  ]
}
"""

async def generate_story_prompts(text: str, genre: str, art_style: str):
    prompt_text = f"User Input: {text}\nGenre: {genre}\nArt Style: {art_style}\nCreate a 5-panel story."
    
    max_retries = 3
    base_delay = 5.0
    
    for attempt in range(max_retries):
        try:
            response = await client.aio.models.generate_content(
                model=MODEL_ID,
                contents=[STORY_DIRECTOR_PROMPT, prompt_text],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            return json.loads(response.text)["panels"]
            
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                if attempt < max_retries - 1:
                    wait_time = base_delay * (1.5 ** attempt)
                    print(f"Gemini Rate Limit hit (429). Retrying in {wait_time}s... (Attempt {attempt+1}/{max_retries})")
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    raise HTTPException(status_code=429, detail="Gemini Rate Limit exceeded. Please either wait 1 minute before trying again, or swap in a fresh free API key from Google AI Studio.")
                    
            print(f"Error calling Gemini via google.genai: {e}")
            if "API_KEY_INVALID" in error_str or "API key not valid" in error_str or not os.environ.get("GEMINI_API_KEY"):
                raise HTTPException(status_code=401, detail="Please replace 'AIzaSy...' with your real Gemini API Key in the backend/.env file!")
            raise HTTPException(status_code=500, detail=f"Gemini AI Error: {error_str}")

async def generate_continuation_prompts(previous_panels: list, genre: str, art_style: str):
    context = "Previous 5 panels:\n" + json.dumps(previous_panels)
    prompt_text = f"Genre: {genre}\nArt Style: {art_style}\nGenerate the next 5 panels continuing this story exactly as before."
    
    max_retries = 3
    base_delay = 3.0
    
    for attempt in range(max_retries):
        try:
            response = await client.aio.models.generate_content(
                model=MODEL_ID,
                contents=[STORY_DIRECTOR_PROMPT, context, prompt_text],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json"
                )
            )
            return json.loads(response.text)["panels"]
            
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str:
                if attempt < max_retries - 1:
                    wait_time = base_delay * (1.5 ** attempt)
                    print(f"Gemini Continuation Rate Limit hit (429). Retrying in {wait_time}s... (Attempt {attempt+1}/{max_retries})")
                    await asyncio.sleep(wait_time)
                    continue
                else:
                    raise HTTPException(status_code=429, detail="Gemini Per-Minute Rate Limit exceeded. Please wait 60 seconds before continuing the story.")
            
            print(f"Error calling Gemini Continuation via google.genai: {e}")
            raise HTTPException(status_code=500, detail=f"Gemini Continuation Error: {error_str}")
