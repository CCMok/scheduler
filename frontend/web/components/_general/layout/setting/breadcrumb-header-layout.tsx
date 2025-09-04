import { ChildrenProps } from "@/libs/share/_general/props/children-props"
import BreadcrumbHeader from "../../header/breadcrumb-header"
import { ComponentProps } from "react"

type Props = ChildrenProps & ComponentProps<typeof BreadcrumbHeader>

export default function BreadcrumbHeaderLayout({
  children,
  ...props
}: Readonly<Props>) {
  return (
    <div className='space-y-4'>
      <BreadcrumbHeader {...props} />
      {children}
    </div>
  )
}