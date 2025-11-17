import { ParamProps } from "@/libs/_general/props/param-props";
import AuthMainSectionBase from "../../_components/auth-main-section-base";
import UpdatePasswordForm from "./_components/update-password-form";
import { Param } from "@/libs/_general/enums/param";
import { notFound, redirect } from "next/navigation";
import { UserExcludePasswordWithRole } from "@/libs/user/models/user-dao";
import { verifyToken } from "@/libs/_general/managers/jwt-manager";
import { getUsersWithRoleService } from "@/libs/user/services/get-users-with-role-service";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

const getUser = async (token: string): Promise<UserExcludePasswordWithRole | undefined> => {
  const payload = await verifyToken(token)
  if (!payload) return;

  const user = await getUsersWithRoleService(payload.userId)
  return handleGetResponse(user, redirect, [])[0];
}

type Props = ParamProps<{
  [Param.TOKEN]: string;
}>

export default async function UpdatePasswordPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;
  const token = awaitedParams[Param.TOKEN];
  if (!token) notFound();

  // Verify user
  const user = await getUser(token)
  if (!user) notFound();

  return (
    <AuthMainSectionBase
      title='更新密碼'
      description='電子郵件地址驗證成功，請輸入新密碼。'
    >
      <UpdatePasswordForm
        token={token}
        email={user.email}
      />
    </AuthMainSectionBase>
  )
}