import { ThemeToggle } from '@/components/button/theme-toggle';
import Link from 'next/link';
import CustomButton from '@/components/button/custom-button';
import { PATH } from '@/libs/share/_general/utils/path';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>
      <div className='text-center px-8'>
        <h1 className='text-4xl font-bold'>歡迎使用 Scheduler</h1>
        <p className='text-lg text-secondary-foreground mt-4'>
          簡化您的日程安排並有效率地管理您的團隊。
        </p>
        <CustomButton className='mt-6' asChild>
          <Link href={PATH.login}>
            開始使用
          </Link>
        </CustomButton>
      </div>
    </div>
  );
}
