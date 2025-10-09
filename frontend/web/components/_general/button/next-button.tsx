import { ChevronRight } from "lucide-react";
import CustomButton from "./custom-button";
import { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof CustomButton>, 'children'>

export default function NextButton(props: Readonly<Props>) {
  return (
    <CustomButton {...props}>
      <>
        <ChevronRight />
        下一步
      </>
    </CustomButton>
  )
}