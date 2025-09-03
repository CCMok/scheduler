import BackHeader from "@/components/header/back-header";
import QueryTab from "@/components/tab/query-tab";
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
        {/* TODO: fix back header will back the query tab */}
        <span>{title}</span>
      </BackHeader>
      {tabs && <QueryTab tabs={tabs} />}
    </div>
  )
}