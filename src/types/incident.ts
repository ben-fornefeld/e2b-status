export type IncidentStatus = "ongoing" | "resolved";

export type Incident = {
  id: string;
  name: string;
  description: string;
  timestamp: string;
};

export type IncidentStep = {
  id: string;
  incident_id: string;
  text: string;
  timestamp: string;
  status: IncidentStatus;
};

export type IncidentWithSteps = Incident & {
  steps: IncidentStep[];
};

export type IncidentStepInput = {
  text: string;
  status: IncidentStatus;
};
