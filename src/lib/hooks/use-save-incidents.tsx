import {
  Incident,
  IncidentStep,
  IncidentStepInput,
  IncidentWithSteps,
} from "@/types/incident";

import { IncidentInput } from "@/types/incident";
import { useMutation } from "@tanstack/react-query";
import { isEqual } from "../utils";
import { supabase } from "@/utils/supabase/client";
import { useStatusData } from "./use-status-data";

interface AddIncidentOperation {
  type: "add-incident";
  data: IncidentInput;
}

interface UpdateIncidentOperation {
  type: "update-incident";
  data: Partial<Incident>;
}

interface DeleteIncidentOperation {
  type: "delete-incident";
  data: Incident;
}

interface AddIncidentStepOperation {
  type: "add-incident-step";
  data: IncidentStepInput;
}

interface UpdateIncidentStepOperation {
  type: "update-incident-step";
  data: Partial<IncidentStep>;
}

interface DeleteIncidentStepOperation {
  type: "delete-incident-step";
  data: IncidentStep;
}

type ChangeOperation =
  | AddIncidentOperation
  | UpdateIncidentOperation
  | DeleteIncidentOperation
  | AddIncidentStepOperation
  | UpdateIncidentStepOperation
  | DeleteIncidentStepOperation;

export default function useSaveIncidents(
  incidents: IncidentWithSteps[],
  localIncidents: IncidentWithSteps[],
) {
  const { setIncidents } = useStatusData();

  const inferChanges = (): ChangeOperation[] => {
    const operations: ChangeOperation[] = [];

    // seperate incidents from steps without steps for clean comparison
    const incidentsWithoutSteps = incidents.map(
      ({ steps, ...incident }) => incident,
    );
    const localIncidentsWithoutSteps = localIncidents.map(
      ({ steps, ...incident }) => incident,
    );

    // incident delete and update
    incidentsWithoutSteps.forEach((incident, index) => {
      const localIncident = localIncidentsWithoutSteps.find(
        (local) => local.id === incident.id,
      );
      if (!localIncident) {
        operations.push({ type: "delete-incident", data: incidents[index] });
      } else if (!isEqual(incident, localIncident)) {
        operations.push({
          type: "update-incident",
          data: localIncident,
        });
      }
    });

    // step delete and update
    incidents.forEach((incident) => {
      const localIncident = localIncidents.find(
        (local) => local.id === incident.id,
      );

      incident.steps?.forEach((step) => {
        const localStep = localIncident?.steps?.find((ls) => ls.id === step.id);
        if (!localStep) {
          operations.push({ type: "delete-incident-step", data: step });
        } else if (!isEqual(step, localStep)) {
          operations.push({
            type: "update-incident-step",
            data: localStep,
          });
        }
      });
    });

    // new incident
    localIncidentsWithoutSteps.forEach((localIncident, index) => {
      if (
        !incidentsWithoutSteps.find(
          (incident) => incident.id === localIncident.id,
        )
      ) {
        operations.push({
          type: "add-incident",
          data: localIncident,
        });

        const steps = localIncidents[index].steps;
        steps?.forEach((step) => {
          const { id: stepId, ...stepData } = step;
          operations.push({
            type: "add-incident-step",
            data: stepData as IncidentStepInput,
          });
        });
      }
    });

    // new step for existing incident
    localIncidents.forEach((localIncident) => {
      const originalIncident = incidents.find((i) => i.id === localIncident.id);
      if (originalIncident) {
        localIncident.steps?.forEach((step) => {
          if (!originalIncident.steps?.find((s) => s.id === step.id)) {
            const { id: stepId, ...stepData } = step;
            operations.push({
              type: "add-incident-step",
              data: stepData as IncidentStepInput,
            });
          }
        });
      }
    });

    return operations;
  };

  const mutation = useMutation({
    mutationKey: ["save-changes"],
    mutationFn: async () => {
      const changes = inferChanges();

      // separate operations into incident and step operations to prevent fk relation issues
      const incidentOps = changes.filter((change) =>
        ["add-incident", "update-incident", "delete-incident"].includes(
          change.type,
        ),
      );
      const stepOps = changes.filter((change) =>
        [
          "add-incident-step",
          "update-incident-step",
          "delete-incident-step",
        ].includes(change.type),
      );

      await Promise.all(
        incidentOps.reverse().map(async (change) => {
          switch (change.type) {
            case "add-incident":
              const { data: newIncident, error: addError } = await supabase
                .from("incidents")
                .insert(change.data)
                .select()
                .single();
              if (addError) throw addError;
              return newIncident;

            case "update-incident":
              const { error: updateError } = await supabase
                .from("incidents")
                .update(change.data)
                .eq("id", change.data.id);
              if (updateError) throw updateError;
              break;

            case "delete-incident":
              const { error: deleteError } = await supabase
                .from("incidents")
                .delete()
                .eq("id", change.data.id);
              if (deleteError) throw deleteError;
              break;
          }
        }),
      );

      await Promise.all(
        stepOps.reverse().map(async (change) => {
          switch (change.type) {
            case "add-incident-step":
              const { error: addStepError } = await supabase
                .from("incident_steps")
                .insert(change.data);
              if (addStepError) throw addStepError;
              break;

            case "update-incident-step":
              const { error: updateStepError } = await supabase
                .from("incident_steps")
                .update(change.data)
                .eq("id", change.data.id);
              if (updateStepError) throw updateStepError;
              break;

            case "delete-incident-step":
              const { error: deleteStepError } = await supabase
                .from("incident_steps")
                .delete()
                .eq("id", change.data.id);
              if (deleteStepError) throw deleteStepError;
              break;
          }
        }),
      );

      setIncidents(localIncidents);
    },
  });

  return mutation;
}
