import { ComponentProps } from "react"
import { Button } from "@/external/shadcn/components/ui/button"
import { cn } from "@/external/shadcn/libs/utils"
import { ChevronDown } from "lucide-react"

type Props = Exclude<ComponentProps<typeof Button>, 'children'> & {
  value?: string,
  display: string,
}

export default function ComboBoxTriggerButton({
  value,
  display,
  ...props
}: Readonly<Props>) {
  return (
    <Button
      variant='outline'
      role='comobox'
      className={cn(
        "w-(--input-width) justify-between",
        !value && "text-muted-foreground"
      )}
      {...props}
    >
      {display}
      <ChevronDown className="opacity-50" />
    </Button>
  )
}