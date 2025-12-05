export type IncidentStatus =
  | "open"
  | "investigating"
  | "resolved"
  | "closed"
  | "escalated";

export interface Incident {
  id: string;
  reportingPerson: string;
  status: IncidentStatus;
  description: string;
  date: Date;
}

export interface IncidentColumn {
  id: string;
  label: string;
  visible: boolean;
}
