import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { httpBatchLink, loggerLink } from "@trpc/client";
import superjson from "superjson";

import { api } from "@/utils/api";
import { getBaseUrl } from "@/utils/base-url";
import { clientPersister } from "@/utils/persister";

export function TRPCProvider(props: { children: React.ReactNode }) {
  const { getToken } = useAuth();
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
          colorMode: "ansi",
        }),
        httpBatchLink({
          transformer: superjson,
          url: `${getBaseUrl()}/trpc`,
          async headers() {
            console.log(`${getBaseUrl()}/trpc`);
            const headers = new Map<string, string>();
            headers.set("x-trpc-source", "mobile");
            const token = await getToken();
            if (token) headers.set("authorization", `Bearer ${token}`);
            return Object.fromEntries(headers);
          },
        }),
      ],
    }),
  );
  // TODO: add a buster to invalidate the cache, set the maxAge to a reasonable value,
  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister: clientPersister }}
      >
        {props.children}
      </PersistQueryClientProvider>
    </api.Provider>
  );
}
