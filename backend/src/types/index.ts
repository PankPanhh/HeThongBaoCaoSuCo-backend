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

// Alert/Banner Types
export type AlertType = "urgent" | "news" | "warning" | "info";

export interface Alert {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  type: AlertType;
  banner_image?: string;
  gallery?: string[]; // Multiple images/video URLs
  article_url?: string; // Link to official news article
  priority: number; // 1 = highest, higher number = lower priority
  start_time: string; // ISO date string
  end_time: string; // ISO date string
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface CreateAlertRequest {
  title: string;
  content: string;
  type: AlertType;
  banner_image?: string;
  gallery?: string[];
  article_url?: string;
  priority: number;
  start_time: string;
  end_time: string;
  is_active?: boolean;
  created_by?: string;
}

export interface UpdateAlertRequest {
  title?: string;
  content?: string;
  type?: AlertType;
  banner_image?: string;
  gallery?: string[];
  article_url?: string;
  priority?: number;
  start_time?: string;
  end_time?: string;
  is_active?: boolean;
}
