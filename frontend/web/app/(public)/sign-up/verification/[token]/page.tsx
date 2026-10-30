import AuthMessageShell from "@/components/_general/auth/auth-message-shell";
import SubmitVerifyButton from "./_components/submit-verify-button";

export default async function SignUpVerificationTokenPage() {
  return (
    <AuthMessageShell
      title="確認電郵"
      description="按確認以完成註冊。"
    >
      <div className="flex justify-center">
        <SubmitVerifyButton />
      </div>
    </AuthMessageShell>
  );
}
