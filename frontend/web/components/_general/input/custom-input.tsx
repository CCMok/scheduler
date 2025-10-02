import { Input } from "@/external/shadcn/components/ui/input";
import { cn } from "@/external/shadcn/libs/utils";
import { ComponentProps } from "react";

export default function CustomInput({
  className,
  ...props
}: Readonly<ComponentProps<typeof Input>>) {
  return (
    <Input
      autoComplete='off'
      className={cn('w-(--input-width) shadow-md', className)}
      {...props}
    />
  )
}