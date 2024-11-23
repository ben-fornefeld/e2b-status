"use client";

import { useStatusData } from "@/lib/hooks/use-status-data";
import { IncidentCard } from "./incident-card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { useUser } from "@/lib/hooks/use-user";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useRef, useState, useEffect, useLayoutEffect } from "react";

export default function IncidentsList() {
  const { incidents } = useStatusData();
  const { isAdmin } = useUser();

  const [formattedDate, setFormattedDate] = useState<string>("");

  useLayoutEffect(() => {
    // format date on client-side only to prevent hydration issues
    const date = new Date();
    setFormattedDate(
      date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  return (
    <>
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-2xl">Recent Incidents</h2>
        {isAdmin && (
          <Button>
            <CalendarIcon className="size-4" /> Report Incident
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {incidents.length === 0 && (
          <Alert variant="surfaceGradient" className="mx-auto mt-4 w-[95%]">
            <AlertTitle>{formattedDate}</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              No incidents have been reported in the last 14 days.
            </AlertDescription>
          </Alert>
        )}
        {incidents.map((incident) => (
          <IncidentCard incident={incident} />
        ))}
      </div>
    </>
  );
}
