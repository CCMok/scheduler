import { Field, FieldError, FieldLabel } from "@/external/shadcn/components/ui/field"
import { ReactNode } from "react";

export default function FieldLayout({
  children,
  className,
  id,
  label,
  labelAddOn,
  isInvalid,
  errors,
  showError = true,
}: Readonly<{
  children?: ReactNode;
  className?: string;
  id?: string;
  label?: ReactNode;
  labelAddOn?: ReactNode;
  isInvalid?: boolean;
  errors?: ({ message?: string } | undefined)[];
  showError?: boolean;
}>) {
  return (
    <Field className={className} data-invalid={isInvalid}>
      {labelAddOn ? (
        <div className="flex items-center justify-between">
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          {labelAddOn}
        </div>
      ) : (
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
      )}
      {children}
      {isInvalid && showError && (
        <FieldError errors={errors} />
      )}
    </Field>
  )
}