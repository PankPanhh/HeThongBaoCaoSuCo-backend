from pydantic import BaseModel
from datetime import datetime

class SupportContactCreate(BaseModel):
    name: str
    phone: str
    channel: str
    created_at: datetime
