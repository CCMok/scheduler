import { cn } from "@/external/shadcn/libs/utils";
import { ReactNode } from "react";

export default function H5({
  children,
  className,
}: Readonly<{
  children?: ReactNode;
  className?: string;
}>) {
  return (
    <h5 className={cn("font-semibold tracking-wider", className)}>
      {children}
    </h5>
  )
}