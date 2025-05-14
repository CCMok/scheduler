import { ClassNameProps } from '@/libs/share/_general/props/class-name-props';
import { cn } from '@/external/shadcn/libs/utils';
import LoginForm from './login-form';

export default function LoginRightSection({
  className,
}: Readonly<ClassNameProps>) {
  return (
    <section className={cn('flex flex-col items-center mt-55 px-8 space-y-6', className)}>
      <div className='space-y-2 flex flex-col items-center'>
        <h1 className='text-2xl font-bold'>登入</h1>
        <p className='text-secondary-foreground'>
          輸入您的登入資訊
        </p>
      </div>
      <LoginForm className='w-full max-w-sm' />
    </section>
  )
}