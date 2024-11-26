"use client";

import { useStatusData } from "@/lib/hooks/use-status-data";
import { IncidentCard } from "./incident-card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { useUser } from "@/lib/hooks/use-user";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useState, useLayoutEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { exponentialEasing } from "@/lib/utils";
import { neonVariants } from "@/lib/variants";
import { IncidentSchema, IncidentWithSteps } from "@/types/incident";
import { isEqual } from "@/lib/utils";
import useSaveIncidents from "@/lib/hooks/use-save-incidents";

export default function IncidentsList() {
  const { incidents } = useStatusData();
  const { isAdmin } = useUser();

  const [formattedDate, setFormattedDate] = useState<string>("");

  const [localIncidents, setLocalIncidents] = useState(incidents);

  const hasUnsavedChanges = useMemo(
    () => !isEqual(localIncidents, incidents),
    [localIncidents, incidents],
  );

  const { mutate: saveChanges, isPending: savingChanges } = useSaveIncidents(
    incidents,
    localIncidents,
  );

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

  useLayoutEffect(() => {
    setLocalIncidents(incidents);
  }, [incidents]);

  const handleIncidentUpdate = (updatedIncident: IncidentWithSteps) => {
    setLocalIncidents((prev) =>
      prev.map((inc) =>
        inc.id === updatedIncident.id ? updatedIncident : inc,
      ),
    );
  };

  const handleIncidentDelete = (incident: IncidentWithSteps) => {
    setLocalIncidents((prev) => prev.filter((inc) => inc.id !== incident.id));
  };

  const handleAddIncident = () => {
    const newIncident = {
      ...IncidentSchema.parse({
        name: "",
        description: "",
        timestamp: new Date().toISOString(),
      }),
      steps: [],
    };

    setLocalIncidents((prev) => [newIncident, ...prev]);
  };

  return (
    <div className="mt-8 md:mt-12">
      <div className="flex justify-between max-md:flex-col max-md:gap-2 md:items-center">
        <h2 className="text-2xl">Past Incidents</h2>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <AnimatePresence initial={false}>
              {hasUnsavedChanges && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, x: 10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{
                    duration: 0.2,
                    ease: (t) => exponentialEasing(t),
                  }}
                  className="sticky top-0"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <Button
                    variant="surfaceGradient"
                    onClick={() => saveChanges()}
                    disabled={savingChanges}
                  >
                    {savingChanges ? "Saving..." : "Save Changes"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              onClick={handleAddIncident}
              className={neonVariants({ neon: "gray" })}
            >
              <CalendarIcon />
              Report Incident
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-12">
        {incidents.length === 0 && (
          <Alert variant="surfaceGradient" className="mt-4">
            <AlertTitle>{formattedDate}</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              No incidents have been reported in the last 14 days.
            </AlertDescription>
          </Alert>
        )}
        {localIncidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            incident={incident}
            onUpdate={(updatedIncident) => {
              handleIncidentUpdate(updatedIncident);
            }}
            onDelete={() => {
              handleIncidentDelete(incident);
            }}
          />
        ))}
      </div>
    </div>
  );
}
