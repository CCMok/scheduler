import { Button } from "@/external/shadcn/components/ui/button";
import { Spinner } from "@/external/shadcn/components/ui/spinner";
import { ComponentProps, ReactNode } from "react";

export default function CustomButton({
  children,
  isLoading = false,
  icon,
  disabled,
  ...props
}: Readonly<ComponentProps<typeof Button> & {
  isLoading?: boolean;
  icon?: ReactNode;
}>) {
  return (
    <Button
      type='button'
      {...props}
      disabled={isLoading || disabled}
    >
      {isLoading ? <Spinner /> : icon}
      {children}
    </Button>
  )
}
