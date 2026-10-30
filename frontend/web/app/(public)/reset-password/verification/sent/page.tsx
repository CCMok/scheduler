import AuthMessageShell from "@/components/_general/auth/auth-message-shell";

export default function ResetPasswordVerificationSentPage() {
  return (
    <AuthMessageShell
      title="密碼重設"
      description="我們已經向您的電子郵件發送了一封密碼重設的電郵，請檢查您的電子郵件。"
    />
  );
}
