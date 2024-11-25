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
  uptime: number[];
};

type StatusDataContext = StatusData & {
  setIncidents: (incidents: IncidentWithSteps[]) => void;
};

export const StatusDataContext = createContext<StatusDataContext>({
  statusChecks: [],
  incidents: [],
  setIncidents: () => {},
  uptime: [],
});

export const StatusDataProvider = ({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: StatusData;
}) => {
  const [incidents, setIncidents] = useState<IncidentWithSteps[]>(
    initialData.incidents,
  );

  return (
    <StatusDataContext.Provider
      value={{
        incidents,
        setIncidents,
        statusChecks: initialData.statusChecks,
        uptime: initialData.uptime,
      }}
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
