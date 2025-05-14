'use client'

import { useFormContext } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/external/shadcn/components/ui/alert"
import { CircleAlert } from 'lucide-react';
import { MessageTitle } from "@/libs/client/_general/enums/client-message";

export default function FormRootMessage() {
  const { formState: { errors } } = useFormContext();

  if (!errors.root?.message) return <></>

  return (
    <Alert>
      <CircleAlert className="h-4 w-4" />
      <AlertTitle>{errors.root.type ?? MessageTitle.CAUTION}</AlertTitle>
      {errors.root?.message && (
        <AlertDescription>
          {errors.root.message}
        </AlertDescription>
      )}
    </Alert>
  )
}