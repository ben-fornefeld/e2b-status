import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const response = await fetch(`${process.env.VERCEL_URL}/api/status-check`);
  return NextResponse.json(await response.json());
}

export const config = {
  cron: "*/5 * * * *", // every 5 minutes
};
