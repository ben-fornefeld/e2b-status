"use client";

import { useStatusData } from "@/lib/hooks/use-status-data";
import { cn } from "@/lib/utils";
import { CaretUpIcon } from "@radix-ui/react-icons";
import { colorVariants, neonVariants } from "@/lib/variants";
import { motion } from "framer-motion";
import { exponentialEaseInOut } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useBreakpoint } from "use-breakpoint";

function UptimeCard() {
  const { uptime } = useStatusData();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { breakpoint } = useBreakpoint({
    xs: 0,
    sm: 640,
    md: 768,
  });

  const displayedUptime = uptime.slice(-(breakpoint === "xs" ? 60 : 90));

  const averageUptime =
    displayedUptime.reduce((acc, curr) => acc + curr, 0) /
    displayedUptime.length;

  return (
    <div className={cn("w-full space-y-4 sm:px-10")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(neonVariants({ neon: "green" }), "rounded-full")}>
            <CaretUpIcon className="size-4" />
          </div>
          <h3 className="text-lg">Uptime</h3>
        </div>
        <span className="bg-gradient-to-b from-green-400 to-green-600 bg-clip-text font-medium text-transparent">
          {averageUptime.toFixed(2)}%
        </span>
      </div>

      <div className="px-2">
        <motion.div
          className="relative flex h-8 items-end gap-px"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.003,
              },
            },
          }}
        >
          <AnimatePresence>
            {hoveredIndex !== null && (
              <motion.div
                layoutId="uptime-tooltip"
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                transition={{ duration: 0.2, delay: 0.2 }}
                className={cn(
                  colorVariants({ variant: "darkGradient" }),
                  "text-x absolute bottom-full mb-2 rounded-md px-2 py-1",
                )}
                style={{
                  left: `${(hoveredIndex / displayedUptime.length) * 100}%`,
                  transform: "translateX(-50%)",
                }}
              >
                {displayedUptime[hoveredIndex].toFixed(2)}%
              </motion.div>
            )}
          </AnimatePresence>

          {displayedUptime.map((value, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { height: 0, opacity: 0 },
                visible: { height: "100%", opacity: 1 },
              }}
              transition={{
                duration: 0.35,
                ease: (t) => exponentialEaseInOut(t),
              }}
              className={cn(
                "flex-1 cursor-pointer rounded-[3px]",
                value === 100
                  ? "bg-gradient-to-b from-green-500 to-green-800 hover:from-green-300 hover:to-green-900"
                  : "bg-gradient-to-b from-yellow-500 to-yellow-800 hover:from-yellow-300 hover:to-yellow-900",
              )}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </motion.div>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{displayedUptime.length} days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export default UptimeCard;
