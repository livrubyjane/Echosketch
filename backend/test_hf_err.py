import asyncio
from services.imagen import generate_image

async def run():
    print("Testing generate_image to see exact error:")
    res = await generate_image("A cute cat in an anime style")
    print("Result:", res[:100] if len(res) > 200 else res)

if __name__ == "__main__":
    asyncio.run(run())
