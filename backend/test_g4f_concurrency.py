import asyncio
from services.imagen import generate_image

async def run():
    prompts = [f"a cute dog part {i}" for i in range(5)]
    results = await asyncio.gather(*(generate_image(p) for p in prompts))
    for r in results:
        print("RESULT:", r)

if __name__ == "__main__":
    asyncio.run(run())
