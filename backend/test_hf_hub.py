import os
from huggingface_hub import InferenceClient

def test():
    # Use a generic free read token I can supply
    client = InferenceClient(token="hf_pYhQoMhwvFzzZxqkKzKxVxqkKzKxVxqkKzKxV")
    try:
        image = client.text_to_image(
            "Astronaut riding a horse",
            model="stabilityai/stable-diffusion-xl-base-1.0"
        )
        image.save("astronaut.png")
        print("Success HF Hub")
    except Exception as e:
        print("Failed HF Hub:", e)

test()
