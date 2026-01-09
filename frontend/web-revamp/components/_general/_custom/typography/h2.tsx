import { cn } from "@/external/shadcn/libs/utils";
import { ReactNode } from "react";

export default function H2({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <h2 className={cn("text-3xl font-semibold tracking-tight", className)}>
      {children}
    </h2>
  )
}