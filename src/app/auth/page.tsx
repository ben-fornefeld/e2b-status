"use client";

import dynamic from "next/dynamic";

// importing AuthForm dynamically to prevent hydration issues cause by useTheme
const AuthForm = dynamic(() => import("@/components/auth/auth-form"), {
  ssr: false,
});

export default function AuthPage() {
  return (
    <div className="flex-1 flex flex-col min-w-64">
      <h1 className="text-2xl font-medium mb-8">Sign in</h1>
      <AuthForm />
    </div>
  );
}
