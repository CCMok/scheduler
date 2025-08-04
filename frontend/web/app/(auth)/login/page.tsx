import AuthMainSectionBase from '../_components/auth-main-section-base';
import AuthRemarkBase from '../_components/auth-remark-base';
import LoginForm from './_components/login-form';
import { PATH } from '@/libs/share/_general/utils/path';

export default function LoginPage() {
  return (
    <AuthMainSectionBase
      title='登入'
      description='輸入您的登入資訊'
      remark={<AuthRemarkBase
        description='沒有帳號 ?'
        linkHref={PATH.register}
        linkText='立即註冊'
      />}
    >
      <LoginForm />
    </AuthMainSectionBase>
  );
}