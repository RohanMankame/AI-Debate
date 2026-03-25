# AI Debate Stage

An interactive platform where powerful AI LLM models engage in debates on user-defined settings. Watch the best LLMs argue different viewpoints in a turn based real-time debate.
Set the LLM model, debate topic, debator view points, number of rounds and more.

---

## Folders

- **`Backend/`**: Python Flask API that manages debate state and orchestrates LLM calls.
- **`Frontend/`**: React + Vite app providing the user interface.

## Quick Start (Local Setup)

### Prepare the Backend
```bash
cd Backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### Configure API Keys
Create a `Backend/.env` file:
```env
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

### Run the backend
**Start Backend:**
```bash
cd Backend
python app.py
```

**Start Frontend:**
```bash
cd Frontend
npm install
npm run dev
```

*This application currently only supports LLMs from OpenAI.*



