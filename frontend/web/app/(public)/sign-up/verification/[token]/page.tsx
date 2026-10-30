import AuthMessageShell from "@/components/_general/auth/auth-message-shell";
import SubmitVerifyButton from "./_components/submit-verify-button";

export default async function SignUpVerificationTokenPage() {
  return (
    <AuthMessageShell
      title="確認您的電子郵件"
      description="請按確認按鈕以完成註冊。"
    >
      <SubmitVerifyButton />
    </AuthMessageShell>
  );
}
