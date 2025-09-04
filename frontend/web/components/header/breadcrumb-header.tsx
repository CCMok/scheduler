import { ComponentProps } from "react";
import CustomBreadcrumb from "../breadcrumb/custom-breadcrumb";
import BackHeader from "./back-header";

type Props = ComponentProps<typeof CustomBreadcrumb> & {
  isBack?: boolean;
}

export default function BreadcrumbHeader({
  isBack = true,
  ...props
}: Readonly<Props>) {
  const breadcrumbHeader = (
    <CustomBreadcrumb
      {...props}
    />
  )

  if (isBack) {
    return (
      <BackHeader>
        {breadcrumbHeader}
      </BackHeader>
    )
  }

  return breadcrumbHeader
}