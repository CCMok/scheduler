import { ComponentProps, ReactNode } from "react";
import CustomButton from "./custom-button";
import { Spinner } from "@/external/shadcn/components/ui/spinner";

export default function LoadingButton({
  children,
  isLoading = false,
  icon,
  ...props
}: Readonly<ComponentProps<typeof CustomButton> & {
  isLoading?: boolean;
  icon?: ReactNode;
}>) {
  return (
    <CustomButton
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Spinner /> : icon}
      {children}
    </CustomButton>
  )
}