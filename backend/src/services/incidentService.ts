import { MongoClient, ObjectId } from "mongodb";
import { IncidentPriority, IncidentStatus } from "../types/index.js";

const DEFAULT_MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://lephuc_233:abc12345@cluster0.fsajkxk.mongodb.net/";
const DB_NAME = process.env.MONGO_DB_NAME || "zaloapp";

let client: MongoClient | null = null;
let db: any = null;

function getCollections() {
  return {
    incidents: db.collection("incidents"),
    incident_history: db.collection("incident_history"),
    incident_media: db.collection("incident_media"),
  };
}

export async function initMockPersistence() {
  if (client && db) return;
  try {
    const maskedUri = DEFAULT_MONGO_URI.replace(/:([^@]+)@/, ":****@");
    console.log(`[MongoDB] Connecting to ${maskedUri}...`);
    
    client = new MongoClient(DEFAULT_MONGO_URI, {
      connectTimeoutMS: 10000, // 10s timeout
      serverSelectionTimeoutMS: 10000,
    });
    
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`✅ Connected to MongoDB database: ${DB_NAME}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    throw new Error(`Database connection failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function createIncident(data: {
  type: string;
  location: string;
  description?: string;
  media?: string[];
  source?: string;
  priority?: IncidentPriority;
  status?: IncidentStatus;
  userId?: string;
}) {
  await initMockPersistence();
  const { incidents, incident_history, incident_media } = getCollections();

  const now = new Date().toISOString();
  const doc: any = {
    type: data.type,
    location: data.location,
    status: data.status || ("NEW" as IncidentStatus),
    priority: data.priority || "MEDIUM",
    description: data.description || "",
    media: data.media || [],
    source: data.source || "WEB",
    userId: data.userId,
    createdAt: now,
    updatedAt: now,
  };

  const result = await incidents.insertOne(doc as any);
  const insertedId = result.insertedId;

  // insert history
  await incident_history.insertOne({
    incidentId: insertedId,
    time: now,
    status: doc.status,
    note: "Báo cáo được tạo từ Quick Report",
  });

  // insert media records if any
  if (Array.isArray(doc.media) && doc.media.length > 0) {
    const mediaDocs = doc.media.map((m: string) => ({
      incidentId: insertedId,
      url: m,
      createdAt: now,
    }));
    await incident_media.insertMany(mediaDocs as any);
  }

  const incident = await incidents.findOne({ _id: insertedId });
  if (incident) {
    (incident as any).id = insertedId.toString();
  }
  return incident;
}

export async function getIncident(id: string) {
  await initMockPersistence();
  const { incidents, incident_history, incident_media } = getCollections();

  let _id: any = null;
  try {
    _id = new ObjectId(id);
  } catch (_) {
    // not an object id
  }

  const query = _id ? { _id } : { _id: id };
  const incident = await incidents.findOne(query as any);
  if (!incident) return null;
  incident.id = (incident._id && incident._id.toString && incident._id.toString()) || incident._id;

  // attach history
  const history = await incident_history
    .find({ incidentId: incident._id })
    .sort({ time: 1 })
    .toArray();
  incident.history = history;

  // attach media
  const media = await incident_media.find({ incidentId: incident._id }).toArray();
  incident.media = media.map((m: any) => m.url || m);

  return incident;
}

export async function getAllIncidents(filter?: {
  status?: IncidentStatus;
  type?: string;
  source?: string;
}) {
  await initMockPersistence();
  const { incidents } = getCollections();

  try {
    const query: any = {};
    if (filter?.status) query.status = filter.status;
    if (filter?.type) query.type = filter.type;
    if (filter?.source) query.source = filter.source;

    console.log("[getAllIncidents] Query:", query);

    const result = await incidents
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    console.log("[getAllIncidents] Found", result.length, "incidents");

    // normalize id
    return result.map((r: any) => ({ ...r, id: r._id.toString() }));
  } catch (error) {
    console.error("[getAllIncidents] Error:", error);
    throw error;
  }
}

export async function updateIncidentStatus(id: string, status: IncidentStatus, note?: string) {
  await initMockPersistence();
  const { incidents, incident_history } = getCollections();

  let _id: any = null;
  try {
    _id = new ObjectId(id);
  } catch (_) {
    // handle string id
    _id = id;
  }

  const now = new Date().toISOString();

  const res = await incidents.findOneAndUpdate(
    { _id },
    { $set: { status, updatedAt: now } },
    { returnDocument: "after" as any }
  );

  if (!res.value) throw new Error("Incident not found");

  await incident_history.insertOne({ incidentId: _id, time: now, status, note });

  const updated = res.value;
  updated.id = updated._id.toString();
  return updated;
}

export async function logAudit(action: string, details: Record<string, any>) {
  await initMockPersistence();
  const { incident_history } = getCollections();
  const log = { action, details, createdAt: new Date().toISOString() };
  await incident_history.insertOne({ ...log, meta: "audit" });
  return log;
}

export async function getAuditLogs(action?: string) {
  await initMockPersistence();
  const { incident_history } = getCollections();
  const q: any = { meta: "audit" };
  if (action) q.action = action;
  return incident_history.find(q).sort({ createdAt: -1 }).limit(100).toArray();
}

export async function getStatistics() {
  await initMockPersistence();
  const { incidents } = getCollections();

  const all = await incidents.find({}).toArray();
  const totalIncidents = all.length;
  const byStatus: any = {};
  const bySource: any = {};
  const byPriority: any = {};

  for (const i of all) {
    byStatus[i.status] = (byStatus[i.status] || 0) + 1;
    bySource[i.source] = (bySource[i.source] || 0) + 1;
    byPriority[i.priority] = (byPriority[i.priority] || 0) + 1;
  }

  return { totalIncidents, byStatus, bySource, byPriority };
}

