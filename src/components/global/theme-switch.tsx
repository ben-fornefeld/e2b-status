"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex rounded-md border">
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-r-none ${theme === "dark" ? "bg-muted" : ""}`}
        onClick={() => setTheme("dark")}
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-l-none border-l ${theme === "light" ? "bg-muted" : ""}`}
        onClick={() => setTheme("light")}
      >
        <Sun className="h-4 w-4" />
      </Button>
    </div>
  );
}
