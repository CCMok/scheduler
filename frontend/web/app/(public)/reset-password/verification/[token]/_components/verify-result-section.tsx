import CustomLink from "@/components/_general/_custom/link/custom-link";
import { VerifyState } from "./verify-state";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import { ROUTE } from "@/libs/_general/route/route-config";

export default function VerifyResultSection({
  verifyState,
}: Readonly<{
  verifyState: VerifyState;
  verifyMessage?: string;
}>) {
  if (verifyState !== VerifyState.FAIL) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <CustomButton asChild>
        <CustomLink href={ROUTE.public.resetPassword.base}>返回</CustomLink>
      </CustomButton>
    </div>
  );
}
