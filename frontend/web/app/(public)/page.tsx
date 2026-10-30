import CustomButton from '@/components/_general/_custom/button/custom-button';
import CustomLink from '@/components/_general/_custom/link/custom-link';
import Logo from '@/components/_general/logo/logo';
import { ROUTE } from '@/libs/_general/route/route-config';

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center text-center">
        <Logo size="hero" className="justify-center" />
        <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
          簡化您的日程安排並有效率地管理您的團隊。
        </p>
        <CustomButton className="mt-8" size="lg" asChild>
          <CustomLink href={ROUTE.public.login}>開始使用</CustomLink>
        </CustomButton>
      </div>
    </div>
  );
}
