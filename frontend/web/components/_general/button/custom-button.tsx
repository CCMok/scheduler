import { Button } from '@/components/animate-ui/components/buttons/button';
import { ComponentProps } from "react";

export default function CustomButton(props: Readonly<ComponentProps<typeof Button>>) {
  return (
    <Button
      type='button'
      {...props}
    />
  )
}