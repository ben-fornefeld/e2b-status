"use client";

import { useStatusData } from "@/lib/hooks/use-status-data";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { CaretUpIcon } from "@radix-ui/react-icons";
import { colorVariants, neonVariants } from "@/lib/variants";
import { Badge } from "../ui/badge";

function UptimeCard() {
  const { uptime } = useStatusData();

  const averageUptime =
    uptime.reduce((acc, curr) => acc + curr, 0) / uptime.length;

  return (
    <div className={cn("w-full space-y-4 px-10")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(neonVariants({ neon: "green" }), "rounded-full")}>
            <CaretUpIcon className="size-4" />
          </div>
          <h3 className="text-lg">Sandboxes Uptime</h3>
        </div>
        <span className="bg-gradient-to-b from-green-400 to-green-600 bg-clip-text font-medium text-transparent">
          {averageUptime.toFixed(2)}%
        </span>
      </div>

      <div className="relative h-8 px-2">
        <div className="flex h-full gap-px">
          {uptime.map((value, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 rounded-[3px]",
                value === 100
                  ? "bg-gradient-to-b from-green-500 to-green-800"
                  : "bg-gradient-to-b from-yellow-500 to-yellow-800",
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>90 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export default UptimeCard;
