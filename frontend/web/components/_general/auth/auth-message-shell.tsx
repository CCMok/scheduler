import Logo from "@/components/_general/logo/logo";
import { ReactNode } from "react";

export default function AuthMessageShell({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description?: string;
  children?: ReactNode;
}>) {
  return (
    <div className="auth-shell auth-shell--message">
      <div className="auth-brand-rail public-enter">
        <Logo size="lg" />
        <h1 className="auth-brand-title">{title}</h1>
        {description ? (
          <p className="auth-brand-support">{description}</p>
        ) : null}
      </div>
      {children ? (
        <div className="auth-panel public-enter public-enter-delay-1">
          {children}
        </div>
      ) : null}
    </div>
  );
}
