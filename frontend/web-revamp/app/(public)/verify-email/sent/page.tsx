import CustomButton from "@/components/_general/_custom/button/custom-button";
import CustomLink from "@/components/_general/_custom/link/custom-link";
import { ROUTE } from "@/libs/_general/route/route-config";

export default function VerifyEmailSentPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='text-center px-8'>
        <h1 className='text-4xl font-bold'>感謝您的註冊</h1>
        <p className='text-lg text-secondary-foreground mt-4'>
          我們已經向您的電子郵件發送了一封驗證電郵，請檢查您的電子郵件。
        </p>
      </div>
      <CustomButton className='mt-6' asChild>
        <CustomLink href={ROUTE.public.login}>
          返回登入
        </CustomLink>
      </CustomButton>
    </div>
  )
}