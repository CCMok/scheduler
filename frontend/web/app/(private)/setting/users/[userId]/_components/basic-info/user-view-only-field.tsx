import CustomInput from "@/components/_general/input/custom-input";
import LabelInput from "@/components/_general/input/label-input";
import { ComponentProps, ReactNode } from "react";

type Props = ComponentProps<typeof CustomInput> & {
  label?: ReactNode;
  id: string;
}

export default function UserViewOnlyField({
  label,
  id,
  ...props
}: Readonly<Props>) {
  return (
    <LabelInput
      label={label}
      htmlFor={id}
    >
      <CustomInput
        {...props}
        disabled
      />
    </LabelInput>
  )
}