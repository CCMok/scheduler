import ThemeToggle from "@/components/_general/theme/theme-toggle";
import { Meteors } from "@/external/shadcn/components/ui/meteors"
import { ReactNode } from "react";

export default function HomeLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="relative">
      <div className="absolute h-[500px] w-full overflow-hidden pointer-events-none">
        <Meteors />
      </div>
      <div className='absolute bottom-4 left-4'>
        <ThemeToggle />
      </div>
      {children}
    </div>
  )
}