import BackHeader from "@/components/header/back-header";
import { ReactNode } from "react";

type Props = {
  title?: string;
  updateNameSection?: ReactNode;
  otherSection?: ReactNode;
}

export default function IndividualSettingLayout({
  title,
  updateNameSection,
  otherSection,
}: Readonly<Props>) {
  return (
    <div className='space-y-4'>
      <BackHeader>
        <span>{title}</span>
      </BackHeader>
      {updateNameSection}
      {otherSection}
    </div>
  )
}