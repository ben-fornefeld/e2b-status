"use client";

import { StatusCheck } from "@/types/status-check";
import { FC } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StatusChartProps {
  statusChecks: StatusCheck[];
}

export const StatusChart: FC<StatusChartProps> = ({ statusChecks }) => {
  const data = statusChecks.map((check) => ({
    timestamp: new Date(check.timestamp),
    responseTime: check.response_time_ms,
    success: check.success,
  }));

  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatTooltip = (value: any, name: string) => {
    if (name === "responseTime") {
      return [`${value} ms`, "Response Time"];
    }
    return [value, name];
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis
            dataKey="timestamp"
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            angle={-45}
            textAnchor="end"
            tickFormatter={formatXAxis}
            interval="preserveStartEnd"
            minTickGap={50}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            label={{
              value: "Response Time (ms)",
              angle: -90,
              position: "insideLeft",
              fill: "hsl(var(--muted-foreground))",
            }}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip
            labelFormatter={(label) => {
              const date = new Date(label);
              return date.toLocaleString([], {
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
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
            labelStyle={{
              color: "hsl(var(--foreground))",
            }}
          />
          <Line
            type="monotone"
            dataKey="responseTime"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", r: 2 }}
            animationDuration={500}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
