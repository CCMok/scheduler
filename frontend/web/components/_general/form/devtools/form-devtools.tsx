'use client'

import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";

export default function FormDevtools() {
  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'production')
    return <></>;

  return (
    <TanStackDevtools plugins={[formDevtoolsPlugin()]} />
  )
}