import CustomButton from '@/components/_general/_custom/button/custom-button';
import CustomLink from '@/components/_general/_custom/link/custom-link';
import { ROUTE } from '@/libs/_general/route/route-config';

export default function HomePage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='text-center px-8'>
        <h1 className='text-4xl font-bold'>歡迎使用 Scheduler</h1>
        <p className='text-lg text-secondary-foreground mt-4'>
          簡化您的日程安排並有效率地管理您的團隊。
        </p>
        <CustomButton className='mt-6' >
          <CustomLink href={ROUTE.public.login}>
            開始使用
          </CustomLink>
        </CustomButton>
      </div>
    </div>
  );
}
