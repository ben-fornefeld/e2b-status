"use server";

import { Incident } from "@/types/incident";
import { supabaseAdmin } from "@/utils/supabase/server";
import { PostgrestResponse } from "@supabase/supabase-js";

interface ErrorResponse {
  type: "error";
  message: string;
}

interface GetIncidentsSuccessResponse {
  type: "success";
  incidents: Incident[];
}

type GetIncidentsResponse = ErrorResponse | GetIncidentsSuccessResponse;

export const getIncidents = async (): Promise<GetIncidentsResponse> => {
  try {
    // only get incidents from the last 14 days
    const { data, error }: PostgrestResponse<Incident> = await supabaseAdmin
      .from("incidents")
      .select("*")
      .gte(
        "created_at",
        new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      );

    if (error) {
      console.error(error);

      return {
        type: "error",
        message: error.message,
      };
    }

    return {
      type: "success",
      incidents: data,
    };
  } catch (error) {
    console.error(error);

    return {
      type: "error",
      message: "Error fetching incidents",
    };
  }
};
