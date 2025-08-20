import { cn } from "@/external/shadcn/libs/utils";
import Link from "next/link";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & {
  isDisabled?: boolean;
}

export default function CustomLink({
  isDisabled,
  className,
  ...props
}: Readonly<Props>) {
  return (
    <Link
      aria-disabled={isDisabled}
      className={cn(
        isDisabled && 'pointer-events-none opacity-50',
        className,
      )}
      tabIndex={isDisabled ? -1 : undefined}
      {...props}
    />
  )
}