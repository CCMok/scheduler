import Logo from "@/components/_general/logo/logo";
import { ReactNode } from "react";

export default function AuthPageShell({
  children,
  brandSize = "lg",
  tagline,
}: Readonly<{
  children: ReactNode;
  brandSize?: "md" | "lg";
  tagline?: string;
}>) {
  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <Logo size={brandSize} />
        {tagline ? <p className="auth-brand-tagline">{tagline}</p> : null}
      </div>
      <div className="auth-panel">{children}</div>
    </div>
  );
}
