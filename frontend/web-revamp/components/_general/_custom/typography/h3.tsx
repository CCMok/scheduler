import { cn } from "@/external/shadcn/libs/utils";
import { ReactNode } from "react";

export default function H3({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  return (
    <h3 className={cn("text-2xl font-semibold tracking-tight", className)}>
      {children}
    </h3>
  )
}