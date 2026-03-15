from pydantic import BaseModel
from typing import List, Optional

class PanelRequest(BaseModel):
    prompt: str
    caption: str
    narration: str

class StoryRequest(BaseModel):
    text: str
    genre: str
    art_style: str

class PanelResponse(BaseModel):
    panel_number: int
    image_url: Optional[str] = None
    audio_url: Optional[str] = None
    caption: str
    narration: str
    prompt: str

class StoryResponse(BaseModel):
    story_id: str
    panels: List[PanelResponse]

class StoryContinuation(BaseModel):
    story_id: str
    genre: str
    art_style: str
    previous_panels: List[PanelResponse]
