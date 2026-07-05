import { cn } from "@/external/shadcn/libs/utils";
import { Leckerli_One } from "next/font/google";
import CustomLink from "../_custom/link/custom-link";
import { ROUTE } from "@/libs/_general/route/route-config";

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
      href={ROUTE.public.home}
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