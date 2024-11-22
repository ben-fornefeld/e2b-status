"use client";

import { useUser } from "@/lib/hooks/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";

export default function DashboardButton() {
  const { user } = useUser();

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
    >
      <Button variant="surfaceGradient" asChild>
        <a href="https://e2b.dev/dashboard" className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage
              src={user?.user_metadata?.avatar_url ?? ""}
              alt={user?.email ?? ""}
            />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <span>Visit Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </Button>
    </motion.div>
  );
}
