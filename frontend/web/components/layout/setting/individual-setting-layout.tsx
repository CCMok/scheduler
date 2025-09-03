import BackHeader from "@/components/header/back-header";
import CustomTab from "@/components/tab/custom-tab";
import { Tab } from "@/libs/share/_general/models/tab";

type Props = {
  title?: string;
  tabs?: Tab[];
}

export default function IndividualSettingLayout({
  title,
  tabs,
}: Readonly<Props>) {
  return (
    <div className='space-y-4'>
      <BackHeader>
        <span>{title}</span>
      </BackHeader>
      {tabs && <CustomTab tabs={tabs} />}
    </div>
  )
}