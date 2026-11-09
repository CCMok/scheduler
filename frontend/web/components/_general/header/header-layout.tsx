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
    <div className="private-page">
      <header className="private-header">
        <SidebarTrigger className="-ml-1" />
        <div className="min-w-0 flex-1 truncate text-sm font-medium tracking-tight">
          {title}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-1.5">{actions}</div>
        ) : null}
      </header>
      <main className="private-main">{children}</main>
    </div>
  );
}
