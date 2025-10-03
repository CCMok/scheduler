import QueryTab from '@/components/_general/tab/query-tab';
import { BreadcrumbItem } from "@/libs/share/_general/models/breadcrumb-item";
import { Tab } from "@/libs/share/_general/models/tab";
import SidebarInsetLayout from '../sidebar-inset/sidebar-inset-layout';

type Props = {
  breadcrumbItems?: BreadcrumbItem[];
  tabs?: Tab[];
}

export default function QueryTabLayout({
  breadcrumbItems,
  tabs,
}: Readonly<Props>) {
  return (
    <SidebarInsetLayout
      breadcrumbItems={breadcrumbItems}
    >
      {tabs && <QueryTab tabs={tabs} />}
    </SidebarInsetLayout>
  )
}