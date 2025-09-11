'use client'

import { Separator } from "@/external/shadcn/components/ui/separator";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";

type Props = ChildrenProps

export default function Header({
  children,
}: Readonly<Props>) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 min-h-9">
        {children}
      </div>
      <Separator />
    </div>
  )
}