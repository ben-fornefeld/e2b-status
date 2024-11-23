import { cn } from "@/utils/cn";
import { cva } from "class-variance-authority";

export const colorVariants = cva("transition-all border duration-200", {
  variants: {
    variant: {
      surface: "bg-background-200 border-border-200",
      surfaceGradient:
        "bg-gradient-to-br from-background-100 to-background-200 border-border-300",
      surfaceGradientHover:
        "hover:bg-gradient-to-br hover:from-background-000 hover:to-background-300",
      dark: "bg-background-500 border-border-500",
      darkGradient:
        "bg-gradient-to-b from-background-200 to-background-500 border-border-400",
      darkGradientHover:
        "hover:bg-gradient-to-br hover:from-background-200 hover:to-background-500",
    },
  },
  defaultVariants: {
    variant: "surface",
  },
});

export const neonVariants = cva("border transition-all duration-300", {
  variants: {
    neon: {
      orange: cn(
        "border-orange-400 dark:bg-orange-950/30 bg-orange-100/40 dark:text-orange-50 text-orange-600",
        "dark:shadow-[inset_0_0_20px_rgba(251,146,60,0.3)] shadow-[inset_0_0_20px_rgba(251,146,60,0.1)]",
        "dark:hover:shadow-[inset_0_0_25px_rgba(251,146,60,0.3)] hover:shadow-[inset_0_0_25px_rgba(251,146,60,0.2)]",
        "hover:border-orange-300 dark:hover:bg-orange-950/40 hover:bg-orange-100/50",
      ),
      gray: cn(
        "border-gray-400 dark:bg-gray-950/30 bg-gray-100/40 dark:text-gray-50 text-gray-600",
        "dark:shadow-[inset_0_0_20px_rgba(156,163,175,0.3)] shadow-[inset_0_0_20px_rgba(156,163,175,0.1)]",
        "dark:hover:shadow-[inset_0_0_25px_rgba(156,163,175,0.3)] hover:shadow-[inset_0_0_25px_rgba(156,163,175,0.2)]",
        "hover:border-gray-300 dark:hover:bg-gray-950/40 hover:bg-gray-100/50",
      ),
    },
  },
  defaultVariants: {
    neon: "orange",
  },
});
