import Logo from "@/components/_general/logo/logo";
import { ReactNode } from "react";

export default function AuthPageShell({
  children,
  brandSize = "lg",
}: Readonly<{
  children: ReactNode;
  brandSize?: "md" | "lg";
}>) {
  return (
    <div className="mx-2 flex min-h-svh flex-col items-center justify-center gap-5 py-10">
      <Logo size={brandSize} />
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
