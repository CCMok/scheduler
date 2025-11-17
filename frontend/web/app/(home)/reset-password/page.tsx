import { PATH } from "@/libs/_general/enums/path";
import AuthMainSectionBase from "../_components/auth-main-section-base";
import AuthRemarkBase from "../_components/auth-remark-base";
import ResetPasswordForm from "./_components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthMainSectionBase
      title='重設密碼'
      description='請輸入您使用者帳戶已驗證的電子郵件地址，我們將向您發送密碼重設連結。'
      remark={<AuthRemarkBase
        linkHref={PATH.login}
        linkText='返回登入'
      />}
    >
      <ResetPasswordForm />
    </AuthMainSectionBase>
  )
}