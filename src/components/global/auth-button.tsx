"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { supabase } from "@/utils/supabase/client";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";
import { useUser } from "@/lib/hooks/use-user";

export default function AuthButton() {
  const { user } = useUser();

  const handleAuthButtonClick = useCallback(async () => {
    if (user) {
      await supabase.auth.signOut();
    } else {
      await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_BASE_URL,
        },
      });
    }
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
    >
      <Button
        variant="surfaceGradient"
        className="flex items-center gap-2"
        onClick={handleAuthButtonClick}
      >
        {user ? (
          <Avatar className="size-6">
            <AvatarImage
              src={user?.user_metadata?.avatar_url ?? ""}
              alt={user?.email ?? ""}
            />
            <AvatarFallback>
              {user?.email?.charAt(0).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <GitHubLogoIcon />
        )}
        <span>{user ? "Sign Out" : "Sign In"}</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
