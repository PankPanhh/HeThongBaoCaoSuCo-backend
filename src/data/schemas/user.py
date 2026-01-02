# schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Literal, Optional
from datetime import datetime

class UserCreate(BaseModel):
    id: str
    name: str
    phone: str
    email: EmailStr
    password_hash: str
    role: Literal["citizen", "operator", "admin"]
    is_active: bool = True
    created_at: datetime

