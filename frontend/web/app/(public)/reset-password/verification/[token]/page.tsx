'use client'

import Logo from "@/components/_general/logo/logo";
import { notFound, useParams } from "next/navigation";
import { Param } from "./_components/param";
import { useEffect, useRef, useState } from "react";
import { resetPasswordVerifyTokenAction } from "@/libs/auth/reset-password/verify-token/reset-password-verify-token-action";
import UpdatePasswordCard from "./_components/update-password-card";
import { UserOmitPassword } from "@/libs/user/user";
import { VerifyState } from "./_components/verify-state";
import VerifyResultSection from "./_components/verify-result-section";

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
  }, [token])

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <Logo />
      {verifyState !== VerifyState.SUCCESS && (
        <VerifyResultSection
          verifyState={verifyState}
          verifyMessage={verifyMessage}
        />
      )}
      {verifyState === VerifyState.SUCCESS && user && (
        <UpdatePasswordCard
          className='w-full max-w-sm mt-2'
          user={user}
          token={token}
        />
      )}
    </div>
  )
}