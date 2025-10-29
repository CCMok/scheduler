import { ComponentProps, ReactNode } from "react"
import CustomButton from "./custom-button"
import { Spinner } from "@/external/shadcn/components/ui/spinner"

type Props = ComponentProps<typeof CustomButton> & {
  isLoading?: boolean
  icon?: ReactNode,
}

export default function LoadingButton({
  isLoading = false,
  children,
  icon,
  ...props
}: Readonly<Props>) {
  return (
    <CustomButton
      disabled={isLoading}
      {...props}
    >
      <>
        {isLoading ? <Spinner /> : icon}
        {children}
      </>
    </CustomButton>
  )
}