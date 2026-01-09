import CustomButton from "@/components/_general/_custom/button/custom-button";
import { ChevronLeft } from "lucide-react";
import { ComponentProps } from "react";

export default function BackButton(props: Readonly<ComponentProps<typeof CustomButton>>) {
  return (
    <CustomButton {...props}>
      <ChevronLeft />
      上一步
    </CustomButton>
  )
}