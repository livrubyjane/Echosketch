import requests
import io
import os

def query(payload):
    API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
    # Testing an empty/public auth
    headers = {"Authorization": f"Bearer hf_KkRZZzKxVxqkKzKxVxqkKzKxVxqkKzKxV"} # Dummy invalid key to see if public fallback works
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content

image_bytes = query({"inputs": "Astronaut riding a horse"})
with open("test_hf_sdxl.jpg", "wb") as f:
    f.write(image_bytes)
