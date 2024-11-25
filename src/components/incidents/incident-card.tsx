import {
  IncidentStatus,
  IncidentStepSchema,
  IncidentWithSteps,
} from "@/types/incident";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { cn, isEqual } from "@/lib/utils";
import { neonVariants } from "@/lib/variants";
import {
  CheckIcon,
  Cross1Icon,
  PlusIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { useMemo } from "react";
import { useUser } from "@/lib/hooks/use-user";
import { SlateInput, SlateTextarea } from "../global/slate-input";
import { AnimatePresence, motion } from "framer-motion";
import { exponentialEasing } from "@/utils/utils";

interface IncidentCardProps {
  incident: IncidentWithSteps;
  onUpdate: (incident: IncidentWithSteps) => void;
  onDelete: () => void;
}

export const IncidentCard = ({
  incident,
  onUpdate,
  onDelete,
}: IncidentCardProps) => {
  const { isAdmin } = useUser();

  const currentStatus = incident.steps[0]?.status || "ongoing";

  const handleAddStep = (text: string, status: IncidentStatus) => {
    const newStep = IncidentStepSchema.parse({
      incident_id: incident.id,
      text,
      status,
      timestamp: new Date().toISOString(),
    });

    onUpdate({
      ...incident,
      steps: [newStep, ...incident.steps],
    });
  };

  const handleDeleteStep = (id: string) => {
    onUpdate({
      ...incident,
      steps: incident.steps.filter((step) => step.id !== id),
    });
  };

  return (
    <div>
      <div className="text-sm text-muted-foreground">
        {new Date(incident.timestamp).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </div>

      <Separator className="mb-6 mt-2" />

      <div className="flex items-center justify-between">
        <SlateInput
          className="w-full text-lg"
          value={incident.name}
          onChange={(e) => onUpdate({ ...incident, name: e.target.value })}
          disabled={!isAdmin}
          placeholder="Briefly describe the incident..."
        />
        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <Button
                variant="surfaceGradient"
                size="icon"
                className={cn("size-7 rounded-full")}
                onClick={() => handleAddStep("", "ongoing")}
              >
                <PlusIcon className="size-4" />
              </Button>
              <Button
                variant="surfaceGradient"
                size="icon"
                className={cn("size-7 rounded-full")}
                onClick={onDelete}
              >
                <TrashIcon className="size-4" />
              </Button>
            </>
          )}
          <Badge
            className={cn(
              "capitalize",
              currentStatus === "ongoing"
                ? neonVariants({ neon: "red" })
                : neonVariants({ neon: "green" }),
            )}
          >
            {currentStatus}
          </Badge>
        </div>
      </div>

      <div className="!mt-6 space-y-4">
        {incident.steps.map((step, index) => (
          <div key={step.id} className="flex w-full gap-2">
            <div className="flex min-w-8 justify-center gap-3 pt-4">
              <button
                className={cn(
                  "flex size-5 items-center justify-center rounded-full p-1",
                  step.status === "resolved"
                    ? neonVariants({ neon: "green" })
                    : neonVariants({ neon: "red" }),
                  {
                    "cursor-default": !isAdmin,
                  },
                )}
                onClick={() => {
                  if (!isAdmin) return;

                  onUpdate({
                    ...incident,
                    steps: incident.steps.map((s, i) =>
                      i === index
                        ? {
                            ...s,
                            status:
                              s.status === "resolved" ? "ongoing" : "resolved",
                          }
                        : s,
                    ),
                  });
                }}
              >
                {step.status === "resolved" ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <Cross1Icon className="size-4" />
                )}
              </button>
              {/* {index !== incident.steps.length - 1 && (
                <div className="h-full w-0.5 bg-border" />
              )} */}
            </div>
            <Card className="relative w-full">
              <CardHeader className="p-3">
                <CardTitle className="text-sm capitalize">
                  {step.status}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {new Date(step.timestamp).toLocaleString("en-US", {
                      day: "numeric",
                      month: "short",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 text-muted-foreground">
                <SlateTextarea
                  value={step.text}
                  onChange={(e) =>
                    onUpdate({
                      ...incident,
                      steps: incident.steps.map((s, i) =>
                        i === index ? { ...s, text: e.target.value } : s,
                      ),
                    })
                  }
                  className="w-full"
                  disabled={!isAdmin}
                  placeholder="Describe the current status..."
                />
              </CardContent>
              {isAdmin && (
                <Button
                  variant="darkGradient"
                  size="icon"
                  className={cn("absolute right-2 top-2 size-7 rounded-full")}
                  onClick={() => handleDeleteStep(step.id)}
                >
                  <TrashIcon className="size-4" />
                </Button>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
