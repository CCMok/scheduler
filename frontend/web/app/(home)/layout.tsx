import { ThemeToggle } from "@/components/_general/button/theme-toggle"
import { Meteors } from "@/external/shadcn/components/ui/meteors"
import { ChildrenProps } from "@/libs/share/_general/props/children-props"

type Props = ChildrenProps

export default function HomeLayout({
  children
}: Readonly<Props>) {
  return (
    <div className="relative">
      <div className="absolute h-[500px] w-full overflow-hidden pointer-events-none">
        <Meteors />
      </div>
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>
      {children}
    </div>
  )
}