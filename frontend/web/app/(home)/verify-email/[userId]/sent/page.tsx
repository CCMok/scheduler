import { ParamProps } from "@/libs/_general/props/param-props";
import AuthMainSectionBase from "../../../_components/auth-main-section-base";
import { Param } from "@/libs/_general/enums/param";
import { notFound, redirect } from "next/navigation";
import { getUsersWithRoleService } from "@/libs/user/services/get-users-with-role-service";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import { UserExcludePasswordWithRole } from "@/libs/user/models/user-dao";
import BackToLoginButton from "../../../../../components/access/back-to-login-button";
import ResendVerificationButton from "./_components/resend-verification-button";

const getUser = async (userId: number): Promise<UserExcludePasswordWithRole | undefined> => {
  const response = await getUsersWithRoleService(userId);
  const data = handleGetResponse(response, redirect, [])
  return data[0];
}

type Props = ParamProps<{
  [Param.USER_ID]: string;
}>

export default async function VerifyEmailSentPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;
  const userId = Number.parseInt(awaitedParams[Param.USER_ID]);
  if (Number.isNaN(userId)) notFound();

  const user = await getUser(userId);
  if (!user) notFound();

  return (
    <AuthMainSectionBase
      title='驗證電子郵件'
      description={
        user.isEmailVerified
          ? '您的電子郵件已經成功驗證。'
          : '我們已經向您發送了一封驗證電郵，請檢查您的電子郵件。'
      }
    >
      <div className='flex justify-center'>
        {user.isEmailVerified
          ? <BackToLoginButton />
          : <ResendVerificationButton userId={userId} />}
      </div>
    </AuthMainSectionBase>
  )
}