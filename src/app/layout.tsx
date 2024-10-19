import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import Providers from "@/components/Providers";
import { trpc, trpcClient } from './_trpc/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpusList",
  description:
    "Plan and schedule your week in minutes with an app designed to make effective time management as easy as possible",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <html lang="en" className="relative">
      <Providers>
        <body
          className={twMerge(
            dmSans.className,
            "antialiased ",
          )}
        >
          <QueryClientProvider client={queryClient}>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
              {children}
            </trpc.Provider>
          </QueryClientProvider>
        </body>
      </Providers>
    </html>
  );
}
