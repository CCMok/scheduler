'use client'

import { ChildrenProps } from '@/libs/_general/props/children-props';
import { FormDescription, FormItem, FormLabel, FormMessage } from '@/external/shadcn/components/ui/form';
import { ReactNode } from 'react';

type Props = ChildrenProps & {
  label?: ReactNode;
  isLabelStar?: boolean;
  labelAddon?: ReactNode;
  description?: ReactNode;
}

export default function CustomFormItem({
  children,
  label,
  isLabelStar,
  labelAddon,
  description,
}: Readonly<Props>) {
  return (
    <FormItem className='flex flex-col'>
      {(label || labelAddon) && (
        <div className='flex'>
          {label && (
            <FormLabel>
              {label}
              {isLabelStar && <span className='text-destructive'>*</span>}
            </FormLabel>
          )}
          <div className='ml-auto'>
            {labelAddon}
          </div>
        </div>
      )}
      {description && (
        <FormDescription>
          {description}
        </FormDescription>
      )}
      {children}
      <FormMessage />
    </FormItem>
  )
}