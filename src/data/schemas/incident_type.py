from pydantic import BaseModel, Field
from datetime import datetime

class IncidentTypeCreate(BaseModel):
    id: int = Field(..., alias="_id")   # SERIAL
    name: str
    default_priority: int
    target_sla_hours: int
    created_at: datetime
