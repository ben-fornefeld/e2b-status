import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const API_TEST_COUNT = 10;

async function singleCheck() {
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

  return {
    response_time_ms: responseTime,
    success: response.status === 201,
    http_status: response.status,
    error_message: response.status !== 201 ? await response.text() : null,
    timestamp: new Date().toUTCString(),
  };
}

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for (let i = 0; i < API_TEST_COUNT; i++) {
          const result = await singleCheck();
          controller.enqueue(encoder.encode(JSON.stringify(result) + "\n"));
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
