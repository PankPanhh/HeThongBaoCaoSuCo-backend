# main.py
from fastapi import FastAPI, HTTPException
from schemas.user import UserCreate
from schemas.area import AreaCreate
from schemas.incident_type import IncidentTypeCreate
from schemas.user_area import UserAreaCreate
from schemas.incident import IncidentCreate
from schemas.incident_history import IncidentHistoryCreate
from schemas.incident_media import IncidentMediaCreate
from schemas.incident_assignment import IncidentAssignmentCreate
from schemas.incident_vote import IncidentVoteCreate
from schemas.alert import AlertCreate
from database.mongo import alerts_collection
from schemas.support_contact import SupportContactCreate
from database.mongo import support_contacts_collection
from database.mongo import (
    users_collection,
    areas_collection,
    user_areas_collection,
    incident_types_collection,
    incidents_collection,
    incident_history_collection,
    incident_media_collection,
    incident_assignments_collection,
    incident_votes_collection
)

from bson import ObjectId


app = FastAPI(title="API")

@app.post("/users")
def create_user(user: UserCreate):
    # Kiểm tra trùng email
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already exists")

    document = {
        "_id": user.id,                 # UUID từ SQL
        "name": user.name,
        "phone": user.phone,
        "email": user.email,
        "password_hash": user.password_hash,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at
    }

    users_collection.insert_one(document)

    return {
        "message": "User created successfully",
        "user_id": user.id
    }

@app.post("/areas")
def create_area(area: AreaCreate):
    # Kiểm tra trùng _id
    if areas_collection.find_one({"_id": area.id}):
        raise HTTPException(status_code=400, detail="Area already exists")

    document = {
        "_id": area.id,
        "name": area.name,
        "city": area.city,
        "location": {
            "type": "Point",
            "coordinates": area.location.coordinates
        },
        "created_at": area.created_at
    }

    areas_collection.insert_one(document)

    return {
        "message": "Area created successfully",
        "area_id": area.id
    }
@app.post("/user-areas")
def create_user_area(data: UserAreaCreate):
    # 1. Kiểm tra user tồn tại
    if not users_collection.find_one({"_id": data.user_id}):
        raise HTTPException(status_code=404, detail="User not found")

    # 2. Kiểm tra area tồn tại
    if not areas_collection.find_one({"_id": data.area_id}):
        raise HTTPException(status_code=404, detail="Area not found")

    # 3. Tránh gán trùng
    if user_areas_collection.find_one({
        "user_id": data.user_id,
        "area_id": data.area_id
    }):
        raise HTTPException(status_code=400, detail="User already assigned to this area")

    document = {
        "user_id": data.user_id,   # UUID string
        "area_id": data.area_id
    }

    result = user_areas_collection.insert_one(document)

    return {
        "message": "User assigned to area successfully",
        "id": str(result.inserted_id)
    }
@app.post("/incident-types")
def create_incident_type(incident_type: IncidentTypeCreate):
    # Tránh trùng _id
    if incident_types_collection.find_one({"_id": incident_type.id}):
        raise HTTPException(status_code=400, detail="Incident type already exists")

    document = {
        "_id": incident_type.id,
        "name": incident_type.name,
        "default_priority": incident_type.default_priority,
        "target_sla_hours": incident_type.target_sla_hours,
        "created_at": incident_type.created_at
    }

    incident_types_collection.insert_one(document)

    return {
        "message": "Incident type created successfully",
        "incident_type_id": incident_type.id
    }

@app.post("/incidents")
def create_incident(incident: IncidentCreate):

    # 1. validate incident type
    if not incident_types_collection.find_one({"_id": incident.incident_type_id}):
        raise HTTPException(status_code=404, detail="Incident type not found")

    # 2. validate reporter
    if not users_collection.find_one({"_id": incident.reporter_id}):
        raise HTTPException(status_code=404, detail="Reporter not found")

    # 3. validate area
    if not areas_collection.find_one({"_id": incident.area_id}):
        raise HTTPException(status_code=404, detail="Area not found")

    # 4. tránh trùng incident UUID
    if incidents_collection.find_one({"_id": incident.id}):
        raise HTTPException(status_code=400, detail="Incident already exists")

    document = {
        "_id": incident.id,
        "incident_type_id": incident.incident_type_id,

        "summary": incident.summary,
        "description": incident.description,

        "status": incident.status,
        "priority": incident.priority,

        "reporter_id": incident.reporter_id,
        "area_id": incident.area_id,

        "location_text": incident.location_text,
        "location": {
            "type": "Point",
            "coordinates": incident.location.coordinates
        },

        "citizen_confirmed": incident.citizen_confirmed,

        "reported_at": incident.reported_at,
        "updated_at": incident.updated_at,
        "resolved_at": incident.resolved_at
    }

    incidents_collection.insert_one(document)

    return {
        "message": "Incident created successfully",
        "incident_id": incident.id
    }
