from pydantic import BaseModel
from typing import Literal
from datetime import datetime

class AlertCreate(BaseModel):
    alert_type: str
    level: Literal["Low", "Medium", "High"]
    description: str
    start_at: datetime
    end_at: datetime
    created_at: datetime
    updated_at: datetime
