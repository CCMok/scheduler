import { Separator } from "@/external/shadcn/components/ui/separator";
import { SidebarTrigger } from "@/external/shadcn/components/ui/sidebar";
import { ReactNode } from "react";

export default function HeaderLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <header className="flex h-12 p-4 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <SidebarTrigger />
        {/* TODO breadcrumb */}
      </header>
      <Separator />
      <main className='p-4 flex-1 overflow-auto'>
        {children}
      </main>
    </>
  )
}