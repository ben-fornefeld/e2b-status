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
import { useState, useMemo } from "react";

export default function LatencyChart() {
  const [timeRange, setTimeRange] = useState("1h");
  const { statusChecks } = useStatusData();

  const aggregateDataByDay = (data: any[]) => {
    const dailyData = data.reduce((acc: any, curr) => {
      const date = new Date(curr.timestamp);
      const dateKey = date.toISOString().split("T")[0];

      if (!acc[dateKey]) {
        acc[dateKey] = {
          values: [],
          timestamp: new Date(dateKey),
        };
      }

      acc[dateKey].values.push(curr.responseTime);
      return acc;
    }, {});

    return Object.values(dailyData).map((day: any) => ({
      timestamp: day.timestamp,
      responseTime: Math.round(
        day.values.reduce((sum: number, val: number) => sum + val, 0) /
          day.values.length,
      ),
    }));
  };

  const filterDataByTimeRange = (data: any[], range: string) => {
    if (data.length === 0) return [];

    const latestDataPoint = new Date(data[data.length - 1].timestamp);

    const ranges: { [key: string]: number } = {
      "1h": 60 * 60 * 1000,
      "6h": 6 * 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };

    const cutoff = new Date(latestDataPoint.getTime() - ranges[range]);

    const filtered = data.filter((item) => {
      const itemTime = new Date(item.timestamp).getTime();
      return itemTime > cutoff.getTime();
    });

    if (range === "7d" || range === "30d") {
      return aggregateDataByDay(filtered);
    }

    return filtered;
  };

  const data = useMemo(() => {
    const mappedData = statusChecks.map((check) => ({
      timestamp: new Date(check.timestamp).toISOString(),
      responseTime: check.response_time_ms,
      success: check.success,
    }));

    return filterDataByTimeRange(mappedData, timeRange);
  }, [statusChecks, timeRange]);

  const maxDomain = useMemo(() => {
    if (data.length === 0) return 1500;
    const maxValue = Math.max(...data.map((d) => d.responseTime));
    return Math.ceil(maxValue + 700);
  }, [data]);

  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp);
    if (timeRange === "7d" || timeRange === "30d") {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
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
      <div className="flex items-center justify-between">
        <div className="w-full">
          <h2 className="text-2xl">Latency</h2>
          <p className="text-md mt-1 flex max-w-[80%] text-muted-foreground">
            How fast we create your Sandboxes.
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="z-10 w-[200px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="6h">Last 6 Hours</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full space-y-4">
        <div className="relative h-[200px] md:h-[260px]">
          <ResponsiveContainer className="md:py-5 md:pl-3 md:pr-10">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 5,
                bottom: 30,
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
                dy={10}
              />
              <YAxis
                domain={[0, maxDomain]}
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}s`}
                label={{
                  value: "Response Time (s)",
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
