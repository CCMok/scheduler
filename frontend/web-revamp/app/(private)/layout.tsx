import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/external/shadcn/components/ui/sidebar";
import { ReactNode } from "react";
import AppSidebar from "./_components/app-sidebar";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar variant='inset' />
      <SidebarInset>
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}