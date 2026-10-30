import Logo from "@/components/_general/logo/logo";
import { ReactNode } from "react";
import AuthQuietGrid from "./auth-quiet-grid";

export default function AuthPageShell({
  children,
  title,
  description,
}: Readonly<{
  children: ReactNode;
  title?: string;
  description?: string;
}>) {
  return (
    <div className="auth-shell">
      <div className="auth-brand-rail public-enter">
        <Logo size="lg" />
        {title ? <h1 className="auth-brand-title">{title}</h1> : null}
        {description ? (
          <p className="auth-brand-support">{description}</p>
        ) : null}
        <AuthQuietGrid />
      </div>
      <div className="auth-panel public-enter public-enter-delay-1">
        {children}
      </div>
    </div>
  );
}
