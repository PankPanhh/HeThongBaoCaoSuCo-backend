from pydantic import BaseModel
from datetime import datetime
from typing import Literal

class IncidentHistoryCreate(BaseModel):
    incident_id: str
    status: Literal["sent", "processing", "resolved", "reopened"]
    note: str
    actor_id: str
    created_at: datetime
