import { cn } from "@/external/shadcn/libs/utils";
import CustomLink from "../_custom/link/custom-link";
import { ROUTE } from "@/libs/_general/route/route-config";

function BrandMark({
  size,
  className,
}: Readonly<{
  size: "sm" | "md" | "lg" | "hero";
  className?: string;
}>) {
  const markClass =
    size === "hero"
      ? "text-5xl sm:text-6xl tracking-tight"
      : size === "lg"
        ? "text-3xl tracking-tight"
        : size === "sm"
          ? "text-lg tracking-tight"
          : "text-2xl tracking-tight";

  return (
    <span
      className={cn(
        "font-display font-semibold text-primary",
        markClass,
        className,
      )}
    >
      Scheduler
    </span>
  );
}

export default function Logo({
  className,
  isRedirectHome = true,
  size = "md",
}: Readonly<{
  className?: string;
  isRedirectHome?: boolean;
  size?: "sm" | "md" | "lg" | "hero";
}>) {
  if (!isRedirectHome) {
    return (
      <div className={cn("inline-flex items-baseline", className)}>
        <BrandMark size={size} />
      </div>
    );
  }

  return (
    <CustomLink
      href={ROUTE.public.home}
      className={cn("inline-flex items-baseline text-foreground", className)}
    >
      <BrandMark size={size} />
    </CustomLink>
  );
}
