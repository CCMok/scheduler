import { SidebarInset, SidebarProvider } from "@/external/shadcn/components/ui/sidebar";
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
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}