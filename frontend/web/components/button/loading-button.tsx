import { Button } from "@/external/shadcn/components/ui/button"
import { Loader2 } from "lucide-react"
import { ComponentProps } from "react"

type Props = ComponentProps<typeof Button> & {
  isLoading?: boolean
}

export default function LoadingButton({
  isLoading = false,
  children,
  ...props
}: Readonly<Props>) {
  return (
    <Button
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className='animate-spin' />}
      {children}
    </Button>
  )
}