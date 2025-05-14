'use client'

import { ReactNode } from "react"
import { useFormContext } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/external/shadcn/components/ui/alert"
import { CircleAlert } from 'lucide-react';
import { MessageTitle } from "@/libs/client/_general/enums/message";

type Props = {
  title?: ReactNode,
}

export default function FormRootMessage({
  title,
}: Readonly<Props>) {
  const { formState: { errors } } = useFormContext();

  return (
    <Alert>
      <CircleAlert className="h-4 w-4" />
      <AlertTitle>{title ?? MessageTitle.CAUTION}</AlertTitle>
      {errors.root?.message && (
        <AlertDescription>
          {errors.root.message}
        </AlertDescription>
      )}
    </Alert>
  )
}