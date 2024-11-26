"use server";

import { Incident, IncidentStep, IncidentWithSteps } from "@/types/incident";
import { supabaseAdmin } from "@/utils/supabase/server";
import { PostgrestResponse } from "@supabase/supabase-js";

interface ErrorResponse {
  type: "error";
  message: string;
}

interface GetIncidentsSuccessResponse {
  type: "success";
  incidents: IncidentWithSteps[];
}

type GetIncidentsResponse = ErrorResponse | GetIncidentsSuccessResponse;

export const getIncidents = async (): Promise<GetIncidentsResponse> => {
  try {
    // only get incidents from the last 14 days
    const { data, error }: PostgrestResponse<IncidentWithSteps> =
      await supabaseAdmin
        .from("incidents")
        .select(
          `
          *,
          steps:incident_steps (*)
        `,
        )
        .gte(
          "timestamp",
          new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        )
        .order("timestamp", { ascending: false });

    if (error) {
      console.error(error);
      return {
        type: "error",
        message: error.message,
      };
    }

    // sort manually to ensure correct order (supabase nested order not working correctly)
    const incidentsWithSortedSteps = data?.map((incident) => ({
      ...incident,
      steps: incident.steps.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      ),
    }));

    return {
      type: "success",
      incidents: incidentsWithSortedSteps,
    };
  } catch (error) {
    console.error(error);
    return {
      type: "error",
      message: "Error fetching incidents",
    };
  }
};
