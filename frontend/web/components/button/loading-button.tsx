import { Loader2 } from "lucide-react"
import { ComponentProps, ReactNode } from "react"
import CustomButton from "./custom-button"

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
      {isLoading ? <Loader2 className='animate-spin' /> : icon}
      {children}
    </CustomButton>
  )
}