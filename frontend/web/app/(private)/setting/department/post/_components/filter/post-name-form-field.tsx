'use client';

import CustomInput from "@/components/input/custom-input";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
};

export default function PostNameFormField({
  value,
  onValueChange,
}: Readonly<Props>) {
  return (
    <CustomInput
      placeholder="搜尋職位名稱..."
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    />
  );
} 