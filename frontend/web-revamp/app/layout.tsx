import type { Metadata } from "next";
import { Noto_Sans_HK } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/_general/theme/theme-provider";
import { cn } from "@/external/shadcn/libs/utils";
import FormDevtools from "@/components/_general/form/devtools/form-devtools";
import { Toaster } from "sonner";

const noto = Noto_Sans_HK({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Scheduler",
  description: "Application for scheduling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant-HK" suppressHydrationWarning>
      <body
        className={cn(noto.className, 'antialiased')}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <FormDevtools />
      </body>
    </html>
  );
}
