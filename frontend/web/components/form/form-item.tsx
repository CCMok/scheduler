'use client'

import { ChildrenProps } from '@/libs/share/_general/props/children-props';
import { FormControl, FormItem as ShadcnFormItem, FormLabel, FormMessage } from '@/shadcn/components/ui/form';
import { ReactNode } from 'react';

type Props = ChildrenProps & {
  label?: ReactNode,
}

export default function FormItem({
  label,
  children,
}: Readonly<Props>) {
  return (
    <ShadcnFormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>{children}</FormControl>
      <FormMessage />
    </ShadcnFormItem>
  )
}