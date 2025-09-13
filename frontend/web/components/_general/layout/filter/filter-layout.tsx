import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ReactNode } from "react";

type Props = ChildrenProps & {
  button?: ReactNode;
};

export default function FilterLayout({
  children,
  button,
}: Readonly<Props>) {
  return (
    <div className='flex items-end gap-2'>
      <div className='flex-1 flex gap-4'>
        {children}
      </div>
      <div className='flex gap-2'>
        {button}
      </div>
    </div>
  )
}