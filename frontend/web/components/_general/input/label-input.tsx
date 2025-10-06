import { Label } from "@/external/shadcn/components/ui/label";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ReactNode } from "react";

type Props = ChildrenProps & {
  label?: ReactNode;
  htmlFor?: string;
}

export default function LabelInput({
  children,
  label,
  htmlFor,
}: Readonly<Props>) {
  return (
    <div className='space-y-2'>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}