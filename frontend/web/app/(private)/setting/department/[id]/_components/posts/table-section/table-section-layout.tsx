import { ChildrenProps } from "@/libs/share/_general/props/children-props";

type Props = ChildrenProps & {
  title: string;
}

export default function TableSectionLayout({
  children,
  title,
}: Readonly<Props>) {
  return (
    <div className="space-y-4">
      <h1 className='text-base'>{title}</h1>
      {children}
    </div>
  )
}