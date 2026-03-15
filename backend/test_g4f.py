from g4f.client import Client

def test():
    try:
        client = Client()
        response = client.images.generate(
            model="flux",
            prompt="a detailed oil painting of a brave cat exploring a misty forest"
        )
        print("Success:", response.data[0].url)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test()
