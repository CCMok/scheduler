import { ThemeToggle } from '@/components/button/theme-toggle';
import LoginLeftSection from './_components/login-left-section';
import LoginRightSection from './_components/login-right-section';

export default function LoginPage() {
  return (
    <div className='flex min-h-screen'>
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>
      <LoginLeftSection className='hidden lg:block w-1/2 border-r' />
      <LoginRightSection className='w-full lg:w-1/2' />
    </div>
  );
}