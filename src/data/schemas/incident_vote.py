from pydantic import BaseModel
from typing import Literal
from datetime import datetime

class IncidentVoteCreate(BaseModel):
    incident_id: str
    user_id: str
    vote: Literal["valid", "invalid"]
    reason: str
    created_at: datetime
