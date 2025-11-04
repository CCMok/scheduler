import CustomButton from '@/components/_general/button/custom-button';
import { PATH } from '@/libs/_general/enums/path';
import CustomLink from '@/components/_general/link/custom-link';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='text-center px-8'>
        <h1 className='text-4xl font-bold'>歡迎使用 Scheduler</h1>
        <p className='text-lg text-secondary-foreground mt-4'>
          簡化您的日程安排並有效率地管理您的團隊。
        </p>
        <CustomButton className='mt-6' asChild>
          <CustomLink href={PATH.login}>
            開始使用
          </CustomLink>
        </CustomButton>
      </div>
    </div>
  );
}
