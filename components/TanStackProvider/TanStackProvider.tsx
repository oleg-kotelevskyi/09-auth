"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

interface TanStackProviderProps {
  children: React.ReactNode;
}

export const TanStackProvider: React.FC<TanStackProviderProps> = ({
  children,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error: unknown) => {
              if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401 || status === 404) {
                  return false;
                }
              }
              return failureCount < 3;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
