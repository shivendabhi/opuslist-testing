import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
import Providers from "@/components/Providers";

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
  return (
    <html lang="en" className="relative">
      <Providers>
      <body
        className={twMerge(
          dmSans.className,
          "antialiased bg-gradient-to-br from-[#C0E0E8] to-[#E0F0F5]",
        )}
      >
        {children}
      </body>
      </Providers>
    </html>
  );
}
