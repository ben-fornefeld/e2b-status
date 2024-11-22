import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/server";

export const runtime = "edge";

async function checkStatus() {
  // using admin client here because this is a system-level operation
  // running on a cron job, not a user-initiated action

  const supabase = createAdminClient();

  const startTime = Date.now();

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

  return { success: true };
}

export async function GET(req: NextRequest) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await checkStatus();

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
