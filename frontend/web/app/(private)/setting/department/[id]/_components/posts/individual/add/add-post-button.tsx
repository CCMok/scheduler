import CustomButton from "@/components/button/custom-button";
import { Plus } from "lucide-react";

export default function AddPostButton() {
  return (
    <CustomButton>
      <Plus />
      新增
    </CustomButton>
  )
}