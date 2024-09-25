import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import Providers from "@/components/Providers";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Light Saas Landing Page",
  description: "Template created by Frontend Tribe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="relative">
      <Providers>
      <body
        className={twMerge(
          dmSans.className,
          "antialiased bg-gradient-to-br from-[#D0E8ED] to-[#E6F0F2]",
        )}
      >
        {children}
      </body>
      </Providers>
    </html>
  );
}
