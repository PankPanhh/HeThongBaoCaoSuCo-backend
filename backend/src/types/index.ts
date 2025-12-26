// TypeScript definitions for Quick Report API
export type IncidentStatus = "NEW" | "Đang xử lý" | "Đã xử lý" | "Đã gửi";
export type IncidentSource = "WEB" | "MOBILE" | "ZALO_MINI_APP" | "ZALO_MINI_APP_QUICK";
export type IncidentPriority = "HIGH" | "MEDIUM" | "LOW";

export interface Incident {
  id: string;
  type: string;
  location: string;
  status: IncidentStatus;
  priority?: IncidentPriority;
  time: string;
  description?: string;
  media?: string[];
  mediaCaptions?: string[];
  source?: IncidentSource;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  history?: IncidentHistoryEntry[];
}

export interface IncidentHistoryEntry {
  time: string;
  status: IncidentStatus;
  note?: string;
}

export interface CreateQuickReportRequest {
  imageUrl: string;
  type: string;
  location: string;
  description?: string;
  userId?: string;
  timestamp: string;
  source?: IncidentSource;
  priority?: IncidentPriority;
}

export interface UploadImageResponse {
  imageUrl: string;
  size: number;
  mimeType: string;
  filename: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  action: string;
  userId?: string;
  incidentId?: string;
  details: Record<string, any>;
  createdAt: string;
}
