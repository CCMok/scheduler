import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/external/shadcn/components/ui/breadcrumb"
import { BreadcrumbItem as TBreadcrumbItem } from "@/libs/share/_general/models/breadcrumb-item";
import { Fragment, ReactNode } from "react";

type Props = {
  breadcrumbItems?: TBreadcrumbItem[];
  current?: ReactNode;
}

export default function CustomBreadcrumb({
  breadcrumbItems,
  current,
}: Readonly<Props>) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems?.map((breadcrumb, index) => (
          <Fragment key={breadcrumb.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}
        {current && (
          <>
            {Boolean(breadcrumbItems?.length) && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbPage>{current}</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}