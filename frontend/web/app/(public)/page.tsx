import CustomButton from '@/components/_general/_custom/button/custom-button';
import CustomLink from '@/components/_general/_custom/link/custom-link';
import Logo from '@/components/_general/logo/logo';
import { ROUTE } from '@/libs/_general/route/route-config';

export default function HomePage() {
  return (
    <div className="auth-shell">
      <div className="auth-brand">
        <Logo size="hero" className="justify-center" />
        <p className="auth-brand-tagline text-base sm:text-lg">
          簡化日程安排，有效率管理團隊。
        </p>
      </div>
      <div className="flex w-full flex-col items-center gap-3">
        <CustomButton className="min-w-40" size="lg" asChild>
          <CustomLink href={ROUTE.public.login}>開始使用</CustomLink>
        </CustomButton>
        <CustomButton variant="ghost" size="sm" asChild>
          <CustomLink href={ROUTE.public.signUp.base}>註冊帳號</CustomLink>
        </CustomButton>
      </div>
    </div>
  );
}
