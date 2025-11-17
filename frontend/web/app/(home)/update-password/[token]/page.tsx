import { ParamProps } from "@/libs/_general/props/param-props";
import AuthMainSectionBase from "../../_components/auth-main-section-base";
import UpdatePasswordForm from "./_components/update-password-form";
import { Param } from "@/libs/_general/enums/param";
import { notFound } from "next/navigation";

type Props = ParamProps<{
  [Param.TOKEN]: string;
}>

export default async function UpdatePasswordPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;
  const token = awaitedParams[Param.TOKEN];
  if (!token) notFound();

  return (
    <AuthMainSectionBase
      title='更新密碼'
      description='電子郵件地址驗證成功，請輸入新密碼。'
    >
      <UpdatePasswordForm token={token} />
    </AuthMainSectionBase>
  )
}