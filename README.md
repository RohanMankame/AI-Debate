# AI Debate Stage

An interactive platform where powerful AI models (Large Language Models) engage in live, structured debates on user-defined topics. Watch the best LLMs argue different viewpoints in real-time.

---

## Folders

- **`Backend/`**: Python Flask API that manages debate state and orchestrates LLM calls.
- **`Frontend/`**: React + Vite app providing the user interface.

## Quick Start (Local Setup)

### 1️⃣ Prepare the Backend
```bash
cd Backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 2️⃣ Configure API Keys
Create a `Backend/.env` file:
```env
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

### 3️⃣ Run the backend
**Start Backend:**
```bash
cd Backend
python app.py
```
*(Runs on http://localhost:8000)*

**Start Frontend:**
```bash
cd Frontend
npm install
npm run dev
```
*(Runs on http://localhost:5173)*




