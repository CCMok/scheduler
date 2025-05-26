'use client'

import { ChildrenProps } from '@/libs/share/_general/props/children-props';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/external/shadcn/components/ui/form';
import { ReactNode } from 'react';

type Props = ChildrenProps & {
  label?: ReactNode,
}

export default function FormItemCustom({
  label,
  children,
}: Readonly<Props>) {
  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  )
}