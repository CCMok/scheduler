'use client'

import { useFormContext } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/external/shadcn/components/ui/alert"
import { CircleAlert } from 'lucide-react';
import { ClientMessageTitle } from "@/libs/client/_general/enums/client-message-enum";

export default function FormRootMessage() {
  const { formState: { errors } } = useFormContext();

  if (!errors.root?.message) return <></>

  return (
    <Alert>
      <CircleAlert className="h-4 w-4" />
      <AlertTitle>{errors.root.type ?? ClientMessageTitle.CAUTION}</AlertTitle>
      <AlertDescription>
        {errors.root.message}
      </AlertDescription>
    </Alert>
  )
}