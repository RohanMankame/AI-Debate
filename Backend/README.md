# AI Debate Backend (Flask)

The core engine responsible for fetching arguments from multiple LLM providers and tracking the debate history.

## API Endpoints

- `POST /api/start_debate`: Initializes a new debate.
- `POST /api/next_round`: Triggers the next LLM to generate an argument based on the transcript.
- `GET /api/debate/<id>`: Retrieves current debate state.

## Supported Models
- **OpenAI**: `gpt-3.5-turbo`, `gpt-4`, `gpt-4.1-nano`, `gpt-4o-mini`, `gpt-4.1`,`gpt-5-chat`

Currently only support OpenAI modals as I dont have tokens for Anthropic and Google, You can add any modals you want in debate_engine.py. Make sure to add the model to the dropdown on the frontend for selection (Refere to frontend readme for info).

- **Anthropic**: Not supported but you can add a simple call in get_llm_response function in debate_engine.py

- **Google**: Not supported but you can add a simple call in get_llm_response function in debate_engine.py

## Requirements
- Python 3.9+
- Active OpenAI key LLMs you wish to use.

## 🔐 Configuration

Before running the backend, you must set up your environment variables. 

1. Create a file named `.env` in the `Backend/` directory.
2. Add your OpenAI API key to the file:

```env
OPENAI_API_KEY=your_openai_api_key_here
```
3. You can add additional OpenAI LLM modals by adding them to the frontend modal dropdown selection section. Refer to the frontend redeme for info.