import Logo from "@/components/_general/logo/logo";

export default function ResetPasswordVerificationSentPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Logo />
      <div className='text-center px-8 mt-4'>
        <h1 className='text-4xl font-bold'>密碼重設</h1>
        <p className='text-lg text-secondary-foreground mt-4'>
          我們已經向您的電子郵件發送了一封密碼重設的電郵，請檢查您的電子郵件。
        </p>
      </div>
    </div>
  )
}