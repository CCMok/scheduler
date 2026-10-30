import AuthPageShell from "@/components/_general/auth/auth-page-shell";
import LoginCard from "./_components/login-card";

export default function LoginPage() {
  return (
    <AuthPageShell tagline="登入以管理值班表與團隊。">
      <LoginCard />
    </AuthPageShell>
  );
}
