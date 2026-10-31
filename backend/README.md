# DailyEcho Backend Server (FastAPI + Python + SQLAlchemy)

This directory contains the separate **Python backend API server** for the DailyEcho platform.

## 🚀 Tech Stack
* **Language:** Python 3.10+
* **Framework:** FastAPI
* **ORM:** SQLAlchemy
* **Database:** Supabase / PostgreSQL (with automatic local SQLite fallback)
* **Server:** Uvicorn (ASGI)

---

## 🛠️ How to Run the Backend

### 1. Open Terminal in `backend` folder
```bash
cd backend
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Start the FastAPI Server
```bash
uvicorn main:app --reload --port 8000
```

The server will start at:
* **API Root:** [http://localhost:8000](http://localhost:8000)
* **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **Alternative ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📌 Available API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check & system status |
| `POST` | `/api/agent/decompose` | Autonomous DAG Planning & Entity Extraction |
| `GET` | `/api/calendar/events` | List all scheduled calendar events |
| `POST` | `/api/calendar/events` | Book event with **Conflict Self-Healing** |
| `GET` | `/api/tasks` | Get all Google Tasks |
| `POST` | `/api/tasks` | Create new task with relative offsets |
| `POST` | `/api/contacts/match` | Smart Contacts ML relevance scoring |
| `GET` | `/api/diary/{date}` | Fetch diary reflection by date |
| `POST` | `/api/diary` | Save or update daily reflection |

