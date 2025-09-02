import { ChildrenProps } from "@/libs/share/_general/props/children-props";

type Props = ChildrenProps;

export default function FilterLayout({
  children,
}: Readonly<Props>) {
  return (
    <div className='flex gap-4'>
      {children}
    </div>
  )
}