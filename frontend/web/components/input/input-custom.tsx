import { Input } from "@/external/shadcn/components/ui/input";
import { ComponentProps } from "react";

export default function InputCustom(props: Readonly<ComponentProps<typeof Input>>) {
  return (
    <Input
      autoComplete='off'
      className='w-(--input-width)'
      {...props}
    />
  )
}