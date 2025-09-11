import { ComponentProps } from "react";
import CustomBreadcrumb from "../breadcrumb/custom-breadcrumb";
import Header from "./header";

type Props = ComponentProps<typeof CustomBreadcrumb> & {
  isBack?: boolean;
}

export default function BreadcrumbHeader({
  isBack = true,
  ...props
}: Readonly<Props>) {
  return (
    <Header>
      <CustomBreadcrumb {...props} />
    </Header>
  )
}