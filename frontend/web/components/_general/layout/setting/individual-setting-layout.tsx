import BreadcrumbHeader from '@/components/_general/header/breadcrumb-header';
import QueryTab from '@/components/_general/tab/query-tab';
import { BreadcrumbItem } from "@/libs/share/_general/models/breadcrumb-item";
import { Tab } from "@/libs/share/_general/models/tab";

type Props = {
  title?: string;
  breadcrumbItems?: BreadcrumbItem[];
  tabs?: Tab[];
}

export default function IndividualSettingLayout({
  title,
  breadcrumbItems,
  tabs,
}: Readonly<Props>) {
  return (
    <div className='space-y-4'>
      <BreadcrumbHeader
        breadcrumbItems={breadcrumbItems}
        current={title}
      />
      {tabs && <QueryTab tabs={tabs} />}
    </div>
  )
}