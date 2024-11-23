import { IncidentStatus } from "@/types/incident";
import { Status } from "@/types/status";
import { FC } from "react";

interface StatusIndicatorProps {
  status: Status;
}

export const StatusIndicator: FC<StatusIndicatorProps> = ({ status }) => {
  return (
    <div
      className={`h-3 w-3 rounded-full ${
        status === "operational"
          ? "bg-green-500"
          : status === "degraded"
            ? "bg-yellow-500"
            : "bg-red-500"
      }`}
    />
  );
};

interface IncidentStatusIndicatorProps {
  status: IncidentStatus;
}

export const IncidentStatusIndicator: FC<IncidentStatusIndicatorProps> = ({
  status,
}) => {
  return (
    <div
      className={`h-3 w-3 rounded-full ${
        status === "ongoing" ? "bg-yellow-500" : "bg-green-500"
      }`}
    />
  );
};
