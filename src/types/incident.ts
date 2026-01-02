export type IncidentStatus = 'Đang xử lý' | 'Đã xử lý' | 'Đã gửi';

export type IncidentHistoryEntry = {
  time: string;
  status: IncidentStatus;
  note?: string;
};

export type Incident = {
  id: string;
  type: string;
  location: string;
  status: IncidentStatus;
  time: string;
  // Priority used by backend: HIGH | MEDIUM | LOW
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  // Source of the incident (backend may set values like WEB, MOBILE, ZALO_MINI_APP_QUICK)
  source?: string;
  // Optional user identifier who submitted the report
  userId?: string;
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  media?: string[]; // placeholder URLs
  mediaCaptions?: string[]; // optional captions matching media indexes
  history?: IncidentHistoryEntry[];
};

export default Incident;
