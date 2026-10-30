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
    <div className="auth-shell text-center">
      <div className="auth-brand">
        <Logo size="lg" />
        <div className="space-y-1.5">
          <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {title}
          </h1>
          {description ? (
            <p className="auth-brand-tagline">{description}</p>
          ) : null}
        </div>
      </div>
      {children ? <div className="auth-panel">{children}</div> : null}
    </div>
  );
}
