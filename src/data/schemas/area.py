from pydantic import BaseModel, Field
from typing import List, Literal
from datetime import datetime

class Location(BaseModel):
    type: Literal["Point"] = "Point"
    coordinates: List[float] = Field(
        ...,
        min_items=2,
        max_items=2,
        description="[longitude, latitude]"
    )

class AreaCreate(BaseModel):
    id: int = Field(..., alias="_id")   # SERIAL từ SQL
    name: str
    city: str
    location: Location
    created_at: datetime
