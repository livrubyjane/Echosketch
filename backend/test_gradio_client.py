import asyncio
from gradio_client import Client

def test():
    try:
        # Use synchronous client for testing
        client = Client("black-forest-labs/FLUX.1-schnell")
        result = client.predict(
                prompt="A cute cat",
                seed=0,
                randomize_seed=True,
                width=1024,
                height=1024,
                num_inference_steps=4,
                api_name="/infer"
        )
        print("Success:", result)
    except Exception as e:
        print("Failed:", e)

if __name__ == "__main__":
    test()
