import { ComponentProps } from "react";
import CustomBreadcrumb from "../breadcrumb/custom-breadcrumb";
import Header from "./header";

type Props = ComponentProps<typeof CustomBreadcrumb>

export default function BreadcrumbHeader({
  ...props
}: Readonly<Props>) {
  return (
    <Header>
      <CustomBreadcrumb {...props} />
    </Header>
  )
}