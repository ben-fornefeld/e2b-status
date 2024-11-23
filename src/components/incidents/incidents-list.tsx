"use client";

import { useStatusData } from "@/lib/hooks/use-status-data";
import { IncidentCard } from "./incident-card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { useUser } from "@/lib/hooks/use-user";
import { CalendarIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useState, useLayoutEffect } from "react";
import { AnimatePresence } from "framer-motion";
import ReportIncidentView from "./report-incident-view";
import { motion } from "framer-motion";
import { exponentialEaseInOut } from "@/utils/utils";
import { neonVariants } from "@/lib/variants";
import { cn } from "@/lib/utils";

export default function IncidentsList() {
  const { incidents } = useStatusData();
  const { isAdmin } = useUser();

  const [formattedDate, setFormattedDate] = useState<string>("");
  const [isReportIncidentOpen, setIsReportIncidentOpen] = useState(false);

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
    <div className="mt-12">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Recent Incidents</h2>
        {isAdmin && (
          <Button
            onClick={() => setIsReportIncidentOpen(!isReportIncidentOpen)}
            className={
              isReportIncidentOpen
                ? cn(neonVariants({ neon: "gray" }), "opacity-60")
                : undefined
            }
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={isReportIncidentOpen ? "close" : "open"}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="size-4"
              >
                {isReportIncidentOpen ? <Cross1Icon /> : <CalendarIcon />}
              </motion.div>
            </AnimatePresence>
            Report Incident
          </Button>
        )}
      </div>

      <div className="mx-auto w-[95%]">
        <AnimatePresence>
          {isReportIncidentOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 5, marginTop: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
                y: 0,
                marginTop: "1.5rem",
              }}
              exit={{ opacity: 0, height: 0, y: -5, marginTop: 0 }}
              transition={{
                duration: 0.2,
                ease: (t) => exponentialEaseInOut(t),
                height: {
                  duration: 0.3,
                },
                marginTop: {
                  duration: 0.5,
                },
              }}
              style={{ overflow: "hidden" }}
            >
              <ReportIncidentView />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 flex flex-col gap-4">
          {incidents.length === 0 && (
            <Alert variant="surfaceGradient" className="mt-4">
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
      </div>
    </div>
  );
}
