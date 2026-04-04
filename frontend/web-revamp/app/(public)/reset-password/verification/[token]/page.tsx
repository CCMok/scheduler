'use client'

import Logo from "@/components/_general/logo/logo";
import { notFound, useParams } from "next/navigation";
import { Param } from "./_components/param";
import { useEffect, useRef, useState } from "react";
import { resetPasswordVerifyTokenAction } from "@/libs/auth/reset-password/verify-token/reset-password-verify-token-action";
import CustomLink from "@/components/_general/_custom/link/custom-link";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import { ROUTE } from "@/libs/_general/route/route-config";
import UpdatePasswordCard from "./_components/update-password-card";
import { UserOmitPassword } from "@/libs/user/user";

enum VerifyState {
  VERIFYING,
  SUCCESS,
  FAIL,
}

export default function ResetPasswordVerificationTokenPage() {
  const { token } = useParams<Param>();
  if (!token) notFound();

  const renderedRef = useRef(false);

  const [verifyState, setVerifyState] = useState<VerifyState>(VerifyState.VERIFYING);
  const [verifyMessage, setVerifyMessage] = useState<string>('');
  const [user, setUser] = useState<UserOmitPassword | undefined>();

  useEffect(() => {
    if (renderedRef.current) return;
    renderedRef.current = true;

    (async () => {
      const response = await resetPasswordVerifyTokenAction({ token })
      if (!response.isSuccess) {
        setVerifyState(VerifyState.FAIL);
        setVerifyMessage(response.message);
        return;
      }

      setVerifyState(VerifyState.SUCCESS);
      setVerifyMessage('');
      setUser(response.data);
    })()
  }, [])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Logo />
      <div className='text-center px-8 mt-4 mb-6'>
        <h1 className='text-4xl font-bold'>密碼重設</h1>
        <p className='text-lg text-secondary-foreground mt-4'>
          {verifyState === VerifyState.VERIFYING && '正在驗證...'}
          {verifyState === VerifyState.FAIL && verifyMessage}
          {verifyState === VerifyState.SUCCESS && '電郵驗證成功'}
        </p>
      </div>
      {verifyState === VerifyState.FAIL && (
        <CustomButton asChild>
          <CustomLink href={ROUTE.public.resetPassword.base}>
            返回
          </CustomLink>
        </CustomButton>
      )}
      {verifyState === VerifyState.SUCCESS && (
        <UpdatePasswordCard />
      )}
    </div>
  )
}