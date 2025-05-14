import Logo from '@/components/general/logo/logo';
import { ThemeToggle } from '@/components/root/buttons/theme-toggle';
import { AnimatedGridPattern } from '@/magicui/animated-grid-pattern';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { cn } from '@/shadcn/libs/utils';

export default function LoginPage() {
  return (
    <div className='flex min-h-screen'>
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>
      <section className='hidden md:block w-1/2 relative bg-black border-r'>
        <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg bg-transparent p-20">
          <AnimatedGridPattern
            numSquares={30}
            maxOpacity={0.1}
            duration={3}
            repeatDelay={1}
            className={cn(
              '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
              'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12',
            )}
          />
        </div>
        <Logo className='absolute top-8 left-8 text-white' />
        <p className='text-lg italic absolute bottom-8 left-8 text-white'>
          讓計劃更有效率
        </p>
      </section>
      <section className='w-full md:w-1/2 flex flex-col justify-center items-center px-8 space-y-6'>
        <div className='space-y-2 flex flex-col items-center'>
          <h1 className='text-2xl font-bold'>登入</h1>
          <p className='text-secondary-foreground'>
            輸入您的電子郵件地址
          </p>
        </div>
        <form className='w-full max-w-sm space-y-4 flex flex-col'>
          <Input
            type='email'
            placeholder='name@example.com'
          />
          <Button
            type='submit'
          >
            使用電子郵件登入
          </Button>
        </form>
      </section>
    </div>
  );
}