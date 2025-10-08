import { InputGroupInput } from "@/external/shadcn/components/ui/input-group";
import { ComponentProps } from "react";

export default function CustomInputGroupInput({
  className,
  ...props
}: Readonly<ComponentProps<typeof InputGroupInput>>) {
  return (
    <InputGroupInput
      autoComplete='off'
      {...props}
    />
  )
}