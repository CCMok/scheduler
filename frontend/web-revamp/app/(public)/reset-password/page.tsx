import Logo from "@/components/_general/logo/logo";
import ResetPasswordCard from "./_components/reset-password-card";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-svh mx-2 flex flex-col items-center justify-center gap-2">
      <Logo />
      <ResetPasswordCard className='w-full max-w-sm' />
    </div>
  )
}