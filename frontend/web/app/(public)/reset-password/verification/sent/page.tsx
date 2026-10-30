import AuthMessageShell from "@/components/_general/auth/auth-message-shell";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import CustomLink from "@/components/_general/_custom/link/custom-link";
import { ROUTE } from "@/libs/_general/route/route-config";

export default function ResetPasswordVerificationSentPage() {
  return (
    <AuthMessageShell
      title="請查收電郵"
      description="我們已寄出密碼重設連結，請到信箱繼續。"
    >
      <div className="flex justify-center">
        <CustomButton variant="ghost" size="sm" asChild>
          <CustomLink href={ROUTE.public.login}>返回登入</CustomLink>
        </CustomButton>
      </div>
    </AuthMessageShell>
  );
}
