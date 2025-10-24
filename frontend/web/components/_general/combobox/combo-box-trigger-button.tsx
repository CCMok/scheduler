import { ComponentProps } from "react"
import { cn } from "@/external/shadcn/libs/utils"
import { ChevronDown } from "lucide-react"
import PlainButton from "../button/plain-button"

type Props<V> = Omit<ComponentProps<typeof PlainButton>, 'children' | 'value'> & {
  value?: V,
  display: string,
}

export default function ComboBoxTriggerButton<V>({
  value,
  display,
  ...props
}: Readonly<Props<V>>) {
  return (
    <PlainButton
      variant='outline'
      role='comobox'
      className={cn(
        "w-(--input-width) justify-between",
        !value && "text-muted-foreground"
      )}
      {...props}
    >
      <>
      {display}
      <ChevronDown className="opacity-50" />
      </>
    </PlainButton>
  )
}