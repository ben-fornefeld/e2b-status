"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useTheme } from "next-themes";

export default function SignIn() {
  const supabase = createClientComponentClient();

  const { resolvedTheme: theme } = useTheme();

  return (
    <div className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium mb-8">Sign in</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme={theme}
        providers={["github"]}
        view="sign_in"
        showLinks={false}
        socialLayout="horizontal"
        onlyThirdPartyProviders
        redirectTo={window.location.origin}
      />
    </div>
  );
}
