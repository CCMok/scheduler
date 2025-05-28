import Logo from '@/components/logo/logo';
import { ClassNameProps } from '@/libs/share/_general/props/class-name-props';
import { AnimatedGridPattern } from '@/external/magicui/animated-grid-pattern';
import { cn } from '@/external/shadcn/libs/utils';

export default function LoginBackdropSection({
  className,
}: Readonly<ClassNameProps>) {
  return (
    <section className={cn('relative bg-zinc-900', className)}>
      <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg bg-transparent p-20">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12',
          )}
        />
      </div>
      <Logo className='absolute top-8 left-8 text-white' />
      <p className='text-lg italic absolute bottom-8 left-8 text-white'>
        讓計劃更有效率
      </p>
    </section>
  )
}