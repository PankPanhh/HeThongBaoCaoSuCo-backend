import { v4 as uuidv4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { IncidentPriority, IncidentStatus } from "../types/index.js";

/**
 * Mock in-memory database for incidents
 * Trong production, thay bằng MongoDB hoặc PostgreSQL
 */
let incidents: Map<string, any> = new Map();
let auditLogs: any[] = [];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "..", "..", "data");
const DATA_FILE = path.join(DATA_DIR, "mock-incidents.json");
// Path to frontend mock file in workspace root: /src/data/mockIncidents.ts
// No frontend mock TS write: persist only to backend data/mock-incidents.json

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create data dir:", err);
  }
}

async function saveToDisk() {
  try {
    const payload = {
      incidents: Array.from(incidents.values()),
      auditLogs,
    };
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(payload, null, 2), "utf-8");
    // Persist only to backend JSON; frontend mock TypeScript is no longer auto-written.
  } catch (err) {
    console.error("Failed to write mock data file:", err);
  }
}

async function loadFromDisk() {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(content || "{}");
    if (Array.isArray(parsed.incidents)) {
      incidents = new Map(parsed.incidents.map((i: any) => [i.id, i]));
    }
    if (Array.isArray(parsed.auditLogs)) {
      auditLogs = parsed.auditLogs;
    }
    console.log(`Loaded ${incidents.size} incidents from mock data file`);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      // No file yet, that's fine
      incidents = new Map();
      auditLogs = [];
      await saveToDisk();
    } else {
      console.error("Failed to load mock data file:", err);
    }
  }
}

export async function initMockPersistence() {
  await loadFromDisk();
}

/**
 * Tạo incident mới
 */
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
  const id = `INC-${uuidv4().substring(0, 8).toUpperCase()}`;
  const now = new Date().toISOString();

  const incident = {
    id,
    type: data.type,
    location: data.location,
    status: data.status || ("NEW" as IncidentStatus),
    priority: data.priority || "MEDIUM",
    description: data.description || "",
    media: data.media || [],
    source: data.source || "WEB",
    userId: data.userId,
    time: now,
    createdAt: now,
    updatedAt: now,
    history: [
      {
        time: now,
        status: data.status || ("NEW" as IncidentStatus),
        note: "Báo cáo được tạo từ Quick Report",
      },
    ],
  };

  incidents.set(id, incident);

  // Ghi audit log
  await logAudit("CREATE_INCIDENT_QUICK", { incidentId: id, ...data });

  // Persist
  await saveToDisk();

  return incident;
}

/**
 * Lấy incident theo ID
 */
export async function getIncident(id: string) {
  return incidents.get(id) || null;
}

/**
 * Lấy tất cả incidents với filter
 */
export async function getAllIncidents(filter?: {
  status?: IncidentStatus;
  type?: string;
  source?: string;
}) {
  let result = Array.from(incidents.values());

  if (filter?.status) {
    result = result.filter((i) => i.status === filter.status);
  }
  if (filter?.type) {
    result = result.filter((i) => i.type === filter.type);
  }
  if (filter?.source) {
    result = result.filter((i) => i.source === filter.source);
  }

  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Cập nhật trạng thái incident
 */
export async function updateIncidentStatus(
  id: string,
  status: IncidentStatus,
  note?: string
) {
  const incident = incidents.get(id);
  if (!incident) {
    throw new Error("Incident not found");
  }

  const now = new Date().toISOString();
  incident.status = status;
  incident.updatedAt = now;

  if (!incident.history) {
    incident.history = [];
  }
  incident.history.push({
    time: now,
    status,
    note,
  });

  incidents.set(id, incident);

  await logAudit("UPDATE_INCIDENT_STATUS", {
    incidentId: id,
    newStatus: status,
    note,
  });

  // Persist
  await saveToDisk();

  return incident;
}

/**
 * Ghi audit log
 */
export async function logAudit(
  action: string,
  details: Record<string, any>
) {
  const log = {
    id: uuidv4(),
    action,
    details,
    createdAt: new Date().toISOString(),
  };

  auditLogs.push(log);

  // Giữ tối đa 1000 entries
  if (auditLogs.length > 1000) {
    auditLogs = auditLogs.slice(-1000);
  }

  console.log("📝 Audit Log:", log);
  return log;
}

/**
 * Lấy audit logs
 */
export async function getAuditLogs(action?: string) {
  let result = auditLogs;

  if (action) {
    result = result.filter((log) => log.action === action);
  }

  return result.slice(-100).reverse();
}

/**
 * Thống kê
 */
export async function getStatistics() {
  const allIncidents = Array.from(incidents.values());

  return {
    totalIncidents: allIncidents.length,
    byStatus: {
      NEW: allIncidents.filter((i) => i.status === "NEW").length,
      "Đang xử lý": allIncidents.filter((i) => i.status === "Đang xử lý").length,
      "Đã xử lý": allIncidents.filter((i) => i.status === "Đã xử lý").length,
      "Đã gửi": allIncidents.filter((i) => i.status === "Đã gửi").length,
    },
    bySource: {
      WEB: allIncidents.filter((i) => i.source === "WEB").length,
      MOBILE: allIncidents.filter((i) => i.source === "MOBILE").length,
      ZALO_MINI_APP: allIncidents.filter((i) => i.source === "ZALO_MINI_APP").length,
      ZALO_MINI_APP_QUICK: allIncidents.filter(
        (i) => i.source === "ZALO_MINI_APP_QUICK"
      ).length,
    },
    byPriority: {
      HIGH: allIncidents.filter((i) => i.priority === "HIGH").length,
      MEDIUM: allIncidents.filter((i) => i.priority === "MEDIUM").length,
      LOW: allIncidents.filter((i) => i.priority === "LOW").length,
    },
  };
}
