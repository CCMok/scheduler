import AuthMainSectionBase from "../_components/auth-main-section-base";
import UpdatePasswordForm from "./_components/update-password-form";

export default function UpdatePasswordPage() {
  return (
    <AuthMainSectionBase
      title='更新密碼'
      description='電子郵件地址驗證成功，請輸入新密碼。'
    >
      <UpdatePasswordForm />
    </AuthMainSectionBase>
  )
}