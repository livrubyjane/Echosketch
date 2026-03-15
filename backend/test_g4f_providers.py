import asyncio
import g4f

async def test_provider(provider):
    try:
        print(f"Testing {provider.__name__}...")
        response = await g4f.client.AsyncClient(provider=provider).images.generate(
            model="default",
            prompt="a simple test cube"
        )
        print(f"[SUCCESS] {provider.__name__}: {response.data[0].url}")
    except Exception as e:
        print(f"[FAILED] {provider.__name__}: {str(e)[:100]}")

async def main():
    providers = [
        p for p in g4f.Provider.__dict__.values() 
        if isinstance(p, type) and issubclass(p, g4f.providers.base_provider.BaseProvider) and p != g4f.providers.base_provider.BaseProvider
    ]
    for p in providers:
        if hasattr(p, "image_models") and p.image_models:
             await test_provider(p)

if __name__ == "__main__":
    asyncio.run(main())
