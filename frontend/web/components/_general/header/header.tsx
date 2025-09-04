'use client'

import { Separator } from "@/external/shadcn/components/ui/separator";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ChevronLeft } from "lucide-react";
import CustomButton from "../button/custom-button";
import { useRouter } from "next/navigation";

type Props = ChildrenProps & {
  isBack?: boolean;
}

export default function Header({
  children,
  isBack = true,
}: Readonly<Props>) {
  const router = useRouter();

  const onClick = () => router.back();

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 min-h-9">
        {isBack && (
          <CustomButton size='icon' variant='ghost' onClick={onClick}>
            <ChevronLeft />
          </CustomButton>
        )}
        {children}
      </div>
      <Separator />
    </div>
  )
}