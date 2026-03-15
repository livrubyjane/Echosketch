import requests

def query(payload):
    API_URL = "https://router.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
    headers = {"Authorization": "Bearer hf_pYhQoMhWvFzVxVxqkKzKxVxqkKzKxV"} # Random token
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.content

image_bytes = query({"inputs": "Astronaut riding a horse"})
with open("test_hf_sdxl2.jpg", "wb") as f:
    f.write(image_bytes)
