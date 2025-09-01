import { ReactNode } from "react";
import BackHeader from "../header/back-header";

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