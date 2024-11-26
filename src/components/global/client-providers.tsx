"use client";

import { CustomUserContextProvider } from "@/lib/hooks/use-user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomUserContextProvider>{children}</CustomUserContextProvider>
    </QueryClientProvider>
  );
}
