'use client'

import { Input } from "@/external/shadcn/components/ui/input"
import FieldLayout from "./field-layout"
import { useFieldContext } from "../utils/form-utils"
import { ComponentProps, HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute, ReactNode } from "react";

export default function TextField({
  className,
  label,
  labelAddOn,
  placeholder,
  autoComplete = 'off',
  type = 'text',
  showError,
  showLabel,
  disabled,
  orientation,
}: Readonly<{
  className?: string;
  label?: ReactNode;
  labelAddOn?: ReactNode;
  placeholder?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  type?: HTMLInputTypeAttribute;
  showError?: boolean;
  showLabel?: boolean;
  disabled?: boolean;
  orientation?: ComponentProps<typeof FieldLayout>["orientation"];
}>) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <FieldLayout
      className={className}
      id={field.name}
      label={label}
      labelAddOn={labelAddOn}
      isInvalid={isInvalid}
      errors={field.state.meta.errors}
      showError={showError}
      showLabel={showLabel}
    >
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        autoComplete={autoComplete}
        type={type}
        disabled={disabled}
      />
    </FieldLayout>
  )
}