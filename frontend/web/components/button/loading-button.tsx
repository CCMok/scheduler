import { Button } from "@/external/shadcn/components/ui/button"
import { Loader2 } from "lucide-react"
import { ComponentProps } from "react"

type Props = ComponentProps<typeof Button> & {
  loading?: boolean
}

export default function LoadingButton({
  loading = false,
  children,
  ...props
}: Readonly<Props>) {
  return (
    <Button
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className='animate-spin' />}
      {children}
    </Button>
  )
}