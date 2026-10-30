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
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center gap-5 px-6 py-10 text-center">
      <Logo size="lg" />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="text-base text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
