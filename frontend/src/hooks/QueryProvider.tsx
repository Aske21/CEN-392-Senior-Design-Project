"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";

const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 60000,
    },
  },
};

const QueryProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [queryClientStore] = useState(
    () => new QueryClient(queryClientOptions)
  );
  return (
    <QueryClientProvider client={queryClientStore}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default QueryProvider;
