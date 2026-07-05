'use client'

import CustomButton from "@/components/_general/_custom/button/custom-button";
import { Check } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { Param, ParamKey } from "./param";
import { signUpVerifyTokenAction } from "@/libs/auth/sign-up/verify-token/sign-up-verify-token-action";
import { toast } from "sonner";
import { REDIRECT_PRIVATE_ROUTE } from "@/libs/_general/route/route-config";

export default function SubmitVerifyButton({
  className,
}: Readonly<{
  className?: string;
}>) {
  const router = useRouter()

  const params = useParams<Param>();
  const token = params[ParamKey.TOKEN];
  if (!token) notFound();

  const onClick = async () => {
    const response = await signUpVerifyTokenAction({
      token,
    })
    if (!response.isSuccess) {
      toast.error(response.message)
      return;
    }
    toast.success('驗證電子郵件成功，多謝您的註冊!')
    router.push(REDIRECT_PRIVATE_ROUTE);
  }

  return (
    <CustomButton className={className} onClick={onClick}>
      <Check />
      確認
    </CustomButton>
  )
}