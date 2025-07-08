import { cn } from "@/external/shadcn/libs/utils";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ReactNode } from "react";

type Props = ChildrenProps & {
  title?: string;
  description?: string;
  remark?: ReactNode;
}

export default function AuthMainSectionBase({
  children,
  title,
  description,
  remark,
}: Readonly<Props>) {
  return (
    <section className={cn('flex flex-col items-center mt-55 px-8 space-y-6')}>
      <div className='space-y-2 flex flex-col items-center'>
        <h1 className='text-2xl font-bold'>{title}</h1>
        <p className='text-secondary-foreground'>
          {description}
        </p>
      </div>
      <div className='w-full max-w-sm'>
        {children}
        <div className='mt-2 text-sm text-secondary-foreground'>
          {remark}
        </div>
      </div>
    </section>
  )
}