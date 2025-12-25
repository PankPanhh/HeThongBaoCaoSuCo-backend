from pydantic import BaseModel
from datetime import datetime

class IncidentMediaCreate(BaseModel):
    incident_id: str
    url: str
    mime_type: str
    caption: str
    created_at: datetime
