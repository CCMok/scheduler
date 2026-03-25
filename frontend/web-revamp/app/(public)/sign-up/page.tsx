import Logo from "@/components/_general/logo/logo";
import SignUpCard from "./_components/sign-up-card";

export default function SignUpPage() {
  return (
    <div className="min-h-svh mx-2 flex flex-col items-center justify-center gap-2">
      <Logo />
      <SignUpCard className='w-full max-w-sm' />
    </div>
  )
}