import { MongoClient, ObjectId } from "mongodb";
import { Alert, CreateAlertRequest, UpdateAlertRequest } from "../types/index.js";

const DEFAULT_MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://lephuc_233:abc12345@cluster0.fsajkxk.mongodb.net/";
const DB_NAME = process.env.MONGO_DB_NAME || "zaloapp";

let client: MongoClient | null = null;
let db: any = null;

function getCollections() {
  return {
    alerts: db.collection("alerts"),
    system_logs: db.collection("system_logs"),
  };
}

export async function initAlertDB() {
  if (client && db) return;
  try {
    const maskedUri = DEFAULT_MONGO_URI.replace(/:([^@]+)@/, ":****@");
    console.log(`[MongoDB Alert] Connecting to ${maskedUri}...`);

    client = new MongoClient(DEFAULT_MONGO_URI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    });

    await client.connect();
    db = client.db(DB_NAME);
    console.log(`✅ Connected to MongoDB for Alerts: ${DB_NAME}`);
  } catch (err) {
    console.error("❌ MongoDB Alert Connection Error:", err);
    throw new Error(`Alert DB connection failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// Create a new alert/banner
export async function createAlert(data: CreateAlertRequest): Promise<Alert> {
  await initAlertDB();
  const { alerts, system_logs } = getCollections();

  const now = new Date().toISOString();
  const newAlert = {
    ...data,
    is_active: data.is_active !== false, // default true
    created_at: now,
    updated_at: now,
  };

  const result = await alerts.insertOne(newAlert);
  
  // Log action
  await system_logs.insertOne({
    action: "CREATE_ALERT",
    userId: data.created_by || "system",
    alertId: result.insertedId.toString(),
    details: { title: data.title, type: data.type },
    createdAt: now,
  });

  return {
    ...newAlert,
    id: result.insertedId.toString(),
    _id: result.insertedId.toString(),
  };
}

// Get all alerts (admin)
export async function getAllAlerts(filters?: {
  type?: string;
  is_active?: boolean;
}): Promise<Alert[]> {
  await initAlertDB();
  const { alerts } = getCollections();

  const query: any = {
    // Exclude soft-deleted alerts
    deleted_at: { $exists: false }
  };
  
  if (filters?.type) query.type = filters.type;
  if (filters?.is_active !== undefined) query.is_active = filters.is_active;

  const results = await alerts
    .find(query)
    .sort({ priority: 1, created_at: -1 })
    .toArray();

  return results.map((doc: any) => ({
    ...doc,
    id: doc._id.toString(),
    _id: doc._id.toString(),
  }));
}

// Get active banners for public (Mini App users)
export async function getActiveBanners(limit = 10): Promise<Alert[]> {
  await initAlertDB();
  const { alerts } = getCollections();

  const now = new Date().toISOString();

  const results = await alerts
    .find({
      is_active: true,
      start_time: { $lte: now },
      end_time: { $gte: now },
    })
    .sort({ priority: 1, created_at: -1 })
    .limit(limit)
    .toArray();

  return results.map((doc: any) => ({
    ...doc,
    id: doc._id.toString(),
    _id: doc._id.toString(),
  }));
}

// Get alert by ID
export async function getAlertById(alertId: string): Promise<Alert | null> {
  await initAlertDB();
  const { alerts } = getCollections();

  // Validate ObjectId
  if (!ObjectId.isValid(alertId)) {
    console.error(`Invalid ObjectId: ${alertId}`);
    return null;
  }

  try {
    const doc = await alerts.findOne({ _id: new ObjectId(alertId) });
    if (!doc) return null;

    return {
      ...doc,
      id: doc._id.toString(),
      _id: doc._id.toString(),
    };
  } catch (error) {
    console.error(`Error getting alert ${alertId}:`, error);
    throw error;
  }
}

// Update alert
export async function updateAlert(
  alertId: string,
  data: UpdateAlertRequest,
  userId?: string
): Promise<Alert | null> {
  await initAlertDB();
  const { alerts, system_logs } = getCollections();

  // Validate ObjectId
  if (!ObjectId.isValid(alertId)) {
    console.error(`Invalid ObjectId: ${alertId}`);
    return null;
  }

  try {
    const updateData: any = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    const result = await alerts.findOneAndUpdate(
      { _id: new ObjectId(alertId) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) return null;

    // MongoDB findOneAndUpdate might return { value: document } or just document
    const updatedDoc = (result as any).value || result;
    
    if (!updatedDoc || !updatedDoc._id) {
      console.error('[updateAlert] Invalid result structure:', result);
      return null;
    }

    // Log action
    await system_logs.insertOne({
      action: "UPDATE_ALERT",
      userId: userId || "system",
      alertId: alertId,
      details: data,
      createdAt: new Date().toISOString(),
    });

    return {
      ...updatedDoc,
      id: updatedDoc._id.toString(),
      _id: updatedDoc._id.toString(),
    };
  } catch (error) {
    console.error(`Error updating alert ${alertId}:`, error);
    throw error;
  }
}

// Toggle alert active status
export async function toggleAlertStatus(
  alertId: string,
  is_active: boolean,
  userId?: string
): Promise<Alert | null> {
  console.log('[toggleAlertStatus] Called with:', { alertId, is_active, userId });
  
  await initAlertDB();
  const { alerts, system_logs } = getCollections();

  // Validate ObjectId
  if (!ObjectId.isValid(alertId)) {
    console.error(`[toggleAlertStatus] Invalid ObjectId: ${alertId}`);
    return null;
  }

  try {
    console.log('[toggleAlertStatus] Updating alert in DB...');
    const result = await alerts.findOneAndUpdate(
      { _id: new ObjectId(alertId) },
      {
        $set: {
          is_active: is_active,
          updated_at: new Date().toISOString(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result) {
      console.log('[toggleAlertStatus] Alert not found');
      return null;
    }

    console.log('[toggleAlertStatus] Alert updated:', result);
    console.log('[toggleAlertStatus] Result keys:', Object.keys(result));
    console.log('[toggleAlertStatus] Result._id:', result._id);
    console.log('[toggleAlertStatus] Result.value:', (result as any).value);

    // MongoDB findOneAndUpdate might return { value: document } or just document
    const updatedDoc = (result as any).value || result;
    
    if (!updatedDoc || !updatedDoc._id) {
      console.error('[toggleAlertStatus] Invalid result structure:', result);
      return null;
    }

    console.log('[toggleAlertStatus] Logging action...');
    // Log action
    await system_logs.insertOne({
      action: is_active ? "ACTIVATE_ALERT" : "DEACTIVATE_ALERT",
      userId: userId || "system",
      alertId: alertId,
      details: { is_active },
      createdAt: new Date().toISOString(),
    });

    console.log('[toggleAlertStatus] Success');
    return {
      ...updatedDoc,
      id: updatedDoc._id.toString(),
      _id: updatedDoc._id.toString(),
    };
  } catch (error) {
    console.error(`[toggleAlertStatus] Error for ${alertId}:`, error);
    throw error;
  }
}

// Delete alert (soft delete by setting is_active = false)
export async function deleteAlert(alertId: string, userId?: string): Promise<boolean> {
  await initAlertDB();
  const { alerts, system_logs } = getCollections();

  // Validate ObjectId
  if (!ObjectId.isValid(alertId)) {
    console.error(`Invalid ObjectId: ${alertId}`);
    return false;
  }

  try {
    const result = await alerts.findOneAndUpdate(
      { _id: new ObjectId(alertId) },
      {
        $set: {
          is_active: false,
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      }
    );

    if (!result) return false;

    // MongoDB findOneAndUpdate might return { value: document } or just document
    const deletedDoc = (result as any).value || result;
    
    if (!deletedDoc) return false;

    // Log action
    await system_logs.insertOne({
      action: "SOFT_DELETE_ALERT",
      userId: userId || "system",
      alertId: alertId,
      details: { title: deletedDoc.title },
      createdAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error(`Error deleting alert ${alertId}:`, error);
    throw error;
  }
}

// Get deleted alerts (trash)
export async function getDeletedAlerts(): Promise<Alert[]> {
  await initAlertDB();
  const { alerts } = getCollections();

  const results = await alerts
    .find({
      deleted_at: { $exists: true }
    })
    .sort({ deleted_at: -1 })
    .toArray();

  return results.map((doc: any) => ({
    ...doc,
    id: doc._id.toString(),
    _id: doc._id.toString(),
  }));
}

// Restore alert from trash
export async function restoreAlert(alertId: string, userId?: string): Promise<Alert | null> {
  await initAlertDB();
  const { alerts, system_logs } = getCollections();

  // Validate ObjectId
  if (!ObjectId.isValid(alertId)) {
    console.error(`Invalid ObjectId: ${alertId}`);
    return null;
  }

  try {
    const result = await alerts.findOneAndUpdate(
      { _id: new ObjectId(alertId) },
      {
        $unset: { deleted_at: "" },
        $set: {
          updated_at: new Date().toISOString(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result) return null;

    const restoredDoc = (result as any).value || result;
    
    if (!restoredDoc || !restoredDoc._id) {
      console.error('[restoreAlert] Invalid result structure:', result);
      return null;
    }

    // Log action
    await system_logs.insertOne({
      action: "RESTORE_ALERT",
      userId: userId || "system",
      alertId: alertId,
      details: { title: restoredDoc.title },
      createdAt: new Date().toISOString(),
    });

    return {
      ...restoredDoc,
      id: restoredDoc._id.toString(),
      _id: restoredDoc._id.toString(),
    };
  } catch (error) {
    console.error(`Error restoring alert ${alertId}:`, error);
    throw error;
  }
}

// Permanently delete alert (hard delete)
export async function permanentDeleteAlert(alertId: string, userId?: string): Promise<boolean> {
  await initAlertDB();
  const { alerts, system_logs } = getCollections();

  // Validate ObjectId
  if (!ObjectId.isValid(alertId)) {
    console.error(`Invalid ObjectId: ${alertId}`);
    return false;
  }

  try {
    // Get alert info before deleting
    const alert = await alerts.findOne({ _id: new ObjectId(alertId) });
    
    if (!alert) return false;

    // Permanently delete from database
    const result = await alerts.deleteOne({ _id: new ObjectId(alertId) });

    if (result.deletedCount === 0) return false;

    // Log action
    await system_logs.insertOne({
      action: "PERMANENT_DELETE_ALERT",
      userId: userId || "system",
      alertId: alertId,
      details: { 
        title: alert.title,
        permanently_deleted: true 
      },
      createdAt: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error(`Error permanently deleting alert ${alertId}:`, error);
    throw error;
  }
}

// Get alerts statistics
export async function getAlertsStatistics() {
  await initAlertDB();
  const { alerts } = getCollections();

  const now = new Date().toISOString();

  const [total, active, expired, upcoming] = await Promise.all([
    alerts.countDocuments({}),
    alerts.countDocuments({ is_active: true, start_time: { $lte: now }, end_time: { $gte: now } }),
    alerts.countDocuments({ end_time: { $lt: now } }),
    alerts.countDocuments({ start_time: { $gt: now } }),
  ]);

  return {
    total,
    active,
    expired,
    upcoming,
  };
}
