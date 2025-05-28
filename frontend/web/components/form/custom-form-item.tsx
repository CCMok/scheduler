'use client'

import { ChildrenProps } from '@/libs/share/_general/props/children-props';
import { FormItem, FormLabel, FormMessage } from '@/external/shadcn/components/ui/form';
import { ReactNode } from 'react';

type Props = ChildrenProps & {
  label?: ReactNode,
}

export default function CustomFormItem({
  label,
  children,
}: Readonly<Props>) {
  return (
    <FormItem className='flex flex-col'>
      {label && <FormLabel>{label}</FormLabel>}
      {children}
      <FormMessage />
    </FormItem>
  )
}