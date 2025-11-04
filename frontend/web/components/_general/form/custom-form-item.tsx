'use client'

import { ChildrenProps } from '@/libs/_general/props/children-props';
import { FormItem, FormLabel, FormMessage } from '@/external/shadcn/components/ui/form';
import { ReactNode } from 'react';

type Props = ChildrenProps & {
  label?: ReactNode,
  isLabelStar?: boolean,
}

export default function CustomFormItem({
  label,
  children,
  isLabelStar,
}: Readonly<Props>) {
  return (
    <FormItem className='flex flex-col'>
      {label && (
        <FormLabel>
          {label}
          {isLabelStar && <span className='text-destructive'>*</span>}
        </FormLabel>
      )}
      {children}
      <FormMessage />
    </FormItem>
  )
}