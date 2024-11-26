"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { colorVariants } from "@/lib/variants";
import { motion, AnimatePresence } from "framer-motion";
import { LightningBoltIcon, PlayIcon } from "@radix-ui/react-icons";
import { STRESS_TEST_COUNT } from "@/config/stress-test-config";

export default function StatusStress() {
  const [isFetching, setIsFetching] = useState(false);

  const [checks, setChecks] = useState<
    { response_time_ms: number; timestamp: number }[]
  >([]);

  const startStressTest = async () => {
    setChecks([]);
    setIsFetching(true);

    const response = await fetch("/api/stress-test-sandbox");
    const reader = response.body?.getReader();

    setIsFetching(false);

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = new TextDecoder().decode(value);
      const results = chunk
        .split("\n")
        .filter(Boolean)
        .map((line) => JSON.parse(line));

      setChecks((prev) => [...prev, ...results]);
    }
  };

  const generateCircularPath = (data: typeof checks) => {
    if (data.length === 0) return "";

    const centerX = 150;
    const centerY = 150;
    const baseRadius = 100;
    const maxHeight = 100;

    return (
      data
        .map((check, i) => {
          const angle = (i * 2 * Math.PI) / STRESS_TEST_COUNT;
          const normalizedResponse = Math.min(check.response_time_ms / 1500, 1);
          const spikeHeight = normalizedResponse * maxHeight;
          const radius = baseRadius + spikeHeight;

          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);

          return `${i === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ") + (data.length === STRESS_TEST_COUNT ? " Z" : "")
    );
  };

  return (
    <div className="relative mb-10 flex flex-col gap-6 px-3">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl leading-10 text-muted-foreground">
          We love Speed{" "}
          <LightningBoltIcon className="inline h-6 w-6 align-baseline text-primary" />{" "}
          <br />
          <span className="text-3xl text-foreground">Find out Yourself </span>
        </h2>
        <p className="text-md mt-3 max-w-[300px] text-muted-foreground">
          See Real-time results for executing{" "}
          <span
            className={cn(
              colorVariants({ variant: "surfaceGradient" }),
              "inline-block w-min whitespace-nowrap rounded-sm px-2 py-0.5 font-mono text-xs text-foreground",
            )}
          >
            code
          </span>{" "}
          in a <span className="text-foreground">python</span> sandbox{" "}
          <span className="text-foreground">{STRESS_TEST_COUNT}</span> times.
        </p>
      </div>

      <AnimatePresence>
        {checks.length === 0 && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="mt-6 w-min self-center"
          >
            <Button
              onClick={startStressTest}
              size="lg"
              className={cn("rounded-full")}
              disabled={isFetching}
            >
              <PlayIcon />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {checks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full space-y-2"
        >
          <div className="relative h-[300px] w-full">
            <svg viewBox="0 0 300 300" className="h-full w-full">
              <motion.circle
                cx="150"
                cy="150"
                r="100"
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                opacity="0.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />

              <motion.path
                key={
                  checks.length === STRESS_TEST_COUNT
                    ? "stress-test-path-full"
                    : undefined
                }
                d={generateCircularPath(checks)}
                fill="none"
                stroke="url(#responseTimeGradient)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                }}
              />

              <text
                x="150"
                y="140"
                textAnchor="middle"
                className="fill-muted-foreground text-xs"
              >
                {checks.length} runs
              </text>
              <text
                x="150"
                y="165"
                textAnchor="middle"
                className="fill-muted-foreground text-xs"
              >
                {checks.length > 0
                  ? (
                      checks.reduce(
                        (acc, curr) => acc + curr.response_time_ms,
                        0,
                      ) / checks.length
                    ).toFixed(0) + "ms average"
                  : "N/A"}
              </text>

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
            </svg>
          </div>
        </motion.div>
      )}
    </div>
  );
}
