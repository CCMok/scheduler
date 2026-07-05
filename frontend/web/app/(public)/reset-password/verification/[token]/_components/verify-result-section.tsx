import CustomLink from "@/components/_general/_custom/link/custom-link";
import { VerifyState } from "./verify-state";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import { ROUTE } from "@/libs/_general/route/route-config";

export default function VerifyResultSection({
  verifyState,
  verifyMessage,
}: Readonly<{
  verifyState: VerifyState;
  verifyMessage?: string;
}>) {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='text-center px-8 mt-4 mb-6'>
        <h1 className='text-4xl font-bold'>密碼重設</h1>
        <p className='text-lg text-secondary-foreground mt-4'>
          {verifyState === VerifyState.VERIFYING && '正在驗證...'}
          {verifyState === VerifyState.FAIL && verifyMessage}
        </p>
      </div>
      {verifyState === VerifyState.FAIL && (
        <CustomButton asChild>
          <CustomLink href={ROUTE.public.resetPassword.base}>
            返回
          </CustomLink>
        </CustomButton>
      )}
    </div>
  )
}