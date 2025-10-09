import { ChevronLeft } from "lucide-react";
import CustomButton from "./custom-button";
import { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof CustomButton>, 'children'>

export default function BackButton(props: Readonly<Props>) {
  return (
    <CustomButton {...props}>
      <>
        <ChevronLeft />
        上一步
      </>
    </CustomButton>
  )
}