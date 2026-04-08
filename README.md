# Mom2Be 💙

A multi-agent AI system for maternal health that coordinates 11 specialized sub-agents to manage tasks, schedules, and health information. Built with FastAPI + Vertex AI, integrating Google Calendar and Gmail via MCP, with Firebase for structured data storage. Deployed as a REST API with an Angular frontend.

### Structure
- **backend/** — FastAPI + Vertex AI + 11 AI Agents  
  - [Swagger UI Docs](https://mom2be-244972601130.asia-south1.run.app/docs)
- **frontend/** — Angular app


## Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

## Frontend Setup
```bash
cd frontend
npm install
ng serve
```

## Tech Stack
- **Frontend:** Angular
- **Backend:** FastAPI, Python
- **AI:** Vertex AI (Gemini)
- **Database:** Firebase
- **Integrations:** Google Calendar, Gmail via MCP
- **Agents:** 11 specialized sub-agents coordinated by a primary agent
