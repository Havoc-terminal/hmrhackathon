from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime
from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional
from database import Base

# ==========================================
# 1. SQLAlchemy ORM Models (Database Tables)
# ==========================================

class TaskModel(Base):
    __tablename__ = "tasks"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(50), default="Work")
    priority = Column(String(20), default="Medium")
    due_date = Column(String(50), nullable=True)
    status = Column(String(30), default="todo") # 'todo', 'in_progress', 'completed'
    description = Column(Text, nullable=True)
    is_ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class CalendarEventModel(Base):
    __tablename__ = "calendar_events"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    date = Column(String(20), nullable=False) # YYYY-MM-DD
    start_hour = Column(Float, nullable=False) # e.g. 15.0 (3:00 PM)
    end_hour = Column(Float, nullable=False)   # e.g. 15.75 (3:45 PM)
    location = Column(String(255), default="Google Meet")
    description = Column(Text, nullable=True)
    color = Column(String(20), default="#0d9488")
    is_ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class EmailThreadModel(Base):
    __tablename__ = "email_threads"

    id = Column(String(50), primary_key=True, index=True)
    sender = Column(String(150), nullable=False)
    recipient = Column(String(150), nullable=False)
    subject = Column(String(255), nullable=False)
    snippet = Column(String(255), nullable=True)
    body = Column(Text, nullable=False)
    has_meeting_intent = Column(Boolean, default=False)
    is_scheduled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DiaryEntryModel(Base):
    __tablename__ = "diary_entries"

    date = Column(String(20), primary_key=True, index=True) # YYYY-MM-DD
    title = Column(String(255), default="Untitled Reflection")
    content = Column(Text, nullable=False)
    mood = Column(String(30), default="productive")
    tags = Column(String(255), default="Work")
    created_at = Column(DateTime, default=datetime.utcnow)

# ==========================================
# 2. Pydantic Schemas (Request/Response Validation)
# ==========================================

class TaskCreate(BaseModel):
    title: str
    category: Optional[str] = "Work"
    priority: Optional[str] = "Medium"
    due_date: Optional[str] = None
    description: Optional[str] = ""

class CalendarEventCreate(BaseModel):
    title: str
    date: str
    start_hour: float
    end_hour: float
    location: Optional[str] = "Google Meet"
    description: Optional[str] = ""

class AgentInstructionRequest(BaseModel):
    instruction: str
    has_conflict_simulation: Optional[bool] = False

class DAGStep(BaseModel):
    id: str
    name: str
    tool: str
    action: str
    target_app: str
    is_sensitive: bool = False
    status: str = "pending"

class AgentPlanResponse(BaseModel):
    instruction: str
    total_steps: int
    dag_steps: List[DAGStep]
    estimated_time_saved_minutes: int

