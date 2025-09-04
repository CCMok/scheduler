import { cn } from "@/external/shadcn/libs/utils";
import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { PATH } from "@/libs/share/_general/utils/path";
import { Leckerli_One } from "next/font/google";
import CustomLink from "../link/custom-link";

const leckerliOne = Leckerli_One({ weight: '400', subsets: ["latin"] });

type Props = ClassNameProps & {
  isRedirectHome?: boolean;
}

export default function Logo({
  className,
  isRedirectHome = true,
}: Readonly<Props>) {
  return (
    <CustomLink
      href={PATH.home}
      isDisabled={!isRedirectHome}
      className={cn(
        'space-x-2 flex items-center',
        className,
      )}
    >
      <span className={`${leckerliOne.className} text-2xl`}>
        S
      </span>
      <span className={`font-medium text-lg`}>
        Scheduler
      </span>
    </CustomLink>
  )
}