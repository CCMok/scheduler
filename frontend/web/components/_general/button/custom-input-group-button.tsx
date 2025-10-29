import { InputGroupButton } from '@/external/shadcn/components/ui/input-group';
import { ComponentProps } from "react";

export default function CustomInputGroupButton(props: Readonly<ComponentProps<typeof InputGroupButton>>) {
  return (
    <InputGroupButton
      type='button'
      {...props}
    />
  )
}