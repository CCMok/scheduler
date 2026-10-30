import AuthPageShell from "@/components/_general/auth/auth-page-shell";
import ResetPasswordCard from "./_components/reset-password-card";

export default function ResetPasswordPage() {
  return (
    <AuthPageShell title="重設密碼" description="連結會寄到你的電郵。">
      <ResetPasswordCard />
    </AuthPageShell>
  );
}
