from pydantic import BaseModel, Field
from typing import Optional, Literal, List
from datetime import datetime

class Location(BaseModel):
    type: Literal["Point"] = "Point"
    coordinates: List[float] = Field(..., min_items=2, max_items=2)

class IncidentCreate(BaseModel):
    id: str = Field(..., alias="_id")        # UUID
    incident_type_id: int

    summary: str
    description: str

    status: Literal["sent", "processing", "resolved", "reopened"]
    priority: int

    reporter_id: str
    area_id: int

    location_text: str
    location: Location

    citizen_confirmed: Optional[bool] = None

    reported_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime] = None
