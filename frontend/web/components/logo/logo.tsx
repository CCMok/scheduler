import { cn } from "@/external/shadcn/libs/utils";
import { Path } from "@/libs/share/_general/enums/path";
import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { Leckerli_One } from "next/font/google";
import Link from "next/link";

const leckerliOne = Leckerli_One({ weight: '400', subsets: ["latin"] });

type Props = ClassNameProps & {
  isRedirectHome?: boolean;
}

export default function Logo({
  className,
  isRedirectHome = true,
}: Readonly<Props>) {
  return (
    <Link
      href={Path.HOME}
      className={cn(
        'space-x-2 flex items-center',
        !isRedirectHome && 'pointer-events-none',
        className,
      )}
      aria-disabled={isRedirectHome ? undefined : true}
      tabIndex={-1}
    >
      <span className={`${leckerliOne.className} text-2xl`}>
        S
      </span>
      <span className={`font-medium text-lg`}>
        Scheduler
      </span>
    </Link>
  )
}