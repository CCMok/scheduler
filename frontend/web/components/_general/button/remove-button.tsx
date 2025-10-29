import { Minus } from "lucide-react";
import CustomButton from "./custom-button";
import { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof CustomButton>, 'children'>

export default function RemoveButton(props: Readonly<Props>) {
  return (
    <CustomButton
      variant='secondary'
      {...props}
    >
      <>
        <Minus />
        移除
      </>
    </CustomButton>
  )
}