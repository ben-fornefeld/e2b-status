import { IncidentWithSteps } from "@/types/incident";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { neonVariants } from "@/lib/variants";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

interface IncidentCardProps {
  incident: IncidentWithSteps;
}

export const IncidentCard = ({ incident }: IncidentCardProps) => {
  const currentStatus = incident.steps[0]?.status || "ongoing";

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
        <h3 className="text-lg">{incident.name}</h3>
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

      <div className="!mt-6 space-y-4">
        {incident.steps.map((step, index) => (
          <div key={step.id} className="flex w-full gap-2">
            <div className="flex min-w-8 justify-center gap-3 pt-4">
              <div
                className={cn(
                  "flex size-5 items-center justify-center rounded-full p-1",
                  step.status === "resolved"
                    ? neonVariants({ neon: "green" })
                    : neonVariants({ neon: "red" }),
                )}
              >
                {step.status === "resolved" ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <Cross1Icon className="size-4" />
                )}
              </div>
              {/*               {index !== incident.steps.length - 1 && (
                <div className="h-full w-0.5 bg-border" />
              )} */}
            </div>
            <Card className="w-full">
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
                <p>{step.text}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
