import { Field, FieldError, FieldLabel } from "@/external/shadcn/components/ui/field"
import { ComponentProps, ReactNode } from "react";

export default function FieldLayout({
  children,
  className,
  id,
  label,
  labelAddOn,
  isInvalid,
  errors,
  showError = true,
  showLabel = true,
  orientation,
}: Readonly<{
  children?: ReactNode;
  className?: string;
  id?: string;
  label?: ReactNode;
  labelAddOn?: ReactNode;
  isInvalid?: boolean;
  errors?: ({ message?: string } | undefined)[];
  showError?: boolean;
  showLabel?: boolean;
  orientation?: ComponentProps<typeof Field>["orientation"];
}>) {
  return (
    <Field
      className={className}
      data-invalid={isInvalid}
      orientation={orientation}
    >
      {showLabel && (
        <>
          {labelAddOn ? (
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor={id}>{label}</FieldLabel>
              {labelAddOn}
            </div>
          ) : (
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
          )}
        </>
      )}
      {children}
      {isInvalid && showError && (
        <FieldError errors={errors} />
      )}
    </Field>
  )
}