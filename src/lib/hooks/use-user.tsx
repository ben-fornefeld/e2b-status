"use client";

import { User } from "@supabase/supabase-auth-helpers/react";
import { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { checkIsAdmin } from "@/utils/utils";
import { supabase } from "@/utils/supabase/client";

type UserContextType = {
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export const CustomUserContextProvider = (props: any) => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAdmin: session?.user?.email ? checkIsAdmin(session.user.email) : false,
    }),
    [session],
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
