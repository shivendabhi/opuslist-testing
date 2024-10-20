"use client"
import { useState, useEffect, PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "@/app/_trpc/client";
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

// Initialize PostHog
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'identified_only',
  })
}

const Providers = ({ children }: PropsWithChildren) => {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() => 
        trpc.createClient({
            links:[
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                }),
            ],
        })
    )
    return (
        <trpc.Provider
        client={trpcClient}
        queryClient={queryClient}
        >
            <QueryClientProvider client={queryClient}>
                <PostHogProvider client={posthog}>
                    {children}
                </PostHogProvider>
            </QueryClientProvider>
        </trpc.Provider> 
    )
}

export default Providers;
