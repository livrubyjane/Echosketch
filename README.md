# EchoSketch AI 🎨

EchoSketch AI is a high-fidelity interactive storytelling platform that transforms simple ideas into cinematic visual narratives. Using state-of-the-art Generative AI, the system converts a short prompt into a **5-panel illustrated storyboard** complete with stylized visuals and narration.

The goal of EchoSketch is to make storytelling more immersive, creative, and accessible by combining modern AI models with an intuitive visual interface.

---

✨ Key Features

### 🎬 Cinematic Storyboarding
A fluid **horizontal comic-strip interface** that displays stories panel by panel with smooth animations using **Framer Motion**.

### 🧠 AI Story Generation
Uses **Google Gemini** to expand a simple prompt into a structured **5-panel story arc**.

### 🎨 Dynamic Art Styles
Generate story visuals in multiple artistic styles:

- Anime / Manga  
- Marvel Comic  
- Vintage Retro  
- Disney / Pixar  
- Watercolor Storybook  

### 🔊 Assistive Narration
Integrated **Edge Text-to-Speech (TTS)** generates expressive voice narration for every story panel.

### 🔄 Infinite Story Continuation
Users can continue the story using a **“What happens next?” engine** powered by **Gemini Flash Lite**.

### ⚙️ Subprocess Isolation
The backend isolates **image generation in subprocess workers**, preventing SDK async corruption and ensuring reliable generation.

---

# 🧠 System Architecture

EchoSketch works through a multimodal AI pipeline:


User Prompt
↓
Gemini (Story Generation)
↓
5-Panel Story Arc
↓
SDXL Image Generation
↓
Edge TTS Narration
↓
Interactive Storyboard UI


---

# 🛠 Tech Stack

## Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion

## Backend
- FastAPI (Python)
- Google Gemini — Story Director
- Hugging Face SDXL — Visual Artist
- Edge TTS — Narrator

---

# 🚀 Getting Started

## 1. Prerequisites

Make sure the following are installed:

- Python 3.10+
- Node.js 18+
- API Keys:
  - Google AI Studio (Gemini API Key)
  - Hugging Face Access Token

---

# Backend Setup

Navigate to the backend folder:

```bash
cd backend

Create a virtual environment:

python -m venv venv

Activate the environment:

Mac / Linux

source venv/bin/activate

Windows

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt
Configure Environment Variables

Create a .env file inside the backend/ directory.
Run the backend server:

uvicorn main:app --reload

The API will start at:

http://127.0.0.1:8000
Frontend Setup

Navigate to the frontend folder:

cd frontend

Install dependencies:

npm install

Run the development server:

npm run dev

The frontend will start at:

http://localhost:5173
📂 Project Structure
EchoSketch
│
├── backend
│   ├── services
│   │   ├── gemini.py
│   │   ├── imagen.py
│   │   └── tts.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend
│   ├── src
│   │   ├── components
│   │   └── App.jsx
│   └── package.json
│
└── README.md
🎯 Use Cases

EchoSketch can be used for:

AI-assisted storytelling

Interactive children’s narratives

Creative writing inspiration

Educational visual storytelling

Storyboarding for animation or games

🔮 Future Improvements

Multi-character dialogue generation

Choice-based branching storylines

Video generation from storyboards

Cloud deployment for public access

Collaborative storytelling
