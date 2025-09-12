import { ChildrenProps } from "@/libs/share/_general/props/children-props"

type Props = ChildrenProps

export default function InputFullWidthContainer({
  children,
}: Readonly<Props>) {
  return (
    <div className='[&_input]:w-full'>
      {children}
    </div>
  )
}