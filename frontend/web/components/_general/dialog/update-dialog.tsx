'use client'

import { ComponentProps } from "react";
import { FieldValues } from "react-hook-form";
import FormDialog from "./old-form-dialog";

type Props<T extends FieldValues = FieldValues, R = object> = 
  Omit<ComponentProps<typeof FormDialog<T, R>>, 'title'> & {
  entityName?: string;
}

export default function UpdateDialog<T extends FieldValues = FieldValues, R = object>({
  entityName = '',
  ...props
}: Readonly<Props<T, R>>) {
  return (
    <FormDialog
      title={`編輯${entityName}`}
      {...props}
    />
  )
}