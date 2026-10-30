import { SidebarTrigger } from "@/external/shadcn/components/ui/sidebar";
import { ReactNode } from "react";

export default function HeaderLayout({
  children,
  title,
  actions,
}: Readonly<{
  children?: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
}>) {
  return (
    <>
      <header className="flex h-11 shrink-0 items-center gap-2 border-b border-border bg-card/70 px-3 backdrop-blur-sm">
        <SidebarTrigger className="-ml-1" />
        <div className="min-w-0 flex-1 truncate text-sm font-medium">
          {title}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </header>
      <main className="flex-1 overflow-auto p-3">{children}</main>
    </>
  );
}
