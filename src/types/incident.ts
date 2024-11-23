export type IncidentStatus = "ongoing" | "resolved";

export type Incident = {
  id: string;
  name: string;
  description: string;
  timestamp: Date;
};

export type IncidentStep = {
  id: string;
  incident_id: string;
  text: string;
  timestamp: Date;
  status: IncidentStatus;
};

export type IncidentStepInput = {
  text: string;
  status: IncidentStatus;
};
