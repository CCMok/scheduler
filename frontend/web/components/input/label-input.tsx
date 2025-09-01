import { Label } from "@/external/shadcn/components/ui/label";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";

type Props = ChildrenProps & {
  label: string;
}

export default function LabelInput({
  children,
  label,
}: Readonly<Props>) {
  return (
    <div className='space-y-2'>
      <Label>{label}</Label>
      {children}
    </div>
  )
}