"use client";

import { User } from "@supabase/supabase-auth-helpers/react";
import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/components/global/client-providers";
import { checkIsAdmin } from "@/utils/utils";

export type E2BUser = User & {
  // should contain e2b user details
};

type UserContextType = {
  isLoading: boolean;
  session: Session | null;
  user: E2BUser | null;
  error: Error | null;
  isAdmin: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const CustomUserContextProvider = (props: any) => {
  const supabase = createPagesBrowserClient();

  const {
    data: session,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;

      return session;
    },
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        session &&
        (event === "SIGNED_IN" ||
          event === "SIGNED_OUT" ||
          event === "TOKEN_REFRESHED" ||
          event === "USER_UPDATED")
      ) {
        queryClient.invalidateQueries({ queryKey: ["session"] });
      }
    });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      error,
      session,
      user: session?.user ?? null,
      isAdmin: session?.user?.email ? checkIsAdmin(session.user.email) : false,
    }),
    [isLoading, error, session]
  );

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};
