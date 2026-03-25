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

## ☁️ Deployment (Render)

This project is configured for easy deployment on [Render](https://render.com) using the `render.yaml` file.

### Steps to Deploy:
1. **Fork/Push** this repository to GitHub.
2. **Login to Render** and click **"New +"** -> **"Blueprint"**.
3. **Connect your GitHub repo**.
4. Render will automatically detect the `render.yaml` and set up:
   - A **Web Service** for the Python Backend.
   - A **Static Site** for the React Frontend.
5. **Important**: In the Render Dashboard, go to the `ai-debate-backend` service settings and manually add your `OPENAI_API_KEY` under the **Environment** tab.

The Frontend will automatically link to the Backend service URL.

*This application currently only supports LLMs from OpenAI.*



