from pydantic import BaseModel
from datetime import datetime

class IncidentAssignmentCreate(BaseModel):
    incident_id: str
    assigned_to: str
    assigned_by: str
    created_at: datetime
