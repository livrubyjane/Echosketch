import edge_tts
import base64

async def generate_audio(text: str) -> str:
    """
    Generates audio from a string of text using Edge TTS (100% free, no API key).
    Returns basic base64 encoded string of the audio content.
    """
    try:
        # "en-US-ChristopherNeural" provides a much better dramatic storyteller voice.
        communicate = edge_tts.Communicate(text, "en-US-ChristopherNeural")
        
        audio_data = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data += chunk["data"]
                
        # Edge TTS streams MP3 data inherently
        b64 = base64.b64encode(audio_data).decode("utf-8")
        return f"data:audio/mp3;base64,{b64}"

    except Exception as e:
        print(f"Edge TTS generation failed: {e}")
        # Return empty string if it fails
        return ""