@app.post("/incident-history")
def create_incident_history(history: IncidentHistoryCreate):

    # 1. check incident tồn tại
    if not incidents_collection.find_one({"_id": history.incident_id}):
        raise HTTPException(status_code=404, detail="Incident not found")

    # 2. check actor tồn tại
    if not users_collection.find_one({"_id": history.actor_id}):
        raise HTTPException(status_code=404, detail="Actor not found")

    document = {
        "incident_id": history.incident_id,
        "status": history.status,
        "note": history.note,
        "actor_id": history.actor_id,
        "created_at": history.created_at
    }

    result = incident_history_collection.insert_one(document)

    return {
        "message": "Incident history created",
        "history_id": str(result.inserted_id)
    }

@app.post("/incident-media")
def create_incident_media(media: IncidentMediaCreate):

    # 1. check incident tồn tại
    if not incidents_collection.find_one({"_id": media.incident_id}):
        raise HTTPException(status_code=404, detail="Incident not found")

    document = {
        "incident_id": media.incident_id,
        "url": media.url,
        "mime_type": media.mime_type,
        "caption": media.caption,
        "created_at": media.created_at
    }

    result = incident_media_collection.insert_one(document)

    return {
        "message": "Incident media created",
        "media_id": str(result.inserted_id)
    }
@app.post("/incident-assignments")
def create_incident_assignment(data: IncidentAssignmentCreate):

    # 1. check incident tồn tại
    if not incidents_collection.find_one({"_id": data.incident_id}):
        raise HTTPException(status_code=404, detail="Incident not found")

    # 2. check assigned_to tồn tại
    if not users_collection.find_one({"_id": data.assigned_to}):
        raise HTTPException(status_code=404, detail="Assigned user not found")

    # 3. check assigned_by tồn tại
    if not users_collection.find_one({"_id": data.assigned_by}):
        raise HTTPException(status_code=404, detail="Assigned by user not found")

    document = {
        "incident_id": data.incident_id,
        "assigned_to": data.assigned_to,
        "assigned_by": data.assigned_by,
        "created_at": data.created_at
    }

    result = incident_assignments_collection.insert_one(document)

    return {
        "message": "Incident assigned successfully",
        "assignment_id": str(result.inserted_id)
    }
@app.post("/incident-votes")
def create_incident_vote(vote: IncidentVoteCreate):

    # 1. check incident tồn tại
    if not incidents_collection.find_one({"_id": vote.incident_id}):
        raise HTTPException(status_code=404, detail="Incident not found")

    # 2. check user tồn tại
    if not users_collection.find_one({"_id": vote.user_id}):
        raise HTTPException(status_code=404, detail="User not found")

    # 3. mỗi user chỉ vote 1 lần / incident
    if incident_votes_collection.find_one({
        "incident_id": vote.incident_id,
        "user_id": vote.user_id
    }):
        raise HTTPException(
            status_code=400,
            detail="User already voted for this incident"
        )

    document = {
        "incident_id": vote.incident_id,
        "user_id": vote.user_id,
        "vote": vote.vote,
        "reason": vote.reason,
        "created_at": vote.created_at
    }

    result = incident_votes_collection.insert_one(document)

    return {
        "message": "Incident vote recorded",
        "vote_id": str(result.inserted_id)
    }
@app.post("/alerts")
def create_alert(alert: AlertCreate):

    if alert.end_at <= alert.start_at:
        raise HTTPException(
            status_code=400,
            detail="end_at must be greater than start_at"
        )

    document = {
        "alert_type": alert.alert_type,
        "level": alert.level,
        "description": alert.description,
        "start_at": alert.start_at,
        "end_at": alert.end_at,
        "created_at": alert.created_at,
        "updated_at": alert.updated_at
    }

    result = alerts_collection.insert_one(document)

    return {
        "message": "Alert created successfully",
        "alert_id": str(result.inserted_id)
    }
@app.post("/support-contacts")
def create_support_contact(contact: SupportContactCreate):

    last = support_contacts_collection.find_one(
        sort=[("_id", -1)]
    )
    next_id = (last["_id"] + 1) if last else 1

    document = {
        "_id": next_id,
        "name": contact.name,
        "phone": contact.phone,
        "channel": contact.channel,
        "created_at": contact.created_at
    }

    support_contacts_collection.insert_one(document)

    return {
        "message": "Support contact created",
        "id": next_id
    }
