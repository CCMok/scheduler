'use client'

import { ComponentProps, ReactNode } from "react";
import CustomTable from "./custom-table";

type Props<T> = ComponentProps<typeof CustomTable<T>> & {
  button?: ReactNode;
}

export default function ButtonTable<T>({
  button,
  ...props
}: Readonly<Props<T>>) {
  return (
    <div className='space-y-2'>
      <div className='flex justify-end'>
        {button}
      </div>
      <CustomTable {...props} />
    </div>
  )
}