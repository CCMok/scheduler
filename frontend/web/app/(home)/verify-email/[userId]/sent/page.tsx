import { ParamProps } from "@/libs/_general/props/param-props";
import AuthMainSectionBase from "../../../_components/auth-main-section-base";
import { Param } from "@/libs/_general/enums/param";
import { notFound } from "next/navigation";

type Props = ParamProps<{
  [Param.USER_ID]: string;
}>

export default async function VerifyEmailSentPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;
  const userId = Number.parseInt(awaitedParams[Param.USER_ID]);
  if (Number.isNaN(userId)) notFound();

  return (
    <AuthMainSectionBase
      title='驗證電子郵件'
      description='我們已經向您發送了一封驗證電郵，請檢查您的電子郵件。'
    >
      {/* TODO: send again button */}
    </AuthMainSectionBase>
  )
}