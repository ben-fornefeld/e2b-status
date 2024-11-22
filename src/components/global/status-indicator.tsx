import { Status } from "@/types/status";
import { FC } from "react";

interface StatusIndicatorProps {
  status: Status;
}

export const StatusIndicator: FC<StatusIndicatorProps> = ({ status }) => {
  return (
    <div
      className={`w-3 h-3 rounded-full ${
        status === "operational"
          ? "bg-green-500"
          : status === "degraded"
            ? "bg-yellow-500"
            : "bg-red-500"
      }`}
    />
  );
};
