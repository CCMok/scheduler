import { Field, FieldError, FieldLabel } from "@/external/shadcn/components/ui/field"
import { ReactNode } from "react";

export default function FieldLayout({
  children,
  id,
  label,
  isInvalid,
  errors,
}: Readonly<{
  children?: ReactNode;
  id?: string;
  label?: ReactNode;
  isInvalid?: boolean;
  errors?: ({ message?: string } | undefined)[];
}>) {
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
      {isInvalid && (
        <FieldError errors={errors} />
      )}
    </Field>
  )
}