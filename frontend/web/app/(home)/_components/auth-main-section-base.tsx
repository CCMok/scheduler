import Logo from "@/components/_general/logo/logo";
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
    <>
      <Logo className='absolute top-8 left-8' />
      <section className={'flex flex-col items-center justify-center px-8 space-y-6 min-h-screen'}>
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
    </>
  )
}