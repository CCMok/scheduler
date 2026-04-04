import Logo from "@/components/_general/logo/logo";

export default async function ResetPasswordVerifyEmailTokenPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Logo />
      <div className='text-center px-8 mt-4'>
        <h1 className='text-4xl font-bold'>{/* 確認您的電子郵件 */} {/* TODO */}</h1>
        <p className='text-lg text-secondary-foreground mt-4'>
          {/* 請按確認按鈕以完成註冊。 */} {/* TODO */}
        </p>
      </div>
      {/* <SubmitVerifyButton className='mt-6' /> */} {/* TODO */}
    </div>
  )
}