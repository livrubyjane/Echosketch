import asyncio
from services.imagen import generate_image

async def run():
    url = await generate_image("a cute dog in a comic book style")
    print(f"Final URL: {url}")

if __name__ == "__main__":
    asyncio.run(run())
