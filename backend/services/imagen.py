import os
import base64
import urllib.parse
import random
import httpx
import asyncio

async def generate_image(prompt: str) -> str:
    """
    Generates an image via a standalone subprocess to isolate and solve 
    async SDK corruption bugs (StopIteration).
    """
    print(f"Generating image for prompt: {prompt}")
    
    # Stable Diffusion XL Base is the only guaranteed free-tier model on the router API.
    # We rely heavily on Gemini's detailed prompting to enforce the art style.
    target_model = "stabilityai/stable-diffusion-xl-base-1.0"
    
    # Keep the prompt enhancements to force the style even on the base model
    prompt_lower = prompt.lower()
    if "anime" in prompt_lower or "manga" in prompt_lower:
        prompt = f"masterpiece, best quality, {prompt}"
    elif "marvel comic" in prompt_lower or "marvel" in prompt_lower:
        prompt = f"marvel comic book style, {prompt}"
    elif "vintage comic" in prompt_lower or "vintage" in prompt_lower or "retro" in prompt_lower:
        prompt = f"vintage 1950s comic book style, faded colors, {prompt}"
    elif "disney" in prompt_lower or "pixar" in prompt_lower:
        prompt = f"disney pixar 3d animation style, {prompt}"
    elif "watercolor" in prompt_lower or "book" in prompt_lower:
        prompt = f"beautiful watercolor illustration, children's book style, {prompt}"

    print(f"Routing to HF REST API Model: {target_model}")
    
    # Use the subprocess worker
    result = await _run_worker(target_model, prompt)
    
    if result:
        return f"data:image/jpeg;base64,{result}"
    
    return _generate_placeholder(prompt, error="API Error")

async def _run_worker(model_id, prompt):
    try:
        # Use the absolute path to python in the venv
        python_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "venv", "bin", "python3")
        worker_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "hf_worker.py")
        
        process = await asyncio.create_subprocess_exec(
            python_path, worker_path, model_id, prompt,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        output = stdout.decode().strip()
        
        if "SUCCESS:" in output:
            return output.split("SUCCESS:")[1].strip()
        
        if "402" in output or "402" in stderr.decode():
             print("HF Worker: Quota Depleted (402).")
             # Special case to return something identifying the limit
             return None 
             
        print(f"HF Worker Error for {model_id}: {output} {stderr.decode()}")
        return None
    except Exception as e:
        print(f"Failed to run HF Worker: {e}")
        return None

def _generate_placeholder(prompt: str, error: str = "") -> str:
    short_text = prompt[:20] + "..." if len(prompt) > 20 else prompt
    if error:
        short_text = f"{error} - {short_text}"
    encoded_text = urllib.parse.quote(short_text)
    colors = ["2e0e5c", "1e3a8a", "064e3b", "7c2d12", "4c1d95", "831843"]
    bg_color = random.choice(colors)
    return f"https://placehold.co/1024x1024/{bg_color}/FFFFFF.png?text={encoded_text}"
