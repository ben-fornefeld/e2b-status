"use client";

import { Incident, IncidentStep } from "@/types/incident";
import { StatusCheck } from "@/types/status-check";
import { createContext, useContext, useState } from "react";

// the data that is provided by the server will be stored here
// -> avoids prop-drilling and makes the data available for any child component + centralised state management

type IncidentWithSteps = Incident & { steps: IncidentStep[] };

type StatusData = {
  statusChecks: StatusCheck[];
  incidents: IncidentWithSteps[];
  setIncidents: (incidents: IncidentWithSteps[]) => void;
};

export const StatusDataContext = createContext<StatusData>({
  statusChecks: [],
  incidents: [],
  setIncidents: () => {},
});

export const StatusDataProvider = ({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: StatusData;
}) => {
  // could be stored in refs since these dont change atm
  const [incidents, setIncidents] = useState<IncidentWithSteps[]>(
    initialData.incidents,
  );
  const [statusChecks] = useState<StatusCheck[]>(initialData.statusChecks);

  return (
    <StatusDataContext.Provider
      value={{ incidents, statusChecks, setIncidents }}
    >
      {children}
    </StatusDataContext.Provider>
  );
};

export const useStatusData = () => {
  const context = useContext(StatusDataContext);

  if (!context) {
    throw new Error("useStatusData must be used within a StatusDataProvider");
  }

  return context;
};
