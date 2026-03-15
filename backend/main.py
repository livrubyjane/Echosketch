from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import StoryRequest, StoryResponse, StoryContinuation
import asyncio
import uuid
from dotenv import load_dotenv

load_dotenv()

from services.gemini import generate_story_prompts, generate_continuation_prompts
from services.imagen import generate_image
from services.tts import generate_audio

app = FastAPI(title="EchoSketch API", description="Backend for EchoSketch Storytelling App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "EchoSketch API is running."}

@app.post("/generate-story-arc", response_model=StoryResponse)
async def generate_story_arc(request: StoryRequest):
    story_id = str(uuid.uuid4())
    # 1. Call Gemini to expand the 1 sentence into 5 prompts
    panels_data = await generate_story_prompts(request.text, request.genre, request.art_style)

    # 2. Call TTS in parallel (EdgeTTS handles concurrency well)
    audio_tasks = [generate_audio(p["narration"]) for p in panels_data]
    audio_urls = await asyncio.gather(*audio_tasks)

    # 3. Call Imagen sequentially with a strict local throttle to guarantee no HuggingFace Free Tier 429/503 limits
    image_urls = []
    for i, p in enumerate(panels_data):
        url = await generate_image(p["prompt"])
        image_urls.append(url)
        if i < len(panels_data) - 1:
            await asyncio.sleep(1.0) # Reduced throttle for snappier demo experience

    response_panels = []
    for i, p in enumerate(panels_data):
        response_panels.append({
            "panel_number": i + 1,
            "image_url": image_urls[i],
            "audio_url": audio_urls[i],
            "caption": p.get("caption", ""),
            "narration": p.get("narration", ""),
            "prompt": p.get("prompt", ""),
        })

    return StoryResponse(story_id=story_id, panels=response_panels)

@app.post("/continue-story", response_model=StoryResponse)
async def continue_story(request: StoryContinuation):
    # 1. Provide context to Gemini and get next 5 panels
    new_panels_data = await generate_continuation_prompts(
        [p.dict() for p in request.previous_panels], 
        request.genre, 
        request.art_style
    )
    
    last_idx = len(request.previous_panels)

    # 2. Parallel generation for audio
    audio_tasks = [generate_audio(p["narration"]) for p in new_panels_data]
    audio_urls = await asyncio.gather(*audio_tasks)

    # Sequential generation for images with a strict local throttle to respect HF rate limits
    image_urls = []
    for i, p in enumerate(new_panels_data):
        url = await generate_image(p["prompt"])
        image_urls.append(url)
        if i < len(new_panels_data) - 1:
            await asyncio.sleep(1.0) # Reduced throttle for snappier demo experience

    response_panels = []
    for i, p in enumerate(new_panels_data):
        response_panels.append({
            "panel_number": last_idx + i + 1,
            "image_url": image_urls[i],
            "audio_url": audio_urls[i],
            "caption": p.get("caption", ""),
            "narration": p.get("narration", ""),
            "prompt": p.get("prompt", ""),
        })

    return StoryResponse(story_id=request.story_id, panels=response_panels)
