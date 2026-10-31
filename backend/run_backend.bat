@echo off
echo Starting DailyEcho Backend Server (FastAPI / Python)...
cd /d "%~dp0"
python -m uvicorn main:app --reload --port 8000
pause

