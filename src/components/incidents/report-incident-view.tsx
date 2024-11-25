import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { FC, useState } from "react";
import { IncidentStatus, IncidentStep } from "@/types/incident";
import { ArrowRightIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { IncidentStatusIndicator } from "../global/status-indicator";
import { useToast } from "@/lib/hooks/use-toast";
import { colorVariants } from "@/lib/variants";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function ReportIncidentView() {
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [steps, setSteps] = useState<Pick<IncidentStep, "text" | "status">[]>([
    {
      text: "",
      status: "ongoing",
    },
  ]);

  const { mutate: createIncident, isPending: isCreatingIncident } = useMutation(
    {
      mutationKey: ["create-incident"],
      mutationFn: async () => {
        const { data: incident, error: incidentError } = await supabase
          .from("incidents")
          .insert({
            name,
          })
          .select()
          .single();

        if (incidentError) throw incidentError;

        const { error: stepsError } = await supabase
          .from("incident_steps")
          .insert(
            steps.map((step) => ({
              incident_id: incident.id,
              text: step.text,
              status: step.status,
            })),
          );

        if (stepsError) throw stepsError;
      },
      onSuccess: () => {
        toast({
          title: "Incident created successfully",
        });

        router.refresh();
      },
      onError: (error) => {
        toast({
          title: "Failed to create incident",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  );

  const handleIncidentCreation = () => {
    if (name.length === 0) {
      toast({
        title: "Please provide a name for the incident",
        variant: "destructive",
      });
      return;
    }

    if (steps.length === 0) {
      toast({
        title: "Please provide at least one step",
        variant: "destructive",
      });
      return;
    }

    createIncident();
  };

  return (
    <div
      className={cn(
        colorVariants({ variant: "darkGradient" }),
        "space-y-8 rounded-2xl bg-gradient-to-bl p-6 shadow-lg",
      )}
    >
      <div className="w-full space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Brief Incident Name"
          className="w-1/4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/*   <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Detailed description of the incident..."
            className="min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div> */}

      <div className="space-y-2">
        <Label htmlFor="description">Steps</Label>
        <div className="flex flex-col gap-6 rounded-2xl">
          {steps.map((step, index) => (
            <IncidentStepComp
              key={`step-card-${index}`}
              step={step}
              onChange={(newStep) => {
                const newSteps = [...steps];

                newSteps[index] = newStep;

                setSteps(newSteps);
              }}
              onRemove={
                index !== 0
                  ? () => {
                      setSteps(steps.filter((_, i) => i !== index));
                    }
                  : undefined
              }
            />
          ))}
          <div className="flex items-center justify-between">
            <Button
              className="mt-1 self-center"
              variant="surfaceGradient"
              onClick={() =>
                setSteps([...steps, { text: "", status: "ongoing" }])
              }
            >
              <PlusIcon /> Add Step
            </Button>
            <Button
              type="submit"
              size="lg"
              onClick={handleIncidentCreation}
              disabled={isCreatingIncident}
            >
              Create Incident <ArrowRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

const IncidentStepComp: FC<{
  step: Pick<IncidentStep, "text" | "status">;
  onChange: (step: Pick<IncidentStep, "text" | "status">) => void;
  onRemove?: () => void;
}> = ({ step, onChange, onRemove }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Select
          value={step.status}
          onValueChange={(value) =>
            onChange({ ...step, status: value as IncidentStatus })
          }
        >
          <SelectTrigger className="w-[140px]">
            <IncidentStatusIndicator status={step.status} />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
        {onRemove && (
          <Button variant="surfaceGradient" size="icon" onClick={onRemove}>
            <TrashIcon />
          </Button>
        )}
      </div>

      <Textarea
        value={step.text}
        onChange={(e) => onChange({ ...step, text: e.target.value })}
        placeholder="Describe the current state of the incident..."
        className="w-2/3 text-lg"
      />
    </div>
  );
};
