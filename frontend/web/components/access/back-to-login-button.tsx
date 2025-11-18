import CustomButton from "@/components/_general/button/custom-button";
import { PATH } from "@/libs/_general/enums/path";
import Link from "next/link";

export default function BackToLoginButton() {
  return (
    <CustomButton asChild>
      <Link href={PATH.login}>
        返回登入
      </Link>
    </CustomButton>
  )
}