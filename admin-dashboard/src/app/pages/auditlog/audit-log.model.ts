export interface AuditEntry {
  id: string;
  timestamp: string; // ISO or formatted datetime
  userName: string;
  userId: string;
  action: string;
  target?: string;
  oldValue?: string | null;
  newValue?: string | null;
  ip?: string | null;
  device?: string | null; // Web / Mobile
  notes?: string | null;
}
