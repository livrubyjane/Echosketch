import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
try:
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    models = client.models.list()
    for m in models:
        name = getattr(m, 'name', '')
        if 'image' in name.lower() or 'vision' in name.lower() or 'imagen' in name.lower():
            print(name)
except Exception as e:
    print(f"Error: {e}")
