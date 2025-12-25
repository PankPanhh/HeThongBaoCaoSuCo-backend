# database/mongo.py
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://lephuc_233:abc12345@cluster0.fsajkxk.mongodb.net/"

client = MongoClient(MONGO_URI)
db = client["zaloapp"]
users_collection = db["users"]
areas_collection = db["areas"]
user_areas_collection = db["user_areas"]
incident_types_collection = db["incident_types"]
incidents_collection = db["incidents"]
incident_history_collection = db["incident_history"]
incident_media_collection = db["incident_media"]
incident_assignments_collection = db["incident_assignments"]
incident_votes_collection = db["incident_votes"]
alerts_collection = db["alerts"]
support_contacts_collection = db["support_contacts"]

