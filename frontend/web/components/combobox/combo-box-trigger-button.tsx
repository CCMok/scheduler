import { ComponentProps } from "react"
import { cn } from "@/external/shadcn/libs/utils"
import { ChevronDown } from "lucide-react"
import CustomButton from "../button/custom-button"

type Props = Exclude<ComponentProps<typeof CustomButton>, 'children'> & {
  value?: string,
  display: string,
}

export default function ComboBoxTriggerButton({
  value,
  display,
  ...props
}: Readonly<Props>) {
  return (
    <CustomButton
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
    </CustomButton>
  )
}