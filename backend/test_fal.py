import asyncio
import fal_client

async def run():
    try:
        # Fal provides unauthenticated testing access for some endpoints, but let's see which ones.
        result = await fal_client.subscribe_async(
            "fal-ai/fast-sdxl",
            arguments={"prompt": "A cute cat"},
        )
        print("Success:", result['images'][0]['url'])
    except Exception as e:
        print("Failed:", e)

if __name__ == "__main__":
    asyncio.run(run())
