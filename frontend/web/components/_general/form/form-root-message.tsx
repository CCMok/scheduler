'use client'

import { useFormContext } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/external/shadcn/components/ui/alert"
import { CircleAlert } from 'lucide-react';
import { MessageTitle } from "@/libs/server/_general/enums/message";

export default function FormRootMessage() {
  const { formState: { errors } } = useFormContext();

  if (!errors.root?.message) return <></>

  return (
    <Alert>
      <CircleAlert className="h-4 w-4" />
      <AlertTitle>{errors.root.type ?? MessageTitle.INPUT_ERROR}</AlertTitle>
      <AlertDescription>
        {errors.root.message}
      </AlertDescription>
    </Alert>
  )
}