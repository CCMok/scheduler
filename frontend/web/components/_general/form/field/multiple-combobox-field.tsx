'use client'

import MultipleCombobox from "@/components/_general/_custom/combobox/multiple-combobox"
import { ComponentProps, Key, ReactNode } from "react"
import FieldLayout from "./field-layout"
import { useFieldContext } from "../utils/form-utils"

export default function MultipleComboboxField<T, V extends Key>({
  className,
  label,
  labelAddOn,
  options,
  getOptionValue,
  getOptionDisplay,
  placeholder,
  icon,
  showError,
  showLabel,
  orientation,
}: Readonly<{
  className?: string;
  label?: ReactNode;
  labelAddOn?: ReactNode;
  options: T[];
  getOptionValue: (option: T) => V;
  getOptionDisplay: (option: T) => string;
  placeholder?: string;
  icon?: ReactNode;
  showError?: boolean;
  showLabel?: boolean;
  orientation?: ComponentProps<typeof FieldLayout>["orientation"];
}>) {
  const field = useFieldContext<V[]>()
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <FieldLayout
      className={className}
      id={field.name}
      label={label}
      labelAddOn={labelAddOn}
      orientation={orientation}
      isInvalid={isInvalid}
      errors={field.state.meta.errors}
      showError={showError}
      showLabel={showLabel}
    >
      <MultipleCombobox
        id={field.name}
        value={field.state.value}
        setValue={field.handleChange}
        options={options}
        getOptionValue={getOptionValue}
        getOptionDisplay={getOptionDisplay}
        placeHolder={placeholder}
        icon={icon}
      />
    </FieldLayout>
  )
}
