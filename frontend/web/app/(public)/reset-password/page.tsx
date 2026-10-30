import AuthPageShell from "@/components/_general/auth/auth-page-shell";
import ResetPasswordCard from "./_components/reset-password-card";

export default function ResetPasswordPage() {
  return (
    <AuthPageShell tagline="我們會寄送重設密碼連結到您的電郵。">
      <ResetPasswordCard />
    </AuthPageShell>
  );
}
