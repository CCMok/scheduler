import Logo from "@/components/_general/logo/logo";
import LoginCard from "./_components/login-card";

export default function LoginPage() {
  return (
    <div className="min-h-svh mx-2 flex flex-col items-center justify-center gap-2">
      <Logo />
      <LoginCard />
    </div>
  )
}