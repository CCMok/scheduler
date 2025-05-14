import { ClassNameProps } from "@/libs/share/props/class-name-props";
import { Leckerli_One } from "next/font/google";

const leckerliOne = Leckerli_One({ weight: '400', subsets: ["latin"] });

export default function Logo({
  className,
}: Readonly<ClassNameProps>) {
  return (
    <p className={`space-x-2 flex items-center ${className}`}>
      <span className={`${leckerliOne.className} text-2xl`}>
        S
      </span>
      <span className={`font-medium text-lg`}>
        Scheduler
      </span>
    </p>
  )
}