import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { Separator } from "@/external/shadcn/components/ui/separator";
import { ComponentProps } from "react";
import { SidebarTrigger } from "@/external/shadcn/components/ui/sidebar";
import CustomBreadcrumb from "../../breadcrumb/custom-breadcrumb";

type Props = ChildrenProps & ComponentProps<typeof CustomBreadcrumb>

export default function SidebarInsetLayout({
  children,
  ...props
}: Readonly<Props>) {
  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 items-center px-4">
        <SidebarTrigger />
        <CustomBreadcrumb {...props} />
      </header>
      <Separator />
      <main className='p-4 flex-1 overflow-auto'>
        {children}
      </main>
    </>
  )
}