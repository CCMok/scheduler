import AuthMainSectionBase from '../_components/auth-main-section-base';
import AuthRemarkBase from '../_components/auth-remark-base';
import RegisterForm from './_components/register-form';
import { PATH } from '@/libs/share/_general/utils/path';

export default function RegisterPage() {
  return (
    <AuthMainSectionBase
      title='註冊'
      description='輸入您的註冊資訊'
      remark={<AuthRemarkBase
        description='已擁有帳號 ?'
        linkHref={PATH.login}
        linkText='返回登入'
      />}
    >
      <RegisterForm />
    </AuthMainSectionBase>
  );
}