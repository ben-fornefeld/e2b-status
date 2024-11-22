"use client";

import { useStatusData } from "@/lib/hooks/use-status-data";
import { IncidentCard } from "./incident-card";
import { Alert, AlertTitle } from "../ui/alert";
import { CircleCheck } from "lucide-react";

export default function IncidentsList() {
  const { incidents } = useStatusData();

  return (
    <div className="flex flex-col gap-4">
      {incidents.length === 0 && (
        <Alert>
          <CircleCheck className="h-4 w-4" />
          <AlertTitle>No incidents reported</AlertTitle>
        </Alert>
      )}
      {incidents.map((incident) => (
        <IncidentCard incident={incident} />
      ))}
    </div>
  );
}
