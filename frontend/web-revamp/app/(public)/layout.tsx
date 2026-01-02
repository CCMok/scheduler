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
      <div className='absolute top-4 right-4'>
        {/* <ThemeToggle /> */} {/* TODO: Add ThemeToggle */}
      </div>
      {children}
    </div>
  )
}