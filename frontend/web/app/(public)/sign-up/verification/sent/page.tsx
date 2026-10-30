import AuthMessageShell from "@/components/_general/auth/auth-message-shell";

export default function SignUpVerificationSentPage() {
  return (
    <AuthMessageShell
      title="感謝您的註冊"
      description="我們已經向您的電子郵件發送了一封驗證電郵，請檢查您的電子郵件。"
    />
  );
}
