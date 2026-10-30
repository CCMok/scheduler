'use client'

import AuthPageShell from "@/components/_general/auth/auth-page-shell";
import AuthMessageShell from "@/components/_general/auth/auth-message-shell";
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

  if (verifyState === VerifyState.SUCCESS && user) {
    return (
      <AuthPageShell>
        <UpdatePasswordCard user={user} token={token} />
      </AuthPageShell>
    );
  }

  return (
    <AuthMessageShell title="密碼重設">
      <VerifyResultSection
        verifyState={verifyState}
        verifyMessage={verifyMessage}
      />
    </AuthMessageShell>
  );
}