'use client'

import { ReactNode } from "react"
import FieldLayout from "./field-layout"
import { useFieldContext } from "../utils/form-utils"
import { Switch } from "@/external/shadcn/components/ui/switch"

export default function SwitchField({
  className,
  label,
  labelAddOn,
  showError,
  showLabel,
}: Readonly<{
  className?: string;
  label?: ReactNode;
  labelAddOn?: ReactNode;
  showError?: boolean;
  showLabel?: boolean;
}>) {
  const field = useFieldContext<boolean>()
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
      orientation='horizontal'
    >
      <Switch
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={field.handleChange}
        aria-invalid={isInvalid}
      />
    </FieldLayout>
  )
}
