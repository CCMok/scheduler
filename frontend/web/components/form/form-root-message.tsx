'use client'

import { useFormContext } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/external/shadcn/components/ui/alert"
import { CircleAlert } from 'lucide-react';
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";

export default function FormRootMessage() {
  const { formState: { errors } } = useFormContext();

  if (!errors.root?.message) return <></>

  return (
    <Alert>
      <CircleAlert className="h-4 w-4" />
      <AlertTitle>{errors.root.type ?? UiMessageTitle.CAUTION}</AlertTitle>
      <AlertDescription>
        {errors.root.message}
      </AlertDescription>
    </Alert>
  )
}