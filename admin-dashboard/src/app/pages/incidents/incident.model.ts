export interface Incident {
  id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  area: string;
  type: string;
  reportedBy: string;
  reportedDate: Date;
  assignedTeam?: string;
  lastUpdated: Date;
  images?: string[];
  notes?: string[];
}

export enum IncidentStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  PROCESSING = 'processing',
  RESOLVED = 'resolved',
  REOPENED = 'reopened',
}

export enum IncidentPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export const IncidentStatusLabels: Record<IncidentStatus, string> = {
  [IncidentStatus.NEW]: 'Mới',
  [IncidentStatus.ASSIGNED]: 'Đã gửi',
  [IncidentStatus.PROCESSING]: 'Đang xử lý',
  [IncidentStatus.RESOLVED]: 'Đã giải quyết',
  [IncidentStatus.REOPENED]: 'Mở lại',
};

export const IncidentPriorityLabels: Record<IncidentPriority, string> = {
  [IncidentPriority.LOW]: 'Thấp',
  [IncidentPriority.MEDIUM]: 'Trung bình',
  [IncidentPriority.HIGH]: 'Cao',
  [IncidentPriority.URGENT]: 'Khẩn cấp',
};
