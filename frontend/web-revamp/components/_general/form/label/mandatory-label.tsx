import { ReactNode } from "react";

export default function MandatoryLabel({
  children,
}: Readonly<{
  children?: ReactNode;
}>) {
  return (
    <span className='space-x-1'>
      <span>{children}</span>
      <span className='text-destructive'>*</span>
    </span>
  )
}