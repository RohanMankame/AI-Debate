# AI Debate Stage

An interactive platform where powerful AI LLM models engage in debates on user-defined settings. Watch the best LLMs argue different viewpoints in a turn based real-time debate.
Set the LLM model, debate topic, debator view points, number of rounds and more.

---

## Deployed

The application is deployed on Render and can be accessed here:

- **Frontend:** [https://ai-debate-frontend-j71z.onrender.com](https://ai-debate-frontend-j71z.onrender.com)
- **Backend (API):** [https://ai-debate-backend-plqd.onrender.com](https://ai-debate-backend-plqd.onrender.com)

> **Note:** These services run on free instances. Please visit the **Backend** first to "wake up" the service, then access the the **frontend**. 

## Folders

- **`Backend/`**: Python Flask API that manages debate state and orchestrates LLM calls.
- **`Frontend/`**: React + Vite app providing the user interface.

## Quick Start (Local Setup)

Please Check backend and frontend readme to see how to setup project properly. Seperate readmes are avalable in both frontend and backend folders.

### Run the program after setup
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
