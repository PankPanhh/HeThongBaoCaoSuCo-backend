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
  description?: string;
  media?: string[]; // placeholder URLs
  mediaCaptions?: string[]; // optional captions matching media indexes
  history?: IncidentHistoryEntry[];
};

export default Incident;
