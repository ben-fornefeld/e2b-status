"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useTheme } from "next-themes";

export default function AuthForm() {
  const supabase = createClientComponentClient();
  const { resolvedTheme: theme } = useTheme();

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
      theme={theme}
      providers={["github"]}
      view="sign_in"
      showLinks={false}
      socialLayout="horizontal"
      onlyThirdPartyProviders
      redirectTo={process.env.NEXT_PUBLIC_BASE_URL!}
    />
  );
}
