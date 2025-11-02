'use client'

import { ComponentProps } from "react";
import CustomButton from "../button/custom-button";
import { Plus } from "lucide-react";
import { FieldValues } from "react-hook-form";
import FormDialog from "./old-form-dialog";

type Props<T extends FieldValues = FieldValues, R = object> = 
  Omit<ComponentProps<typeof FormDialog<T, R>>, 'title' | 'renderTrigger'> & {
  entityName?: string;
}

export default function CreateDialog<T extends FieldValues = FieldValues, R = object>({
  entityName = '',
  ...props
}: Readonly<Props<T, R>>) {
  return (
    <FormDialog
      title={`新增${entityName}`}
      renderTrigger={onClick => (
        <CustomButton onClick={onClick}>
          <Plus />
          新增
        </CustomButton>
      )}
      {...props}
    />
  )
}