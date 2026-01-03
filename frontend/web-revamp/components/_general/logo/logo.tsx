import { cn } from "@/external/shadcn/libs/utils";
import { Leckerli_One } from "next/font/google";
import CustomLink from "../link/custom-link";
import { Path } from "@/libs/_general/path/path";

const leckerliOne = Leckerli_One({ weight: '400', subsets: ["latin"] });

export default function Logo({
  className,
  isRedirectHome = true,
}: Readonly<{
  className?: string;
  isRedirectHome?: boolean;
}>) {
  return (
    <CustomLink
      href={Path.HOME}
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