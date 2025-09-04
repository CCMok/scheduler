import { Button } from "@/external/shadcn/components/ui/button";
import { ComponentProps } from "react";

export default function CustomButton(props: Readonly<ComponentProps<typeof Button>>) {
  return (
    <Button
      type='button'
      {...props}
    />
  )
}