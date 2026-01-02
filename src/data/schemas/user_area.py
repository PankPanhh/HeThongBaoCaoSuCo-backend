from pydantic import BaseModel
from bson import ObjectId

class UserAreaCreate(BaseModel):
    user_id: str    # users._id (UUID string)
    area_id: int
