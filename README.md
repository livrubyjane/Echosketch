EchoSketch AI is a high-fidelity, interactive storytelling platform that transforms simple ideas into multidimensional cinematic experiences. Using state-of-the-art Generative AI, it builds 5-panel story arcs complete with stylized visuals.

Key Features:
Cinematic Storyboarding: A fluid, horizontal comic-strip interface built with Framer Motion.
Subprocess Isolation: A robust backend architecture that isolates Image Generation to prevent SDK-level async corruption, ensuring 100% stability.
Dynamic Genre/Style Switching: Support for Anime, Marvel Comics, Vintage Retro, Disney Pixar, and Watercolor art styles.
Assistive Narration: Integrated Edge TTS for clear, expressive voiceovers for every story panel.
Infinite Continuation: Seamlessly branch stories with a "What happens next?" engine powered by Gemini Flash Lite.

Tech Stack:
Frontend
React (Vite)
Tailwind CSS
Framer Motion
Backend
FastAPI (Python)
Google Gemini (Story Director)
Hugging Face (SDXL) (Visual Artist)
Edge TTS (Narrator)

Getting Started:
1. Prerequisites
Python 3.10+
Node.js 18+
API Keys: Google AI Studio (Gemini) and Hugging Face Access Token.
2. Backend Setup
bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
Configure Environment: Create a 

.env
 file in the backend/ directory:

env
GEMINI_API_KEY="your_google_ai_studio_key"
HF_TOKEN="your_huggingface_access_token"
Run Server:

bash
uvicorn main:app --reload
3. Frontend Setup
bash
cd frontend
npm install
npm run dev
