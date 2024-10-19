"use client"
import { useState, useEffect, use, PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient } from "@trpc/client";
import { httpBatchLink } from "@trpc/client";
import {trpc} from "@/app/_trpc/client";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

const Providers = ({children}:PropsWithChildren) => {
    const[queryClient] = useState(() => new QueryClient());
    const[trpcClient] = useState(() => 
        trpc.createClient({
            links:[
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                }),
            ],
        })
    )
    return(
        <trpc.Provider
        client={trpcClient}
        queryClient={queryClient}
        >
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider> 
    )
}
export default Providers;
