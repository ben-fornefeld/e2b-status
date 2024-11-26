"use server";

import { Status } from "@/types/status";
import { StatusCheck } from "@/types/status-check";
import { supabaseAdmin } from "@/utils/supabase/server";
import { PostgrestResponse } from "@supabase/supabase-js";

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
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const { data, error }: PostgrestResponse<StatusCheck> = await supabaseAdmin
      .from("status_checks")
      .select("*")
      .gte("timestamp", thirtyDaysAgo.toISOString())
      .lte("timestamp", now.toISOString())
      .order("timestamp", { ascending: true })
      .limit(10000);

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
      const { data, error }: PostgrestResponse<StatusCheck> =
        await supabaseAdmin
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

interface GetUptimeSuccessResponse {
  type: "success";
  uptime: number[];
}

type GetUptimeResponse = ErrorResponse | GetUptimeSuccessResponse;

const UPTIME_DAYS = 90;

export const getUptime = async (): Promise<GetUptimeResponse> => {
  try {
    const { data, error }: PostgrestResponse<StatusCheck> = await supabaseAdmin
      .from("status_checks")
      .select("*")
      .gte(
        "timestamp",
        new Date(Date.now() - UPTIME_DAYS * 24 * 60 * 60 * 1000).toISOString(),
      )
      .order("timestamp", { ascending: false });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      // fill 100% uptime for all days if no data
      return {
        type: "success",
        uptime: Array(UPTIME_DAYS).fill(100),
      };
    }

    const dates = Array.from({ length: UPTIME_DAYS }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (UPTIME_DAYS - 1 - i));
      return date.toISOString().split("T")[0];
    });

    // group checks by day
    const dailyChecks = data.reduce(
      (acc, check) => {
        const day = new Date(check.timestamp).toISOString().split("T")[0];
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(check);
        return acc;
      },
      {} as Record<string, StatusCheck[]>,
    );

    // percentage calculations
    const uptimeArray = dates.map((date) => {
      const checks = dailyChecks[date] || [];
      if (checks.length === 0) {
        return 100;
      }

      const failures = checks.filter(
        (check) => check.http_status !== 201,
      ).length;
      const uptimePercentage =
        ((checks.length - failures) / checks.length) * 100;

      return Math.round(uptimePercentage * 100) / 100;
    });

    return {
      type: "success",
      uptime: uptimeArray,
    };
  } catch (error) {
    console.error(error);
    return {
      type: "error",
      message: "Failed to calculate uptime",
    };
  }
};
