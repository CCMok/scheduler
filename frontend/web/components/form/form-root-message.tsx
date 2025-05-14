'use client'

import { ReactNode } from "react"
import { useFormContext } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/shadcn/components/ui/alert"
import { CircleAlert } from 'lucide-react';

type Props = {
  title?: ReactNode,
}

export default function FormRootMessage({
  title,
}: Readonly<Props>) {
  const { formState: { errors } } = useFormContext();

  if (!errors.root?.message) {
    return <></>
  }

  return (
    <Alert>
      <CircleAlert className="h-4 w-4" />
      <AlertTitle>{title ?? '注意!'}</AlertTitle>
      <AlertDescription>
        {errors.root?.message}
      </AlertDescription>
    </Alert>
  )
}