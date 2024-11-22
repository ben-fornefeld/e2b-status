"use server";

import { StatusCheck } from "@/types/status-check";
import { createAdminClient } from "@/utils/supabase/server";

interface ErrorResponse {
  type: "error";
  message: string;
}

interface GetStatusChecksSuccessResponse {
  type: "success";
  status_checks: StatusCheck[];
}

type GetStatusChecksResponse = ErrorResponse | GetStatusChecksSuccessResponse;

export const getStatusChecks = async (): Promise<GetStatusChecksResponse> => {
  try {
    const supabase = createAdminClient();

    // only get status checks from the last 24 hours
    const { data, error } = await supabase
      .from("status_checks")
      .select("*")
      .gte(
        "timestamp",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
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
      status_checks: data,
    };
  } catch (error) {
    console.error(error);

    return {
      type: "error",
      message: "Failed to fetch status checks",
    };
  }
};
