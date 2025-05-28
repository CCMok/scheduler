import { ThemeToggle } from '@/components/button/theme-toggle';
import LoginBackdropSection from './_components/backdrop/login-backdrop-section';
import LoginMainSection from './_components/main/login-main-section';

export default function LoginPage() {
  return (
    <div className='flex min-h-screen'>
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>
      <LoginBackdropSection className='hidden lg:block w-1/2 border-r' />
      <LoginMainSection className='w-full lg:w-1/2' />
    </div>
  );
}