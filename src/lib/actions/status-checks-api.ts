"use server";

import { Status } from "@/types/status";
import { StatusCheck } from "@/types/status-check";
import { createAdminClient } from "@/utils/supabase/server";
import {
  PostgrestError,
  PostgrestResponse,
  PostgrestSingleResponse,
} from "@supabase/supabase-js";

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

interface CheckOperationalityResponse {
  type: "success";
  status: Status;
}

const RECENT_CHECKS_COUNT = 12;
const FAILURE_THRESHOLD = RECENT_CHECKS_COUNT / 2;

export const checkOperationality =
  async (): Promise<CheckOperationalityResponse> => {
    try {
      const supabase = createAdminClient();

      const { data, error }: PostgrestResponse<StatusCheck> = await supabase
        .from("status_checks")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(RECENT_CHECKS_COUNT);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        // no recent checks implies system is down
        return {
          type: "success",
          status: "down",
        };
      }

      const failures = data.filter((check) => check.http_status !== 201).length;

      // calculate the status based on the number of failures
      let status: Status;

      if (failures === 0) {
        status = "operational";
      } else if (failures <= FAILURE_THRESHOLD) {
        status = "degraded";
      } else {
        status = "down";
      }

      return {
        type: "success",
        status,
      };
    } catch (error) {
      console.error(error);

      // defaulting to degraded here as well
      return {
        type: "success",
        status: "degraded",
      };
    }
  };
