import asyncio
from huggingface_hub import AsyncInferenceClient

async def generate(client, prompt, index):
    try:
        # We use a fast, high quality model known to be free on Inference API
        image = await client.text_to_image(
            prompt,
            model="stabilityai/stable-diffusion-xl-base-1.0"
        )
        image.save(f"test_hf_{index}.png")
        return f"Success {index}"
    except Exception as e:
        return f"Failed {index}: {e}"

async def run():
    client = AsyncInferenceClient(token="hf_pYhQoMhwvFzzZxqkKzKxVxqkKzKxVxqkKzKxV")
    prompts = [f"A brave dog {i}" for i in range(5)]
    results = await asyncio.gather(*(generate(client, p, i) for i, p in enumerate(prompts)))
    print(results)

if __name__ == "__main__":
    asyncio.run(run())
