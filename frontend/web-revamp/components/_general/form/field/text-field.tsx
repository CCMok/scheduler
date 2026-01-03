'use client'

import { Input } from "@/external/shadcn/components/ui/input"
import FieldLayout from "./field-layout"
import { useFieldContext } from "../utils/form-utils"
import { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute, ReactNode } from "react";

export default function TextField({
  label,
  placeholder,
  autoComplete,
  type,
}: Readonly<{
  label?: ReactNode;
  placeholder?: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  type?: HTMLInputTypeAttribute;
}>) {
  const field = useFieldContext<string>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  return (
    <FieldLayout
      id={field.name}
      label={label}
      isInvalid={isInvalid}
      errors={field.state.meta.errors}
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
      />
    </FieldLayout>
  )
}