import type { Metadata } from "next";
import "./globals.css";
import { ChildrenProps } from "@/libs/_general/props/children-props";
import { Noto_Sans_HK } from "next/font/google";
import { cn } from "@/external/shadcn/libs/utils";
import { Toaster } from "sonner";
import { ThemeProvider } from "./_components/theme-provider";

export const metadata: Metadata = {
  title: "Scheduler",
  description: "Application for scheduling",
};

const noto = Noto_Sans_HK({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<ChildrenProps>) {
  return (
    <html lang="zh-Hant-HK" suppressHydrationWarning>
      <body
        className={cn('antialiased', noto.className)}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
