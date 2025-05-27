import { SidebarTrigger } from "@/external/shadcn/components/ui/sidebar";

export default function PrivateHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 items-center px-4">
      <SidebarTrigger />
    </header>
  )
}