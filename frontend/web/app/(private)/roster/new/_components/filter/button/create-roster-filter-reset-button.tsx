import CustomButton from "@/components/_general/button/custom-button";
import { BrushCleaning } from "lucide-react";
import { useFormContext } from "react-hook-form";

export default function CreateRosterFilterResetButton() {
  const { reset } = useFormContext()

  const onClick = () => reset()

  return (
    <CustomButton variant='secondary' onClick={onClick}>
      <BrushCleaning />
      清除
    </CustomButton>
  )
}