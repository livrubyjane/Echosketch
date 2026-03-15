import os
import sys
import base64
import io
import traceback
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

def generate(prompt, model_id):
    hf_token = os.environ.get("HF_TOKEN")
    if not hf_token:
        print("ERROR: No HF_TOKEN in environment")
        return

    try:
        # Debug: Print first 5 chars of token to verify loading
        print(f"DEBUG: Using token starting with {hf_token[:5]}...")
        
        client = InferenceClient(token=hf_token.strip())
        
        # We use the synchronous method which is more stable in subprocesses
        image = client.text_to_image(prompt, model=model_id)
        
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        print(f"SUCCESS:{img_str}")
        
    except Exception as e:
        error_msg = str(e)
        print(f"ERROR: {error_msg}")
        # Capture the status code if it's a HTTP error
        if "402" in error_msg:
            print("STATUS:402")
        elif "404" in error_msg:
            print("STATUS:404")
        elif "503" in error_msg:
            print("STATUS:503")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("USAGE: python hf_worker.py <model_id> <prompt>")
    else:
        # Arg 1 is model_id, Arg 2 is prompt
        generate(sys.argv[2], sys.argv[1])
