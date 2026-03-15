import asyncio
from g4f.client import AsyncClient

async def test():
    try:
        client = AsyncClient()
        response = await client.images.generate(
            model="flux",
            prompt="a detailed oil painting of a brave cat exploring a misty forest"
        )
        print("Success:", response.data[0].url)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    asyncio.run(test())
