import { Button } from "@/external/shadcn/components/ui/button"
import { Loader2 } from "lucide-react"
import { ComponentProps, ReactNode } from "react"

type Props = ComponentProps<typeof Button> & {
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
    <Button
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className='animate-spin' /> : icon}
      {children}
    </Button>
  )
}