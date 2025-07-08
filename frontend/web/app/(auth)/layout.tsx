import { ThemeToggle } from "@/components/button/theme-toggle";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import AuthBackdropSection from "./_components/auth-backdrop-section";

export default function AuthLayout({
  children,
}: Readonly<ChildrenProps>) {
  return (
    <div className='flex min-h-screen'>
      <div className='absolute top-4 right-4'>
        <ThemeToggle />
      </div>
      <AuthBackdropSection className='hidden lg:block w-1/2 border-r' />
      <div className='w-full lg:w-1/2'>
        {children}
      </div>
    </div>
  )
}