import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export const runtime = "edge";

async function checkStatus() {
  // using admin client here because this is a system-level operation
  // running on a cron job, not a user-initiated action

  const supabase = createAdminClient();

  const startTime = Date.now();

  try {
    const response = await fetch(process.env.E2B_MONITOR_API_URL!, {
      method: "POST",
      headers: {
        "X-API-Key": process.env.E2B_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        templateID: process.env.E2B_TEMPLATE_ID!,
      }),
    });

    const responseTime = Date.now() - startTime;

    await supabase.from("status_checks").insert({
      response_time_ms: responseTime,
      success: response.status === 201,
      http_status: response.status,
      error_message: response.status !== 201 ? await response.text() : null,
    });

    return { success: true, responseTime };
  } catch (error) {
    const errorString = error instanceof Error ? error.message : String(error);

    await supabase.from("status_checks").insert({
      success: false,
      error_message: errorString,
      response_time_ms: Date.now() - startTime,
    });

    return {
      success: false,
      error: errorString,
    };
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await checkStatus();

  return NextResponse.json(result);
}
