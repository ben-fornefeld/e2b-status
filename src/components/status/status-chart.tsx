"use client";

import { useStatusData } from "@/lib/hooks/use-status-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo, useCallback } from "react";

export default function LatencyChart() {
  const [timeRange, setTimeRange] = useState("1h");
  const { statusChecks } = useStatusData();

  const filterDataByTimeRange = (data: any[], range: string) => {
    const now = new Date();
    const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const ranges: { [key: string]: number } = {
      "1h": 60 * 60 * 1000,
      "6h": 6 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };
    const cutoff = new Date(utcNow.getTime() - ranges[range]);
    return data.filter(
      (item) => new Date(item.timestamp).getTime() > cutoff.getTime(),
    );
  };

  const data = useMemo(
    () =>
      filterDataByTimeRange(
        statusChecks.map((check) => ({
          timestamp: new Date(check.timestamp + "Z"),
          responseTime: check.response_time_ms,
          success: check.success,
        })),
        timeRange,
      ),
    [statusChecks, timeRange],
  );

  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatTooltip = (value: any, name: string) => {
    if (name === "responseTime") {
      return [`${value} ms`, "Response Time"];
    }
    return [value, name];
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl">Latency</h2>
      <div className="w-full space-y-4">
        <div className="relative h-[24dvh]">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="absolute right-10 top-4 z-10 w-[140px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <ResponsiveContainer className="py-5 pl-3 pr-10">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 5,
                bottom: 30, // Add more bottom margin to accommodate angled labels
              }}
            >
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                angle={-45}
                textAnchor="end"
                tickFormatter={formatXAxis}
                interval="preserveStartEnd"
                minTickGap={50}
                stroke="hsl(var(--muted-foreground))"
                dy={10} // Optional: Adjust label position vertically if needed
              />
              <YAxis
                domain={[0, 1500]}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                label={{
                  value: "Response Time (ms)",
                  angle: -90,
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 12,
                  dx: -30,
                }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                    day: "numeric",
                    month: "short",
                  });
                }}
                formatter={formatTooltip}
                contentStyle={{
                  backgroundColor: "hsl(var(--background-300), 0.6)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid hsl(var(--border-300))",
                  borderRadius: "16px",
                  padding: "1rem",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                }}
              />
              <defs>
                <linearGradient
                  id="responseTimeGradient"
                  x1="0"
                  y1="1"
                  x2="0"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(var(--primary-300))"
                    stopOpacity={1}
                  />
                  <stop
                    offset="85%"
                    stopColor="hsl(var(--primary-000))"
                    stopOpacity={1}
                  />
                </linearGradient>
              </defs>

              <Line
                key={`${timeRange}-${data.length}`}
                type="monotone"
                dataKey="responseTime"
                stroke="url(#responseTimeGradient)"
                strokeWidth={2}
                dot={false}
                animationDuration={1000}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
